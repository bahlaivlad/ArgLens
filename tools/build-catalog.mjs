// Fetch Win32 _base APIs from Microsoft Learn and merge into catalog.json.
// - Caches each page to tools/.cache to make re-runs fast.
// - Preserves manual entries (entries with `manual: true` in catalog.json) and
//   skips any function whose base name already exists.
//
// Run: node tools/build-catalog.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATALOG_PATH = path.join(ROOT, "catalog.json");
const CACHE_DIR = path.join(ROOT, "tools", ".cache");
fs.mkdirSync(CACHE_DIR, { recursive: true });

// Headers listed under https://learn.microsoft.com/.../api/_base/ plus the
// core file/process headers (which live one level up but belong to Base
// Services in the Windows SDK).
const HEADERS = [
  "atlthunk", "avrt", "dbghelp", "dbt", "debugapi", "enclaveapi",
  "errhandlingapi", "fibersapi", "handleapi", "heapapi", "imagehlp",
  "interlockedapi", "ioapiset", "jobapi", "jobapi2", "libloaderapi",
  "libloaderapi2", "memoryapi", "minwinbase", "namedpipeapi", "namespaceapi",
  "powerbase", "powersetting", "powrprof", "processenv", "processtopologyapi",
  "processthreadsapi", "profileapi", "realtimeapiset", "secext", "synchapi",
  "sysinfoapi", "systemtopologyapi", "threadpoolapiset",
  "threadpoollegacyapiset", "timezoneapi", "utilapiset", "versionhelpers",
  "wct", "winbase", "winenclaveapi", "winioctl", "winnt", "winreg",
  "winternl", "fileapi"
];

const HEADER_META = {
  memoryapi:                 { module: "kernel32", category: "Memory" },
  heapapi:                   { module: "kernel32", category: "Memory" },
  fileapi:                   { module: "kernel32", category: "Files" },
  namedpipeapi:              { module: "kernel32", category: "Files" },
  ioapiset:                  { module: "kernel32", category: "Files" },
  winioctl:                  { module: "kernel32", category: "Files" },
  processthreadsapi:         { module: "kernel32", category: "Process" },
  jobapi:                    { module: "kernel32", category: "Process" },
  jobapi2:                   { module: "kernel32", category: "Process" },
  processenv:                { module: "kernel32", category: "Process" },
  processtopologyapi:        { module: "kernel32", category: "Process" },
  fibersapi:                 { module: "kernel32", category: "Threads" },
  synchapi:                  { module: "kernel32", category: "Sync" },
  interlockedapi:            { module: "kernel32", category: "Sync" },
  wct:                       { module: "advapi32", category: "Sync" },
  threadpoolapiset:          { module: "kernel32", category: "Threads" },
  threadpoollegacyapiset:    { module: "kernel32", category: "Threads" },
  libloaderapi:              { module: "kernel32", category: "Loader" },
  libloaderapi2:             { module: "kernel32", category: "Loader" },
  handleapi:                 { module: "kernel32", category: "Handles" },
  errhandlingapi:            { module: "kernel32", category: "System" },
  debugapi:                  { module: "kernel32", category: "Debug" },
  sysinfoapi:                { module: "kernel32", category: "System" },
  systemtopologyapi:         { module: "kernel32", category: "System" },
  profileapi:                { module: "kernel32", category: "System" },
  timezoneapi:               { module: "kernel32", category: "System" },
  realtimeapiset:            { module: "kernel32", category: "System" },
  versionhelpers:            { module: "kernel32", category: "System" },
  utilapiset:                { module: "kernel32", category: "System" },
  namespaceapi:              { module: "kernel32", category: "System" },
  enclaveapi:                { module: "kernel32", category: "System" },
  winenclaveapi:             { module: "kernel32", category: "System" },
  powerbase:                 { module: "powrprof",  category: "System" },
  powersetting:              { module: "powrprof",  category: "System" },
  powrprof:                  { module: "powrprof",  category: "System" },
  secext:                    { module: "secur32",   category: "Security" },
  winreg:                    { module: "advapi32",  category: "Registry" },
  winternl:                  { module: "ntdll",     category: "Native",  system: true },
  winbase:                   { module: "kernel32",  category: "System" },
  winnt:                     { module: "kernel32",  category: "System" },
  minwinbase:                { module: "kernel32",  category: "System" },
  atlthunk:                  { module: "atlthunk",  category: "Misc" },
  avrt:                      { module: "avrt",      category: "Misc" },
  dbghelp:                   { module: "dbghelp",   category: "Debug" },
  imagehlp:                  { module: "imagehlp",  category: "Debug" },
  dbt:                       { module: "user32",    category: "Misc" }
};

const BASE_URL = "https://learn.microsoft.com/en-us/windows/win32/api";
const CONCURRENCY = 8;

