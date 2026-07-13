# falcon-single-uploader — GAPS & UPGRADES

## RESOLVED since prior dossier (2026-06-03 — B19)

### ~~PrimeIcons residuals~~ — RESOLVED / was never accurate (was P0)

`[CODE]` **The prior dossier's P0 "PrimeIcons residuals" gap is STALE.** The live source uses the **vendored Falcon icon font**, not PrimeIcons:
- Empty dropzone glyph: `<i class="falcon-icon falcon-icon-cloud-upload" />` (.tsx:235, -tw.tsx:242).
- Edit button glyph: `<i class="falcon-icon falcon-icon-pencil" />` (.tsx:313, -tw.tsx:321).
- File-type fallback icons: `fileTypeIconClass()` returns `falcon-icon falcon-icon-*` classes (utils.ts:26-37).

There are **NO `pi pi-*` classes** anywhere in this component. Removed from the gap list.

## Missing capabilities (active source verified)

### G1 — `-tw` empty dropzone is `tabindex={-1}` (Shadow is `0`) — keyboard a11y divergence (P1, a11y)

`[CODE]` Shadow dropzone: `tabIndex={this.disabled ? -1 : 0}` (.tsx:222) → keyboard-focusable. **`-tw` dropzone hardcodes `tabindex={-1}`** (-tw.tsx:229) → NOT keyboard-reachable. Since `useTailwind=true` is the default, the default render path's dropzone cannot be focused/activated by keyboard; a keyboard user reaches the picker only via the focusable hidden native input. This is a Shadow↔`-tw` parity break.

**Recommended fix (P1):** make `-tw` match Shadow (`tabindex={disabled ? -1 : 0}`) so the dropzone is keyboard-operable in both paths. `HIGH-RISK-QUEUE` (a11y semantics / behavior change).

### G2 — Wrapper `<ng-content>` is a no-op (no `<slot>` in the Stencil templates) (P2)

`[CODE]` Both wrapper render branches project `<ng-content />` into the Stencil tag (html:27 / html:52), but neither `<falcon-single-uploader>` nor `<falcon-single-uploader-tw>` renders a `<slot>` element — so any projected content has no placement and is dropped. Either remove the misleading `<ng-content>` or add a `<slot>` (e.g. for a custom action overlay).

**Recommended fix (P2):** decide a slot contract (e.g. `slot="actions"`) and render it, OR drop the `<ng-content>`. `safe-local`.

### G3 — Edit button reopens picker — no consumer hook (P1)

`[CODE]` handleEdit always emits `falcon-edit` AND immediately calls `this.nativeInput?.click()` (.tsx:198-203). The consumer cannot intercept (e.g. to show "replace this file?" before the picker opens).

**Recommended fix:** `editOpensPicker?: boolean` (default `true`) OR `(beforeEdit)` with `preventDefault()`.

### G4 — No "replace" overlay on filled-state drag-over (P1)

`[CODE]` Drag-over on a filled tile only toggles a subtle `drag-over` class (.tsx:251-256); the user may not realize dropping replaces the file. Render a translucent "Replace file" + swap-icon overlay on filled drag-over.

### G5 — No filename/size alongside the thumbnail (P1)

`[CODE]` In `previewMode='thumbnail'` the name/size are hidden (only `compact` shows the `fsu-compact-body`). Add `showFileMeta?: boolean` to overlay name+size on the thumbnail tile.

### G6 — `compact` body always in the DOM (P2)

`[CODE]` The compact body block is always rendered; the `-tw` helper just returns `'hidden'` for it in non-compact modes (single-uploader-tailwind-classes.ts:260) and the Shadow CSS hides it. Conditionally render it only when `previewMode==='compact'` to trim DOM. `safe-local`.

### G7 — No `<img onError>` fallback for broken `file.url` (P2)

`[CODE]` `<img src={file.url}>` (.tsx:270, -tw.tsx:274-279) has no error handler; a broken URL shows the browser broken-image glyph. Add `onError` → swap to `fileTypeIconClass(file)`.

### G8 — No retry on error status (P2)

`[CODE]` When `file.status==='error'` the only action is delete; no retry. Add a retry button + `(fileRetry)` output (the `file-uploader-shared` family has retry).

### G9 — Angular wrapper does not proxy Stencil methods (P2)

`[CODE]` `openFileDialog()` / `setFocus()` / `setFile()` are `@Method`s on both Stencil tags but the wrapper exposes none. Consumers must reach `ViewChild.nativeElement` (the wrapper, not the inner tag). Add Angular-side proxies.

