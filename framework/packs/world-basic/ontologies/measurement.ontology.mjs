import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("world-basic.measurement", "1.0.0");
export const Clock = O.entity(
  entityKind("Clock").provide(capability("Clock"))
);
export const Thermometer = O.entity(
  entityKind("Thermometer").provide(capability("Thermometer"))
);
export const Scale = O.entity(
  entityKind("Scale").provide(capability("Scale"))
);
O.lexicon(lexicalize(Clock).english("clock"));
O.lexicon(lexicalize(Thermometer).english("thermometer"));
O.lexicon(lexicalize(Scale).english("scale"));

export default O.seal();
