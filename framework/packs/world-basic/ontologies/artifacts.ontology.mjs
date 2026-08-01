import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("world-basic.artifacts", "1.0.0");
export const Artifact = O.entity(
  entityKind("Artifact").provide(capability("Artifact"))
);
export const Vehicle = O.entity(
  entityKind("Vehicle").provide(capability("Vehicle"))
);
export const InformationArtifact = O.entity(
  entityKind("InformationArtifact").provide(capability("InformationArtifact"))
);
export const Book = O.entity(
  entityKind("Book").provide(capability("Book"))
);
export const Document = O.entity(
  entityKind("Document").provide(capability("Document"))
);
export const Record = O.entity(
  entityKind("Record").provide(capability("Record"))
);
export const Message = O.entity(
  entityKind("Message").provide(capability("Message"))
);
export const Computer = O.entity(
  entityKind("Computer").provide(capability("Computer"))
);
export const Phone = O.entity(
  entityKind("Phone").provide(capability("Phone"))
);
export const Camera = O.entity(
  entityKind("Camera").provide(capability("Camera"))
);
export const Building = O.entity(
  entityKind("Building").provide(capability("Building"))
);
export const Door = O.entity(
  entityKind("Door").provide(capability("Door"))
);
export const Key = O.entity(
  entityKind("Key").provide(capability("Key"))
);
export const Lock = O.entity(
  entityKind("Lock").provide(capability("Lock"))
);
export const Machine = O.entity(
  entityKind("Machine").provide(capability("Machine"))
);
export const HasFunction = O.event(
  eventKind("HasFunction")
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
    .provide(capability("HasFunction"))
);
export const UsedFor = O.event(
  eventKind("UsedFor")
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
    .provide(capability("UsedFor"))
);
O.lexicon(lexicalize(Artifact).english("artifact"));
O.lexicon(lexicalize(Vehicle).english("vehicle"));
O.lexicon(lexicalize(InformationArtifact).english("information artifact"));
O.lexicon(lexicalize(Book).english("book"));
O.lexicon(lexicalize(Document).english("document"));
O.lexicon(lexicalize(Record).english("record"));
O.lexicon(lexicalize(Message).english("message"));
O.lexicon(lexicalize(Computer).english("computer"));
O.lexicon(lexicalize(Phone).english("phone"));
O.lexicon(lexicalize(Camera).english("camera"));
O.lexicon(lexicalize(Building).english("building"));
O.lexicon(lexicalize(Door).english("door"));
O.lexicon(lexicalize(Key).english("key"));
O.lexicon(lexicalize(Lock).english("lock"));
O.lexicon(lexicalize(Machine).english("machine"));
O.lexicon(lexicalize(HasFunction).english("has function"));
O.lexicon(lexicalize(UsedFor).english("used for"));

export default O.seal();
