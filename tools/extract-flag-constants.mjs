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

function docsFunctionNames(name) {
  // Try W first (matches build-catalog.mjs's caching preference), then A.
  if (name.endsWith("A/W")) return [`${name.slice(0, -3)}W`, `${name.slice(0, -3)}A`];
  return [name];
}

function urlsFor(entry) {
  const header = docsHeader(entry);
  if (!header) return [];
  return docsFunctionNames(entry.name).map((n) => `${BASE_URL}/${header}/nf-${header}-${n.toLowerCase()}`);
}

function cachePath(url) {
  return path.join(CACHE_DIR, url.replace(/[^A-Za-z0-9._-]/g, "_") + ".html");
}

function readCache(url) {
  const file = cachePath(url);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf-8");
}

async function fetchAndCache(url) {
  const cached = readCache(url);
  if (cached) return cached;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "ArgLens-catalog-builder" } });
    if (!res.ok) return null;
    const html = await res.text();
    fs.writeFileSync(cachePath(url), html);
    return html;
  } catch {
    return null;
  }
}

// Resolve a (possibly relative) MS Learn href to an absolute URL we can
// fetch + cache. Returns null for off-site or anchor-only links.
function normalizeLearnUrl(href) {
  if (!href) return null;
  if (href.startsWith("#")) return null;
  if (href.startsWith("mailto:") || href.startsWith("javascript:")) return null;
  let url;
  if (/^https?:\/\//.test(href)) url = href;
  else if (href.startsWith("/")) url = "https://learn.microsoft.com" + href;
  else return null;
  url = url.split("#")[0]; // strip fragment
  // Normalize the legacy `/desktop/` slug to current `/win32/` where used,
  // so we don't double-cache the same page under two URLs.
  return url
    .replace("/windows/desktop/", "/windows/win32/")
    .replace("/desktop/api/", "/win32/api/")
    .replace("/desktop/Sync/", "/win32/sync/")
    .replace("/desktop/FileIO/", "/win32/fileio/")
    .replace("/desktop/ProcThread/", "/win32/procthread/")
    .replace("/desktop/SecAuthZ/", "/win32/secauthz/");
}

// Decide whether a URL is likely to be a constants/flags reference page
// rather than another function reference page or an unrelated concept page.
function looksLikeConstantsPage(url) {
  if (!url) return false;
  // Skip function reference pages — they have /api/HEADER/nf-HEADER-NAME form.
  if (/\/api\/[^\/]+\/nf-[^\/]+-/.test(url)) return false;
  // Whitelist by suffix tokens that almost always indicate a constants list.
  return /-(?:flags|constants|values|attributes|options|access-rights|disposition|categories|modes|types|levels|priorities|info-classes)(?:$|[\/])/i.test(url)
      || /security-and-access-rights/i.test(url)
      || /process-creation-flags|process-access-rights|thread-access-rights|file-access-rights|registry-key-security-and-access-rights/i.test(url);
}

// Extract per-parameter constant lists from a function HTML page.
// Returns { paramName: { constants: [{ name, value }], refs: [url] } }.
function extractParamConstants(html) {
  const paramsBlockMatch = html.match(/<h2 id="parameters">([\s\S]*?)(?:<h2 |$)/);
  if (!paramsBlockMatch) return {};
  const block = paramsBlockMatch[1];

  const headingRe = /<code[^>]*>\[(?:in|out|in,\s*out|in,\s*optional|out,\s*optional|in,\s*out,\s*optional)[^\]]*\]\s+(\w+)<\/code>/g;
  const headings = [];
  let m;
  while ((m = headingRe.exec(block))) headings.push({ name: m[1], start: m.index });
  if (!headings.length) return {};

  const result = {};
  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].start;
    const end = i + 1 < headings.length ? headings[i + 1].start : block.length;
    const section = block.slice(start, end);
    const constants = extractConstantsFromSection(section);
    const refs = collectConstantsPageLinks(section);
    if (constants.length || refs.length) {
      result[headings[i].name] = { constants, refs };
    }
  }
  return result;
}

function collectConstantsPageLinks(section) {
  const urls = new Set();
  const re = /href="([^"]+)"/g;
  let m;
  while ((m = re.exec(section))) {
    const url = normalizeLearnUrl(m[1]);
    if (url && looksLikeConstantsPage(url)) urls.add(url);
  }
  return [...urls];
}

