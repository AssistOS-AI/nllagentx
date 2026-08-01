import { relative, resolve, sep } from "node:path";
import { listFiles } from "./filesystem.mjs";

function identityOf(value) {
  if (typeof value?.identity === "function") return value.identity();
  if (typeof value?.identity === "string") return value.identity;
  return String(value);
}

function markdownText(value) {
  return String(value ?? "").replaceAll("\0", "").trim();
}

function titleFromCode(code) {
  const local = String(code).split(/[.:]/).at(-1);
  const words = local
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLocaleLowerCase("en");
  return words ? `${words[0].toLocaleUpperCase("en")}${words.slice(1)}` : "Finding";
}

function statusExplanation(status, subject) {
  const clauses = {
    SATISFIED: `The input supports the conclusion “${subject}”.`,
    VIOLATED: `The input does not satisfy the requirement “${subject}”.`,
    CONFLICT: `The input contains mutually incompatible support for “${subject}”.`,
    UNKNOWN: `The available input is insufficient to decide “${subject}”.`,
    POSSIBLE_PROBLEM: `The input indicates a possible problem concerning “${subject}”.`,
    BLOCKED_ONTOLOGY: `The analysis cannot decide “${subject}” because the required ontology is unavailable.`,
    BLOCKED_COVERAGE: `The analysis cannot decide “${subject}” because source coverage is incomplete.`,
    BLOCKED_RESOURCE: `The analysis cannot decide “${subject}” because a required resource is unavailable.`,
    BLOCKED_METHOD: `The analysis cannot decide “${subject}” because a required method is unavailable.`,
    ACCEPTED_EXCEPTION: `The input supports an accepted exception for “${subject}”.`
  };
  return clauses[status] ?? `The result for “${subject}” is ${String(status).toLocaleLowerCase("en")}.`;
}

function recommendation(status, subject) {
  if (status === "VIOLATED") return `Correct the violation and add explicit source support that addresses “${subject}”.`;
  if (status === "CONFLICT") return `Resolve the conflicting statements or add an explicit priority, scope, or exception rule for “${subject}”.`;
  if (status === "UNKNOWN") return `Provide the missing facts or close the relevant source coverage before treating “${subject}” as decided.`;
  if (status.startsWith("BLOCKED_")) return `Add the missing semantic dependency, then rerun the task.`;
  if (status === "POSSIBLE_PROBLEM") return `Review the cited passages and confirm whether corrective action is required.`;
  return null;
}

function semanticChildren(value, store) {
  const children = [];
  if (value?.sort?.() === "SourceSpan") return children;
  if (typeof store?.grounding === "function") children.push(...store.grounding(value));
  if (typeof store?.explain === "function") children.push(...(store.explain(value)?.provenance ?? []));
  if (typeof value?.groundings === "function") children.push(...value.groundings());
  return children;
}

function evidenceSpans(finding, store) {
  const queue = [...finding.evidence()];
  const visited = new Set();
  const spans = new Map();
  while (queue.length > 0) {
    const value = queue.shift();
    const identity = identityOf(value);
    if (visited.has(identity)) continue;
    visited.add(identity);
    if (value?.sort?.() === "SourceSpan") {
      const descriptor = value.descriptor();
      spans.set(`${descriptor.sourceId}:${descriptor.start}:${descriptor.end}`, value);
      continue;
    }
    queue.push(...semanticChildren(value, store));
  }
  return [...spans.values()].sort((left, right) => {
    const a = left.descriptor(); const b = right.descriptor();
    return a.sourceId.localeCompare(b.sourceId) || a.start - b.start || a.end - b.end;
  });
}

function sourceCitation(span, registry) {
  const descriptor = span.descriptor();
  const source = registry.source(descriptor.sourceId);
  if (!source) return null;
  const verification = registry.verify(span);
  if (!verification.valid) return null;
  const text = source.text.slice(descriptor.start, descriptor.end).trim();
  if (!text) return null;
  return Object.freeze({
    sourceId: descriptor.sourceId,
    path: source.path,
    start: descriptor.start,
    end: descriptor.end,
    text
  });
}

