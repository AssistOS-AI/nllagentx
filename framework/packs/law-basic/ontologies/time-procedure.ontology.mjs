import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("law-basic.time-procedure", "1.0.0");
export const Procedure = O.entity(
  entityKind("Procedure").provide(capability("Procedure"))
);
export const Notice = O.entity(
  entityKind("Notice").provide(capability("Notice"))
);
export const Approval = O.entity(
  entityKind("Approval").provide(capability("Approval"))
);
export const Appeal = O.entity(
  entityKind("Appeal").provide(capability("Appeal"))
);
export const Deadline = O.entity(
  entityKind("Deadline").provide(capability("Deadline"))
);
export const MustPrecede = O.event(
  eventKind("MustPrecede")
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
    .provide(capability("MustPrecede"))
);
O.lexicon(lexicalize(Procedure).english("procedure"));
O.lexicon(lexicalize(Notice).english("notice"));
O.lexicon(lexicalize(Approval).english("approval"));
O.lexicon(lexicalize(Appeal).english("appeal"));
O.lexicon(lexicalize(Deadline).english("deadline"));
O.lexicon(lexicalize(MustPrecede).english("must precede"));

export default O.seal();
