export class CodingSkill {
  constructor(builder) {
    this.id = builder.id;
    this.designSpecifications = Object.freeze([...builder.designSpecifications]);
    this.contextArtifacts = Object.freeze([...builder.contextArtifacts]);
    this.tools = Object.freeze([...builder.toolValues]);
    this.editRoots = Object.freeze([...builder.editRoots]);
    this.dependencies = Object.freeze([...builder.dependencies]);
    this.phases = Object.freeze([...builder.phases]);
    Object.freeze(this);
  }
}
export class CodingSkillBuilder {
  constructor(id) { this.id = id; this.designSpecifications = []; this.contextArtifacts = []; this.toolValues = []; this.editRoots = []; this.dependencies = []; this.phases = []; }
  specs(...values) { this.designSpecifications.push(...values); return this; }
  context(...values) { this.contextArtifacts.push(...values); return this; }
  tools(...values) { this.toolValues.push(...values); return this; }
  edits(...values) { this.editRoots.push(...values); return this; }
  dependsOn(...values) { this.dependencies.push(...values); return this; }
  phase(...values) { this.phases.push(...values); return this; }
  seal() { return new CodingSkill(this); }
}
export const codingSkill = (id) => new CodingSkillBuilder(id);
export const contextArtifact = (name) => Object.freeze({ kind: "context-artifact", name });
export const cliTool = (command) => Object.freeze({ kind: "cli-tool", command });
export const editRoot = (kind) => Object.freeze({ kind: "edit-root", value: kind });
