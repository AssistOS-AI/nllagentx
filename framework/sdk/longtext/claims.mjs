import { SemanticHandle, SemanticValue } from "../core/handles.mjs";
import { digestIdentity } from "../core/identity.mjs";

export class Claim extends SemanticHandle {
  constructor(builder) {
    const descriptor = {
      proposition: builder.proposition,
      modality: builder.modalityValue,
      polarity: builder.polarityValue,
      groundings: [...builder.groundings],
      voice: builder.voiceValue,
      confidence: builder.confidenceValue,
      context: builder.contextValue,
      interpretation: builder.interpretationValue
    };
    super({
      sort: "Claim",
      kind: "SourceClaim",
      identity: digestIdentity("nll.claim", descriptor),
      descriptor,
      provenance: builder.groundings
    });
  }
  proposition() { return this.descriptor().proposition; }
  groundings() { return this.descriptor().groundings; }
}

export class ClaimBuilder {
  constructor(proposition) {
    this.proposition = proposition;
    this.modalityValue = actual();
    this.polarityValue = asserted();
    this.groundings = [];
    this.voiceValue = null;
    this.confidenceValue = confidence(1);
    this.contextValue = null;
    this.interpretationValue = null;
  }
  modality(value) { this.modalityValue = value; return this; }
  polarity(value) { this.polarityValue = value; return this; }
  grounding(...values) { this.groundings.push(...values.map((value) => value?.descriptor?.().span ?? value)); return this; }
  statedBy(value) { this.voiceValue = value; return this; }
  confidence(value) { this.confidenceValue = value; return this; }
  within(value) { this.contextValue = value; return this; }
  interpretation(value) { this.interpretationValue = value; return this; }
  seal() { return new Claim(this); }
  identity() { return this.seal().identity(); }
  sort() { return "ClaimBuilder"; }
}

export const claim = (proposition) => new ClaimBuilder(proposition);
export const confidence = (value) => {
  if (typeof value !== "number" || value < 0 || value > 1) throw new RangeError("Confidence must be between zero and one");
  return new SemanticValue("Confidence", value, { sort: "Confidence" });
};
export const groundedAt = (span) => new SemanticHandle({ sort: "Grounding", kind: "SourceGrounding", descriptor: { span } });
export const statedBy = (voice) => new SemanticHandle({ sort: "Voice", kind: "AttributedVoice", descriptor: { voice } });
export const asserted = () => new SemanticValue("Polarity", "asserted", { sort: "Polarity" });
export const denied = () => new SemanticValue("Polarity", "denied", { sort: "Polarity" });
export const questioned = () => new SemanticValue("Polarity", "questioned", { sort: "Polarity" });
export const actual = () => new SemanticValue("Modality", "actual", { sort: "Modality" });
export const permitted = () => new SemanticValue("Modality", "permitted", { sort: "Modality" });
export const obligatory = () => new SemanticValue("Modality", "obligatory", { sort: "Modality" });
export const possible = () => new SemanticValue("Modality", "possible", { sort: "Modality" });
export const necessary = () => new SemanticValue("Modality", "necessary", { sort: "Modality" });
