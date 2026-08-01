import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("physics-basic.motion", "1.0.0");
export const PhysicalBody = O.entity(
  entityKind("PhysicalBody").provide(capability("PhysicalBody"))
);
export const Position = O.entity(
  entityKind("Position").provide(capability("Position"))
);
export const MotionState = O.entity(
  entityKind("MotionState").provide(capability("MotionState"))
);
export const Velocity = O.entity(
  entityKind("Velocity").provide(capability("Velocity"))
);
export const Acceleration = O.entity(
  entityKind("Acceleration").provide(capability("Acceleration"))
);
export const Move = O.event(
  eventKind("Move")
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
    .provide(capability("Move"))
);
O.lexicon(lexicalize(PhysicalBody).english("physical body"));
O.lexicon(lexicalize(Position).english("position"));
O.lexicon(lexicalize(MotionState).english("motion state"));
O.lexicon(lexicalize(Velocity).english("velocity"));
O.lexicon(lexicalize(Acceleration).english("acceleration"));
O.lexicon(lexicalize(Move).english("move"));

export default O.seal();
