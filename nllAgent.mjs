#!/usr/bin/env node
import { runCli } from "./framework/cli/main.mjs";

process.exitCode = await runCli(process.argv.slice(2));
