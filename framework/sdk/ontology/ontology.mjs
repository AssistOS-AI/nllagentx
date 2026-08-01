import { SemanticTerm, RoleBinding, SemanticValue, isSemanticHandle } from "../core/handles.mjs";
import { declaredIdentity, digestIdentity } from "../core/identity.mjs";
import { DiagnosticBag, NllError } from "../core/diagnostics.mjs";
import { registerDescriptor } from "../core/descriptors.mjs";
import {
  KindBuilder, RoleBuilder, RelationBuilder, LexicalizationBuilder, FactBuilder, LawBuilder,
  entityKind, eventKind, stateKind, qualityKind, valueKind, propositionKind, documentArtifactKind,
  role, relation, requires, allows, exactlyOne, atMostOne, atLeastOne, optional, repeatable,
  lexicalize, fact, law, subtypeOf, disjointWith, capability, guarantee, concept
} from "./definitions.mjs";

function semanticIdentity(value) {
  if (typeof value?.identity === "function") return value.identity();
  if (typeof value?.identity === "string") return value.identity;
  if (typeof value === "function" && typeof value.definition === "function") return value.definition().identity;
  return String(value);
}

function normalizeValue(value) {
  if (isSemanticHandle(value)) return value;
  if (value === undefined) return new SemanticValue("UnknownValue", "unknown");
  return new SemanticValue("Literal", value);
}

function decorateWithOntologyApi(callable, owner) {
  for (const method of ["entity", "event", "state", "quality", "value", "proposition", "documentArtifact", "role", "relation", "lexicon", "fact", "law", "seal", "check"]) {
    Object.defineProperty(callable, method, { value: owner[method].bind(owner), enumerable: false });
  }
  return callable;
}

function makeRoleConstructor(definition, owner) {
  const constructor = (value) => new RoleBinding(definition, normalizeValue(value));
  Object.defineProperties(constructor, {
    identity: { value: () => definition.identity },
    definition: { value: () => definition }
  });
  return decorateWithOntologyApi(constructor, owner);
}

function makeTermConstructor(definition, owner) {
  const constructor = (...bindings) => {
    const normalizedBindings = bindings.flat().map((binding) => {
      if (binding instanceof RoleBinding) return binding;
      return new RoleBinding({ identity: `${definition.identity}:value`, name: "value" }, normalizeValue(binding));
    });
    const isPattern = normalizedBindings.some((binding) => binding.value().sort() === "PatternVariable");
    if (!isPattern && definition.roles.length > 0) {
      for (const roleUse of definition.roles) {
        const roleIdentity = semanticIdentity(roleUse.role);
        const matches = normalizedBindings.filter((binding) => semanticIdentity(binding.role()) === roleIdentity);
        if (matches.length < roleUse.cardinality.minimum) throw new NllError(`ONTOLOGY_CARDINALITY_MINIMUM: ${definition.identity} requires ${roleIdentity}`, []);
        if (matches.length > roleUse.cardinality.maximum) throw new NllError(`ONTOLOGY_CARDINALITY_MAXIMUM: ${definition.identity} permits at most ${roleUse.cardinality.maximum} ${roleIdentity}`, []);
        const range = roleUse.role?.definition?.().range ?? roleUse.role?.range ?? null;
        for (const binding of matches) {
          const actualDefinition = binding.value()?.descriptor?.().conceptDefinition ?? null;
          const actual = binding.value()?.descriptor?.().concept ?? null;
          const compatible = !range || !actual || actual === range || actualDefinition?.parents?.includes(range);
          if (!compatible) throw new NllError(`ONTOLOGY_ROLE_RANGE: ${roleIdentity} expects ${range}, received ${actual}`, []);
        }
      }
      const declaredRoles = new Set(definition.roles.map((roleUse) => semanticIdentity(roleUse.role)));
      for (const binding of normalizedBindings) if (!declaredRoles.has(semanticIdentity(binding.role()))) throw new NllError(`ONTOLOGY_ROLE_NOT_ALLOWED: ${definition.identity} does not declare ${semanticIdentity(binding.role())}`, []);
    }
    return new SemanticTerm({
      sort: isPattern ? "PatternTerm" : definition.sort,
      kind: definition.name,
      identity: digestIdentity(isPattern ? "nll.pattern-term" : "nll.ground-term", {
        concept: definition.identity,
        bindings: normalizedBindings
      }),
      descriptor: { concept: definition.identity, conceptDefinition: definition, bindings: normalizedBindings }
    });
  };
  Object.defineProperties(constructor, {
    identity: { value: () => definition.identity },
    definition: { value: () => definition }
  });
  return decorateWithOntologyApi(constructor, owner);
}

