import * as core from "./core/index.mjs";
import * as ontology from "./ontology/index.mjs";
import * as longtext from "./longtext/index.mjs";
import * as circuit from "./circuit/index.mjs";
import * as cnl from "./cnl/index.mjs";
import * as intent from "./intent/index.mjs";
import * as agent from "./agent/index.mjs";
import * as evaluation from "./evaluation/index.mjs";
import * as analysis from "./analysis/index.mjs";

function surface(id, modulePath, purpose, namespace, example) {
  return Object.freeze({
    id,
    modulePath,
    purpose,
    exports: Object.freeze(Object.keys(namespace).sort()),
    example
  });
}

export const sdkSurfaces = Object.freeze([
  surface("core", "framework/sdk/core/index.mjs", "Semantic identities, handles, logic values, collections, provenance, descriptors, and diagnostics.", core,
    "import { TRUE, UNKNOWN, setOf } from \"./framework/sdk/core/index.mjs\";\nconst values = setOf(TRUE, UNKNOWN);"),
  surface("ontology", "framework/sdk/ontology/index.mjs", "OntologyJS kinds, roles, relations, lexicalizations, facts, laws, capabilities, and packs.", ontology,
    "import { ontology, entityKind, capability } from \"./framework/sdk/ontology/index.mjs\";\nconst O = ontology(\"agent.example\", \"1.0.0\");\nexport const Item = O.entity(entityKind(\"Item\").provide(capability(\"Item\")));\nexport default O.seal();"),
  surface("longtext", "framework/sdk/longtext/index.mjs", "Source registries, claims, contexts, alternatives, time, coverage, and LongTextJS documents.", longtext,
    "import { SemanticValue } from \"./framework/sdk/core/index.mjs\";\nimport { describe, section, sequence, claim, groundedAt, sourceUnit } from \"./framework/sdk/longtext/index.mjs\";\nconst term = new SemanticValue(\"Proposition\", \"example\");\nconst unit = sourceUnit(\"source-001:unit-0001\", { sourceId: \"source-001\", text: \"example\", end: 7 });\nexport default describe(\"task\").section(section(\"body\", sequence(claim(term).grounding(groundedAt(unit.span(0, 7)))))).commit();"),
  surface("circuit", "framework/sdk/circuit/index.mjs", "Queries, decision tables, procedural stages, emissions, composition, results, and assurance declarations.", circuit,
    "import { circuit, capability, proceduralStage } from \"./framework/sdk/circuit/index.mjs\";\nconst stage = proceduralStage(\"agent.check.evaluate\").writes(\"Finding\").run(() => []);\nexport default circuit(\"agent.check\", \"1.0.0\").provides(capability(\"CheckResult\")).use(stage).emit({ kind: \"finding-emission\", value: stage }).seal();"),
  surface("cnl", "framework/sdk/cnl/index.mjs", "Typed controlled-language frames, canonical rendering/parsing, response directives, and executable post-semantic response circuits.", cnl,
    "import { findingFrame, literalSlot, renderCanonicalCNL, responseCircuit, responseStage } from \"./framework/sdk/cnl/index.mjs\";\nconst text = renderCanonicalCNL(findingFrame(\"CHECK\").set(\"status\", literalSlot(\"UNKNOWN\")).seal());\nconst policy = responseCircuit(\"agent.presentation\").use(responseStage(\"retain\", (state) => state)).seal();"),
  surface("intent", "framework/sdk/intent/index.mjs", "IntentJS modes, domains, concerns, evidence, assurance, outputs, presentation policy, fallback, and load profiles.", intent,
    "import { intent, analyze, explicitDomain, concern, markdownCnl, allCompatible } from \"./framework/sdk/intent/index.mjs\";\nimport { evidenceLed, groupResultsBy } from \"./framework/sdk/cnl/index.mjs\";\nexport default intent(\"task\").mode(analyze()).domains(explicitDomain(\"logic-basic\")).concerns(concern(\"consistency\")).outputs(markdownCnl()).present(evidenceLed(), groupResultsBy(\"status-family\")).whenUnclear(allCompatible()).seal();"),
  surface("agent", "framework/sdk/agent/index.mjs", "Agent, task, run, coding-skill, context-artifact, CLI-tool, and edit-root contracts.", agent,
    "import { codingSkill, contextArtifact, cliTool } from \"./framework/sdk/agent/index.mjs\";\nexport default codingSkill(\"local-skill\").context(contextArtifact(\"SDK_CATALOG.md\")).tools(cliTool(\"nllAgent sdk usage\")).seal();"),
  surface("evaluation", "framework/sdk/evaluation/index.mjs", "Executable evaluation suites, corpora, modes, gold modules, metrics, and aggregation.", evaluation,
    "import { evaluationSuite, taskCase, ordinaryReplay } from \"./framework/sdk/evaluation/index.mjs\";\nexport default evaluationSuite(\"suite\").agentTemplate(Object.freeze({ name: \"evaluation-agent\" })).tasks(taskCase(\"case-1\")).modes(ordinaryReplay()).seal();"),
  surface("analysis", "framework/sdk/analysis/index.mjs", "Declarations for concrete, abstract, symbolic, temporal, constraint, rewrite, and other analysis methods.", analysis,
    "import { method, viewKind, capability, guarantee, low } from \"./framework/sdk/analysis/index.mjs\";\nexport default method(\"local-analysis\").accepts(viewKind(\"semantic-store\")).provides(capability(\"LocalResult\")).guarantee(guarantee(\"exact-on-fragment\")).cost(low()).seal();")
]);

