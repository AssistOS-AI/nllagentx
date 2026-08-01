import { SourceRegistry, SourceUnit } from "../../../../../../../framework/sdk/longtext/source.mjs";

const registry = new SourceRegistry();
registry.register({ id: "source-001", path: "source/source-001.txt", text: "Emergency Access Policy and Log\n\nPolicy rule. Every use of the emergency-access exception must have a recorded reason linked to that invocation.\n\nEvent log. At 09:02, operator Ana invoked the emergency-access exception and opened the north gate. The log ends after the opening entry. It contains no reason or justification record for the invocation.\n", metadata: {"extractor":"builtin-utf8-v1","format":"txt"}, units: [
    new SourceUnit("source-001:unit-0001", { sourceId: "source-001", sourceDigest: "3ad54b667bec708994c576a12e842fc93076f8494b63b5759023b176b81ef88f", start: 0, end: 350, text: "Emergency Access Policy and Log\n\nPolicy rule. Every use of the emergency-access exception must have a recorded reason linked to that invocation.\n\nEvent log. At 09:02, operator Ana invoked the emergency-access exception and opened the north gate. The log ends after the opening entry. It contains no reason or justification record for the invocation.\n" })
  ] });

export default registry;
