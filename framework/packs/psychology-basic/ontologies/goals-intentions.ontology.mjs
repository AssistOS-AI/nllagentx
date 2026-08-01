import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("psychology-basic.goals-intentions", "1.0.0");
export const Desire = O.entity(
  entityKind("Desire").provide(capability("Desire"))
);
export const Goal = O.entity(
  entityKind("Goal").provide(capability("Goal"))
);
export const Intention = O.entity(
  entityKind("Intention").provide(capability("Intention"))
);
export const Plan = O.entity(
  entityKind("Plan").provide(capability("Plan"))
);
export const Attempt = O.entity(
  entityKind("Attempt").provide(capability("Attempt"))
);
export const Wants = O.event(
  eventKind("Wants")
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
    .provide(capability("Wants"))
);
export const Intends = O.event(
  eventKind("Intends")
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
    .provide(capability("Intends"))
);
export const Attempts = O.event(
  eventKind("Attempts")
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
    .provide(capability("Attempts"))
);
O.lexicon(lexicalize(Desire).english("desire"));
O.lexicon(lexicalize(Goal).english("goal"));
O.lexicon(lexicalize(Intention).english("intention"));
O.lexicon(lexicalize(Plan).english("plan"));
O.lexicon(lexicalize(Attempt).english("attempt"));
O.lexicon(lexicalize(Wants).english("wants"));
O.lexicon(lexicalize(Intends).english("intends"));
O.lexicon(lexicalize(Attempts).english("attempts"));

export default O.seal();
