import { SemanticTerm, RoleBinding, isSemanticHandle } from "../../sdk/core/handles.mjs";
import { digestIdentity } from "../../sdk/core/identity.mjs";
import { TRUE, FALSE, UNKNOWN } from "../../sdk/core/logic.mjs";
import { DiagnosticBag } from "../../sdk/core/diagnostics.mjs";
import { SemanticTransaction } from "./transaction.mjs";

function keyOf(value) {
  if (typeof value?.identity === "function") return value.identity();
  if (typeof value?.identity === "string") return value.identity;
  return String(value);
}
function roleKey(source, role) { return `${keyOf(source)}\0${keyOf(role)}`; }
function reverseRoleKey(role, target) { return `${keyOf(role)}\0${keyOf(target)}`; }
function relationKey(kind, left, right) { return `${kind}\0${keyOf(left)}\0${keyOf(right)}`; }

function immutableRows(rows) { return Object.freeze(rows.map((row) => Object.freeze({ ...row, bindings: new Map(row.bindings) }))); }

export class SemanticStore {
  #terms = new Map();
  #claims = new Map();
  #relations = new Map();
  #coverage = new Map();
  #typeIndex = new Map();
  #roleIndex = new Map();
  #reverseRoleIndex = new Map();
  #claimContentIndex = new Map();
  #groundingIndex = new Map();
  #provenanceIndex = new Map();
  #capabilities = new Map();
  #ontologies = new Map();
  #subtypes = new Map();
  #diagnostics = new DiagnosticBag();
  #commits = [];

  constructor({ id = "semantic-store", sourceSnapshot = null } = {}) {
    this.id = id;
    this.sourceSnapshot = sourceSnapshot;
    this.snapshotId = digestIdentity("nll.store-snapshot", { id, sourceSnapshot, epoch: 0 });
  }

