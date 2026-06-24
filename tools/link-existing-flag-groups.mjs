// Link auto-generated flag/enum params to existing FLAG_DEFS groups by
// matching param-name + function-category. Doesn't fetch anything — uses
// the in-app FLAG_DEFS as the source of truth.
//
// Run after extract-flag-constants.mjs to backfill the per-function groups
// that the scraper couldn't find inline on MS Learn.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATALOG_PATH = path.join(ROOT, "catalog.json");

// Rules: { paramName regex, optional category set, group, exactGoodValues }
// First matching rule wins. paramName regex is anchored — full match against
// the lowercased name (e.g. "dwDesiredAccess" -> "dwdesiredaccess").
const RULES = [
  // Memory
  { name: /^(fl|dw)allocationtype$/, group: "allocationType", exactGood: [0x1000, 0x2000, 0x3000, 0x4000, 0x8000] },
  { name: /^(fl|dw)?(new)?protect$/, group: "pageProtect", exactGood: [0x04, 0x20, 0x40] },
  { name: /^flprotect$/,            group: "pageProtect", exactGood: [0x04, 0x20, 0x40] },
  { name: /^dwfreetype$/,           group: "allocationType", exactGood: [0x4000, 0x8000] },

  // File I/O
  { name: /^dwsharemode$/,          group: "fileShare" },
  { name: /^dwcreationdisposition$/, group: "creationDisposition", exactGood: [3, 2, 1, 4, 5] },
  { name: /^dwflagsandattributes$/, group: "fileAttributes", exactGood: [0x80] },
  { name: /^dwfileattributes$/,     group: "fileAttributes", exactGood: [0x80] },
  { name: /^dwmovemethod$/,         group: "moveMethod" },

  // Access masks — context-dependent on the function category.
  // The first match wins, so order matters.
  { name: /^dwdesiredaccess$/, category: /^Files$/,    group: "fileAccess" },
  { name: /^dwdesiredaccess$/, category: /^Process$/,  group: "processAccess", exactGood: [0x1f0fff] },
  { name: /^dwdesiredaccess$/, category: /^Threads$/,  group: "threadAccess",  exactGood: [0x1f03ff] },
  { name: /^samdesired$/,      category: /^Registry$/, group: "registryAccess" },
  { name: /^desiredaccess$/,   category: /^Registry$/, group: "registryAccess" },
  { name: /^desiredaccess$/,   category: /^Process$/,  group: "processAccess" },
  { name: /^desiredaccess$/,   category: /^Threads$/,  group: "threadAccess" },
  { name: /^desiredaccess$/,   category: /^Files$/,    group: "fileAccess" },
  { name: /^accessmask$/,      category: /^Process$/,  group: "processAccess" },
  { name: /^accessmask$/,      category: /^Threads$/,  group: "threadAccess" },
  { name: /^processdesiredaccess$/, group: "processAccess" },
  { name: /^threaddesiredaccess$/,  group: "threadAccess" },
  { name: /^dwdesiredaccess$/, category: /^Sync$/,     group: "eventAccess" }, // wildcard sync default; better fits handled below
  { name: /^dwdesiredaccess$/, group: "tokenAccess" }, // fallback for Security

  // Section / mapping access
  { name: /^sectionpageprotection$/, group: "pageProtect" },
  { name: /^win32protect$/,          group: "pageProtect" },

  // Loader
  { name: /^dwflags$/, category: /^Loader$/, group: "loadLibraryFlags" },

  // Wait
  { name: /^dwmilliseconds$/, group: "wait", exactGood: [0xffffffff] },
  { name: /^timeout$/,        group: "wait", exactGood: [0xffffffff] },

  // ShellExecute / WinExec show cmd
  { name: /^nshowcmd$/, group: "showWindow" },
  { name: /^ucmdshow$/, group: "showWindow" },

  // Registry value type
  { name: /^dwtype$/, category: /^Registry$/, group: "registryType" },
  { name: /^type$/,   category: /^Registry$/, group: "registryType" },

  // Token access
  { name: /^tokenaccess$/, group: "tokenAccess" },

  // SCM / Service
  { name: /^scmaccess$/, group: "scmAccess" },

  // Winsock
  { name: /^af$/,       group: "socketAf" },
  { name: /^type$/,     category: /^Network$/, group: "socketType" },
  { name: /^protocol$/, group: "socketProtocol" },

  // NT
  { name: /^createdisposition$/, group: "ntCreateDisposition" },
  { name: /^createoptions$/,     group: "ntCreateOptions" },
  { name: /^openoptions$/,       group: "ntCreateOptions" },
  { name: /^allocationtype$/, category: /^Memory$/, group: "allocationType", exactGood: [0x1000, 0x2000, 0x3000] },
  { name: /^freetype$/,        category: /^Memory$/, group: "allocationType", exactGood: [0x4000, 0x8000] },
  { name: /^pageprotect$/,     group: "pageProtect" },
  { name: /^newprotect$/,      group: "pageProtect" }
];

