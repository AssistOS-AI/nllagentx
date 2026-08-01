import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { artifactBrowser } from "../../tools/docs-file-helpers.mjs";
import { documentationNavigationGroups } from "../../tools/docs-navigation.mjs";
import { documentationStyles } from "../../tools/docs-styles.mjs";

const projectRoot = resolve(import.meta.dirname, "../..");
const taskRoot = resolve(projectRoot, "evaluations/agentic-nl-e2e/agents/nl-rule-review-agent/tasks/task--gGzZzD3bFKbd-Pc");
const resultRoot = resolve(taskRoot, "results");
const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

test("artifact explorer shows contextual labels while retaining exact project paths", async () => {
  const responsePath = resolve(resultRoot, "response.md");
  const html = await artifactBrowser({
    Output: [Object.freeze({
      path: responsePath,
      displayRoot: resultRoot,
      label: "task/results/response.md"
    })]
  }, projectRoot, escapeHtml);

  assert.match(html, />task\/results\/response\.md<\/code><\/button>/);
  assert.match(html, /data-project-path="evaluations\/agentic-nl-e2e\/.*\/results\/response\.md"/);
  assert.doesNotMatch(html, />evaluations\/agentic-nl-e2e\/.*response\.md<\/code><\/button>/);
});

test("file viewers wrap content without horizontal overflow and pages use the viewport", () => {
  assert.match(documentationStyles, /\.source-file pre,\.artifact-browser__viewer pre \{ overflow-x:hidden; overflow-y:auto; white-space:pre-wrap;/);
  assert.match(documentationStyles, /\.page \{ width:100%; margin:1rem 0; padding:0 \.75rem; \}/);
  assert.match(documentationStyles, /\.content > p,\.content > ul,\.content > ol \{ max-width:none; \}/);
  assert.doesNotMatch(documentationStyles, /\.mermaid|diagram-rendered/);
});

test("every concrete tutorial is an explicit text input to Markdown CNL story", async () => {
  const tutorialNames = (await readdir(resolve(projectRoot, "docs")))
    .filter((name) => /^tutorial-(?!s\.html).+\.html$/.test(name))
    .sort();
  assert.equal(tutorialNames.length, 6);
  for (const name of tutorialNames) {
    const html = await readFile(resolve(projectRoot, "docs", name), "utf8");
    const input = html.match(/id="[^"]+-input" class="artifact-browser__files"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
    const intermediate = html.match(/id="[^"]+-intermediate" class="artifact-browser__files"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
    const output = html.match(/id="[^"]+-output" class="artifact-browser__files"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
    const inputLabels = [...input.matchAll(/<code>([^<]+)<\/code>/g)].map((match) => match[1]);
    const intermediateLabels = [...intermediate.matchAll(/<code>([^<]+)<\/code>/g)].map((match) => match[1]);
    const outputLabels = [...output.matchAll(/<code>([^<]+)<\/code>/g)].map((match) => match[1]);
    assert.ok(inputLabels.length >= 2, `${name} must expose instruction and source text`);
    assert.ok(inputLabels.every((label) => !label.endsWith(".mjs")), `${name} Input must contain text only`);
    assert.ok(inputLabels.every((label) => /^(agent|task)\//.test(label)), `${name} Input labels must name their owner`);
    assert.ok(intermediateLabels.length >= 4, `${name} Intermediate must expose executable semantic files`);
    assert.ok(intermediateLabels.every((label) => /^(agent|task)\//.test(label)), `${name} Intermediate labels must name their owner`);
    assert.ok(intermediateLabels.every((label) => label.endsWith(".mjs")), `${name} Intermediate must contain only executable programs and tests`);
    assert.ok(intermediateLabels.every((label) => !/\/(?:results|runs|logs)\//.test(label)), `${name} Intermediate must exclude result and process evidence`);
    assert.deepEqual(outputLabels, ["task/results/response.md"], `${name} Output must contain only public Markdown CNL`);
    assert.match(html, /Input ownership and requested (?:behavior|result)/);
    assert.match(html, /How .* became executable|From this task's text to executable meaning/);
    assert.match(html, /Why [^<]*(?:answer|CNL)/);
    assert.doesNotMatch(html, /What a programmer should learn|Stage contract|Cases and their programming lesson/);
    assert.doesNotMatch(html, /mermaid|flowchart|stateDiagram|sequenceDiagram|classDiagram/);

    const agentInputs = inputLabels.filter((label) => label.startsWith("agent/"));
    if (/tutorial-(?:contradictory-rules|missing-exception|procedure-generation|unsupported-conclusion)\.html/.test(name)) {
      assert.deepEqual(agentInputs, ["agent/source/agent-brief.md"], `${name} must expose the reusable agent brief`);
    } else {
      assert.deepEqual(agentInputs, [], `${name} uses a pre-existing agent and must not invent an agent input`);
    }
  }
});

function assertCommandComments(source, fileName, blockPattern) {
  for (const match of source.matchAll(blockPattern)) {
    const lines = match[1].split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      if (!lines[index].trimStart().startsWith("node ")) continue;
      assert.ok(
        index > 0 && lines[index - 1].trimStart().startsWith("# "),
        `${fileName}: command must have an immediately preceding explanatory comment: ${lines[index].trim()}`
      );
    }
  }
}

test("every runnable documentation command explains what it does and why", async () => {
  const docsRoot = resolve(projectRoot, "docs");
  const htmlNames = (await readdir(docsRoot)).filter((name) => name.endsWith(".html"));
  for (const name of htmlNames) {
    const html = await readFile(resolve(docsRoot, name), "utf8");
    assertCommandComments(html, `docs/${name}`, /<pre><code(?: [^>]*)?>([\s\S]*?)<\/code><\/pre>/g);
  }
  const readme = await readFile(resolve(projectRoot, "README.md"), "utf8");
  assertCommandComments(readme, "README.md", /```[^\n]*\n([\s\S]*?)```/g);
});

test("navigation exposes one specification browser and no symbolic tutorial", () => {
  const reference = documentationNavigationGroups.find((group) => group.id === "reference");
  const tutorials = documentationNavigationGroups.find((group) => group.id === "tutorials");
  assert.deepEqual(reference.items.filter(([, href]) => href.startsWith("specsLoader.html?spec=")), [
    ["Specification browser", "specsLoader.html?spec=matrix.md"]
  ]);
  assert.ok(tutorials.items.every(([, href]) => href !== "tutorial-symbolic.html"));
});
