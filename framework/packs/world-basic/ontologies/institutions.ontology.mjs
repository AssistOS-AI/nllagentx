import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("world-basic.institutions", "1.0.0");
export const Institution = O.entity(
  entityKind("Institution").provide(capability("Institution"))
);
export const Family = O.entity(
  entityKind("Family").provide(capability("Family"))
);
export const School = O.entity(
  entityKind("School").provide(capability("School"))
);
export const University = O.entity(
  entityKind("University").provide(capability("University"))
);
export const Company = O.entity(
  entityKind("Company").provide(capability("Company"))
);
export const Government = O.entity(
  entityKind("Government").provide(capability("Government"))
);
export const Court = O.entity(
  entityKind("Court").provide(capability("Court"))
);
export const Hospital = O.entity(
  entityKind("Hospital").provide(capability("Hospital"))
);
export const Market = O.entity(
  entityKind("Market").provide(capability("Market"))
);
export const Library = O.entity(
  entityKind("Library").provide(capability("Library"))
);
export const Museum = O.entity(
  entityKind("Museum").provide(capability("Museum"))
);
export const MediaOrganization = O.entity(
  entityKind("MediaOrganization").provide(capability("MediaOrganization"))
);
export const Bank = O.entity(
  entityKind("Bank").provide(capability("Bank"))
);
export const NonprofitOrganization = O.entity(
  entityKind("NonprofitOrganization").provide(capability("NonprofitOrganization"))
);
export const InstitutionalRole = O.event(
  eventKind("InstitutionalRole")
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
    .provide(capability("InstitutionalRole"))
);
O.lexicon(lexicalize(Institution).english("institution"));
O.lexicon(lexicalize(Family).english("family"));
O.lexicon(lexicalize(School).english("school"));
O.lexicon(lexicalize(University).english("university"));
O.lexicon(lexicalize(Company).english("company"));
O.lexicon(lexicalize(Government).english("government"));
O.lexicon(lexicalize(Court).english("court"));
O.lexicon(lexicalize(Hospital).english("hospital"));
O.lexicon(lexicalize(Market).english("market"));
O.lexicon(lexicalize(Library).english("library"));
O.lexicon(lexicalize(Museum).english("museum"));
O.lexicon(lexicalize(MediaOrganization).english("media organization"));
O.lexicon(lexicalize(Bank).english("bank"));
O.lexicon(lexicalize(NonprofitOrganization).english("nonprofit organization"));
O.lexicon(lexicalize(InstitutionalRole).english("institutional role"));

export default O.seal();
