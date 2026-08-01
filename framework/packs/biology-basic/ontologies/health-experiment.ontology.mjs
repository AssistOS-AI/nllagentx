import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("biology-basic.health-experiment", "1.0.0");
export const BiologicalObservation = O.entity(
  entityKind("BiologicalObservation").provide(capability("BiologicalObservation"))
);
export const Sample = O.entity(
  entityKind("Sample").provide(capability("Sample"))
);
export const ObservedIn = O.event(
  eventKind("ObservedIn")
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
    .provide(capability("ObservedIn"))
);
O.lexicon(lexicalize(BiologicalObservation).english("biological observation"));
O.lexicon(lexicalize(Sample).english("sample"));
O.lexicon(lexicalize(ObservedIn).english("observed in"));

export default O.seal();
