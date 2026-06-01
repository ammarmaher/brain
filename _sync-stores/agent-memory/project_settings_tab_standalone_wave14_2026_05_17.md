---
type: project-topic
status: 🟢 LANDED
date: 2026-05-17
project: falcon-web-platform-ui / admin-console
feature: Organization Hierarchy → Settings tab (standalone rewrite)
wave: 14 (Settings tab)
originSessionId: b1cdf0bc-c22f-4a68-a2ee-e97ceb110c7e
---
# Settings Tab — Standalone Rewrite (Wave 14, 2026-05-17)

## TL;DR

🟢 LANDED 2026-05-17. `nx build admin-console` GREEN hash `c3c6260390f30552` / 16.94s.
**Replaced** the wizard-coupled Settings tab (a thin shell over `ClientSettingsStepComponent` from Add Client wizard Step 2) with a **fully standalone** component owning its own state slice, services, validations, and PES wiring. Reuses ONLY Falcon library components (no native primitives).

## Problem

[CODE] `apps/admin-console/.../tab-components/settings-tab/settings-tab.component.ts` (pre-Wave-14) imported `ClientSettingsStepComponent` from the Add Client wizard, had no real backend GET/PUT, no PES gate, and rendered its own duplicate node header — the SHARED `<falcon-node-details-section>` header used by every other tab was carved out by `@if (!isSettingsTab && ...)` on [CODE] `org-hierarchy-page-menu.component.html:108`.

## Solution — file map (7 new, 5 modified, 2 deleted)

**NEW** under `apps/admin-console/.../tab-components/settings-tab/`:
- `models/models.ts` — `SettingsViewModel` · `SettingsFormValue` · `SettingsPesFlags` · Wire ↔ Form mappers (`fromGetSettingsResponse` · `toUpdateSettingsRequest` · `viewModelToFormValue` · `formEquals`)
- `services/settings.service.ts` — `getSettings(ownerId)` → `GET commerce/setting?ownerId=` · `updateSettings(...)` → `PUT commerce/setting` (System Gateway, `notShowToaster: 'true'`, single-options-object pattern from Wave 11 user.service fix)
- `validations/validations.ts` — `SETTINGS_TAB_VALIDATIONS` InjectionToken + `settingsTabRulesProvider()` + `isSettingsFormValid()` + `passwordSecurityLevelValidator`
- `signals/settings-tab.signals.ts` — `SettingsTabStateSlice` (page-scoped): mount-time `forkJoin(resolveFlags, getSettings)`, mode signal (`loading`/`view`/`edit`/`error`), `formValue`/`snapshot`/`formDirty` tracker, `submitting` flag with RxJS `finalize()`, discard-prompt orchestration
- `settings-tab.component.ts` — standalone, body-only (no header, no buttons — those live in the parent shared slot)
- `settings-tab.component.html` — left card (Password Security radio cards + Allowed IPs chip flow) + right aside (Account Limitations stepper) + IP delete confirm dialog. Falcon-only: `<falcon-angular-radio>` · `<falcon-angular-input>` · `<falcon-angular-button>` · `<falcon-angular-tag>` · `<falcon-angular-input-number>` · `<falcon-angular-alert-dialog>`
- `index.ts` — barrel: `SettingsTabComponent` + `SettingsTabStateSlice` + `SettingsService` + types

