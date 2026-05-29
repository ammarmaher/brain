---
type: report
role: night-shift-wave-3-master-plan
status: pre-launch
authored-by: Adnan / Jakco (master orchestrator)
authored-at: 2026-05-16
supersedes: KICKOFF-PROMPT.md (parked as historical trigger)
---

# Night Shift Wave #3 — Master Plan & Pre-launch Readiness

> Pre-flight readiness check complete. Awaiting explicit "go" before TIER A starts.

## 0. TL;DR

Six parallel pre-flight agents read **19 source-of-truth artifacts** plus **93 memory files** and verified disk reality. Three corrections to the original kickoff brief are noted, one enabling discovery, zero blocking surprises. All standing rules locked, all forbidden paths verified, all memory paginations built per tier, all 5 verification-gate questions answered with file:line citations.

**Status:** 🟢 **READY** for "go" trigger.
**Outstanding pre-launch action:** start docker (local backend offline) — only needed at TIER B.4 / TIER C end-to-end / TIER D runtime verification.

---

## 1. Corrections to baseline (memory ↔ disk drift)

| # | Source claim | Disk reality | Fix |
|---|---|---|---|
| 1 | `[MEMORY] project_local_backend_test_users_2026_05_16` — `Falcon/Falcon/docker-compose.yml` | Actually at `C:\Falcon\Falcon\Falcon\docker-compose.yml` (3-level nesting) | Use 3-level path in scripts |
| 2 | `[MEMORY] project_local_backend_test_users_2026_05_16` — password `Pass123!` | `[MEMORY] feedback_test_user_password_standard` — password `Admin@1234` (STANDING RULE supersedes) | All scripts + tests use `Admin@1234` |
| 3 | `[MEMORY] project_local_backend_test_users_2026_05_16` — backend live | `[CODE]` docker daemon offline; no containers running | Start docker before TIER B.4 / C end-to-end / D runtime verification |

