import {
  ontology, entityKind, eventKind, stateKind, propositionKind, valueKind, role, allows, atMostOne,
  lexicalize, capability
} from "../../../sdk/ontology/ontology.mjs";

const O = ontology("core-language", "1.0.0");
export const SemanticEntity = O.entity(entityKind("SemanticEntity").provide(capability("SemanticEntity")));
export const Agent = O.entity(entityKind("Agent").subtypeOf(SemanticEntity));
export const PhysicalObject = O.entity(entityKind("PhysicalObject").subtypeOf(SemanticEntity));
export const Place = O.entity(entityKind("Place").subtypeOf(SemanticEntity));
export const InformationArtifact = O.entity(entityKind("InformationArtifact").subtypeOf(SemanticEntity));
export const Proposition = O.proposition(propositionKind("Proposition").provide(capability("Proposition")));
export const Event = O.event(eventKind("Event").provide(capability("Event")));
export const State = O.state(stateKind("State").provide(capability("State")));
export const TimeValue = O.value(valueKind("TimeValue"));
export const QuantityValue = O.value(valueKind("QuantityValue"));
export const Context = O.entity(entityKind("Context"));
export const Evidence = O.entity(entityKind("Evidence"));

export const actor = O.role(role("actor").range(Agent));
export const agent = O.role(role("agent").range(Agent));
export const theme = O.role(role("theme").range(SemanticEntity));
export const subject = O.role(role("subject").range(SemanticEntity));
export const object = O.role(role("object").range(SemanticEntity));
export const source = O.role(role("source").range(SemanticEntity));
export const target = O.role(role("target").range(SemanticEntity));
export const location = O.role(role("location").range(Place));
export const time = O.role(role("time").range(TimeValue));
export const quantity = O.role(role("quantity").range(QuantityValue));
export const context = O.role(role("context").range(Context));
export const evidence = O.role(role("evidence").range(Evidence));
export const value = O.role(role("value"));
export const from = O.role(role("from"));
export const to = O.role(role("to"));

O.lexicon(lexicalize(Event).english("event"));
O.lexicon(lexicalize(State).english("state"));

export default O.seal();
