#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { domainModuleAllocations } from "./domain-module-allocations.mjs";

const root = resolve(import.meta.dirname, "..");

const packs = [
  {
    id: "core-commonsense",
    modules: ["entities", "space", "events", "agency", "continuity", "causality"],
    concepts: ["Agent", "Person", "GroupAgent", "PhysicalObject", "Substance", "Place", "Region", "Container", "Surface", "Tool", "InformationArtifact", "Goal", "Plan", "Ability", "KnowledgeState", "BeliefState", "PossessionState", "AccessState", "ExistenceState", "LocationState", "Condition"],
    frames: ["Appear", "Disappear", "Create", "Destroy", "Move", "Arrive", "Depart", "Enter", "Exit", "PlaceIn", "RemoveFrom", "Give", "Receive", "Acquire", "Lose", "Take", "Return", "Open", "Close", "Lock", "Unlock", "Use", "Break", "Repair", "Observe", "Tell", "Learn", "Forget", "Attempt", "Succeed", "Fail", "Prevent", "Enable"],
    capabilities: ["ObjectContinuityFinding", "MissingTransitionFinding", "ActionPreconditionFinding", "KnowledgeContinuityFinding", "CausalGapFinding", "ImpossibleCoexistenceFinding", "PossessionConflictFinding", "EverydayPlanCircuit", "ClarificationDemand"],
    signals: ["move", "object", "location", "possess", "use", "access", "continuity"],
    sections: ["goal", "prerequisite", "action", "outcome", "open question"]
  },
  {
    id: "world-basic",
    modules: ["time-calendar", "earth-geography", "institutions", "artifacts", "materials-food-health", "measurement", "fact-provenance"],
    concepts: ["CalendarUnit", "GeographicRegion", "Institution", "Artifact", "Vehicle", "Material", "Food", "HealthState", "InformationArtifact", "StableWorldFact", "Earth", "Land", "WaterBody", "Continent", "Country", "Region", "City", "Village", "River", "Lake", "Sea", "Ocean", "Mountain", "Map", "Family", "School", "University", "Company", "Government", "Court", "Hospital", "Market", "Library", "Museum", "MediaOrganization", "Bank", "NonprofitOrganization", "Book", "Document", "Record", "Message", "Computer", "Phone", "Camera", "Clock", "Thermometer", "Scale", "Building", "Door", "Key", "Lock", "Machine"],
    frames: ["LocatedIn", "PartOf", "HasFunction", "MadeOf", "UsedFor", "OccursDuring", "InstitutionalRole", "TypicalProperty", "PackFact"],
    capabilities: ["BasicFactConflictFinding", "CategoryMistakeFinding", "TemporalCalendarFinding", "UnitConventionFinding", "TypicalityWarning", "WorldContextEnrichment", "FactClarificationDemand", "BasicExpositionPlan"],
    signals: ["date", "country", "city", "school", "hospital", "map", "artifact", "calendar"],
    sections: ["definition", "category", "function", "example", "limitation"]
  },
  {
    id: "math-basic",
    modules: ["numbers-arithmetic", "ratios-percentages", "algebra", "geometry", "measurement", "probability-statistics", "proof-explanation"],
    concepts: ["Number", "Integer", "Rational", "DecimalApproximation", "Expression", "Variable", "Equation", "Inequality", "Ratio", "Rate", "Percentage", "Proportion", "Length", "Area", "Volume", "Angle", "Dimension", "GeometricFigure", "Dataset", "Observation", "Mean", "Median", "Mode", "Range", "FiniteExperiment", "Outcome", "Probability", "MathematicalClaim", "DerivationStep"],
    frames: ["Add", "Subtract", "Multiply", "Divide", "Power", "Root", "Equals", "LessThan", "GreaterThan", "Between", "EquivalentExpression", "HasMeasure", "Perimeter", "AreaCalculation", "VolumeCalculation", "ProportionalTo", "RateOfChange", "ProbabilityOf", "DerivedFrom"],
    capabilities: ["ArithmeticConsistencyFinding", "EquationSatisfactionFinding", "PercentageRatioFinding", "UnitDimensionFinding", "GeometryFormulaFinding", "StatisticsExampleFinding", "ProbabilityBoundFinding", "DerivationStepFinding", "MathExplanationPlan"],
    signals: ["percent", "%", "equation", "ratio", "area", "mean", "probability", "calculate"],
    sections: ["givens", "unknown", "formula", "substitution", "result", "check"]
  },
  {
    id: "physics-basic",
    modules: ["motion", "forces", "energy", "thermal", "waves", "electricity-magnetism", "models-units"],
    concepts: ["PhysicalSystem", "PhysicalBody", "ParticleCollection", "Position", "MotionState", "Velocity", "Acceleration", "Force", "Interaction", "EquilibriumState", "Energy", "Work", "Power", "EnergyTransfer", "Temperature", "HeatTransfer", "PhaseState", "Wave", "Frequency", "Wavelength", "Amplitude", "ElectricCharge", "Current", "Voltage", "Resistance", "ElectricCircuit", "Measurement", "ModelAssumption", "BoundaryCondition", "PhysicalSystemBoundary"],
    frames: ["Move", "ExertsForce", "TransfersEnergy", "Heats", "ChangesPhase", "Propagates", "Flows", "MeasuredAs", "UnderModel"],
    capabilities: ["DimensionAndUnitFinding", "KinematicsFinding", "ForceBalanceFinding", "EnergyAccountingFinding", "ThermalDirectionFinding", "WaveRelationFinding", "SimpleCircuitFinding", "ModelAssumptionFinding", "PhysicsExplanationPlan"],
    signals: ["force", "mass", "speed", "energy", "temperature", "wave", "voltage", "resistance"],
    sections: ["system boundary", "givens", "law", "calculation", "result", "assumptions"]
  },
  {
    id: "chemistry-basic",
    modules: ["matter-substances", "particles", "formulae", "reactions", "states-solutions", "acids-bases", "laboratory-description"],
    concepts: ["MaterialSample", "PureSubstance", "Element", "Compound", "Mixture", "Atom", "Molecule", "Ion", "ChemicalSymbol", "ChemicalFormula", "ChemicalReaction", "Reactant", "Product", "PhysicalChange", "ChemicalChange", "PhaseState", "Solution", "Solute", "Solvent", "Acidic", "Neutral", "Basic", "LaboratoryObservation", "ReactionCondition"],
    frames: ["ComposedOf", "ContainsSample", "Reacts", "Dissolves", "ChangesPhase", "Separates", "HasPH", "ObservedAs"],
    capabilities: ["ChemicalCategoryFinding", "FormulaCompositionFinding", "ReactionBalanceFinding", "PhysicalChemicalChangeFinding", "SolutionRelationFinding", "AcidBaseFinding", "LaboratorySequenceFinding", "ChemistryExplanationPlan"],
    signals: ["reaction", "compound", "mixture", "atom", "molecule", "pH", "solution", "laboratory"],
    sections: ["substances", "process", "observation", "equation", "interpretation", "limitation"]
  },
  {
    id: "biology-basic",
    modules: ["organization", "cell-biology", "organisms-systems", "reproduction-inheritance", "ecology", "evolution-adaptation", "health-experiment"],
    concepts: ["BiologicalEntity", "LevelOfOrganization", "Molecule", "Organelle", "Cell", "Tissue", "Organ", "OrganSystem", "Organism", "Species", "Population", "Community", "Ecosystem", "Biosphere", "Trait", "Gene", "InheritedVariant", "EnvironmentalInfluence", "LifecycleStage", "ReproductiveEvent", "Habitat", "Resource", "EcologicalInteraction", "Adaptation", "Variation", "SelectionProcess", "BiologicalObservation", "Sample"],
    frames: ["PartOfBiological", "PerformsFunction", "DevelopsFrom", "Inherits", "LivesIn", "Consumes", "CompetesWith", "PredatesOn", "CooperatesWith", "SelectedUnder", "ObservedIn"],
    capabilities: ["BiologicalLevelFinding", "StructureFunctionFinding", "LifecycleFinding", "InheritanceFinding", "EcologyRelationFinding", "EvolutionReasoningFinding", "EvidenceGeneralizationFinding", "BiologyExplanationPlan"],
    signals: ["cell", "organ", "organism", "species", "ecosystem", "gene", "trait", "evolution"],
    sections: ["organization level", "process", "evidence", "variation", "limitation"]
  },
  {
    id: "psychology-basic",
    modules: ["perception-knowledge", "memory", "goals-intentions", "emotion", "motivation", "perspective", "interaction"],
    concepts: ["MentalAgent", "Perspective", "MentalContext", "Perception", "Belief", "Knowledge", "Uncertainty", "MemoryTrace", "Remember", "Forget", "Desire", "Goal", "Intention", "Plan", "Attempt", "EmotionState", "Appraisal", "Regulation", "Motivation", "Incentive", "Need", "Value", "TrustState", "Expectation", "MentalStateEvidence"],
    frames: ["Perceives", "Believes", "Knows", "Remembers", "Wants", "Intends", "Attempts", "Appraises", "Feels", "MotivatedBy", "ReportsMentalState"],
    capabilities: ["KnowledgeAccessFinding", "MotivationContinuityFinding", "EmotionTransitionFinding", "BeliefActionConsistencyFinding", "PerspectiveAttributionFinding", "MindReadingWarning", "GoalConflictCircuit", "CharacterArcPlan"],
    signals: ["believe", "know", "remember", "goal", "intend", "emotion", "motivation", "perspective"],
    sections: ["initial state", "goal", "obstacle", "choice", "consequence", "change"]
  },
  {
    id: "anthropology-basic",
    modules: ["culture-practice", "norm-ritual", "kinship-household", "subsistence-exchange", "material-culture", "identity-perspective", "evidence-change"],
    concepts: ["CulturalGroup", "Community", "Population", "CulturalPractice", "Norm", "Value", "Symbol", "Ritual", "LifeEvent", "KinRelation", "Household", "DescentRelation", "SubsistenceStrategy", "ExchangePractice", "MaterialCultureArtifact", "IdentityCategory", "SocialRole", "EmicConcept", "EticConcept", "EvidenceSource", "StatedNorm", "ObservedPractice", "ReportedValue", "IndividualAction", "AnalystInterpretation"],
    frames: ["PracticedBy", "ExpectedBy", "Symbolizes", "RelatedBy", "ExchangedBetween", "ObservedBy", "CategorizedAs", "ChangesThrough"],
    capabilities: ["CulturalOvergeneralizationFinding", "ContextLossFinding", "EmicEticConfusionFinding", "KinshipProjectionFinding", "NormPracticeConfusionFinding", "EvidencePerspectiveFinding", "CulturalChangeFinding", "EthnographicExplanationPlan"],
    signals: ["culture", "ritual", "custom", "kinship", "community", "tradition", "identity", "ethnographic"],
    sections: ["context", "practice", "participant meaning", "evidence", "variation", "limitation"]
  },
  {
    id: "sociology-basic",
    modules: ["actors-groups", "roles-norms", "institutions", "networks", "power-resources", "inequality-demography", "collective-process"],
    concepts: ["IndividualActor", "Group", "Organization", "Institution", "Population", "SocialCategory", "Status", "Role", "Norm", "Expectation", "Sanction", "SocialTie", "Network", "Position", "Resource", "Authority", "PowerRelation", "Dependency", "Distribution", "InequalityMeasure", "DemographicMeasure", "CollectiveAction", "InstitutionalChange", "SurveyClaim", "AggregateClaim", "CaseEvidence", "IndividualLevel", "InteractionLevel", "GroupLevel", "OrganizationLevel", "InstitutionLevel", "PopulationLevel"],
    frames: ["MemberOf", "OccupiesRole", "ExpectedTo", "ConnectedTo", "Controls", "DependsOn", "DistributedAcross", "MeasuredIn", "Influences"],
    capabilities: ["LevelOfAnalysisFinding", "EcologicalFallacyFinding", "IndividualisticFallacyFinding", "RoleInstitutionFinding", "NetworkPathFinding", "CorrelationCausationFinding", "PopulationScopeFinding", "SocialExplanationPlan"],
    signals: ["group", "institution", "organization", "population", "norm", "power", "network", "survey"],
    sections: ["actor level", "structure", "mechanism", "evidence", "alternative", "limitation"]
  },
  {
    id: "logic-basic",
    modules: ["propositions", "predicates-terms", "quantifiers", "modality", "natural-logic", "proof-steps", "four-valued"],
    concepts: ["Proposition", "AtomicProposition", "CompoundProposition", "Predicate", "Term", "Variable", "Constant", "Universal", "Existential", "CardinalityQuantifier", "Implication", "Equivalence", "Conjunction", "Disjunction", "Negation", "ModalProposition", "ModalOperator", "EntailmentRelation", "ContradictionRelation", "Premise", "Conclusion", "ProofStep", "Countermodel", "LogicValue"],
    frames: ["And", "Or", "Not", "Implies", "Equivalent", "ForAll", "Exists", "Exactly", "AtLeast", "AtMost", "Necessary", "Possible", "Obligatory", "Permitted", "Believed", "Entails", "Contradicts", "UsesRule"],
    capabilities: ["DirectContradictionFinding", "LocalEntailmentFinding", "QuantifierScopeFinding", "ModalConfusionFinding", "EqualitySubstitutionFinding", "ConsistencySetCircuit", "ProofStepCircuit", "LogicExplanationPlan"],
    signals: ["all", "some", "none", "if", "then", "unless", "must", "possible", "contradiction"],
    sections: ["premises", "rule", "conclusion", "assumptions", "counterexample"]
  },
  {
    id: "reasoning-errors",
    modules: ["argument-structure", "definition-use", "evidence-authority", "causality", "generalization", "dialogue", "error-patterns"],
    concepts: ["Argument", "Premise", "Conclusion", "Inference", "EvidenceRelation", "SourceAuthority", "DefinitionUse", "TermSense", "CausalClaim", "CorrelationClaim", "AlternativeExplanation", "GeneralizationClaim", "Sample", "Population", "OpponentPosition", "ReconstructedClaim", "ReasoningErrorPattern", "Counterexample", "BurdenOfSupport", "MissingPremise"],
    frames: ["Supports", "Attacks", "Defines", "UsesSense", "Cites", "GeneralizesFrom", "AttributesCause", "RepresentsOpponent"],
    capabilities: ["ContradictionClassifier", "AffirmingConsequentFinding", "DenyingAntecedentFinding", "CircularReasoningFinding", "EquivocationFinding", "FalseDilemmaFinding", "HastyGeneralizationFinding", "CorrelationCausationFinding", "AdHominemFinding", "AppealToAuthorityFinding", "StrawManFinding", "SlipperySlopeFinding", "CompositionDivisionFinding", "BaseRateAndSelectionWarning", "ArgumentRepairPlan"],
    signals: ["therefore", "because", "proves", "always", "only", "everyone", "obviously", "fallacy"],
    sections: ["claim", "premise", "missing support", "qualifier", "objection", "repair"]
  },
  {
    id: "law-basic",
    modules: ["authority-jurisdiction", "persons-roles", "norms", "conditions-exceptions", "time-procedure", "definitions-references", "evidence-remedy"],
    concepts: ["NormativeAuthority", "Jurisdiction", "LegalSource", "LegalPerson", "NaturalPerson", "Organization", "PublicBody", "LegalRole", "Party", "Beneficiary", "DecisionMaker", "Norm", "Obligation", "Prohibition", "Permission", "Right", "Power", "Immunity", "Recommendation", "PolicyGoal", "Condition", "Exception", "Exemption", "Defense", "Procedure", "Notice", "Approval", "Appeal", "Deadline", "DefinedTerm", "CrossReference", "LegalEvidence", "Decision", "Sanction", "Remedy"],
    frames: ["IssuedBy", "AppliesIn", "Binds", "Benefits", "Requires", "Forbids", "Permits", "ConditionalOn", "ExceptWhen", "Overrides", "MustPrecede", "DefinedAs", "RemediedBy"],
    capabilities: ["NormFrameCompletenessFinding", "DefinitionConsistencyFinding", "NormConflictFinding", "AuthorityJurisdictionFinding", "ProcedureOrderFinding", "DeadlineFinding", "CrossReferenceFinding", "ExceptionCoverageFinding", "LegalBasisFinding", "NormativeCNLRepair", "PolicySpecificationPlan"],
    signals: ["must", "shall", "may", "prohibited", "entitled", "authority", "jurisdiction", "article", "appeal"],
    sections: ["definitions", "scope", "roles", "rules", "procedure", "evidence", "remedy"]
  },
  {
    id: "social-interaction",
    modules: ["speech-acts", "consent-boundaries", "cooperation", "conflict", "roles-power", "fairness", "communication-quality"],
    concepts: ["Interaction", "SpeechAct", "Conversation", "Request", "Order", "Offer", "Promise", "Refusal", "Apology", "Consent", "Permission", "Boundary", "Withdrawal", "SharedGoal", "Contribution", "Cooperation", "Conflict", "Disagreement", "Accusation", "RepairAttempt", "Relationship", "Role", "Authority", "Dependency", "PrivacyExpectation", "Disclosure", "FairnessClaim", "Justification", "CommitmentState", "Clarity", "Ambiguity", "TurnTaking", "Acknowledgment"],
    frames: ["DirectedTo", "CommitsTo", "Requests", "ConsentsTo", "Withdraws", "SharesGoal", "Contributes", "Discloses", "Repairs"],
    capabilities: ["SpeechActClassificationFinding", "PromiseClosureFinding", "ConsentStructureFinding", "BoundaryConflictFinding", "PrivacyDisclosureFinding", "CooperationContributionFinding", "ConflictEscalationFinding", "FairnessReasoningFinding", "SocialAttributionWarning", "DialogueAndInteractionPlan"],
    signals: ["request", "promise", "consent", "apology", "conflict", "privacy", "fairness", "dialogue"],
    sections: ["goal", "speech act", "boundary", "commitment", "repair", "confirmation"]
  }
];

