import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("social-interaction.conflict", "1.0.0");
export const Conflict = O.entity(
  entityKind("Conflict").provide(capability("Conflict"))
);
export const Disagreement = O.entity(
  entityKind("Disagreement").provide(capability("Disagreement"))
);
export const Accusation = O.entity(
  entityKind("Accusation").provide(capability("Accusation"))
);
export const RepairAttempt = O.entity(
  entityKind("RepairAttempt").provide(capability("RepairAttempt"))
);
export const Repairs = O.event(
  eventKind("Repairs")
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
    .provide(capability("Repairs"))
);
O.lexicon(lexicalize(Conflict).english("conflict"));
O.lexicon(lexicalize(Disagreement).english("disagreement"));
O.lexicon(lexicalize(Accusation).english("accusation"));
O.lexicon(lexicalize(RepairAttempt).english("repair attempt"));
O.lexicon(lexicalize(Repairs).english("repairs"));

export default O.seal();
