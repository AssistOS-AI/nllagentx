import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("sociology-basic.power-resources", "1.0.0");
export const Resource = O.entity(
  entityKind("Resource").provide(capability("Resource"))
);
export const Authority = O.entity(
  entityKind("Authority").provide(capability("Authority"))
);
export const PowerRelation = O.entity(
  entityKind("PowerRelation").provide(capability("PowerRelation"))
);
export const Dependency = O.entity(
  entityKind("Dependency").provide(capability("Dependency"))
);
export const Controls = O.event(
  eventKind("Controls")
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
    .provide(capability("Controls"))
);
export const DependsOn = O.event(
  eventKind("DependsOn")
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
    .provide(capability("DependsOn"))
);
export const Influences = O.event(
  eventKind("Influences")
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
    .provide(capability("Influences"))
);
O.lexicon(lexicalize(Resource).english("resource"));
O.lexicon(lexicalize(Authority).english("authority"));
O.lexicon(lexicalize(PowerRelation).english("power relation"));
O.lexicon(lexicalize(Dependency).english("dependency"));
O.lexicon(lexicalize(Controls).english("controls"));
O.lexicon(lexicalize(DependsOn).english("depends on"));
O.lexicon(lexicalize(Influences).english("influences"));

export default O.seal();
