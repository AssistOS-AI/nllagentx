import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("anthropology-basic.subsistence-exchange", "1.0.0");
export const SubsistenceStrategy = O.entity(
  entityKind("SubsistenceStrategy").provide(capability("SubsistenceStrategy"))
);
export const ExchangePractice = O.entity(
  entityKind("ExchangePractice").provide(capability("ExchangePractice"))
);
export const ExchangedBetween = O.event(
  eventKind("ExchangedBetween")
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
    .provide(capability("ExchangedBetween"))
);
O.lexicon(lexicalize(SubsistenceStrategy).english("subsistence strategy"));
O.lexicon(lexicalize(ExchangePractice).english("exchange practice"));
O.lexicon(lexicalize(ExchangedBetween).english("exchanged between"));

export default O.seal();
