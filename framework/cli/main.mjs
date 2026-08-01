import { readFile } from "node:fs/promises";
import { deserialize } from "node:v8";
import { basename, isAbsolute, relative, resolve } from "node:path";
import { parseArguments, requiredOption, numberOption, optionList } from "./args.mjs";
import { helpText } from "./help.mjs";
import { findProjectRoot, resolveAgentRoot, resolveTaskRoot } from "../tools/project-resolver.mjs";
import { createAgent, createTask, cleanRuns, acquireWriteLock } from "../tools/workspace.mjs";
import { loadAgent, loadTask, resolveRuntime, importFresh } from "../tools/module-loader.mjs";
import { buildContext, describeContext, buildReviewBundle } from "../tools/context-builder.mjs";
import { CodexAdapter } from "../tools/coding-agent.mjs";
import { executeTask, prepareExecution, runCircuit, runAbstract, runSymbolic, executeQueryModule, verifyTaskAnchors } from "../tools/executor.mjs";
import { runTests } from "../tools/test-runner.mjs";
import { ingestTaskSources, loadSourceRegistry, sourceOutline, showSource, searchSource, sourceFileInfo } from "../tools/source-tools.mjs";
import { sdkCatalog, ontologyCatalog, circuitCatalog, responseCircuitCatalog, profileResolutionCatalog, projectMap } from "../tools/catalogs.mjs";
import { checkOntologies, generateOntologyFacade } from "../tools/ontology-tools.mjs";
import { atomicWrite, exists } from "../tools/filesystem.mjs";
import { renderCanonicalCNL, parseCanonicalCNL, frameProjection } from "../sdk/cnl/grammar.mjs";
import { runEvaluationSuite } from "../evaluation/runner.mjs";
import { explainPlan } from "../runtime/planner/explain.mjs";
import { checkSdkSurfaces, sdkUsage } from "../sdk/public-api.mjs";
import { runAdaptiveAuthoring } from "../tools/adaptive-authoring.mjs";
import { defaultResponseCircuits } from "../runtime/response/default-circuits.mjs";

function projection(value, seen = new Set()) {
  if (value === null || value === undefined || ["string", "number", "boolean"].includes(typeof value)) return value;
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "function") return `[function ${value.name || "anonymous"}]`;
  if (typeof value?.identity === "function") return value.identity();
  if (seen.has(value)) return "[cycle]"; seen.add(value);
  let projected;
  if (Array.isArray(value)) projected = value.map((item) => projection(item, seen));
  else if (value instanceof Map) projected = Object.fromEntries([...value].map(([key, item]) => [String(key), projection(item, seen)]));
  else if (value instanceof Set) projected = [...value].map((item) => projection(item, seen));
  else projected = Object.fromEntries(Object.entries(value).filter(([key]) => !["implementation", "evaluator"].includes(key)).map(([key, item]) => [key, projection(item, seen)]));
  seen.delete(value); return projected;
}
function formatted(value) { return typeof value === "string" ? value : `${JSON.stringify(projection(value), null, 2)}\n`; }
function id(value) { return value?.id ?? (typeof value?.identity === "function" ? value.identity() : value?.identity) ?? String(value); }
function selectionOptions(options) { return { profileId: options.profile, allCompatible: Boolean(options["all-compatible"]), domains: optionList(options, "domain"), excludeDomains: optionList(options, "exclude-domain"), checks: optionList(options, "check"), excludeChecks: optionList(options, "exclude-check"), only: Boolean(options.only), intentText: typeof options.intent === "string" ? options.intent : null }; }
function resolvedResponseCircuits(runtime) {
  return [...new Map([...defaultResponseCircuits, ...runtime.responseCircuits].map((circuit) => [circuit.identity, circuit])).values()];
}

async function roots(projectRoot, options, { task = false, agent = true, allowMissingAgent = false, allowMissingTask = false } = {}) {
  const agentRoot = agent ? await resolveAgentRoot(projectRoot, options, { allowMissing: allowMissingAgent }) : null;
  const taskRoot = task ? await resolveTaskRoot(agentRoot, options, { allowMissing: allowMissingTask }) : null;
  return { agentRoot, taskRoot };
}

