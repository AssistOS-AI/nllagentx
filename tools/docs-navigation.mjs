const groups = Object.freeze([
  Object.freeze({
    id: "understand",
    label: "Understand",
    items: Object.freeze([
      Object.freeze(["System guide", "index.html"]),
      Object.freeze(["Architecture", "architecture.html"]),
      Object.freeze(["Agentic authoring", "agentic-authoring.html"]),
      Object.freeze(["Project folders", "project-structure.html"]),
      Object.freeze(["Source ingestion", "source-ingestion.html"])
    ])
  }),
  Object.freeze({
    id: "semantic",
    label: "Semantic programs",
    items: Object.freeze([
      Object.freeze(["DSL overview", "semantic-dsls.html"]),
      Object.freeze(["OntologyJS", "ontologyjs.html"]),
      Object.freeze(["IntentJS", "intentjs.html"]),
      Object.freeze(["LongTextJS", "longtextjs.html"]),
      Object.freeze(["CircuitJS", "circuitjs.html"]),
      Object.freeze(["Response circuits", "response-circuits.html"]),
      Object.freeze(["Runtime", "runtime.html"])
    ])
  }),
  Object.freeze({
    id: "workflows",
    label: "Workflows",
    items: Object.freeze([
      Object.freeze(["CLI reference", "cli-reference.html"]),
      Object.freeze(["Adaptive analysis", "adaptive-authoring.html"]),
      Object.freeze(["How skills work", "skills-workflow.html"]),
      Object.freeze(["Skill catalog", "skills.html"]),
      Object.freeze(["Packs", "packs.html"]),
      Object.freeze(["Tests and evaluation", "testing-evaluation.html"]),
      Object.freeze(["Artifacts", "results.html"])
    ])
  }),
  Object.freeze({
    id: "tutorials",
    label: "Tutorials",
    items: Object.freeze([
      Object.freeze(["Tutorial index", "tutorials.html"]),
      Object.freeze(["Contradictory rules", "tutorial-contradictory-rules.html"]),
      Object.freeze(["Missing justification", "tutorial-missing-exception.html"]),
      Object.freeze(["Unsupported conclusion", "tutorial-unsupported-conclusion.html"]),
      Object.freeze(["Procedure generation", "tutorial-procedure-generation.html"]),
      Object.freeze(["Adaptive cold-chain", "tutorial-adaptive-cold-chain.html"]),
      Object.freeze(["Minimal text-to-CNL", "tutorial-agent-task.html"])
    ])
  }),
  Object.freeze({
    id: "reference",
    label: "Reference",
    items: Object.freeze([
      Object.freeze(["Specification browser", "specsLoader.html?spec=matrix.md"]),
      Object.freeze(["Documentation ownership", "documentation-ownership.html"]),
      Object.freeze(["Specification review", "specification-review.html"]),
      Object.freeze(["Documentation generation", "documentation-generation.html"])
    ])
  })
]);

const links = (items) => items.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");

export function documentationHeader() {
  const menus = groups.map((group) => `<details class="nav-group"><summary>${group.label}</summary><div class="nav-group__menu">${links(group.items)}</div></details>`).join("");
  return `<header class="site-header"><div class="site-header__inner"><a class="brand" href="index.html">nllAgent Documentation</a><nav class="primary-nav" aria-label="Primary">${menus}</nav></div></header>`;
}

function groupForTitle(title) {
  const value = title.toLocaleLowerCase("en");
  if (value.includes("tutorial")) return groups.find((group) => group.id === "tutorials");
  if (value.includes("ontologyjs") || value.includes("intentjs") || value.includes("longtextjs") || value.includes("circuitjs") || value.includes("response circuit") || value.includes("semantic dsl") || value.includes("runtime")) return groups.find((group) => group.id === "semantic");
  if (value.includes("adaptive") || value.includes("skill") || value.includes("cli") || value.includes("pack") || value.includes("test") || value.includes("artifact")) return groups.find((group) => group.id === "workflows");
  if (value.includes("system") || value.includes("architecture") || value.includes("authoring") || value.includes("project") || value.includes("source")) return groups.find((group) => group.id === "understand");
  return groups.find((group) => group.id === "reference");
}

export function documentationSectionNavigation(title) {
  const group = groupForTitle(title);
  return `<nav class="section-nav" aria-label="${group.label} pages"><span>${group.label}</span>${links(group.items)}</nav>`;
}

export { groups as documentationNavigationGroups };
