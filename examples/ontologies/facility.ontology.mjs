// Fluent OntologyJS example. It is syntactically real `.mjs`; imports become available after SDK implementation.
import {
  ontology, entityKind, eventKind, role, requires, allows,
  exactlyOne, atMostOne, lexicalize, capability
} from "../../framework/sdk/ontology/ontology.mjs";

const O = ontology("example.facility", "1.0.0");

export const Person = O.entity(entityKind("Person"));
export const Gate = O.entity(entityKind("Gate"));
export const Building = O.entity(entityKind("Building"));
export const TimeValue = O.value("TimeValue");

export const actor = O.role(role("actor").range(Person));
export const theme = O.role(role("theme").range(Gate));
export const location = O.role(role("location").range(Building));
export const time = O.role(role("time").range(TimeValue));

export const Open = O.event(
  eventKind("Open")
    .role(requires(actor, exactlyOne()))
    .role(requires(theme, exactlyOne()))
    .role(allows(time, atMostOne()))
    .provide(capability("OpeningEvent"))
);

export const Alarm = O.event(
  eventKind("Alarm")
    .role(requires(location, exactlyOne()))
    .role(allows(time, atMostOne()))
    .provide(capability("AlarmEvent"))
);

O.lexicon(lexicalize(Open).english("open", "opens", "opened"));
O.lexicon(lexicalize(Alarm).english("alarm", "alarms", "alarmed"));

export default O.seal();
