# falcon-image-uploader — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — Angular wrapper does not proxy the Stencil methods (P2)

`[CODE]` Both Stencil tags expose `@Method() setFiles()`, `@Method() openFileDialog()`, `@Method() setFocus()` (falcon-image-uploader.tsx:179/186/193; -tw:168/174/180). The Angular wrapper (`FalconAngularImageUploaderComponent`) proxies **none** of them. In Angular the file list is CVA-driven (fine), but there is no Angular-side `openFileDialog()` / `setFocus()` — a consumer wanting to trigger the picker from a custom button must reach into the inner element via `ViewChild`.

**Recommended fix:** tag the inner element (`#stencilEl`) and add async proxies:
```ts
@ViewChild('stencilEl', { read: ElementRef }) stencilEl?: ElementRef<HTMLElement>;
async openFileDialog(): Promise<void> { await (this.stencilEl?.nativeElement as any)?.openFileDialog?.(); }
async setFocus(): Promise<void> { await (this.stencilEl?.nativeElement as any)?.setFocus?.(); }
```

### G2 — No public `(blur)` Angular Output (P3)

`[CODE]` The Stencil `falcon-blur` is bound and routed to CVA `onTouched()` (ts:217) but is NOT re-emitted as an Angular `@Output`. Touched-tracking works, but a consumer wanting a blur signal (e.g. to fire per-field validation display) has no `(blur)` on the wrapper. Mirrors a known pattern on `<falcon-angular-input>` (its G4). **Fix:** add `@Output()/output() blur` + emit from `handleBlur`.

### G3 — `borderStyle` / `progressMode` etc. are not enumerated as wrapper string-literal types in the public surface beyond the imported union (P3 — doc only)

The wrapper imports the unions from `file-uploader-shared`, which is correct; but a consumer reading IntelliSense gets the type only via the re-export in `index.ts`. No code gap — documentation completeness note.

### G4 — No richer validation hooks (dimensions / aspect / count) (P2)

`[CODE]` The only validation is ext + size. There is no max-dimension, aspect-ratio, min-resolution, or `maxFiles` cap (the multi-file mode is unbounded beyond `maxStackVisible` visual cap). Consumers needing those must validate in the `(fileAdd)` handler.

**Recommended fix (P2):** add optional `@Input() maxFiles?`, `@Input() maxDimensionPx?`, and emit a richer `fileError` code set.

### G5 — `errorMessage` override vs per-file `errorMessage` ambiguity (P3)

`[CODE]` There are two error surfaces: the component-level `errorMessage` input (override banner) AND each descriptor's `errorMessage` field. A consumer can set both; the precedence is render-module-internal. **Doc the precedence**; no code change required.

### G6 — Shadow vs `-tw` internal selector divergence (P3 — internal)

`[CODE]` `handleRootClick` ignores inner regions by class (`.fu-list`, `.fu-banner`) on the Shadow tag (tsx:224) but by attribute (`[data-fu-part="list"]`, `[data-fu-part="banner"]`) on the `-tw` twin (-tw:211). Public API parity holds; this is an internal render-detail. Low risk but worth a parity test so the two render modules don't drift further.

## Missing accessibility features

- **A1 (P2):** No explicit `<label htmlFor>` element — the title renders inside the row (`role="button"` + `aria-label`) and the native input carries its own `aria-label`. Acceptable, but a hidden associated `<label>` would be more robust for SR users. Flag.
- **A2 (P3):** No `aria-live` announcement when a file is added/removed/errored beyond the row's `aria-invalid` flip. A polite live region would announce "File too large" to SR users.
- **A3 (P3):** The success/error banner copy is visual; confirm it is in the a11y tree (the render module sets banner role) — NOT verified this pass.

## Missing tests

- `[CODE]` **No `*.spec.ts` / `*.e2e.ts` found** for `falcon-image-uploader`, `falcon-image-uploader-tw`, OR the Angular wrapper (Glob across the component dirs returned only `.tsx`/`readme.md`). The shared `file-uploader-shared` module also has no co-located spec found. GAPs: (a) Stencil spec covering ingest/filter/remove/retry + ext/size rejection; (b) Angular wrapper spec covering CVA writeValue / effectiveDisabled OR / `fileAdd.nativeFile` emission / DI-default seeding / the `definedTw` gate; (c) a Shadow-vs-`-tw` parity test.

