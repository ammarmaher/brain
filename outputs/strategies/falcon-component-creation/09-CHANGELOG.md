# 09 — Changelog

> **Purpose.** Strategy version log. Every change to any file in this folder lands here with a date, a version bump, and a link to the run that surfaced the change.
>
> **Versioning.** Semantic. MAJOR = new artefact layer or breaking pattern change. MINOR = new rule or new template. PATCH = pitfall added, doctrine clarified, run logged.

## v1.0 — 2026-05-14

### Added
- Initial canonical-pattern doctrine (`01-CANONICAL_PATTERN.md`) authored by B1.
- Folder structure reference (`02-FOLDER_STRUCTURE.md`) authored by B1.
- Naming convention table (`03-NAMING_CONVENTION.md`) authored by B1.
- 10 file templates (`04-FILE_TEMPLATES/`) authored by B2:
  - `shadow.tsx.template`
  - `shadow.css.template`
  - `light-tw.tsx.template`
  - `classes.ts.template`
  - `types.ts.template`
  - `tokens.css.template`
  - `angular-wrapper.ts.template`
  - `angular-wrapper.html.template`
  - `angular-wrapper-index.ts.template`
  - `loader-entry.template`
- 17-dimension scoring rubric (`05-SCORING_RUBRIC.md`).
- 8-phase execution protocol (`06-EXECUTION_PROTOCOL.md`).
- Integration points reference (`07-INTEGRATION_POINTS.md`) authored by B1.
- 10 known pitfalls (`08-COMMON_PITFALLS.md`).
- README + LINKS (authored by B1).

