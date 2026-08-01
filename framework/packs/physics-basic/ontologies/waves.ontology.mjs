import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("physics-basic.waves", "1.0.0");
export const Wave = O.entity(
  entityKind("Wave").provide(capability("Wave"))
);
export const Frequency = O.entity(
  entityKind("Frequency").provide(capability("Frequency"))
);
export const Wavelength = O.entity(
  entityKind("Wavelength").provide(capability("Wavelength"))
);
export const Amplitude = O.entity(
  entityKind("Amplitude").provide(capability("Amplitude"))
);
export const Propagates = O.event(
  eventKind("Propagates")
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
    .provide(capability("Propagates"))
);
O.lexicon(lexicalize(Wave).english("wave"));
O.lexicon(lexicalize(Frequency).english("frequency"));
O.lexicon(lexicalize(Wavelength).english("wavelength"));
O.lexicon(lexicalize(Amplitude).english("amplitude"));
O.lexicon(lexicalize(Propagates).english("propagates"));

export default O.seal();
