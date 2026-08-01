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
    this.agentBriefPath = builder.agentBriefPath;
    this.agentAuthoringValues = Object.freeze([...builder.agentAuthoringValues]);
    this.taskAuthoringValues = Object.freeze([...builder.taskAuthoringValues]);
    this.agentAdapter = builder.agentAdapter; this.metricValues = Object.freeze([...builder.metricValues]);
    this.retainArtifacts = builder.retainArtifacts; this.goldRoot = builder.goldRoot;
    Object.freeze(this);
  }
}

export class EvaluationSuiteBuilder {
  constructor(id) {
    this.id = id; this.agent = null; this.profileValues = []; this.taskValues = []; this.modeValues = [];
    this.agentBriefPath = null; this.agentAuthoringValues = []; this.taskAuthoringValues = [];
    this.agentAdapter = null; this.metricValues = []; this.retainArtifacts = false; this.goldRoot = "gold";
  }
  agentTemplate(value) { this.agent = value; return this; }
  agentBrief(path) { this.agentBriefPath = path; return this; }
  authorAgent(...phases) { this.agentAuthoringValues.push(...phases); return this; }
  authorTasks(...phases) { this.taskAuthoringValues.push(...phases); return this; }
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
    const allowedAgentPhases = new Set(["architect", "ontology", "circuit", "test", "review"]);
    const allowedTaskPhases = new Set(["intent", "ontology", "longtext", "circuit", "test", "review"]);
    for (const phase of this.agentAuthoringValues) if (!allowedAgentPhases.has(phase)) throw new Error(`EVALUATION_AGENT_PHASE_UNKNOWN: ${phase}`);
    for (const phase of this.taskAuthoringValues) if (!allowedTaskPhases.has(phase)) throw new Error(`EVALUATION_TASK_PHASE_UNKNOWN: ${phase}`);
    if (this.agentAuthoringValues.length && !this.agentBriefPath) throw new Error("EVALUATION_AGENT_BRIEF_REQUIRED");
    return new EvaluationSuite(this);
  }
}

export const evaluationSuite = (id) => new EvaluationSuiteBuilder(id);
