import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("chemistry-basic.particles", "1.0.0");
export const Atom = O.entity(
  entityKind("Atom").provide(capability("Atom"))
);
export const Molecule = O.entity(
  entityKind("Molecule").provide(capability("Molecule"))
);
export const Ion = O.entity(
  entityKind("Ion").provide(capability("Ion"))
);
export const ComposedOf = O.event(
  eventKind("ComposedOf")
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
    .provide(capability("ComposedOf"))
);
O.lexicon(lexicalize(Atom).english("atom"));
O.lexicon(lexicalize(Molecule).english("molecule"));
O.lexicon(lexicalize(Ion).english("ion"));
O.lexicon(lexicalize(ComposedOf).english("composed of"));

export default O.seal();
