export const replaceRole = (bindings, roleIdentity, replacement) => bindings.map((binding) => binding.role().identity === roleIdentity ? replacement : binding);
export const reversePolarity = (polarity) => polarity === "asserted" ? "denied" : polarity === "denied" ? "asserted" : polarity;
export const removeCoverage = (longText, predicate = () => true) => Object.freeze({ ...longText, coverage: Object.freeze(longText.coverage.filter((entry) => !predicate(entry))) });
export const reverseTrace = (trace) => Object.freeze([...trace].reverse());
