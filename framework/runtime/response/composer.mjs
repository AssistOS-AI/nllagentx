import { defaultResponseCircuits } from "./default-circuits.mjs";

function validatedState(candidate, previous, context, stage) {
  if (!candidate || typeof candidate !== "object") {
    throw new TypeError(`RESPONSE_STAGE_STATE_REQUIRED: ${stage.id}`);
  }
  const entries = [...(candidate.entries ?? previous.entries)];
  for (const entry of entries) {
    if (!entry || !context.findings.includes(entry.finding)) {
      throw new Error(`RESPONSE_STAGE_INVENTED_FINDING: ${stage.id}`);
    }
  }
  const entrySet = new Set(entries);
  const groups = [...(candidate.groups ?? previous.groups)].map((group) => {
    if (!group || typeof group.key !== "string" || !Array.isArray(group.entries)) {
      throw new TypeError(`RESPONSE_STAGE_GROUP_INVALID: ${stage.id}`);
    }
    if (group.entries.some((entry) => !entrySet.has(entry))) {
      throw new Error(`RESPONSE_STAGE_GROUP_INVENTED_ENTRY: ${stage.id}`);
    }
    return Object.freeze({ ...group, entries: Object.freeze([...group.entries]) });
  });
  const generatedFrames = [...(candidate.generatedFrames ?? previous.generatedFrames)];
  if (generatedFrames.some((frame) => !context.frames.includes(frame))) {
    throw new Error(`RESPONSE_STAGE_INVENTED_FRAME: ${stage.id}`);
  }
  const features = candidate.features ?? previous.features;
  if (!(features instanceof Set)) throw new TypeError(`RESPONSE_STAGE_FEATURE_SET_REQUIRED: ${stage.id}`);
  return Object.freeze({
    ...candidate,
    intent: context.intent,
    findings: Object.freeze([...context.findings]),
    frames: Object.freeze([...context.frames]),
    executions: Object.freeze([...context.executions]),
    entries: Object.freeze(entries),
    groups: Object.freeze(groups),
    generatedFrames: Object.freeze(generatedFrames),
    features: Object.freeze(new Set(features))
  });
}

export function composeResponse({ intent, findings, frames, executions, circuits = defaultResponseCircuits }) {
  const context = Object.freeze({ intent, findings, frames, executions });
  const resolvedCircuits = [...new Map(circuits.map((circuit) => [circuit.identity, circuit])).values()];
  const selected = resolvedCircuits
    .filter((circuit) => circuit.applies(context))
    .sort((left, right) => left.priority - right.priority || left.identity.localeCompare(right.identity));
  let state = Object.freeze({
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
  });
  const trace = [];
  for (const circuit of selected) {
    for (const stage of circuit.stages) {
      const before = state.entries.length;
      state = validatedState(stage.transform(state, context), state, context, stage);
      trace.push(Object.freeze({ circuit: circuit.identity, stage: stage.id, before, after: state.entries.length }));
    }
  }
  return Object.freeze({
    ...state,
    selectedCircuits: Object.freeze(selected.map((circuit) => circuit.identity)),
    trace: Object.freeze(trace)
  });
}
