export * from "./core/index.mjs";
export * from "./ontology/index.mjs";
export * from "./longtext/index.mjs";
export * from "./circuit/index.mjs";
export * from "./intent/index.mjs";
export * from "./cnl/index.mjs";
export * from "./agent/index.mjs";
export * from "./analysis/index.mjs";
export * from "./evaluation/index.mjs";

// Namespace exports preserve every public primitive even when separate DSLs use
// intentionally identical fluent names such as `usePack`.
export * as ontologyDsl from "./ontology/index.mjs";
export * as intentDsl from "./intent/index.mjs";
export * as agentDsl from "./agent/index.mjs";
export * as evaluationDsl from "./evaluation/index.mjs";
export { sdkSurfaces, checkSdkSurfaces, sdkUsage } from "./public-api.mjs";
