import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("core-commonsense.entities", "1.0.0");
export const Agent = O.entity(
  entityKind("Agent").provide(capability("Agent"))
);
export const Person = O.entity(
  entityKind("Person").provide(capability("Person"))
);
export const GroupAgent = O.entity(
  entityKind("GroupAgent").provide(capability("GroupAgent"))
);
export const PhysicalObject = O.entity(
  entityKind("PhysicalObject").provide(capability("PhysicalObject"))
);
export const Substance = O.entity(
  entityKind("Substance").provide(capability("Substance"))
);
export const Tool = O.entity(
  entityKind("Tool").provide(capability("Tool"))
);
export const InformationArtifact = O.entity(
  entityKind("InformationArtifact").provide(capability("InformationArtifact"))
);
export const Create = O.event(
  eventKind("Create")
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
    .provide(capability("Create"))
);
export const Destroy = O.event(
  eventKind("Destroy")
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
    .provide(capability("Destroy"))
);
export const Appear = O.event(
  eventKind("Appear")
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
    .provide(capability("Appear"))
);
export const Disappear = O.event(
  eventKind("Disappear")
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
    .provide(capability("Disappear"))
);
O.lexicon(lexicalize(Agent).english("agent"));
O.lexicon(lexicalize(Person).english("person"));
O.lexicon(lexicalize(GroupAgent).english("group agent"));
O.lexicon(lexicalize(PhysicalObject).english("physical object"));
O.lexicon(lexicalize(Substance).english("substance"));
O.lexicon(lexicalize(Tool).english("tool"));
O.lexicon(lexicalize(InformationArtifact).english("information artifact"));
O.lexicon(lexicalize(Create).english("create"));
O.lexicon(lexicalize(Destroy).english("destroy"));
O.lexicon(lexicalize(Appear).english("appear"));
O.lexicon(lexicalize(Disappear).english("disappear"));

export default O.seal();
