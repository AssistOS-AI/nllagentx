import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("physics-basic.energy", "1.0.0");
export const Energy = O.entity(
  entityKind("Energy").provide(capability("Energy"))
);
export const Work = O.entity(
  entityKind("Work").provide(capability("Work"))
);
export const Power = O.entity(
  entityKind("Power").provide(capability("Power"))
);
export const EnergyTransfer = O.entity(
  entityKind("EnergyTransfer").provide(capability("EnergyTransfer"))
);
export const TransfersEnergy = O.event(
  eventKind("TransfersEnergy")
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
    .provide(capability("TransfersEnergy"))
);
O.lexicon(lexicalize(Energy).english("energy"));
O.lexicon(lexicalize(Work).english("work"));
O.lexicon(lexicalize(Power).english("power"));
O.lexicon(lexicalize(EnergyTransfer).english("energy transfer"));
O.lexicon(lexicalize(TransfersEnergy).english("transfers energy"));

export default O.seal();
