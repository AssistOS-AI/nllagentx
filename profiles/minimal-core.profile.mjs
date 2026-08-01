// Reference profile module. The fluent SDK contract is defined by DS-004.
import { loadProfile, usePack, concreteFirst, allCompatibleWithinLoadedPacks } from "../framework/sdk/intent/profiles.mjs";

export default loadProfile("minimal-core")
  .use(usePack("core-language"))
  .use(usePack("logic-basic"))
  .use(usePack("reasoning-errors"))
  .prefer(concreteFirst())
  .fallback(allCompatibleWithinLoadedPacks())
  .seal();
