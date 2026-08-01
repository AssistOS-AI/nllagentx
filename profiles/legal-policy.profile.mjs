import { loadProfile, usePack, requireEvidenceBearing, allCompatibleWithinLoadedPacks } from "../framework/sdk/intent/profiles.mjs";

export default loadProfile("legal-policy")
  .use(usePack("core-language"))
  .use(usePack("core-commonsense"))
  .use(usePack("math-basic"))
  .use(usePack("logic-basic"))
  .use(usePack("reasoning-errors"))
  .use(usePack("law-basic"))
  .use(usePack("social-interaction"))
  .require(requireEvidenceBearing())
  .fallback(allCompatibleWithinLoadedPacks())
  .seal();
