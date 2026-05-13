# falcon-angular-uploader — DECISION

## Brain SK final recommendation

### Status
- **READY** for new multi-file flows, **with the PrimeIcons residual flagged for fix**.

### Use this component for
- Multi-file attachment uploads (PDF / image / mixed).
- Document collection on Add Client / Add User / Add Subscription wizards.
- Per-file progress + status + error display.

### Avoid this component for
- Single-file flows → `<falcon-angular-single-uploader>`.
- Avatar / profile photo → `<falcon-photo-uploader>` (legacy) until a Falcon UI core "avatar uploader" lands.
- Bulk imports (CSV / Excel) where the file is uploaded once and processed server-side → use a simple `<falcon-angular-button>` + native input + custom status feedback.

### Preferred variant / render path
- **`useTailwind=true` (default)** — Light DOM.
- `useTailwind=false` for foreign hosts.

### Required upgrades before wider use
1. **Replace `<i class="pi pi-cloud-upload" />`** with the vendored Falcon icon (P0).
2. **Optional built-in validation** (`enableNativeValidation`) (P0).
3. **Retry button + `(fileRetry)` Output** for error rows (P1).
4. **Per-file custom template / slot** for custom actions (P1).
5. **`dragAnywhere` flag** for button / inline-list modes (P1).
6. **Status label i18n** (`statusLabels` Input) (P3).

### Relationship to other components
- Distinct from `<falcon-angular-single-uploader>` (single file + replace UX).
- Distinct from `<falcon-photo-uploader>` (legacy avatar circle).
- Composes with `<falcon-angular-empty-state>` when no files (consumer-driven).

### Exact rule for future implementation tasks
> "For multi-file uploads, use `<falcon-angular-uploader>` with `mode='dropzone'`. Drive `file.status / progress / errorMessage` from your upload pipeline. The component itself does NOT validate — implement consumer-side checks and set status accordingly."

---

## Dynamic capability assessment

### 1. What is static today?
- File row structure (thumb + body + badge + remove) — no slot per row.
- The dropzone icon (`pi pi-cloud-upload`) is hardcoded.
- Status badge labels (`'Uploading'`, `'Queued'`, etc.) are hardcoded English.
- No retry button.
- No grid layout for thumbnails.
- No progress numeric overlay.

### 2. What is already dynamic through inputs/outputs?
- `mode` (3 options).
- `accept`, `maxSize`, `maxFiles`, `multiple`.
- `disabled`, `readonly`, `required`.
- `helperText`, `errorMessage`, `label`, `placeholder`, `placeholderHint`, `buttonLabel`, `ariaLabel`.
- `showProgress`, `showPreview`.
- `value` (CVA / two-way).
- 4 Outputs: `valueChange`, `fileAdd`, `fileRemove`, `fileError`.

### 3. What is already dynamic through slots / ng-template?
- `slot="placeholder"` — empty-dropzone placeholder text.
- `slot="hint"` — extra hint below the dropzone.

### 4. What is dynamic through token / theme overrides?
- 14 categories in `uploader.tokens.css` — dropzone bg + border + radius + padding per state, file row visuals, progress bar visuals, status badge per state, remove button, preview thumbnail, motion.
- Per-instance overrides via `<falcon-angular-uploader class="my-uploader">` + `:where(.my-uploader) { --falcon-uploader-…: …; }`.

### 5. What is dynamic through Tailwind classes?
- Outer wrapper class for margins / max-width.
- File row visuals are owned by tokens — Tailwind utilities should not be layered on top.

### 6. What is missing to make this component reusable across pages?
- Per-file slot / template (P1).
- Built-in validation hooks (P0).
- Retry button + Output (P1).
- Grid layout mode (P2).
- Status label i18n (P3).
- Drag-anywhere mode (P1).

### 7. What capability should be added to the shared component vs a one-off page hack?
- All items belong in shared. The status label i18n especially — fragmenting it leaves Arabic/RTL users without proper translation.

### 8. What flags / options / templates / slots would make it better?
- `enableNativeValidation?: boolean`.
- `displayMode?: 'list' | 'grid'`.
- `dragAnywhere?: boolean`.
- `showProgressText?: boolean`.
- `statusLabels?: { queued, uploading, success, error }`.
- `sizeFormatter?: (bytes: number) => string`.
- `*falconUploaderItem` Angular directive + matching `<slot name="file-{id}">`.
- `(fileRetry)` Output.

### 9. What is the safest upgrade path?
1. Fix the PrimeIcons residual (zero risk — token-only swap).
2. Add per-file slot / directive — purely additive.
3. Add retry button + `(fileRetry)` Output — purely additive.
4. Add `enableNativeValidation` Input — opt-in, default false (no breaking change).
5. Add `dragAnywhere` — opt-in.
6. Add `statusLabels` Input — opt-in.

### 10. What would be risky to change because other pages depend on it?
- Removing or renaming `value` (CVA) — breaks `formControlName` / `ngModel`.
- Changing `FalconUploaderFileStatus` enum values — consumers may switch on them.
- Changing `URL.createObjectURL` revocation timing — consumers may have copied the blob URL.
- Removing the inline-width escape hatch on the progress bar — visual regression.