async function codingCommand(projectRoot, phase, options) {
  const taskRequired = ["intent", "longtext"].includes(phase);
  const selected = await roots(projectRoot, options, {
    task: taskRequired || Boolean(options.task || options["task-dir"])
  });
  const lock = await acquireWriteLock(selected.taskRoot ?? selected.agentRoot);
  try {
    const context = phase === "review"
      ? await buildReviewBundle({
        projectRoot,
        ...selected,
        diagnosticsPath: options.diagnostics ? resolve(options.diagnostics) : null,
        goal: typeof options.goal === "string" ? options.goal : null
      })
      : await buildContext({
        projectRoot,
        ...selected,
        phase,
        profileId: options.profile,
        goal: typeof options.goal === "string" ? options.goal : null,
        selection: selectionOptions(options),
        allowRuntimeFailure: Boolean(options.tolerateRuntimeFailure)
      });
    if (options["prepare-only"]) {
      return `${await describeContext(context.runRoot)}Prepared only; coding agent was not invoked.\n`;
    }
    const adapter = new CodexAdapter({ executable: options["coding-agent"] ?? "codex" });
    const result = await adapter.run({
      projectRoot,
      workingDirectory: selected.taskRoot ?? selected.agentRoot,
      runRoot: context.runRoot,
      model: options.model ?? null,
      resume: options.resume ?? null
    });
    if (result.exitCode !== 0) {
      throw Object.assign(
        new Error(`CODING_AGENT_FAILED: exit ${result.exitCode}; see ${result.stderrPath}`),
        { exitCode: 4 }
      );
    }
    const record = Object.freeze({
      phase,
      adapter: result.adapterId,
      exitCode: result.exitCode,
      runPath: relative(projectRoot, context.runRoot),
      stdoutPath: relative(projectRoot, result.stdoutPath),
      stderrPath: relative(projectRoot, result.stderrPath),
      finalResponsePath: relative(projectRoot, result.summaryPath),
      startedAt: result.startedAt,
      finishedAt: result.finishedAt
    });
    if (options.returnRecord) return record;
    return `Coding run completed: ${context.runRoot}\nFinal response: ${result.summaryPath}\n`;
  } finally { await lock.release(); }
}

async function agentCommand(projectRoot, action, options) {
  if (action === "create") { const name = requiredOption(options, "agent"); return `Created agent: ${await createAgent(projectRoot, name, { profile: options.profile ?? "general-broad" })}\n`; }
  const { agentRoot } = await roots(projectRoot, options); const agent = await loadAgent(agentRoot);
  if (action === "show") return formatted(agent);
  const runtime = await resolveRuntime({ projectRoot, agentRoot, ...selectionOptions(options) });
  if (action === "check") { const diagnostics = await checkOntologies(runtime.ontologies); return formatted({ valid: diagnostics.length === 0, agent: agent.id, profile: runtime.profile.id, packs: runtime.packs.map(id), diagnostics }); }
  if (action === "catalog") return `${profileResolutionCatalog(runtime)}\n${ontologyCatalog(runtime.ontologies)}\n${circuitCatalog(runtime.circuits)}\n${responseCircuitCatalog(resolvedResponseCircuits(runtime))}`;
  throw new Error(`USAGE_UNKNOWN_AGENT_ACTION: ${action}`);
}

async function taskCommand(projectRoot, action, options) {
  const { agentRoot } = await roots(projectRoot, options);
  if (action === "create") { const result = await createTask(agentRoot, { projectRoot, sourcePath: requiredOption(options, "source"), title: options.title, instruction: options.instruction, profile: options.profile }); return `Task ID: ${result.id}\nTask root: ${result.root}\n`; }
  const taskRoot = await resolveTaskRoot(agentRoot, options);
  if (action === "show") return formatted(await loadTask(taskRoot));
  if (action === "sources") return formatted(await sourceFileInfo(taskRoot));
  if (action === "clean-runs") return `Removed ${((await cleanRuns(taskRoot))).length} run directories.\n`;
  throw new Error(`USAGE_UNKNOWN_TASK_ACTION: ${action}`);
}

