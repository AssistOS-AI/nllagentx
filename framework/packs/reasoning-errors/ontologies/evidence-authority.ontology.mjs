import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("reasoning-errors.evidence-authority", "1.0.0");
export const EvidenceRelation = O.entity(
  entityKind("EvidenceRelation").provide(capability("EvidenceRelation"))
);
export const SourceAuthority = O.entity(
  entityKind("SourceAuthority").provide(capability("SourceAuthority"))
);
export const BurdenOfSupport = O.entity(
  entityKind("BurdenOfSupport").provide(capability("BurdenOfSupport"))
);
export const Cites = O.event(
  eventKind("Cites")
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
    .provide(capability("Cites"))
);
O.lexicon(lexicalize(EvidenceRelation).english("evidence relation"));
O.lexicon(lexicalize(SourceAuthority).english("source authority"));
O.lexicon(lexicalize(BurdenOfSupport).english("burden of support"));
O.lexicon(lexicalize(Cites).english("cites"));

export default O.seal();
