import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("math-basic.proof-explanation", "1.0.0");
export const MathematicalClaim = O.entity(
  entityKind("MathematicalClaim").provide(capability("MathematicalClaim"))
);
export const DerivationStep = O.entity(
  entityKind("DerivationStep").provide(capability("DerivationStep"))
);
export const DerivedFrom = O.event(
  eventKind("DerivedFrom")
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
    .provide(capability("DerivedFrom"))
);
O.lexicon(lexicalize(MathematicalClaim).english("mathematical claim"));
O.lexicon(lexicalize(DerivationStep).english("derivation step"));
O.lexicon(lexicalize(DerivedFrom).english("derived from"));

export default O.seal();
