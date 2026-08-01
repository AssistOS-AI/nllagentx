import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("chemistry-basic.laboratory-description", "1.0.0");
export const LaboratoryObservation = O.entity(
  entityKind("LaboratoryObservation").provide(capability("LaboratoryObservation"))
);
export const ObservedAs = O.event(
  eventKind("ObservedAs")
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
    .provide(capability("ObservedAs"))
);
O.lexicon(lexicalize(LaboratoryObservation).english("laboratory observation"));
O.lexicon(lexicalize(ObservedAs).english("observed as"));

export default O.seal();
