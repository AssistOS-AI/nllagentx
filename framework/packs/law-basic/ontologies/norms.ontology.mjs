import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("law-basic.norms", "1.0.0");
export const Norm = O.entity(
  entityKind("Norm").provide(capability("Norm"))
);
export const Obligation = O.entity(
  entityKind("Obligation").provide(capability("Obligation"))
);
export const Prohibition = O.entity(
  entityKind("Prohibition").provide(capability("Prohibition"))
);
export const Permission = O.entity(
  entityKind("Permission").provide(capability("Permission"))
);
export const Right = O.entity(
  entityKind("Right").provide(capability("Right"))
);
export const Power = O.entity(
  entityKind("Power").provide(capability("Power"))
);
export const Immunity = O.entity(
  entityKind("Immunity").provide(capability("Immunity"))
);
export const Recommendation = O.entity(
  entityKind("Recommendation").provide(capability("Recommendation"))
);
export const PolicyGoal = O.entity(
  entityKind("PolicyGoal").provide(capability("PolicyGoal"))
);
export const Requires = O.event(
  eventKind("Requires")
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
    .provide(capability("Requires"))
);
export const Forbids = O.event(
  eventKind("Forbids")
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
    .provide(capability("Forbids"))
);
export const Permits = O.event(
  eventKind("Permits")
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
    .provide(capability("Permits"))
);
O.lexicon(lexicalize(Norm).english("norm"));
O.lexicon(lexicalize(Obligation).english("obligation"));
O.lexicon(lexicalize(Prohibition).english("prohibition"));
O.lexicon(lexicalize(Permission).english("permission"));
O.lexicon(lexicalize(Right).english("right"));
O.lexicon(lexicalize(Power).english("power"));
O.lexicon(lexicalize(Immunity).english("immunity"));
O.lexicon(lexicalize(Recommendation).english("recommendation"));
O.lexicon(lexicalize(PolicyGoal).english("policy goal"));
O.lexicon(lexicalize(Requires).english("requires"));
O.lexicon(lexicalize(Forbids).english("forbids"));
O.lexicon(lexicalize(Permits).english("permits"));

export default O.seal();
