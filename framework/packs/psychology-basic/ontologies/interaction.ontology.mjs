import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("psychology-basic.interaction", "1.0.0");
export const TrustState = O.entity(
  entityKind("TrustState").provide(capability("TrustState"))
);
export const Expectation = O.entity(
  entityKind("Expectation").provide(capability("Expectation"))
);
O.lexicon(lexicalize(TrustState).english("trust state"));
O.lexicon(lexicalize(Expectation).english("expectation"));

export default O.seal();
