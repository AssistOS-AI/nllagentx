import { SourceRegistry, SourceUnit } from "../../../../../../../framework/sdk/longtext/source.mjs";

const registry = new SourceRegistry();
registry.register({ id: "source-001", path: "source/source-001.txt", text: "North Gate Alarm Policy\n\nRule A. While the building alarm is active, staff must keep the north gate closed until an operator acknowledges the alarm.\n\nRule B. While the building alarm is active, staff must open the north gate before an operator acknowledges the alarm.\n\nThe policy states no priority between Rule A and Rule B and gives no exception that resolves their overlap.\n", metadata: {"extractor":"builtin-utf8-v1","format":"txt"}, units: [
    new SourceUnit("source-001:unit-0001", { sourceId: "source-001", sourceDigest: "d8ad63e92e3285794353f988ffbbcab4867fcb3e1aac6c2764acf13229dd8f29", start: 0, end: 377, text: "North Gate Alarm Policy\n\nRule A. While the building alarm is active, staff must keep the north gate closed until an operator acknowledges the alarm.\n\nRule B. While the building alarm is active, staff must open the north gate before an operator acknowledges the alarm.\n\nThe policy states no priority between Rule A and Rule B and gives no exception that resolves their overlap.\n" })
  ] });

export default registry;
