const ELEMENTS = new Set(["H", "He", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Fe", "Cu", "Zn", "Ag", "Au"]);

export function parseChemicalFormula(formula) {
  let index = 0;
  function count() { const start = index; while (/\d/.test(formula[index] ?? "")) index += 1; const value = start === index ? 1n : BigInt(formula.slice(start, index)); if (value === 0n) throw new Error("CHEMISTRY_ZERO_SUBSCRIPT"); return value; }
  function group(expectClose = false) {
    const totals = new Map();
    while (index < formula.length && formula[index] !== ")") {
      if (formula[index] === "(") { index += 1; const nested = group(true); const multiplier = count(); for (const [element, value] of nested) totals.set(element, (totals.get(element) ?? 0n) + value * multiplier); continue; }
      const match = formula.slice(index).match(/^([A-Z][a-z]?)/);
      if (!match || !ELEMENTS.has(match[1])) throw new Error(`CHEMISTRY_UNSUPPORTED_ELEMENT:${formula.slice(index)}`);
      index += match[1].length; totals.set(match[1], (totals.get(match[1]) ?? 0n) + count());
    }
    if (expectClose) { if (formula[index] !== ")") throw new Error("CHEMISTRY_UNMATCHED_PARENTHESIS"); index += 1; }
    return totals;
  }
  const result = group();
  if (index !== formula.length) throw new Error(`CHEMISTRY_INVALID_TRAILING:${formula.slice(index)}`);
  return result;
}

export function reactionBalanced(reactants, products) {
  const total = (species) => { const result = new Map(); for (const [coefficient, formula] of species) for (const [element, count] of parseChemicalFormula(formula)) result.set(element, (result.get(element) ?? 0n) + BigInt(coefficient) * count); return result; };
  const left = total(reactants); const right = total(products);
  return [...new Set([...left.keys(), ...right.keys()])].every((element) => (left.get(element) ?? 0n) === (right.get(element) ?? 0n));
}
