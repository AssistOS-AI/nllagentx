import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("math-basic.algebra", "1.0.0");
export const Expression = O.entity(
  entityKind("Expression").provide(capability("Expression"))
);
export const Variable = O.entity(
  entityKind("Variable").provide(capability("Variable"))
);
export const Equation = O.entity(
  entityKind("Equation").provide(capability("Equation"))
);
export const Inequality = O.entity(
  entityKind("Inequality").provide(capability("Inequality"))
);
export const EquivalentExpression = O.event(
  eventKind("EquivalentExpression")
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
    .provide(capability("EquivalentExpression"))
);
O.lexicon(lexicalize(Expression).english("expression"));
O.lexicon(lexicalize(Variable).english("variable"));
O.lexicon(lexicalize(Equation).english("equation"));
O.lexicon(lexicalize(Inequality).english("inequality"));
O.lexicon(lexicalize(EquivalentExpression).english("equivalent expression"));

export default O.seal();