// Capability prerequisites are explicit semantic applicability anchors. Keeping
// them separate from list position prevents an added ontology concept from
// silently retargeting an existing circuit.
const requirementHints = Object.freeze({
  "core-commonsense": ["PhysicalObject", "Move", "Ability", "KnowledgeState", "Enable", "ExistenceState", "PossessionState", "Condition"],
  "world-basic": ["StableWorldFact", "Artifact", "CalendarUnit", "Map", "TypicalProperty", "GeographicRegion", "InformationArtifact"],
  "math-basic": ["Number", "Equation", "Percentage", "Dimension", "GeometricFigure", "Dataset", "Probability", "DerivationStep"],
  "physics-basic": ["Measurement", "MotionState", "Force", "Energy", "Temperature", "Wave", "ElectricCircuit", "ModelAssumption"],
  "chemistry-basic": ["MaterialSample", "ChemicalFormula", "ChemicalReaction", "ChemicalChange", "Solution", "Acidic", "LaboratoryObservation"],
  "biology-basic": ["LevelOfOrganization", "Cell", "LifecycleStage", "InheritedVariant", "EcologicalInteraction", "Adaptation", "BiologicalObservation"],
  "psychology-basic": ["Knowledge", "Motivation", "EmotionState", "Belief", "Perspective", "MentalStateEvidence", "Goal"],
  "anthropology-basic": ["CulturalPractice", "CulturalGroup", "EmicConcept", "KinRelation", "Norm", "EvidenceSource", "CulturalPractice"],
  "sociology-basic": ["IndividualLevel", "AggregateClaim", "IndividualActor", "Role", "Network", "PowerRelation", "Population"],
  "logic-basic": ["Proposition", "Proposition", "Universal", "ModalProposition", "Term", "Proposition", "ProofStep"],
  "reasoning-errors": ["Argument", "Inference", "Inference", "Argument", "TermSense", "Argument", "GeneralizationClaim", "CausalClaim", "OpponentPosition", "SourceAuthority", "ReconstructedClaim", "CausalClaim", "GeneralizationClaim", "Sample"],
  "law-basic": ["Norm", "DefinedTerm", "Norm", "NormativeAuthority", "Procedure", "Deadline", "CrossReference", "Exception", "LegalEvidence"],
  "social-interaction": ["SpeechAct", "Promise", "Consent", "Boundary", "Disclosure", "Contribution", "Conflict", "FairnessClaim", "Justification"]
});

