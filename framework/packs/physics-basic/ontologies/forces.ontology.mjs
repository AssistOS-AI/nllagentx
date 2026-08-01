import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("physics-basic.forces", "1.0.0");
export const Force = O.entity(
  entityKind("Force").provide(capability("Force"))
);
export const Interaction = O.entity(
  entityKind("Interaction").provide(capability("Interaction"))
);
export const EquilibriumState = O.entity(
  entityKind("EquilibriumState").provide(capability("EquilibriumState"))
);
export const ExertsForce = O.event(
  eventKind("ExertsForce")
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
    .provide(capability("ExertsForce"))
);
O.lexicon(lexicalize(Force).english("force"));
O.lexicon(lexicalize(Interaction).english("interaction"));
O.lexicon(lexicalize(EquilibriumState).english("equilibrium state"));
O.lexicon(lexicalize(ExertsForce).english("exerts force"));

export default O.seal();