function renderQuote(citation) {
  const location = citation.path
    ? `[${citation.sourceId}](../${citation.path})`
    : citation.sourceId;
  const quote = citation.text.split(/\r?\n/).map((line) => `> ${line || " "}`).join("\n");
  return `${quote}\n>\n> — ${location}, characters ${citation.start}–${citation.end}`;
}

function searchTerms(finding) {
  const details = finding.descriptor().details ?? {};
  const values = [
    finding.code(),
    finding.message(),
    ...(details.failedRequirements ?? []),
    ...(details.uncertainRequirements ?? []),
    ...(details.conflictingRequirements ?? [])
  ];
  return new Set(values
    .filter(Boolean)
    .flatMap((value) => String(value).toLocaleLowerCase("en").split(/[^a-z0-9]+/))
    .filter((word) => word.length >= 5)
    .map((word) => word.slice(0, 7)));
}

function rankCitations(citations, finding, limit) {
  if (citations.length <= limit) return citations;
  const terms = searchTerms(finding);
  return citations.map((citation, index) => {
    const text = citation.text.toLocaleLowerCase("en");
    const tokens = new Set(text.split(/[^a-z0-9]+/).filter((word) => word.length >= 5).map((word) => word.slice(0, 7)));
    let score = [...terms].filter((term) => tokens.has(term)).length;
    if (finding.status() === "VIOLATED" && /\b(?:no|not|without|expired|lacks?|missing|failed)\b/i.test(text)) score += 3;
    if (/\b(?:concludes?|conclusion|therefore|must|require)\b/i.test(text)) score += 1;
    return { citation, index, score };
  })
    .sort((left, right) => right.score - left.score || right.index - left.index)
    .slice(0, limit)
    .sort((left, right) => left.index - right.index)
    .map(({ citation }) => citation);
}

function simpleDetail(value) {
  if (["string", "number", "boolean"].includes(typeof value)) {
    const text = String(value);
    if (/^(?:nll\.|circuit:|[a-f0-9]{48,})/.test(text)) return null;
    return text;
  }
  if (Array.isArray(value)) {
    const entries = value.map(simpleDetail).filter(Boolean);
    return entries.length > 0 ? entries.join(", ") : null;
  }
  return null;
}

function renderDetails(finding) {
  const details = finding.descriptor().details ?? {};
  const rows = Object.entries(details)
    .map(([name, value]) => [titleFromCode(name), simpleDetail(value)])
    .filter(([, value]) => value !== null);
  if (rows.length === 0) return "";
  return `\n\nObserved facts:\n\n${rows.map(([name, value]) => `- ${name}: ${value}`).join("\n")}`;
}

function conditionPhrase(rule) {
  if (!rule?.condition) return null;
  const values = {
    IsTrue: "evaluated as supported",
    IsFalse: "evaluated as not supported",
    IsUnknown: "could not be decided from the available evidence",
    IsConflict: "had mutually incompatible evidence"
  };
  return `${titleFromCode(rule.concern)} ${values[rule.condition] ?? `matched ${rule.condition}`}`;
}

function renderRule(rule) {
  if (!rule) return "";
  const condition = conditionPhrase(rule);
  const decision = condition
    ? `The circuit emitted this result because ${condition}.`
    : "The selected circuit emitted this result from its semantic assessment.";
  return `**Rule evaluated:** ${titleFromCode(rule.concern)}  \n**Circuit:** \`${rule.circuit}\`  \n**Decision:** ${decision}`;
}