async function executionCommand(projectRoot, command, options) {
  if (options["author-adaptive"] && options["author-missing"]) {
    throw new Error("USAGE_AUTHORING_MODE_CONFLICT: choose --author-adaptive or --author-missing, not both");
  }
  const selected = await roots(projectRoot, options, { task: true });
  const checks = optionList(options, "check");
  if (command === "generate") checks.push(requiredOption(options, "output"));
  const common = {
    projectRoot,
    ...selected,
    profileId: options.profile,
    allCompatible: Boolean(options["all-compatible"]),
    domains: optionList(options, "domain"),
    excludeDomains: optionList(options, "exclude-domain"),
    checks,
    excludeChecks: optionList(options, "exclude-check"),
    only: Boolean(options.only),
    intentText: typeof options.intent === "string" ? options.intent : null,
    assurance: options.assurance ?? null
  };
  let adaptive = null;
  if (command === "analyze" && options["author-adaptive"]) {
    const maxReviewCycles = numberOption(options, "authoring-cycles", 3);
    if (!Number.isInteger(maxReviewCycles) || maxReviewCycles < 1 || maxReviewCycles > 10) {
      throw new Error("USAGE_AUTHORING_CYCLES_RANGE: --authoring-cycles must be an integer from 1 through 10");
    }
    const assurance = options.assurance ?? "all";
    if (!["none", "abstract", "symbolic", "all"].includes(assurance)) {
      throw new Error("USAGE_ASSURANCE_VALUE: use none, abstract, symbolic, or all");
    }
    adaptive = await runAdaptiveAuthoring({
      projectRoot,
      ...selected,
      executionOptions: { ...common, assurance },
      maxReviewCycles,
      allowUnknown: Boolean(options["adaptive-allow-unknown"]),
      assurance,
      authorPhase: (phase, goal, diagnosticsPath = null) => codingCommand(projectRoot, phase, {
        ...options,
        returnRecord: true,
        tolerateRuntimeFailure: true,
        goal,
        ...(diagnosticsPath ? { diagnostics: diagnosticsPath } : {})
      })
    });
  }
  if (command === "analyze" && options["author-missing"]) {
    let runtime = await resolveRuntime(common);
    if (!runtime.intent) { await codingCommand(projectRoot, "intent", options); runtime = await resolveRuntime(common); }
    if (runtime.longTexts.length === 0) { await codingCommand(projectRoot, "longtext", options); runtime = await resolveRuntime(common); }
    if (checks.some((check) => runtime.registry.providersFor(check).length === 0)) await codingCommand(projectRoot, "circuit", options);
  }
  if (command === "run" || command === "analyze" || command === "generate") {
    const result = adaptive?.execution ?? await executeTask(common);
    const format = options.format ?? "response";
    if (!new Set(["response", "json"]).has(format)) {
      throw new Error("USAGE_OUTPUT_FORMAT: --format must be response or json");
    }
    if (format === "response") return result.response;
    return formatted({
      task: result.runtime.task.id,
      profile: result.runtime.profile.id,
      circuits: result.executions.map((entry) => entry.circuit.id),
      findings: result.findings.map((entry) => ({
        code: entry.code(),
        status: entry.status(),
        evidence: [...entry.evidence()].map(id)
      })),
      frames: result.frames.map(frameProjection),
      assurance: result.assurance.map((entry) => ({
        circuit: entry.circuit,
        method: entry.method
      })),
      diagnostics: result.diagnostics,
      resultsRoot: result.resultsRoot,
      response: resolve(result.resultsRoot, "response.md"),
      ...(adaptive ? { adaptiveAuthoring: adaptive.record } : {})
    });
  }
  if (command === "plan") { const result = await prepareExecution(common); return options.explain || options["explain-plan"] ? explainPlan({ intent: result.runtime.intent, profile: { profile: result.runtime.profile.id, packs: result.runtime.packs, reasons: new Map() }, plan: result.plan }) : formatted(result.plan); }
  if (command === "query") { const expression = requiredOption(options, "expression"); const path = isAbsolute(expression) ? expression : resolve(selected.taskRoot, expression); return formatted(await executeQueryModule(common, path)); }
  throw new Error(`USAGE_UNKNOWN_EXECUTION_COMMAND: ${command}`);
}

async function contextCommand(projectRoot, action, options) {
  if (action === "show") return describeContext(requiredOption(options, "run"));
  const selected = await roots(projectRoot, options, { task: Boolean(options.task || options["task-dir"]) });
  if (action === "build") { const context = await buildContext({ projectRoot, ...selected, phase: options.phase ?? "architect", profileId: options.profile, selection: selectionOptions(options) }); return describeContext(context.runRoot); }
  throw new Error(`USAGE_UNKNOWN_CONTEXT_ACTION: ${action}`);
}

