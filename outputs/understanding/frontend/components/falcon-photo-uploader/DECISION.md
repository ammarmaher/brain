# falcon-photo-uploader (LEGACY) — DECISION

> [!warning] REMOVED — do NOT use. Superseded by [[falcon-image-uploader]] (`<falcon-angular-image-uploader>`).
> Deleted 2026-05-31 in the React-SoT image-uploader migration. [CODE] `libs/falcon/src/shared-ui/index.ts:7-9`. The migration shipped — the "roadmap" prose below is history.

## Brain SK final recommendation

### Status
- **REMOVED (deleted 2026-05-31).** [CODE] `libs/falcon/src/shared-ui/index.ts:7-9`. The migration the old dossier anticipated has SHIPPED: all former consumers now use `<falcon-angular-image-uploader>`. Note the actual target was **image-uploader**, not the `<falcon-angular-single-uploader>` + circular-mask token the old dossier guessed.

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
- **`<falcon-angular-image-uploader>` ([[falcon-image-uploader]]) — the realized replacement.** All avatar/picture slots use it now (`accept` bare extensions, `maxSizeMB`, `[multiple]=false`, `[showBanner]=false`, `[showStatusBadge]=false`, CVA `[ngModel]`, `(fileAdd)` exposing `nativeFile`).
- `<falcon-angular-single-uploader>` ([[falcon-single-uploader]]) — the old dossier's "most credible migration target" guess; not the path that shipped.

### Exact rule for future implementation tasks
> "`<falcon-photo-uploader>` is DELETED — do not reference it. For avatar / picture upload use `<falcon-angular-image-uploader>` with `[multiple]=false` + `[showBanner]=false` + `[showStatusBadge]=false`, bind via `[ngModel]`, and read the raw file from `(fileAdd)`'s `nativeFile`. The File→base64 helpers are in `libs/falcon/src/shared-ui/lib/utils/picture-file.util.ts`."

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
- The migration remapped each of these to `<falcon-angular-image-uploader>` (DONE — `[(photo)]` → `[ngModel]` + `(fileAdd).nativeFile`; the `photoData` base64 object is built in the consumer's `onClientPhotoPicked` handler and flows verbatim into `wire-builders.ts`).

> _N.B. — §9/§10 are historical: the upgrade path executed and the component is gone. Current risk lives in `<falcon-angular-image-uploader>`._

## Verification
🟢 code-verified (B23 reconcile 2026-06-03) — REMOVED confirmed via [CODE] `libs/falcon/src/shared-ui/index.ts:7-9`; realized successor `<falcon-angular-image-uploader>` confirmed in migrated template [CODE] `client-information-step.component.html:2-13`.
