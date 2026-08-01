import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("reasoning-errors.dialogue", "1.0.0");
export const OpponentPosition = O.entity(
  entityKind("OpponentPosition").provide(capability("OpponentPosition"))
);
export const ReconstructedClaim = O.entity(
  entityKind("ReconstructedClaim").provide(capability("ReconstructedClaim"))
);
export const RepresentsOpponent = O.event(
  eventKind("RepresentsOpponent")
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
    .provide(capability("RepresentsOpponent"))
);
O.lexicon(lexicalize(OpponentPosition).english("opponent position"));
O.lexicon(lexicalize(ReconstructedClaim).english("reconstructed claim"));
O.lexicon(lexicalize(RepresentsOpponent).english("represents opponent"));

export default O.seal();
