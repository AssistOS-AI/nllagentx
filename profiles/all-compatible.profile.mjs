import { loadProfile, useEveryCompatiblePack, runEveryCompatibleCircuit, explainAllSelection } from "../framework/sdk/intent/profiles.mjs";

export default loadProfile("all-compatible")
  .use(useEveryCompatiblePack())
  .selection(runEveryCompatibleCircuit())
  .explain(explainAllSelection())
  .seal();
