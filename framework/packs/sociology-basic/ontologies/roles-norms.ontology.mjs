import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("sociology-basic.roles-norms", "1.0.0");
export const Status = O.entity(
  entityKind("Status").provide(capability("Status"))
);
export const Role = O.entity(
  entityKind("Role").provide(capability("Role"))
);
export const Norm = O.entity(
  entityKind("Norm").provide(capability("Norm"))
);
export const Expectation = O.entity(
  entityKind("Expectation").provide(capability("Expectation"))
);
export const Sanction = O.entity(
  entityKind("Sanction").provide(capability("Sanction"))
);
export const OccupiesRole = O.event(
  eventKind("OccupiesRole")
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
    .provide(capability("OccupiesRole"))
);
export const ExpectedTo = O.event(
  eventKind("ExpectedTo")
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
    .provide(capability("ExpectedTo"))
);
O.lexicon(lexicalize(Status).english("status"));
O.lexicon(lexicalize(Role).english("role"));
O.lexicon(lexicalize(Norm).english("norm"));
O.lexicon(lexicalize(Expectation).english("expectation"));
O.lexicon(lexicalize(Sanction).english("sanction"));
O.lexicon(lexicalize(OccupiesRole).english("occupies role"));
O.lexicon(lexicalize(ExpectedTo).english("expected to"));

export default O.seal();
