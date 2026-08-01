import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("chemistry-basic.reactions", "1.0.0");
export const ChemicalReaction = O.entity(
  entityKind("ChemicalReaction").provide(capability("ChemicalReaction"))
);
export const Reactant = O.entity(
  entityKind("Reactant").provide(capability("Reactant"))
);
export const Product = O.entity(
  entityKind("Product").provide(capability("Product"))
);
export const ChemicalChange = O.entity(
  entityKind("ChemicalChange").provide(capability("ChemicalChange"))
);
export const ReactionCondition = O.entity(
  entityKind("ReactionCondition").provide(capability("ReactionCondition"))
);
export const Reacts = O.event(
  eventKind("Reacts")
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
    .provide(capability("Reacts"))
);
O.lexicon(lexicalize(ChemicalReaction).english("chemical reaction"));
O.lexicon(lexicalize(Reactant).english("reactant"));
O.lexicon(lexicalize(Product).english("product"));
O.lexicon(lexicalize(ChemicalChange).english("chemical change"));
O.lexicon(lexicalize(ReactionCondition).english("reaction condition"));
O.lexicon(lexicalize(Reacts).english("reacts"));

export default O.seal();
