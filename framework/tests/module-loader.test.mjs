import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { importFresh } from "../tools/module-loader.mjs";

test("importFresh invalidates changed local transitive dependencies", async () => {
  const root = await mkdtemp(resolve(tmpdir(), "nll-module-loader-"));
  const circuits = resolve(root, "circuits");
  const support = resolve(circuits, "review-support.mjs");
  const circuit = resolve(circuits, "review.circuit.mjs");
  try {
    await mkdir(circuits, { recursive: true });
    await writeFile(resolve(root, "agent.mjs"), "export default Object.freeze({ id: 'cache-test' });\n");
    await writeFile(support, "export const requirementCode = 'BEFORE';\n");
    await writeFile(circuit, "import { requirementCode } from './review-support.mjs';\nexport default requirementCode;\n");
    assert.equal((await importFresh(circuit)).default, "BEFORE");

    await writeFile(support, "export const requirementDetails = 'AFTER';\n");
    await writeFile(circuit, "import { requirementDetails } from './review-support.mjs';\nexport default requirementDetails;\n");
    assert.equal((await importFresh(circuit)).default, "AFTER");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
