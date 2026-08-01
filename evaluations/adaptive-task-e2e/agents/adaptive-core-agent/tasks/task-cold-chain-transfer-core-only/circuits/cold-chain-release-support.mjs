import { TRUE, FALSE, UNKNOWN, CONFLICT } from "../../../../../../../framework/sdk/core/logic.mjs";
import {
  actor, from, phase, quantity, source, subject, to, transfer
} from "../sdk/ontology.generated.mjs";

export const RELEASE_OUTCOMES = Object.freeze({ TRUE, FALSE, UNKNOWN, CONFLICT });

function identityOf(value) {
  if (typeof value?.identity === "function") return value.identity();
  if (typeof value?.identity === "string") return value.identity;
  return String(value);
}

function uniqueSemanticValues(values) {
  return [...new Map(values.filter(Boolean).map((value) => [identityOf(value), value])).values()]
    .sort((left, right) => identityOf(left).localeCompare(identityOf(right)));
}

function polarityOf(claim) {
  return claim.descriptor().polarity?.value?.() ?? "asserted";
}

function modalityOf(claim) {
  return claim.descriptor().modality?.value?.() ?? "actual";
}

function groundedClaims(store, term, polarity = null) {
  return store.claimsAbout(term)
    .filter((claim) => claim.groundings().length > 0)
    .filter((claim) => polarity === null || polarityOf(claim) === polarity)
    .sort((left, right) => identityOf(left).localeCompare(identityOf(right)));
}

function interpretationsCompatible(...claims) {
  const identities = new Set(claims
    .map((claim) => claim?.descriptor?.().interpretation)
    .filter(Boolean)
    .map(identityOf));
  return identities.size <= 1;
}

function commonInterpretation(claims) {
  const interpretations = uniqueSemanticValues(claims
    .map((claim) => claim?.descriptor?.().interpretation)
    .filter(Boolean));
  return interpretations.length === 1 ? interpretations[0] : null;
}

function evidenceFor(terms, claims) {
  return uniqueSemanticValues([
    ...terms,
    ...claims,
    ...claims.flatMap((claim) => claim.groundings())
  ]);
}

function roleValues(store, term, role) {
  const indexed = store.targets(term, role);
  const values = indexed.length > 0
    ? indexed
    : (term?.bindings?.() ?? [])
      .filter((binding) => identityOf(binding.role()) === identityOf(role))
      .map((binding) => binding.value());
  return [...values].sort((left, right) => identityOf(left).localeCompare(identityOf(right)));
}

function rowsLinkedByRole(store, rows, role, value) {
  return rows.filter(({ term }) => roleValues(store, term, role)
    .some((candidate) => identityOf(candidate) === identityOf(value)));
}

function hasClosedCoverage(store, concept) {
  return store.allCoverage().some((witness) => {
    const descriptor = witness.descriptor();
    return descriptor.status === "closed"
      && identityOf(descriptor.concept) === identityOf(concept);
  });
}

function ruleClaims(store, rows) {
  return uniqueSemanticValues(rows.flatMap(({ term }) => groundedClaims(store, term))
    .filter((claim) => modalityOf(claim) === "necessary"));
}

function semanticText(value, seen = new Set()) {
  if (value === null || value === undefined || seen.has(value)) return "";
  if (typeof value?.value === "function") return String(value.value());
  if (typeof value !== "object" && typeof value !== "function") return String(value);
  seen.add(value);
  const bindings = value?.bindings?.() ?? [];
  const bindingText = bindings.map((binding) => semanticText(binding.value(), seen)).find(Boolean);
  if (bindingText) return bindingText;
  const descriptor = value?.descriptor?.() ?? {};
  if (Object.hasOwn(descriptor, "value")) return semanticText(descriptor.value, seen);
  return "";
}

function requirement(code, status, reason, terms = [], claims = []) {
  return Object.freeze({
    code,
    status,
    reason,
    terms: Object.freeze(uniqueSemanticValues(terms)),
    claims: Object.freeze(uniqueSemanticValues(claims)),
    evidence: Object.freeze(evidenceFor(terms, claims))
  });
}

