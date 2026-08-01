const arrowPattern = /^(.*?)\s*(<\|--|--\|>|->>|-->>|==>|-\.->|-->|---|\.\.>|\*--|o--|--o)\s*(.*)$/;

function cleanToken(value) {
  return value
    .replace(/^\s*[A-Za-z0-9_.-]+\s*(?:\[|\(|\{)+/, "")
    .replace(/(?:\]|\)|\})+\s*$/, "")
    .replace(/^\|.*?\|\s*/, "")
    .replace(/^['"]|['"]$/g, "")
    .trim();
}

function diagramType(firstLine) {
  if (/^sequenceDiagram/i.test(firstLine)) return "Sequence diagram";
  if (/^classDiagram/i.test(firstLine)) return "Class diagram";
  if (/^stateDiagram/i.test(firstLine)) return "State diagram";
  return "Flow diagram";
}

function meaningfulLines(source) {
  const lines = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.slice(1).filter((line) => !/^%%/.test(line));
}

function relation(line) {
  const sequence = line.match(/^([^:]+?)(->>|-->>|--x|--\))([^:]+):\s*(.+)$/);
  if (sequence) return { left: sequence[1], arrow: sequence[2], right: sequence[3], label: sequence[4] };
  const match = line.match(arrowPattern);
  if (!match) return null;
  let right = match[3];
  let label = "";
  const edgeLabel = right.match(/^\|([^|]+)\|\s*(.*)$/);
  if (edgeLabel) [, label, right] = edgeLabel;
  const colon = right.lastIndexOf(":");
  if (!label && colon > 0 && !right.slice(colon + 1).includes(" ")) {
    label = right.slice(colon + 1).trim();
    right = right.slice(0, colon).trim();
  }
  return { left: match[1], arrow: match[2], right, label };
}

function appendRelation(list, parsed) {
  const item = document.createElement("li");
  item.className = "diagram-rendered__relation";
  const left = document.createElement("span");
  left.textContent = cleanToken(parsed.left);
  const arrow = document.createElement("span");
  arrow.className = "diagram-rendered__arrow";
  arrow.textContent = parsed.label ? `→ ${parsed.label} →` : "→";
  const right = document.createElement("span");
  right.textContent = cleanToken(parsed.right);
  item.append(left, arrow, right);
  list.append(item);
}

function appendStatement(list, line) {
  const item = document.createElement("li");
  item.className = "diagram-rendered__statement";
  item.textContent = line
    .replace(/^(participant|actor|class|state|subgraph|loop|alt|opt|else)\s+/i, "")
    .replace(/^end$/i, "End")
    .trim();
  list.append(item);
}

function render(element) {
  if (element.dataset.rendered === "true") return;
  const source = element.textContent.trim();
  const lines = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return;
  const figure = document.createElement("figure");
  figure.className = "diagram-rendered";
  figure.setAttribute("role", "group");
  figure.setAttribute("aria-label", diagramType(lines[0]));
  const caption = document.createElement("figcaption");
  caption.textContent = diagramType(lines[0]);
  const list = document.createElement("ol");
  list.className = "diagram-rendered__content";
  for (const line of meaningfulLines(source)) {
    const parsed = relation(line);
    if (parsed) appendRelation(list, parsed);
    else if (!/^(direction\s+|style\s+|classDef\s+)/i.test(line)) appendStatement(list, line);
  }
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "Diagram source";
  const original = document.createElement("pre");
  original.className = "diagram-rendered__source";
  original.textContent = source;
  details.append(summary, original);
  figure.append(caption, list, details);
  element.dataset.rendered = "true";
  element.replaceWith(figure);
}

function start() {
  for (const element of document.querySelectorAll("pre.mermaid")) render(element);
}

function initialize({ startOnLoad = true } = {}) {
  if (!startOnLoad) return;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
}

export default Object.freeze({ initialize });
