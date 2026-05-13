# falcon-photo-uploader (LEGACY) — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) Legacy bespoke component — no Stencil core
- Marked for promotion to Falcon UI core as a circular variant of `<falcon-angular-single-uploader>`.

### 2. (P0) Legacy SCSS file violates project rule
- `falcon-photo-uploader.component.scss` exists. Per Falcon project standard, "Tailwind utilities in templates only — no SCSS".
- **Recommendation:** as part of migration to Falcon UI core, delete this SCSS file.

### 3. (P0) Silent file-size rejection
- When `file.size > maxBytes`, the file is silently dropped — no error feedback to the user.
- **Recommendation:** during migration to `<falcon-angular-single-uploader>`, ensure errors are surfaced via `file.status='error' + errorMessage`.

### 4. (P1) No remote URL preview
- `photo` must be a data URL. If the consumer has the user's existing avatar as an http URL (typical for edit flows), they must fetch + base64-encode it client-side first.
- **Recommendation:** the migration target `<falcon-angular-single-uploader>` accepts `file.url` for remote previews — no client-side base64 needed.

### 5. (P1) No edit flow signal
- Only `(photoChange)` (two-way) and `(fileSelected)` — no distinct "edit" vs "upload" event.
- **Recommendation:** map to `<falcon-angular-single-uploader>` which has both `fileUpload` and `fileEdit`.

### 6. (P1) No CVA — not Reactive-Form friendly
- Forms must wire the binding manually.
- **Recommendation:** migration target has full CVA.

### 7. (P2) Hardcoded English fallback for `accept`
- The default `'image/png,image/jpeg'` is fine, but no JPEG2000 / WebP / AVIF / SVG.
- **Recommendation:** during migration, consumer specifies `accept`.

### 8. (P2) No "Crop" tool
- After upload, the avatar is the full image with `object-fit: cover` (implied via SCSS). No in-component crop.
- **Recommendation:** out of scope for migration; add a separate `<falcon-image-cropper>` if needed.

### 9. (P3) Translation is mandatory
- All four labels go through `TranslatePipe`. New consumers must register i18n keys.

### 10. (P3) The `<falcon-photo-uploader>` selector is ESLint-disabled
- The component selector `falcon-photo-uploader` doesn't match the typical Angular `app-*` prefix. The component file uses `// eslint-disable-next-line @angular-eslint/component-selector` — a yellow flag.

## Missing accessibility features
- No `role="button"` on the drop target.
- No `aria-label` on the dropzone area or the upload button.
- No keyboard handler for `Enter` / `Space` to open the picker.
- No focus-visible style.

## Missing tests
- _None observed in active source._

## Missing Tailwind / token parity
- **None — no tokens exist for this component.**

## Performance risks
- `FileReader.readAsDataURL` decodes the entire image into a base64 string in memory. For 2 MB images, the data URL is ~2.7 MB of memory. Not a concern; documented.

## Visual / interaction risks
- Drag-over visual via host class — needs CSS coordination.
- The hidden native `<input>` is positioned off-screen via SCSS — risk of `display:none` breakage if SCSS file is deleted without replacement.

## Reusable upgrade priority
- **DO NOT upgrade this legacy component.** Migrate to a Falcon UI core "avatar uploader" or use `<falcon-angular-single-uploader>` with circular mask token override.

## Workaround availability
- Today: works.
- Tomorrow (interim): use `<falcon-angular-single-uploader>` + `--falcon-single-uploader-tile-radius: 50%`.
- Future: a dedicated `<falcon-angular-avatar-uploader>` component.
