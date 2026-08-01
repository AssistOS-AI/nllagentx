import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("world-basic.materials-food-health", "1.0.0");
export const Material = O.entity(
  entityKind("Material").provide(capability("Material"))
);
export const Food = O.entity(
  entityKind("Food").provide(capability("Food"))
);
export const HealthState = O.entity(
  entityKind("HealthState").provide(capability("HealthState"))
);
export const MadeOf = O.event(
  eventKind("MadeOf")
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
    .provide(capability("MadeOf"))
);
export const TypicalProperty = O.event(
  eventKind("TypicalProperty")
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
    .provide(capability("TypicalProperty"))
);
O.lexicon(lexicalize(Material).english("material"));
O.lexicon(lexicalize(Food).english("food"));
O.lexicon(lexicalize(HealthState).english("health state"));
O.lexicon(lexicalize(MadeOf).english("made of"));
O.lexicon(lexicalize(TypicalProperty).english("typical property"));

export default O.seal();
