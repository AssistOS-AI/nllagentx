import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("sociology-basic.networks", "1.0.0");
export const SocialTie = O.entity(
  entityKind("SocialTie").provide(capability("SocialTie"))
);
export const Network = O.entity(
  entityKind("Network").provide(capability("Network"))
);
export const Position = O.entity(
  entityKind("Position").provide(capability("Position"))
);
export const ConnectedTo = O.event(
  eventKind("ConnectedTo")
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
    .provide(capability("ConnectedTo"))
);
O.lexicon(lexicalize(SocialTie).english("social tie"));
O.lexicon(lexicalize(Network).english("network"));
O.lexicon(lexicalize(Position).english("position"));
O.lexicon(lexicalize(ConnectedTo).english("connected to"));

export default O.seal();
