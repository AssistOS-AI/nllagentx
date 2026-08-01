export function responseContractFailures({
  response,
  expectedFindings = [],
  sourceTexts = [],
  requireQuotedEvidence = expectedFindings.length > 0
}) {
  const failures = [];
  const sourceCorpus = Array.isArray(sourceTexts) ? sourceTexts.join("\n") : String(sourceTexts ?? "");
  if (!response.includes("[CNL:DOCUMENT]")) {
    failures.push("primary response is not tagged Markdown CNL");
  }
  if (/Object\.freeze|nll\.source-span|symbolic-decision-coverage\"/.test(response)) {
    failures.push("primary response leaks an internal executable or assurance projection");
  }
  if (/\[STATUS:NOT_APPLICABLE\]|_NOT_APPLICABLE/.test(response)) {
    failures.push("primary response includes a non-applicable result");
  }
  for (const expectedFinding of expectedFindings.filter((value) => !value.endsWith(":NOT_APPLICABLE"))) {
    const separator = expectedFinding.lastIndexOf(":");
    const code = expectedFinding.slice(0, separator);
    const status = expectedFinding.slice(separator + 1);
    if (!response.includes(`[CODE:${code}]`) || !response.includes(`[STATUS:${status}]`)) {
      failures.push(`primary response omits tagged expected finding ${expectedFinding}`);
    }
  }
  const quoted = [...response.matchAll(/^> (?!—|$)(.+)$/gm)].map((match) => match[1]);
  if (requireQuotedEvidence && quoted.length === 0) {
    failures.push("primary response has no quoted source evidence");
  }
  for (const quote of quoted) {
    if (sourceCorpus && !sourceCorpus.includes(quote)) {
      failures.push(`response quote is not an exact input substring: ${quote}`);
    }
  }
  return Object.freeze(failures);
}
