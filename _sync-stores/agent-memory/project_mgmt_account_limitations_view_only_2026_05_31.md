---
name: project_mgmt_account_limitations_view_only_2026_05_31
description: "Mgmt Settings tab -> Account Limitations is now VIEW-ONLY: each quota row shows a single [disabled] 'current / max' field (no editable Max allowed); quota never validated nor sent on Save (includeQuota=false). Deliberate override of accowner PES canEditQuota. Build-green + 10 unit tests, NO COMMITS."
metadata: 
  node_type: memory
  type: project
  originSessionId: 87697412-dfae-4839-902d-fd5e4d9f8e0d
---

🟢 IMPLEMENTED + build-green + 10 passing pure-function tests 2026-05-31. Branch `polishing-v0.4`, **NO COMMITS**. Plan-approved (`C:/Users/User/.claude/plans/luminous-singing-lightning.md`) via ExitPlanMode. Implemented via `ammar-web-platform-ui`; code directly verified by reading diffs.

**Rule (NEW):** In the **management-console** Settings tab, the **Account Limitations** panel is **view-only** — Edit mode renders identical to View mode. The 3 quota rows (Max Normal User / Max System User / Max Node Level) each show a single **`[disabled]` `<falcon-angular-input>`** displaying **`current / max`** (e.g. `3 / 10`), with caption i18n `hierarchy.settings.currentVsMax` ("Current existing / Max allowed"). No editable "Max allowed" input; never validated; never sent on Save. **Admin-console is unchanged** (its Account Limitations stays editable).

**⚠️ DELIBERATE OVERRIDE:** accowner has seeded PES `acc.quota.edit = allow` (`canEditQuota=true`) per [[project_settings_tab_per_section_view_gating_2026_05_30]]. This makes quota view-only in mgmt regardless of PES — limits are set Falcon-side. User is the business authority; plan approval = override approval. Security + Allowed IPs sections remain fully editable; `hasQuota()`/`canViewQuota` visibility gating untouched (BIZ-014 still hides the panel on the Falcon root).

**Change (6 files; mgmt + 1 shared i18n):**
- `apps/management-console/.../settings-tab/settings-tab.component.html` — 3 quota rows → single `[disabled]` input showing `current / max` via `maxNormalDisplay()`/`maxSystemDisplay()`/`maxNodeDisplay()`; removed the `@if(!readonly()&&canEditQuota){editable 2-col}@else{readonly stepper}` branches + per-row `@if(maxXxxError())`.
- `settings-tab.component.ts` — ADDED 3 display computeds reading `viewModel().quota` (`${current ?? 0} / ${max ?? 0}`); REMOVED `onLimitChange`, the 3 `maxXxxError` computeds, and now-unused imports (`FalconAngularInputNumberComponent`, `userLimitValidator`, `maxNodeLevelsValidator`, `USER_LIMIT_MAX_DIGITS`, `SETTINGS_HARD_CAP`, `String`, `SettingsFormValue`). Kept IP/Security flow intact (`onBlur`, `touched`, `ipError`, `FormControl`, `allowedIpListValidator`, …).
- `signals/settings-tab.signals.ts` — `formValid = isSettingsFormValid(this.formValue(), false)` (quota not validated); `save()` `const includeQuota = false` (quota never sent → `quotaSettings: null` → backend PRESERVES existing quota via UpdateSettingsHandler conditional update).
- `libs/falcon/src/language/i18n/{en,ar}.json` — new `hierarchy.settings.currentVsMax` (en "Current existing / Max allowed"; ar "العدد الحالي / الحد الأقصى المسموح").
- `apps/management-console/tests/org-hierarchy/settings-tab-quota-view-only.spec.ts` — NEW, 10 tests.