function aggregateStatus(requirements) {
  if (requirements.some((entry) => entry.status === "CONFLICT")) return "CONFLICT";
  if (requirements.some((entry) => entry.status === "VIOLATED")) return "VIOLATED";
  if (requirements.some((entry) => entry.status === "UNKNOWN")) return "UNKNOWN";
  return "SATISFIED";
}

export function releaseOutcomeForStatus(status) {
  if (status === "SATISFIED") return TRUE;
  if (status === "VIOLATED") return FALSE;
  if (status === "CONFLICT") return CONFLICT;
  return UNKNOWN;
}

function assessClaimedSupport(store, code, rows, concept, policyClaims = []) {
  const terms = rows.map(({ term }) => term);
  const assertedClaims = uniqueSemanticValues(terms.flatMap((term) => groundedClaims(store, term, "asserted")));
  const deniedClaims = uniqueSemanticValues(terms.flatMap((term) => groundedClaims(store, term, "denied")));
  const compatibleConflict = assertedClaims.some((assertedClaim) => deniedClaims
    .some((deniedClaim) => interpretationsCompatible(assertedClaim, deniedClaim)));
  const allClaims = uniqueSemanticValues([...policyClaims, ...assertedClaims, ...deniedClaims]);

  if (compatibleConflict) {
    return requirement(code, "CONFLICT", "asserted-and-denied-support", terms, allClaims);
  }
  if (assertedClaims.length > 0 && deniedClaims.length > 0) {
    return requirement(code, "UNKNOWN", "support-varies-by-interpretation", terms, allClaims);
  }
  if (assertedClaims.length > 0) {
    return requirement(code, "SATISFIED", "asserted-source-support", terms, allClaims);
  }
  if (deniedClaims.length > 0) {
    return requirement(code, "VIOLATED", "explicitly-denied-support", terms, allClaims);
  }
  if (hasClosedCoverage(store, concept)) {
    return requirement(code, "VIOLATED", "absent-under-closed-source-coverage", terms, policyClaims);
  }
  return requirement(code, "UNKNOWN", "unresolved-under-open-source-coverage", terms, policyClaims);
}

function temperatureNumber(reading, store) {
  const quantityValue = roleValues(store, reading, quantity)[0];
  const match = semanticText(quantityValue).match(/(-?\d+(?:\.\d+)?)\s*°?\s*C\b/i);
  return match ? Number(match[1]) : null;
}

function assessTemperaturePhase(store, code, rows, concept, policyClaims) {
  const terms = rows.map(({ term }) => term);
  const assertedClaims = uniqueSemanticValues(terms.flatMap((term) => groundedClaims(store, term, "asserted")));
  const deniedClaims = uniqueSemanticValues(terms.flatMap((term) => groundedClaims(store, term, "denied")));
  const allClaims = uniqueSemanticValues([...policyClaims, ...assertedClaims, ...deniedClaims]);
  const compatibleConflict = assertedClaims.some((assertedClaim) => deniedClaims
    .some((deniedClaim) => interpretationsCompatible(assertedClaim, deniedClaim)));
  if (compatibleConflict) {
    return requirement(code, "CONFLICT", "reading-asserted-and-denied", terms, allClaims);
  }
  if (assertedClaims.length === 0) {
    return assessClaimedSupport(store, code, rows, concept, policyClaims);
  }

  const assertedTerms = terms.filter((term) => groundedClaims(store, term, "asserted").length > 0);
  const temperatures = assertedTerms.map((term) => temperatureNumber(term, store));
  const known = temperatures.filter((value) => value !== null);
  const inRange = known.filter((value) => value >= 2 && value <= 8);
  const outOfRange = known.filter((value) => value < 2 || value > 8);
  if (inRange.length > 0 && outOfRange.length > 0) {
    return requirement(code, "CONFLICT", "in-range-and-out-of-range-readings", terms, allClaims);
  }
  if (outOfRange.length > 0) {
    return requirement(code, "VIOLATED", "temperature-outside-2-to-8-celsius", terms, allClaims);
  }
  if (known.length !== assertedTerms.length) {
    return requirement(code, "UNKNOWN", "temperature-value-not-normalizable", terms, allClaims);
  }
  return requirement(code, "SATISFIED", "recorded-temperature-within-range", terms, allClaims);
}