### First run
- `falcon-empty-data` — run dir: `runs/2026-05-14_falcon-empty-data/`.
- Calibration result: predicted post-run score **98.47%** (canonical band).
- Lessons rolled back into:
  - `08-COMMON_PITFALLS.md` (pitfalls 1–10 seeded from this run's pre-flight).
  - `05-SCORING_RUBRIC.md` (a11y i18n nit — `aria-label` should accept a Prop for translation).

### Calibration notes
- Strategy alignment with the codebase canonical pattern measured at ~96% in the README; first run pushed predicted alignment to ~98%.
- One transient EMFILE during Stencil compile in Phase 4, resolved by retry. Documented in pitfall #1.

---

## v1.1.0 — 2026-05-15

### Added
- **§6 — "Library = Skeleton, App = API" architectural rule** in `01-CANONICAL_PATTERN.md`. Mandates that library components are pure skeletons (no service injection); API-driven flows are owned by app-level wrapper components in `apps/host-shell/src/app/shared-components/`. Cross-app consumption via `@host-shell/shared/*` TS path alias. See `01-CANONICAL_PATTERN.md` §6.1–§6.5.
- New anti-pattern in §5 — "Library component injecting an HTTP service".

### Run
- `falcon-insufficient-balance-dialog` — run dir: `runs/2026-05-15_falcon-insufficient-balance-dialog/`. Post-run score: 99.5%.
- `do-payment-priority-popup` (Wave 16 app-level wrapper) — companion to the library skeleton above; no separate run dir because wrappers are not Falcon UI components (they live in app code).

### Lessons rolled back into
- `01-CANONICAL_PATTERN.md` §5 (anti-pattern: library service injection)
- `01-CANONICAL_PATTERN.md` §6 (new rule + worked example)

### Why MINOR
Adds a new top-level rule without breaking existing components. Library components authored before Wave 16 continue to work; the rule binds new authoring going forward.

---

## v1.3.0 — 2026-05-16

### Added
- **`ErrorDialogService`** (`libs/falcon/src/shared-data-access/lib/services/error-dialog.service.ts`) — presentation-agnostic backend-error popup state holder. Feature code calls `errorDialog.openError({ httpStatus, errorMessages })`; an app-shell-mounted host renders the dialog. Skips HTTP 401 (re-auth is the global interceptor's job per **D7**).
- **`FalconAngularErrorDialogHostComponent`** (`libs/falcon-ui-core/src/angular-wrapper/components/falcon-error-dialog-host/`) — UI host that subscribes to `ErrorDialogService` and renders one `<falcon-angular-alert-dialog>` per active state. Mounted ONCE in `apps/host-shell/src/app/app.ts` next to `<falcon-angular-message-host>`. Severity-aware (422 → warning; 4xx/5xx → danger). i18n titles `hierarchy.error.title.{status}` + fallback `default` with `{status}` interpolation. ICU-free count subtitle (`countOne` / `countOther`).
- **`CommerceSettingsService`** (`libs/falcon/src/shared-data-access/lib/services/commerce-settings.service.ts`) — reads `commerce/Settings/Get` (password-security-level, user-limit, node-cap, allowed-IPs). Defaults to a safe empty payload on any failure; consumers stay non-blocking. Used by Add User wizard mount + reserved for Add Client / Org Settings.
- **Wizard PES registry entries** under `FalconAccess.adminConsole.user.add()`, `userPermissionGroup.assign()`, `userProfilePicture.upload()` (`libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts`) — gate the wizard mount, Step 3 permission-group dropdown, Step 1 photo upload (**D1**, **D2** — disabled-with-tooltip).
- **`FIELD_LEVEL_ERROR_MAP`** (`apps/admin-console/.../add-user-wizard/models/models.ts`) — backend `FalconError.code` → `{ step, field }` registry. Consumed by `firstFailingStepFromBackend` to auto-jump to the offending step on submit-failure (**D7**).
- **`HierarchyPageStateService.wizardBackendErrors` signal** — backend error envelopes from the last failed submit. Wizard reads via `[backendErrors]` input + an `effect()` that jumps to the offending step and calls `revealErrors()`.
- **Wave 6 async-pending gate** — `userNameUniqueValidator(backendCheck, reservedSet, pendingSignal?)` toggles a host-supplied `WritableSignal<boolean>` while the backend uniqueness check is in flight. `UserPersonalStepComponent.isFormValid` now includes `&& !this.usernameCheckPending()` and the username field renders an inline token-styled spinner while pending. Forward-lock blocks Next until the check resolves.
- **Wave 5 lazy permission-groups fetch** — `UserService.listPermissionGroupsForRole(role)` invoked from `add-user-wizard.component.ts` via an `effect()` on `step2Value().role`; result feeds `permGroups` signal → passed into Step 3 via `[permGroups]` input. Empty result falls back to the in-memory `PERM_GROUP_OPTIONS` registry per the v1 contract.
- **i18n keys** (en.json + ar.json):
  - `common.ok`
  - `hierarchy.error.title.{400,403,404,409,422,500,default}` — status-keyed titles
  - `hierarchy.error.countOne` / `countOther` — ICU-free count subtitle
  - `hierarchy.error.unknown`
  - `hierarchy.addUser.success.{title,detail}` — promoted from flat string
  - `hierarchy.addClient.success.{title,detail}` — promoted from flat string
  - `hierarchy.addUser.empty.{title,description}` — PES-denied empty state
  - `hierarchy.addUser.checking` — async username probe in-flight hint

### Changed
- `HierarchyPageStateService.onAddUserSubmit` — error path rewritten to feed `wizardBackendErrors` + open `errorDialog.openError()` with inferred HTTP status. Success path now calls `FalconMessageService.add({severity:'success', summary, detail, life:10000})` instead of `FalconNotifierFacade.success()` (D4). Toast survives wizard-close + navigation back to the list view because the host lives in app shell.
- `HierarchyPageStateService.onAddClientSubmit` — same treatment as Add User. Success toast detail interpolates `{accountName}` from `payload.info.accountName`.
- `AddUserWizardComponent` — `firstFailingStepFromBackend` now reads `FIELD_LEVEL_ERROR_MAP` from models (no inline duplication).
- `UserPersonalStepComponent` — rules built inline (no DI provider) so the async username uniqueness validator can thread the component's local `usernameCheckPending` signal. The DI-token + provider pattern is preserved at the validations.ts layer for reference; orphan import is intentional and matches §7's "provider-or-inline" choice.
- `UserPermissionsStepComponent` — new `[permGroups]` input; `permGroupOptions` is now a `computed()` that overrides the registry when groups are supplied.
- `falcon-validations.ts.userNameUnique` — signature now `(backendCheck, reservedSet?, pendingSignal?, debounceMs?)`. `finalize()` resets pendingSignal on every emit/error. `named-validators.ts.userNameUniqueValidator` forwards the new arg.
- `apps/host-shell/src/app/app.ts` — now imports + mounts `<falcon-angular-error-dialog-host>`.

### Decisions captured (locked Wave 1-2)
- **D1 PES naming** — `sys.user`, `sys.user-permission-group`, `sys.user-profile-picture` under `FalconAccess.adminConsole.*`.
- **D2 PES-denied** — disabled with tooltip (not hidden) for grants user could re-acquire.
- **D3 Status field** — read-only "Pending" chip; lifecycle transitions belong to Edit User.
- **D4 Double-toast** — `notShowToaster: 'true'` header on `UserService.createUser`; error popup is the SSOT, not the global toast.
- **D5 Welcome message** — skipped.
- **D6 National ID** — optional.
- **D7 401 in popup** — skipped; global interceptor handles re-auth.
- **D8 Add Client** — documentation-only; no code changes this run.

### First reference run
- `add-user-wizard` (admin-console) — backend + PES integration end-to-end. All builds GREEN after Wave 7. Used as the worked example for the pattern.

### Why MINOR
New shared service surface (`ErrorDialogService`, `CommerceSettingsService`) + new UI host component. No breaking changes — `userNameUniqueValidator`'s new param is optional and the old positional debounce-only callers still work.

---

## v1.2.0 — 2026-05-16

### Added
- **§7 — Feature components + validation contract** in `01-CANONICAL_PATTERN.md`. Codifies the folder shape `<feature>/{models,services,validations}/` and mandates the `FALCON_VALIDATIONS` registry pattern for every feature component (wizard steps, drawer panels, page-pool forms, host-shell shared-components).
- **`10-VALIDATION_CONVENTION.md`** (new strategy doc, 9 sections) — registry API surface, per-component `validations.ts` template, provider wiring, override semantics, error-message contract + i18n namespace, migration cookbook, forbidden patterns, v2 roadmap.
- **`FALCON_VALIDATIONS` global registry** at `libs/falcon/src/shared-utils/lib/validations/`. Single DI token + `provideFalconValidations()` factory mirroring `provideFalconFacades`. Default registry implements 24 rules (sync + async) absorbed from the legacy `apps/admin-console/.../org-hierarchy-page/services/validators.ts`.
- **`FalconFieldRules<T>` generic type** + `allFieldsValid` + `fieldErrorMessage` helpers — eliminate per-component `computed()` boilerplate when iterating rules.
- **`FALCON_RESERVED_USERNAMES`** seed constant (moved from page-pool mock-tree).
- **Service-rename clarification in §7.1** — when a feature has exactly one service per type-folder, the file name and class name reflect the domain (`services/user.service.ts` → `class UserService`) rather than the chrome (`services/services.ts` → `class AddUserApiService`).

### Changed
- `apps/admin-console/.../org-hierarchy-page/services/validators.ts` — DELETED (309 lines absorbed into registry).
- `apps/admin-console/.../org-hierarchy-page/services/validation-messages.ts` — DELETED (moved to `libs/falcon/src/shared-utils/lib/validations/messages.ts`).
- `add-user-wizard/services/services.ts` → `add-user-wizard/services/user.service.ts`. `AddUserApiService` → `UserService`. Adds `getUser(id)` / `deleteUser(id)` stub signatures.
- `add-client-wizard/services/services.ts` → `add-client-wizard/services/client.service.ts`. `AddClientApiService` → `ClientService`. Service rename only — full validation refactor of Add Client wizard deferred.
- Legacy `libs/falcon/src/shared-utils/lib/validators/falcon-validators.ts` retained as `@deprecated` shim — its 6 callers (`falconStartWithLetter`, `falconUsernameFormat`, `falconPhoneNumber`, etc. directives) keep their factory signatures. The colliding `emailValidator()` factory was removed (no callers); the registry's `emailValidator: ValidatorFn` const is now canonical.

### First reference run
- `add-user-wizard` (admin-console) — all 3 steps (`user-personal-step`, `user-role-status-step`, `user-permissions-step`) refactored to the new pattern. Build hash `b3db8666b3013aea` GREEN after Wave 4 wiring; `8bfaa6facac32a61` GREEN after Wave 5 service rename.

### Why MINOR
New strategy doc + new shared-utils module surface. No breaking changes to existing components: the legacy `falcon-validators.ts` retained behaviour-identical as a deprecation shim, and the page-pool validators are now exported under the same names via the registry's `named-validators.ts` re-exports.

---

<!--
## Template for future entries — DO NOT delete; copy below and fill.

## vX.Y.Z — YYYY-MM-DD

### Added
- ...

### Changed
- ...

### Removed
- ...

### Run
- `<component-name>` — run dir: `runs/YYYY-MM-DD_<component>/`.
- Post-run score: __%.
- Lessons rolled back into: [doc-name](./doc-name.md) (describe each delta).
-->

<!--
## v1.0.1 — YYYY-MM-DD
- PATCH: …

## v1.1.0 — YYYY-MM-DD
- MINOR: …

## v2.0.0 — YYYY-MM-DD
- MAJOR: …
-->

## Reserved future sections

The headers below are placeholders. Replace each with a real entry when the version ships.

- `## v1.0.1 — TBD` — first PATCH (expected: new pitfall from second run).
- `## v1.1.0 — TBD` — first MINOR (expected: new rule once 2+ runs align on a missing convention).
- `## v2.0.0 — TBD` — reserved for the first MAJOR (e.g. adding a Vue-specific wrapper layer or a new build target).

_Last updated: 2026-05-14 — Strategy v1.0 — Author: Adnan (auto)_