const quote = (value) => JSON.stringify(value);
const exportName = (name) => name.replace(/[^A-Za-z0-9_$]/g, "_").replace(/^[0-9]/, "_$&");

function distribute(pack) {
  const allocation = domainModuleAllocations[pack.id];
  if (!allocation) throw new Error(`Missing semantic module allocation for ${pack.id}.`);
  const configuredModules = Object.keys(allocation);
  const unknownModules = configuredModules.filter((name) => !pack.modules.includes(name));
  const missingModules = pack.modules.filter((name) => !configuredModules.includes(name));
  if (unknownModules.length || missingModules.length) {
    throw new Error(`${pack.id} module allocation mismatch: unknown [${unknownModules.join(", ")}], missing [${missingModules.join(", ")}].`);
  }
  const validateInventory = (kind, expected) => {
    const assigned = pack.modules.flatMap((name) => allocation[name][kind] ?? []);
    const duplicates = assigned.filter((name, index) => assigned.indexOf(name) !== index);
    const missing = expected.filter((name) => !assigned.includes(name));
    const unknown = assigned.filter((name) => !expected.includes(name));
    if (duplicates.length || missing.length || unknown.length) {
      throw new Error(`${pack.id} ${kind} allocation mismatch: duplicates [${[...new Set(duplicates)].join(", ")}], missing [${missing.join(", ")}], unknown [${unknown.join(", ")}].`);
    }
  };
  validateInventory("concepts", pack.concepts);
  validateInventory("frames", pack.frames);
  const buckets = new Map(pack.modules.map((name) => [name, {
    concepts: [...(allocation[name].concepts ?? [])],
    frames: [...(allocation[name].frames ?? [])]
  }]));
  return buckets;
}

