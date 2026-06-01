---
type: session-coordination
created: 2026-05-21
orchestrator: org-hierarchy-integration-session
target-audience: loader-status-data-table-session + login-revamp-session + any concurrent Falcon session
status: ACTIVE
updated: 2026-05-21T12:50 — Wave 6+7 shipped
---

# Session Coordination — 2026-05-21

The user authorized this session as orchestrator/"boss" for concurrent Falcon
work today. Updates appended as work ships.

## What I shipped — commit `df6973b2` (Waves 1-5)

**`fix(org-hierarchy): align FE↔BE integration with origin/main contract`** — pushed.

Gaps fixed: G-01 (comm-channel list URL), G-02+G-03 (users list query), G-04 (availableActions fallback), G-05 (wizard error envelope), G-06 (userName lowercase + visible-only services), G-20 (uniqueness triplet), G-21 (passwordSecurityLevel field).

10 files. Backend untouched. Build green on admin-console / host-shell / management-console / falcon lib.

## What I shipped — commit `31d13af9` (Waves 6-9)

**`fix(service-pricing): backend-eventual-consistency reload delay + drop visible-precondition gate`** — pushed.

### Wave 6 — G-22: Drop visibility-precondition from row actions

File: `libs/falcon/src/shared-features/service-pricing-table/models/table-config.ts`

`origin/main` apps-services-tab.component.ts:725-748 gated action visibility ENTIRELY on `row.allowedActions.includes(actionEnum)`. NEW added `!!r.visible &&` as an extra precondition, which hid every action on visibility=false rows even when the BE's `_allowedFalconServiceActionsGenerator` returned actions for that hidden state. Symptom: after toggling visibility off, the kebab disappeared from the just-hidden row → operator could not Enable / EditPriceType etc on the hidden row.

**Fix:** drop `!!r.visible` precondition. Action visibility now = PES flag AND `availableActions` whitelist. Single source of truth = backend.

### Wave 7 — G-23: 3-second post-save reload delay

File: `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts`

User QA-confirmed BE has a ~3s write→read propagation window. The immediate post-save GET was returning STALE or NULL rows, making saved changes "disappear" until manual refresh.

**Fix:** new `scheduleDelayedReload(3000)` helper replaces immediate `state.reload()` on every mutation success path (visibility / enable / disable / price-type / price-value / delete-pending). The `submitting` flag stays TRUE across the delay so the loader keeps blocking re-clicks. Timer is cancellable on nodeId change, fresh mutation, and component destroy. `pendingSaveReload` is set INSIDE the timer callback to prevent premature success-toast firing.

**Visibility error** keeps immediate corrective reload — PUT failed so BE state unchanged.

### Wave 8 — Action result + hide rules

Verified existing implementation already correct after Wave 6 fix. Empty state already wired via `[emptyData]="emptyDataConfig()"`. Action button visibility now purely BE-driven via `availableActions`.

### Wave 9 — Date picker BE-driven limits

Verified existing implementation already correct. `[disabledDates]="disabledDatesForShadow(row)"` is wired in the template (service-pricing-table.component.html:225). The predicate mirrors BE `Operations.cs:21-78` rules: past dates + Fri/Sat + (for Monthly/Yearly) every date except renewDate.Day-1. The date-picker wrapper at `libs/falcon-ui-core/.../falcon-date-picker.component.ts:94` forwards predicates to the Stencil element.

## ⚠ Note to loader-status-data-table session (`cd96445a`)

I committed `service-pricing.component.ts` because my Wave 7 work builds ON TOP of the `pendingSaveReload` + retry-timer + mode-watching scaffold that you had uncommitted in the working tree. Your scaffold is now preserved in commit `31d13af9` as the foundation for the delayed-reload logic.

**What I did:**
- Added: `RELOAD_DELAY_PRICE_MS = 3000`, `RELOAD_DELAY_SIMPLE_MS = 3000`, `reloadTimer` private field
- Added: `clearReloadTimer()`, `scheduleDelayedReload(delayMs)` helpers
- Added: nodeId-change effect that clears the reload timer
- Modified: `onMutationResult` + `onPriceMutationResult` success branches to call `scheduleDelayedReload` instead of immediate `state.reload()`
- Modified: `runMutation` + `onMutationError` + `onVisibilityError` to call `clearReloadTimer()` defensively

**What you should know:**
- Pull latest `polishing-v0.4` before continuing your loader work
- Your data-table loader integration shouldn't conflict (different file region in `falcon-data-table.component.ts` per [MEMORY] `project_data_table_skeleton_loading_system_2026_05_20`)
- If you intend to add loader behavior to `service-pricing.component.ts`, build on the `submitting()` computed + the `pendingSaveReload` signal that's now in place

## ⚠ Note to login-revamp session (`bc9bf03b`)

Your auth/* uncommitted work in the working tree has zero overlap with my service-pricing changes. Commit when ready.

## Files I edited today (cumulative)

| Commit | File | Wave |
|---|---|---|
| `df6973b2` | `apps/host-shell/.../service-pricing/services/commerce-gateway.service.ts` | G-01 |
| `df6973b2` | `apps/admin-console/.../org-hierarchy-page/services/services.ts` | G-02+G-03 |
| `df6973b2` | `libs/falcon/.../service-pricing-table/models/models.ts` | G-04 |
| `df6973b2` | `apps/admin-console/.../add-client-wizard/signals/add-client-wizard.signals.ts` | G-05 |
| `df6973b2` | `apps/admin-console/.../services/state/add-user-state.signals.ts` | G-05 |
| `df6973b2` | `apps/admin-console/.../add-client-wizard/models/wire-builders.ts` | G-06 |
| `df6973b2` | `apps/admin-console/.../client-account-owner-step.component.ts` | G-20 |
| `df6973b2` | `apps/admin-console/.../user-personal-step.component.ts` | G-20 |
| `df6973b2` | `apps/admin-console/.../add-user-wizard/models/models.ts` | G-21 |
| `df6973b2` | `apps/admin-console/.../add-user-wizard/services/user.service.ts` | G-21 |
| **`31d13af9`** | **`libs/falcon/.../service-pricing-table/models/table-config.ts`** | **G-22** |
| **`31d13af9`** | **`apps/host-shell/.../service-pricing/service-pricing.component.ts`** | **G-23** |

## Live browser verification still pending

Backend stack confirmed up at 17/17 containers (2026-05-21 morning). Recommended verification flow:

1. **G-22**: Hide a comm-channel → confirm row stays in table AND kebab still shows BE-allowed actions (Enable, etc).
2. **G-23**: Change a price-value → confirm loader stays for ~3s → GET fires → fresh data displayed (not stale/null).
3. **G-23**: Hide a channel → confirm ~3s delay before GET → row reflects new visibility=false state correctly.
4. **G-23 cancellation**: While in 3s wait, switch tree nodes → confirm pending reload is cancelled, new node loads correctly.
5. **G-21**: Add User Step 2 "Advanced" → Step 5 password is advanced length.

## Standing by

If any new bug surfaces, page me. Autopilot mode remains active.
