import {
  describe, taskSource, section, claim, groundedAt, asserted, confidence,
  coverage, sequence, named, ClockTime, before
} from "../../../../../framework/sdk/longtext/index.mjs";
import registry from "../source/source-map.mjs";
import { Person, Gate, Building, Open, Alarm, actor, theme, location, time } from "../../../ontologies/facility.ontology.mjs";

const source = taskSource("source-001", registry);
const alarmWords = "The alarm sounded in Building A at 08:57.";
const openingWords = "Ana opened the north gate at 09:00.";
const ana = Person(named("Ana"));
const northGate = Gate(named("north gate"));
const buildingA = Building(named("Building A"));
const alarmEvent = Alarm(location(buildingA), time(ClockTime("08:57")));
const openingEvent = Open(actor(ana), theme(northGate), time(ClockTime("09:00")));

export default describe("facility-order-source-model")
  .section(section("incident", sequence(
    claim(alarmEvent).polarity(asserted()).grounding(groundedAt(source.spanByText(alarmWords))).confidence(confidence(1)),
    claim(openingEvent).polarity(asserted()).grounding(groundedAt(source.spanByText(openingWords))).confidence(confidence(1))
  )))
  .relation(before(alarmEvent, openingEvent))
  .coverage(coverage(Open).forScope("incident").complete(), coverage(Alarm).forScope("incident").complete())
  .commit();
