# falcon-angular-single-uploader — DECISION

## Brain SK final recommendation

### Status
- **READY** for single-file flows, with PrimeIcons residuals flagged for fix.

### Use this component for
- Single-file uploads with preview tile + delete + edit overlays.
- Logo upload, signature upload, single document upload.
- Form fields where exactly ONE file is expected.

### Avoid this component for
- Multi-file uploads → `<falcon-angular-uploader>`.
- Circular avatar / profile photo → `<falcon-photo-uploader>` (legacy until replacement lands).
- Bulk imports → simple file picker.

### Preferred variant / render path
- **`useTailwind=true` (default)** — Light DOM.

### Required upgrades before wider use
1. **Fix `pi pi-cloud-upload` and `pi pi-pencil` residuals** (P0).
2. **Edit-button hook** (`editOpensPicker` Input or `(beforeEdit)` Output) (P1).
3. **Replace overlay in filled state on drag-over** (P1).
4. **`showFileMeta` overlay for thumbnail mode** (P1).
5. **Retry button + `(fileRetry)` Output** (P2).
6. **Conditional render of compact body** (P2).

### Relationship to other components
- Distinct from `<falcon-angular-uploader>` (multi-file).
- Distinct from `<falcon-photo-uploader>` (circular avatar).

### Exact rule for future implementation tasks
> "For single-file uploads with replace UX, use `<falcon-angular-single-uploader>` with `previewMode='thumbnail'` for images, `'icon-only'` for non-image documents, `'compact'` for narrow form columns."

---

## Dynamic capability assessment

### 1. What is static today?
- Action buttons (delete top-right, edit bottom-right) — fixed positions.
- Icons `pi pi-cloud-upload` + `pi pi-pencil` — hardcoded.
- The compact body block is always rendered (even when not in compact mode).
- No retry button.
- No loading overlay.

### 2. What is already dynamic through inputs/outputs?
- `previewMode` (3 options).
- `size` (3 options).
- `value` (CVA / two-way).
- `accept`, `maxSize`, `disabled`, `required`.
- `helperText`, `errorMessage`, `label`, `placeholder`, `placeholderHint`, `ariaLabel`.
- 5 Outputs: `valueChange`, `fileUpload`, `fileDelete`, `fileEdit`, `fileError`.

### 3. What is already dynamic through slots / ng-template?
- _None observed in active source._

### 4. What is dynamic through token / theme overrides?
- Tile size per scale, radius, border, bg/color per status, action button visuals, preview image / icon fallback.

### 5. What is dynamic through Tailwind classes?
- Outer wrapper for layout.

### 6. What is missing to make this component reusable across pages?
- Edit hook (P1).
- Replace overlay on filled-state drag-over (P1).
- `showFileMeta` for thumbnail mode (P1).
- Retry button (P2).
- Loading overlay (P2).
- Slot for custom action buttons (P3).

### 7. What capability should be added to the shared component vs a one-off page hack?
- All items belong in shared. The replace overlay especially — critical UX.

### 8. What flags / options / templates / slots would make it better?
- `editOpensPicker?: boolean`.
- `(beforeEdit)` Output.
- `showFileMeta?: boolean`.
- `(fileRetry)` Output.
- `loading?: boolean`.
- `actionLayout?: 'corners' | 'row-bottom'`.
- `slot="actions"` for custom action overlay.

### 9. What is the safest upgrade path?
1. Fix PrimeIcons residuals (zero risk).
2. Add `loading` Input — purely additive.
3. Add `showFileMeta` — purely additive.
4. Add `editOpensPicker` Input (default `true` preserves current behavior).
5. Add `(fileRetry)` Output — purely additive.

### 10. What would be risky to change because other pages depend on it?
- Removing CVA value semantics.
- Changing `FalconSingleUploaderFile` shape.
- Changing edit-button default behavior (reopens picker) — must be opt-in via flag.
