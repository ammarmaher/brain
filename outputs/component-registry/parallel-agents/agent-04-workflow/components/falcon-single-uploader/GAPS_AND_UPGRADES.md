# falcon-angular-single-uploader — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) PrimeIcons residuals
- **Gap:** `falcon-single-uploader.tsx:235` (`<i class="pi pi-cloud-upload" />` in the empty dropzone) and `:313` (`<i class="pi pi-pencil" />` on the edit button).
- **Recommendation:** swap to `<i class="falcon-icon falcon-icon-cloud-upload" />` and `<i class="falcon-icon falcon-icon-edit" />` from the vendored Falcon icon font.

### 2. (P1) Edit button reopens picker — no consumer hook
- **Gap:** `handleEdit()` always emits `falcon-edit` AND immediately calls `this.nativeInput?.click()`. Consumer cannot intercept (e.g., to show a custom "Are you sure you want to replace this file?" dialog before reopening the picker).
- **Recommendation:** make the picker reopen on edit OPT-IN. Either:
  - Add `editOpensPicker?: boolean` Input (default `true` for current behavior), OR
  - Add `(beforeEdit)` Output that consumer can `event.preventDefault()`.

### 3. (P1) No "replace" overlay for drag-over in filled state
- **Gap:** in filled state, drag-over visual is subtle. The user might not realize they can drop a new file to replace the current one.
- **Recommendation:** render a translucent overlay with text "Replace file" + a swap icon on drag-over in filled state.

### 4. (P1) No size-text alongside thumbnail
- **Gap:** in `previewMode="thumbnail"`, the filename and size are not visible. Only in `"compact"` are they shown.
- **Recommendation:** add `showFileMeta?: boolean` Input that overlays name + size at the bottom of the thumbnail tile.

### 5. (P2) No "loading" state for the empty dropzone
- **Gap:** if the consumer is uploading (e.g., showing a progress bar overlay), the empty dropzone has no way to communicate this — consumer must conditionally hide the component.
- **Recommendation:** add `loading?: boolean` Input that renders a spinner overlay on the dropzone.

### 6. (P2) No "fallback URL" for failed image loads
- **Gap:** if `file.url` is set but the image fails to load (broken URL), the `<img>` shows a broken-image icon.
- **Recommendation:** add `<img onError>` handler that falls back to `fileTypeIconClass(file)`.

### 7. (P2) `previewMode="compact"` is always rendered even in non-compact modes
- **Gap:** the `<div class="fsu-compact-body">…name…size…</div>` is always present in the DOM, with CSS hiding it in non-compact modes (since the render code unconditionally outputs it). DOM bloat.
- **Recommendation:** conditionally render the compact body block only when `previewMode === 'compact'`.

### 8. (P2) No retry button for error state
- **Gap:** when `file.status === 'error'`, the only action is delete. No retry.
- **Recommendation:** add a retry button + `(fileRetry)` Output (mirrors the multi-uploader gap).

### 9. (P3) Action button visual position is fixed
- **Gap:** delete is always top-right, edit is always bottom-right. Some consumer designs want both in one row.
- **Recommendation:** add `actionLayout?: 'corners' | 'row-bottom'` Input.

### 10. (P3) No "Reupload" auto-flow
- **Gap:** if a user picks a same-named file, the component treats it as new — but the consumer's URL stays the same. No event signals "this is conceptually a re-upload, refresh server-side reference".
- **Recommendation:** detect filename equality on consecutive uploads + emit `(fileReplace)` distinct from `(fileUpload)`.

## Missing accessibility features
- **(P1) Edit / delete buttons are positioned absolutely** — keyboard tab order should be predictable but may surprise screen readers.
- **(P1) The empty dropzone is `role="button"`** but the filled tile has no role; AT users may not realize the area is interactive.
- **(P2) No `aria-describedby` linking the helper / error text to the dropzone.**

## Missing tests
- _None observed in active source._

## Missing Tailwind / token parity
- Verify the Light DOM helper file mirrors all `--falcon-single-uploader-*` tokens from the Shadow CSS.

## Performance risks
- Single `URL.createObjectURL(blob)` allocation per image upload — revoked on delete. Negligible.

## Visual / interaction risks
- The edit button reopens the native picker — user might be confused that "Edit" doesn't open an in-place editor (e.g., crop tool).
- The `<i class="pi pi-pencil" />` icon (residual) reads as "edit" only because of the standard PrimeIcons glyph. Once swapped to Falcon icon, ensure the new glyph is visually similar.

## Reusable upgrade priority
- All items belong in shared component.

## Workaround availability
- For #2 (edit hook): consumer can wrap the component and listen to `(fileEdit)`, then handle the replace flow before the picker re-opens.
- For #6 (image fallback): consumer can preprocess the URL with a HEAD request before setting `file.url`.
