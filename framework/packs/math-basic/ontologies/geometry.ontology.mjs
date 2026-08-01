import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("math-basic.geometry", "1.0.0");
export const Length = O.entity(
  entityKind("Length").provide(capability("Length"))
);
export const Area = O.entity(
  entityKind("Area").provide(capability("Area"))
);
export const Volume = O.entity(
  entityKind("Volume").provide(capability("Volume"))
);
export const Angle = O.entity(
  entityKind("Angle").provide(capability("Angle"))
);
export const GeometricFigure = O.entity(
  entityKind("GeometricFigure").provide(capability("GeometricFigure"))
);
export const Perimeter = O.event(
  eventKind("Perimeter")
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
    .provide(capability("Perimeter"))
);
export const AreaCalculation = O.event(
  eventKind("AreaCalculation")
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
    .provide(capability("AreaCalculation"))
);
export const VolumeCalculation = O.event(
  eventKind("VolumeCalculation")
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
    .provide(capability("VolumeCalculation"))
);
O.lexicon(lexicalize(Length).english("length"));
O.lexicon(lexicalize(Area).english("area"));
O.lexicon(lexicalize(Volume).english("volume"));
O.lexicon(lexicalize(Angle).english("angle"));
O.lexicon(lexicalize(GeometricFigure).english("geometric figure"));
O.lexicon(lexicalize(Perimeter).english("perimeter"));
O.lexicon(lexicalize(AreaCalculation).english("area calculation"));
O.lexicon(lexicalize(VolumeCalculation).english("volume calculation"));

export default O.seal();