// Parse a standalone constants reference page (e.g. Process Creation Flags).
// Uses the same dl/dt patterns as a parameter section.
function extractConstantsFromReferencePage(html) {
  // Try to scope to the body content (skip nav/toc). MS Learn usually has
  // a <main> wrapper. If not, just scan the whole document.
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  const body = mainMatch ? mainMatch[0] : html;
  return extractConstantsFromSection(body);
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
let externalPages = 0;

// Cache of already-resolved constants per external reference URL.
const refCache = new Map();
async function constantsForRef(url) {
  if (refCache.has(url)) return refCache.get(url);
  const html = await fetchAndCache(url);
  if (!html) {
    refCache.set(url, []);
    return [];
  }
  const consts = extractConstantsFromReferencePage(html);
  if (consts.length) externalPages += 1;
  refCache.set(url, consts);
  return consts;
}

// Heuristic: when a multi-purpose page (e.g. synch-object security) is
// referenced from a specific function param, filter the constants to the
// ones that begin with the function's family prefix (e.g. TIMER_ for
// CreateWaitableTimer, EVENT_ for CreateEvent). Falls back to all.
function filterConstantsForEntry(constants, entry, paramName) {
  if (constants.length <= 8) return constants;
  const name = entry.name.replace(/A\/W$|[AW]$/, "");
  const prefixes = [];
  if (/Event/i.test(name)) prefixes.push("EVENT_");
  if (/Mutex|Mutant/i.test(name)) prefixes.push("MUTEX_", "MUTANT_");
  if (/Semaphore/i.test(name)) prefixes.push("SEMAPHORE_");
  if (/WaitableTimer|Timer\b/i.test(name)) prefixes.push("TIMER_");
  if (/Process/i.test(name)) prefixes.push("PROCESS_");
  if (/Thread/i.test(name)) prefixes.push("THREAD_");
  if (/File|Pipe/i.test(name)) prefixes.push("FILE_");
  if (/Key|Reg/i.test(name)) prefixes.push("KEY_");
  if (/SymbolicLink/i.test(name)) prefixes.push("SYMBOLIC_LINK_");
  if (/Directory(Object)?/i.test(name)) prefixes.push("DIRECTORY_");
  if (/Section/i.test(name)) prefixes.push("SECTION_");
  if (/Token/i.test(name)) prefixes.push("TOKEN_");
  if (!prefixes.length) return constants;
  const filtered = constants.filter((c) => prefixes.some((p) => c.name.startsWith(p)));
  return filtered.length ? filtered : constants;
}

for (const entry of catalog) {
  const candidates = urlsFor(entry);
  if (!candidates.length) continue;
  let html = null;
  for (const u of candidates) {
    html = readCache(u);
    if (html) break;
  }
  if (!html) continue;
  const found = extractParamConstants(html);
  if (!Object.keys(found).length) continue;

  let entryDirty = false;

  for (let i = 0; i < entry.signature.length; i++) {
    const sig = entry.signature[i];
    const sigMatch = sig.match(/(\w+)\s*$/);
    if (!sigMatch) continue;
    const paramName = sigMatch[1];
    const paramInfo = found[paramName];
    if (!paramInfo) continue;

    const spec = entry.params[i];
    if (!spec) continue;
    if (spec.flags) continue;
    if (!["flags", "enum", "integer"].includes(spec.kind)) continue;

    let constants = paramInfo.constants;

    // Fall back to / supplement with linked reference pages.
    if (!constants.length && paramInfo.refs.length) {
      for (const refUrl of paramInfo.refs) {
        const refConsts = await constantsForRef(refUrl);
        if (refConsts.length) {
          constants = filterConstantsForEntry(refConsts, entry, paramName);
          if (constants.length) break;
        }
      }
    }
    if (!constants.length) continue;

    const groupName = groupNameFor(entry, paramName);
    flagGroups[groupName] = {};
    for (const c of constants) flagGroups[groupName][c.value] = c.name;

    spec.flags = groupName;
    if (spec.kind === "integer") spec.kind = "flags";
    spec.kind = paramKindFor(spec.kind, constants);
    const exactGood = new Set(constants.map((c) => c.value));
    if (spec.zeroGood) exactGood.add(0);
    spec.exactGood = [...exactGood].sort((a, b) => a - b);
    updatedParams += 1;
    entryDirty = true;
  }

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
  // Insert just before the closing brace. If the existing block already
  // ends with a trailing `,` (or is empty), skip the leading separator.
  const trimmed = existingBlock.trim();
  const needsLeadingComma = !trimmed.endsWith("{") && !trimmed.endsWith(",");
  const insertion = (needsLeadingComma ? ",\n" : "\n") + generatedSnippets.join(",\n") + "\n";
  nextAppJs = appJs.slice(0, closeIdx) + insertion + appJs.slice(closeIdx);
}

fs.writeFileSync(APP_JS_PATH, nextAppJs);
fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");

console.log(`Catalog: ${entriesTouched} entries touched, ${updatedParams} params updated.`);
console.log(`FLAG_DEFS: ${newGroupNames.length} new groups added.`);
