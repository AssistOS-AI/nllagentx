import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("anthropology-basic.identity-perspective", "1.0.0");
export const IdentityCategory = O.entity(
  entityKind("IdentityCategory").provide(capability("IdentityCategory"))
);
export const SocialRole = O.entity(
  entityKind("SocialRole").provide(capability("SocialRole"))
);
export const EmicConcept = O.entity(
  entityKind("EmicConcept").provide(capability("EmicConcept"))
);
export const EticConcept = O.entity(
  entityKind("EticConcept").provide(capability("EticConcept"))
);
export const AnalystInterpretation = O.entity(
  entityKind("AnalystInterpretation").provide(capability("AnalystInterpretation"))
);
export const CategorizedAs = O.event(
  eventKind("CategorizedAs")
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
    .provide(capability("CategorizedAs"))
);
O.lexicon(lexicalize(IdentityCategory).english("identity category"));
O.lexicon(lexicalize(SocialRole).english("social role"));
O.lexicon(lexicalize(EmicConcept).english("emic concept"));
O.lexicon(lexicalize(EticConcept).english("etic concept"));
O.lexicon(lexicalize(AnalystInterpretation).english("analyst interpretation"));
O.lexicon(lexicalize(CategorizedAs).english("categorized as"));

export default O.seal();
