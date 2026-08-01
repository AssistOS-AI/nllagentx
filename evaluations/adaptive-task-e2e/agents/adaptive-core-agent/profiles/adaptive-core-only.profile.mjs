import {
  loadProfile,
  usePack,
  concreteFirst,
  allCompatibleWithinLoadedPacks,
  runEveryCompatibleCircuit,
  explainAllSelection,
  requireEvidenceBearing
} from "../../../../../framework/sdk/intent/profiles.mjs";

export default loadProfile("adaptive-core-only")
  .use(usePack("core-language"))
  .prefer(concreteFirst())
  .require(requireEvidenceBearing())
  .fallback(allCompatibleWithinLoadedPacks())
  .selection(runEveryCompatibleCircuit())
  .explain(explainAllSelection())
  .seal();