function renderFinding(entry, store, registry, { group, style, features }) {
  const { finding, rule, tags } = entry;
  const title = titleFromCode(finding.code());
  const subject = titleFromCode(rule?.concern ?? finding.code()).toLocaleLowerCase("en");
  const message = markdownText(finding.message());
  const conclusion = message && message !== finding.code()
    ? message
    : statusExplanation(finding.status(), subject);
  const citations = evidenceSpans(finding, store)
    .map((span) => sourceCitation(span, registry))
    .filter(Boolean);
  const next = recommendation(finding.status(), subject);
  const marker = features.has("stable-tags")
    ? `[CNL:FINDING] [CODE:${finding.code()}] [STATUS:${finding.status()}] [GROUP:${group}] [${tags.has("material") ? "MATERIAL" : "SUPPORTING"}]`
    : "";
  const shownCitations = rankCitations(citations, finding, style === "analytical" ? 10 : style === "concise" ? 2 : 6);
  return [
    marker,
    `### ${title}`,
    "",
    `**Status:** ${finding.status()}`,
    "",
    conclusion,
    features.has("explain-rules") && style !== "concise" ? `\n\n${renderRule(rule)}` : "",
    style === "analytical" || style === "evidence-led" ? renderDetails(finding) : "",
    features.has("quote-evidence") && shownCitations.length > 0
      ? `\n\n**Evidence from the input**\n\n${shownCitations.map(renderQuote).join("\n\n")}`
      : "",
    next ? `\n\n**Next action:** ${next}` : ""
  ].filter(Boolean).join("\n").replace(/\n{3,}/g, "\n\n");
}

function slotText(value) {
  if (value === null || value === undefined) return null;
  if (Array.isArray(value)) return value.map(slotText).filter(Boolean).join("; ");
  if (typeof value?.descriptor === "function") {
    const descriptor = value.descriptor();
    if (Object.hasOwn(descriptor, "value")) return markdownText(descriptor.value);
    if (Object.hasOwn(descriptor, "values")) return descriptor.values.map(slotText).filter(Boolean).join("; ");
    if (typeof value.identity === "function") return value.identity();
  }
  return ["string", "number", "boolean"].includes(typeof value) ? markdownText(value) : null;
}

function renderFrames(frames) {
  const procedure = frames
    .filter((frame) => frame.kind() === "ProcedureStep")
    .map((frame) => ({
      position: Number(slotText(frame.slot("position"))) || Number.MAX_SAFE_INTEGER,
      instruction: slotText(frame.slot("instruction")) ?? slotText(frame.slot("action")),
      condition: slotText(frame.slot("condition")),
      actor: slotText(frame.slot("actor"))
    }))
    .filter((entry) => entry.instruction)
    .sort((left, right) => left.position - right.position);
  if (procedure.length > 0) {
    return [
      "## Generated procedure",
      "",
      ...procedure.map((entry, index) => {
        const qualifiers = [entry.actor ? `Actor: ${entry.actor}.` : null, entry.condition ? `Condition: ${entry.condition}.` : null].filter(Boolean);
        return `${index + 1}. ${entry.instruction}${qualifiers.length ? ` ${qualifiers.join(" ")}` : ""}`;
      })
    ].join("\n");
  }
  const rendered = frames.map((frame) => {
    const slots = ["subject", "claim", "action", "condition", "recommendation", "limitation", "instruction"]
      .map((name) => [name, slotText(frame.slot(name))])
      .filter(([, value]) => value);
    if (slots.length === 0) return null;
    return `### ${frame.kind()}\n\n${slots.map(([name, value]) => `- ${titleFromCode(name)}: ${value}`).join("\n")}`;
  }).filter(Boolean);
  return rendered.length > 0 ? `## Generated content\n\n${rendered.join("\n\n")}` : "";
}

function relativeLink(fromRoot, path) {
  return relative(fromRoot, path).split(sep).join("/");
}

export async function semanticArtifactPaths(taskRoot) {
  const roots = ["intent", "longtext", "ontologies", "circuits", "cnl", "sdk"];
  const paths = [resolve(taskRoot, "task.mjs")];
  for (const root of roots) {
    paths.push(...(await listFiles(resolve(taskRoot, root), {
      include: (path) => path.endsWith(".mjs"),
      exclude: ["results", "runs", "tests", ".git"]
    })));
  }
  return Object.freeze(paths.sort());
}

