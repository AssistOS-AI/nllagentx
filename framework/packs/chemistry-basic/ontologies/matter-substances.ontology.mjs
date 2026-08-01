import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("chemistry-basic.matter-substances", "1.0.0");
export const MaterialSample = O.entity(
  entityKind("MaterialSample").provide(capability("MaterialSample"))
);
export const PureSubstance = O.entity(
  entityKind("PureSubstance").provide(capability("PureSubstance"))
);
export const Element = O.entity(
  entityKind("Element").provide(capability("Element"))
);
export const Compound = O.entity(
  entityKind("Compound").provide(capability("Compound"))
);
export const Mixture = O.entity(
  entityKind("Mixture").provide(capability("Mixture"))
);
export const ContainsSample = O.event(
  eventKind("ContainsSample")
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
    .provide(capability("ContainsSample"))
);
O.lexicon(lexicalize(MaterialSample).english("material sample"));
O.lexicon(lexicalize(PureSubstance).english("pure substance"));
O.lexicon(lexicalize(Element).english("element"));
O.lexicon(lexicalize(Compound).english("compound"));
O.lexicon(lexicalize(Mixture).english("mixture"));
O.lexicon(lexicalize(ContainsSample).english("contains sample"));

export default O.seal();