export class OntologyModule {
  constructor(builder) {
    this.id = builder.id;
    this.version = builder.version;
    this.identity = declaredIdentity("ontology", builder.id, builder.version);
    this.concepts = Object.freeze([...builder.concepts.values()]);
    this.roles = Object.freeze([...builder.roles.values()]);
    this.relations = Object.freeze([...builder.relations.values()]);
    this.lexicalizations = Object.freeze([...builder.lexicalizations]);
    this.facts = Object.freeze([...builder.facts]);
    this.laws = Object.freeze([...builder.laws]);
    this.constructors = Object.freeze(Object.fromEntries(builder.constructors));
    Object.freeze(this);
  }

  constructorFor(localName) { return this.constructors[localName] ?? null; }
  tryConstruct(localName, ...bindings) {
    const constructor = this.constructorFor(localName);
    if (!constructor) return Object.freeze({ value: null, diagnostics: Object.freeze([{ code: "ONTOLOGY_CONSTRUCTOR_UNKNOWN", localName }]) });
    try { return Object.freeze({ value: constructor(...bindings), diagnostics: Object.freeze([]) }); }
    catch (error) { return Object.freeze({ value: null, diagnostics: Object.freeze([{ code: String(error.message).split(":")[0], message: error.message }]) }); }
  }
  provides() { return this.concepts.flatMap((entry) => entry.capabilities); }
}

export class OntologyBuilder {
  constructor(id, version) {
    if (!id || !version) throw new TypeError("ontology(id, version) requires both arguments");
    this.id = id;
    this.version = version;
    this.concepts = new Map();
    this.roles = new Map();
    this.relations = new Map();
    this.constructors = new Map();
    this.lexicalizations = [];
    this.facts = [];
    this.laws = [];
    this.sealed = null;
  }

