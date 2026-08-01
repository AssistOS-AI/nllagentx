import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("physics-basic.electricity-magnetism", "1.0.0");
export const ElectricCharge = O.entity(
  entityKind("ElectricCharge").provide(capability("ElectricCharge"))
);
export const Current = O.entity(
  entityKind("Current").provide(capability("Current"))
);
export const Voltage = O.entity(
  entityKind("Voltage").provide(capability("Voltage"))
);
export const Resistance = O.entity(
  entityKind("Resistance").provide(capability("Resistance"))
);
export const ElectricCircuit = O.entity(
  entityKind("ElectricCircuit").provide(capability("ElectricCircuit"))
);
export const Flows = O.event(
  eventKind("Flows")
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
    .provide(capability("Flows"))
);
O.lexicon(lexicalize(ElectricCharge).english("electric charge"));
O.lexicon(lexicalize(Current).english("current"));
O.lexicon(lexicalize(Voltage).english("voltage"));
O.lexicon(lexicalize(Resistance).english("resistance"));
O.lexicon(lexicalize(ElectricCircuit).english("electric circuit"));
O.lexicon(lexicalize(Flows).english("flows"));

export default O.seal();
