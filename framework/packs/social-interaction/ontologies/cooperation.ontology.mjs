import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("social-interaction.cooperation", "1.0.0");
export const SharedGoal = O.entity(
  entityKind("SharedGoal").provide(capability("SharedGoal"))
);
export const Contribution = O.entity(
  entityKind("Contribution").provide(capability("Contribution"))
);
export const Cooperation = O.entity(
  entityKind("Cooperation").provide(capability("Cooperation"))
);
export const SharesGoal = O.event(
  eventKind("SharesGoal")
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
    .provide(capability("SharesGoal"))
);
export const Contributes = O.event(
  eventKind("Contributes")
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
    .provide(capability("Contributes"))
);
O.lexicon(lexicalize(SharedGoal).english("shared goal"));
O.lexicon(lexicalize(Contribution).english("contribution"));
O.lexicon(lexicalize(Cooperation).english("cooperation"));
O.lexicon(lexicalize(SharesGoal).english("shares goal"));
O.lexicon(lexicalize(Contributes).english("contributes"));

export default O.seal();
