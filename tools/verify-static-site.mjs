#!/usr/bin/env node
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";

function argumentsFor(argv) {
  const options = { docs: null, basePath: "", paths: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--base-path") options.basePath = `/${argv[++index].replace(/^\/+|\/+$/g, "")}`;
    else if (value === "--path") options.paths.push(argv[++index]);
    else if (!options.docs) options.docs = value;
    else throw new Error(`Unexpected argument: ${value}`);
  }
  if (!options.docs) throw new Error("Usage: node tools/verify-static-site.mjs <docs-dir> [--base-path PATH] [--path PATH]");
  if (options.basePath === "/") options.basePath = "";
  return options;
}

const contentTypes = Object.freeze({
  ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".md": "text/markdown",
  ".mjs": "text/javascript", ".png": "image/png", ".svg": "image/svg+xml", ".txt": "text/plain"
});

function serverFor(root, basePath) {
  return createServer(async (request, response) => {
    const url = new URL(request.url, "http://127.0.0.1");
    if (basePath && url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) {
      response.writeHead(404); response.end("Not found"); return;
    }
    let path = basePath ? url.pathname.slice(basePath.length) || "/" : url.pathname;
    if (path.endsWith("/")) path += "index.html";
    const target = resolve(root, `.${decodeURIComponent(path)}`);
    if (!target.startsWith(`${root}/`)) { response.writeHead(403); response.end("Forbidden"); return; }
    try {
      if (!(await stat(target)).isFile()) throw new Error("not-file");
      const type = contentTypes[extname(target)] ?? "application/octet-stream";
      response.writeHead(200, { "content-type": `${type}${type.startsWith("text/") ? "; charset=utf-8" : ""}` });
      createReadStream(target).pipe(response);
    } catch {
      response.writeHead(404); response.end("Not found");
    }
  });
}

async function main() {
  const options = argumentsFor(process.argv.slice(2));
  const root = resolve(options.docs);
  const server = serverFor(root, options.basePath);
  await new Promise((accept, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", accept); });
  const port = server.address().port;
  const paths = options.paths.length > 0
    ? options.paths
    : ["/", "/assets/diagram-renderer.mjs", "/specsLoader.html?spec=matrix.md"];
  let failed = false;
  try {
    for (const requested of paths) {
      const path = requested.startsWith("/") ? requested : `/${requested}`;
      const response = await fetch(`http://127.0.0.1:${port}${options.basePath}${path}`);
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok || (extname(new URL(requested, "http://docs").pathname) === ".mjs" && !contentType.startsWith("text/javascript"))) {
        console.error(`FAIL ${options.basePath}${path}: HTTP ${response.status}, ${contentType || "no content type"}`);
        failed = true;
      } else {
        console.log(`OK   ${options.basePath}${path}`);
      }
      await response.arrayBuffer();
    }
  } finally {
    await new Promise((accept) => server.close(accept));
  }
  if (failed) process.exitCode = 1;
}

main().catch((error) => { console.error(error.stack ?? error); process.exitCode = 1; });
