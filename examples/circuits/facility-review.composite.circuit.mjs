// Composition example: a root circuit asks for capabilities rather than physical modules.
import {
  compositeCircuit, capability, requireCapability, provideCapability,
  composeByCapability, emitCollection, guarantee
} from "../../framework/sdk/circuit/index.mjs";

const orderFindings = requireCapability("FacilityOrderFinding");
const contradictionFindings = requireCapability("FacilityContradictionFinding");

export default compositeCircuit("example.facility-review", "1.0.0")
  .requires(capability("AlarmEvent"), capability("OpeningEvent"))
  .compose(
    composeByCapability(orderFindings),
    composeByCapability(contradictionFindings).whenAvailable()
  )
  .emit(emitCollection("findings", orderFindings, contradictionFindings))
  .provides(
    provideCapability("FacilityReview"),
    guarantee("evidence-bearing"),
    guarantee("plan-explainable")
  )
  .seal();
