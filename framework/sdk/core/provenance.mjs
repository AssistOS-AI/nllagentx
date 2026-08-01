import { SemanticHandle } from "./handles.mjs";
import { digestIdentity } from "./identity.mjs";

export function provenance(kind, details) {
  return new SemanticHandle({
    sort: "Provenance",
    kind,
    descriptor: { ...details },
    identity: digestIdentity(`nll.provenance.${kind}`, details)
  });
}

export const sourceProvenance = (sourceId, span = null) => provenance("Source", { sourceId, span });
export const packProvenance = (packId, sourceClass = "design-convention", scope = "declared") =>
  provenance("PackFact", { packId, sourceClass, scope });
export const derivedProvenance = (circuitId, inputs, stage = null) =>
  provenance("Derived", { circuitId, inputs: [...inputs], stage });
export const instructionProvenance = (instructionId) => provenance("TaskInstruction", { instructionId });
