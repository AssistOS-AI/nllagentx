// Explicit semantic ownership for generated domain-pack ontology symbols.
// The generator validates this catalog against each pack inventory so a new
// concept or frame cannot silently land in an unrelated module.
export const domainModuleAllocations = Object.freeze({
  "core-commonsense": {
    entities: { concepts: ["Agent", "Person", "GroupAgent", "PhysicalObject", "Substance", "Tool", "InformationArtifact"], frames: ["Create", "Destroy", "Appear", "Disappear"] },
    space: { concepts: ["Place", "Region", "Container", "Surface", "LocationState"], frames: ["Move", "Arrive", "Depart", "Enter", "Exit", "PlaceIn", "RemoveFrom"] },
    events: { concepts: ["Condition"], frames: ["Open", "Close", "Lock", "Unlock", "Break", "Repair"] },
    agency: { concepts: ["Goal", "Plan", "Ability"], frames: ["Use", "Attempt", "Succeed", "Fail"] },
    continuity: { concepts: ["KnowledgeState", "BeliefState", "PossessionState", "AccessState", "ExistenceState"], frames: ["Give", "Receive", "Acquire", "Lose", "Take", "Return", "Observe", "Tell", "Learn", "Forget"] },
    causality: { concepts: [], frames: ["Prevent", "Enable"] }
  },
  "world-basic": {
    "time-calendar": { concepts: ["CalendarUnit"], frames: ["OccursDuring"] },
    "earth-geography": { concepts: ["GeographicRegion", "Earth", "Land", "WaterBody", "Continent", "Country", "Region", "City", "Village", "River", "Lake", "Sea", "Ocean", "Mountain", "Map"], frames: ["LocatedIn", "PartOf"] },
    institutions: { concepts: ["Institution", "Family", "School", "University", "Company", "Government", "Court", "Hospital", "Market", "Library", "Museum", "MediaOrganization", "Bank", "NonprofitOrganization"], frames: ["InstitutionalRole"] },
    artifacts: { concepts: ["Artifact", "Vehicle", "InformationArtifact", "Book", "Document", "Record", "Message", "Computer", "Phone", "Camera", "Building", "Door", "Key", "Lock", "Machine"], frames: ["HasFunction", "UsedFor"] },
    "materials-food-health": { concepts: ["Material", "Food", "HealthState"], frames: ["MadeOf", "TypicalProperty"] },
    measurement: { concepts: ["Clock", "Thermometer", "Scale"], frames: [] },
    "fact-provenance": { concepts: ["StableWorldFact"], frames: ["PackFact"] }
  },
  "math-basic": {
    "numbers-arithmetic": { concepts: ["Number", "Integer", "Rational", "DecimalApproximation"], frames: ["Add", "Subtract", "Multiply", "Divide", "Power", "Root", "Equals", "LessThan", "GreaterThan", "Between"] },
    "ratios-percentages": { concepts: ["Ratio", "Rate", "Percentage", "Proportion"], frames: ["ProportionalTo", "RateOfChange"] },
    algebra: { concepts: ["Expression", "Variable", "Equation", "Inequality"], frames: ["EquivalentExpression"] },
    geometry: { concepts: ["Length", "Area", "Volume", "Angle", "GeometricFigure"], frames: ["Perimeter", "AreaCalculation", "VolumeCalculation"] },
    measurement: { concepts: ["Dimension"], frames: ["HasMeasure"] },
    "probability-statistics": { concepts: ["Dataset", "Observation", "Mean", "Median", "Mode", "Range", "FiniteExperiment", "Outcome", "Probability"], frames: ["ProbabilityOf"] },
    "proof-explanation": { concepts: ["MathematicalClaim", "DerivationStep"], frames: ["DerivedFrom"] }
  },
  "physics-basic": {
    motion: { concepts: ["PhysicalBody", "Position", "MotionState", "Velocity", "Acceleration"], frames: ["Move"] },
    forces: { concepts: ["Force", "Interaction", "EquilibriumState"], frames: ["ExertsForce"] },
    energy: { concepts: ["Energy", "Work", "Power", "EnergyTransfer"], frames: ["TransfersEnergy"] },
    thermal: { concepts: ["Temperature", "HeatTransfer", "PhaseState"], frames: ["Heats", "ChangesPhase"] },
    waves: { concepts: ["Wave", "Frequency", "Wavelength", "Amplitude"], frames: ["Propagates"] },
    "electricity-magnetism": { concepts: ["ElectricCharge", "Current", "Voltage", "Resistance", "ElectricCircuit"], frames: ["Flows"] },
    "models-units": { concepts: ["PhysicalSystem", "ParticleCollection", "Measurement", "ModelAssumption", "BoundaryCondition", "PhysicalSystemBoundary"], frames: ["MeasuredAs", "UnderModel"] }
  },
  "chemistry-basic": {
    "matter-substances": { concepts: ["MaterialSample", "PureSubstance", "Element", "Compound", "Mixture"], frames: ["ContainsSample"] },
    particles: { concepts: ["Atom", "Molecule", "Ion"], frames: ["ComposedOf"] },
    formulae: { concepts: ["ChemicalSymbol", "ChemicalFormula"], frames: [] },
    reactions: { concepts: ["ChemicalReaction", "Reactant", "Product", "ChemicalChange", "ReactionCondition"], frames: ["Reacts"] },
    "states-solutions": { concepts: ["PhysicalChange", "PhaseState", "Solution", "Solute", "Solvent"], frames: ["Dissolves", "ChangesPhase", "Separates"] },
    "acids-bases": { concepts: ["Acidic", "Neutral", "Basic"], frames: ["HasPH"] },
    "laboratory-description": { concepts: ["LaboratoryObservation"], frames: ["ObservedAs"] }
  },
  "biology-basic": {
    organization: { concepts: ["BiologicalEntity", "LevelOfOrganization", "Molecule", "Organelle", "Tissue"], frames: ["PartOfBiological"] },
    "cell-biology": { concepts: ["Cell"], frames: ["PerformsFunction"] },
    "organisms-systems": { concepts: ["Organ", "OrganSystem", "Organism"], frames: [] },
    "reproduction-inheritance": { concepts: ["Trait", "Gene", "InheritedVariant", "EnvironmentalInfluence", "LifecycleStage", "ReproductiveEvent"], frames: ["DevelopsFrom", "Inherits"] },
    ecology: { concepts: ["Species", "Population", "Community", "Ecosystem", "Biosphere", "Habitat", "Resource", "EcologicalInteraction"], frames: ["LivesIn", "Consumes", "CompetesWith", "PredatesOn", "CooperatesWith"] },
    "evolution-adaptation": { concepts: ["Adaptation", "Variation", "SelectionProcess"], frames: ["SelectedUnder"] },
    "health-experiment": { concepts: ["BiologicalObservation", "Sample"], frames: ["ObservedIn"] }
  },
  "psychology-basic": {
    "perception-knowledge": { concepts: ["MentalAgent", "MentalContext", "Perception", "Belief", "Knowledge", "Uncertainty"], frames: ["Perceives", "Believes", "Knows"] },
    memory: { concepts: ["MemoryTrace", "Remember", "Forget"], frames: ["Remembers"] },
    "goals-intentions": { concepts: ["Desire", "Goal", "Intention", "Plan", "Attempt"], frames: ["Wants", "Intends", "Attempts"] },
    emotion: { concepts: ["EmotionState", "Appraisal", "Regulation"], frames: ["Appraises", "Feels"] },
    motivation: { concepts: ["Motivation", "Incentive", "Need", "Value"], frames: ["MotivatedBy"] },
    perspective: { concepts: ["Perspective", "MentalStateEvidence"], frames: ["ReportsMentalState"] },
    interaction: { concepts: ["TrustState", "Expectation"], frames: [] }
  },
  "anthropology-basic": {
    "culture-practice": { concepts: ["CulturalGroup", "Community", "Population", "CulturalPractice", "Value", "Symbol", "ReportedValue", "IndividualAction"], frames: ["PracticedBy", "Symbolizes"] },
    "norm-ritual": { concepts: ["Norm", "Ritual", "LifeEvent", "StatedNorm", "ObservedPractice"], frames: ["ExpectedBy"] },
    "kinship-household": { concepts: ["KinRelation", "Household", "DescentRelation"], frames: ["RelatedBy"] },
    "subsistence-exchange": { concepts: ["SubsistenceStrategy", "ExchangePractice"], frames: ["ExchangedBetween"] },
    "material-culture": { concepts: ["MaterialCultureArtifact"], frames: [] },
    "identity-perspective": { concepts: ["IdentityCategory", "SocialRole", "EmicConcept", "EticConcept", "AnalystInterpretation"], frames: ["CategorizedAs"] },
    "evidence-change": { concepts: ["EvidenceSource"], frames: ["ObservedBy", "ChangesThrough"] }
  },
  "sociology-basic": {
    "actors-groups": { concepts: ["IndividualActor", "Group", "Organization", "Population", "SocialCategory", "IndividualLevel", "InteractionLevel", "GroupLevel", "OrganizationLevel", "PopulationLevel"], frames: ["MemberOf"] },
    "roles-norms": { concepts: ["Status", "Role", "Norm", "Expectation", "Sanction"], frames: ["OccupiesRole", "ExpectedTo"] },
    institutions: { concepts: ["Institution", "InstitutionLevel", "InstitutionalChange"], frames: [] },
    networks: { concepts: ["SocialTie", "Network", "Position"], frames: ["ConnectedTo"] },
    "power-resources": { concepts: ["Resource", "Authority", "PowerRelation", "Dependency"], frames: ["Controls", "DependsOn", "Influences"] },
    "inequality-demography": { concepts: ["Distribution", "InequalityMeasure", "DemographicMeasure", "SurveyClaim", "AggregateClaim"], frames: ["DistributedAcross", "MeasuredIn"] },
    "collective-process": { concepts: ["CollectiveAction", "CaseEvidence"], frames: [] }
  },
  "logic-basic": {
    propositions: { concepts: ["Proposition", "AtomicProposition", "CompoundProposition", "Implication", "Equivalence", "Conjunction", "Disjunction", "Negation"], frames: ["And", "Or", "Not", "Implies", "Equivalent"] },
    "predicates-terms": { concepts: ["Predicate", "Term", "Variable", "Constant"], frames: [] },
    quantifiers: { concepts: ["Universal", "Existential", "CardinalityQuantifier"], frames: ["ForAll", "Exists", "Exactly", "AtLeast", "AtMost"] },
    modality: { concepts: ["ModalProposition", "ModalOperator"], frames: ["Necessary", "Possible", "Obligatory", "Permitted", "Believed"] },
    "natural-logic": { concepts: ["EntailmentRelation", "ContradictionRelation"], frames: ["Entails", "Contradicts"] },
    "proof-steps": { concepts: ["Premise", "Conclusion", "ProofStep", "Countermodel"], frames: ["UsesRule"] },
    "four-valued": { concepts: ["LogicValue"], frames: [] }
  },
  "reasoning-errors": {
    "argument-structure": { concepts: ["Argument", "Premise", "Conclusion", "Inference", "MissingPremise"], frames: ["Supports", "Attacks"] },
    "definition-use": { concepts: ["DefinitionUse", "TermSense"], frames: ["Defines", "UsesSense"] },
    "evidence-authority": { concepts: ["EvidenceRelation", "SourceAuthority", "BurdenOfSupport"], frames: ["Cites"] },
    causality: { concepts: ["CausalClaim", "CorrelationClaim", "AlternativeExplanation"], frames: ["AttributesCause"] },
    generalization: { concepts: ["GeneralizationClaim", "Sample", "Population", "Counterexample"], frames: ["GeneralizesFrom"] },
    dialogue: { concepts: ["OpponentPosition", "ReconstructedClaim"], frames: ["RepresentsOpponent"] },
    "error-patterns": { concepts: ["ReasoningErrorPattern"], frames: [] }
  },
  "law-basic": {
    "authority-jurisdiction": { concepts: ["NormativeAuthority", "Jurisdiction", "LegalSource"], frames: ["IssuedBy", "AppliesIn", "Overrides"] },
    "persons-roles": { concepts: ["LegalPerson", "NaturalPerson", "Organization", "PublicBody", "LegalRole", "Party", "Beneficiary", "DecisionMaker"], frames: ["Binds", "Benefits"] },
    norms: { concepts: ["Norm", "Obligation", "Prohibition", "Permission", "Right", "Power", "Immunity", "Recommendation", "PolicyGoal"], frames: ["Requires", "Forbids", "Permits"] },
    "conditions-exceptions": { concepts: ["Condition", "Exception", "Exemption", "Defense"], frames: ["ConditionalOn", "ExceptWhen"] },
    "time-procedure": { concepts: ["Procedure", "Notice", "Approval", "Appeal", "Deadline"], frames: ["MustPrecede"] },
    "definitions-references": { concepts: ["DefinedTerm", "CrossReference"], frames: ["DefinedAs"] },
    "evidence-remedy": { concepts: ["LegalEvidence", "Decision", "Sanction", "Remedy"], frames: ["RemediedBy"] }
  },
  "social-interaction": {
    "speech-acts": { concepts: ["Interaction", "SpeechAct", "Conversation", "Request", "Order", "Offer", "Promise", "Refusal", "Apology", "CommitmentState"], frames: ["DirectedTo", "CommitsTo", "Requests"] },
    "consent-boundaries": { concepts: ["Consent", "Permission", "Boundary", "Withdrawal", "PrivacyExpectation", "Disclosure"], frames: ["ConsentsTo", "Withdraws", "Discloses"] },
    cooperation: { concepts: ["SharedGoal", "Contribution", "Cooperation"], frames: ["SharesGoal", "Contributes"] },
    conflict: { concepts: ["Conflict", "Disagreement", "Accusation", "RepairAttempt"], frames: ["Repairs"] },
    "roles-power": { concepts: ["Relationship", "Role", "Authority", "Dependency"], frames: [] },
    fairness: { concepts: ["FairnessClaim", "Justification"], frames: [] },
    "communication-quality": { concepts: ["Clarity", "Ambiguity", "TurnTaking", "Acknowledgment"], frames: [] }
  }
});

export default domainModuleAllocations;
