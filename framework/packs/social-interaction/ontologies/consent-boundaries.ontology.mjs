import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("social-interaction.consent-boundaries", "1.0.0");
export const Consent = O.entity(
  entityKind("Consent").provide(capability("Consent"))
);
export const Permission = O.entity(
  entityKind("Permission").provide(capability("Permission"))
);
export const Boundary = O.entity(
  entityKind("Boundary").provide(capability("Boundary"))
);
export const Withdrawal = O.entity(
  entityKind("Withdrawal").provide(capability("Withdrawal"))
);
export const PrivacyExpectation = O.entity(
  entityKind("PrivacyExpectation").provide(capability("PrivacyExpectation"))
);
export const Disclosure = O.entity(
  entityKind("Disclosure").provide(capability("Disclosure"))
);
export const ConsentsTo = O.event(
  eventKind("ConsentsTo")
    .role(allows(actor, atMostOne()))
    .role(allows(theme, atMostOne()))
    .role(allows(subject, atMostOne()))
    .role(allows(objectRole, atMostOne()))
    .role(allows(source, atMostOne()))
    .role(allows(target, atMostOne()))
    .role(allows(location, atMostOne()))
    .role(allows(time, atMostOne()))
    .role(allows(context, atMostOne()))
    .role(allows(evidence, atMostOne()))
    .role(allows(value, atMostOne()))
    .role(allows(sourceFrom, atMostOne()))
    .role(allows(destination, atMostOne()))
    .provide(capability("ConsentsTo"))
);
export const Withdraws = O.event(
  eventKind("Withdraws")
    .role(allows(actor, atMostOne()))
    .role(allows(theme, atMostOne()))
    .role(allows(subject, atMostOne()))
    .role(allows(objectRole, atMostOne()))
    .role(allows(source, atMostOne()))
    .role(allows(target, atMostOne()))
    .role(allows(location, atMostOne()))
    .role(allows(time, atMostOne()))
    .role(allows(context, atMostOne()))
    .role(allows(evidence, atMostOne()))
    .role(allows(value, atMostOne()))
    .role(allows(sourceFrom, atMostOne()))
    .role(allows(destination, atMostOne()))
    .provide(capability("Withdraws"))
);
export const Discloses = O.event(
  eventKind("Discloses")
    .role(allows(actor, atMostOne()))
    .role(allows(theme, atMostOne()))
    .role(allows(subject, atMostOne()))
    .role(allows(objectRole, atMostOne()))
    .role(allows(source, atMostOne()))
    .role(allows(target, atMostOne()))
    .role(allows(location, atMostOne()))
    .role(allows(time, atMostOne()))
    .role(allows(context, atMostOne()))
    .role(allows(evidence, atMostOne()))
    .role(allows(value, atMostOne()))
    .role(allows(sourceFrom, atMostOne()))
    .role(allows(destination, atMostOne()))
    .provide(capability("Discloses"))
);
O.lexicon(lexicalize(Consent).english("consent"));
O.lexicon(lexicalize(Permission).english("permission"));
O.lexicon(lexicalize(Boundary).english("boundary"));
O.lexicon(lexicalize(Withdrawal).english("withdrawal"));
O.lexicon(lexicalize(PrivacyExpectation).english("privacy expectation"));
O.lexicon(lexicalize(Disclosure).english("disclosure"));
O.lexicon(lexicalize(ConsentsTo).english("consents to"));
O.lexicon(lexicalize(Withdraws).english("withdraws"));
O.lexicon(lexicalize(Discloses).english("discloses"));

export default O.seal();
