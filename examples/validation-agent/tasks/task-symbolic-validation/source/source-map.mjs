import { SourceRegistry, SourceUnit } from "../../../../../framework/sdk/longtext/source.mjs";

const registry = new SourceRegistry();
registry.register({ id: "source-001", path: "source/incident.txt", text: "The alarm sounded in Building A at 08:57.\nAna opened the north gate at 09:00.\n", metadata: {"extractor":"builtin-utf8-v1","format":"txt"}, units: [
    new SourceUnit("source-001:unit-0001", { sourceId: "source-001", sourceDigest: "4dae9611a7f338308daef1d824072e04c13fe164d1c62c652f674f78c21c3354", start: 0, end: 78, text: "The alarm sounded in Building A at 08:57.\nAna opened the north gate at 09:00.\n" })
  ] });

export default registry;
