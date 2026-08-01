export class CodingRun {
  constructor(builder) { Object.assign(this, builder); Object.freeze(this.skills); Object.freeze(this.editRoots); Object.freeze(this.checks); Object.freeze(this); }
}
export class CodingRunBuilder {
  constructor(id) { this.id = id; this.adapter = "codex"; this.workingDirectory = null; this.skills = []; this.goal = null; this.editRoots = []; this.checks = []; }
  using(adapter) { this.adapter = adapter; return this; }
  cwd(path) { this.workingDirectory = path; return this; }
  installSkills(...skills) { this.skills.push(...skills); return this; }
  objective(goal) { this.goal = goal; return this; }
  allowEdits(...roots) { this.editRoots.push(...roots); return this; }
  check(...commands) { this.checks.push(...commands); return this; }
  seal() { return new CodingRun(this); }
}
export const codingRun = (id) => new CodingRunBuilder(id);
