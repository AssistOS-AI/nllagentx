import {
  semanticAgent,
  usePack,
  useProfile,
  useSkillPolicy,
  codingAgent
} from "../../../../framework/sdk/agent/agent.mjs";

export default semanticAgent("adaptive-core-agent")
  .use(usePack("core-language"))
  .defaultProfile(useProfile("adaptive-core-only"))
  .skills(useSkillPolicy("standard-authoring"))
  .coding(codingAgent("codex").directEditing())
  .seal();
