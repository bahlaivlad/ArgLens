// Mark every integer / flags / enum / size parameter whose C type is an
// unsigned Windows type (DWORD, ULONG, UINT, WORD, BYTE, ULONGLONG, etc.)
// with `unsigned: true`. The scoreParam path treats those as follows:
// - value === -1 is substituted to 0xFFFFFFFF (the all-ones sentinel —
//   lets the user type -1 instead of 0xFFFFFFFF/0xFFFFFFFFFFFFFFFF for
//   things like INFINITE/INVALID_HANDLE_VALUE).
// - any other negative value is rejected.
//
// Earlier passes of this script set `nonNegative: true` for the same
// params; that's the stricter rule we want to keep for hand-tuned
// signed-typed params like CreateSemaphore's lInitialCount (LONG).
// This pass migrates the unsigned-typed params from nonNegative ->
// unsigned and leaves signed-typed nonNegative entries alone.

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
let added = 0;
let migrated = 0;
for (const entry of catalog) {
  entry.signature.forEach((sig, i) => {
    const spec = entry.params[i];
    if (!spec) return;
    if (!TARGET_KINDS.has(spec.kind)) return;
    const t = typeOf(sig);
    if (!isUnsigned(t)) return;
    if (spec.unsigned) return;
    // Migrate auto-applied nonNegative (from previous sweep) to unsigned.
    // Manual nonNegative on a signed-typed param is left alone by virtue
    // of the isUnsigned guard above.
    if (spec.nonNegative === true) {
      delete spec.nonNegative;
      migrated += 1;
    } else {
      added += 1;
    }
    spec.unsigned = true;
  });
}
fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");
console.log(`Marked ${added + migrated} params with unsigned: true.`);
console.log(`  - ${migrated} migrated from nonNegative.`);
console.log(`  - ${added} freshly added.`);
