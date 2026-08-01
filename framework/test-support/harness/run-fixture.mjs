import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SemanticStore } from "../../runtime/store/semantic-store.mjs";
import { CircuitRunner } from "../../runtime/circuit-runner.mjs";
import { importFresh } from "../../tools/module-loader.mjs";

function callerDirectory() {
  const own = fileURLToPath(import.meta.url);
  for (const line of new Error().stack?.split("\n") ?? []) {
    const match = line.match(/file:\/\/([^:)]+\.mjs)/);
    if (!match) continue;
    const path = fileURLToPath(`file://${match[1]}`);
    if (path !== own) return dirname(path);
  }
  return process.cwd();
}

async function load(base, path) { return (await importFresh(resolve(base, path))).default; }

export async function runFixture({ ontology, ontologies = [], longtext, longtexts = [], circuit, circuits = [], baseDirectory = null, options = {} }) {
  const base = baseDirectory ?? callerDirectory();
  const ontologyModules = await Promise.all([ontology, ...ontologies].filter(Boolean).map((path) => load(base, path)));
  const textModules = await Promise.all([longtext, ...longtexts].filter(Boolean).map((path) => load(base, path)));
  const circuitModules = (await Promise.all([circuit, ...circuits].filter(Boolean).map((path) => load(base, path)))).flat();
  const store = new SemanticStore({ id: "fixture" });
  for (const module of ontologyModules) store.installOntology(module);
  for (const model of textModules) store.beginTransaction(`fixture:${model.id}`, { allowUngrounded: false }).longText(model).commit();
  const executions = [];
  for (const module of circuitModules) executions.push(await new CircuitRunner().run(module, store, options));
  return Object.freeze({ store, executions: Object.freeze(executions), findings: Object.freeze(executions.flatMap((entry) => entry.findings)), frames: Object.freeze(executions.flatMap((entry) => entry.frames)), diagnostics: Object.freeze(executions.flatMap((entry) => entry.diagnostics)) });
}