// Better default for Sync APIs: pick the access group from the function name.
const SYNC_ACCESS_GROUP = (entryName) => {
  if (/Event/.test(entryName)) return "eventAccess";
  if (/Mutex|Mutant/.test(entryName)) return "mutexAccess";
  if (/Semaphore/.test(entryName)) return "semaphoreAccess";
  if (/WaitableTimer/.test(entryName)) return "timerAccess";
  return null;
};

const ACCESS_MASK_NAMES = /^(dwdesiredaccess|desiredaccess|accessmask|samdesired)$/;

function paramNameFromSig(sig) {
  const m = sig.match(/(\w+)\s*$/);
  return m ? m[1] : "";
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));

let linked = 0;
for (const entry of catalog) {
  for (let i = 0; i < entry.params.length; i++) {
    const spec = entry.params[i];
    if (!spec) continue;
    if (!["flags", "enum"].includes(spec.kind)) continue;
    if (spec.flags) continue; // already mapped

    const sig = entry.signature[i] || "";
    const paramName = paramNameFromSig(sig).toLowerCase();
    if (!paramName) continue;

    // Access-mask disambiguation by function name + category
    if (ACCESS_MASK_NAMES.test(paramName)) {
      let g = null;
      if (entry.category === "Sync") g = SYNC_ACCESS_GROUP(entry.name);
      else if (entry.category === "Process") g = "processAccess";
      else if (entry.category === "Threads") g = "threadAccess";
      else if (entry.category === "Files") g = "fileAccess";
      else if (entry.category === "Registry") g = "registryAccess";
      else if (entry.category === "Services") g = "serviceAccess";
      else if (entry.category === "Security") g = "tokenAccess";
      // Native (Nt/Zw): pick by function name
      else if (/Process/.test(entry.name)) g = "processAccess";
      else if (/Thread/.test(entry.name)) g = "threadAccess";
      else if (/File/.test(entry.name)) g = "fileAccess";
      else if (/Key/.test(entry.name)) g = "registryAccess";
      else if (/Section/.test(entry.name)) g = "sectionAccess";
      else if (/Token/.test(entry.name)) g = "tokenAccess";
      else if (/Event/.test(entry.name)) g = "eventAccess";
      else if (/Mutex|Mutant/.test(entry.name)) g = "mutexAccess";
      else if (/Semaphore/.test(entry.name)) g = "semaphoreAccess";
      else if (/WaitableTimer/.test(entry.name)) g = "timerAccess";
      else if (/DirectoryObject/.test(entry.name)) g = "directoryAccess";
      else if (/SymbolicLink/.test(entry.name)) g = "symbolicLinkAccess";

      if (g) {
        spec.flags = g;
        const exactByGroup = {
          eventAccess: [0x001f0003], mutexAccess: [0x001f0001], semaphoreAccess: [0x001f0003],
          processAccess: [0x1f0fff], threadAccess: [0x1f03ff]
        };
        if (exactByGroup[g]) spec.exactGood = exactByGroup[g];
        linked++;
        continue;
      }
    }

    for (const rule of RULES) {
      if (!rule.name.test(paramName)) continue;
      if (rule.category && !rule.category.test(entry.category)) continue;
      spec.flags = rule.group;
      if (rule.exactGood) spec.exactGood = rule.exactGood;
      linked++;
      break;
    }
  }
}

fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");
console.log(`Linked ${linked} params to existing FLAG_DEFS groups.`);
