// Illustrative method ontology. See DS-003 and DS-004.
import { methodCatalog, method, viewKind, guarantee, costClass } from "../framework/sdk/analysis/methods.mjs";

export default methodCatalog("nllAgent-methods")
  .add(method("query-dataflow").accepts(viewKind("SemanticStore")).guarantee(guarantee("exact-for-query-fragment")).cost(costClass("low")))
  .add(method("decision-table").accepts(viewKind("FiniteConditions")).guarantee(guarantee("exact-for-table")).cost(costClass("low")))
  .add(method("relation-fixed-point").accepts(viewKind("FiniteRelations")).guarantee(guarantee("least-fixed-point")).cost(costClass("medium")))
  .add(method("constraint-kernel").accepts(viewKind("ConstraintView")).guarantee(guarantee("exact-for-supported-theories")).cost(costClass("medium")))
  .add(method("abstract-interpretation").accepts(viewKind("CircuitModel")).guarantee(guarantee("conservative-must-may")).cost(costClass("medium")))
  .add(method("symbolic-execution").accepts(viewKind("SymbolicCircuit")).guarantee(guarantee("bounded-path-complete")).cost(costClass("medium")))
  .add(method("transition-exploration").accepts(viewKind("TransitionSystem")).guarantee(guarantee("exact-within-bound")).cost(costClass("medium")))
  .add(method("rewrite-egraph").accepts(viewKind("TermDAG")).guarantee(guarantee("equivalence-under-registered-rules")).cost(costClass("medium")))
  .add(method("decision-dag").accepts(viewKind("FiniteDecisionModel")).guarantee(guarantee("exact-if-compiled")).cost(costClass("high-upfront-low-query")))
  .add(method("dependency-slicing").accepts(viewKind("DependencyGraph")).guarantee(guarantee("trace-relevance")).cost(costClass("low")))
  .seal();
