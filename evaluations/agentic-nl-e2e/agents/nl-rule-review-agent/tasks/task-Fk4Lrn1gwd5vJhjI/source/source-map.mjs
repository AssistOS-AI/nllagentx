import { SourceRegistry, SourceUnit } from "../../../../../../../framework/sdk/longtext/source.mjs";

const registry = new SourceRegistry();
registry.register({ id: "source-001", path: "source/source-001.txt", text: "Safety Review Memo\n\nThe alarm sounded at 08:57. The north gate was opened at 09:00. The memo's author concludes: “The opening was safe because the operator was fully trained.”\n\nThe memo contains no training record, assessment, inspection result, or other evidence supporting that conclusion.\n", metadata: {"extractor":"builtin-utf8-v1","format":"txt"}, units: [
    new SourceUnit("source-001:unit-0001", { sourceId: "source-001", sourceDigest: "8f2db1ef1d41384666f475e0795959e7d666fd19b7c8cb8aef90561a1817da0d", start: 0, end: 292, text: "Safety Review Memo\n\nThe alarm sounded at 08:57. The north gate was opened at 09:00. The memo's author concludes: “The opening was safe because the operator was fully trained.”\n\nThe memo contains no training record, assessment, inspection result, or other evidence supporting that conclusion.\n" })
  ] });

export default registry;
