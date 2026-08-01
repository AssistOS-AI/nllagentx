import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("psychology-basic.memory", "1.0.0");
export const MemoryTrace = O.entity(
  entityKind("MemoryTrace").provide(capability("MemoryTrace"))
);
export const Remember = O.entity(
  entityKind("Remember").provide(capability("Remember"))
);
export const Forget = O.entity(
  entityKind("Forget").provide(capability("Forget"))
);
export const Remembers = O.event(
  eventKind("Remembers")
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
    .provide(capability("Remembers"))
);
O.lexicon(lexicalize(MemoryTrace).english("memory trace"));
O.lexicon(lexicalize(Remember).english("remember"));
O.lexicon(lexicalize(Forget).english("forget"));
O.lexicon(lexicalize(Remembers).english("remembers"));

export default O.seal();
