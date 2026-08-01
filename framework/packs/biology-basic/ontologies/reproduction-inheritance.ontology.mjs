import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("biology-basic.reproduction-inheritance", "1.0.0");
export const Trait = O.entity(
  entityKind("Trait").provide(capability("Trait"))
);
export const Gene = O.entity(
  entityKind("Gene").provide(capability("Gene"))
);
export const InheritedVariant = O.entity(
  entityKind("InheritedVariant").provide(capability("InheritedVariant"))
);
export const EnvironmentalInfluence = O.entity(
  entityKind("EnvironmentalInfluence").provide(capability("EnvironmentalInfluence"))
);
export const LifecycleStage = O.entity(
  entityKind("LifecycleStage").provide(capability("LifecycleStage"))
);
export const ReproductiveEvent = O.entity(
  entityKind("ReproductiveEvent").provide(capability("ReproductiveEvent"))
);
export const DevelopsFrom = O.event(
  eventKind("DevelopsFrom")
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
    .provide(capability("DevelopsFrom"))
);
export const Inherits = O.event(
  eventKind("Inherits")
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
    .provide(capability("Inherits"))
);
O.lexicon(lexicalize(Trait).english("trait"));
O.lexicon(lexicalize(Gene).english("gene"));
O.lexicon(lexicalize(InheritedVariant).english("inherited variant"));
O.lexicon(lexicalize(EnvironmentalInfluence).english("environmental influence"));
O.lexicon(lexicalize(LifecycleStage).english("lifecycle stage"));
O.lexicon(lexicalize(ReproductiveEvent).english("reproductive event"));
O.lexicon(lexicalize(DevelopsFrom).english("develops from"));
O.lexicon(lexicalize(Inherits).english("inherits"));

export default O.seal();
