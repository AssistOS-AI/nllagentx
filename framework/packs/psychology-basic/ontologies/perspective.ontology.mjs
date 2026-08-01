import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("psychology-basic.perspective", "1.0.0");
export const Perspective = O.entity(
  entityKind("Perspective").provide(capability("Perspective"))
);
export const MentalStateEvidence = O.entity(
  entityKind("MentalStateEvidence").provide(capability("MentalStateEvidence"))
);
export const ReportsMentalState = O.event(
  eventKind("ReportsMentalState")
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
    .provide(capability("ReportsMentalState"))
);
O.lexicon(lexicalize(Perspective).english("perspective"));
O.lexicon(lexicalize(MentalStateEvidence).english("mental state evidence"));
O.lexicon(lexicalize(ReportsMentalState).english("reports mental state"));

export default O.seal();
