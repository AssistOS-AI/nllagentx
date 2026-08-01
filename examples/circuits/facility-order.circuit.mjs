// Fluent CircuitJS example with query, decision and CNL output.
import {
  circuit, capability, guarantee, match, variable, before,
  decisionTable, row, when, satisfied, violated, unknown,
  emitFinding, evidence, abstractPreflight, symbolicDecisionCoverage
} from "../../framework/sdk/circuit/index.mjs";
import { Open, Alarm, Building, Gate, location, theme } from "../ontologies/facility.ontology.mjs";

const building = variable(Building);
const gate = variable(Gate);

const alarms = match(Alarm(location(building))).as("alarms");
const openings = match(Open(theme(gate))).as("openings");

const order = before(alarms, openings);

const result = decisionTable("alarm-before-opening")
  .add(row(when(order.isTrue()), satisfied("ORDER_OK", evidence(alarms, openings))))
  .add(row(when(order.isFalse()), violated("OPENED_BEFORE_ALARM", evidence(alarms, openings))))
  .add(row(when(order.isUnknown()), unknown("ORDER_NOT_ESTABLISHED", evidence(alarms, openings))))
  .seal();

export default circuit("example.facility-order", "1.0.0")
  .requires(capability("AlarmEvent"), capability("OpeningEvent"))
  .provides(capability("FacilityOrderFinding"), guarantee("evidence-bearing"))
  .use(alarms)
  .use(openings)
  .use(result)
  .emit(emitFinding(result))
  .assurance(abstractPreflight(), symbolicDecisionCoverage())
  .seal();
