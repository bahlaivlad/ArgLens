# ArgLens

> Identify Windows API calls from the argument values you see in a disassembler.

ArgLens is a static, no-build webapp aimed at reverse engineers and malware analysts.
You give it a list of argument values — pulled from an IDA listing, a debugger,
or by hand — and it ranks the WinAPI / Nt / Zw functions whose signatures fit
those values the best.

**Live demo:** https://bahlaivlad.github.io/ArgLens/

```
.text:0040146D    push    40h               ; PAGE_EXECUTE_READWRITE
.text:0040146F    push    3000h             ; MEM_COMMIT | MEM_RESERVE
.text:00401474    push    15400h            ; 86528 bytes
.text:00401479    push    0
.text:0040147B    call    [ebp+var_4C]
```
→ Top match: **VirtualAlloc** (100%).

---

## Features

- **Manual entry** — set the argument count and type each value (hex `40h`,
  `0x3000`, decimal, `NULL`, or `?` for unknown).
- **Paste disassembly** — drop an x86 `push` sequence or x64 register setup
  (`mov rcx, ...; mov rdx, ...; mov r8, ...`) and ArgLens reverses the call
  order, recovers per-argument register storage, and fills the values in.
- **Dark-mode syntax-highlighted editor** for the pasted disassembly.
- **1500+ entries** covering memory, file, process/thread, loader, registry,
  service, security, synchronization, network (Winsock + WinINet), crypto
  (CryptoAPI + BCrypt), and a 79-entry Nt/Zw native-API set.
- **IDA-compatible function-pointer prototypes**, including `__userpurge`
  register-storage annotations when paste-mode reveals where each argument
  was loaded from.
- **MSDN deep links** straight to the Microsoft Learn page.
- **Shareable URLs** — your current arguments (or pasted disassembly) live
  in the page hash; copy the address to share or bookmark.
- **Per-argument evidence**, decoded flag bits, and a normalized match
  percentage that treats unknown arguments as neutral.

## How the scoring works

Each catalog entry declares the *kind* of value each parameter accepts —
`handle`, `flags`, `size`, `stringptr`, `bool`, `enum`, and so on. Given the
arguments you provide, ArgLens does two things per entry:

1. **Compatibility check.** If even one argument breaks the parameter's
   constraints (a negative immediate where a pointer is expected, an
   unknown flag bit set, etc.), the entry is dropped from the results.
2. **Score / max-score**. Compatible entries earn points from each known
   argument's shape (pointer-like, NULL accepted, exact constant match,
   etc.). The percentage shown is `score / max-possible-score`, where the
   max only counts arguments you actually provided. **Unknown arguments
   are neutral** — they neither lift nor lower the percentage.

Confidence labels: **Strong** ≥ 85%, **Possible** ≥ 60%, **Loose** below.

## Repository layout

```
ArgLens/
├── index.html              static page
├── styles.css              all styling
├── app.js                  scoring engine, syntax highlighter, URL state
├── catalog.json            ~1500 API entries (the source of truth)
├── favicon.svg             magnifier-over-arguments emblem
├── tools/
│   ├── extract-catalog.mjs  one-shot used to seed catalog.json from the
│   │                        original inline catalog
│   ├── build-catalog.mjs    fetches every _base header from MS Learn,
│   │                        parses each function's prototype, classifies
│   │                        each parameter, merges into catalog.json
│   └── add-nt-apis.mjs      adds curated common Nt* APIs and mirrors
│                            every Nt* entry as a Zw* alias
└── docs/
    └── CATALOG.md           catalog schema, parameter kinds, scoring weights
```

## Local development

ArgLens fetches `catalog.json` at startup, so opening `index.html` directly
via `file://` won't work (the browser blocks `fetch` of local files). Any
static server will do:

```sh
python3 -m http.server 8765
# then open http://127.0.0.1:8765/
```

Or, with Node:

```sh
npx --yes serve .
```

There is no build step — edit, refresh, done.

## Extending the catalog

The fastest path is to edit `catalog.json` directly; entries are plain
JSON objects, see **[docs/CATALOG.md](docs/CATALOG.md)** for the schema
and the per-parameter kind reference.

To regenerate the auto-discovered parts of the catalog from Microsoft
Learn (preserving every entry that has `"manual": true`):

```sh
node tools/build-catalog.mjs
```

To mirror new `Nt*` entries as `Zw*` aliases, or to add the bundled
curated list of injection-related Nt APIs:

```sh
node tools/add-nt-apis.mjs
```

Both scripts are idempotent — re-running won't duplicate entries.

## Deployment

GitHub Pages, root of the repo. The site is fully static — no build, no
server-side code, no dependencies fetched at runtime besides the local
`catalog.json`.

## Credits

Built for [@bahlaivlad](https://github.com/bahlaivlad) — feedback and PRs
welcome.
