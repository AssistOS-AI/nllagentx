import { loadProfile, usePack, concreteFirst, abstractPreflightForSelectedCircuits, allCompatibleWithinLoadedPacks } from "../framework/sdk/intent/profiles.mjs";

export default loadProfile("general-broad")
  .use(usePack("core-language"))
  .use(usePack("core-commonsense"))
  .use(usePack("world-basic"))
  .use(usePack("math-basic"))
  .use(usePack("logic-basic"))
  .use(usePack("reasoning-errors"))
  .use(usePack("social-interaction"))
  .prefer(concreteFirst())
  .assure(abstractPreflightForSelectedCircuits())
  .fallback(allCompatibleWithinLoadedPacks())
  .seal();
