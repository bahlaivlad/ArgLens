# ArgLens

ArgLens is a static GitHub Pages tool for malware analysts who need to identify likely WinAPI or Nt/Zw API calls from observed argument values.

It accepts an x86 push sequence or manually entered arguments, normalizes the call order, and ranks candidate APIs by:

- argument count
- known constants and flag masks
- NULL and pointer-shaped values
- common malware-facing WinAPI and native API signatures

## Publish on GitHub Pages

This repository has no build step. Push `index.html`, `styles.css`, and `app.js`, then enable GitHub Pages for the repository root.

## Current catalog

The initial catalog includes memory, file, process, thread, loader, registry, service, security, sync, and network APIs, including a native `ntdll` subset such as `NtCreateFile`, `NtAllocateVirtualMemory`, `NtProtectVirtualMemory`, and `NtCreateThreadEx`.
