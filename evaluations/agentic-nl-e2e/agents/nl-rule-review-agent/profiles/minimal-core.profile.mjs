import {
  loadProfile,
  usePack,
  concreteFirst,
  allCompatibleWithinLoadedPacks,
  runEveryCompatibleCircuit,
  explainAllSelection,
  requireEvidenceBearing
} from "../../../../../framework/sdk/intent/index.mjs";

export default loadProfile("minimal-core")
  .use(usePack("core-language"))
  .prefer(concreteFirst())
  .require(requireEvidenceBearing())
  .fallback(allCompatibleWithinLoadedPacks())
  .selection(runEveryCompatibleCircuit())
  .explain(explainAllSelection())
  .seal();
