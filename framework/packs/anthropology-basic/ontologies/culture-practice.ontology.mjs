import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("anthropology-basic.culture-practice", "1.0.0");
export const CulturalGroup = O.entity(
  entityKind("CulturalGroup").provide(capability("CulturalGroup"))
);
export const Community = O.entity(
  entityKind("Community").provide(capability("Community"))
);
export const Population = O.entity(
  entityKind("Population").provide(capability("Population"))
);
export const CulturalPractice = O.entity(
  entityKind("CulturalPractice").provide(capability("CulturalPractice"))
);
export const Value = O.entity(
  entityKind("Value").provide(capability("Value"))
);
export const Symbol = O.entity(
  entityKind("Symbol").provide(capability("Symbol"))
);
export const ReportedValue = O.entity(
  entityKind("ReportedValue").provide(capability("ReportedValue"))
);
export const IndividualAction = O.entity(
  entityKind("IndividualAction").provide(capability("IndividualAction"))
);
export const PracticedBy = O.event(
  eventKind("PracticedBy")
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
    .provide(capability("PracticedBy"))
);
export const Symbolizes = O.event(
  eventKind("Symbolizes")
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
    .provide(capability("Symbolizes"))
);
O.lexicon(lexicalize(CulturalGroup).english("cultural group"));
O.lexicon(lexicalize(Community).english("community"));
O.lexicon(lexicalize(Population).english("population"));
O.lexicon(lexicalize(CulturalPractice).english("cultural practice"));
O.lexicon(lexicalize(Value).english("value"));
O.lexicon(lexicalize(Symbol).english("symbol"));
O.lexicon(lexicalize(ReportedValue).english("reported value"));
O.lexicon(lexicalize(IndividualAction).english("individual action"));
O.lexicon(lexicalize(PracticedBy).english("practiced by"));
O.lexicon(lexicalize(Symbolizes).english("symbolizes"));

export default O.seal();
