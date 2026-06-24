// One-shot: extract the inline CATALOG from app.js into catalog.json.
// Run once. After this, catalog.json is the source of truth.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "app.js"), "utf-8");

function api(name, module, category, signature, params) {
  return { name, module, category, signature, params, system: false, manual: true };
}
function nt(name, category, signature, params) {
  return { name, module: "ntdll", category, signature, params, system: true, manual: true };
}
function p(kind, options = {}) {
  return { kind, ...options };
}

function findMatchingClose(s, openIdx, openChar, closeChar) {
  let depth = 1;
  let inString = null;
  for (let i = openIdx + 1; i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (ch === "\\") { i++; continue; }
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inString = ch; continue; }
    if (ch === openChar) depth++;
    else if (ch === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

const declStart = source.indexOf("const CATALOG = [");
if (declStart === -1) throw new Error("CATALOG declaration not found");
const arrayOpen = source.indexOf("[", declStart);
const arrayClose = findMatchingClose(source, arrayOpen, "[", "]");
const declCode = source.slice(arrayOpen, arrayClose + 1);

const pushStart = source.indexOf("CATALOG.push(");
if (pushStart === -1) throw new Error("CATALOG.push not found");
const pushOpen = source.indexOf("(", pushStart);
const pushClose = findMatchingClose(source, pushOpen, "(", ")");
const pushCode = source.slice(pushOpen + 1, pushClose);

const initial = eval(declCode);
const extras = eval(`[${pushCode}]`);
const CATALOG = [...initial, ...extras];

fs.writeFileSync(
  path.join(root, "catalog.json"),
  JSON.stringify(CATALOG, null, 2) + "\n"
);
console.log(`Wrote ${CATALOG.length} entries to catalog.json`);
