import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("chemistry-basic.acids-bases", "1.0.0");
export const Acidic = O.entity(
  entityKind("Acidic").provide(capability("Acidic"))
);
export const Neutral = O.entity(
  entityKind("Neutral").provide(capability("Neutral"))
);
export const Basic = O.entity(
  entityKind("Basic").provide(capability("Basic"))
);
export const HasPH = O.event(
  eventKind("HasPH")
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
    .provide(capability("HasPH"))
);
O.lexicon(lexicalize(Acidic).english("acidic"));
O.lexicon(lexicalize(Neutral).english("neutral"));
O.lexicon(lexicalize(Basic).english("basic"));
O.lexicon(lexicalize(HasPH).english("has ph"));

export default O.seal();
