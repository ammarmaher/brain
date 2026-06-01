---
name: project-org-hierarchy-fe-be-integration-realign-2026-05-21
description: "Org Hierarchy page FE↔BE integration realigned with origin/main proven contract across 7 gaps (G-01,G-02,G-03,G-04,G-05,G-06,G-20,G-21). 5 waves, FE-only, backend untouched. Committed df6973b2, pushed."
metadata: 
  node_type: memory
  type: project
  originSessionId: 276b5eac-e45c-41f3-8004-7835a02f7f36
---

# Org Hierarchy FE↔BE integration realign — 2026-05-21

🟢 SHIPPED 2026-05-21. Commit `df6973b2` on `polishing-v0.4`. 10 files modified, FE-only, backend untouched.

## Why

User reported: "the new UI/UX is working as expected before integrating with the backend. After integrating with the backend, I have a lot of issues." Directive: backend is source of truth — match `origin/main` admin-console (proven-working) contract; no backend changes.

## Method

Deep-dive of `origin/main` admin-console organization-hierarchy services via `git show origin/main:apps/admin-console/src/app/features/organization-hierarchy/services/*.ts` → diffed against new `apps/admin-console/src/app/features/org-hierarchy-page/*` → produced gap report (G-01 through G-21) → executed in 5 waves with build verification between each.

## Gaps fixed (8 of 21 catalogued; 13 verified already-correct)

| Gap | File | Drift | Fix |
|---|---|---|---|
| **G-01** | `apps/host-shell/src/app/shared-components/service-pricing/services/commerce-gateway.service.ts:57-67` | comm-channel list URL `/comm-channels/visible/details` returned VISIBLE-only — hiding a channel made it disappear from admin table, can't un-hide | Changed to `/comm-channels` matching main |
| **G-02** | `apps/admin-console/.../org-hierarchy-page/services/services.ts:171-196` | `HierarchyService.getUsers` sent `PathPrefix` + `TenantId` query params; undefined `TenantId` serialized as literal "undefined", node.path null on older nodes → empty list | Dropped both; sends only NodeId + Roles + IncludeDeleted (Falcon admins) — matches main query-string |
| **G-03** | (same file) | Documented in code why URL stays `identity/user` + SystemGateway: in-codebase "ROOT CAUSE FIX 2026-05-18" comment proves bare `user` + IdentityGateway no longer reaches Identity in new MF routing | Kept URL+gateway, only query revert |
| **G-04** | `libs/falcon/src/shared-features/service-pricing-table/models/models.ts:299-326` | `mapServiceRow` only reads `dto.availableActions`; if BE handler regresses to `allowedActions` (legacy key main saw), row menus silently empty | Added `rawActions = dto.availableActions ?? dto.allowedActions` fallback |
| **G-05** | `add-client-wizard.signals.ts:254-275` + `add-user-state.signals.ts` | submitFn only read `sor.errors`; BE inconsistently emits `errorMessages` (legacy string[]) → wizard error toast had no details, step-jump never fired | Reads BOTH, synthesizes envelopes from `errorMessages` when `errors` empty |
| **G-06** | `add-client-wizard/models/wire-builders.ts:173-205, 255-265` | `userName` not lowercased → BE case-insensitive uniqueness let mixed-case pass FE check but match BE → POST collision OR duplicates with different casing. Also `commChannels.services` + `applications.services` sent ALL catalog rows with visibility flag → BE created phantom rows for unchecked services | `userName: trim().toLowerCase()` + filter both arrays to `visibility===true` before serialize. Matches main's `buildWizardModel.filterVisible` |
| **G-20** | `client-account-owner-step.component.ts:98-116` + `user-personal-step.component.ts:111-122` | `accountValidation.isUserExist(username)` only — BE `/identity/user/exist` checks (username, email, phone) triplet for uniqueness; duplicate email/phone passed wizard, failed POST | Both wizards now call `isUserExist(username, email, phone)` with `untracked()` sampling so debounce stays keyed on username only |
| **G-21** (found in Wave 5 re-scan) | `add-user-wizard/models/models.ts:123-131` + `services/user.service.ts:210-220` | `GeneratePasswordWireRequest.securityLevel` — BE FastEndpoint binds `GeneratePasswordRequest(ePasswordSecurityLevel PasswordSecurityLevel)` → wrong key bound to enum default 0 → every operator pick ignored, BE always returned Normal-level password | Renamed `securityLevel` → `passwordSecurityLevel`; matches BE binding |

