import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("biology-basic.ecology", "1.0.0");
export const Species = O.entity(
  entityKind("Species").provide(capability("Species"))
);
export const Population = O.entity(
  entityKind("Population").provide(capability("Population"))
);
export const Community = O.entity(
  entityKind("Community").provide(capability("Community"))
);
export const Ecosystem = O.entity(
  entityKind("Ecosystem").provide(capability("Ecosystem"))
);
export const Biosphere = O.entity(
  entityKind("Biosphere").provide(capability("Biosphere"))
);
export const Habitat = O.entity(
  entityKind("Habitat").provide(capability("Habitat"))
);
export const Resource = O.entity(
  entityKind("Resource").provide(capability("Resource"))
);
export const EcologicalInteraction = O.entity(
  entityKind("EcologicalInteraction").provide(capability("EcologicalInteraction"))
);
export const LivesIn = O.event(
  eventKind("LivesIn")
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
    .provide(capability("LivesIn"))
);
export const Consumes = O.event(
  eventKind("Consumes")
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
    .provide(capability("Consumes"))
);
export const CompetesWith = O.event(
  eventKind("CompetesWith")
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
    .provide(capability("CompetesWith"))
);
export const PredatesOn = O.event(
  eventKind("PredatesOn")
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
    .provide(capability("PredatesOn"))
);
export const CooperatesWith = O.event(
  eventKind("CooperatesWith")
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
    .provide(capability("CooperatesWith"))
);
O.lexicon(lexicalize(Species).english("species"));
O.lexicon(lexicalize(Population).english("population"));
O.lexicon(lexicalize(Community).english("community"));
O.lexicon(lexicalize(Ecosystem).english("ecosystem"));
O.lexicon(lexicalize(Biosphere).english("biosphere"));
O.lexicon(lexicalize(Habitat).english("habitat"));
O.lexicon(lexicalize(Resource).english("resource"));
O.lexicon(lexicalize(EcologicalInteraction).english("ecological interaction"));
O.lexicon(lexicalize(LivesIn).english("lives in"));
O.lexicon(lexicalize(Consumes).english("consumes"));
O.lexicon(lexicalize(CompetesWith).english("competes with"));
O.lexicon(lexicalize(PredatesOn).english("predates on"));
O.lexicon(lexicalize(CooperatesWith).english("cooperates with"));

export default O.seal();
