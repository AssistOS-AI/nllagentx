import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("social-interaction.roles-power", "1.0.0");
export const Relationship = O.entity(
  entityKind("Relationship").provide(capability("Relationship"))
);
export const Role = O.entity(
  entityKind("Role").provide(capability("Role"))
);
export const Authority = O.entity(
  entityKind("Authority").provide(capability("Authority"))
);
export const Dependency = O.entity(
  entityKind("Dependency").provide(capability("Dependency"))
);
O.lexicon(lexicalize(Relationship).english("relationship"));
O.lexicon(lexicalize(Role).english("role"));
O.lexicon(lexicalize(Authority).english("authority"));
O.lexicon(lexicalize(Dependency).english("dependency"));

export default O.seal();
