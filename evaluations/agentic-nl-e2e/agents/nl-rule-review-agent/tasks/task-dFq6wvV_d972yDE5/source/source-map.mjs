import { SourceRegistry, SourceUnit } from "../../../../../../../framework/sdk/longtext/source.mjs";

const registry = new SourceRegistry();
registry.register({ id: "source-001", path: "source/source-001.txt", text: "Procedure Requirements\n\nAn operator must acknowledge an active alarm before requesting authorization to open the north gate. Authorization must be recorded before the gate is opened. An emergency exception may permit an earlier opening, but the operator must record the reason for the exception. Every ordinary or exceptional opening must finish with an audit entry that identifies the operator and time.\n", metadata: {"extractor":"builtin-utf8-v1","format":"txt"}, units: [
    new SourceUnit("source-001:unit-0001", { sourceId: "source-001", sourceDigest: "759e5183506b5f6462dea5d2b9c4380f76ff1e5278fca3919927ebe4bd7ad6a3", start: 0, end: 405, text: "Procedure Requirements\n\nAn operator must acknowledge an active alarm before requesting authorization to open the north gate. Authorization must be recorded before the gate is opened. An emergency exception may permit an earlier opening, but the operator must record the reason for the exception. Every ordinary or exceptional opening must finish with an audit entry that identifies the operator and time.\n" })
  ] });

export default registry;
