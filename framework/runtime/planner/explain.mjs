export function explainPlan({ intent = null, profile = null, plan }) {
  const lines = ["# Execution Plan", "", `Plan status: ${plan.complete ? "complete" : "blocked"}.`];
  if (intent) lines.push("", `Intent: \`${intent.id}\` (\`${intent.planIdentity}\`).`);
  if (profile) lines.push("", `Profile: \`${profile.profile}\`.`, "", "## Loaded packs", "", ...profile.packs.map((pack) => `- \`${pack.id}\`: ${profile.reasons.get(pack.id) ?? "selected"}`));
  lines.push("", "## Selected circuits", "", ...(plan.circuits.length ? plan.circuits.map((circuit) => `- \`${circuit.identity}\``) : ["- None."]));
  lines.push("", "## Rejected candidates", "", ...(plan.rejected.length ? plan.rejected.map((entry) => `- \`${entry.circuit}\`: ${entry.reason}`) : ["- None."]));
  lines.push("", "## Blocked capabilities", "", ...(plan.blocked.length ? plan.blocked.map((entry) => `- \`${entry.capability}\`: ${entry.code}`) : ["- None."]));
  return `${lines.join("\n")}\n`;
}
