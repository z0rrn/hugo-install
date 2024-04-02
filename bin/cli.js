#!/usr/bin/env node

/*
 * This file is a pass-through for the actual hugo binary. It exists because for two reasons:
 *
 * - npm does not allow references to anything other than .js files in the "bin" field in package.json.
 * - Windows does not allow executing binaries that don't end in .exe, and we need the package.json "bin" field to
 *   point to the same file on all platforms.
 */

import { spawn } from "node:child_process";
import process from "node:process";
// Import execution path
import hugoPath from "../main.js";

const input = process.argv.slice(2);

// Exec hugo binary with second arguments
spawn(hugoPath, input, { stdio: "inherit" }).on("exit", process.exit);
