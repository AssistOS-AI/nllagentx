import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("sociology-basic.collective-process", "1.0.0");
export const CollectiveAction = O.entity(
  entityKind("CollectiveAction").provide(capability("CollectiveAction"))
);
export const CaseEvidence = O.entity(
  entityKind("CaseEvidence").provide(capability("CaseEvidence"))
);
O.lexicon(lexicalize(CollectiveAction).english("collective action"));
O.lexicon(lexicalize(CaseEvidence).english("case evidence"));

export default O.seal();
