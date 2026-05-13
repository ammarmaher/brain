# falcon-photo-uploader (LEGACY) — DECISION

## Brain SK final recommendation

### Status
- **LEGACY-IN-USE.** Bespoke Angular component used by 6+ wizard step templates.
- Roadmap: replace with a Falcon UI core "avatar uploader" (or `<falcon-angular-single-uploader>` with circular mask token override) when migration ships.

### Use this component for
- Existing wizard avatar slots — keep them compiling.

### Avoid this component for
- New pages or new avatar features.
- Non-circular preview — use `<falcon-angular-single-uploader>`.

### Preferred variant / render path
- N/A — pure Angular bespoke, single render.

### Required upgrades before wider use
- **NONE.** Do not invest in this component. Plan the migration.

### Relationship to other components
- `<falcon-angular-single-uploader>` — the most credible migration target. Apply `--falcon-single-uploader-tile-radius: 50%` for the circular look.
- Future: a dedicated `<falcon-angular-avatar-uploader>` Falcon UI core component that owns the circular + drag-hint banner + label/sublabel composition.

### Exact rule for future implementation tasks
> "Do NOT add new consumers of `<falcon-photo-uploader>`. For new avatar slots, use `<falcon-angular-single-uploader>` with a per-instance `--falcon-single-uploader-tile-radius: 50%` token override. The legacy component remains for existing wizards until migration."

---

## Dynamic capability assessment

### 1. What is static today?
- Avatar shape (circle) — hardcoded in SCSS.
- Drag-hint banner placement — hardcoded.
- Default accept list (`image/png,image/jpeg`).
- Default maxBytes (2 MB).
- The upload button position + style — hardcoded.

### 2. What is already dynamic through inputs/outputs?
- `[(photo)]` data URL two-way.
- `labelKey`, `subLabelKey`, `dragHintKey`, `uploadBtnKey` translation keys.
- `accept`, `maxBytes`.
- `(fileSelected)` raw File emit.

### 3. What is already dynamic through slots / ng-template?
- _None._

### 4. What is dynamic through token / theme overrides?
- _Nothing._ No tokens.

### 5. What is dynamic through Tailwind classes?
- Outer layout context (parent flex / grid).

### 6. What is missing to make this component reusable across pages?
- Migration target is the answer — not this component.

### 7. What capability should be added to the shared component vs a one-off page hack?
- All capability should land in the Falcon UI core target.

### 8. What flags / options / templates / slots would make it better?
- Not applicable — do not enhance.

### 9. What is the safest upgrade path?
- Plan a Wave that:
  1. Adds a circular preset to `<falcon-angular-single-uploader>` (token override pattern).
  2. Migrates each consumer template one at a time (6 templates).
  3. Deletes `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/`.

### 10. What would be risky to change because other pages depend on it?
- The 6 wizard step templates that consume `<falcon-photo-uploader>`.
- Each consumer expects:
  - `[(photo)]` data URL binding.
  - `(photoChange)` / `(fileSelected)`.
  - i18n keys for label / sublabel / dragHint / uploadBtn.
- The migration must remap each of these to the new component's APIs.