async function sourceCommand(projectRoot, action, options) {
  const selected = await roots(projectRoot, options, { task: true });
  if (action === "ingest") return formatted(await ingestTaskSources(selected.taskRoot, { projectRoot }));
  const registry = await loadSourceRegistry(selected.taskRoot, { projectRoot });
  if (action === "outline") return sourceOutline(registry);
  if (action === "show") return `${showSource(registry, { sourceId: options.source, unitId: options.unit, start: numberOption(options, "start"), end: numberOption(options, "end") })}\n`;
  if (action === "search") return formatted(searchSource(registry, requiredOption(options, "text"), { caseSensitive: Boolean(options["case-sensitive"]) }));
  if (action === "span") { const sourceId = options.source ?? registry.all()[0]?.id; const source = registry.source(sourceId); if (!source) throw new Error(`SOURCE_NOT_FOUND: ${sourceId}`); const phrase = options.text; let start = numberOption(options, "start"); if (phrase && start === null) start = source.text.indexOf(phrase); if (start < 0 || start === null) throw new Error("SOURCE_SPAN_NOT_FOUND"); const end = numberOption(options, "end", start + (phrase?.length ?? 0)); const unit = source.units.find((candidate) => candidate.descriptor().start <= start && candidate.descriptor().end >= end); if (!unit) throw new Error("SOURCE_SPAN_CROSSES_UNIT_BOUNDARY"); return formatted(unit.span(start - unit.descriptor().start, end - unit.descriptor().start)); }
  if (action === "verify-anchors") { const runtime = await resolveRuntime({ projectRoot, ...selected, ...selectionOptions(options) }); return formatted(await verifyTaskAnchors(selected.taskRoot, runtime.longTexts, { projectRoot })); }
  throw new Error(`USAGE_UNKNOWN_SOURCE_ACTION: ${action}`);
}

async function semanticCommand(projectRoot, family, action, options) {
  const needsTask = family !== "ontology" || Boolean(options.task || options["task-dir"]); const selected = await roots(projectRoot, options, { task: needsTask });
  const common = { projectRoot, ...selected, ...selectionOptions(options) };
  const runtime = await resolveRuntime(common);
  if (family === "ontology") {
    if (action === "check") return formatted(await checkOntologies(runtime.ontologies));
    if (action === "build") return `Generated facade: ${await generateOntologyFacade({ projectRoot, ...selected, runtime })}\n`;
    if (action === "show") return ontologyCatalog(runtime.ontologies);
    if (action === "affected") { const target = requiredOption(options, "identity"); return formatted(runtime.circuits.filter((circuit) => circuit.requirements.some((item) => id(item) === target)).map(id)); }
  }
  if (family === "longtext") {
    if (action === "check") return formatted({ models: runtime.longTexts.map((model) => ({ id: model.id, claims: model.claims.length, coverage: model.coverage.length })), anchors: await verifyTaskAnchors(selected.taskRoot, runtime.longTexts, { projectRoot }) });
    if (action === "execute") { const prepared = await prepareExecution(common); return formatted({ store: prepared.store.snapshotId, claims: prepared.store.allClaims().length, coverage: prepared.store.allCoverage().length }); }
    if (action === "coverage") return formatted(runtime.longTexts.flatMap((model) => model.coverage.map((item) => projection(item.descriptor()))));
    if (action === "query") return formatted(await executeQueryModule(common, isAbsolute(requiredOption(options, "expression")) ? options.expression : resolve(selected.taskRoot, options.expression)));
  }
  if (family === "intent") {
    if (action === "check") return formatted({ valid: Boolean(runtime.intent), intent: runtime.intent ? projection(runtime.intent) : null, fallback: runtime.intent?.fallback?.value ?? "profile/all-compatible" });
    if (action === "infer-signals") { const registry = await loadSourceRegistry(selected.taskRoot, { projectRoot }); const text = registry.all().map((source) => source.text).join("\n"); return formatted(runtime.allFrameworkPacks.map((pack) => ({ pack: pack.id, ...pack.recognizes(text) })).filter((item) => item.matched)); }
    if (action === "explain") return profileResolutionCatalog(runtime);
  }
  if (family === "circuit") {
    if (action === "check") return formatted(runtime.circuits.map((circuit) => ({ circuit: circuit.id, valid: circuit.stages.length > 0 && circuit.provisions.length > 0, stages: circuit.stages.length })));
    if (action === "plan") return formatted((await prepareExecution(common)).plan);
    const circuitId = requiredOption(options, "circuit");
    if (action === "run") return formatted(await runCircuit(common, circuitId));
    if (action === "abstract") return formatted(await runAbstract(common, circuitId));
    if (action === "symbolic") return formatted(await runSymbolic(common, circuitId));
  }
  throw new Error(`USAGE_UNKNOWN_${family.toUpperCase()}_ACTION: ${action}`);
}

