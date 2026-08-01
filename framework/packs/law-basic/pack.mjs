import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/authority-jurisdiction.ontology.mjs";
import ontology1 from "./ontologies/persons-roles.ontology.mjs";
import ontology2 from "./ontologies/norms.ontology.mjs";
import ontology3 from "./ontologies/conditions-exceptions.ontology.mjs";
import ontology4 from "./ontologies/time-procedure.ontology.mjs";
import ontology5 from "./ontologies/definitions-references.ontology.mjs";
import ontology6 from "./ontologies/evidence-remedy.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("law-basic", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("must", "shall", "may", "prohibited", "entitled", "authority", "jurisdiction", "article", "appeal"), semanticSignals("NormativeAuthority", "Jurisdiction", "LegalSource", "LegalPerson", "NaturalPerson"))
  .provide(
    capability("NormFrameCompletenessFinding"),
    capability("DefinitionConsistencyFinding"),
    capability("NormConflictFinding"),
    capability("AuthorityJurisdictionFinding"),
    capability("ProcedureOrderFinding"),
    capability("DeadlineFinding"),
    capability("CrossReferenceFinding"),
    capability("ExceptionCoverageFinding"),
    capability("LegalBasisFinding"),
    capability("NormativeCNLRepair"),
    capability("PolicySpecificationPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