export function checkSdkSurfaces() {
  const diagnostics = []; const byPath = new Map(sdkSurfaces.map((entry) => [entry.modulePath, entry]));
  for (const entry of sdkSurfaces) {
    if (entry.exports.length === 0) diagnostics.push(Object.freeze({ code: "SDK_SURFACE_EMPTY", surface: entry.id }));
    for (const name of entry.exports) {
      if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) diagnostics.push(Object.freeze({ code: "SDK_EXPORT_INVALID", surface: entry.id, name }));
    }
    for (const match of entry.example.matchAll(/import\s*\{([^}]+)\}\s*from\s*"\.\/([^"\n]+)"/g)) {
      const importedSurface = byPath.get(match[2]);
      if (!importedSurface) { diagnostics.push(Object.freeze({ code: "SDK_EXAMPLE_MODULE_UNKNOWN", surface: entry.id, modulePath: match[2] })); continue; }
      for (const binding of match[1].split(",").map((value) => value.trim().split(/\s+as\s+/)[0]).filter(Boolean)) {
        if (!importedSurface.exports.includes(binding)) diagnostics.push(Object.freeze({ code: "SDK_EXAMPLE_EXPORT_UNKNOWN", surface: entry.id, modulePath: match[2], binding }));
      }
    }
  }
  const owners = new Map();
  for (const entry of sdkSurfaces) for (const name of entry.exports) {
    if (!owners.has(name)) owners.set(name, []);
    owners.get(name).push(entry.id);
  }
  const repeatedNames = [...owners].filter(([, surfaces]) => surfaces.length > 1).map(([name, surfaces]) => Object.freeze({ name, surfaces: Object.freeze(surfaces) }));
  return Object.freeze({ valid: diagnostics.length === 0, surfaces: sdkSurfaces.length, exports: sdkSurfaces.reduce((total, entry) => total + entry.exports.length, 0), diagnostics: Object.freeze(diagnostics), repeatedNames: Object.freeze(repeatedNames) });
}

export function sdkUsage(surfaceId = null) {
  const selected = surfaceId ? sdkSurfaces.filter((entry) => entry.id === surfaceId) : sdkSurfaces;
  if (selected.length === 0) throw new Error(`SDK_SURFACE_UNKNOWN: ${surfaceId}`);
  const lines = ["# SDK Usage", "", "Import the narrow surface that owns the semantic contract. The broad SDK root exposes namespaces when fluent names overlap.", ""];
  for (const entry of selected) {
    lines.push(`## ${entry.id}`, "", entry.purpose, "", `Module: \`${entry.modulePath}\`.`, "", `Exports (${entry.exports.length}): ${entry.exports.map((name) => `\`${name}\``).join(", ")}.`, "", "```js", entry.example, "```", "");
  }
  return `${lines.join("\n")}\n`;
}

export default sdkSurfaces;
