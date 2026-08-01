import { loadProfile, usePack, preferConcern, allCompatibleWithinLoadedPacks } from "../framework/sdk/intent/profiles.mjs";

export default loadProfile("literary-analysis")
  .use(usePack("core-language"))
  .use(usePack("core-commonsense"))
  .use(usePack("world-basic"))
  .use(usePack("psychology-basic"))
  .use(usePack("anthropology-basic"))
  .use(usePack("sociology-basic"))
  .use(usePack("logic-basic"))
  .use(usePack("reasoning-errors"))
  .use(usePack("social-interaction"))
  .prefer(preferConcern("continuity"), preferConcern("motivation"), preferConcern("narrative-structure"))
  .fallback(allCompatibleWithinLoadedPacks())
  .seal();
