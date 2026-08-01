import { SemanticHandle } from "../core/handles.mjs";
import { digestIdentity } from "../core/identity.mjs";

export class ProceduralStage extends SemanticHandle {
  constructor(builder) {
    super({
      sort: "CircuitNode",
      kind: "ProceduralStage",
      identity: digestIdentity("nll.procedural-stage", { id: builder.id, reads: builder.readValues, writes: builder.writeValues }),
      descriptor: { id: builder.id, reads: [...builder.readValues], writes: [...builder.writeValues], implementation: builder.implementation, abstractSummary: builder.abstractSummaryValue, symbolicAdapter: builder.symbolicAdapterValue }
    });
  }
}

export class ProceduralStageBuilder {
  constructor(id) { this.id = id; this.readValues = []; this.writeValues = []; this.implementation = null; this.abstractSummaryValue = null; this.symbolicAdapterValue = null; }
  reads(...values) { this.readValues.push(...values); return this; }
  writes(...values) { this.writeValues.push(...values); return this; }
  run(implementation) { this.implementation = implementation; return new ProceduralStage(this); }
  abstract(summary) { this.abstractSummaryValue = summary; return this; }
  symbolic(adapter) { this.symbolicAdapterValue = adapter; return this; }
  seal() { if (!this.implementation) throw new Error(`Procedural stage ${this.id} has no implementation`); return new ProceduralStage(this); }
}

export const proceduralStage = (id) => new ProceduralStageBuilder(id);

function dataflowNode(kind, id, inputs, implementation = null) {
  return new SemanticHandle({ sort: "CircuitNode", kind, descriptor: { id, inputs, implementation } });
}
export const select = (id, implementation) => dataflowNode("Select", id, [], implementation);
export const mapEach = (id, input, implementation) => dataflowNode("MapEach", id, [input], implementation);
export const emitEach = (id, input, implementation) => dataflowNode("EmitEach", id, [input], implementation);