function phaseMatches(store, reading, pattern) {
  return roleValues(store, reading, phase).some((value) => pattern.test(semanticText(value)));
}

function assessCalibration(store, calibrationRows, thermometers, transferValue, concept, policyClaims) {
  if (thermometers.length === 0) {
    return requirement(
      "THERMOMETER_CALIBRATION_VALID", "UNKNOWN", "reading-thermometer-unresolved", [], policyClaims
    );
  }
  const results = thermometers.map((thermometer) => {
    const byTransfer = rowsLinkedByRole(store, calibrationRows, transfer, transferValue);
    const matching = rowsLinkedByRole(store, byTransfer, subject, thermometer);
    return assessClaimedSupport(
      store, "THERMOMETER_CALIBRATION_VALID", matching, concept, policyClaims
    );
  });
  const status = aggregateStatus(results);
  return requirement(
    "THERMOMETER_CALIBRATION_VALID",
    status,
    results.find((entry) => entry.status === status)?.reason ?? "calibration-evaluated",
    results.flatMap((entry) => entry.terms),
    results.flatMap((entry) => entry.claims)
  );
}

function assessAcknowledgement(store, acknowledgementRows, party, transferValue, concept, code, policyClaims) {
  const matching = rowsLinkedByRole(
    store,
    rowsLinkedByRole(store, acknowledgementRows, transfer, transferValue),
    actor,
    party
  );
  return assessClaimedSupport(store, code, matching, concept, policyClaims);
}

function excursionRequirement(status, reason, terms, claims) {
  return requirement("EXCURSION_QUARANTINE_PATH", status, reason, terms, claims);
}

function assessExcursionPath(
  store,
  excursionRows,
  studySupportRows,
  transferValue,
  excursionConcept,
  studySupportConcept,
  policyClaims
) {
  const excursions = rowsLinkedByRole(store, excursionRows, transfer, transferValue);
  const terms = excursions.map(({ term }) => term);
  const assertedClaims = uniqueSemanticValues(terms.flatMap((term) => groundedClaims(store, term, "asserted")));
  const deniedClaims = uniqueSemanticValues(terms.flatMap((term) => groundedClaims(store, term, "denied")));
  const allClaims = uniqueSemanticValues([...policyClaims, ...assertedClaims, ...deniedClaims]);
  const compatibleConflict = assertedClaims.some((assertedClaim) => deniedClaims
    .some((deniedClaim) => interpretationsCompatible(assertedClaim, deniedClaim)));
  if (compatibleConflict) {
    return excursionRequirement("CONFLICT", "excursion-asserted-and-denied", terms, allClaims);
  }
  if (assertedClaims.length > 0 && deniedClaims.length > 0) {
    return excursionRequirement("UNKNOWN", "excursion-varies-by-interpretation", terms, allClaims);
  }
  if (deniedClaims.length > 0) {
    return excursionRequirement(
      "SATISFIED",
      "temperature-excursion-explicitly-denied",
      terms,
      allClaims
    );
  }
  if (assertedClaims.length === 0) {
    return excursionRequirement(
      "UNKNOWN",
      hasClosedCoverage(store, excursionConcept)
        ? "source-covers-reported-excursions-but-does-not-prove-world-absence"
        : "temperature-excursion-status-unresolved",
      terms,
      allClaims
    );
  }

  const supports = rowsLinkedByRole(store, studySupportRows, transfer, transferValue);
  const support = assessClaimedSupport(
    store,
    "EXCURSION_QUARANTINE_PATH",
    supports,
    studySupportConcept,
    policyClaims
  );
  return requirement(
    support.code,
    support.status,
    support.status === "SATISFIED" ? "named-stability-study-supports-excursion" : support.reason,
    [...terms, ...support.terms],
    [...allClaims, ...support.claims]
  );
}

function conclusionClaims(store, conclusion) {
  return Object.freeze({
    asserted: groundedClaims(store, conclusion, "asserted"),
    denied: groundedClaims(store, conclusion, "denied")
  });
}

