import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("law-basic.persons-roles", "1.0.0");
export const LegalPerson = O.entity(
  entityKind("LegalPerson").provide(capability("LegalPerson"))
);
export const NaturalPerson = O.entity(
  entityKind("NaturalPerson").provide(capability("NaturalPerson"))
);
export const Organization = O.entity(
  entityKind("Organization").provide(capability("Organization"))
);
export const PublicBody = O.entity(
  entityKind("PublicBody").provide(capability("PublicBody"))
);
export const LegalRole = O.entity(
  entityKind("LegalRole").provide(capability("LegalRole"))
);
export const Party = O.entity(
  entityKind("Party").provide(capability("Party"))
);
export const Beneficiary = O.entity(
  entityKind("Beneficiary").provide(capability("Beneficiary"))
);
export const DecisionMaker = O.entity(
  entityKind("DecisionMaker").provide(capability("DecisionMaker"))
);
export const Binds = O.event(
  eventKind("Binds")
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
    .provide(capability("Binds"))
);
export const Benefits = O.event(
  eventKind("Benefits")
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
    .provide(capability("Benefits"))
);
O.lexicon(lexicalize(LegalPerson).english("legal person"));
O.lexicon(lexicalize(NaturalPerson).english("natural person"));
O.lexicon(lexicalize(Organization).english("organization"));
O.lexicon(lexicalize(PublicBody).english("public body"));
O.lexicon(lexicalize(LegalRole).english("legal role"));
O.lexicon(lexicalize(Party).english("party"));
O.lexicon(lexicalize(Beneficiary).english("beneficiary"));
O.lexicon(lexicalize(DecisionMaker).english("decision maker"));
O.lexicon(lexicalize(Binds).english("binds"));
O.lexicon(lexicalize(Benefits).english("benefits"));

export default O.seal();
