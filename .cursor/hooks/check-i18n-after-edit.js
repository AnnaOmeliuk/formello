#!/usr/bin/env node
/**
 * afterFileEdit: when index.html or script.js changes, run Formello i18n check
 * and inject failures/warnings into the agent via additional_context.
 */
const { spawnSync } = require("child_process");
const path = require("path");

function readStdin() {
  try {
    return fsReadStdin();
  } catch {
    return "";
  }
}

function fsReadStdin() {
  return require("fs").readFileSync(0, "utf8");
}

function respond(payload) {
  process.stdout.write(JSON.stringify(payload));
}

function relevantFile(filePath) {
  if (!filePath) return false;
  const base = path.basename(filePath).toLowerCase();
  return base === "index.html" || base === "script.js";
}

const raw = readStdin();
let input = {};
try {
  input = raw ? JSON.parse(raw) : {};
} catch {
  respond({});
  process.exit(0);
}

const filePath = input.file_path || input.filePath || "";
if (!relevantFile(filePath)) {
  respond({});
  process.exit(0);
}

const root = process.cwd();
const script = path.join(
  root,
  ".cursor",
  "skills",
  "formello-patterns",
  "scripts",
  "check-i18n.js"
);

const result = spawnSync(process.execPath, [script], {
  cwd: root,
  encoding: "utf8",
  env: process.env,
});

const stdout = (result.stdout || "").trim();
const stderr = (result.stderr || "").trim();
const combined = [stdout, stderr].filter(Boolean).join("\n");
const failed = result.status !== 0;

// WARN-only (e.g. JS-only dict keys) is expected noise — only inject on FAIL.
if (!failed) {
  respond({});
  process.exit(0);
}

respond({
  additional_context: [
    `Formello i18n check FAILED after editing ${path.basename(filePath)}.`,
    "Run: node .cursor/skills/formello-patterns/scripts/check-i18n.js",
    "Fix missing UK/EN keys or HTML data-i18n* attributes before finishing.",
    "",
    combined || "(check-i18n produced no output)",
  ].join("\n"),
});
process.exit(0);
