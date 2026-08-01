import { SemanticHandle } from "../core/handles.mjs";

export class CapabilityRequest extends SemanticHandle {
  constructor(name, optional = false) { super({ sort: "CapabilityRequest", kind: optional ? "Optional" : "Required", descriptor: { name, optional } }); }
  whenAvailable() { return new CapabilityRequest(this.descriptor().name, true); }
}
export const requireCapability = (name) => new CapabilityRequest(name);
export const provideCapability = (name) => ({ name, kind: "provided-capability" });
export const composeByCapability = (request) => request;
export const emitCollection = (name, ...values) => ({ kind: "collection-emission", name, values });
export const connect = (output, input) => ({ kind: "port-connection", output, input });
export const typedPort = (name, type) => ({ kind: "typed-port", name, type });
