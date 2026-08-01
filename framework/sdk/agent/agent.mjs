import { declaredIdentity } from "../core/identity.mjs";

export class AgentDirective {
  constructor(kind, value, options = {}) { this.kind = kind; this.value = value; this.options = Object.freeze({ ...options }); Object.freeze(this); }
}
export const usePack = (id) => new AgentDirective("pack", id);
export const useProfile = (id) => new AgentDirective("profile", id);
export const useSkillPolicy = (id) => new AgentDirective("skill-policy", id);
export const codingAgent = (id) => Object.freeze({
  kind: "coding-agent",
  id,
  editingMode: "standard",
  directEditing() { return new AgentDirective("coding-agent", id, { editingMode: "direct" }); }
});

export class SemanticAgent {
  constructor(builder) {
    this.id = builder.id;
    this.identity = declaredIdentity("agent", builder.id);
    this.packs = Object.freeze(builder.directives.filter((item) => item.kind === "pack"));
    this.directives = Object.freeze([...builder.directives]);
    this.defaultProfile = builder.defaultProfileValue;
    this.skillPolicy = builder.skillPolicyValue;
    this.codingAgent = builder.codingAgentValue;
    this.cnlDialects = Object.freeze([...builder.cnlDialects]);
    Object.freeze(this);
  }
}
export class SemanticAgentBuilder {
  constructor(id) { this.id = id; this.directives = []; this.defaultProfileValue = null; this.skillPolicyValue = null; this.codingAgentValue = null; this.cnlDialects = []; }
  use(...values) { this.directives.push(...values); return this; }
  defaultProfile(value) { this.defaultProfileValue = value; return this; }
  skills(value) { this.skillPolicyValue = value; return this; }
  coding(value) { this.codingAgentValue = value; return this; }
  cnl(...values) { this.cnlDialects.push(...values); return this; }
  seal() { return new SemanticAgent(this); }
}
export const semanticAgent = (id) => new SemanticAgentBuilder(id);
