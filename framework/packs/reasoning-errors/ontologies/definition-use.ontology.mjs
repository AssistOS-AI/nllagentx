import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("reasoning-errors.definition-use", "1.0.0");
export const DefinitionUse = O.entity(
  entityKind("DefinitionUse").provide(capability("DefinitionUse"))
);
export const TermSense = O.entity(
  entityKind("TermSense").provide(capability("TermSense"))
);
export const Defines = O.event(
  eventKind("Defines")
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
    .provide(capability("Defines"))
);
export const UsesSense = O.event(
  eventKind("UsesSense")
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
    .provide(capability("UsesSense"))
);
O.lexicon(lexicalize(DefinitionUse).english("definition use"));
O.lexicon(lexicalize(TermSense).english("term sense"));
O.lexicon(lexicalize(Defines).english("defines"));
O.lexicon(lexicalize(UsesSense).english("uses sense"));

export default O.seal();