**Enabling discovery:**
- `[CODE]` `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\` **already exists** as a skeleton with `services/client.service.ts`. TIER D is a fill-in, not a from-scratch build.
- `[CODE]` Add User wizard **already migrated** to `<falcon-angular-stepper>` from `libs/falcon-ui-core/.../falcon-stepper/`. TIER C has one production migration target (Add Client), not the originally-planned full sweep.

**No blocking surprises:**
- 0 `_drift-*.md` files in `falcon-wiki/100-Authority/` — scanner clean.
- 0 files in `falcon-wiki/_pending-questions/` — no halt-flag forks open.
- 0 conflicts between vault and memory (per `[BRAIN-OUT] vault-preflight-agent`).

---

## 2. Verification gate — 5 of 5 answered with citations

> Per `[BRAIN-OUT] Brain Outputs/datasets/authority-dataset/0-MASTER-INDEX.md:139-178` — session must answer these before any tier work.

### Q1: What does Wave #1 leave deferred?

**Six GAP-NS gaps** captured in `[VAULT] falcon-wiki/70-Gaps/GAP-NS0[1-6]*.md` and indexed in `[BRAIN-OUT] reports/night-shift-2026-05-16/05-fixes/00-AGGREGATION-AND-FIX-PLAN.md:57-67`:

| Gap | Scope | Severity | Wave #3 tier |
|---|---|---|---|
| GAP-NS01 | 871 `@Input/@Output` decorator sites in `libs/falcon-ui-core/` | Medium | TIER B.2 |
| GAP-NS02 | 21 SCSS files + 17 styleUrls + 30 `.component.css` shims workspace-wide | High | TIER B.1 (coupled to NS03 via auth) |
| GAP-NS03 | `apps/host-shell/.../auth/` — 5 SCSS, 163 phantom `--login-*`, raw inputs | High | TIER B.4 (3–5 days, runtime-verify) |
| GAP-NS04 | `apps/admin-console/.../otp-dialog.component.html` — single-file rebuild | Medium | TIER B.5 |
| GAP-NS05 | 11 raw inputs + 1 toggle + topbar menu → Falcon equivalents | Medium | TIER B.6 |
| GAP-NS06 | 9 phantom semantic tokens (warning/success/danger) | High | TIER B.3 (HALT-AND-FLAG — UX decision required) |

### Q2: What does Wave #2 surface as backend hygiene gaps?

**Four GAP-OLDUI gaps** captured in `[VAULT] falcon-wiki/70-Gaps/GAP-OLDUI-0[1-4]*.md`:

| Gap | Scope | Severity | Wave #3 tier |
|---|---|---|---|
| GAP-OLDUI-01 | Inconsistent URL prefixes workspace-wide | Medium | TIER E.1 |
| GAP-OLDUI-02 | `admin/contracts-cost-management` has 0 feature-level PES | **High** | TIER E.2 |
| GAP-OLDUI-03 | `mgmt/contracts` 5-level relative imports to admin (cross-app sibling) | Medium | TIER E.3 |
| GAP-OLDUI-04 | `admin/wallet-balance` half-built cell-edit + Save misalignment | **High** | TIER E.4 (HALT-AND-FLAG — UX direction required) |

### Q3: What is the canonical stepper reference?

**`[CODE] apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/`** uses the canonical library stepper:

- Tag: `<falcon-angular-stepper>`
- Library: `[CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/falcon-stepper.component.ts` (252 lines)
- Public API: 17 `@Input`s (steps, activeValue, completedValues, mode, orientation, size, labelPosition, showStepNumbers, showCheckOnComplete, helperText, errorMessage, groupLabel, ariaLabel, **forwardLockedFrom**, useTailwind, rootClass, disabled) + 4 `@Output`s (valueChange, stepClick, stepComplete, **navigationBlocked**)
- Step-validity gate: declarative `[forwardLockedFrom]` computed signal at `add-user-wizard.component.ts:325-327` — `[currentStep]` when invalid, `[]` when valid; library rejects forward nav internally
- Error reveal: `(navigationBlocked)` event → `onNavigationBlocked()` at `add-user-wizard.component.ts:307-311` → `revealErrors()` on step component (WizardStepHost interface at `models/models.ts:6-8`)
- Step labels: i18n-reactive via `combineLatest` subscription at `add-user-wizard.component.ts:180-190`

**Migration target:** Add Client wizard at `add-client-wizard.component.html:56` still uses legacy local `<falcon-stepper>` (from `libs/falcon/src/shared-ui/lib/components/falcon-stepper/`). Migration = swap 2 files (`.ts` + `.html`), mirror Add User's commit at `[CODE] add-user-wizard.component.ts:2-4` (the swap was one-line-revertable).

### Q4: What is the canonical Add Client playbook root?

**`[BRAIN-OUT] Brain Outputs/understanding/pages/organization-hierarchy/Add Client/`** — 21 files (not 17 as memory said; 4 supplementary docs added 2026-05-16 PM):

- **Core 16**: `README.md` + `00-OVERVIEW.md` + `01-PERMISSIONS.md` + `02..06-STEP_[1-5]_*.md` + `07-VALIDATIONS.md` + `08-BACKEND_API.md` + `09-COMPONENTS.md` + `10-KAFKA_SIDE_EFFECTS.md` + `11-STATE_TRANSITIONS.md` + `12-ERROR_STATES.md` + `13-GAPS_AND_DRIFTS.md` + `14-IMPLEMENTATION_CHECKLIST.md`
- **Plan**: `15-IMPLEMENTATION_PLAN.md` (v2.1, disk-true, 7-session sequencing)
- **Resolutions**: `16-OPEN_QUESTIONS_RESOLVED.md` (8 of 9 blockers resolved; Q6 Step 3 CommChannels catalog partial — endpoint not yet in Commerce ENDPOINT_REGISTRY)
- **Supplements (2026-05-16 PM)**: `17-BACKEND_QUESTION_Q6...md` + `18-STEP_1_RESEARCH_AND_PLAN.md` + `19-COMPONENT_CUSTOMIZATION_PLAN.md` + `20-MAIN_BRANCH_FIDELITY_PLAN.md` + `21-FALCON_COMPONENTS_ONLY_PLAN.md`
- **Legacy**: `PLAYBOOK.md` (62 KB monolith — same content as 00-14 combined)

### Q5: Which tokens are runtime-verified?

Per `[BRAIN-OUT] Brain Outputs/datasets/authority-dataset/VERIFICATION-STATUS.md`:

- **✋ Runtime-verified (21/21)**: All PES decisions across 6 test users — `acc-owner allow` (5 resources), `acc-owner deny` (2), `acc-admin allow/deny` (3), `acc-user allow/deny` (3), `app.admin-console deny` (1). Evidence at `_runtime-verification/comms-hub-2026-05-16.md` + `pes-gate-results-2026-05-16.json`.
- **🟢 Code-verified (8 claims)**: 6 canonical roles · 47 PES key factories · role-edit matrix · 9 status enums · JWT contract · gateway routing.
- **🟢 Build-verified (3 artifacts)**: `nx build management-console` GREEN at hash `e5a896fdae1d8f80`, scanner end-to-end 3 passes, drift detection on real change.
- **🟡 Structurally checked (5 items)**: 118 dataset artifacts exist, vault wikilinks resolve, 19 verification-gate questions answered, 25 V-rule files, 15 E-* entity files.
- **🔴 NOT runtime-verified**: comms-hub route reachable from host-shell · Falcon UI Core components render correctly · i18n+RTL at runtime · FE-level UI workspace compile (BLOCKED on 40+ Stencil/Angular errors).

---

## 3. Refined 7-tier execution plan

> Sequencing is intentional. Each tier starts only when its predecessor's acceptance criteria are met. Tiers C and D can partially overlap because C's only production target (Add Client) is also D's subject — TIER C work happens *inside* TIER D's wizard.

### TIER A — Pre-flight unblock (40+ compile errors)

**Goal**: Catalog the 40+ pre-existing Stencil/Angular compile errors, classify by root cause, fix non-overlapping clusters in parallel, return builds green per app.

**Method**:
1. Dispatch one senior-architect agent to run `nx build admin-console && nx build host-shell && nx build management-console` (and lib builds), capture full error output, classify by (file, error code, root cause). Output: `03-tier-A-preflight-fixes.md` with a clustered error matrix.
2. Per non-overlapping cluster, dispatch a fix agent. Build verify per app after each cluster.
3. If root cause is workspace-state (tsconfig drift, lockfile mismatch, lib path-alias), document + apply minimal fix; never pollute app code.
4. If a cluster requires an architecture decision (e.g. retire a Stencil v1 component), HALT-AND-FLAG.

**Acceptance**: `nx build admin-console && host-shell && management-console && lib falcon-ui-core` all return exit 0.

**Risk**: HIGH — workspace-state blocker since 2026-05-16 (per `[BRAIN-OUT] VERIFICATION-STATUS.md:98` Fork F-007). Could require multi-hour catalog.

### TIER B — Wave #1 deferreds (GAP-NS01..06)

Six sub-tiers, sequenced to respect dependencies:

- **B.1** GAP-NS02 SCSS/styleUrls purge — start with non-auth scopes (admin styles.scss + project.json + 8 lib `.scss` + 17 styleUrls). Auth (5 SCSS) deferred to B.4. Build verify per app after each batch.
- **B.2** GAP-NS01 decorator codemod — ts-morph batches of ~30 components, build verify per batch. Template binding sites (`{{prop}}` → `{{prop()}}`) co-edited.
- **B.3** GAP-NS06 phantom semantic tokens — **HALT-AND-FLAG** (UX decision: extend Noor palette with semantic tokens vs remap to existing amber/green/red shades). Write `_pending-questions/wave3-tierB3-phantom-tokens.md`.
- **B.4** GAP-NS03 host-shell auth rebuild — define/remap `--login-*` tokens, rebuild login/OTP/forgot-password/change-password on Tailwind + Falcon library, delete 5 SCSS files. **Runtime-verify** with seeded test users (`Admin@1234`) — requires docker up.
- **B.5** GAP-NS04 otp-dialog single-file rebuild — strip `<style>`, 9 inline `style=""`, 12 `text-[Npx]`, 2 raw `<button>`. **Runtime-verify** behavior unchanged.
- **B.6** GAP-NS05 library-first refactors — 11 raw `<input>` + 1 toggle + topbar menu → Falcon equivalents. Per-feature mini-batches with UX review per PR.

**Acceptance**: All 6 GAP-NS notes status flipped to `resolved` or `further-scoped-with-halt-flag` in `[VAULT] 70-Gaps/`. Builds green per app per sub-tier.

### TIER C — Stepper unification

> User instruction: every stepper in the workspace must match the Add User wizard.

**Inventory** (from `[CODE]` pre-flight scan):

| Site | Tag | Status |
|---|---|---|
| admin-console / Add User Wizard | `<falcon-angular-stepper>` | ✅ Canonical (reference) |
| admin-console / Add Client Wizard | `<falcon-stepper>` (legacy local) | ❌ MIGRATION TARGET |
| host-shell / playground (13 instances) | `<falcon-angular-stepper>` | ✅ Non-production demo |
| libs/falcon-ui-core / falcon-stepper | n/a | ✅ Library component |
| libs/falcon / falcon-stepper (legacy) | n/a | ⚠️ Legacy, used only by Add Client |

**Method**:
- C.1 Write inventory + reference spec to `01-stepper-inventory.md` and `02-stepper-reference-spec.md`.
- C.2 Migrate Add Client wizard — swap `<falcon-stepper>` → `<falcon-angular-stepper>` in `add-client-wizard.component.html` + adjust imports + computed signal wiring (mirror Add User's `add-user-wizard.component.ts:2-4` pattern). 2 files, build verify, runtime-verify end-to-end.
- C.3 Either retire `libs/falcon/.../falcon-stepper/` (if Add Client is the only consumer) or flag deprecation banner.
- C.4 Capture refactor in vault + memory.

**Acceptance**: Single canonical stepper in production. Add Client wizard renders + navigates + validates identically to Add User. Inventory file updated. Legacy stepper either deleted or deprecation-marked.

**Note**: TIER C is technically a 2-file edit; the real complexity sits in TIER D (the wizard itself).

### TIER D — Add Client wizard implementation

**Goal**: Complete the 5-step Add Client wizard at `[CODE] add-client-wizard/`, using canonical stepper, V-rule registry, PES batched flags, and the captured backend contract.

**Sequencing** (mirrors `[BRAIN-OUT] Add Client/15-IMPLEMENTATION_PLAN.md` v2.1 §7):
- **D.1 Scaffolding** — verify folder structure conforms to `[MEMORY] project_falcon_component_validation_convention` (`<step>/models/`, `<step>/services/`, `<step>/validations/`). Add `AddClientWizardStateService` (5 step form-value signals + 5 valid/dirty signals + `currentStep` signal + `selectedPasswordSecurityLevel` signal + `tenantContext` signal) scoped at wizard component (NEVER `providedIn: 'root'`).
- **D.2 Step 1 — Information** — 20 fields, cascade Country→City lookups, conditional Budget Number based on Authority Letter Type, async `accountName` uniqueness via `AccountValidationService.checkAccountNameExists()`, image upload validator (MIME + 4 MB).
- **D.3 Step 2 — Settings** — 6 fields: PasswordSecurityLevel (2-value enum Normal/Advanced per Q3 resolution), Allowed IPs editor (IPv4/IPv6 + CIDR + duplicate check), 4 account limits.
- **D.4 Step 3 — CommChannels** — optional; CommChannels catalog via `GET /api/CommunicationChannel` (Q6 partial — fallback to mock if endpoint unconfirmed by backend). Per-row Visibility toggle + PricingType + PriceValue.
- **D.5 Step 4 — Applications** — optional; mirrors Step 3 shape with `GET /api/Application`.
- **D.6 Step 5 — Account Owner** — 8 fields including FirstName, LastName, Username (FE max 30; **drift #2: backend allows 100**), async username uniqueness via `AccountValidationService.isUserExist()`, phone (E.164), email, Role (PES-driven via `AccessControlFacade.authorize()` per Q2 resolution; locked to `account-owner`). Password auto-generated server-side from Step 2's PasswordSecurityLevel; NO password input rendered.
- **D.7 Composite submit** — single `POST /commerce/Node/create-account` via System Gateway. PascalCase payload (Commerce deviation). Map all error codes per `[BRAIN-OUT] Add Client/12-ERROR_STATES.md`.
- **D.8 Runtime-verify** — log in as `sysadmin/Admin@1234`, full wizard end-to-end, check Kafka side effects (UserCreationRequested → Identity, WalletConfigured → Charging, IdentitySettingsSync, TenantIpAllowlistChanged), confirm new node appears under Falcon root.

**HALT-AND-FLAG triggers**:
- Q6 CommChannels catalog endpoint not confirmed by backend → flag, use mock with Light Learning event.
- Username 30 ↔ 100 drift not resolved → FE enforces 30 per `[BRAIN-OUT] Add Client/13-GAPS_AND_DRIFTS.md` drift #2.
- Any new error code not in `12-ERROR_STATES.md` → flag.
- Phone/Email lack `[ThrowIfNotPassed]` backend (drift #14) — FE enforces required.

**Acceptance**: Wizard renders all 5 steps · stepper validity gating works · all V-rules wired via FALCON_VALIDATIONS registry + per-step InjectionToken+RulesProvider factory · all PES via `AccessControlFacade.resolveFlags({...})` batched · composite POST shape matches captured contract byte-for-byte · runtime-verified end-to-end · 8 verification questions answerable with citations per `[BRAIN-OUT] Add Client/14-IMPLEMENTATION_CHECKLIST.md:9-21`.

### TIER E — Wave #2 backend-hygiene gaps

- **E.1** GAP-OLDUI-01 URL prefix consistency — pick `<service>/<resource>` lowercase canonical (auth + testing stay as-is). Add grep gate to fail builds on old patterns. Migrate non-conforming callers (wallet-balance.service.ts mixes 3 prefixes; org-hierarchy.api.service.ts uses PascalCase; contracts-api.service.ts diverges admin vs mgmt).
- **E.2** GAP-OLDUI-02 add PES to admin-console/contracts-cost-management — define `FalconAccess.adminConsole.contract.{view,create,edit,delete,viewBalanceSummaries}()` (mirroring mgmt's `managementConsole.contract.view()`). Add `shellAccessGuard` to route with `data.access = ...view()`. Resolve flags batch in component init. Runtime-verify with non-Falcon user.
- **E.3** GAP-OLDUI-03 extract shared mgmt/admin contracts components → `libs/falcon/contracts/` or `libs/shared-contracts/`. Update tsconfig.base.json path aliases. Replace 5-level relative imports with `@falcon/contracts/*`. Run `nx graph` to verify zero `apps/*` → `apps/*` edges. Optional: ESLint gate.
- **E.4** GAP-OLDUI-04 wallet cell-edit dead code — **HALT-AND-FLAG** (UX call: remove dead code (Option B preferred per gap note) vs complete cell-edit as v2 phase). Write `_pending-questions/wave3-tierE4-wallet-cell-edit.md`.

**Acceptance**: 4 GAP-OLDUI notes status flipped to `resolved` or `further-scoped-with-halt-flag`. Builds green per app.

### TIER F — Continuous architecture / coding / cleaning enforcement

Throughout every tier, every dispatched agent enforces the 38-rule digest at `[BRAIN-OUT] reports/night-shift-2026-05-16/01-rules-digest.md`:

- P0 (6 build-blocking): No PrimeNG / No SCSS+inline / No hardcoded design values / No z-index hacks / Build green / Noor naming.
- P1 (15 correctness): Falcon library first / skeleton+wrapper / Angular 21 idioms / signals over RxJS / `input()/output()` over decorators / `@if`/`@for` over `*ngIf`/`*ngFor` / FormBuilder reactive forms / `inject()` over constructor / standalone-default (no `standalone: true` literal) / grid-first / auth via Identity Service / workspace paths / i18n+RTL / a11y / token reality / etc.
- P2 (17 cleanliness): Terse comments / DRY / OnPush / `providedIn:'root'` / strict TS / NgOptimizedImage / lazy routes / logical CSS properties / no DOM access / no innerHTML / clean imports / etc.

**Acceptance**: zero new violations introduced — pre-finish grep gate per `[MEMORY] feedback_no_inline_styles_tokens_only`.

### TIER G — Knowledge capture (continuous)

Throughout every tier:
- G.1 Update `[VAULT]` per-folder notes + gap-close notes for every tier finished.
- G.2 Update shared memory — one-line summary in `MEMORY.md` + detailed memory file per tier.
- G.3 Re-run Authority Dataset scanner if any of the 67 canonical files changed: `pwsh "C:\Falcon\falcon-wiki\scripts\scan-authority.ps1"`.
- G.4 Update `[BRAIN-OUT] VERIFICATION-STATUS.md` when something moves 🔴 → 🟡 → ✋.

**Acceptance**: vault + memory + scanner up to date · zero drift on push.

---

## 4. Memory pagination per tier

> Each tier-agent gets the relevant block at the top of its prompt so it grounds in the right context fast.

### TIER A — Pre-flight unblock

| Memory | Vault | Brain-Out | Code |
|---|---|---|---|
| `[MEMORY] learning_webstorm_angular_ide_recognition` (Nx + Angular LS quirks)<br>`[MEMORY] feedback_orchestrator_failure_modes_org_hierarchy` (10 rules)<br>`[MEMORY] feedback_no_inline_styles_tokens_only` | `[VAULT] 00-MOCs/IDE-Setup-Doctrine-WebStorm-Angular-Nx.md`<br>`[VAULT] 00-MOCs/Night-Shift-2026-05-16.md` | `[BRAIN-OUT] reports/night-shift-2026-05-16/REPORT.md`<br>`[BRAIN-OUT] datasets/authority-dataset/VERIFICATION-STATUS.md` (Fork F-007 — workspace compile)<br>`[BRAIN-OUT] datasets/authority-dataset/19-night-shift-readiness/DECISION-PROTOCOL.md` | `[CODE] apps/admin-console/project.json`<br>`[CODE] apps/host-shell/project.json`<br>`[CODE] apps/management-console/project.json`<br>`[CODE] tsconfig.base.json`<br>`[CODE] libs/falcon-ui-core/project.json` |

### TIER B — GAP-NS01..06

| Memory | Vault | Brain-Out | Code |
|---|---|---|---|
| `[MEMORY] project_night_shift_2026_05_16`<br>`[MEMORY] feedback_no_inline_styles_tokens_only`<br>`[MEMORY] project_zindex_calendar_portal_root_cause_fix` (z-tier ladder)<br>`[MEMORY] feedback_falcon_custom_library_mandatory`<br>`[MEMORY] feedback_library_skeleton_app_api` | `[VAULT] 70-Gaps/GAP-NS01..06*.md`<br>`[VAULT] 00-MOCs/Night-Shift-2026-05-16.md` | `[BRAIN-OUT] reports/night-shift-2026-05-16/REPORT.md`<br>`[BRAIN-OUT] reports/night-shift-2026-05-16/01-rules-digest.md` (38 rules)<br>`[BRAIN-OUT] reports/night-shift-2026-05-16/02-token-registry-quick-grep.txt` (3,485 vars + 2,251 classes)<br>`[BRAIN-OUT] reports/night-shift-2026-05-16/05-fixes/00-AGGREGATION-AND-FIX-PLAN.md` | `[CODE] apps/host-shell/src/app/features/auth/` (B.4 target)<br>`[CODE] apps/admin-console/.../otp-dialog.component.html` (B.5 target)<br>`[CODE] libs/falcon-ui-core/src/angular-wrapper/` (871 decorator sites for B.2) |

### TIER C — Stepper unification

| Memory | Vault | Brain-Out | Code |
|---|---|---|---|
| `[MEMORY] project_add_user_backend_pes_integration` (Add User reference)<br>`[MEMORY] project_wizard_live_node_binding` (live-node binding in Add Client + Add User)<br>`[MEMORY] project_falcon_component_validation_convention`<br>`[MEMORY] feedback_library_skeleton_app_api` | `[VAULT] 00-MOCs/Frontend-Master.md` | `[BRAIN-OUT] understanding/frontend/components/` (component dossiers if exists)<br>`[BRAIN-OUT] Add Client/09-COMPONENTS.md` (component customization order) | `[CODE] apps/admin-console/.../add-user-wizard/` (canonical reference)<br>`[CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/` (library stepper)<br>`[CODE] libs/falcon/src/shared-ui/lib/components/falcon-stepper/` (legacy, retire candidate)<br>`[CODE] apps/admin-console/.../add-client-wizard/` (MIGRATION TARGET) |

### TIER D — Add Client wizard

| Memory | Vault | Brain-Out | Code |
|---|---|---|---|
| `[MEMORY] project_add_user_backend_pes_integration` (reference for ErrorDialog + FIELD_LEVEL_ERROR_MAP + async-pending)<br>`[MEMORY] project_wizard_live_node_binding` (Add Client = discard dialog on non-root click; wizard chrome avatar+name binds to state.selectedNode())<br>`[MEMORY] project_falcon_component_validation_convention`<br>`[MEMORY] project_old_ui_dataset_2026_05_16` (backend contract)<br>`[MEMORY] feedback_pes_g_link_uses_zitadel_id`<br>`[MEMORY] feedback_orchestrator_failure_modes_org_hierarchy`<br>`[MEMORY] feedback_test_user_password_standard` (Admin@1234) | `[VAULT] 00-MOCs/Add-Client-Brain-Coverage-Report.md`<br>`[VAULT] 00-MOCs/Add-Client-Deep-Analysis-v2.md`<br>`[VAULT] 00-MOCs/PES-Subject-Contract.md`<br>`[VAULT] 00-MOCs/Authorization-Security-MOC.md` | `[BRAIN-OUT] understanding/pages/organization-hierarchy/Add Client/` (all 21 files — README first, 15-IMPLEMENTATION_PLAN + 16-OPEN_QUESTIONS_RESOLVED + 08-BACKEND_API + 07-VALIDATIONS critical)<br>`[BRAIN-OUT] datasets/authority-dataset/14-flow-playbook-integration/` (Add Client MATRIX)<br>`[BRAIN-OUT] datasets/authority-dataset/03-pes-keys/` (47 PES factories)<br>`[BRAIN-OUT] datasets/authority-dataset/06-validation-by-feature/` (25 V-rules)<br>`[BRAIN-OUT] datasets/authority-dataset/08-entity-drift-by-feature/` (15 entities)<br>`[BRAIN-OUT] datasets/authority-dataset/13-error-catalog/` (~130 codes)<br>`[BRAIN-OUT] datasets/old-ui-dataset/10-pages/admin-console/organization-hierarchy/` (live backend contract: 03-SERVICES-APIS, 04-DTOS, 05-PES, 06-VALIDATIONS, 07-CROSS-PAGE) | `[CODE] apps/admin-console/.../add-client-wizard/` (skeleton already exists — fill in)<br>`[CODE] libs/falcon/src/shared-utils/lib/validations/` (FALCON_VALIDATIONS registry)<br>`[CODE] libs/falcon/src/core/lib/access-control/access-control.facade.ts` (PES integration)<br>`[CODE] libs/falcon/.../shared-data-access/lib/services/account-validation.service.ts` (async validators) |

### TIER E — Backend hygiene (GAP-OLDUI)

| Memory | Vault | Brain-Out | Code |
|---|---|---|---|
| `[MEMORY] project_old_ui_dataset_2026_05_16`<br>`[MEMORY] feedback_falcon_custom_library_mandatory`<br>`[MEMORY] feedback_pes_g_link_uses_zitadel_id` | `[VAULT] 70-Gaps/GAP-OLDUI-0[1-4]*.md`<br>`[VAULT] 00-MOCs/Old-UI-Dataset-Index.md` | `[BRAIN-OUT] datasets/old-ui-dataset/99-registries/02-API-REGISTRY.md` (88 endpoints — for URL prefix audit)<br>`[BRAIN-OUT] datasets/old-ui-dataset/99-registries/04-PES-REGISTRY.md` (56 keys + dynamic family)<br>`[BRAIN-OUT] datasets/old-ui-dataset/10-pages/admin-console/contracts-cost-management/` (0 PES baseline)<br>`[BRAIN-OUT] datasets/old-ui-dataset/10-pages/admin-console/wallet-balance-management/` (cell-edit dead code) | `[CODE] apps/admin-console/.../contracts-cost-management/`<br>`[CODE] apps/management-console/.../contracts-cost-management/`<br>`[CODE] libs/falcon/.../access-control/` |

### TIER F — Continuous enforcement

| Memory | Vault | Brain-Out | Code |
|---|---|---|---|
| All `[MEMORY] feedback_*.md` (46 standing rules) | `[VAULT] Conventions.md`<br>`[VAULT] Glossary.md`<br>`[VAULT] 00-MOCs/AI-Agent-Onboarding.md` | `[BRAIN-OUT] reports/night-shift-2026-05-16/01-rules-digest.md` (38 rules with audit heuristics) | (every file touched by every tier) |

### TIER G — Knowledge capture

| Memory | Vault | Brain-Out | Code |
|---|---|---|---|
| `[MEMORY] feedback_self_explore`<br>`[MEMORY] feedback_orchestrator_failure_modes_org_hierarchy` (USER-VERIFIED vs AGENT-VERIFIED tags) | `[VAULT] _templates/` (new-page, new-component, new-gap)<br>`[VAULT] Conventions.md`<br>`[VAULT] 70-Gaps/` (close notes) | `[BRAIN-OUT] datasets/authority-dataset/20-brain-maintenance/MEMORY-GROW-PROTOCOL.md`<br>`[BRAIN-OUT] reports/night-shift-wave-3/` (this folder — per-tier logs) | `[CODE] falcon-wiki/scripts/scan-authority.ps1`<br>`[CODE] falcon-wiki/scripts/scan-authority.config.json` (67 canonical files) |

---

## 5. Standing rules (locked, non-negotiable)

From `[MEMORY] feedback_*` files. Every Wave #3 agent inherits these.

1. **No commits** unless the user types "commit" in their next message (`[MEMORY] feedback_never_commit_without_explicit_permission`).
2. **No pushes** unless the user types "push" in their next message (`[MEMORY] feedback_never_push_without_explicit_permission`).
3. **Source-prefix every Falcon fact** with `[CODE]/[BRAIN-OUT]/[VAULT]/[BRAIN-SK]/[MEMORY]/[INFERRED]`.
4. **HALT-AND-FLAG** when ambiguity score ≥ 7 or any security/data-integrity fork lacks a rule (`[BRAIN-OUT] DECISION-PROTOCOL.md`). Write `_pending-questions/<task>-<fork>.md`.
5. **Build green per app** at end of every batch. Roll back on red.
6. **Falcon library first** (`[MEMORY] feedback_falcon_custom_library_mandatory`). Hand-rolled markup is a GAP, not a fix.
7. **Skeleton+wrapper** boundary (`[MEMORY] feedback_library_skeleton_app_api`). Library = skeleton (presentational), app = wrapper (API).
8. **Tokens only** — no inline styles, no hardcoded values (`[MEMORY] feedback_no_inline_styles_tokens_only`). Pre-finish grep gate.
9. **No PrimeNG / No PrimeIcons / No SCSS** in new code.
10. **No edits** to `deprecated-falcon-web-platform-ui` or `WebstormProjects` duplicate path.
11. **Old-UI worktree at `[BRAIN-OUT] worktrees/falcon-old-ui-main/` is READ-ONLY.**
12. **Test user password = `Admin@1234`** (`[MEMORY] feedback_test_user_password_standard` — supersedes any older `Pass123!` reference).
13. **PES g-rule subjects use Zitadel id (JWT.sub), not Mongo `_id`** (`[MEMORY] feedback_pes_g_link_uses_zitadel_id`).
14. **Frontend never calls Zitadel directly** — auth flows through Identity Service (`[MEMORY] feedback_frontend_auth_identity_service`).
15. **Spec-before-code** + **USER-VERIFIED vs AGENT-VERIFIED tags** + **side-by-side evidence per closure** (`[MEMORY] feedback_orchestrator_failure_modes_org_hierarchy` rules R1-R10).

---

## 6. Forbidden paths (verified, will skip)

- ❌ `C:\Falcon\deprecated-falcon-web-platform-ui\` (exists; never edit)
- ❌ `C:\Falcon\Falcon\deprecated-falcon-web-platform-ui\` (exists; never edit)
- ❌ `C:\Users\User\WebstormProjects\falcon-web-platform-ui\` (exists; isolation copy, never edit)
- 🔒 `C:\Falcon\Brain Outputs\worktrees\falcon-old-ui-main\` (READ-ONLY origin/main worktree)

---

## 7. Output workspace

`C:\Falcon\Brain Outputs\reports\night-shift-wave-3\`:

```
night-shift-wave-3/
├── KICKOFF-PROMPT.md                    [historical trigger, parked]
├── 00-PLAN.md                           [this file — master plan]
├── 01-stepper-inventory.md              [TIER C]
├── 02-stepper-reference-spec.md         [TIER C]
├── 03-tier-A-preflight-fixes.md         [TIER A]
├── 04-tier-B-fixes/                     [TIER B — one log per GAP-NS]
├── 05-tier-C-stepper-migration/         [TIER C]
├── 06-tier-D-add-client-wizard/         [TIER D — BUILD-LOG + RUNTIME-VERIFICATION + CONTRACT-PARITY]
├── 07-tier-E-backend-hygiene/           [TIER E — one log per GAP-OLDUI]
├── 08-build-verify/build-log.md         [continuous]
├── 09-obsidian-writebacks/              [continuous]
└── REPORT.md                            [final synthesis]
```

---

## 8. Launch checklist (on "go")

In order:
1. Acknowledge brain-first protocol verbally.
2. (Optional, if user wants runtime verification at TIER B.4/C/D) **Start docker**: `cd C:\Falcon\Falcon\Falcon && docker compose up -d` (3-level path).
3. Dispatch TIER A agent (parallel: one cataloger + N fixers per cluster).
4. Build verify after each cluster.
5. Proceed to TIER B.1..B.6 in sequence; HALT at B.3 for UX call; resume.
6. Proceed to TIER C (2-file Add Client stepper swap).
7. Proceed to TIER D (Add Client wizard, 8 sub-steps); HALT at D.4 if Q6 catalog still unconfirmed (use mock + Light Learning event).
8. Proceed to TIER E.1..E.4; HALT at E.4 for UX call on wallet cell-edit.
9. TIER F + G run continuously throughout — every agent enforces 38 rules + every tier writes back to vault/memory/scanner.
10. Final synthesis at REPORT.md.

---

## 9. Resume triggers (if session breaks)

- `continue Night Shift Wave #3`
- `work TIER <X> of Night Shift Wave #3` (X = A/B/C/D/E)
- `resume TIER B.<n>` (sub-tier specific)

Pre-flight state is captured in `[MEMORY] project_night_shift_wave3_preflight.md`. A new session can restore by reading that file + this 00-PLAN.md + the 5-Q gate above.

---

## 10. Open halt-flag candidates (pre-launch)

These are likely halts during execution — listed here so user knows the decision points in advance:

| # | Fork | Tier | Decision needed |
|---|---|---|---|
| 1 | GAP-NS06 phantom tokens (warning/success/danger) | B.3 | Extend Noor palette with semantic tokens OR remap to existing amber/green/red shades (preferred). **UX decision required.** |
| 2 | GAP-NS04 OTP dialog top-layer | B.5 | Verify `<falcon-angular-dialog>` supports top-layer + `::backdrop`. If not, keep native `<dialog>`. **Library-capability check.** |
| 3 | TIER A: any cluster that requires retiring a Stencil v1 component | A | Architecture decision — retire vs keep. **Workspace-state decision.** |
| 4 | Q6 CommChannels catalog endpoint | D.4 | Backend to confirm endpoint exists OR FE uses mock. **Backend confirmation.** |
| 5 | Username 30 ↔ 100 drift | D.6 | FE enforces 30 per playbook drift #2; confirm backend doesn't reject < 100. **Drift acknowledgment.** |
| 6 | GAP-OLDUI-04 wallet cell-edit | E.4 | Remove dead code (Option B preferred) vs complete cell-edit as v2 phase. **UX decision.** |

---

*End of 00-PLAN.md. Authored 2026-05-16 by Adnan / Jakco at session-start pre-flight. Awaiting "go" to launch TIER A.*