function generationCapabilities(pack) { const selected = pack.capabilities.filter((name) => /Plan|Repair|Demand$/.test(name)); return selected.length ? selected : [`${exportName(pack.id)}GenerationPlan`]; }

function ontologySource(pack, moduleName, bucket) {
  const lines = [
    "import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from \"../../../sdk/ontology/ontology.mjs\";",
    "import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from \"../../core-language/ontologies/core.ontology.mjs\";",
    "",
    `const O = ontology(${quote(`${pack.id}.${moduleName}`)}, \"1.0.0\");`
  ];
  for (const concept of bucket.concepts) {
    lines.push(`export const ${exportName(concept)} = O.entity(`, `  entityKind(${quote(concept)}).provide(capability(${quote(concept)}))`, ");");
  }
  const commonRoles = ["actor", "theme", "subject", "objectRole", "source", "target", "location", "time", "context", "evidence", "value", "sourceFrom", "destination"];
  for (const frame of bucket.frames) {
    lines.push(
      `export const ${exportName(frame)} = O.event(`,
      `  eventKind(${quote(frame)})`,
      ...commonRoles.map((roleName) => `    .role(allows(${roleName}, atMostOne()))`),
      `    .provide(capability(${quote(frame)}))`,
      ");"
    );
  }
  const lexicalTargets = [...bucket.concepts, ...bucket.frames];
  for (const targetName of lexicalTargets) lines.push(`O.lexicon(lexicalize(${exportName(targetName)}).english(${quote(targetName.replace(/([a-z])([A-Z])/g, "$1 $2").toLocaleLowerCase("en"))}));`);
  lines.push("", "export default O.seal();", "");
  return lines.join("\n");
}

