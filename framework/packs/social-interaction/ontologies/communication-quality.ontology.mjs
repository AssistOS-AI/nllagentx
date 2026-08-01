import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("social-interaction.communication-quality", "1.0.0");
export const Clarity = O.entity(
  entityKind("Clarity").provide(capability("Clarity"))
);
export const Ambiguity = O.entity(
  entityKind("Ambiguity").provide(capability("Ambiguity"))
);
export const TurnTaking = O.entity(
  entityKind("TurnTaking").provide(capability("TurnTaking"))
);
export const Acknowledgment = O.entity(
  entityKind("Acknowledgment").provide(capability("Acknowledgment"))
);
O.lexicon(lexicalize(Clarity).english("clarity"));
O.lexicon(lexicalize(Ambiguity).english("ambiguity"));
O.lexicon(lexicalize(TurnTaking).english("turn taking"));
O.lexicon(lexicalize(Acknowledgment).english("acknowledgment"));

export default O.seal();
