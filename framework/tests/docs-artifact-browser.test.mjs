import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import { artifactBrowser } from "../../tools/docs-file-helpers.mjs";
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
    Output: [Object.freeze({ path: responsePath, displayRoot: resultRoot })]
  }, projectRoot, escapeHtml);

  assert.match(html, />response\.md<\/code><\/button>/);
  assert.match(html, /data-project-path="evaluations\/agentic-nl-e2e\/.*\/results\/response\.md"/);
  assert.doesNotMatch(html, />evaluations\/agentic-nl-e2e\/.*response\.md<\/code><\/button>/);
});

test("file viewers wrap content without horizontal overflow and pages use the viewport", () => {
  assert.match(documentationStyles, /\.source-file pre,\.artifact-browser__viewer pre \{ overflow-x:hidden; overflow-y:auto; white-space:pre-wrap;/);
  assert.match(documentationStyles, /\.page \{ width:100%; margin:1rem 0; padding:0 \.75rem; \}/);
  assert.match(documentationStyles, /\.content > p,\.content > ul,\.content > ol \{ max-width:none; \}/);
});
