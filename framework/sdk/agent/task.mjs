import { declaredIdentity } from "../core/identity.mjs";

export class TaskDirective {
  constructor(kind, value, options = {}) { this.kind = kind; this.value = value; this.options = Object.freeze({ ...options }); Object.freeze(this); }
}
export const sourceFile = (path, options) => new TaskDirective("source", path, options);
export const requestedOutput = (kind) => new TaskDirective("output", kind);
export const taskInstruction = (text) => new TaskDirective("instruction", text);
export const taskProfile = (id) => new TaskDirective("profile", id);
export const expectedLanguage = (id) => new TaskDirective("language", id);

export class SemanticTask {
  constructor(builder) {
    this.id = builder.id;
    this.identity = declaredIdentity("task", builder.id);
    this.sources = Object.freeze([...builder.sources]);
    this.instructions = Object.freeze([...builder.instructions]);
    this.outputs = Object.freeze([...builder.outputs]);
    this.profiles = Object.freeze([...builder.profiles]);
    this.languages = Object.freeze([...builder.languages]);
    this.title = builder.titleValue;
    Object.freeze(this);
  }
}
export class SemanticTaskBuilder {
  constructor(id) { this.id = id; this.sources = []; this.instructions = []; this.outputs = []; this.profiles = []; this.languages = []; this.titleValue = null; }
  source(...values) { this.sources.push(...values); return this; }
  instruction(...values) { this.instructions.push(...values); return this; }
  output(...values) { this.outputs.push(...values); return this; }
  profile(...values) { this.profiles.push(...values); return this; }
  language(...values) { this.languages.push(...values); return this; }
  title(value) { this.titleValue = value; return this; }
  seal() { return new SemanticTask(this); }
}
export const semanticTask = (id) => new SemanticTaskBuilder(id);