  installOntology(ontology) {
    if (this.#ontologies.has(ontology.identity)) return this;
    this.#ontologies.set(ontology.identity, ontology);
    for (const concept of ontology.concepts) {
      this.#subtypes.set(concept.identity, new Set(concept.parents));
      for (const provided of concept.capabilities) this.#capabilities.set(provided.name ?? keyOf(provided), concept);
    }
    return this;
  }

  beginTransaction(label, options = {}) { return new SemanticTransaction(this, label, options); }
  term(id) { return this.#terms.get(keyOf(id)) ?? null; }
  typeOf(term) { return term?.descriptor?.().concept ?? term?.sort?.() ?? null; }
  isSubtype(termOrType, type) {
    const target = keyOf(type);
    let current = typeof termOrType === "string" ? termOrType : this.typeOf(termOrType);
    if (current === target) return true;
    const visited = new Set();
    const queue = [current];
    while (queue.length) {
      current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      for (const parent of this.#subtypes.get(current) ?? []) {
        if (parent === target) return true;
        queue.push(parent);
      }
    }
    return false;
  }
  roles(term) { return term instanceof SemanticTerm ? term.bindings() : []; }
  targets(term, role) { return [...(this.#roleIndex.get(roleKey(term, role)) ?? [])]; }
  sources(role, target) { return [...(this.#reverseRoleIndex.get(reverseRoleKey(role, target)) ?? [])]; }
  claimsAbout(term) { return [...(this.#claimContentIndex.get(keyOf(term)) ?? [])]; }
  grounding(termOrClaim) { return [...(this.#groundingIndex.get(keyOf(termOrClaim)) ?? [])]; }
  context(termOrClaim) { return termOrClaim?.descriptor?.().context ?? null; }
  interpretation(termOrClaim) { return termOrClaim?.descriptor?.().interpretation ?? null; }
  coverage(concept, scope) { return this.#coverage.get(`${keyOf(concept)}\0${keyOf(scope)}`) ?? null; }
  explain(value) { return Object.freeze({ value, provenance: this.#provenanceIndex.get(keyOf(value)) ?? [], claims: this.claimsAbout(value) }); }
  diagnostics() { return this.#diagnostics.all(); }
  commits() { return [...this.#commits]; }
  ontologies() { return [...this.#ontologies.values()]; }
  capabilities() { return new Map(this.#capabilities); }
  hasCapability(name) { return this.#capabilities.has(name); }
  hasConcept(identity) { return this.#typeIndex.has(keyOf(identity)) || [...this.#ontologies.values()].some((ontology) => ontology.concepts.some((concept) => concept.identity === keyOf(identity))); }
  allTerms() { return [...this.#terms.values()]; }
  allClaims() { return [...this.#claims.values()]; }
  allRelations() { return [...this.#relations.values()]; }
  allCoverage() { return [...this.#coverage.values()]; }

  relationBetween(kind, left, right) {
    if (this.#relations.has(relationKey(kind, left, right))) return TRUE;
    const inverse = kind === "Before" ? "After" : kind === "After" ? "Before" : null;
    if (inverse && this.#relations.has(relationKey(inverse, right, left))) return TRUE;
    if (kind === "Before" && this.#relations.has(relationKey("Before", right, left))) return FALSE;
    if (kind === "After" && this.#relations.has(relationKey("After", right, left))) return FALSE;
    return UNKNOWN;
  }

  query(pattern) {
    const concept = pattern?.descriptor?.().concept ?? null;
    const candidates = concept
      ? [...(this.#typeIndex.get(concept) ?? [])]
      : [...this.#terms.values()];
    const rows = [];
    for (const candidate of candidates) {
      const bindings = new Map();
      if (!this.#matchTerm(pattern, candidate, bindings)) continue;
      const claims = this.claimsAbout(candidate);
      rows.push({
        term: candidate,
        bindings,
        evidence: claims.flatMap((claim) => this.grounding(claim)),
        interpretation: claims.map((claim) => claim.descriptor().interpretation).filter(Boolean),
        scope: claims.map((claim) => claim.descriptor().context).filter(Boolean)
      });
    }
    return immutableRows(rows);
  }

  #matchTerm(pattern, candidate, bindings) {
    if (!pattern) return true;
    if (pattern.sort?.() === "PatternVariable") {
      const concept = pattern.descriptor().concept;
      if (concept && !this.isSubtype(candidate, concept)) return false;
      const existing = bindings.get(pattern.identity());
      if (existing && keyOf(existing) !== keyOf(candidate)) return false;
      bindings.set(pattern.identity(), candidate);
      return true;
    }
    if (!(pattern instanceof SemanticTerm) || !(candidate instanceof SemanticTerm)) return keyOf(pattern) === keyOf(candidate);
    if (pattern.descriptor().concept !== candidate.descriptor().concept && !this.isSubtype(candidate, pattern.descriptor().concept)) return false;
    for (const patternBinding of pattern.bindings()) {
      const roleIdentity = keyOf(patternBinding.role());
      const candidates = candidate.bindings().filter((binding) => keyOf(binding.role()) === roleIdentity).map((binding) => binding.value());
      if (candidates.length === 0) return false;
      if (!candidates.some((value) => this.#matchTerm(patternBinding.value(), value, bindings))) return false;
    }
    return true;
  }

  _commit(transaction) {
    const staged = transaction.staged();
    for (const ontology of staged.ontologies) this.installOntology(ontology);
    for (const term of staged.terms) this.#indexTerm(term);
    for (const claim of staged.claims) this.#indexClaim(claim);
    for (const relation of staged.relations) this.#indexRelation(relation);
    for (const witness of staged.coverage) this.#indexCoverage(witness);
    const commit = Object.freeze({
      identity: digestIdentity("nll.store-commit", { label: transaction.label, staged, previous: this.snapshotId }),
      label: transaction.label,
      counts: Object.freeze({ terms: staged.terms.length, claims: staged.claims.length, relations: staged.relations.length, coverage: staged.coverage.length })
    });
    this.#commits.push(commit);
    this.snapshotId = digestIdentity("nll.store-snapshot", { previous: this.snapshotId, commit: commit.identity });
    return commit;
  }

  #indexTerm(term) {
    if (!isSemanticHandle(term)) return;
    if (this.#terms.has(term.identity())) return;
    this.#terms.set(term.identity(), term);
    const concept = term.descriptor?.().concept;
    if (concept) {
      if (!this.#typeIndex.has(concept)) this.#typeIndex.set(concept, new Set());
      this.#typeIndex.get(concept).add(term);
    }
    if (term instanceof SemanticTerm) {
      for (const binding of term.bindings()) {
        if (!(binding instanceof RoleBinding)) continue;
        const value = binding.value();
        const forward = roleKey(term, binding.role());
        const reverse = reverseRoleKey(binding.role(), value);
        if (!this.#roleIndex.has(forward)) this.#roleIndex.set(forward, new Set());
        if (!this.#reverseRoleIndex.has(reverse)) this.#reverseRoleIndex.set(reverse, new Set());
        this.#roleIndex.get(forward).add(value);
        this.#reverseRoleIndex.get(reverse).add(term);
        if (isSemanticHandle(value) && ["Entity", "Event", "State", "Proposition"].includes(value.sort())) this.#indexTerm(value);
      }
    }
    this.#provenanceIndex.set(term.identity(), term.provenance?.() ?? []);
  }

  #indexClaim(claim) {
    if (this.#claims.has(claim.identity())) return;
    this.#claims.set(claim.identity(), claim);
    const proposition = claim.proposition();
    this.#indexTerm(proposition);
    const key = keyOf(proposition);
    if (!this.#claimContentIndex.has(key)) this.#claimContentIndex.set(key, new Set());
    this.#claimContentIndex.get(key).add(claim);
    this.#groundingIndex.set(claim.identity(), new Set(claim.groundings()));
    this.#groundingIndex.set(key, new Set([...(this.#groundingIndex.get(key) ?? []), ...claim.groundings()]));
    this.#provenanceIndex.set(claim.identity(), claim.groundings());
  }
  #indexRelation(relation) { this.#relations.set(relationKey(relation.kind(), relation.descriptor().left, relation.descriptor().right), relation); }
  #indexCoverage(witness) { this.#coverage.set(`${keyOf(witness.descriptor().concept)}\0${keyOf(witness.descriptor().scope)}`, witness); }
}
