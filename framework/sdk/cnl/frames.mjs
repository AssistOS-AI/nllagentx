import { SemanticHandle, SemanticValue, isSemanticHandle } from "../core/handles.mjs";
import { digestIdentity } from "../core/identity.mjs";

function slotValue(kind, ...values) {
  return new SemanticHandle({ sort: "CNLSlot", kind, descriptor: { values } });
}

export class CNLFrame extends SemanticHandle {
  constructor(builder) {
    super({
      sort: "CNLFrame",
      kind: builder.kind,
      identity: digestIdentity("nll.cnl-frame", { kind: builder.kind, id: builder.id, slots: builder.slots }),
      descriptor: { id: builder.id, slots: Object.fromEntries(builder.slots), provenance: builder.provenanceValues }
    });
  }
  id() { return this.descriptor().id; }
  slot(name) { return this.descriptor().slots[name] ?? null; }
  slots() { return this.descriptor().slots; }
}

export class CNLFrameBuilder {
  constructor(kind, id) { this.kind = kind; this.id = id; this.slots = new Map(); this.provenanceValues = []; }
  set(name, ...values) { this.slots.set(name, values.length === 1 ? values[0] : slotValue(name, ...values)); return this; }
  subject(...values) { return this.set("subject", ...values); }
  predicate(...values) { return this.set("predicate", ...values); }
  evidence(...values) { return this.set("evidence", ...values); }
  certainty(...values) { return this.set("certainty", ...values); }
  recommendation(...values) { return this.set("recommendation", ...values); }
  actor(...values) { return this.set("actor", ...values); }
  action(...values) { return this.set("action", ...values); }
  condition(...values) { return this.set("condition", ...values); }
  exception(...values) { return this.set("exception", ...values); }
  deadline(...values) { return this.set("deadline", ...values); }
  claim(...values) { return this.set("claim", ...values); }
  support(...values) { return this.set("support", ...values); }
  limitation(...values) { return this.set("limitation", ...values); }
  provenance(...values) { this.provenanceValues.push(...values); return this; }
  seal() { return new CNLFrame(this); }
}

const frameFactory = (kind) => (id) => new CNLFrameBuilder(kind, id);
export const observationFrame = frameFactory("Observation");
export const assertionFrame = frameFactory("Assertion");
export const definitionFrame = frameFactory("Definition");
export const obligationFrame = frameFactory("Obligation");
export const prohibitionFrame = frameFactory("Prohibition");
export const permissionFrame = frameFactory("Permission");
export const recommendationFrame = frameFactory("Recommendation");
export const causalFrame = frameFactory("CausalExplanation");
export const claimEvidenceFrame = frameFactory("ClaimEvidence");
export const narrativeEventFrame = frameFactory("NarrativeEvent");
export const procedureStepFrame = frameFactory("ProcedureStep");
export const documentSectionFrame = frameFactory("DocumentSection");
export const findingFrame = frameFactory("Finding");
export const repairFrame = frameFactory("Repair");
export const clarificationFrame = frameFactory("Clarification");
export const generationPlan = frameFactory("GenerationPlan");

export const subject = (...values) => slotValue("Subject", ...values);
export const predicate = (...values) => slotValue("Predicate", ...values);
export const evidenceSlot = (...values) => slotValue("Evidence", ...values);
export const certainty = (...values) => slotValue("Certainty", ...values);
export const recommendation = (...values) => slotValue("Recommendation", ...values);
export const conditional = (condition, consequence) => slotValue("Conditional", condition, consequence);
export const sourceBound = (...values) => slotValue("SourceBound", ...values);
export const slot = (name, ...values) => slotValue(name, ...values);
export const literalSlot = (value) => new SemanticValue("CNLText", value, { sort: "CNLSlot" });

export function isCNLFrame(value) { return isSemanticHandle(value, "CNLFrame"); }
