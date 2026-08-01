import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("physics-basic.models-units", "1.0.0");
export const PhysicalSystem = O.entity(
  entityKind("PhysicalSystem").provide(capability("PhysicalSystem"))
);
export const ParticleCollection = O.entity(
  entityKind("ParticleCollection").provide(capability("ParticleCollection"))
);
export const Measurement = O.entity(
  entityKind("Measurement").provide(capability("Measurement"))
);
export const ModelAssumption = O.entity(
  entityKind("ModelAssumption").provide(capability("ModelAssumption"))
);
export const BoundaryCondition = O.entity(
  entityKind("BoundaryCondition").provide(capability("BoundaryCondition"))
);
export const PhysicalSystemBoundary = O.entity(
  entityKind("PhysicalSystemBoundary").provide(capability("PhysicalSystemBoundary"))
);
export const MeasuredAs = O.event(
  eventKind("MeasuredAs")
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
    .provide(capability("MeasuredAs"))
);
export const UnderModel = O.event(
  eventKind("UnderModel")
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
    .provide(capability("UnderModel"))
);
O.lexicon(lexicalize(PhysicalSystem).english("physical system"));
O.lexicon(lexicalize(ParticleCollection).english("particle collection"));
O.lexicon(lexicalize(Measurement).english("measurement"));
O.lexicon(lexicalize(ModelAssumption).english("model assumption"));
O.lexicon(lexicalize(BoundaryCondition).english("boundary condition"));
O.lexicon(lexicalize(PhysicalSystemBoundary).english("physical system boundary"));
O.lexicon(lexicalize(MeasuredAs).english("measured as"));
O.lexicon(lexicalize(UnderModel).english("under model"));

export default O.seal();