  #kind(definition, expectedSort = null) {
    const kind = typeof definition === "string" ? new KindBuilder(expectedSort ?? "Entity", definition) : definition;
    if (!(kind instanceof KindBuilder)) throw new TypeError("Ontology concept declarations require a kind builder");
    if (expectedSort && kind.sort !== expectedSort) kind.sort = expectedSort;
    if (this.concepts.has(kind.name)) throw new Error(`Duplicate ontology concept ${this.id}:${kind.name}`);
    const conceptDefinition = Object.freeze({
      identity: declaredIdentity(this.id, kind.name),
      pack: this.id,
      name: kind.name,
      sort: kind.sort,
      roles: Object.freeze([...kind.roleUses]),
      capabilities: Object.freeze([...kind.capabilities]),
      parents: Object.freeze(kind.parents.map(semanticIdentity)),
      disjoint: Object.freeze(kind.disjoint.map(semanticIdentity))
    });
    const constructor = makeTermConstructor(conceptDefinition, this);
    this.concepts.set(kind.name, conceptDefinition);
    this.constructors.set(kind.name, constructor);
    registerDescriptor({
      identity: conceptDefinition.identity,
      exportName: kind.name,
      module: this.id,
      signature: `${kind.name}(...roleBindings) -> ${kind.sort}`,
      semanticSorts: [kind.sort],
      provenance: "construction-context",
      determinism: "canonical"
    });
    return constructor;
  }

  entity(definition) { return this.#kind(definition, "Entity"); }
  event(definition) { return this.#kind(definition, "Event"); }
  state(definition) { return this.#kind(definition, "State"); }
  quality(definition) { return this.#kind(definition, "Quality"); }
  value(definition) { return this.#kind(typeof definition === "string" ? valueKind(definition) : definition, "Value"); }
  proposition(definition) { return this.#kind(definition, "Proposition"); }
  documentArtifact(definition) { return this.#kind(definition, "DocumentArtifact"); }

  role(definition) {
    const roleBuilder = typeof definition === "string" ? new RoleBuilder(definition) : definition;
    if (!(roleBuilder instanceof RoleBuilder)) throw new TypeError("Ontology roles require role(name)");
    if (this.roles.has(roleBuilder.name)) throw new Error(`Duplicate ontology role ${this.id}:${roleBuilder.name}`);
    const roleDefinition = Object.freeze({
      identity: declaredIdentity(this.id, roleBuilder.name),
      pack: this.id,
      name: roleBuilder.name,
      domain: roleBuilder.domainValue ? semanticIdentity(roleBuilder.domainValue) : null,
      range: roleBuilder.rangeValue ? semanticIdentity(roleBuilder.rangeValue) : null,
      inverse: roleBuilder.inverseValue ? semanticIdentity(roleBuilder.inverseValue) : null
    });
    const constructor = makeRoleConstructor(roleDefinition, this);
    this.roles.set(roleBuilder.name, roleDefinition);
    this.constructors.set(roleBuilder.name, constructor);
    return constructor;
  }

  relation(definition) {
    const relationBuilder = typeof definition === "string" ? new RelationBuilder(definition) : definition;
    const constructor = this.role(relationBuilder);
    const roleDefinition = constructor.definition();
    this.relations.set(relationBuilder.name, Object.freeze({
      ...roleDefinition,
      symmetric: relationBuilder.symmetricValue,
      transitive: relationBuilder.transitiveValue
    }));
    return constructor;
  }

  lexicon(definition) {
    if (!(definition instanceof LexicalizationBuilder)) throw new TypeError("lexicon() requires lexicalize(...)");
    this.lexicalizations.push(Object.freeze({ target: semanticIdentity(definition.target), entries: Object.freeze([...definition.entries]) }));
    return this;
  }
  fact(definition) { if (!(definition instanceof FactBuilder)) throw new TypeError("fact() requires fact(...)"); this.facts.push(definition); return this; }
  law(definition) { if (!(definition instanceof LawBuilder)) throw new TypeError("law() requires law(...)"); this.laws.push(definition); return this; }

  check() {
    const diagnostics = new DiagnosticBag();
    for (const conceptDefinition of this.concepts.values()) {
      const roleNames = new Set();
      for (const roleUse of conceptDefinition.roles) {
        const roleIdentity = semanticIdentity(roleUse.role);
        if (roleNames.has(roleIdentity)) diagnostics.add("ONTOLOGY_DUPLICATE_ROLE", `Duplicate role ${roleIdentity} in ${conceptDefinition.identity}`);
        roleNames.add(roleIdentity);
      }
      if (conceptDefinition.parents.includes(conceptDefinition.identity)) {
        diagnostics.add("ONTOLOGY_SUBTYPE_CYCLE", `${conceptDefinition.identity} is its own parent`);
      }
    }
    return diagnostics.all();
  }

  seal() {
    if (this.sealed) return this.sealed;
    const diagnostics = this.check();
    if (diagnostics.some((item) => item.severity() === "error")) {
      throw new NllError(`Ontology ${this.id} failed validation`, diagnostics);
    }
    this.sealed = new OntologyModule(this);
    return this.sealed;
  }
}

export const ontology = (id, version = "1.0.0") => new OntologyBuilder(id, version);

export {
  entityKind, eventKind, stateKind, qualityKind, valueKind, propositionKind, documentArtifactKind,
  role, relation, requires, allows, exactlyOne, atMostOne, atLeastOne, optional, repeatable,
  lexicalize, fact, law, subtypeOf, disjointWith, capability, guarantee, concept
};
