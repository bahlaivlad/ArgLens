// Add commonly-used Nt* APIs that aren't in the catalog yet, then mirror
// every Nt* entry as a Zw* alias (identical signature, different name).
// Idempotent — re-running won't create duplicates.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CATALOG_PATH = path.join(ROOT, "catalog.json");

const p = (kind, opts = {}) => ({ kind, ...opts });
const nt = (name, category, signature, params) => ({
  name,
  module: "ntdll",
  category,
  signature,
  params,
  system: true
});

// Curated list of common Nt APIs not yet in the catalog. Targets
// malware-relevant calls — process injection, anti-debug, registry,
// file I/O, object directories, drivers, ALPC.
const EXTRA_NT = [
  nt("NtTerminateThread", "Threads", ["HANDLE ThreadHandle", "NTSTATUS ExitStatus"], [
    p("handle", { nullGood: true }), p("integer", { zeroGood: true })
  ]),
  nt("NtCreateUserProcess", "Process", [
    "PHANDLE ProcessHandle", "PHANDLE ThreadHandle",
    "ACCESS_MASK ProcessDesiredAccess", "ACCESS_MASK ThreadDesiredAccess",
    "POBJECT_ATTRIBUTES ProcessObjectAttributes", "POBJECT_ATTRIBUTES ThreadObjectAttributes",
    "ULONG ProcessFlags", "ULONG ThreadFlags",
    "PRTL_USER_PROCESS_PARAMETERS ProcessParameters",
    "PPS_CREATE_INFO CreateInfo", "PPS_ATTRIBUTE_LIST AttributeList"
  ], [
    p("outptr"), p("outptr"),
    p("flags", { flags: "processAccess" }), p("flags", { flags: "threadAccess" }),
    p("ptr", { nullGood: true }), p("ptr", { nullGood: true }),
    p("flags", { zeroGood: true }), p("flags", { zeroGood: true }),
    p("ptr"), p("ptr"), p("ptr", { nullGood: true })
  ]),
  nt("NtCreateThread", "Threads", [
    "PHANDLE ThreadHandle", "ACCESS_MASK DesiredAccess",
    "POBJECT_ATTRIBUTES ObjectAttributes", "HANDLE ProcessHandle",
    "PCLIENT_ID ClientId", "PCONTEXT ThreadContext",
    "PINITIAL_TEB InitialTeb", "BOOLEAN CreateSuspended"
  ], [
    p("outptr"), p("flags", { flags: "threadAccess" }),
    p("ptr", { nullGood: true }), p("handle"),
    p("outptr"), p("ptr"),
    p("ptr"), p("bool")
  ]),
  nt("NtSetInformationThread", "Threads", [
    "HANDLE ThreadHandle", "THREADINFOCLASS ThreadInformationClass",
    "PVOID ThreadInformation", "ULONG ThreadInformationLength"
  ], [
    p("handle"), p("enum"), p("ptr"), p("size")
  ]),
  nt("NtQueryInformationThread", "Threads", [
    "HANDLE ThreadHandle", "THREADINFOCLASS ThreadInformationClass",
    "PVOID ThreadInformation", "ULONG ThreadInformationLength",
    "PULONG ReturnLength"
  ], [
    p("handle"), p("enum"), p("outptr"),
    p("size"), p("outptr", { nullGood: true })
  ]),
  nt("NtCreateSymbolicLinkObject", "System", [
    "PHANDLE LinkHandle", "ACCESS_MASK DesiredAccess",
    "POBJECT_ATTRIBUTES ObjectAttributes", "PUNICODE_STRING LinkTarget"
  ], [
    p("outptr"), p("flags"), p("ptr"), p("ptr")
  ]),
  nt("NtOpenSymbolicLinkObject", "System", [
    "PHANDLE LinkHandle", "ACCESS_MASK DesiredAccess",
    "POBJECT_ATTRIBUTES ObjectAttributes"
  ], [
    p("outptr"), p("flags"), p("ptr")
  ]),
  nt("NtQuerySymbolicLinkObject", "System", [
    "HANDLE LinkHandle", "PUNICODE_STRING LinkTarget", "PULONG ReturnedLength"
  ], [
    p("handle"), p("outptr"), p("outptr", { nullGood: true })
  ]),
  nt("NtCreateDirectoryObject", "System", [
    "PHANDLE DirectoryHandle", "ACCESS_MASK DesiredAccess",
    "POBJECT_ATTRIBUTES ObjectAttributes"
  ], [
    p("outptr"), p("flags"), p("ptr")
  ]),
  nt("NtOpenDirectoryObject", "System", [
    "PHANDLE DirectoryHandle", "ACCESS_MASK DesiredAccess",
    "POBJECT_ATTRIBUTES ObjectAttributes"
  ], [
    p("outptr"), p("flags"), p("ptr")
  ]),
  nt("NtLoadDriver", "System", ["PUNICODE_STRING DriverServiceName"], [
    p("ptr")
  ]),
  nt("NtUnloadDriver", "System", ["PUNICODE_STRING DriverServiceName"], [
    p("ptr")
  ]),
  nt("NtFsControlFile", "Files", [
    "HANDLE FileHandle", "HANDLE Event",
    "PIO_APC_ROUTINE ApcRoutine", "PVOID ApcContext",
    "PIO_STATUS_BLOCK IoStatusBlock", "ULONG FsControlCode",
    "PVOID InputBuffer", "ULONG InputBufferLength",
    "PVOID OutputBuffer", "ULONG OutputBufferLength"
  ], [
    p("handle"), p("handle", { nullGood: true }),
    p("codeptr", { nullGood: true }), p("ptr", { nullGood: true }),
    p("outptr"), p("integer"),
    p("ptr", { nullGood: true }), p("size", { zeroGood: true }),
    p("outptr", { nullGood: true }), p("size", { zeroGood: true })
  ]),
  nt("NtRaiseHardError", "System", [
    "NTSTATUS ErrorStatus", "ULONG NumberOfParameters",
    "ULONG UnicodeStringParameterMask", "PULONG_PTR Parameters",
    "ULONG ValidResponseOptions", "PULONG Response"
  ], [
    p("integer"), p("integer", { zeroGood: true }),
    p("flags", { zeroGood: true }), p("ptr", { nullGood: true }),
    p("flags"), p("outptr")
  ]),
  nt("NtShutdownSystem", "System", ["SHUTDOWN_ACTION Action"], [
    p("enum")
  ]),
  nt("NtSystemDebugControl", "Debug", [
    "SYSDBG_COMMAND Command", "PVOID InputBuffer", "ULONG InputBufferLength",
    "PVOID OutputBuffer", "ULONG OutputBufferLength", "PULONG ReturnLength"
  ], [
    p("enum"), p("ptr", { nullGood: true }), p("size", { zeroGood: true }),
    p("outptr", { nullGood: true }), p("size", { zeroGood: true }),
    p("outptr", { nullGood: true })
  ]),
  nt("NtCreateNamedPipeFile", "Files", [
    "PHANDLE FileHandle", "ULONG DesiredAccess",
    "POBJECT_ATTRIBUTES ObjectAttributes", "PIO_STATUS_BLOCK IoStatusBlock",
    "ULONG ShareAccess", "ULONG CreateDisposition", "ULONG CreateOptions",
    "ULONG NamedPipeType", "ULONG ReadMode", "ULONG CompletionMode",
    "ULONG MaximumInstances", "ULONG InboundQuota", "ULONG OutboundQuota",
    "PLARGE_INTEGER DefaultTimeout"
  ], [
    p("outptr"), p("flags", { flags: "fileAccess" }),
    p("ptr"), p("outptr"),
    p("flags", { flags: "fileShare" }), p("enum", { flags: "ntCreateDisposition" }),
    p("flags", { flags: "ntCreateOptions" }),
    p("flags"), p("flags"), p("flags"),
    p("integer"), p("size", { zeroGood: true }), p("size", { zeroGood: true }),
    p("ptr", { nullGood: true })
  ]),
  nt("NtAlpcCreatePort", "Sync", [
    "PHANDLE PortHandle", "POBJECT_ATTRIBUTES ObjectAttributes",
    "PALPC_PORT_ATTRIBUTES PortAttributes"
  ], [
    p("outptr"), p("ptr", { nullGood: true }), p("ptr", { nullGood: true })
  ]),
  nt("NtAlpcConnectPort", "Sync", [
    "PHANDLE PortHandle", "PUNICODE_STRING PortName",
    "POBJECT_ATTRIBUTES ObjectAttributes",
    "PALPC_PORT_ATTRIBUTES PortAttributes", "ULONG Flags",
    "PSID RequiredServerSid", "PPORT_MESSAGE ConnectionMessage",
    "PULONG BufferLength", "PALPC_MESSAGE_ATTRIBUTES OutMessageAttributes",
    "PALPC_MESSAGE_ATTRIBUTES InMessageAttributes",
    "PLARGE_INTEGER Timeout"
  ], [
    p("outptr"), p("ptr"),
    p("ptr", { nullGood: true }),
    p("ptr", { nullGood: true }), p("flags", { zeroGood: true }),
    p("ptr", { nullGood: true }), p("ptr", { nullGood: true }),
    p("outptr", { nullGood: true }),
    p("ptr", { nullGood: true }), p("ptr", { nullGood: true }),
    p("ptr", { nullGood: true })
  ]),
  nt("NtAlpcSendWaitReceivePort", "Sync", [
    "HANDLE PortHandle", "ULONG Flags", "PPORT_MESSAGE SendMessage",
    "PALPC_MESSAGE_ATTRIBUTES SendMessageAttributes",
    "PPORT_MESSAGE ReceiveMessage",
    "PSIZE_T BufferLength",
    "PALPC_MESSAGE_ATTRIBUTES ReceiveMessageAttributes",
    "PLARGE_INTEGER Timeout"
  ], [
    p("handle"), p("flags", { zeroGood: true }),
    p("ptr", { nullGood: true }),
    p("ptr", { nullGood: true }),
    p("outptr", { nullGood: true }),
    p("outptr", { nullGood: true }),
    p("ptr", { nullGood: true }),
    p("ptr", { nullGood: true })
  ]),
  nt("NtQueueApcThreadEx", "Threads", [
    "HANDLE ThreadHandle", "HANDLE UserApcReserveHandle",
    "PPS_APC_ROUTINE ApcRoutine",
    "PVOID ApcArgument1", "PVOID ApcArgument2", "PVOID ApcArgument3"
  ], [
    p("handle"), p("handle", { nullGood: true }),
    p("codeptr"),
    p("ptr", { nullGood: true }), p("ptr", { nullGood: true }),
    p("ptr", { nullGood: true })
  ]),
  nt("NtCreateLowBoxToken", "Security", [
    "PHANDLE TokenHandle", "HANDLE ExistingTokenHandle",
    "ACCESS_MASK DesiredAccess", "POBJECT_ATTRIBUTES ObjectAttributes",
    "PSID PackageSid", "ULONG CapabilityCount",
    "PSID_AND_ATTRIBUTES Capabilities", "ULONG HandleCount",
    "PHANDLE Handles"
  ], [
    p("outptr"), p("handle"),
    p("flags", { flags: "tokenAccess" }), p("ptr", { nullGood: true }),
    p("ptr"), p("integer", { zeroGood: true }),
    p("ptr", { nullGood: true }), p("integer", { zeroGood: true }),
    p("ptr", { nullGood: true })
  ])
];

const cat = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
const existingNames = new Set(cat.map((e) => e.name));

let addedNt = 0;
for (const entry of EXTRA_NT) {
  if (existingNames.has(entry.name)) continue;
  cat.push(entry);
  existingNames.add(entry.name);
  addedNt++;
}

let addedZw = 0;
const ntEntries = cat.filter((e) => e.name.startsWith("Nt"));
for (const ntEntry of ntEntries) {
  const zwName = "Zw" + ntEntry.name.slice(2);
  if (existingNames.has(zwName)) continue;
  cat.push({ ...ntEntry, name: zwName });
  existingNames.add(zwName);
  addedZw++;
}

cat.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(CATALOG_PATH, JSON.stringify(cat, null, 2) + "\n");
console.log(`Added ${addedNt} Nt entries and ${addedZw} Zw aliases. Total now: ${cat.length}.`);
