---
name: project_service_visibility_mgmt_visible_only_and_app_visible_endpoint_2026_06_20
description: "Management/client console now gets VISIBLE-ONLY comm-channels & applications by filtering the EXISTING list handlers by user type (no new endpoint, no FE change). Admin visibility toggle (both kinds, both directions) was already implemented. DRAFT PR 42644→main; superseded+abandoned PRs 42642 (wrong new-endpoint approach) + 42643 (unneeded FE rewire)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 4eda4a35-fcfd-458f-a455-400cfe62fc47
---

# Service visibility — client console gets visible-only via existing handlers (2026-06-20)

User ask: (1) Admin org-hierarchy visibility toggle for comm-channel AND application must call the API on EVERY click, both true & false. (2) Management/client console must ALWAYS show only VISIBLE channels/apps (a service appears in mgmt only when a Falcon user set Visibility=true). Backend changes expected.

## FINAL APPROACH (after user correction) — filter the EXISTING endpoints, no new endpoint, no FE change
The mgmt console already calls the existing list endpoints:
- `GET commerce/Node/{id}/comm-channels` → `GetAccountCommunicationChannelsHandler`
- `GET commerce/Node/{id}/applications` → `GetAccountApplicationsHandler`
Both already branch on `isFalconUser` (`_currentUser.UserType == eUserType.Falcon`): Falcon staff see the full catalog; clients see configured items — but they did NOT filter by visibility, so a client saw hidden services.

**Fix (backend-only, 2 handlers, 1 line each):** extend the non-Falcon branch to also skip hidden:
- `if (!isFalconUser && nodeChannel is null)` → `… && (nodeChannel is null || !nodeChannel.Visibility))`
- `if (!isFalconUser && nodeapplication is null)` → `… && (nodeapplication is null || !nodeapplication.Visibility))`
Admin (system gateway → Falcon JWT) unchanged = full list incl. hidden so staff can un-hide. Client (core gateway → Client JWT) = visible-only from the SAME endpoints → ALL mgmt surfaces (org-hierarchy CommChannels+Apps tabs via shared `<app-service-pricing>`, comms-hub, marketplace) covered with ZERO FE change. The same handler serves both consoles; JWT userType is the switch.
+6 unit tests (client excludes hidden / all-hidden→empty; Falcon still includes hidden) across both handler test classes (→23 in those 2 suites). `dotnet build src/src.sln` 0 errors; built from a clean worktree off origin/main.

### DRAFT PR
- **PR 42644** `fix/commerce-client-services-visible-only` → **main** (commit e953ab6). Files: `GetAccountCommunicationChannelsHandler.cs`, `GetAccountApplicationsHandler.cs` + their 2 test files (94 ins / 6 del). Backend-only.

## Requirement #1 (admin toggle) — ALREADY IMPLEMENTED, no change
`onToggleVisibility` emits for checked=true AND false (service-pricing-table.component.ts:566) → wrapper `onVisibilityToggle` → `changeVisibility(kind,{visibility})` → PUT `commerce/Node/{comm-channel|application}/visibility` `[Authorize(FalconOnly)]` (NodeController.cs:174,183). Comm-channel browser-verified 2026-05-21 [[project_service_pricing_per_row_loader_wave_12_2026_05_21]]; application = identical kind-param path (live verify user-gated). Hiding gated by `row.canHide` + BE `SetVisibility` throws `CannotHideServiceWithTheCurrentStatus` for Active/Expired/Disabled.

## ABANDONED first attempt (wrong approach) — DO NOT redo this way
Initially (mis)added a NEW `GET applications/visible/details` endpoint (+query/handler/DI/5 tests, mirroring the comm-channel `visible/details`) AND made the FE shared transport console-aware (`visibleOnly` threaded transport→gateway→slice→wrapper) + repointed comms-hub/marketplace to `*/visible/details`. User rejected: "why create a new endpoint? … make these APIs just return what is visible, and abandon this PR."
- **ABANDONED + branches DELETED:** BE PR **42642** (`feature/commerce-applications-visible-details`), FE PR **42643** (`feature/mgmt-console-visible-only-services`).
- Reverted all of it from the local working trees: deleted the 4 new BE files; `git checkout HEAD` on NodeController/DI (uncommitted diff was ONLY mine — hotfix's class-level `[Authorize]` removal is committed on hotfix HEAD, so checkout was safe); `git checkout HEAD` on the 6 FE files (restored to polishing-v0.4 HEAD).
- Lesson: when adding "visible-only for client", FIRST check whether the existing endpoint already branches on user type — extend that branch, don't fork a new endpoint. The comm-channels `visible/details` variant exists for a DIFFERENT reason (lightweight + payment flows), not the general list.

## Mechanics / environment
- Azure DevOps (`t2development.visualstudio.com`), `az` CLI NOT installed. PRs created/abandoned via REST `_apis/git/repositories/{repo}/pullrequests` using the GCM-cached token from `git credential fill` (Basic `-u :TOKEN`, also Bearer works; both 200). NEVER print the token.
- All work done in temp worktrees off the target base so the messy hotfix/polishing working trees + their unrelated uncommitted changes stayed untouched. Worktrees pruned; leftover locked dirs `C:\Falcon\Falcon\_wt-vis-fe` + `_wt-vis-be2` (watcher lock, git no longer tracks them, delete manually).
- main already has: comm-channel `visible/details`, GetAccountApplications*, AccountApplicationResponse, AND the null-safe TranslateHelper fix (comm-channels 500) — confirmed merged.

## FE follow-up (2026-06-21) — admin toggle now actually passes visibility:false on hide
User reported (DevTools screenshot, admin localhost:4200 CommChannels) the visibility PUT only ever carried `visibility:true` and hiding "didn't work" — wanted a FE-ONLY fix so the toggle passes false. Root cause: `service-pricing-table.component.ts` `onToggleVisibility` had `if (!checked && !row.canHide) return;` which SWALLOWED the OFF toggle on non-hideable rows → the hide request never fired, so `visibility:false` was never sent (only the on-toggles produced requests). FIX = removed that FE early-return; the switch's new state is now sent verbatim (false on hide, true on reveal) to the SAME PUT endpoint. Backend stays the authority (rejects invalid hide via CannotHideServiceWithTheCurrentStatus → onVisibilityError reloads, switch snaps back). Admin-only (mgmt hides the column). NO backend change. nx build host-shell+admin-console GREEN. Live verify via the user's running `nx serve` (HMR). NOT committed/PR'd (local edit in polishing-v0.4 working tree).

## NOT done
- Live-UI verification user-gated (Docker `falcon-essentials` + Falcon login + node with visible/hidden mix): admin toggle both kinds both directions; mgmt shows only visible; un-hiding in admin re-surfaces it in mgmt.
- Only 1 repo now in the PR (falcon-core-commerce-svc). No FE PR (no FE change).

Related [[project_service_pricing_per_row_loader_wave_12_2026_05_21]] · [[project_mgmt_console_hide_service_visibility_column_2026_06_20]] · [[project_comm_channels_500_translatehelper_nre_2026_06_10]].
