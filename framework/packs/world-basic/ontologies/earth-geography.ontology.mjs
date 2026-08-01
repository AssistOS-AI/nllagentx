import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("world-basic.earth-geography", "1.0.0");
export const GeographicRegion = O.entity(
  entityKind("GeographicRegion").provide(capability("GeographicRegion"))
);
export const Earth = O.entity(
  entityKind("Earth").provide(capability("Earth"))
);
export const Land = O.entity(
  entityKind("Land").provide(capability("Land"))
);
export const WaterBody = O.entity(
  entityKind("WaterBody").provide(capability("WaterBody"))
);
export const Continent = O.entity(
  entityKind("Continent").provide(capability("Continent"))
);
export const Country = O.entity(
  entityKind("Country").provide(capability("Country"))
);
export const Region = O.entity(
  entityKind("Region").provide(capability("Region"))
);
export const City = O.entity(
  entityKind("City").provide(capability("City"))
);
export const Village = O.entity(
  entityKind("Village").provide(capability("Village"))
);
export const River = O.entity(
  entityKind("River").provide(capability("River"))
);
export const Lake = O.entity(
  entityKind("Lake").provide(capability("Lake"))
);
export const Sea = O.entity(
  entityKind("Sea").provide(capability("Sea"))
);
export const Ocean = O.entity(
  entityKind("Ocean").provide(capability("Ocean"))
);
export const Mountain = O.entity(
  entityKind("Mountain").provide(capability("Mountain"))
);
export const Map = O.entity(
  entityKind("Map").provide(capability("Map"))
);
export const LocatedIn = O.event(
  eventKind("LocatedIn")
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
    .provide(capability("LocatedIn"))
);
export const PartOf = O.event(
  eventKind("PartOf")
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
    .provide(capability("PartOf"))
);
O.lexicon(lexicalize(GeographicRegion).english("geographic region"));
O.lexicon(lexicalize(Earth).english("earth"));
O.lexicon(lexicalize(Land).english("land"));
O.lexicon(lexicalize(WaterBody).english("water body"));
O.lexicon(lexicalize(Continent).english("continent"));
O.lexicon(lexicalize(Country).english("country"));
O.lexicon(lexicalize(Region).english("region"));
O.lexicon(lexicalize(City).english("city"));
O.lexicon(lexicalize(Village).english("village"));
O.lexicon(lexicalize(River).english("river"));
O.lexicon(lexicalize(Lake).english("lake"));
O.lexicon(lexicalize(Sea).english("sea"));
O.lexicon(lexicalize(Ocean).english("ocean"));
O.lexicon(lexicalize(Mountain).english("mountain"));
O.lexicon(lexicalize(Map).english("map"));
O.lexicon(lexicalize(LocatedIn).english("located in"));
O.lexicon(lexicalize(PartOf).english("part of"));

export default O.seal();
