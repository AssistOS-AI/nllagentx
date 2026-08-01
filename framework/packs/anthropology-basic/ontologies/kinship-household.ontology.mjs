import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("anthropology-basic.kinship-household", "1.0.0");
export const KinRelation = O.entity(
  entityKind("KinRelation").provide(capability("KinRelation"))
);
export const Household = O.entity(
  entityKind("Household").provide(capability("Household"))
);
export const DescentRelation = O.entity(
  entityKind("DescentRelation").provide(capability("DescentRelation"))
);
export const RelatedBy = O.event(
  eventKind("RelatedBy")
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
    .provide(capability("RelatedBy"))
);
O.lexicon(lexicalize(KinRelation).english("kin relation"));
O.lexicon(lexicalize(Household).english("household"));
O.lexicon(lexicalize(DescentRelation).english("descent relation"));
O.lexicon(lexicalize(RelatedBy).english("related by"));

export default O.seal();
