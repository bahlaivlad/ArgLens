// Walk every catalog entry, find its cached MS Learn HTML under tools/.cache,
// parse the Parameters section for per-parameter constant lists (the
// `<dt><b>NAME</b></dt><dt>0xNN</dt>` pattern that MS Learn uses), generate
// per-function FLAG_DEFS groups, and update the entries' `flags`/`enum`
// params to reference them with `exactGood`.
//
// Preserves manually-tuned entries (`manual: true` AND a non-empty
// `flags: "groupName"` already on the param).
//
// Outputs:
//   - rewrites catalog.json
//   - rewrites app.js's FLAG_DEFS literal in place

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CACHE_DIR = path.join(ROOT, "tools", ".cache");
const CATALOG_PATH = path.join(ROOT, "catalog.json");
const APP_JS_PATH = path.join(ROOT, "app.js");

const BASE_URL = "https://learn.microsoft.com/en-us/windows/win32/api";

const HEADER_HINTS = {
  // category-derived defaults used by app.js's docsHeader (kept in sync)
  ntdll: "winternl",
  wininet: "wininet",
  bcrypt: "bcrypt",
  ws2_32: "winsock2"
};

const CATEGORY_HEADERS = {
  Registry: "winreg",
  Services: "winsvc",
  Crypto: "wincrypt",
  Memory: "memoryapi",
  Sync: "synchapi",
  Loader: "libloaderapi",
  Files: "fileapi",
  Handles: "handleapi",
  Process: "processthreadsapi",
  Threads: "processthreadsapi"
};

// Synced with DOC_HEADER_OVERRIDES in app.js. Could be parsed; keeping in
// sync manually is fine since this script only runs occasionally.
const DOC_HEADER_OVERRIDES = {
  CreateSemaphore: "winbase",
  OpenSemaphore: "synchapi"
};

function docsHeader(entry) {
  const baseName = entry.name.replace(/A\/W$/, "").replace(/[AW]$/, "");
  if (DOC_HEADER_OVERRIDES[baseName]) return DOC_HEADER_OVERRIDES[baseName];
  if (entry.system || entry.module === "ntdll") return "winternl";
  if (HEADER_HINTS[entry.module]) return HEADER_HINTS[entry.module];
  return CATEGORY_HEADERS[entry.category] || "";
}

function docsFunctionName(name) {
  if (name.endsWith("A/W")) return `${name.slice(0, -3)}A`;
  return name;
}

function urlFor(entry) {
  const header = docsHeader(entry);
  const docsName = docsFunctionName(entry.name);
  if (!header) return null;
  return `${BASE_URL}/${header}/nf-${header}-${docsName.toLowerCase()}`;
}

function cachePath(url) {
  return path.join(CACHE_DIR, url.replace(/[^A-Za-z0-9._-]/g, "_") + ".html");
}

function readCache(url) {
  const file = cachePath(url);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf-8");
}

// Extract per-parameter constant lists from a function HTML page.
// Returns { paramName: [{ name, value }] }, or {} if nothing parseable.
function extractParamConstants(html) {
  // Pin down the Parameters section
  const paramsBlockMatch = html.match(/<h2 id="parameters">([\s\S]*?)(?:<h2 |$)/);
  if (!paramsBlockMatch) return {};
  const block = paramsBlockMatch[1];

  // Split by each parameter heading. The heading itself is inside <p><code>[in] name</code></p>
  // or just <code>[in] *name*</code>. We capture each heading's name plus its
  // following content up to (but not including) the next heading.
  const headingRe = /<code[^>]*>\[(?:in|out|in,\s*out|in,\s*optional|out,\s*optional|in,\s*out,\s*optional)[^\]]*\]\s+(\w+)<\/code>/g;
  const headings = [];
  let m;
  while ((m = headingRe.exec(block))) {
    headings.push({ name: m[1], start: m.index });
  }
  if (!headings.length) return {};

  const result = {};
  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].start;
    const end = i + 1 < headings.length ? headings[i + 1].start : block.length;
    const section = block.slice(start, end);
    const consts = extractConstantsFromSection(section);
    if (consts.length) result[headings[i].name] = consts;
  }
  return result;
}

function extractConstantsFromSection(section) {
  const constants = [];
  // Format 1: <dt><b>NAME</b></dt>...<dt>0xNN</dt>
  // Sometimes wrapped in <strong> instead of <b>.
  const dlRe = /<dt[^>]*>\s*<(?:b|strong)[^>]*>\s*([A-Z_][A-Z0-9_]+)\s*<\/(?:b|strong)>\s*<\/dt>[\s\S]{0,400}?<dt[^>]*>\s*((?:0x[0-9A-Fa-f]+)|(?:\d+L?))\s*<\/dt>/g;
  let m;
  while ((m = dlRe.exec(section))) {
    constants.push({ name: m[1], value: normalizeValue(m[2]) });
  }
  if (constants.length) return dedupeConstants(constants);

  // Format 2: table cell with <strong>NAME</strong><br>0xNN
  const tableRe = /<strong>\s*([A-Z_][A-Z0-9_]+)\s*<\/strong>(?:\s|<br\s*\/?>|<\/p>|<p[^>]*>)*((?:0x[0-9A-Fa-f]+)|(?:\d+L?))/g;
  while ((m = tableRe.exec(section))) {
    constants.push({ name: m[1], value: normalizeValue(m[2]) });
  }
  return dedupeConstants(constants);
}

