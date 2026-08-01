import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("reasoning-errors.causality", "1.0.0");
export const CausalClaim = O.entity(
  entityKind("CausalClaim").provide(capability("CausalClaim"))
);
export const CorrelationClaim = O.entity(
  entityKind("CorrelationClaim").provide(capability("CorrelationClaim"))
);
export const AlternativeExplanation = O.entity(
  entityKind("AlternativeExplanation").provide(capability("AlternativeExplanation"))
);
export const AttributesCause = O.event(
  eventKind("AttributesCause")
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
    .provide(capability("AttributesCause"))
);
O.lexicon(lexicalize(CausalClaim).english("causal claim"));
O.lexicon(lexicalize(CorrelationClaim).english("correlation claim"));
O.lexicon(lexicalize(AlternativeExplanation).english("alternative explanation"));
O.lexicon(lexicalize(AttributesCause).english("attributes cause"));

export default O.seal();
