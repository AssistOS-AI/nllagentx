export const emitFinding = (value) => ({ kind: "finding-emission", value });
export const emitDerivedFact = (value) => ({ kind: "derived-fact-emission", value });
export const emitAssessment = (value) => ({ kind: "assessment-emission", value });
export const emitCNLFrame = (value) => ({ kind: "cnl-emission", value });
export const emitRefinementDemand = (value) => ({ kind: "refinement-emission", value });
export const emitClarification = (value) => ({ kind: "clarification-emission", value });
