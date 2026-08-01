import { semanticAgent, usePack, useProfile, useSkillPolicy, codingAgent } from "../../../../framework/sdk/agent/agent.mjs";

export default semanticAgent("school-smoke-agent")
  .use(usePack("core-language"))
  .defaultProfile(useProfile("minimal-core"))
  .skills(useSkillPolicy("standard-authoring"))
  .coding(codingAgent("codex").directEditing())
  .seal();
