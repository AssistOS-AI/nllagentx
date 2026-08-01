import { defaultResponseCircuits } from "./default-circuits.mjs";

export function composeResponse({ intent, findings, frames, executions, circuits = defaultResponseCircuits }) {
  const context = Object.freeze({ intent, findings, frames, executions });
  const resolvedCircuits = [...new Map(circuits.map((circuit) => [circuit.identity, circuit])).values()];
  const selected = resolvedCircuits
    .filter((circuit) => circuit.applies(context))
    .sort((left, right) => left.priority - right.priority || left.identity.localeCompare(right.identity));
  let state = {
    intent,
    findings: Object.freeze([...findings]),
    frames: Object.freeze([...frames]),
    executions: Object.freeze([...executions]),
    entries: Object.freeze([]),
    groups: Object.freeze([]),
    generatedFrames: Object.freeze([]),
    style: "evidence-led",
    features: Object.freeze(new Set()),
    grouping: "status-family"
  };
  const trace = [];
  for (const circuit of selected) {
    for (const stage of circuit.stages) {
      const before = state.entries.length;
      state = stage.transform(state, context);
      trace.push(Object.freeze({ circuit: circuit.identity, stage: stage.id, before, after: state.entries.length }));
    }
  }
  return Object.freeze({
    ...state,
    selectedCircuits: Object.freeze(selected.map((circuit) => circuit.identity)),
    trace: Object.freeze(trace)
  });
}