## Missing Tailwind / token parity

- `[CODE]` Token parity is **good** — both render paths consume the SAME `--falcon-file-uploader-*` tokens via the `:where()` shared scope; the `-tw` helper mirrors the Shadow CSS (SSOT). Document-uploader shares the contract. **Parity OK at the token level.**
- The Light-DOM `-tw` path depends on the global `@keyframes` in the token file; the Shadow path duplicates them in `file-uploader.shadow.css`. A change to one must be mirrored — process risk, not a code defect.

## Performance risks

- Wrapper uses signals + `OnPush` — efficient. `autoCycle` runs a `setInterval` (tsx:198-208) cleared on `disconnectedCallback` — correct teardown; benign.
- The 26 i18n template inputs are all string defaults — negligible.
- **No real risk.**

## Visual / interaction risks

- Two render paths can drift if a feature ships in the Shadow render module without the `-tw` mirror (the `handleRootClick` selector divergence is an early symptom). Guard via a parity test.
- With `showBanner=false`, a consumer that forgets the companion error line shows a RED row with NO message — a real UX hole (seen guarded in Add Client, but easy to miss in a new consumer). Document loudly.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Proxy `openFileDialog()` / `setFocus()` on the Angular wrapper | P2 |
| G4 | Richer validation (`maxFiles` / dimensions) | P2 |
| A1 | Hidden associated `<label htmlFor>` | P2 |
| G2 | Public `(blur)` Output | P3 |
| G6 | Shadow-vs-`-tw` parity test | P3 |
| (test) | Stencil + wrapper + parity specs | P2 |

## Fix-shared-vs-per-page
All gaps above belong in the **shared Falcon component** / `file-uploader-shared` module, not per-page. The component is the cross-framework SSOT (React generated wrapper + Angular wrapper + shared tokens); per-page hacks would break parity.

## Workarounds (if upgrade blocked)
- For G1 today: `@ViewChild` the inner `<falcon-image-uploader-tw>` and call its `openFileDialog()` directly.
- For G4 today: validate dimensions/count in the `(fileAdd)` handler and set the descriptor `status='error'` + `errorMessage` via the CVA value.
- For G2 today: attach a native `(focusout)` on the host.

## Deep-Dive Sweep Findings (2026-06-03 — B20)

**Consumer count: 18 occurrences / 8 HTML files + 6 TS co-files** (`[CODE]` grep `<falcon-angular-image-uploader`). NEW dossier (created this pass).

- **Supersession recorded** — `falcon-image-uploader` supersedes the legacy `<falcon-photo-uploader>` (bespoke circular avatar, formerly `libs/falcon/src/shared-ui/...`) AND `<falcon-uploader>`/`-tw` (old Stencil multi-file uploader). **Both are deleted from disk** (`Test-Path` false 2026-06-03). The existing dossiers `understanding/frontend/components/falcon-photo-uploader/` + `.../falcon-uploader/` (and their wiki projections) now describe removed components → **flagged for B23 cleanup** (mark LEGACY-REMOVED / archive). Per spec, this pass does NOT edit the old dossiers.
- **Best-practice posture is strong** — modern signal `input()`/`output()`, `computed`, `OnPush`, DI-seeded defaults, full CVA, Shadow+`-tw` 1:1 parity, gate-12-compliant shared tokens, React generated wrapper present.
- **All findings are `safe-local`** (method-proxy / blur-output / validation-hook / a11y-label / missing-spec / internal selector divergence) — see FINDINGS/B20.md. No HIGH-RISK items.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20) against all source layers. Method-proxy gap (G1), no public `(blur)` (G2), ext+size-only validation (G4), and the missing specs confirmed in source. Supersession of legacy uploaders confirmed by `Test-Path`. No deletion/promotion flags for THIS component — it is ACTIVE/PREFERRED.