function concreteConclusionEntries(store, releaseRows, transferRows) {
  const groundedTransfers = new Set(transferRows
    .filter(({ term }) => groundedClaims(store, term, "asserted").length > 0)
    .map(({ term }) => identityOf(term)));
  return releaseRows.flatMap(({ term: conclusion }) => {
    const claims = conclusionClaims(store, conclusion);
    return roleValues(store, conclusion, transfer)
      .filter((transferValue) => groundedTransfers.has(identityOf(transferValue)))
      .map((transferValue) => ({ conclusion, transfer: transferValue, claims }));
  });
}

function statusSummary(entries) {
  return Object.freeze(entries.map((entry) => Object.freeze({
    code: entry.code,
    status: entry.status,
    reason: entry.reason
  })));
}

function resultAssessment(status, evidenceValues, details, claims, finding = null) {
  return Object.freeze({
    outcome: releaseOutcomeForStatus(status),
    status,
    evidence: Object.freeze(uniqueSemanticValues(evidenceValues)),
    details: Object.freeze(details),
    interpretation: commonInterpretation(claims),
    finding: finding ? Object.freeze(finding) : null
  });
}

export function evaluateColdChainReleaseSupport({ store, inputs, concepts }) {
  const [
    releaseRows = [],
    transferRows = [],
    identifierRows = [],
    readingRows = [],
    calibrationRows = [],
    acknowledgementRows = [],
    excursionRows = [],
    studySupportRows = []
  ] = inputs;
  const assertedReleaseClaims = releaseRows.flatMap(({ term }) => groundedClaims(store, term, "asserted"));
  const concreteEntries = concreteConclusionEntries(store, releaseRows, transferRows)
    .filter(({ claims }) => claims.asserted.length > 0);

  if (assertedReleaseClaims.length === 0) {
    return resultAssessment(
      "NOT_APPLICABLE",
      [],
      { checkedConclusions: 0, failedRequirements: [], uncertainRequirements: [] },
      [],
      {
        code: "COLD_CHAIN_RELEASE_NOT_APPLICABLE",
        status: "NOT_APPLICABLE",
        message: "No asserted cold-chain release conclusion is present."
      }
    );
  }
  if (concreteEntries.length === 0) {
    const evidenceValues = evidenceFor(releaseRows.map(({ term }) => term), assertedReleaseClaims);
    return resultAssessment(
      "UNKNOWN",
      evidenceValues,
      {
        checkedConclusions: assertedReleaseClaims.length,
        failedRequirements: [],
        uncertainRequirements: ["CONCRETE_CUSTODY_TRANSFER_GROUNDING"]
      },
      assertedReleaseClaims
    );
  }

  const conclusionResults = concreteEntries.map((entry) => {
    const { conclusion, transfer: transferValue, claims: releaseClaims } = entry;
    const transferClaims = groundedClaims(store, transferValue);
    const conclusionConflict = releaseClaims.asserted.some((assertedClaim) => releaseClaims.denied
      .some((deniedClaim) => interpretationsCompatible(assertedClaim, deniedClaim)));
    if (conclusionConflict) {
      const conflictRequirement = requirement(
        "RELEASE_CONCLUSION",
        "CONFLICT",
        "release-conclusion-asserted-and-denied",
        [conclusion, transferValue],
        [...releaseClaims.asserted, ...releaseClaims.denied, ...transferClaims]
      );
      return { entry, requirements: [conflictRequirement], status: "CONFLICT" };
    }

    const identifiers = rowsLinkedByRole(store, identifierRows, transfer, transferValue);
    const readings = rowsLinkedByRole(store, readingRows, transfer, transferValue);
    const beforeReadings = readings.filter(({ term }) => phaseMatches(store, term, /before\s+handoff/i));
    const afterReadings = readings.filter(({ term }) => phaseMatches(store, term, /after\s+receipt/i));
    const assertedReadingTerms = [...beforeReadings, ...afterReadings]
      .map(({ term }) => term)
      .filter((term) => groundedClaims(store, term, "asserted").length > 0);
    const thermometers = uniqueSemanticValues(assertedReadingTerms
      .flatMap((reading) => roleValues(store, reading, source)));
    const releasingParty = roleValues(store, transferValue, from)[0];
    const receivingParty = roleValues(store, transferValue, to)[0];
    const identifierPolicyClaims = ruleClaims(store, identifierRows);
    const readingPolicyClaims = ruleClaims(store, readingRows);
    const calibrationPolicyClaims = ruleClaims(store, calibrationRows);
    const acknowledgementPolicyClaims = ruleClaims(store, acknowledgementRows);
    const excursionPolicyClaims = ruleClaims(store, studySupportRows);

    const requirements = [
      assessClaimedSupport(
        store,
        "SEALED_IDENTIFIER_RECORDED",
        identifiers,
        concepts.IdentifierRecording,
        identifierPolicyClaims
      ),
      assessTemperaturePhase(
        store,
        "BEFORE_TEMPERATURE_IN_RANGE",
        beforeReadings,
        concepts.TemperatureReading,
        readingPolicyClaims
      ),
      assessTemperaturePhase(
        store,
        "AFTER_TEMPERATURE_IN_RANGE",
        afterReadings,
        concepts.TemperatureReading,
        readingPolicyClaims
      ),
      assessCalibration(
        store,
        calibrationRows,
        thermometers,
        transferValue,
        concepts.CalibrationValidity,
        calibrationPolicyClaims
      ),
      assessAcknowledgement(
        store,
        acknowledgementRows,
        releasingParty,
        transferValue,
        concepts.TransferAcknowledgement,
        "RELEASING_PARTY_ACKNOWLEDGED",
        acknowledgementPolicyClaims
      ),
      assessAcknowledgement(
        store,
        acknowledgementRows,
        receivingParty,
        transferValue,
        concepts.TransferAcknowledgement,
        "RECEIVING_PARTY_ACKNOWLEDGED",
        acknowledgementPolicyClaims
      ),
      assessExcursionPath(
        store,
        excursionRows,
        studySupportRows,
        transferValue,
        concepts.TemperatureExcursion,
        concepts.StabilityStudySupport,
        excursionPolicyClaims
      )
    ];
    return { entry, requirements, status: aggregateStatus(requirements) };
  });

  const status = aggregateStatus(conclusionResults.map((entry) => ({ status: entry.status })));
  const decisiveResults = conclusionResults.filter((entry) => entry.status === status);
  const requirements = decisiveResults.flatMap((entry) => entry.requirements);
  const baseTerms = decisiveResults.flatMap(({ entry }) => [entry.conclusion, entry.transfer]);
  const baseClaims = decisiveResults.flatMap(({ entry }) => [
    ...entry.claims.asserted,
    ...entry.claims.denied,
    ...groundedClaims(store, entry.transfer)
  ]);
  const allClaims = uniqueSemanticValues([
    ...baseClaims,
    ...requirements.flatMap((entry) => entry.claims)
  ]);
  const evidenceValues = uniqueSemanticValues([
    ...evidenceFor(baseTerms, baseClaims),
    ...requirements.flatMap((entry) => entry.evidence)
  ]);
  const failedRequirements = requirements
    .filter((entry) => entry.status === "VIOLATED")
    .map((entry) => entry.code);
  const uncertainRequirements = requirements
    .filter((entry) => entry.status === "UNKNOWN")
    .map((entry) => entry.code);
  const conflictingRequirements = requirements
    .filter((entry) => entry.status === "CONFLICT")
    .map((entry) => entry.code);

  return resultAssessment(status, evidenceValues, {
    checkedConclusions: concreteEntries.length,
    assessedTransfers: decisiveResults.map(({ entry }) => identityOf(entry.transfer)),
    failedRequirements: Object.freeze([...new Set(failedRequirements)].sort()),
    uncertainRequirements: Object.freeze([...new Set(uncertainRequirements)].sort()),
    conflictingRequirements: Object.freeze([...new Set(conflictingRequirements)].sort()),
    requirementAssessments: statusSummary(requirements)
  }, allClaims);
}
