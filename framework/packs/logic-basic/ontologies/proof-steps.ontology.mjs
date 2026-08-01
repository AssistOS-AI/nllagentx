import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("logic-basic.proof-steps", "1.0.0");
export const Premise = O.entity(
  entityKind("Premise").provide(capability("Premise"))
);
export const Conclusion = O.entity(
  entityKind("Conclusion").provide(capability("Conclusion"))
);
export const ProofStep = O.entity(
  entityKind("ProofStep").provide(capability("ProofStep"))
);
export const Countermodel = O.entity(
  entityKind("Countermodel").provide(capability("Countermodel"))
);
export const UsesRule = O.event(
  eventKind("UsesRule")
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
    .provide(capability("UsesRule"))
);
O.lexicon(lexicalize(Premise).english("premise"));
O.lexicon(lexicalize(Conclusion).english("conclusion"));
O.lexicon(lexicalize(ProofStep).english("proof step"));
O.lexicon(lexicalize(Countermodel).english("countermodel"));
O.lexicon(lexicalize(UsesRule).english("uses rule"));

export default O.seal();
