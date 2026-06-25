// Mark every integer / flags / enum / size parameter whose C type is an
// unsigned Windows type (DWORD, ULONG, UINT, WORD, BYTE, ULONGLONG, etc.)
// with `nonNegative: true`. By C semantics those values cannot hold a
// negative number, so a user typing `-1` for them is always a mistake
// (and would be silently reinterpreted as 0xFFFFFFFF). The existing
// scoreParam rejection on nonNegative will then filter those candidates
// out.
//
// Skips kinds that already reject negatives by other means (handle, ptr,
// stringptr, codeptr, outptr, bool). Skips params that already carry
// `nonNegative: true`.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATALOG_PATH = path.join(ROOT, "catalog.json");

const UNSIGNED_TYPES = new Set([
  "DWORD", "DWORD64", "DWORDLONG",
  "ULONG", "ULONG64", "ULONGLONG", "ULONG_PTR",
  "UINT", "UINT8", "UINT16", "UINT32", "UINT64", "UINT_PTR",
  "WORD", "USHORT",
  "BYTE", "UCHAR",
  "DWORD_PTR",
  "BOOLEAN",
  "SIZE_T",
  "ACCESS_MASK", "REGSAM",
  "LANGID", "ATOM", "LCID", "COLORREF",
  "HANDLE", // pointer-like; handled by kind: "handle" but listed for safety
]);

const TARGET_KINDS = new Set(["integer", "flags", "enum", "size"]);

function typeOf(sig) {
  // strip const / * / leading SAL etc. and grab the first type token
  const cleaned = sig
    .replace(/\bconst\b/g, "")
    .replace(/\*+\s*/g, "")
    .trim();
  // type is everything up to the last whitespace before the param name
  const m = cleaned.match(/^(.+?)\s+\w+(?:\[\d*\])?$/);
  if (!m) return cleaned;
  // Take the last token of the type expression (handles "unsigned int x")
  const tokens = m[1].trim().split(/\s+/);
  return tokens[tokens.length - 1];
}

function isUnsigned(typeStr) {
  if (!typeStr) return false;
  return UNSIGNED_TYPES.has(typeStr);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
let touched = 0;
for (const entry of catalog) {
  entry.signature.forEach((sig, i) => {
    const spec = entry.params[i];
    if (!spec) return;
    if (!TARGET_KINDS.has(spec.kind)) return;
    if (spec.nonNegative) return;
    const t = typeOf(sig);
    if (!isUnsigned(t)) return;
    spec.nonNegative = true;
    touched += 1;
  });
}
fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");
console.log(`Marked ${touched} params as nonNegative based on unsigned C type.`);
