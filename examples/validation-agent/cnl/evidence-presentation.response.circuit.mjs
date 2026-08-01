import {
  responseCircuit,
  responseStage
} from "../../../framework/sdk/cnl/response.mjs";

const markValidationPolicy = responseStage("validation-agent.mark-evidence-policy", (state) => ({
  ...state,
  features: Object.freeze(new Set([...state.features, "validation-agent-policy"]))
}));

export default responseCircuit("validation-agent.EvidencePresentation", "1.0.0")
  .priority(25)
  .use(markValidationPolicy)
  .seal();