### G10 — `-tw` compact-mode hardcoded arbitrary values (P3, token-discipline)

`[CODE]` single-uploader-tailwind-classes.ts uses literals not backed by tokens in compact mode: `gap-[12px]`/`py-[10px]`/`px-[12px]` (line 165), `rounded-[8px]`+`text-[length:24px]` (199/239), `text-[length:13px]`/`text-[length:11px]` (268/275). Mint `--falcon-single-uploader-compact-*` tokens. `safe-local`.

### G11 — Wrapper uses legacy `@Input/@Output`, not signal inputs (P3)

`[CODE]` ts:54-75 — decorators + internal signals, not `input()/output()`. The sibling document-uploader wrapper is already signal-based. Cosmetic/consistency; migrate when convenient. `safe-local`.

## Missing accessibility features

- **A1 (P1):** the `-tw` dropzone keyboard divergence (G1).
- **A2 (P2):** filled tile has no role (empty has `role="button"`); AT users may not realize the filled area is interactive. The action buttons do carry `aria-label`.
- **A3 (P2):** no `aria-describedby` linking helper/error text to the dropzone/input.

## Missing tests

- `[CODE]` **No `.spec.ts` / `.e2e.ts` exists** for this component (verified 2026-06-03 — none in the wrapper folder, the Shadow folder, or the `-tw` folder). (Correction vs prior "None observed.") GAP: add a Stencil spec (empty↔filled, drag-replace, status→progress, delete revoke, a11y) + an Angular wrapper spec (CVA writeValue / disabled / `falcon-blur`→touched / the 5 outputs).

## Missing Tailwind / token parity

- `[CODE]` The `-tw` helper mirrors the Shadow `--falcon-single-uploader-*` tokens for the main path (SSOT verified). The only gap is the compact-mode literals (G10). Both paths share the `:where()` token block → Studio runtime mutation hits both. **Parity OK except compact literals.**

## Performance risks

- `[CODE]` One `URL.createObjectURL(blob)` per image pick, revoked on delete (.tsx:121/190-192). Negligible. `OnPush` + signals.

## Visual / interaction risks

- The edit button reopens the native picker — a user may expect an in-place editor (crop). Doc note.
- The `-tw` keyboard divergence (G1) is the main interaction risk.

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G1 | `-tw` dropzone keyboard parity (`tabindex`) | P1 | HIGH-RISK-QUEUE (a11y) |
| G3 | edit-picker hook (`editOpensPicker`/`beforeEdit`) | P1 | safe-local |
| G5 | `showFileMeta` overlay | P1 | safe-local |
| G4 | filled drag-over "Replace file" overlay | P1 | safe-local |
| G8 | retry + `(fileRetry)` | P2 | safe-local |
| G9 | proxy `setFocus`/`clear`/`openFileDialog` | P2 | safe-local |
| G2 | resolve no-op `<ng-content>` | P2 | safe-local |
| G6 | conditional compact body | P2 | safe-local |
| G7 | `<img onError>` fallback | P2 | safe-local |
| G10 | compact-mode tokens | P3 | safe-local |

## Fix-shared-vs-per-page

All gaps belong in the shared component.

## Workarounds (if upgrade blocked)

- For G1 today: keyboard users reach the picker via the focusable hidden native input (the dropzone div is just not focusable in the `-tw` path).
- For G3: wrap the component + listen to `(fileEdit)`, handle the replace before the picker reopens.
- For G7: HEAD-check the URL before setting `file.url`.

## Deep-Dive Sweep Findings (2026-06-03 — B19)

**Consumer count: 0 production-feature files** (showcase/registry/safelist only). The component is feature-complete but un-adopted; production uploads use the `file-uploader-shared` family.

- **PrimeIcons P0 RESOLVED/stale** — icons are the Falcon icon font.
- **New gaps surfaced:** G1 (`-tw` keyboard `tabindex` divergence, `HIGH-RISK-QUEUE`), G2 (no-op `<ng-content>`), no spec exists. `(fileError)` IS wired (corrected in API).
- **No deletion/promotion flag** — the component stays ACTIVE/PREFERRED for single-file tile flows (but note its non-adoption + the overlapping `file-uploader-shared` family — see DECISION for the "which uploader" guidance). See `FINDINGS/B19.md`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19) against all source layers (wrapper 154 ln, Shadow 363 ln, `-tw` 371 ln, tailwind 369 ln, tokens 199 ln). PrimeIcons gap retired (Falcon icon font confirmed). G1 `-tw` `tabindex={-1}` vs Shadow `0` confirmed. No spec on disk confirmed. No deletion/promotion flag.
