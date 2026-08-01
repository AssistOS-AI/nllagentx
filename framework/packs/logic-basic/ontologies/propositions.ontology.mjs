import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("logic-basic.propositions", "1.0.0");
export const Proposition = O.entity(
  entityKind("Proposition").provide(capability("Proposition"))
);
export const AtomicProposition = O.entity(
  entityKind("AtomicProposition").provide(capability("AtomicProposition"))
);
export const CompoundProposition = O.entity(
  entityKind("CompoundProposition").provide(capability("CompoundProposition"))
);
export const Implication = O.entity(
  entityKind("Implication").provide(capability("Implication"))
);
export const Equivalence = O.entity(
  entityKind("Equivalence").provide(capability("Equivalence"))
);
export const Conjunction = O.entity(
  entityKind("Conjunction").provide(capability("Conjunction"))
);
export const Disjunction = O.entity(
  entityKind("Disjunction").provide(capability("Disjunction"))
);
export const Negation = O.entity(
  entityKind("Negation").provide(capability("Negation"))
);
export const And = O.event(
  eventKind("And")
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
    .provide(capability("And"))
);
export const Or = O.event(
  eventKind("Or")
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
    .provide(capability("Or"))
);
export const Not = O.event(
  eventKind("Not")
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
    .provide(capability("Not"))
);
export const Implies = O.event(
  eventKind("Implies")
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
    .provide(capability("Implies"))
);
export const Equivalent = O.event(
  eventKind("Equivalent")
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
    .provide(capability("Equivalent"))
);
O.lexicon(lexicalize(Proposition).english("proposition"));
O.lexicon(lexicalize(AtomicProposition).english("atomic proposition"));
O.lexicon(lexicalize(CompoundProposition).english("compound proposition"));
O.lexicon(lexicalize(Implication).english("implication"));
O.lexicon(lexicalize(Equivalence).english("equivalence"));
O.lexicon(lexicalize(Conjunction).english("conjunction"));
O.lexicon(lexicalize(Disjunction).english("disjunction"));
O.lexicon(lexicalize(Negation).english("negation"));
O.lexicon(lexicalize(And).english("and"));
O.lexicon(lexicalize(Or).english("or"));
O.lexicon(lexicalize(Not).english("not"));
O.lexicon(lexicalize(Implies).english("implies"));
O.lexicon(lexicalize(Equivalent).english("equivalent"));

export default O.seal();
