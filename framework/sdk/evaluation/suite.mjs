import { declaredIdentity } from "../core/identity.mjs";

export class EvaluationDirective {
  constructor(kind, value = null, options = {}) {
    this.kind = kind; this.value = value; this.options = Object.freeze({ ...options }); Object.freeze(this);
  }
}

export const fromCorpus = (path, options = {}) => new EvaluationDirective("corpus", path, options);
export const taskCase = (id, options = {}) => new EvaluationDirective("task", id, options);
export const materialization = () => new EvaluationDirective("mode", "materialization");
export const intentSelection = () => new EvaluationDirective("mode", "intent-selection");
export const circuitAuthoring = () => new EvaluationDirective("mode", "circuit-authoring");
export const endToEndAnalysis = () => new EvaluationDirective("mode", "end-to-end-analysis");
export const generation = () => new EvaluationDirective("mode", "end-to-end-generation");
export const packAblation = () => new EvaluationDirective("mode", "pack-ablation");
export const ordinaryReplay = () => new EvaluationDirective("mode", "ordinary-replay");
export const defaultSemanticMetrics = () => new EvaluationDirective("metric-set", "default-semantic");
export const runtimeMetrics = () => new EvaluationDirective("metric-set", "runtime");

export class EvaluationSuite {
  constructor(builder) {
    this.id = builder.id; this.identity = declaredIdentity("evaluation-suite", builder.id);
    this.agent = builder.agent; this.profileValues = Object.freeze([...builder.profileValues]);
    this.taskValues = Object.freeze([...builder.taskValues]); this.modeValues = Object.freeze([...builder.modeValues]);
    this.agentAdapter = builder.agentAdapter; this.metricValues = Object.freeze([...builder.metricValues]);
    this.retainArtifacts = builder.retainArtifacts; this.goldRoot = builder.goldRoot;
    Object.freeze(this);
  }
}

export class EvaluationSuiteBuilder {
  constructor(id) { this.id = id; this.agent = null; this.profileValues = []; this.taskValues = []; this.modeValues = []; this.agentAdapter = null; this.metricValues = []; this.retainArtifacts = false; this.goldRoot = "gold"; }
  agentTemplate(value) { this.agent = value; return this; }
  profiles(...values) { this.profileValues.push(...values); return this; }
  tasks(...values) { this.taskValues.push(...values); return this; }
  modes(...values) { this.modeValues.push(...values); return this; }
  codingAgent(value) { this.agentAdapter = value; return this; }
  metrics(...values) { this.metricValues.push(...values); return this; }
  gold(path) { this.goldRoot = path; return this; }
  retainAllArtifacts() { this.retainArtifacts = true; return this; }
  seal() {
    if (!this.agent) throw new Error("EVALUATION_AGENT_TEMPLATE_REQUIRED");
    if (!this.taskValues.length) throw new Error("EVALUATION_TASKS_REQUIRED");
    return new EvaluationSuite(this);
  }
}

export const evaluationSuite = (id) => new EvaluationSuiteBuilder(id);
