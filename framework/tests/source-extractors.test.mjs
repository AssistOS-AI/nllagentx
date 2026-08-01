import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { extractPdfText, extractSourceFile } from "../tools/source-extractors.mjs";

test("built-in PDF extraction decodes literal and hexadecimal text operands", () => {
  const pdf = Buffer.from("%PDF-1.4\n1 0 obj\n<< /Type /Page >>\nendobj\n2 0 obj\n<< /Length 64 >>\nstream\nBT /F1 12 Tf 10 10 Td (A stable \\(PDF\\) source.) Tj <205365636f6e64206c696e652e> Tj ET\nendstream\nendobj\n%%EOF", "latin1");
  const extracted = extractPdfText(pdf);
  assert.equal(extracted.text, "A stable (PDF) source. Second line.");
  assert.equal(extracted.metadata.pages, 1);
  assert.equal(extracted.metadata.extractor, "builtin-pdf-text-v1");
});

test("task-local extractor overrides built-ins and returns stable metadata", async () => {
  const taskRoot = await mkdtemp(resolve(tmpdir(), "nll-extractor-"));
  try {
    const sourceRoot = resolve(taskRoot, "source"); const extractorRoot = resolve(sourceRoot, "extractors");
    await mkdir(extractorRoot, { recursive: true });
    const path = resolve(sourceRoot, "fixture.bin"); await writeFile(path, Buffer.from([0x41, 0x42]));
    await writeFile(resolve(extractorRoot, "bin.extractor.mjs"), "export default ({ bytes }) => ({ text: `decoded-${bytes.toString(\"hex\")}`, metadata: { format: \"fixture-binary\" } });\n");
    const extracted = await extractSourceFile(path, ".bin", { taskRoot });
    assert.equal(extracted.text, "decoded-4142");
    assert.equal(extracted.metadata.format, "fixture-binary");
    assert.match(extracted.metadata.extractor, /^task:/);
  } finally { await rm(taskRoot, { recursive: true, force: true }); }
});