async function traceCommand(action, options) {
  const path = requiredOption(options, "trace"); const events = deserialize(await readFile(path));
  if (action === "slice") { const from = numberOption(options, "from", 0); const to = numberOption(options, "to", Number.MAX_SAFE_INTEGER); return formatted(events.filter((event) => event.index >= from && event.index <= to && (!options.kind || event.kind === options.kind))); }
  if (action === "explain") return formatted({ path, events: events.length, kinds: Object.fromEntries([...new Set(events.map((event) => event.kind))].map((kind) => [kind, events.filter((event) => event.kind === kind).length])), first: events[0], last: events.at(-1) });
  if (action === "compare") { const right = deserialize(await readFile(requiredOption(options, "right"))); return formatted({ leftEvents: events.length, rightEvents: right.length, same: JSON.stringify(events) === JSON.stringify(right), firstDifference: events.findIndex((event, index) => JSON.stringify(event) !== JSON.stringify(right[index])) }); }
  throw new Error(`USAGE_UNKNOWN_TRACE_ACTION: ${action}`);
}

async function cnlCommand(action, options) {
  if (action === "render") { const value = (await importFresh(requiredOption(options, "module"))).default; return `${(Array.isArray(value) ? value : [value]).map(renderCanonicalCNL).join("\n\n")}\n`; }
  const text = options.text ?? await readFile(requiredOption(options, "file"), "utf8"); const frame = parseCanonicalCNL(text);
  if (action === "parse") return formatted(frameProjection(frame));
  if (action === "roundtrip") { const rendered = renderCanonicalCNL(frame); return formatted({ equivalent: JSON.stringify(frameProjection(frame)) === JSON.stringify(frameProjection(parseCanonicalCNL(rendered))), rendered }); }
  throw new Error(`USAGE_UNKNOWN_CNL_ACTION: ${action}`);
}

async function catalogCommand(projectRoot, action, options) {
  if (action === "sdk") return sdkCatalog();
  const selected = await roots(projectRoot, options, { task: Boolean(options.task || options["task-dir"]) }); const runtime = await resolveRuntime({ projectRoot, ...selected, ...selectionOptions(options) });
  if (action === "ontology") return ontologyCatalog(runtime.ontologies);
  if (action === "circuit") return circuitCatalog(runtime.circuits);
  if (["response", "response-circuit"].includes(action)) return responseCircuitCatalog(resolvedResponseCircuits(runtime));
  throw new Error(`USAGE_UNKNOWN_CATALOG: ${action}`);
}

function sdkCommand(action, options) {
  if (action === "check") return formatted(checkSdkSurfaces());
  if (action === "usage") return sdkUsage(options.surface ?? null);
  throw new Error(`USAGE_UNKNOWN_SDK_ACTION: ${action}`);
}

async function evaluateCommand(projectRoot, options) {
  const suiteName = requiredOption(options, "suite"); const candidates = [resolve(suiteName), resolve(projectRoot, "evaluations", suiteName, "suite.mjs"), resolve(projectRoot, "examples", "evaluations", suiteName, "suite.mjs")];
  let selected = null; for (const candidate of candidates) if (await exists(candidate)) { selected = candidate; break; }
  if (!selected) throw new Error(`EVALUATION_SUITE_NOT_FOUND: ${suiteName}`);
  const result = await runEvaluationSuite({
    projectRoot,
    suitePath: selected,
    invokeAgent: Boolean(options["invoke-agent"]),
    replayRetained: Boolean(options["replay-retained"]),
    model: options.model ?? null
  });
  const failed = result.results.filter((entry) => entry.status !== "completed");
  if (failed.length > 0) {
    throw new Error(
      `EVALUATION_SUITE_FAILED: ${failed.length}/${result.results.length} task(s) failed; `
      + `see ${resolve(result.evaluationRoot, "reports", "summary.md")}`
    );
  }
  return formatted({ suite: result.suite.id, evaluationRoot: result.evaluationRoot, tasks: result.results.length, completed: result.results.filter((entry) => entry.status === "completed").length, aggregate: result.aggregate });
}

