import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("anthropology-basic.material-culture", "1.0.0");
export const MaterialCultureArtifact = O.entity(
  entityKind("MaterialCultureArtifact").provide(capability("MaterialCultureArtifact"))
);
O.lexicon(lexicalize(MaterialCultureArtifact).english("material culture artifact"));

export default O.seal();
