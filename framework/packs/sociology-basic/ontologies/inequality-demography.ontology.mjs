import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("sociology-basic.inequality-demography", "1.0.0");
export const Distribution = O.entity(
  entityKind("Distribution").provide(capability("Distribution"))
);
export const InequalityMeasure = O.entity(
  entityKind("InequalityMeasure").provide(capability("InequalityMeasure"))
);
export const DemographicMeasure = O.entity(
  entityKind("DemographicMeasure").provide(capability("DemographicMeasure"))
);
export const SurveyClaim = O.entity(
  entityKind("SurveyClaim").provide(capability("SurveyClaim"))
);
export const AggregateClaim = O.entity(
  entityKind("AggregateClaim").provide(capability("AggregateClaim"))
);
export const DistributedAcross = O.event(
  eventKind("DistributedAcross")
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
    .provide(capability("DistributedAcross"))
);
export const MeasuredIn = O.event(
  eventKind("MeasuredIn")
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
    .provide(capability("MeasuredIn"))
);
O.lexicon(lexicalize(Distribution).english("distribution"));
O.lexicon(lexicalize(InequalityMeasure).english("inequality measure"));
O.lexicon(lexicalize(DemographicMeasure).english("demographic measure"));
O.lexicon(lexicalize(SurveyClaim).english("survey claim"));
O.lexicon(lexicalize(AggregateClaim).english("aggregate claim"));
O.lexicon(lexicalize(DistributedAcross).english("distributed across"));
O.lexicon(lexicalize(MeasuredIn).english("measured in"));

export default O.seal();