function consistencySource(pack, conceptLocations) {
  const lines = ["import { createCheckCircuit } from \"../../shared/check-runtime.mjs\";", ""];
  const generated = new Set(generationCapabilities(pack));
  const checkCapabilities = pack.capabilities.filter((capabilityName) => !generated.has(capabilityName));
  checkCapabilities.forEach((capabilityName, index) => {
    const conceptName = requirementHints[pack.id]?.[index] ?? pack.concepts[index % pack.concepts.length];
    const identity = `${pack.id}.${conceptLocations.get(conceptName)}:${conceptName}`;
    lines.push(`export const ${exportName(capabilityName)} = createCheckCircuit(${quote(pack.id)}, ${quote(capabilityName)}, [${quote(identity)}]);`);
  });
  lines.push("", `export default Object.freeze([${checkCapabilities.map(exportName).join(", ")}]);`, "");
  return lines.join("\n");
}

function generationSource(pack) {
  const names = generationCapabilities(pack);
  return `import { createGenerationCircuit } from "../../shared/check-runtime.mjs";\n${names.map((name) => `export const ${exportName(name)} = createGenerationCircuit(${quote(pack.id)}, ${quote(name)}, ${quote(pack.sections)});`).join("\n")}\nexport default Object.freeze([${names.map(exportName).join(", ")}]);\n`;
}

