import { ontology, entityKind, eventKind, allows, atMostOne, lexicalize, capability } from "../../../sdk/ontology/ontology.mjs";
import { actor, theme, subject, object as objectRole, source, target, location, time, context, evidence, value, from as sourceFrom, to as destination } from "../../core-language/ontologies/core.ontology.mjs";

const O = ontology("math-basic.probability-statistics", "1.0.0");
export const Dataset = O.entity(
  entityKind("Dataset").provide(capability("Dataset"))
);
export const Observation = O.entity(
  entityKind("Observation").provide(capability("Observation"))
);
export const Mean = O.entity(
  entityKind("Mean").provide(capability("Mean"))
);
export const Median = O.entity(
  entityKind("Median").provide(capability("Median"))
);
export const Mode = O.entity(
  entityKind("Mode").provide(capability("Mode"))
);
export const Range = O.entity(
  entityKind("Range").provide(capability("Range"))
);
export const FiniteExperiment = O.entity(
  entityKind("FiniteExperiment").provide(capability("FiniteExperiment"))
);
export const Outcome = O.entity(
  entityKind("Outcome").provide(capability("Outcome"))
);
export const Probability = O.entity(
  entityKind("Probability").provide(capability("Probability"))
);
export const ProbabilityOf = O.event(
  eventKind("ProbabilityOf")
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
    .provide(capability("ProbabilityOf"))
);
O.lexicon(lexicalize(Dataset).english("dataset"));
O.lexicon(lexicalize(Observation).english("observation"));
O.lexicon(lexicalize(Mean).english("mean"));
O.lexicon(lexicalize(Median).english("median"));
O.lexicon(lexicalize(Mode).english("mode"));
O.lexicon(lexicalize(Range).english("range"));
O.lexicon(lexicalize(FiniteExperiment).english("finite experiment"));
O.lexicon(lexicalize(Outcome).english("outcome"));
O.lexicon(lexicalize(Probability).english("probability"));
O.lexicon(lexicalize(ProbabilityOf).english("probability of"));

export default O.seal();
