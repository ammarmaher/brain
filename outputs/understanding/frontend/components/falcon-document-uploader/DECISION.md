# falcon-document-uploader — DECISION

## Brain SK final recommendation

**STATUS: READY / PREFERRED for document & spreadsheet uploads. Use it (with `useTailwind=true`) for any "attach a CSV/Excel/PDF/DOCX" step where the consumer drives the real upload. It is the document twin of `<falcon-angular-image-uploader>` in the `file-uploader-shared` family, with real production consumers (contact-groups import, templates media).**

## Use this component for

- Document/spreadsheet uploads (xlsx/xls/csv/pdf/docx) with the Falcon avatar-row UX (drag hint, water/bar/laser progress, success/error banner, retry).
- Single OR multi-file document uploads (`[multiple]`).
- Flows that need the **raw `File`** to drive a real upload pipeline (e.g. the contact-groups S3 pre-signed-URL handshake) — via `(fileAdd).nativeFile`.

## Avoid this component for

- Image uploads with thumbnail previews → `<falcon-angular-image-uploader>` (the image variant in the same family).
- A compact **square single-file preview tile** → `<falcon-angular-single-uploader>`.
- Circular avatar / profile photo → `<falcon-photo-uploader>` (legacy).

## Preferred variant / render path

**`useTailwind=true` (default) — MANDATORY in apps.** The Shadow `<falcon-document-uploader>` is NOT registered in the consuming apps (only `-tw` self-registers); `useTailwind=false` renders BLANK (G1). The wrapper additionally gates the `-tw` element behind `@if (definedTw())` so bindings apply only after `customElements.define` resolves (a load-bearing upgrade-ordering fix).

## Required upgrades before wider use

- **None block use today** — it is live in production. **G1** (Shadow-blank trap) and **G2** (no method proxies) are the most worthwhile hardening items; **G3** (30-string copy surface) is an ergonomics improvement.

## Relationship to other components

- **1:1 image twin:** `<falcon-angular-image-uploader>` (B20) — shares the `file-uploader-shared` engine + `FalconFileUploaderFile` types + `file-uploader.tokens.css`. Differs only in defaults + `variant`. Changes to the shared engine affect BOTH — keep parity.
- **Distinct from** `<falcon-angular-single-uploader>` (square single-file tile; different family/model/tokens — `FalconSingleUploaderFile` has no `id`).
- **Distinct from** `<falcon-photo-uploader>` (legacy circular avatar). All three uploader families read `FALCON_UPLOADER_DEFAULTS` (image/document/photo blocks).

## Exact rule for future implementation tasks

1. **Document/spreadsheet upload?** → `<falcon-angular-document-uploader>`, `[useTailwind]="true"`.
2. **Constrain via `[accept]` (bare-ext list) + `[maxSizeMB]`** — but prefer the DI defaults (`FALCON_UPLOADER_DEFAULTS.document`) / read the backend `upload-config`; don't hardcode literals per page (contact-groups reads them from DI).
3. **Drive the upload from `(fileAdd).nativeFile`** — run the real pipeline (S3 init→PUT→complete for contact-groups), push `{status, progress, errorCode}` back via the bound value (or `setFiles()` via a ref). The component never uploads.
4. **Bind `formControlName` / `[(ngModel)]`** (a `FalconFileUploaderFile[]`). Never bind the Stencil `[files]` directly alongside ngModel.
5. **Feed translated copy** (`*Template`/`*Text`, placeholders intact).
6. **Need image previews → switch to `<falcon-angular-image-uploader>`.** Need a square single-file tile → `<falcon-angular-single-uploader>`.
7. **Retune defaults app-wide** via `provideFalconUploader({ defaults: { document: {...} } })`.

---

## Dynamic capability assessment

### 1. What is static today?

- `variant='document'` is fixed (not an input) — the doc/spreadsheet glyph + no-image-preview behavior.
- The avatar-row DOM structure (left circle/tile → center → right button) — from the shared engine.
- The Shadow tag is unregistered in apps (so only the `-tw` render is reachable).
- No slots / no custom-content template.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **~50 inputs** — copy (label/helper/button/dragHint/ariaLabel), behavior (accept/maxSizeMB/multiple/maxStackVisible/dragDrop/clickToBrowse/required/disabled), visual (size/shape/borderStyle/progressMode + 4 decoration toggles), multi-file (filterMode + 6 badge/stack toggles + autoCycle/speed), error/i18n (errorMessage + ~20 `*Template`/`*Text`), value (files) + useTailwind + rootClass.
- `[CODE]` **5 outputs** — `(valueChange)`, `(fileAdd)` (raw `File`), `(fileRemove)`, `(fileRetry)`, `(fileError)`. `falcon-blur`→CVA `onTouched`.

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` **None** — no `<ng-content>`/`<slot>`/`ng-template`. Copy is prop-driven.

### 4. What is dynamic through token / theme overrides?

- `[CODE]` Every visual axis via the SHARED 13-category `--falcon-file-uploader-*` tokens (row/progress/circle/pins/badge/label/right/stack/count/banner/list/chip/motion). Dark mode flips via the palette chain. (Scope overrides to the document tags to avoid retinting image-uploader — G7.)

### 5. What is dynamic through Tailwind classes?

- `[CODE]` `[rootClass]` → inner Stencil element layout. Token overrides + the `shape`/`borderStyle`/`progressMode` inputs are preferred over hand-rolled utilities.

### 6. What is missing to make this component reusable across pages?

- Register/guard the Shadow path (G1), method proxies (G2), a `[copy]` object / DI i18n bundle (G3), wrapper/Stencil specs (G5).

### 7. What capability should be added to the shared component (not a page hack)?

- All of the above — it is the `file-uploader-shared` engine + a thin variant; fixes land once and benefit the image twin too.

### 8. What flags / options / templates / slots would make it better?

- `[copy]` object input (G3), wrapper method proxies (`setFiles`/`openFileDialog`/`setFocus`) (G2), a `(fileStatusChange)` convenience (G4), an optional slot for a custom row.

### 9. What is the safest upgrade path?

1. **Phase A (additive):** wrapper method proxies (G2), `[copy]` object (G3), `(fileStatusChange)` (G4) — all additive.
2. **Phase B (hardening):** register the Shadow variant or guard `useTailwind=false` (G1) — verify against the loader/`stub-seeder`.
3. **Phase C (test/audit):** wrapper + Stencil specs (G5), deep static-scan of `file-uploader.shadow.css` (G6).

All additive; the engine is shared with image-uploader, so guard parity with B20.

### 10. What is risky to change because other pages depend on it?

- The `file-uploader-shared` engine — a change hits BOTH document + image uploaders (contact-groups + templates step2, both consoles).
- The `(fileAdd).nativeFile` contract — the contact-groups S3 pipeline depends on the raw `File` + its Content-Type.
- The shared `file-uploader.tokens.css` `:where()` list — a broad override retints both uploaders.
- `effectiveDisabled` OR-logic — flipping it would change how `[disabled]` + reactive-forms disabled interact for live consumers.
- The `definedTw` upgrade gate — removing it re-introduces the "renders with defaults, ignores bindings" regression (ts:53-58).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19). Recommendation: READY/PREFERRED for document uploads, `useTailwind=true` mandatory (Shadow unregistered). Counts: ~50 inputs, 5 outputs (incl. raw-`File` `(fileAdd)`), no slots, SHARED 13-category token file. 1:1 image twin; real production consumers. No deletion/promotion flag.
