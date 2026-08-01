import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("reasoning-errors.argument-structure", "1.0.0");
export const Argument = O.entity(
  entityKind("Argument").provide(capability("Argument"))
);
export const Premise = O.entity(
  entityKind("Premise").provide(capability("Premise"))
);
export const Conclusion = O.entity(
  entityKind("Conclusion").provide(capability("Conclusion"))
);
export const Inference = O.entity(
  entityKind("Inference").provide(capability("Inference"))
);
export const MissingPremise = O.entity(
  entityKind("MissingPremise").provide(capability("MissingPremise"))
);
export const Supports = O.event(
  eventKind("Supports")
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
    .provide(capability("Supports"))
);
export const Attacks = O.event(
  eventKind("Attacks")
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
    .provide(capability("Attacks"))
);
O.lexicon(lexicalize(Argument).english("argument"));
O.lexicon(lexicalize(Premise).english("premise"));
O.lexicon(lexicalize(Conclusion).english("conclusion"));
O.lexicon(lexicalize(Inference).english("inference"));
O.lexicon(lexicalize(MissingPremise).english("missing premise"));
O.lexicon(lexicalize(Supports).english("supports"));
O.lexicon(lexicalize(Attacks).english("attacks"));

export default O.seal();
