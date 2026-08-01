import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/time-calendar.ontology.mjs";
import ontology1 from "./ontologies/earth-geography.ontology.mjs";
import ontology2 from "./ontologies/institutions.ontology.mjs";
import ontology3 from "./ontologies/artifacts.ontology.mjs";
import ontology4 from "./ontologies/materials-food-health.ontology.mjs";
import ontology5 from "./ontologies/measurement.ontology.mjs";
import ontology6 from "./ontologies/fact-provenance.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("world-basic", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("date", "country", "city", "school", "hospital", "map", "artifact", "calendar"), semanticSignals("CalendarUnit", "GeographicRegion", "Institution", "Artifact", "Vehicle"))
  .provide(
    capability("BasicFactConflictFinding"),
    capability("CategoryMistakeFinding"),
    capability("TemporalCalendarFinding"),
    capability("UnitConventionFinding"),
    capability("TypicalityWarning"),
    capability("WorldContextEnrichment"),
    capability("FactClarificationDemand"),
    capability("BasicExpositionPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