function cacheKey(url) {
  return url.replace(/[^A-Za-z0-9._-]/g, "_") + ".html";
}

async function cachedFetch(url) {
  const file = path.join(CACHE_DIR, cacheKey(url));
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf-8");
  const res = await fetch(url, { headers: { "User-Agent": "ArgLens-catalog-builder" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  fs.writeFileSync(file, html);
  return html;
}

async function listFunctions(header) {
  const url = `${BASE_URL}/${header}/`;
  let html;
  try { html = await cachedFetch(url); }
  catch { return []; }
  const re = new RegExp(`/api/${header}/nf-${header}-([a-z0-9_]+)`, "gi");
  const slugs = new Set();
  for (const m of html.matchAll(re)) slugs.add(m[1].toLowerCase());
  return [...slugs];
}

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
}

function stripTags(s) {
  return s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
}

function extractPrototype(html) {
  // Syntax block has the prototype; pick the first <pre><code class="lang-cpp"...>
  const match = html.match(
    /<pre[^>]*><code[^>]*class="[^"]*lang-cpp[^"]*"[^>]*>([\s\S]+?)<\/code><\/pre>/i
  ) || html.match(
    /<pre[^>]*><code[^>]*>([\s\S]+?)<\/code><\/pre>/i
  );
  if (!match) return null;
  return decodeEntities(stripTags(match[1])).trim();
}

function cleanPrototype(proto) {
  return proto
    .replace(/^\s*\/\/.*$/gm, "")
    // Modern MS Learn SAL annotations like [in], [out], [in, optional],
    // [in, out], [in, out, optional], [out, optional], [in/out].
    .replace(/\[\s*[a-zA-Z][^\]\n]*\]/g, "")
    // Older SAL underscored form (kept for safety).
    .replace(/_In_[A-Za-z_0-9]*|_Out_[A-Za-z_0-9]*|_Inout_[A-Za-z_0-9]*|_Reserved_|_Notnull_|_Maybenull_|_Outptr_[A-Za-z_0-9]*|_When_\([^)]*\)/g, "")
    .replace(/__in[a-z_]*|__out[a-z_]*|__inout[a-z_]*|__reserved/g, "")
    .replace(/__declspec\([^)]+\)/g, "")
    .replace(/\bWINAPI\b|\bWINBASEAPI\b|\bNTAPI\b|\bNTSYSAPI\b|\bAPIENTRY\b|\bCALLBACK\b|\bWINUSERAPI\b|\bWINADVAPI\b|\bWSAAPI\b|\bSEC_ENTRY\b|\bIMAGEAPI\b/g, "")
    .replace(/\bvolatile\b/g, "")
    .replace(/\bextern\s+"C"\s*\{?/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePrototype(proto) {
  proto = cleanPrototype(proto);
  const headIdx = proto.indexOf("(");
  if (headIdx < 0) return null;
  const closeIdx = matchingClose(proto, headIdx, "(", ")");
  if (closeIdx < 0) return null;
  const head = proto.slice(0, headIdx).trim();
  const inside = proto.slice(headIdx + 1, closeIdx).trim();
  const headParts = head.split(/\s+/);
  if (headParts.length < 2) return null;
  const funcName = headParts.pop();
  if (!/^[A-Za-z_]\w*$/.test(funcName)) return null;
  const returnType = headParts.join(" ").replace(/\*\s*$/, " *").trim() || "void";
  if (!inside || /^(void|VOID)$/.test(inside)) {
    return { funcName, returnType, params: [] };
  }
  const rawParams = splitParams(inside);
  const params = rawParams.map(parseParam).filter(Boolean);
  return { funcName, returnType, params };
}

function matchingClose(s, openIdx, openCh, closeCh) {
  let depth = 1;
  for (let i = openIdx + 1; i < s.length; i++) {
    if (s[i] === openCh) depth++;
    else if (s[i] === closeCh) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function splitParams(list) {
  const parts = [];
  let depth = 0, current = "";
  for (const ch of list) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function parseParam(part) {
  // Handle function-pointer parameters by collapsing to PVOID
  if (/\(\s*\*\s*\w*\s*\)/.test(part)) {
    const nameMatch = part.match(/\(\s*\*\s*(\w+)\s*\)/);
    return { type: "PVOID", name: nameMatch ? nameMatch[1] : "callback" };
  }
  // Strip default-value: " = NULL"
  part = part.replace(/=.+$/, "").trim();
  if (!part) return null;
  // Strip trailing array brackets, keep them on type
  let arr = "";
  const arrMatch = part.match(/(\[\d*\])\s*$/);
  if (arrMatch) {
    arr = arrMatch[1];
    part = part.slice(0, -arrMatch[0].length).trim();
  }
  // Split on last identifier
  const tokens = part.split(/\s+/);
  if (tokens.length === 1) {
    return { type: tokens[0] + arr, name: "arg" };
  }
  let name = tokens.pop();
  // If the last token starts with * the * belongs to type
  const starsMatch = name.match(/^(\*+)(.+)$/);
  if (starsMatch) {
    tokens.push(starsMatch[1]);
    name = starsMatch[2];
  }
  if (!/^[A-Za-z_]\w*$/.test(name)) {
    // Probably no separate name (e.g., "const char *")
    tokens.push(name);
    name = "arg";
  }
  const type = (tokens.join(" ").replace(/\s+\*/g, " *").trim() + arr).trim();
  return { type, name };
}

const HANDLE_TYPES = new Set([
  "HANDLE", "HMODULE", "HINSTANCE", "HKEY", "HWND", "HMENU", "HICON",
  "HFONT", "HDC", "HBITMAP", "HBRUSH", "HRGN", "HPEN", "HCURSOR", "HHOOK",
  "HGLOBAL", "HLOCAL", "HFILE", "HRSRC", "HINTERNET", "SC_HANDLE",
  "SERVICE_STATUS_HANDLE", "HCRYPTPROV", "HCRYPTKEY", "HCRYPTHASH",
  "HCRYPTPROV_LEGACY", "BCRYPT_ALG_HANDLE", "BCRYPT_HASH_HANDLE",
  "BCRYPT_KEY_HANDLE", "BCRYPT_SECRET_HANDLE", "NCRYPT_HANDLE",
  "PTP_POOL", "PTP_WORK", "PTP_TIMER", "PTP_WAIT", "PTP_IO",
  "PTP_CALLBACK_INSTANCE", "PTP_CLEANUP_GROUP", "TP_POOL",
  "DEVICE_NOTIFY_HANDLE", "POWER_REQUEST_TYPE", "HMC", "HWAITCHAIN"
]);

const HANDLE_OUT_TYPES = new Set([
  "PHANDLE", "LPHANDLE", "PHKEY", "PHCRYPTPROV", "PHCRYPTKEY", "PHCRYPTHASH"
]);

const STRING_TYPES = new Set([
  "LPCSTR", "LPCWSTR", "LPCTSTR", "PCSTR", "PCWSTR", "PCTSTR",
  "LPSTR", "LPWSTR", "LPTSTR", "PSTR", "PWSTR", "PTSTR"
]);

const INTEGER_TYPES = new Set([
  "DWORD", "ULONG", "UINT", "INT", "LONG", "WORD", "USHORT", "SHORT",
  "BYTE", "UCHAR", "CHAR", "ULONG64", "DWORD64", "DWORDLONG", "ULONGLONG",
  "LONGLONG", "INT8", "INT16", "INT32", "INT64", "UINT8", "UINT16",
  "UINT32", "UINT64", "BOOLEAN", "WCHAR", "TCHAR", "ATOM", "LANGID",
  "ULONG_PTR", "DWORD_PTR", "LONG_PTR", "INT_PTR", "UINT_PTR",
  "NTSTATUS", "HRESULT", "ACCESS_MASK", "SECURITY_INFORMATION",
  "LCID", "COLORREF"
]);

const SIZE_TYPES = new Set(["SIZE_T", "SSIZE_T"]);

function classifyParam(typeStr, nameStr) {
  let t = typeStr.replace(/\bconst\b/g, "").trim();
  const isPtrSyntax = /\*/.test(t);
  const core = t.replace(/\s*\*+\s*$/g, "").trim();
  const lowerName = nameStr.toLowerCase();

  if (!isPtrSyntax && HANDLE_OUT_TYPES.has(core)) return { kind: "outptr" };
  if (!isPtrSyntax && HANDLE_TYPES.has(core)) return { kind: "handle" };
  if (!isPtrSyntax && /^H[A-Z]\w*$/.test(core)) return { kind: "handle" };
  if (STRING_TYPES.has(core)) {
    return /^(lpsz|psz|lp|p|lpsz|sz)?out/i.test(nameStr) ? { kind: "outptr", nullGood: true } : { kind: "stringptr", nullGood: true };
  }
  if (core === "BOOL") return { kind: "bool" };
  if (!isPtrSyntax && SIZE_TYPES.has(core)) {
    return looksLikeSize(nameStr) ? { kind: "size", zeroGood: true } : { kind: "integer", zeroGood: true };
  }
  if (!isPtrSyntax && INTEGER_TYPES.has(core)) {
    if (looksLikeFlags(nameStr)) return { kind: "flags", zeroGood: true };
    if (looksLikeSize(nameStr)) return { kind: "size", zeroGood: true };
    return { kind: "integer", zeroGood: true };
  }
  // Out-pointer style: name starts with lp/p AND points to a single value
  if (isPtrSyntax || /^(LP|P)[A-Z]/.test(core)) {
    if (looksLikeOut(nameStr, core)) return { kind: "outptr", nullGood: true };
    return { kind: "ptr", nullGood: true };
  }
  // Fallback
  return { kind: "ptr", nullGood: true };
}

function looksLikeFlags(name) {
  return /flags?$|options?$|attributes?$|mask$/i.test(name)
      || /^(dw|w|f|fl)Flags?$/i.test(name)
      || /^(dw|n)?Options?$/i.test(name)
      || /Access(Mask)?$/.test(name)
      || /Disposition$/.test(name);
}

function looksLikeSize(name) {
  return /(Size|Length|Bytes|Count|Chars|Max|Len)$/.test(name)
      || /^cb[A-Z]|^cch[A-Z]|^cw?[A-Z]|^cnt[A-Z]/.test(name)
      || /^n(Size|Count|Bytes|Length|Number)/.test(name)
      || /^dw(Size|Length|Bytes|Count)/.test(name);
}

function looksLikeOut(name, type) {
  // Heuristic: out parameter if type starts with LP/P and points to a struct or
  // integer reference (PDWORD, LPDWORD, PHANDLE etc.)
  if (/^(LP|P)(DWORD|ULONG|WORD|HANDLE|HKEY|BYTE|SIZE_T|BOOL|UINT|INT)$/.test(type)) return true;
  if (/^lp(dw|cb|cch|p)?[A-Z]/.test(name) && /^(LP|P)/.test(type)) {
    return /Return|Out|Result|Buffer|Size|Length|Number|Count|Bytes/.test(name);
  }
  return false;
}

async function pool(items, fn, limit = CONCURRENCY) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (next < items.length) {
        const idx = next++;
        try { results[idx] = await fn(items[idx], idx); }
        catch (err) { results[idx] = { error: err.message }; }
      }
    })
  );
  return results;
}

const existing = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
const baseName = (n) => n.replace(/A\/W$/, "").replace(/[AW]$/, "");
const existingBaseNames = new Set(existing.map((e) => baseName(e.name)));

let added = 0;
let generated = [];

for (const header of HEADERS) {
  const meta = HEADER_META[header] || { module: "kernel32", category: "Misc" };
  process.stdout.write(`# ${header} ... `);
  const slugs = await listFunctions(header);
  if (!slugs.length) { console.log("(no functions)"); continue; }

  // Group A/W variants by base slug
  const groups = new Map();
  for (const slug of slugs) {
    const m = slug.match(/^(.+?)(a|w)$/);
    const base = m ? m[1] : slug;
    const variant = m ? m[2] : "";
    if (!groups.has(base)) groups.set(base, []);
    groups.get(base).push({ slug, variant });
  }

  const protos = await pool([...groups.entries()], async ([base, vars]) => {
    // Prefer W variant for richer types, fall back to A or plain
    const order = ["w", "a", ""];
    let pick = null;
    for (const v of order) {
      const found = vars.find((x) => x.variant === v);
      if (found) { pick = found; break; }
    }
    if (!pick) pick = vars[0];

    const url = `${BASE_URL}/${header}/nf-${header}-${pick.slug}`;
    const html = await cachedFetch(url);
    const proto = extractPrototype(html);
    if (!proto) return null;
    const parsed = parsePrototype(proto);
    if (!parsed) return null;
    return { base, variants: vars.map((v) => v.variant), parsed };
  });

  let headerAdded = 0;
  for (const item of protos) {
    if (!item || item.error || !item.parsed) continue;
    const { parsed, variants } = item;
    if (!parsed.params.length) continue; // skip zero-arg
    let displayName = parsed.funcName;
    const hasA = variants.includes("a");
    const hasW = variants.includes("w");
    if (hasA && hasW) {
      displayName = parsed.funcName.replace(/[AW]$/, "") + "A/W";
    }
    const key = baseName(displayName);
    if (existingBaseNames.has(key)) continue;
    existingBaseNames.add(key);

    const entry = {
      name: displayName,
      module: meta.module,
      category: meta.category,
      signature: parsed.params.map((p) => `${p.type} ${p.name}`),
      params: parsed.params.map((p) => classifyParam(p.type, p.name)),
      system: !!meta.system
    };
    generated.push(entry);
    headerAdded++;
    added++;
  }
  console.log(`${headerAdded} new (of ${groups.size} functions)`);
}

const merged = [...existing, ...generated];
merged.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(CATALOG_PATH, JSON.stringify(merged, null, 2) + "\n");
console.log(`\nTotal: ${merged.length} entries (${added} added, ${existing.length} preserved).`);
