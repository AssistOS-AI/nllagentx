import { loadProfile, usePack, preferConcern, allCompatibleWithinLoadedPacks } from "../framework/sdk/intent/profiles.mjs";

export default loadProfile("scientific-textbook")
  .use(usePack("core-language"))
  .use(usePack("core-commonsense"))
  .use(usePack("world-basic"))
  .use(usePack("math-basic"))
  .use(usePack("physics-basic"))
  .use(usePack("chemistry-basic"))
  .use(usePack("biology-basic"))
  .use(usePack("logic-basic"))
  .use(usePack("reasoning-errors"))
  .prefer(preferConcern("units"), preferConcern("evidence"), preferConcern("prerequisite-order"))
  .fallback(allCompatibleWithinLoadedPacks())
  .seal();
