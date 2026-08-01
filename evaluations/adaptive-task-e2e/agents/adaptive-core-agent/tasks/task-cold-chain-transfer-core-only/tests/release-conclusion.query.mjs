import {
  ReleaseConclusion,
  subject,
  transfer
} from "../sdk/ontology.generated.mjs";
import {
  custodyTransferAX17,
  sampleAX17
} from "../longtext/root.longtext.mjs";

export default ReleaseConclusion(
  subject(sampleAX17),
  transfer(custodyTransferAX17)
);
