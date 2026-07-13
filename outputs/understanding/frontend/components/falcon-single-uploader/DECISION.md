# falcon-single-uploader — DECISION

## Brain SK final recommendation

**STATUS: READY for single-file square-tile flows — but currently UN-ADOPTED in production. Prefer it for a genuine single-file replace-tile need; for the avatar-row / multi-file / CSV-with-S3 UX, use the `file-uploader-shared` family instead.** (B19 correction: the prior "PrimeIcons residuals flagged for fix" caveat is stale — the icons are the Falcon icon font.)

## Use this component for

- Single-file uploads with a **square preview tile** + delete + edit (replace) overlays.
- Logo / signature / single signed-document / ID-copy slots, where exactly ONE file is expected and a square preview is acceptable.
- Form fields bound via `formControlName` / `[(ngModel)]` carrying a `FalconSingleUploaderFile | null`.

## Avoid this component for

- The **avatar-row** uploader look (circle/tile + waves + stack + banner + retry), or **multiple files**, or **CSV/Excel import with an S3 handshake** → `<falcon-angular-document-uploader>` / `<falcon-angular-image-uploader>` (`file-uploader-shared`). These ARE the live production uploaders.
- Circular avatar / profile photo → `<falcon-photo-uploader>` (legacy — its preview is circular).
- Empty-data placeholder → `<falcon-angular-empty-state>`.

## Preferred variant / render path

**`useTailwind=true` (default)** — Light DOM. Best for Studio token mutation + Tailwind layout via `[rootClass]`. Both render paths read the SAME `--falcon-single-uploader-*` tokens (SSOT), so the visual is identical.

**Caveat (G1):** in the default `-tw` path the empty dropzone `<div>` is `tabindex={-1}` (NOT keyboard-focusable); the Shadow path makes it `0`. A keyboard user reaches the picker via the hidden focusable native input in either path, but the dropzone itself is only keyboard-operable in the Shadow path until G1 is fixed.

## Required upgrades before wider use

- **None block use today.** The component is production-quality. The 11 gaps in `GAPS_AND_UPGRADES.md` are improvements; **G1 (`-tw` keyboard parity)** is the one worth fixing before relying on full keyboard a11y in the default path.

## Relationship to other components

- **Distinct from** the `file-uploader-shared` family (`<falcon-angular-document-uploader>` / `image-uploader`) — different DOM/UX (avatar-row + stack + banner + retry), different model (`FalconFileUploaderFile` with `id`+`errorCode`+`previewUrl`), different token file (`file-uploader.tokens.css`). The two families do NOT share types or tokens.
- **Distinct from** `<falcon-photo-uploader>` (legacy circular avatar).

## Exact rule for future implementation tasks

1. **Single file, square preview tile, replaceable?** → `<falcon-angular-single-uploader>`, `useTailwind=true`.
2. **`previewMode='thumbnail'`** for images, `'icon-only'` for non-image docs, `'compact'` for narrow columns.
3. **Bind `formControlName` / `[(ngModel)]` / `[value]`** (a `FalconSingleUploaderFile | null`). Never bind `[file]` directly alongside ngModel.
4. **Drive the upload yourself** — on `(fileUpload)` start the `POST` and write `{status, progress, url, errorMessage}` back into the value. The component never uploads or validates (`maxSize` is a hint).
5. **Override `--falcon-single-uploader-*` tokens** via a host class for visual tweaks; never hardcode hex/px.
6. **If you actually need the avatar-row / multi-file / CSV UX → switch to `<falcon-angular-document-uploader>`** (do not bend this component into that shape).

---

## Dynamic capability assessment

### 1. What is static today?

- Action buttons: delete top-end, edit bottom-end — fixed positions (no `actionLayout`).
- The compact body block is always in the DOM (hidden in non-compact modes — G6).
- The cloud-upload / pencil / file-type glyphs (Falcon icon font — fixed classes).
- No retry button, no loading overlay, no `<img onError>` fallback.
- The `-tw` dropzone `tabindex={-1}` (G1).
- The `<ng-content>` is a no-op (no `<slot>` — G2).

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **16 wrapper inputs** — `value`(+CVA), `accept`, `maxSize`, `required`, `helperText`, `errorMessage`, `label`, `placeholder`, `placeholderHint`, `size`, `previewMode`, `ariaLabel`, `disabled`(+CVA), `useTailwind`, `rootClass`.
- `[CODE]` **5 outputs** — `(valueChange)`, `(fileUpload)`, `(fileDelete)`, `(fileEdit)`, `(fileError)` (the latter IS wired from `falcon-error` — corrected this pass). `falcon-blur` → CVA `onTouched` (not re-emitted).

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` **None functional** — the wrapper has `<ng-content>` but the Stencil templates render no `<slot>` (no-op, G2). No `ng-template` inputs.

### 4. What is dynamic through token / theme overrides?

- `[CODE]` Every visual axis via the 14-category `--falcon-single-uploader-*` token set (tile size/radius/border/bg per status, empty-state per state, action buttons, progress, icon fallback, label/helper/error). Dark mode flips via the palette chain.

### 5. What is dynamic through Tailwind classes?

- `[CODE]` `[rootClass]` forwards to the inner Stencil element (`[class]`) for layout. Token overrides are preferred over hand-rolled utilities.

### 6. What is missing to make this component reusable across pages?

- `-tw` keyboard parity (G1), edit hook (G3), filled drag-over overlay (G4), `showFileMeta` (G5), retry (G8), method proxies (G9), `<img onError>` (G7), a real slot or removing `<ng-content>` (G2).

### 7. What capability should be added to the shared component (not a page hack)?

- All of the above — it is a `libs/falcon-ui-core` component; the a11y + replace-overlay + retry work must be central.

### 8. What flags / options / templates / slots would make it better?

- `editOpensPicker?: boolean` / `(beforeEdit)` (G3), `showFileMeta?: boolean` (G5), `loading?: boolean`, `(fileRetry)` (G8), `actionLayout?: 'corners' | 'row-bottom'`, `slot="actions"` (G2).

### 9. What is the safest upgrade path?

1. **Phase A (zero risk):** add `loading`, `showFileMeta`, `<img onError>` fallback, conditional compact body, method proxies (all additive).
2. **Phase B (a11y, queued):** `-tw` dropzone `tabindex` parity (G1) + filled-tile role + `aria-describedby` (verify with AT).
3. **Phase C:** edit hook (`editOpensPicker` default `true`), retry + `(fileRetry)`, resolve the slot.

### 10. What would be risky to change because other pages depend on it?

- Removing CVA value semantics or changing the `FalconSingleUploaderFile` shape.
- Changing the edit-button default behavior (reopens picker) — must stay opt-in via a flag.
- Flipping the default `useTailwind` (changes DOM structure Light↔Shadow).
- (Low risk in practice since there is no production consumer yet — but a future adopter would depend on these.)

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19). Recommendation: READY for single-file tile flows; un-adopted (production uses `file-uploader-shared`). Counts: 16 inputs, 5 outputs (incl. wired `fileError`). PrimeIcons caveat retired. G1 (`-tw` keyboard) is the recommended pre-adoption fix. No deletion/promotion flag.
