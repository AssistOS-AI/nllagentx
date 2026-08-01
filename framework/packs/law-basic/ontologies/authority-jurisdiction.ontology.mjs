import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("law-basic.authority-jurisdiction", "1.0.0");
export const NormativeAuthority = O.entity(
  entityKind("NormativeAuthority").provide(capability("NormativeAuthority"))
);
export const Jurisdiction = O.entity(
  entityKind("Jurisdiction").provide(capability("Jurisdiction"))
);
export const LegalSource = O.entity(
  entityKind("LegalSource").provide(capability("LegalSource"))
);
export const IssuedBy = O.event(
  eventKind("IssuedBy")
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
    .provide(capability("IssuedBy"))
);
export const AppliesIn = O.event(
  eventKind("AppliesIn")
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
    .provide(capability("AppliesIn"))
);
export const Overrides = O.event(
  eventKind("Overrides")
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
    .provide(capability("Overrides"))
);
O.lexicon(lexicalize(NormativeAuthority).english("normative authority"));
O.lexicon(lexicalize(Jurisdiction).english("jurisdiction"));
O.lexicon(lexicalize(LegalSource).english("legal source"));
O.lexicon(lexicalize(IssuedBy).english("issued by"));
O.lexicon(lexicalize(AppliesIn).english("applies in"));
O.lexicon(lexicalize(Overrides).english("overrides"));

export default O.seal();
