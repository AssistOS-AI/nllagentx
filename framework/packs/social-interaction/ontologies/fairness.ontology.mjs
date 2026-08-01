import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("social-interaction.fairness", "1.0.0");
export const FairnessClaim = O.entity(
  entityKind("FairnessClaim").provide(capability("FairnessClaim"))
);
export const Justification = O.entity(
  entityKind("Justification").provide(capability("Justification"))
);
O.lexicon(lexicalize(FairnessClaim).english("fairness claim"));
O.lexicon(lexicalize(Justification).english("justification"));

export default O.seal();
