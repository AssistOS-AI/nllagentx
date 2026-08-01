import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { dirname, join } from "node:path";
import { serialize, deserialize } from "node:v8";
import { createHash } from "node:crypto";

export class MemoryContentCache {
  #values = new Map();
  get(key) { return this.#values.get(key); }
  set(key, value) { this.#values.set(key, value); return value; }
  has(key) { return this.#values.has(key); }
  clear() { this.#values.clear(); }
}

export class FileContentCache {
  constructor(root) { this.root = root; }
  #path(key) { const digest = createHash("sha256").update(key).digest("hex"); return join(this.root, digest.slice(0, 2), `${digest}.bin`); }
  async get(key) { try { return deserialize(await readFile(this.#path(key))); } catch (error) { if (error.code === "ENOENT") return undefined; throw error; } }
  async set(key, value) { const path = this.#path(key); await mkdir(dirname(path), { recursive: true }); const temporary = `${path}.${process.pid}.tmp`; await writeFile(temporary, serialize(value)); await rename(temporary, path); return value; }
}
