import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("law-basic.conditions-exceptions", "1.0.0");
export const Condition = O.entity(
  entityKind("Condition").provide(capability("Condition"))
);
export const Exception = O.entity(
  entityKind("Exception").provide(capability("Exception"))
);
export const Exemption = O.entity(
  entityKind("Exemption").provide(capability("Exemption"))
);
export const Defense = O.entity(
  entityKind("Defense").provide(capability("Defense"))
);
export const ConditionalOn = O.event(
  eventKind("ConditionalOn")
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
    .provide(capability("ConditionalOn"))
);
export const ExceptWhen = O.event(
  eventKind("ExceptWhen")
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
    .provide(capability("ExceptWhen"))
);
O.lexicon(lexicalize(Condition).english("condition"));
O.lexicon(lexicalize(Exception).english("exception"));
O.lexicon(lexicalize(Exemption).english("exemption"));
O.lexicon(lexicalize(Defense).english("defense"));
O.lexicon(lexicalize(ConditionalOn).english("conditional on"));
O.lexicon(lexicalize(ExceptWhen).english("except when"));

export default O.seal();
