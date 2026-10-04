#!/usr/bin/env node
/**
 * Compare data-i18n* keys in index.html vs translations.uk / translations.en in script.js.
 * Run from repo root:
 *   node .cursor/skills/formello-patterns/scripts/check-i18n.js
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../../..");
const htmlPath = path.join(root, "index.html");
const jsPath = path.join(root, "script.js");

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
}

function extractHtmlKeys(html) {
  const attrs = [
    "data-i18n",
    "data-i18n-html",
    "data-i18n-aria",
    "data-i18n-placeholder",
  ];
  const keys = new Set();
  for (const attr of attrs) {
    const re = new RegExp(`${attr}=["']([^"']+)["']`, "g");
    let m;
    while ((m = re.exec(html))) keys.add(m[1]);
  }
  return keys;
}

function extractDictKeys(js, lang) {
  const start = js.indexOf(`${lang}: {`);
  if (start < 0) return null;
  const after = js.slice(start);
  const end = after.indexOf("\n  },");
  const block = end >= 0 ? after.slice(0, end) : after;
  const keys = new Set();
  const re = /^\s{4}([A-Za-z][\w]*)\s*:/gm;
  let m;
  while ((m = re.exec(block))) {
    if (m[1] === "code" || m[1] === "htmlLang") continue;
    keys.add(m[1]);
  }
  return keys;
}

const html = fs.readFileSync(htmlPath, "utf8");
const js = fs.readFileSync(jsPath, "utf8");

const used = extractHtmlKeys(html);
const uk = extractDictKeys(js, "uk");
const en = extractDictKeys(js, "en");

if (!uk || !en) {
  fail("Could not parse translations.uk / translations.en in script.js");
  process.exit(1);
}

const metaOnly = new Set([
  "errNameRequired",
  "errNameShort",
  "errEmailRequired",
  "errEmailInvalid",
  "errPhoneRequired",
  "errPhoneInvalid",
  "errMessageRequired",
  "errMessageShort",
]);

console.log(`HTML i18n attrs: ${used.size}`);
console.log(`UK keys (excl. code/htmlLang): ${uk.size}`);
console.log(`EN keys (excl. code/htmlLang): ${en.size}`);

for (const key of used) {
  if (!uk.has(key)) fail(`HTML uses "${key}" missing in translations.uk`);
  if (!en.has(key)) fail(`HTML uses "${key}" missing in translations.en`);
}

for (const key of uk) {
  if (!en.has(key)) fail(`UK has "${key}" missing in EN`);
}
for (const key of en) {
  if (!uk.has(key)) fail(`EN has "${key}" missing in UK`);
}

for (const key of uk) {
  if (used.has(key) || metaOnly.has(key)) continue;
  console.warn(`WARN: dictionary key "${key}" not referenced in HTML attrs (may be JS-only)`);
}

if (!process.exitCode) {
  console.log("OK: UK/EN keys align with HTML data-i18n* attributes.");
}
