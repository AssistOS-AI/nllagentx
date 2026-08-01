import { createCheckCircuit } from "../../shared/check-runtime.mjs";

export const LevelOfAnalysisFinding = createCheckCircuit("sociology-basic", "LevelOfAnalysisFinding", ["sociology-basic.actors-groups:IndividualLevel"]);
export const EcologicalFallacyFinding = createCheckCircuit("sociology-basic", "EcologicalFallacyFinding", ["sociology-basic.inequality-demography:AggregateClaim"]);
export const IndividualisticFallacyFinding = createCheckCircuit("sociology-basic", "IndividualisticFallacyFinding", ["sociology-basic.actors-groups:IndividualActor"]);
export const RoleInstitutionFinding = createCheckCircuit("sociology-basic", "RoleInstitutionFinding", ["sociology-basic.roles-norms:Role"]);
export const NetworkPathFinding = createCheckCircuit("sociology-basic", "NetworkPathFinding", ["sociology-basic.networks:Network"]);
export const CorrelationCausationFinding = createCheckCircuit("sociology-basic", "CorrelationCausationFinding", ["sociology-basic.power-resources:PowerRelation"]);
export const PopulationScopeFinding = createCheckCircuit("sociology-basic", "PopulationScopeFinding", ["sociology-basic.actors-groups:Population"]);

export default Object.freeze([LevelOfAnalysisFinding, EcologicalFallacyFinding, IndividualisticFallacyFinding, RoleInstitutionFinding, NetworkPathFinding, CorrelationCausationFinding, PopulationScopeFinding]);
