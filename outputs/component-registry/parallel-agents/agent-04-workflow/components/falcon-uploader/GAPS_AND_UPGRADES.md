# falcon-angular-uploader — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) PrimeIcons class still rendered
- **Gap:** `falcon-uploader.tsx:319` (dropzone) and `:361` (button) render `<i class="pi pi-cloud-upload" />`. Per Wave PR-8 + memory `project_falcon_primeng_total_removal_complete.md`, all `pi pi-*` icons were replaced by a vendored Falcon icon font. This is a residual that ESLint flat-block should be catching.
- **Where:** `libs/falcon-ui-core/src/components/falcon-uploader/falcon-uploader.tsx:319`, `:361`.
- **Recommendation:** replace with `<i class="falcon-icon falcon-icon-cloud-upload" />` (or equivalent token from `libs/falcon-theme/src/styles/falcon-icons.css`).
- **Risk:** medium — leaks dependency on a removed library; ESLint custom rule may not scan Stencil .tsx files (it scans `*.ts` in Angular apps).

### 2. (P0) No built-in validation
- **Gap:** `accept`, `maxSize`, `maxFiles` are forwarded to the native `<input>` but NOT enforced by the component when files are added via drag/drop. Consumer must validate.
- **Recommendation:** add an opt-in `enableNativeValidation?: boolean` Input. When true, drop+pick events check size + type + count against the props; rejected files emit `falcon-error` with code/message; not added to `files` list.
- **Workaround today:** consumer validates and patches `file.status='error' + errorMessage` after the fact (still appears in the list — could not pre-reject).

### 3. (P1) No drag-anywhere mode
- **Gap:** drag/drop is scoped to the dropzone element only. In `mode="button"` or `mode="inline-list"`, users cannot drop files onto the whole list / button area.
- **Recommendation:** add `dragAnywhere?: boolean` Input (or default-on for button mode). Drop target becomes the whole host element.

### 4. (P1) No per-file custom template
- **Gap:** file rows are rendered with a fixed structure (thumb + body + badge + remove). No way to add a custom action (e.g., a "Re-upload" button for error rows).
- **Recommendation:** add `<slot name="file-{id}">` per file OR a per-file Angular `*falconUploaderItem` directive.

### 5. (P1) No retry button for error rows
- **Gap:** when `file.status === 'error'`, the only action visible is "Remove (×)". No "Retry upload".
- **Recommendation:** add a built-in retry button in the row when `status === 'error'` AND a new `(fileRetry)` Output.

### 6. (P2) No size text formatting customization
- **Gap:** `formatFileSize(file.size)` outputs `"12 KB"` / `"1.2 MB"`. No localization or precision toggle.
- **Recommendation:** expose a `sizeFormatter?: (bytes: number) => string` Input.

### 7. (P2) `fileError` Output not connected to Stencil core
- **Gap:** the Angular wrapper has `@Output() fileError` but the Stencil source's `falcon-error` is never emitted from the core component itself (no validation runs there). Consumers emit it manually.
- **Recommendation:** wire up the validation gate (item 2) — once validation runs, this event fires automatically.

### 8. (P2) No "drop more files" affordance when list is partial
- **Gap:** when the file list is non-empty, the dropzone summary shows "{count} file(s) selected. Drop more files or browse" — but the visual is the same as the empty dropzone. A user might think the previous files were replaced.
- **Recommendation:** show a "+ Drop more" mini-tile / FAB at the end of the list when non-empty.

### 9. (P2) No file-grid mode (thumbnail grid)
- **Gap:** the file list is vertical only. For image-heavy uploads, a 3-column thumbnail grid would be better.
- **Recommendation:** add `displayMode?: 'list' | 'grid'` Input.

### 10. (P3) Progress text ("32%") is not displayed alongside the bar
- **Gap:** the progress bar shows visually but no numeric overlay.
- **Recommendation:** add `showProgressText?: boolean` Input.

### 11. (P3) Status badge labels are hardcoded
- **Gap:** `statusLabel('uploading')` returns `'Uploading'` (English-only).
- **Recommendation:** expose a `statusLabels?: { queued, uploading, success, error }` Input for i18n.

## Missing accessibility features
- **(P1) Keyboard remove (Delete/Backspace) is on the LI, but Tab to LI requires `tabindex=0` which the row has — good.** But the user must Tab to the row first, then Delete. Screen reader announcement of "Press Delete to remove" is missing.
- **(P2) When `aria-busy` is true on a row, the AT may announce per-progress-tick. The native `<progress>` element isn't used — a `<div role="progressbar">` is. AT verbosity differs by reader.

## Missing tests
- _None observed in active source._

## Missing Tailwind / token parity
- The Shadow CSS contains the `--falcon-uploader-*` token references; verify the Tailwind helper file mirrors all 14 categories.

## Performance risks
- `URL.createObjectURL(f)` on every new image file allocates a blob URL. Revoked on remove. If a consumer drops 100 images, that's 100 active blob URLs in memory until removed.
- **Recommendation:** lazy-load thumbnails (use `<img loading="lazy">`).

## Visual / interaction risks
- Drag-leave detection uses `relatedTarget` containment check — works in modern Chromium / Firefox, may flicker on Safari.

## Reusable upgrade priority
- All items in shared component.

## Workaround availability
- For #1 (PrimeIcons): consumer can override the dropzone-empty content via `<span slot="placeholder">…</span>` to hide the residual `<i class="pi …">`. But the icon DOM still renders.
- For #5 (retry): consumer can wrap the `<falcon-angular-uploader>` and render an overlay retry button on each error row.
