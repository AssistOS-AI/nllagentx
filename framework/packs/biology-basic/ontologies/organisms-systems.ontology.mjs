import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("biology-basic.organisms-systems", "1.0.0");
export const Organ = O.entity(
  entityKind("Organ").provide(capability("Organ"))
);
export const OrganSystem = O.entity(
  entityKind("OrganSystem").provide(capability("OrganSystem"))
);
export const Organism = O.entity(
  entityKind("Organism").provide(capability("Organism"))
);
O.lexicon(lexicalize(Organ).english("organ"));
O.lexicon(lexicalize(OrganSystem).english("organ system"));
O.lexicon(lexicalize(Organism).english("organism"));

export default O.seal();
