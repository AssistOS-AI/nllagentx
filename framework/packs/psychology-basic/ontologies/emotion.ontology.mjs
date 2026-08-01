import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("psychology-basic.emotion", "1.0.0");
export const EmotionState = O.entity(
  entityKind("EmotionState").provide(capability("EmotionState"))
);
export const Appraisal = O.entity(
  entityKind("Appraisal").provide(capability("Appraisal"))
);
export const Regulation = O.entity(
  entityKind("Regulation").provide(capability("Regulation"))
);
export const Appraises = O.event(
  eventKind("Appraises")
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
    .provide(capability("Appraises"))
);
export const Feels = O.event(
  eventKind("Feels")
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
    .provide(capability("Feels"))
);
O.lexicon(lexicalize(EmotionState).english("emotion state"));
O.lexicon(lexicalize(Appraisal).english("appraisal"));
O.lexicon(lexicalize(Regulation).english("regulation"));
O.lexicon(lexicalize(Appraises).english("appraises"));
O.lexicon(lexicalize(Feels).english("feels"));

export default O.seal();