**MODIFIED**:
- `services/hierarchy-page-state.service.ts` — drop `SettingsStateSlice`, add `SettingsTabStateSlice` + `SettingsService` to `HIERARCHY_PAGE_STATE_PROVIDERS`. Re-export 11 new signals/methods via `state.settings*` (`settingsMode`/`settingsViewModel`/`settingsFormValue`/`settingsPesFlags`/`settingsLoadError`/`settingsSubmitting`/`settingsHasQuota`/`settingsFormDirty`/`settingsFormValid`/`settingsShowDiscardPrompt`/`settingsEditMode` + `enterSettingsEdit()`/`cancelSettingsEdit()`/`saveSettings()`/`updateSettingsField()`/`onConfirmSettingsDiscard()`/`onDismissSettingsDiscard()`). Insert tree-click guard in `onTreeSelect()` mirroring the Add Client `pendingTreeSelection` pattern.
- `services/state/users-state.signals.ts` — `visibleTabs` is now **node-type-aware**: Falcon root → `[hierarchy, settings]`, client root → `[hierarchy, commChannels, apps, settings]`, **sub-node → `[hierarchy, commChannels, apps]`** (pre-empts the `SettingsOnlyAllowedForMainNode` 422 from backend [CODE] `UpdateSettingsHandler.cs:53-54`).
- `components/org-hierarchy-page-menu.component.html` — drop `!isSettingsTab` from header guard so Settings shares the same `<falcon-node-details-section>` + `<app-org-node-avatar>` as every other tab. Add 2 action-slot branches: `isSettingsTab && settingsEditMode()` → Cancel + Save Changes (with `[loading]=submitting` and `[disabled]=!valid||!dirty||submitting`); `isSettingsTab && mode==='view'` → Edit button gated on `pesFlags`. Add `<falcon-angular-popup variant="unsaved">` for the discard prompt.
- `components/wizard-components/add-client-wizard/client-settings-step/signals/client-settings-step.signals.ts` — refresh stale header comment that referenced the deleted hydration path.

**DELETED**:
- `services/state/settings-state.signals.ts` (in-memory wizard-coupled stub — no consumers)
- `services/shared/account-settings.helpers.ts` (`fromAccountSettings`/`toAccountSettings` only consumed by the deleted slice)

## Backend contract (locked, [CODE]-verified)

| Op | Method · Path | Gateway | Throws |
|---|---|---|---|
| Load | `GET commerce/setting?ownerId={id}` | System Gateway | (none on read; `OwnerIdNotMatchWithTenantId` for cross-tenant client) |
| Save | `PUT commerce/setting` body `{ownerId, securitySettings, quotaSettings}` | System Gateway | `NodeNotFound` · `SettingsOnlyAllowedForMainNode` · `SettingsNotFound` · `UnauthorizedUserToPerformThisAction` (Client→quota) · `InvalidIpAddress` |

[CODE] `falcon-core-commerce-svc/.../Api/Controllers/SettingController.cs:40-54`
[CODE] `falcon-core-commerce-svc/.../Application/Services/Handlers/UpdateSettingsHandler.cs:41-133`

Kafka side effects on Update (backend-handled, no FE work):
- `TenantIdentitySettingsSyncEvent` → Identity sync (password security level + quota mirrors)
- `TenantIpAllowlistChangedEvent` → Core Gateway Redis projection `tenant:{id}:ipAllowlist:v1`
- HybridCache invalidation `allowed_ips_{ownerId}` on security change

## PES wiring (per-section, fail-open mitigation)

