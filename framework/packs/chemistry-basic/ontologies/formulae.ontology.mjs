import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("chemistry-basic.formulae", "1.0.0");
export const ChemicalSymbol = O.entity(
  entityKind("ChemicalSymbol").provide(capability("ChemicalSymbol"))
);
export const ChemicalFormula = O.entity(
  entityKind("ChemicalFormula").provide(capability("ChemicalFormula"))
);
O.lexicon(lexicalize(ChemicalSymbol).english("chemical symbol"));
O.lexicon(lexicalize(ChemicalFormula).english("chemical formula"));

export default O.seal();
