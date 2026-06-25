// Reconcile each catalog entry's per-parameter `nullGood` flag with the
// SAL annotation in the corresponding MS Learn HTML (`[in, optional]` /
// `[out, optional]` / `[in, out, optional]` vs the non-optional `[in]` /
// `[out]` / `[in, out]`).
//
// Background: tools/build-catalog.mjs originally defaulted every
// pointer-shaped parameter (ptr, stringptr, codeptr, outptr, handle) to
// `nullGood: true`. That made functions like RegisterApplicationRecovery-
// Callback rank a NULL first argument at 100% even though MSDN explicitly
// marks pRecoveryCallback as non-optional.
//
// Strategy:
// - Walks every entry that has cached HTML under tools/.cache/.
// - Parses the Parameters section for each `<code>[xxx] paramName</code>`
//   heading and notes whether the annotation contains the word "optional".
// - For each pointer-shaped param whose param spec currently has
//   `nullGood: true`, remove it if and only if MSDN does NOT mark that
//   parameter optional.
// - Skips manual entries by default; pass `--manual` to also fix them.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CACHE_DIR = path.join(ROOT, "tools", ".cache");
const CATALOG_PATH = path.join(ROOT, "catalog.json");
const BASE_URL = "https://learn.microsoft.com/en-us/windows/win32/api";

const INCLUDE_MANUAL = process.argv.includes("--manual");

const HEADER_HINTS = { ntdll: "winternl", wininet: "wininet", bcrypt: "bcrypt", ws2_32: "winsock2" };
const CATEGORY_HEADERS = {
  Registry: "winreg", Services: "winsvc", Crypto: "wincrypt",
  Memory: "memoryapi", Sync: "synchapi", Loader: "libloaderapi",
  Files: "fileapi", Handles: "handleapi",
  Process: "processthreadsapi", Threads: "processthreadsapi"
};
const DOC_HEADER_OVERRIDES = { CreateSemaphore: "winbase", OpenSemaphore: "synchapi" };

function docsHeader(entry) {
  const baseName = entry.name.replace(/A\/W$/, "").replace(/[AW]$/, "");
  if (DOC_HEADER_OVERRIDES[baseName]) return DOC_HEADER_OVERRIDES[baseName];
  if (entry.system || entry.module === "ntdll") return "winternl";
  if (HEADER_HINTS[entry.module]) return HEADER_HINTS[entry.module];
  return CATEGORY_HEADERS[entry.category] || "";
}

function urlsFor(entry) {
  const header = docsHeader(entry);
  const names = entry.name.endsWith("A/W")
    ? [`${entry.name.slice(0, -3)}W`, `${entry.name.slice(0, -3)}A`]
    : [entry.name];
  if (header) return names.map((n) => `${BASE_URL}/${header}/nf-${header}-${n.toLowerCase()}`);
  return [];
}

function readCache(url) {
  const file = path.join(CACHE_DIR, url.replace(/[^A-Za-z0-9._-]/g, "_") + ".html");
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf-8");
}

// Build once: function-name (lowercased) -> path of any cached HTML that
// matches. Lets us recover entries whose category->header mapping is wrong.
const CACHE_BY_FN = (() => {
  const idx = new Map();
  for (const file of fs.readdirSync(CACHE_DIR)) {
    const m = file.match(/^https___learn\.microsoft\.com_en-us_windows_win32_api_(\w+)_nf-\1-([\w_]+)\.html$/);
    if (!m) continue;
    const fnLower = m[2];
    if (!idx.has(fnLower)) idx.set(fnLower, path.join(CACHE_DIR, file));
  }
  return idx;
})();

function readCacheByFunctionName(entry) {
  const names = entry.name.endsWith("A/W")
    ? [`${entry.name.slice(0, -3)}W`, `${entry.name.slice(0, -3)}A`]
    : [entry.name];
  for (const n of names) {
    const file = CACHE_BY_FN.get(n.toLowerCase());
    if (file) return fs.readFileSync(file, "utf-8");
  }
  return null;
}

function paramAnnotations(html) {
  const result = {};
  const block = (html.match(/<h2 id="parameters">([\s\S]*?)(?:<h2 |$)/) || [])[1];
  if (!block) return result;
  const re = /<code[^>]*>\[([^\]]+)\]\s+(\w+)<\/code>/g;
  let m;
  while ((m = re.exec(block))) {
    const annotation = m[1].toLowerCase();
    const name = m[2];
    result[name] = { optional: /optional/.test(annotation) };
  }
  return result;
}

const POINTER_KINDS = new Set(["ptr", "stringptr", "codeptr", "outptr", "handle"]);

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
let scanned = 0, paramsChecked = 0, paramsFixed = 0;
let withoutHtml = 0;

for (const entry of catalog) {
  if (!INCLUDE_MANUAL && entry.manual) continue;
  const urls = urlsFor(entry);
  let html = null;
  for (const u of urls) { html = readCache(u); if (html) break; }
  if (!html) html = readCacheByFunctionName(entry);
  if (!html) { withoutHtml++; continue; }
  const annotations = paramAnnotations(html);
  if (!Object.keys(annotations).length) continue;
  scanned++;

  entry.signature.forEach((sig, i) => {
    const sigMatch = sig.match(/(\w+)\s*$/);
    if (!sigMatch) return;
    const paramName = sigMatch[1];
    const ann = annotations[paramName];
    if (!ann) return;
    const spec = entry.params[i];
    if (!spec || !POINTER_KINDS.has(spec.kind)) return;

    paramsChecked++;
    if (spec.nullGood === true && !ann.optional) {
      delete spec.nullGood;
      paramsFixed++;
    }
  });
}

fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");
console.log(`Scanned: ${scanned} entries (${withoutHtml} without cached HTML).`);
console.log(`Pointer-kind params checked: ${paramsChecked}.`);
console.log(`Removed nullGood from: ${paramsFixed} non-optional params.`);
if (!INCLUDE_MANUAL) console.log("Manual entries left alone. Re-run with --manual to include them.");
