import { QueryNode } from "../sdk/circuit/query.mjs";
import { DecisionTable, Finding } from "../sdk/circuit/decisions.mjs";
import { ProceduralStage } from "../sdk/circuit/procedural.mjs";
import { executeQuery } from "./query/execute.mjs";
import { DataflowScheduler } from "./scheduler/scheduler.mjs";
import { ExecutionTrace } from "./trace/trace.mjs";

export class CircuitExecution {
  constructor({ circuit, findings, frames, values, trace, diagnostics }) {
    this.circuit = circuit; this.findings = Object.freeze(findings); this.frames = Object.freeze(frames);
    this.values = values; this.trace = trace; this.diagnostics = Object.freeze(diagnostics); Object.freeze(this);
  }
}

export class CircuitRunner {
  constructor({ cache = null } = {}) { this.cache = cache; }
  async run(circuit, store, options = {}) {
    const trace = new ExecutionTrace();
    const findings = [];
    const frames = [];
    const diagnostics = [];
    const emitted = [];
    const scheduler = new DataflowScheduler({ cache: this.cache, trace });
    const context = {
      store, circuit, options, trace, values: null, row: null,
      query: (query) => executeQuery(store, query, options),
      emit: (...values) => { emitted.push(...values); return values.at(-1); },
      diagnostic: (value) => { diagnostics.push(value); return value; }
    };
    trace.record("circuit-start", { circuit: circuit.identity, inputs: [store.snapshotId] });
    const scheduled = await scheduler.run(circuit.stages, async (stage, inputs, values) => {
      context.values = values;
      if (stage instanceof QueryNode) return executeQuery(store, stage, options);
      if (stage instanceof DecisionTable) return stage.evaluate(context);
      if (stage instanceof ProceduralStage) {
        const implementation = stage.descriptor().implementation;
        if (!implementation) throw new Error(`CIRCUIT_UNDECLARED_OUTPUT: stage ${stage.identity()} has no implementation`);
        return implementation({ ...context, inputs });
      }
      if (stage?.descriptor?.().implementation) return stage.descriptor().implementation({ ...context, inputs });
      return stage;
    });
    context.values = scheduled.values;
    for (const emission of circuit.emissions) {
      const value = emission?.value;
      const resolved = value?.identity ? scheduled.values.get(value.identity()) ?? value : value;
      emitted.push(...(Array.isArray(resolved) ? resolved : [resolved]));
    }
    for (const value of [...scheduled.values.values(), ...emitted].flat()) {
      if (value instanceof Finding && !findings.some((finding) => finding.identity() === value.identity())) findings.push(value);
      if (value?.sort?.() === "CNLFrame" && !frames.some((frame) => frame.identity() === value.identity())) frames.push(value);
    }
    for (const unresolved of scheduled.unresolved) diagnostics.push({ code: "CIRCUIT_DEPENDENCY_CYCLE", stage: typeof unresolved?.identity === "function" ? unresolved.identity() : unresolved?.identity });
    trace.record("circuit-complete", { circuit: circuit.identity, outputs: [...findings, ...frames], diagnostics });
    return new CircuitExecution({ circuit, findings, frames, values: scheduled.values, trace, diagnostics });
  }
}
