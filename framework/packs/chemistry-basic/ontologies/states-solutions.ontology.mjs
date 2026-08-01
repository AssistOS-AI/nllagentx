import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("chemistry-basic.states-solutions", "1.0.0");
export const PhysicalChange = O.entity(
  entityKind("PhysicalChange").provide(capability("PhysicalChange"))
);
export const PhaseState = O.entity(
  entityKind("PhaseState").provide(capability("PhaseState"))
);
export const Solution = O.entity(
  entityKind("Solution").provide(capability("Solution"))
);
export const Solute = O.entity(
  entityKind("Solute").provide(capability("Solute"))
);
export const Solvent = O.entity(
  entityKind("Solvent").provide(capability("Solvent"))
);
export const Dissolves = O.event(
  eventKind("Dissolves")
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
    .provide(capability("Dissolves"))
);
export const ChangesPhase = O.event(
  eventKind("ChangesPhase")
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
    .provide(capability("ChangesPhase"))
);
export const Separates = O.event(
  eventKind("Separates")
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
    .provide(capability("Separates"))
);
O.lexicon(lexicalize(PhysicalChange).english("physical change"));
O.lexicon(lexicalize(PhaseState).english("phase state"));
O.lexicon(lexicalize(Solution).english("solution"));
O.lexicon(lexicalize(Solute).english("solute"));
O.lexicon(lexicalize(Solvent).english("solvent"));
O.lexicon(lexicalize(Dissolves).english("dissolves"));
O.lexicon(lexicalize(ChangesPhase).english("changes phase"));
O.lexicon(lexicalize(Separates).english("separates"));

export default O.seal();