**KEY facts:**
- Data source for the display = `viewModel().quota.{currentNormalUserLimit,currentSystemUserLimit,currentNodeLevels}` + `{maxNormalUserLimit,maxSystemUserLimit,maxNodeLevels}` ([CODE] settings-tab models.ts:85-98). `formValue().maxNormal/maxSystem/maxNode` left populated but now vestigial (harmless; full form-model cleanup deferred).
- `isSettingsFormValid(v, includeQuota)` ([CODE] validations.ts:70) is a SHARED SoT also used by Add Client wizard Step 2 — signature UNCHANGED; only the mgmt caller now passes `false`.
- User explicitly asked for **`[disabled]`** (not `[readonly]`); used disabled per their word. If contrast is too faint, `[readonly]` is the swap.
- Spec is PURE-function (no `SettingsTabComponent` render — it imports Stencil `-tw` wrappers → `ERR_WORKER_OUT_OF_MEMORY` per vite.config.mts). Same lesson as the org-hierarchy tab spec: test slices/pure fns, not Stencil-wrapper components.

**Verification:** `nx build management-console --configuration=development --skip-nx-cache` EXIT 0 (no new warnings on edited files); vitest 10 new + 150 mgmt-suite pass. Runtime not driven (local login env-flaky per memory; build + tests are the gate).

Supersedes the quota-editing slice of [[project_settings_tab_per_section_view_gating_2026_05_30]] for mgmt (that memory's "accowner = all E" no longer applies to QUOTA in mgmt). Related: [[reference_falcon_root_node_has_tabs_keep_2026_05_30]], [[project_org_hierarchy_subnode_hide_comm_app_tabs_2026_05_31]].

---

## ADMIN parity 2026-05-31 (admin VIEW shows `current / max`, but EDIT stays editable)

🟢 DONE + build-green (admin-console `nx build … --skip-nx-cache` EXIT 0, no settings-tab warnings), via `ammar-web-platform-ui`, code-read-verified. Branch `polishing-v0.4`, NO COMMITS. User decision (AskUserQuestion 2026-05-31): edit-mode = **"Keep 2 fields (unchanged)"**.

**Difference from mgmt:** admin **keeps editing** quota — `[BRAIN-OUT/BQL] pes:sys.accountQuota.edit` (system ns) `[trust:runtime]`; admin is the Falcon side that sets limits. So ONLY the admin **VIEW** branch changed (to match the mgmt view); **EDIT** branch is byte-unchanged.

**Change (2 admin files; signals/validations/models/i18n/mgmt all UNTOUCHED):**
- `apps/admin-console/.../settings-tab/settings-tab.component.html` — for all 3 quota rows, the `@else` (view) branch's `<falcon-angular-input-number [readonly] [ngModel]="formValue().maxXxx">` → `currentVsMax` caption + `<falcon-angular-input [disabled] [ngModel]="maxNormalDisplay()">`. The `@if (!readonly() && canEditQuota)` EDIT branch (2-col Current existing readonly | Max allowed editable + onLimitChange + error state) and the `@if(maxXxxError())` blocks are **byte-unchanged**.
- `settings-tab.component.ts` — ADDED the same 3 display computeds (read `viewModel().quota`); REMOVED only `FalconAngularInputNumberComponent` (import + imports[]) and the `hardCap` field — both were used ONLY by the removed view stepper. KEPT `onLimitChange`, the 3 `maxXxxError` computeds, validators, `USER_LIMIT_MAX_DIGITS`, `String`, `SETTINGS_HARD_CAP` (edit needs them).
- **Admin signals UNCHANGED:** `formValid` keeps `hasQuota()`, `save() includeQuota = canEditQuota && hasQuota` — admin still validates + sends quota. (This is the deliberate mgmt-vs-admin asymmetry.)

**[CODE] React SoT** `new react/admin/settingstab.jsx:205-264` baseline = view: single disabled max stepper; edit: 2-col current|max. We deviate ONLY in the view (combined `current / max`) per user; edit matches SoT.

**Concurrency note:** implemented while a separate session ran a falcon-ui-core uploader-deletion task with its own `nx` builds. First admin build collided (their in-flight `defineFalconUploader` rename in `define-custom-elements.ts` — NOT our file); agent waited for idle + retried → EXIT 0. Lesson: concurrent `nx` builds in this workspace collide — serialize (poll for idle) and attribute non-settings-tab errors to the other task. `current-task.json` was owned by that session — NOT overwritten (tracked this task via plan + memory + task-history instead).
