import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("psychology-basic.perception-knowledge", "1.0.0");
export const MentalAgent = O.entity(
  entityKind("MentalAgent").provide(capability("MentalAgent"))
);
export const MentalContext = O.entity(
  entityKind("MentalContext").provide(capability("MentalContext"))
);
export const Perception = O.entity(
  entityKind("Perception").provide(capability("Perception"))
);
export const Belief = O.entity(
  entityKind("Belief").provide(capability("Belief"))
);
export const Knowledge = O.entity(
  entityKind("Knowledge").provide(capability("Knowledge"))
);
export const Uncertainty = O.entity(
  entityKind("Uncertainty").provide(capability("Uncertainty"))
);
export const Perceives = O.event(
  eventKind("Perceives")
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
    .provide(capability("Perceives"))
);
export const Believes = O.event(
  eventKind("Believes")
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
    .provide(capability("Believes"))
);
export const Knows = O.event(
  eventKind("Knows")
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
    .provide(capability("Knows"))
);
O.lexicon(lexicalize(MentalAgent).english("mental agent"));
O.lexicon(lexicalize(MentalContext).english("mental context"));
O.lexicon(lexicalize(Perception).english("perception"));
O.lexicon(lexicalize(Belief).english("belief"));
O.lexicon(lexicalize(Knowledge).english("knowledge"));
O.lexicon(lexicalize(Uncertainty).english("uncertainty"));
O.lexicon(lexicalize(Perceives).english("perceives"));
O.lexicon(lexicalize(Believes).english("believes"));
O.lexicon(lexicalize(Knows).english("knows"));

export default O.seal();
