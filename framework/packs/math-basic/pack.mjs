import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
import ontology0 from "./ontologies/numbers-arithmetic.ontology.mjs";
import ontology1 from "./ontologies/ratios-percentages.ontology.mjs";
import ontology2 from "./ontologies/algebra.ontology.mjs";
import ontology3 from "./ontologies/geometry.ontology.mjs";
import ontology4 from "./ontologies/measurement.ontology.mjs";
import ontology5 from "./ontologies/probability-statistics.ontology.mjs";
import ontology6 from "./ontologies/proof-explanation.ontology.mjs";
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([ontology0, ontology1, ontology2, ontology3, ontology4, ontology5, ontology6]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack("math-basic", "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals("percent", "%", "equation", "ratio", "area", "mean", "probability", "calculate"), semanticSignals("Number", "Integer", "Rational", "DecimalApproximation", "Expression"))
  .provide(
    capability("ArithmeticConsistencyFinding"),
    capability("EquationSatisfactionFinding"),
    capability("PercentageRatioFinding"),
    capability("UnitDimensionFinding"),
    capability("GeometryFormulaFinding"),
    capability("StatisticsExampleFinding"),
    capability("ProbabilityBoundFinding"),
    capability("DerivationStepFinding"),
    capability("MathExplanationPlan")
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
