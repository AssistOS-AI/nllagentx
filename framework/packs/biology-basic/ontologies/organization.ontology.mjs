import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("biology-basic.organization", "1.0.0");
export const BiologicalEntity = O.entity(
  entityKind("BiologicalEntity").provide(capability("BiologicalEntity"))
);
export const LevelOfOrganization = O.entity(
  entityKind("LevelOfOrganization").provide(capability("LevelOfOrganization"))
);
export const Molecule = O.entity(
  entityKind("Molecule").provide(capability("Molecule"))
);
export const Organelle = O.entity(
  entityKind("Organelle").provide(capability("Organelle"))
);
export const Tissue = O.entity(
  entityKind("Tissue").provide(capability("Tissue"))
);
export const PartOfBiological = O.event(
  eventKind("PartOfBiological")
    .role(allows(actor, atMostOne()))
    .role(allows(theme, atMostOne()))
    .role(allows(subject, atMostOne()))
    .role(allows(objectRole, atMostOne()))
    .role(allows(source, atMostOne()))
    .role(allows(target, atMostOne()))
    .role(allows(location, atMostOne()))
    .role(allows(time, atMostOne()))
    .role(allows(context, atMostOne()))
    .role(allows(evidence, atMostOne()))
    .role(allows(value, atMostOne()))
    .role(allows(sourceFrom, atMostOne()))
    .role(allows(destination, atMostOne()))
    .provide(capability("PartOfBiological"))
);
O.lexicon(lexicalize(BiologicalEntity).english("biological entity"));
O.lexicon(lexicalize(LevelOfOrganization).english("level of organization"));
O.lexicon(lexicalize(Molecule).english("molecule"));
O.lexicon(lexicalize(Organelle).english("organelle"));
O.lexicon(lexicalize(Tissue).english("tissue"));
O.lexicon(lexicalize(PartOfBiological).english("part of biological"));

export default O.seal();
