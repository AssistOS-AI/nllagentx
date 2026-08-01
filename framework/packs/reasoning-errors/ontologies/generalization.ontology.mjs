import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("reasoning-errors.generalization", "1.0.0");
export const GeneralizationClaim = O.entity(
  entityKind("GeneralizationClaim").provide(capability("GeneralizationClaim"))
);
export const Sample = O.entity(
  entityKind("Sample").provide(capability("Sample"))
);
export const Population = O.entity(
  entityKind("Population").provide(capability("Population"))
);
export const Counterexample = O.entity(
  entityKind("Counterexample").provide(capability("Counterexample"))
);
export const GeneralizesFrom = O.event(
  eventKind("GeneralizesFrom")
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
    .provide(capability("GeneralizesFrom"))
);
O.lexicon(lexicalize(GeneralizationClaim).english("generalization claim"));
O.lexicon(lexicalize(Sample).english("sample"));
O.lexicon(lexicalize(Population).english("population"));
O.lexicon(lexicalize(Counterexample).english("counterexample"));
O.lexicon(lexicalize(GeneralizesFrom).english("generalizes from"));

export default O.seal();