From [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:100-115`:
- Password Security edit: `FalconAccess.adminConsole.rootPasswordSecurityLevel.edit()` (Falcon root) / `.accountPasswordSecurityLevel.edit()` (client)
- Allowed IPs edit: `FalconAccess.adminConsole.rootAllowedIps.edit()` / `.accountAllowedIps.edit()`
- Quota edit: `FalconAccess.adminConsole.accountQuota.edit()` (Falcon-only — backend `UnauthorizedUserToPerformThisAction` is the safety net)

Fail-open guard mirrors the Wave 6.1 add-user-wizard Risk-2 mitigation: if ALL three flags are false (unknown-resource catalog gap), default to allow so the tab stays usable; backend `[Authorize]` + handler exceptions are the actual security gate.

## Validations ([BRAIN-OUT] Add Client/03-STEP_2_SETTINGS.md cross-referenced)

| Field | Validator | V-rule |
|---|---|---|
| `security` | `passwordSecurityLevelValidator` (enum) | [[V-password-security-level-enum]] |
| `allowedIps[*]` (on Enter) | `isValidIp(v,'ipv4')` ‖ `isValidIp(v,'ipv6')` | [[V-account-ip-allowlist-enforcement]] |
| `allowedIps` (list) | `allowedIpListValidator` | same |
| `maxNormal` / `maxSystem` | `userLimitValidator` (≥0, int) | [[V-account-limits-zero-means-no-limit]] · [[V-normal-user-limit-enforcement]] |
| `maxNode` | `maxNodeLevelsValidator(999)` factory | [[V-account-limits-zero-means-no-limit]] |

`isSettingsFormValid(form, includeQuota)` computes whole-form validity — quota slots are not required when the right panel is hidden (Falcon root OR PES denies quota).

## Architecture choices

1. **Body-only component** + actions in parent shared slot. Mirrors the `infoEditMode` pattern used by the Hierarchy tab (Cancel + Save in `<ng-template falconNodeDetailsActions>`). Single visual layout across all 4 tabs.
2. **Page-scoped slice** (not `providedIn: 'root'`) so a new instance lives per page mount. Listens to `TreeStateSlice.effectiveNodeId()` via `effect()` and re-runs the PES + GET forkJoin on every node change (cancels the prior in-flight subscription).
3. **`finalize()` for submitting** — resets the in-flight flag on every terminal branch (success/error/complete) so Cancel + Save never get stuck disabled (Wave 12 Add User doctrine).
4. **Pre-emptive tab visibility** — sub-nodes no longer see the Settings tab, dodging the `SettingsOnlyAllowedForMainNode` 422 the operator can't act on.
5. **Single-options-object pattern** — `useGateway(Gateway.SystemGateway).context` extracted then merged with `headers: { notShowToaster: 'true' }` in a SINGLE options object to avoid the Wave 11 "shallow-spread context overwrite" trap that broke Add User POSTs.
6. **Discard-prompt orchestration** — `requestNavigateTo()` returns `true` to defer the tree-click; `confirmDiscard()` returns the parked id so the facade can complete the navigation. Mirrors Add Client's `pendingTreeSelection` pattern.

## Visual parity to React reference + screenshots

Reference: `Source_of_truth_theme/React/Falcon-Taha2/admin/settingstab.jsx`:
- ✅ View mode header: brand avatar + "Aramco" + Edit button — sourced from shared `<falcon-node-details-section>` (no per-tab duplication)
- ✅ View mode body: Password Security radios (Normal selected, Advanced dimmed) + IP chips (192.168.1.10, 10.0.0.5) + Account Limitations panel with read-only steppers
- ✅ Edit mode header: Cancel + Save Changes (Save Changes loads spinner during PUT)
- ✅ Edit mode body: radios interactive + "IP Address" dashed Add button + chip dismiss (× → confirm dialog) + 2-col "Current existing | Max allowed" grid for each limit field
- ✅ Falcon root: Account Limitations panel HIDDEN (BIZ-014 — `hasQuota === false` when backend returns no quota)

## Trigger phrases to reload this dossier

- `Settings tab implementation`
- `standalone Settings tab`
- `Wave 14 Settings tab`
- `SettingsTabStateSlice`
- `commerce/setting endpoint`
- `Account Limitations panel`
- `Settings tab PES`

## See also

- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/03-STEP_2_SETTINGS.md` — Wave 8 reference pattern (Add Client Step 2 — same data model)
- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/08-BACKEND_API.md`
- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/BUSINESS_RULES.md` — BIZ-014 (root-only Settings layout)
- [VAULT] `Brain SK/_obsidian/30-Validation/V-password-security-level-enum.md`
- [VAULT] `Brain SK/_obsidian/30-Validation/V-account-ip-allowlist-enforcement.md`
- [MEMORY] `project_add_client_wizard_mastery_2026_05_17.md` — wizard reference patterns
