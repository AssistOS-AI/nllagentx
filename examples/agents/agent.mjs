import { semanticAgent, usePack, useProfile, codingAgent } from "../../framework/sdk/agent/agent.mjs";

export default semanticAgent("example-review-agent")
  .use(usePack("core-commonsense"))
  .use(usePack("logic-basic"))
  .use(usePack("reasoning-errors"))
  .defaultProfile(useProfile("general-broad"))
  .coding(codingAgent("codex").directEditing())
  .seal();