## Gaps verified already-correct (no change needed)

- G-07 wire builder `maxNodeLevel` (singular) — already matches BE `CreateAccountRequest.SettingsInfo.MaxNodeLevel`
- G-08 Info PUT enum casting — dropdown handler already does `Number(raw)` before storing in form
- G-09 Settings PUT body shape — already nests `{ownerId, securitySettings, quotaSettings}` matching BE
- G-10 PES gate on quota — already correctly gated
- G-11 NodeDrawer toast coverage — already reads both `errorMessages` + `errors`, fires success + error toasts
- G-16 `mapUserWireToUser` — already tolerates camelCase OR PascalCase wire keys
- G-17 do-payment polling — already 2s interval, 30min max
- G-18 IP validation — already uses `isValidIpv4 || isValidIpv6`
- G-19 wizard step defaults — already applied via signal defaults
- G-12/13/14/15 — cosmetic / behaviorally-equivalent

## Critical findings beyond gaps

- **NEW vs MAIN gateway pattern**: MAIN uses `useGateway()` (default = APP_DEFAULT_GATEWAY=SystemGateway for admin-console). NEW uses explicit `useGateway(Gateway.SystemGateway)`. Equivalent.
- **NEW vs MAIN URL prefix**: MAIN uses `user` + `Gateway.IdentityGateway`; NEW uses `identity/user` + SystemGateway. New MF routing requires the prefix; documented in-code as proven by previous root-cause investigation.
- **Backend response keys**: BE emits camelCase via ASP.NET JsonSerializerDefaults.Web. Both PascalCase + camelCase request bodies work (PropertyNameCaseInsensitive=true).
- **Eventual consistency on create-account**: 3 Kafka events fire after POST (user-creation-requested, user-wallet-create, identity-settings-sync). FE uses `setTimeout(0)` deferred selection of new node — racey if Kafka lag exceeds next-tick.

## Build status

🟢 admin-console, host-shell, management-console, falcon lib — all green post-Wave-5.

## What still needs live browser verification (not done this session)

1. Hide comm-channel → verify it stays in table (G-01)
2. Switch tree nodes → verify users list populates (G-02/G-03)
3. Add Client wizard finish → verify only checked services are active (G-06)
4. Add User Step 2 "Advanced" pick → verify Step 5 password is advanced (G-21)
5. Duplicate email in Add User → verify inline error fires before POST (G-20)
6. Do-payment on expired service → verify polling + success/failure routing intact

Local backend stack confirmed up at 17/17 containers (2026-05-21 morning) — verification path open.

## Concurrent sessions on same branch

Two other Claude sessions had uncommitted work in the working tree:
- Login revamp session (`bc9bf03b`) — modifying `apps/host-shell/src/app/features/auth/*`
- Loader-status-data-table session (`cd96445a`) — modifying `service-pricing.component.ts` (added `pendingSaveReload` + retry timer) + `loader-overlay.tokens.css` (z-index ladder rev 3)

I selectively staged ONLY my 10 files via `git add <specific-paths>` (NOT `git add -A`) so their work stays in their hands.

Coordination doc written: `C:\Falcon\universal-brain\state\session-coordination-2026-05-21.md` (full file list + safe-zones).

## Rules emitted by this session

- Any new FE call to org-hierarchy BE must match the proven main contract — diff against `git show origin/main:apps/admin-console/.../services/*.ts` before adding new query params or URL paths.
- Wire request DTOs must use the exact key names from BE FastEndpoint records/DTOs (case-insensitive but name-must-match). If unsure, grep the BE Contracts/Models/ directory.
- `userName` MUST be `.trim().toLowerCase()` before any uniqueness POST or create-account submit.
- Wizard service-catalog arrays MUST be filtered to `visibility===true` before create-account POST.
- Username uniqueness check MUST pass (username, email, phone) triplet to `AccountValidationService.isUserExist`.
- Error envelope readers MUST handle both `sor.errors` (typed) AND `sor.errorMessages` (legacy string[]).
- Service-pricing wire mapper MUST read `dto.availableActions ?? dto.allowedActions` defensively.

## See also

- [[project_shared_service_pricing_investigation_2026_05_21]] — original investigation that surfaced 3 of these gaps
- [[project_data_table_skeleton_loading_system_2026_05_20]] — referenced data-table skeleton system that the loader session will be extending
