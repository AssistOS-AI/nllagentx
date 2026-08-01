import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { buildContext, supportedContextArtifacts } from "../tools/context-builder.mjs";
import { listSkills, loadSkill, resolveSkillChain } from "../tools/skill-loader.mjs";
import { initializeAgentAt } from "../tools/workspace.mjs";

const implemented = new Map([
  ["agent", new Set(["create", "show", "check", "catalog"])],
  ["task", new Set(["create", "show", "sources", "clean-runs"])],
  ["code", new Set(["architect", "intent", "ontology", "longtext", "circuit", "sdk", "review"])],
  ["context", new Set(["build", "show"])], ["files", new Set(["index"])],
  ["catalog", new Set(["sdk", "ontology", "circuit", "response"])], ["sdk", new Set(["check", "usage"])],
  ["profile", new Set(["resolve"])],
  ["source", new Set(["ingest", "outline", "show", "search", "span", "verify-anchors"])],
  ["ontology", new Set(["check", "build", "show", "affected"])],
  ["longtext", new Set(["check", "execute", "query", "coverage"])],
  ["intent", new Set(["check", "infer-signals", "explain"])],
  ["circuit", new Set(["check", "plan", "run", "abstract", "symbolic"])],
  ["trace", new Set(["slice", "explain", "compare"])], ["cnl", new Set(["render", "parse", "roundtrip"])],
  ["review", new Set(["bundle"])], ["plan", new Set(["show"])],
  ["test", new Set(["framework", "packs", "agent", "task", "all"])],
  ["evaluate", new Set([null])]
]);

test("every executable skill resolves real dependencies and implemented CLI tools", async () => {
  const projectRoot = resolve(import.meta.dirname, "../.."); const ids = await listSkills(projectRoot);
  assert.equal(ids.length, 10);
  for (const id of ids) {
    const skill = await loadSkill(projectRoot, id); const chain = await resolveSkillChain(projectRoot, [id]);
    assert.equal(chain.at(-1).id, id);
    assert.ok(skill.workflow.contextArtifacts.length > 0);
    assert.ok(skill.workflow.designSpecifications.length > 0);
    for (const artifact of skill.workflow.contextArtifacts) {
      assert.ok(supportedContextArtifacts.includes(artifact.name), `${id} declares unsupported context ${artifact.name}`);
    }
    for (const tool of skill.workflow.tools) {
      const [prefix, command, action = null] = tool.command.split(/\s+/);
      assert.equal(prefix, "nllAgent");
      assert.ok(implemented.get(command)?.has(action), `${id} declares unavailable tool ${tool.command}`);
    }
  }
});

test("context builder materializes exactly the dependency-closed skill manifest union", async () => {
  const projectRoot = resolve(import.meta.dirname, "../..");
  const temporary = await mkdtemp(resolve(tmpdir(), "nll-skill-context-"));
  const agentRoot = resolve(temporary, "agent");
  try {
    await initializeAgentAt(projectRoot, agentRoot, "skill-context-agent", {
      profile: "minimal-core",
      packs: ["core-language"]
    });
    const context = await buildContext({
      projectRoot,
      agentRoot,
      phase: "sdk",
      selectedSkills: ["nll-sdk"]
    });
    const names = (await readdir(resolve(context.runRoot, "context"))).sort();
    assert.deepEqual(names, ["ONTOLOGY_CATALOG.md", "RESPONSE_CIRCUIT_CATALOG.md", "SDK_CATALOG.md"]);
    const instructions = await readFile(resolve(context.runRoot, "INSTRUCTIONS.md"), "utf8");
    assert.match(instructions, /context\/SDK_CATALOG\.md/);
    assert.doesNotMatch(instructions, /context\/SOURCE_OUTLINE\.md/);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
