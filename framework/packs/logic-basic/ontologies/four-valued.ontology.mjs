import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("logic-basic.four-valued", "1.0.0");
export const LogicValue = O.entity(
  entityKind("LogicValue").provide(capability("LogicValue"))
);
O.lexicon(lexicalize(LogicValue).english("logic value"));

export default O.seal();
