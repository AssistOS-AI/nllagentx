// Fluent LongTextJS example grounded in one registered source unit.
import {
  describe, sourceUnit, section, claim, groundedAt, asserted,
  confidence, coverage, sequence, named, ClockTime, before
} from "../../framework/sdk/longtext/index.mjs";
import { Person, Gate, Building, Open, Alarm, actor, theme, location, time } from "../ontologies/facility.ontology.mjs";

const source = sourceUnit("incident-report-section-1");
const ana = Person(named("Ana"));
const northGate = Gate(named("north gate"));
const buildingA = Building(named("Building A"));

const alarmEvent = Alarm(
  location(buildingA),
  time(ClockTime("08:57"))
);

const openingEvent = Open(
  actor(ana),
  theme(northGate),
  time(ClockTime("09:00"))
);

const alarmClaim = claim(alarmEvent)
  .polarity(asserted())
  .grounding(groundedAt(source.span(0, 44)))
  .confidence(confidence(0.99));

const openingClaim = claim(openingEvent)
  .polarity(asserted())
  .grounding(groundedAt(source.span(45, 88)))
  .confidence(confidence(0.97));

export default describe("facility-task")
  .section(section("incident", sequence(alarmClaim, openingClaim)))
  .relation(before(alarmEvent, openingEvent))
  .coverage(coverage(Open).forScope("incident").complete())
  .coverage(coverage(Alarm).forScope("incident").complete())
  .commit();
