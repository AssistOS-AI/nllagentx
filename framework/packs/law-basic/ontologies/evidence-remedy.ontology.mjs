import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("law-basic.evidence-remedy", "1.0.0");
export const LegalEvidence = O.entity(
  entityKind("LegalEvidence").provide(capability("LegalEvidence"))
);
export const Decision = O.entity(
  entityKind("Decision").provide(capability("Decision"))
);
export const Sanction = O.entity(
  entityKind("Sanction").provide(capability("Sanction"))
);
export const Remedy = O.entity(
  entityKind("Remedy").provide(capability("Remedy"))
);
export const RemediedBy = O.event(
  eventKind("RemediedBy")
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
    .provide(capability("RemediedBy"))
);
O.lexicon(lexicalize(LegalEvidence).english("legal evidence"));
O.lexicon(lexicalize(Decision).english("decision"));
O.lexicon(lexicalize(Sanction).english("sanction"));
O.lexicon(lexicalize(Remedy).english("remedy"));
O.lexicon(lexicalize(RemediedBy).english("remedied by"));

export default O.seal();