function packSource(pack) {
  const ontologyImports = pack.modules.map((name, index) => `import ontology${index} from "./ontologies/${name}.ontology.mjs";`).join("\n");
  return `import { domainPack, ontologyModule, circuitModule, lexicalSignals, semanticSignals, capability, domainTier, lowerSecondary } from "../../sdk/ontology/packs.mjs";
${ontologyImports}
import consistencyCircuits from "./circuits/consistency.circuit.mjs";
import generationCircuits from "./circuits/generation.circuit.mjs";

export const ontologies = Object.freeze([${pack.modules.map((_, index) => `ontology${index}`).join(", ")}]);
export const circuits = Object.freeze([...consistencyCircuits, ...generationCircuits]);

export default domainPack(${quote(pack.id)}, "1.0.0")
  .ontology(...ontologies.map(ontologyModule))
  .circuit(...circuits.map(circuitModule))
  .recognize(lexicalSignals(${pack.signals.map(quote).join(", ")}), semanticSignals(${pack.concepts.slice(0, 5).map(quote).join(", ")}))
  .provide(
    ${pack.capabilities.map((name) => `capability(${quote(name)})`).join(",\n    ")}
  )
  .tier(domainTier()).knowledgeLevel(lowerSecondary()).seal();
`;
}

function testSources(pack) {
  return {
    "ontology.test.mjs": `import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";

test(${quote(`${pack.id} ontologies are sealed and distinct`)}, () => {
  assert.equal(pack.id, ${quote(pack.id)});
  assert.equal(pack.ontologies.length, ${pack.modules.length});
  assert.equal(new Set(pack.ontologies.map((ontology) => ontology.identity)).size, ${pack.modules.length});
  assert.ok(pack.ontologies.every((ontology) => ontology.concepts.length > 0));
});
`,
    "circuits.test.mjs": `import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";
import { SemanticStore, CircuitRunner } from "../../../runtime/index.mjs";
import { describe, section, claim, groundedAt, sourceUnit, sequence } from "../../../sdk/longtext/index.mjs";

const checkCircuits = pack.circuits.filter(
  (circuit) => circuit.emissions.some((entry) => entry.kind === "finding-emission")
);
for (const circuit of checkCircuits) {
  test(\`${pack.id} \${circuit.id} executes with grounded applicable evidence\`, async () => {
    const store = new SemanticStore();
    for (const ontology of pack.ontologies) store.installOntology(ontology);
    const requiredIdentity = circuit.requirements[0]?.identity;
    const ontology = pack.ontologies.find(
      (candidate) => candidate.concepts.some((concept) => concept.identity === requiredIdentity)
    );
    assert.ok(ontology, \`Missing ontology for \${requiredIdentity}\`);
    const definition = ontology.concepts.find((concept) => concept.identity === requiredIdentity);
    const term = ontology.constructorFor(definition.name)();
    const unit = sourceUnit("fixture", { sourceId: "fixture", text: "grounded semantic fixture" });
    const model = describe("fixture")
      .section(section("body", sequence(claim(term).grounding(groundedAt(unit.span(0, 8))))))
      .commit();
    store.beginTransaction("fixture").longText(model).commit();
    const result = await new CircuitRunner().run(circuit, store);
    assert.equal(result.findings.length, 1);
    assert.notEqual(result.findings[0].status(), "NOT_APPLICABLE");
    assert.ok(result.findings[0].evidence().size() > 0);
  });
}
`,
    "intent.test.mjs": `import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";

test(${quote(`${pack.id} exposes deterministic intent signals`)}, () => {
  const result = pack.recognizes(${quote(`This source discusses ${pack.signals[0]}.`)});
  assert.equal(result.matched, true);
  assert.ok(result.matches.includes(${quote(pack.signals[0])}));
});
`,
    "cnl.test.mjs": `import test from "node:test";
import assert from "node:assert/strict";
import pack from "../pack.mjs";
import { SemanticStore, CircuitRunner } from "../../../runtime/index.mjs";
import { renderCanonicalCNL, parseCanonicalCNL } from "../../../sdk/cnl/index.mjs";
import { compareFrames } from "../../../sdk/cnl/compare.mjs";

const generationCircuits = pack.circuits.filter(
  (circuit) => circuit.emissions.some((entry) => entry.kind === "cnl-emission")
);
for (const circuit of generationCircuits) {
  test(\`${pack.id} \${circuit.id} CNL round-trips\`, async () => {
    const result = await new CircuitRunner().run(circuit, new SemanticStore());
    assert.equal(result.frames.length, 1);
    const text = renderCanonicalCNL(result.frames[0]);
    assert.equal(compareFrames(result.frames[0], parseCanonicalCNL(text)).equivalent, true);
  });
}
`
  };
}

