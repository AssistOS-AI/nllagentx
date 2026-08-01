import { loadProfile, usePack, allCompatibleWithinLoadedPacks } from "../framework/sdk/intent/profiles.mjs";

export default loadProfile("social-analysis")
  .use(usePack("core-language"))
  .use(usePack("core-commonsense"))
  .use(usePack("psychology-basic"))
  .use(usePack("anthropology-basic"))
  .use(usePack("sociology-basic"))
  .use(usePack("logic-basic"))
  .use(usePack("reasoning-errors"))
  .use(usePack("social-interaction"))
  .fallback(allCompatibleWithinLoadedPacks())
  .seal();
