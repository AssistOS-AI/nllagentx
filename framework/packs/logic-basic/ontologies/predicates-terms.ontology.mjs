import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("logic-basic.predicates-terms", "1.0.0");
export const Predicate = O.entity(
  entityKind("Predicate").provide(capability("Predicate"))
);
export const Term = O.entity(
  entityKind("Term").provide(capability("Term"))
);
export const Variable = O.entity(
  entityKind("Variable").provide(capability("Variable"))
);
export const Constant = O.entity(
  entityKind("Constant").provide(capability("Constant"))
);
O.lexicon(lexicalize(Predicate).english("predicate"));
O.lexicon(lexicalize(Term).english("term"));
O.lexicon(lexicalize(Variable).english("variable"));
O.lexicon(lexicalize(Constant).english("constant"));

export default O.seal();