async function generatePack(pack) {
  const packRoot = resolve(root, "framework", "packs", pack.id);
  for (const directory of ["ontologies", "circuits", "cnl", "tests"]) await mkdir(resolve(packRoot, directory), { recursive: true });
  const buckets = distribute(pack); const conceptLocations = new Map();
  for (const [moduleName, bucket] of buckets) {
    for (const concept of [...bucket.concepts, ...bucket.frames]) conceptLocations.set(concept, moduleName);
    await writeFile(resolve(packRoot, "ontologies", `${moduleName}.ontology.mjs`), ontologySource(pack, moduleName, bucket));
  }
  await writeFile(resolve(packRoot, "circuits", "consistency.circuit.mjs"), consistencySource(pack, conceptLocations));
  await writeFile(resolve(packRoot, "circuits", "generation.circuit.mjs"), generationSource(pack));
  await writeFile(resolve(packRoot, "circuits", "selection.circuit.mjs"), `export { default } from "./consistency.circuit.mjs";\n`);
  await writeFile(resolve(packRoot, "circuits", "index.mjs"), `export { default as consistencyCircuits } from "./consistency.circuit.mjs";\nexport { default as generationCircuits } from "./generation.circuit.mjs";\n`);
  await writeFile(resolve(packRoot, "cnl", "frames.mjs"), `export { generationPlan, findingFrame, clarificationFrame, repairFrame } from "../../../sdk/cnl/frames.mjs";\n`);
  await writeFile(resolve(packRoot, "cnl", "lexicon.en.mjs"), `export const lexicon = Object.freeze(new Map(${quote(pack.signals.map((signal) => [signal, signal]))}));\n`);
  await writeFile(resolve(packRoot, "cnl", "renderer.mjs"), `export { renderCanonicalCNL as render } from "../../../sdk/cnl/grammar.mjs";\n`);
  await writeFile(resolve(packRoot, "pack.mjs"), packSource(pack));
  for (const [name, source] of Object.entries(testSources(pack))) await writeFile(resolve(packRoot, "tests", name), source);
}

for (const pack of packs) await generatePack(pack);
console.log(`Generated ${packs.length} executable domain packs.`);
