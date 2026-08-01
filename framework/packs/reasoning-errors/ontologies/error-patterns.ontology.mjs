import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("reasoning-errors.error-patterns", "1.0.0");
export const ReasoningErrorPattern = O.entity(
  entityKind("ReasoningErrorPattern").provide(capability("ReasoningErrorPattern"))
);
O.lexicon(lexicalize(ReasoningErrorPattern).english("reasoning error pattern"));

export default O.seal();