export async function runCli(argv, io = process) {
  const { positionals, options } = parseArguments(argv); const [command, action] = positionals;
  if (!command || command === "help" || options.help) { io.stdout.write(helpText); return 0; }
  try {
    const projectRoot = options["project-root"] ? resolve(options["project-root"]) : await findProjectRoot(); let output;
    if (command === "agent") output = await agentCommand(projectRoot, action, options);
    else if (command === "task") output = await taskCommand(projectRoot, action, options);
    else if (command === "code") output = await codingCommand(projectRoot, action, options);
    else if (["analyze", "generate", "run", "query"].includes(command)) output = await executionCommand(projectRoot, command, options);
    else if (command === "plan") output = await executionCommand(projectRoot, command, action === "show" ? { ...options, explain: true } : options);
    else if (command === "test") {
      const hasAgentSelector = Boolean(options.agent || options["agent-dir"]);
      const hasTaskSelector = Boolean(options.task || options["task-dir"]);
      const needsAgent = ["agent", "task"].includes(action) || hasAgentSelector || hasTaskSelector;
      const needsTask = action === "task" || (action === "all" && hasTaskSelector);
      const selected = needsAgent ? await roots(projectRoot, options, { agent: true, task: needsTask }) : { agentRoot: null, taskRoot: null };
      const result = await runTests({ projectRoot, scope: action ?? "all", ...selected, pack: options.pack, level: options.level ?? "standard" });
      output = `${result.message ?? `Executed ${result.files.length} test files; exit ${result.exitCode}.`}\n`;
      if (result.exitCode) return result.exitCode;
    }
    else if (command === "evaluate") output = await evaluateCommand(projectRoot, options);
    else if (command === "context") output = await contextCommand(projectRoot, action, options);
    else if (command === "files" && action === "index") { const selected = options.agent || options["agent-dir"] ? await roots(projectRoot, options, { task: Boolean(options.task || options["task-dir"]) }) : { agentRoot: projectRoot, taskRoot: null }; output = await projectMap(projectRoot, [selected.agentRoot, ...(selected.taskRoot ? [selected.taskRoot] : [])]); if (options.output) await atomicWrite(resolve(options.output), output); }
    else if (command === "catalog") output = await catalogCommand(projectRoot, action, options);
    else if (command === "sdk") output = sdkCommand(action, options);
    else if (command === "profile" && action === "resolve") { const selected = await roots(projectRoot, options, { task: Boolean(options.task || options["task-dir"]) }); output = profileResolutionCatalog(await resolveRuntime({ projectRoot, ...selected, ...selectionOptions(options) })); }
    else if (command === "source") output = await sourceCommand(projectRoot, action, options);
    else if (["ontology", "longtext", "intent", "circuit"].includes(command)) output = await semanticCommand(projectRoot, command, action, options);
    else if (command === "trace") output = await traceCommand(action, options);
    else if (command === "cnl") output = await cnlCommand(action, options);
    else if (command === "review" && action === "bundle") { const selected = await roots(projectRoot, options, { task: Boolean(options.task || options["task-dir"]) }); const bundle = await buildReviewBundle({ projectRoot, ...selected, diagnosticsPath: options.diagnostics }); output = describeContext(bundle.runRoot); }
    else throw new Error(`USAGE_UNKNOWN_COMMAND: ${positionals.join(" ")}`);
    if (output !== undefined) io.stdout.write(formatted(output)); return 0;
  } catch (error) {
    io.stderr.write(`${error.code ?? "NLL_ERROR"}: ${error.message}\n`);
    if (options.verbose && error.stack) io.stderr.write(`${error.stack}\n`);
    return error.exitCode ?? (String(error.message).startsWith("USAGE_") ? 2 : 3);
  }
}
