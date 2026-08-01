import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("biology-basic.evolution-adaptation", "1.0.0");
export const Adaptation = O.entity(
  entityKind("Adaptation").provide(capability("Adaptation"))
);
export const Variation = O.entity(
  entityKind("Variation").provide(capability("Variation"))
);
export const SelectionProcess = O.entity(
  entityKind("SelectionProcess").provide(capability("SelectionProcess"))
);
export const SelectedUnder = O.event(
  eventKind("SelectedUnder")
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
    .provide(capability("SelectedUnder"))
);
O.lexicon(lexicalize(Adaptation).english("adaptation"));
O.lexicon(lexicalize(Variation).english("variation"));
O.lexicon(lexicalize(SelectionProcess).english("selection process"));
O.lexicon(lexicalize(SelectedUnder).english("selected under"));

export default O.seal();
