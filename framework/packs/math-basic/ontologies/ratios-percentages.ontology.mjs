import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("math-basic.ratios-percentages", "1.0.0");
export const Ratio = O.entity(
  entityKind("Ratio").provide(capability("Ratio"))
);
export const Rate = O.entity(
  entityKind("Rate").provide(capability("Rate"))
);
export const Percentage = O.entity(
  entityKind("Percentage").provide(capability("Percentage"))
);
export const Proportion = O.entity(
  entityKind("Proportion").provide(capability("Proportion"))
);
export const ProportionalTo = O.event(
  eventKind("ProportionalTo")
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
    .provide(capability("ProportionalTo"))
);
export const RateOfChange = O.event(
  eventKind("RateOfChange")
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
    .provide(capability("RateOfChange"))
);
O.lexicon(lexicalize(Ratio).english("ratio"));
O.lexicon(lexicalize(Rate).english("rate"));
O.lexicon(lexicalize(Percentage).english("percentage"));
O.lexicon(lexicalize(Proportion).english("proportion"));
O.lexicon(lexicalize(ProportionalTo).english("proportional to"));
O.lexicon(lexicalize(RateOfChange).english("rate of change"));

export default O.seal();
