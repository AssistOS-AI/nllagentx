import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("law-basic.definitions-references", "1.0.0");
export const DefinedTerm = O.entity(
  entityKind("DefinedTerm").provide(capability("DefinedTerm"))
);
export const CrossReference = O.entity(
  entityKind("CrossReference").provide(capability("CrossReference"))
);
export const DefinedAs = O.event(
  eventKind("DefinedAs")
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
    .provide(capability("DefinedAs"))
);
O.lexicon(lexicalize(DefinedTerm).english("defined term"));
O.lexicon(lexicalize(CrossReference).english("cross reference"));
O.lexicon(lexicalize(DefinedAs).english("defined as"));

export default O.seal();
