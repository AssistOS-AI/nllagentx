import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const BasicFactConflictFinding = createCheckCircuit("world-basic", "BasicFactConflictFinding", ["world-basic.fact-provenance:StableWorldFact"]);
export const CategoryMistakeFinding = createCheckCircuit("world-basic", "CategoryMistakeFinding", ["world-basic.artifacts:Artifact"]);
export const TemporalCalendarFinding = createCheckCircuit("world-basic", "TemporalCalendarFinding", ["world-basic.time-calendar:CalendarUnit"]);
export const UnitConventionFinding = createCheckCircuit("world-basic", "UnitConventionFinding", ["world-basic.earth-geography:Map"]);
export const TypicalityWarning = createCheckCircuit("world-basic", "TypicalityWarning", ["world-basic.materials-food-health:TypicalProperty"]);
export const WorldContextEnrichment = createCheckCircuit("world-basic", "WorldContextEnrichment", ["world-basic.earth-geography:GeographicRegion"]);

export default Object.freeze([BasicFactConflictFinding, CategoryMistakeFinding, TemporalCalendarFinding, UnitConventionFinding, TypicalityWarning, WorldContextEnrichment]);
