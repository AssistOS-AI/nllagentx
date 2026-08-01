import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("sociology-basic.institutions", "1.0.0");
export const Institution = O.entity(
  entityKind("Institution").provide(capability("Institution"))
);
export const InstitutionLevel = O.entity(
  entityKind("InstitutionLevel").provide(capability("InstitutionLevel"))
);
export const InstitutionalChange = O.entity(
  entityKind("InstitutionalChange").provide(capability("InstitutionalChange"))
);
O.lexicon(lexicalize(Institution).english("institution"));
O.lexicon(lexicalize(InstitutionLevel).english("institution level"));
O.lexicon(lexicalize(InstitutionalChange).english("institutional change"));

export default O.seal();
