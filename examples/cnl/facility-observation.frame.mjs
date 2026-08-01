// A semantic CNL frame, not final free prose.
import {
  observationFrame, subject, predicate, evidenceSlot,
  certainty, recommendation, sourceBound, conditional
} from "../../framework/sdk/cnl/frames.mjs";

export default observationFrame("facility.opening-order")
  .subject(subject("north gate opening"))
  .predicate(predicate("occurred-after", "building alarm"))
  .evidence(evidenceSlot("alarm-span"), evidenceSlot("opening-span"))
  .certainty(certainty("supported"))
  .recommendation(
    conditional(
      "When the temporal relation is missing or ambiguous",
      recommendation("state the alarm and opening times explicitly")
    )
  )
  .provenance(sourceBound())
  .seal();