function normalizeValue(raw) {
  raw = String(raw).trim().replace(/L$/, "");
  if (/^0x/i.test(raw)) return parseInt(raw, 16);
  return parseInt(raw, 10);
}

function dedupeConstants(list) {
  const seen = new Map();
  for (const c of list) {
    if (!Number.isFinite(c.value)) continue;
    if (!seen.has(c.value)) seen.set(c.value, c.name);
  }
  return [...seen.entries()].map(([value, name]) => ({ name, value }));
}

// Generate a stable group identifier for a per-function/per-param flag set.
function groupNameFor(entry, paramName) {
  const base = entry.name.replace(/A\/W$/, "").replace(/[AW]$/, "");
  const camel = base.charAt(0).toLowerCase() + base.slice(1);
  return `${camel}_${paramName}`;
}

// Convert a flag classification into an enum if every documented value has
// no overlapping bits (i.e. the doc says "one of"). For now we keep all as
// `flags` since most parameters allow combinations.
function paramKindFor(currentKind, constants) {
  if (currentKind === "enum") return "enum";
  return "flags";
}

// MAIN
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
const flagGroups = {}; // groupName -> { value: name }
let updatedParams = 0;
let entriesTouched = 0;

for (const entry of catalog) {
  const url = urlFor(entry);
  if (!url) continue;
  const html = readCache(url);
  if (!html) continue;
  const found = extractParamConstants(html);
  if (!Object.keys(found).length) continue;

  let entryDirty = false;

  entry.signature.forEach((sig, i) => {
    const sigMatch = sig.match(/(\w+)\s*$/);
    if (!sigMatch) return;
    const paramName = sigMatch[1];
    const constants = found[paramName];
    if (!constants || !constants.length) return;

    const spec = entry.params[i];
    if (!spec) return;
    if (spec.flags) return; // already mapped — don't clobber
    if (!["flags", "enum", "integer"].includes(spec.kind)) return;

    const groupName = groupNameFor(entry, paramName);
    flagGroups[groupName] = {};
    for (const c of constants) flagGroups[groupName][c.value] = c.name;

    spec.flags = groupName;
    if (spec.kind === "integer") spec.kind = "flags";
    spec.kind = paramKindFor(spec.kind, constants);
    // Include 0 + all single-constant values in exactGood for nicer scoring.
    const exactGood = new Set(constants.map((c) => c.value));
    if (spec.zeroGood) exactGood.add(0);
    spec.exactGood = [...exactGood].sort((a, b) => a - b);
    updatedParams += 1;
    entryDirty = true;
  });

  if (entryDirty) entriesTouched += 1;
}

// Merge into app.js's FLAG_DEFS literal. Append before the closing brace.
const appJs = fs.readFileSync(APP_JS_PATH, "utf-8");
const flagsOpenRe = /const FLAG_DEFS = \{/;
const idx = appJs.search(flagsOpenRe);
if (idx < 0) throw new Error("FLAG_DEFS not found in app.js");

// Walk braces from the opening '{' to find the matching '}'
let depth = 0;
let closeIdx = -1;
for (let i = appJs.indexOf("{", idx); i < appJs.length; i++) {
  const ch = appJs[i];
  if (ch === "{") depth++;
  else if (ch === "}") {
    depth--;
    if (depth === 0) { closeIdx = i; break; }
  }
}
if (closeIdx < 0) throw new Error("Could not locate FLAG_DEFS closing brace");

const existingBlock = appJs.slice(idx, closeIdx + 1);
const existingNames = new Set([...existingBlock.matchAll(/^\s*([A-Za-z_][\w]*):\s*\{/gm)].map((m) => m[1]));

const newGroupNames = Object.keys(flagGroups).filter((n) => !existingNames.has(n));
const generatedSnippets = newGroupNames.map((name) => {
  const entries = Object.entries(flagGroups[name])
    .map(([v, n]) => `    0x${Number(v).toString(16)}: ${JSON.stringify(n)}`)
    .join(",\n");
  return `  ${name}: {\n${entries}\n  }`;
});

let nextAppJs = appJs;
if (generatedSnippets.length) {
  // Insert just before the closing brace
  const insertion = (existingBlock.trim().endsWith("{") ? "" : ",\n") + generatedSnippets.join(",\n") + "\n";
  nextAppJs = appJs.slice(0, closeIdx) + insertion + appJs.slice(closeIdx);
}

fs.writeFileSync(APP_JS_PATH, nextAppJs);
fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");

console.log(`Catalog: ${entriesTouched} entries touched, ${updatedParams} params updated.`);
console.log(`FLAG_DEFS: ${newGroupNames.length} new groups added.`);
