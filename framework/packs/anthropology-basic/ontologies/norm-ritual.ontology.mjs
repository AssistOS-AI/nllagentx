import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("anthropology-basic.norm-ritual", "1.0.0");
export const Norm = O.entity(
  entityKind("Norm").provide(capability("Norm"))
);
export const Ritual = O.entity(
  entityKind("Ritual").provide(capability("Ritual"))
);
export const LifeEvent = O.entity(
  entityKind("LifeEvent").provide(capability("LifeEvent"))
);
export const StatedNorm = O.entity(
  entityKind("StatedNorm").provide(capability("StatedNorm"))
);
export const ObservedPractice = O.entity(
  entityKind("ObservedPractice").provide(capability("ObservedPractice"))
);
export const ExpectedBy = O.event(
  eventKind("ExpectedBy")
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
    .provide(capability("ExpectedBy"))
);
O.lexicon(lexicalize(Norm).english("norm"));
O.lexicon(lexicalize(Ritual).english("ritual"));
O.lexicon(lexicalize(LifeEvent).english("life event"));
O.lexicon(lexicalize(StatedNorm).english("stated norm"));
O.lexicon(lexicalize(ObservedPractice).english("observed practice"));
O.lexicon(lexicalize(ExpectedBy).english("expected by"));

export default O.seal();
