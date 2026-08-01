import test from "node:test";
import assert from "node:assert/strict";
import ontologyModel, {
  CalibrationCertificate,
  CalibrationValidity,
  ContainerSeal,
  CustodyParty,
  CustodyTransfer,
  IdentifierRecording,
  ResearchSample,
  TemperatureReading,
  Thermometer,
  TransferPhase,
  TransferRecord,
  phase,
  transfer
} from "../ontologies/cold-chain-transfer.ontology.mjs";
import {
  Evidence,
  InformationArtifact,
  PhysicalObject,
  SemanticEntity,
  actor,
  evidence,
  from,
  quantity,
  source,
  subject,
  theme,
  to
} from "../../../../../../../framework/packs/core-language/ontologies/core.ontology.mjs";
import {
  CustodyTransfer as GeneratedCustodyTransfer,
  ResearchSample as GeneratedResearchSample,
  from as generatedFrom,
  theme as generatedTheme,
  to as generatedTo
} from "../sdk/ontology.generated.mjs";

const identityOf = (value) => value.identity();
const concept = (name) => ontologyModel.concepts.find((entry) => entry.name === name);

test("task ontology adds only cold-chain meanings and no source facts", () => {
  assert.equal(ontologyModel.id, "task-cold-chain-transfer-core-only.cold-chain-transfer");
  assert.equal(ontologyModel.version, "1.0.0");
  assert.deepEqual(ontologyModel.facts, []);
  assert.deepEqual(ontologyModel.laws, []);
  assert.equal(ontologyModel.concepts.length, 17);
  assert.equal(ontologyModel.roles.length, 4);
});

test("task concepts reuse core-language identities without redefining them", () => {
  assert.deepEqual(concept("ResearchSample").parents, [
    identityOf(PhysicalObject),
    identityOf(SemanticEntity)
  ]);
  assert.deepEqual(concept("TransferRecord").parents, [
    identityOf(InformationArtifact),
    identityOf(Evidence)
  ]);
  assert.deepEqual(concept("CalibrationCertificate").parents, [
    identityOf(InformationArtifact),
    identityOf(Evidence)
  ]);
  assert.equal(identityOf(theme), "core-language:theme");
  assert.equal(identityOf(from), "core-language:from");
  assert.equal(identityOf(to), "core-language:to");
  assert.equal(identityOf(evidence), "core-language:evidence");
  assert.equal(transfer.definition().range, identityOf(CustodyTransfer));
  assert.equal(phase.definition().range, identityOf(TransferPhase));
});

test("typed constructors express recorded support separately from calibration validity", () => {
  const sample = ResearchSample();
  const releasingParty = CustodyParty();
  const receivingParty = CustodyParty();
  const transferTerm = CustodyTransfer(
    theme(sample),
    from(releasingParty),
    to(receivingParty)
  );
  const record = TransferRecord();
  const seal = ContainerSeal();
  const thermometer = Thermometer();
  const certificate = CalibrationCertificate();
  const beforeHandoff = TransferPhase("before-handoff");

  const recordedIdentifier = IdentifierRecording(
    subject(seal),
    transfer(transferTerm),
    evidence(record)
  );
  const reading = TemperatureReading(
    subject(sample),
    source(thermometer),
    quantity(6.2),
    phase(beforeHandoff),
    transfer(transferTerm),
    evidence(record)
  );
  const validity = CalibrationValidity(
    subject(thermometer),
    transfer(transferTerm),
    evidence(certificate)
  );

  assert.equal(recordedIdentifier.descriptor().concept, identityOf(IdentifierRecording));
  assert.equal(reading.descriptor().concept, identityOf(TemperatureReading));
  assert.equal(validity.descriptor().concept, identityOf(CalibrationValidity));
  assert.notEqual(identityOf(IdentifierRecording), identityOf(CalibrationValidity));
});

test("frame cardinality and role ranges reject incomplete or mistyped terms", () => {
  const sample = ResearchSample();
  const party = CustodyParty();
  const transferTerm = CustodyTransfer(theme(sample), from(party), to(party));

  assert.throws(
    () => CustodyTransfer(theme(sample), from(party)),
    /ONTOLOGY_CARDINALITY_MINIMUM/
  );
  assert.throws(
    () => TemperatureReading(
      subject(sample),
      source(Thermometer()),
      quantity(6.2),
      phase(sample),
      transfer(transferTerm)
    ),
    /ONTOLOGY_ROLE_RANGE/
  );
  assert.throws(
    () => CalibrationValidity(
      subject(Thermometer()),
      transfer(transferTerm),
      evidence(sample)
    ),
    /ONTOLOGY_ROLE_RANGE/
  );
  assert.doesNotThrow(() => actor(party));
});

test("generated facade preserves canonical constructors for later task phases", () => {
  assert.equal(identityOf(GeneratedResearchSample), identityOf(ResearchSample));
  assert.equal(identityOf(GeneratedCustodyTransfer), identityOf(CustodyTransfer));

  const sample = GeneratedResearchSample();
  const party = CustodyParty();
  const term = GeneratedCustodyTransfer(
    generatedTheme(sample),
    generatedFrom(party),
    generatedTo(party)
  );
  assert.equal(term.descriptor().concept, identityOf(CustodyTransfer));
});