export async function renderArtifactManifest({ taskRoot, resultsRoot }) {
  const semantic = await semanticArtifactPaths(taskRoot);
  const runs = await listFiles(resolve(taskRoot, "runs"), {
    include: (path) => /\/(?:INSTRUCTIONS\.md|codex\.final\.md|process\.md)$/.test(path),
    exclude: ["skills", "context"]
  });
  const link = (path) => `[${relativeLink(taskRoot, path)}](${relativeLink(resultsRoot, path)})`;
  const semanticRows = semantic.map((path) => `- ${link(path)}`).join("\n") || "No task-local semantic module was present.";
  const runRows = runs.map((path) => `- ${link(path)}`).join("\n") || "No coding-agent authoring run was retained for this task.";
  return `# Task artifact manifest

## Semantic programs

These executable modules define the task, intent, LongTextJS grounding, task-local ontology, semantic and response circuits, and generated SDK facade when present.

${semanticRows}

## Coding-agent authoring evidence

${runRows}

## Technical execution evidence

- [Execution plan](execution-plan.md)
- [Canonical findings](findings.cnl)
- [Canonical observations](observations.cnl)
- [Generated CNL frames](generation-plan.cnl)
- [Executable findings](findings.mjs)
- [Auxiliary assurance summary](assurance.md)
- [Executable auxiliary assurance](assurance.mjs)
- [Diagnostics](diagnostics.md)
- [Coverage](coverage.md)
- [Trace summary](trace-summary.md)
- Binary trace: \`trace.bin\`
`;
}

export async function renderTaskResponse({ runtime, store, composition, diagnostics, sourceRegistry }) {
  const sourceRows = sourceRegistry.all().map((source) => {
    const target = source.path ? `[${source.id}](../${source.path})` : source.id;
    return `- ${target}: ${source.text.length} decoded characters.`;
  });
  const frameSection = renderFrames(composition.generatedFrames);
  const groups = composition.groups.map((group) => {
    const heading = titleFromCode(group.key);
    const count = composition.features.has("count-groups") ? ` (${group.entries.length})` : "";
    const marker = composition.features.has("stable-tags")
      ? `[CNL:GROUP] [KEY:${group.key}] [COUNT:${group.entries.length}]\n\n`
      : "";
    const findings = group.entries.map((entry) => renderFinding(entry, store, sourceRegistry, {
      group: group.key,
      style: composition.style,
      features: composition.features
    })).join("\n\n");
    return `${marker}## ${heading}${count}\n\n${findings}`;
  });
  const answer = groups.length > 0
    ? groups.join("\n\n")
    : "[CNL:NO-MATERIAL-RESULT]\n\nNo applicable semantic finding was produced; non-applicable circuit results were omitted.";
  const uncertainty = diagnostics.length > 0
    ? diagnostics.map((entry) => `- ${entry.code ?? "DIAGNOSTIC"}: ${entry.message ?? entry.capability ?? entry.stage ?? "See technical trace."}`).join("\n")
    : composition.entries.some((entry) => entry.finding.status() === "UNKNOWN")
      ? "At least one conclusion remains unknown; the relevant finding explains what evidence is missing."
      : "No blocking diagnostic was emitted. This statement concerns execution completeness, not the truth of every possible claim outside the selected intent.";
  return `# nllAgent response

[CNL:DOCUMENT] [STYLE:${composition.style}] [GROUPING:${composition.grouping}] [RESULTS:${composition.entries.length}]

Task: \`${runtime.task.id}\`  
Intent: ${runtime.intent?.id ? `\`${runtime.intent.id}\`` : "default compatible analysis"}

${composition.style === "procedural" && frameSection ? `${frameSection}\n\n` : ""}## Answer

${answer}

${composition.style !== "procedural" && frameSection ? `${frameSection}\n\n` : ""}## Input basis

${sourceRows.join("\n") || "No decoded source was available."}

## Limits and uncertainty

${uncertainty}

## Artifacts

This tagged Markdown response is the primary human-facing CNL result. Executable semantic programs and technical evidence are indexed separately in [\`artifacts.md\`](artifacts.md); raw assurance objects and traces are not part of the answer above.
`;
}
