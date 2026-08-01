import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("psychology-basic.motivation", "1.0.0");
export const Motivation = O.entity(
  entityKind("Motivation").provide(capability("Motivation"))
);
export const Incentive = O.entity(
  entityKind("Incentive").provide(capability("Incentive"))
);
export const Need = O.entity(
  entityKind("Need").provide(capability("Need"))
);
export const Value = O.entity(
  entityKind("Value").provide(capability("Value"))
);
export const MotivatedBy = O.event(
  eventKind("MotivatedBy")
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
    .provide(capability("MotivatedBy"))
);
O.lexicon(lexicalize(Motivation).english("motivation"));
O.lexicon(lexicalize(Incentive).english("incentive"));
O.lexicon(lexicalize(Need).english("need"));
O.lexicon(lexicalize(Value).english("value"));
O.lexicon(lexicalize(MotivatedBy).english("motivated by"));

export default O.seal();
