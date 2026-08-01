import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("logic-basic.natural-logic", "1.0.0");
export const EntailmentRelation = O.entity(
  entityKind("EntailmentRelation").provide(capability("EntailmentRelation"))
);
export const ContradictionRelation = O.entity(
  entityKind("ContradictionRelation").provide(capability("ContradictionRelation"))
);
export const Entails = O.event(
  eventKind("Entails")
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
    .provide(capability("Entails"))
);
export const Contradicts = O.event(
  eventKind("Contradicts")
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
    .provide(capability("Contradicts"))
);
O.lexicon(lexicalize(EntailmentRelation).english("entailment relation"));
O.lexicon(lexicalize(ContradictionRelation).english("contradiction relation"));
O.lexicon(lexicalize(Entails).english("entails"));
O.lexicon(lexicalize(Contradicts).english("contradicts"));

export default O.seal();
