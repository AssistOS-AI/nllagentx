import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("physics-basic.thermal", "1.0.0");
export const Temperature = O.entity(
  entityKind("Temperature").provide(capability("Temperature"))
);
export const HeatTransfer = O.entity(
  entityKind("HeatTransfer").provide(capability("HeatTransfer"))
);
export const PhaseState = O.entity(
  entityKind("PhaseState").provide(capability("PhaseState"))
);
export const Heats = O.event(
  eventKind("Heats")
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
    .provide(capability("Heats"))
);
export const ChangesPhase = O.event(
  eventKind("ChangesPhase")
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
    .provide(capability("ChangesPhase"))
);
O.lexicon(lexicalize(Temperature).english("temperature"));
O.lexicon(lexicalize(HeatTransfer).english("heat transfer"));
O.lexicon(lexicalize(PhaseState).english("phase state"));
O.lexicon(lexicalize(Heats).english("heats"));
O.lexicon(lexicalize(ChangesPhase).english("changes phase"));

export default O.seal();
