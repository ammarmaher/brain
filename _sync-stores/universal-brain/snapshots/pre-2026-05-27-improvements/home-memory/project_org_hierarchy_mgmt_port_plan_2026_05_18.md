---
name: Org-Hierarchy management-console port plan
description: Full plan to port the organization-hierarchy page from admin-console into management-console; key source map, scope, and the payment/pricing authority finding.
type: project
originSessionId: 04408743-8cbe-4004-9724-d30ca04978db
---
Plan to bring the organization-hierarchy page into management-console (client console). Plan doc: `C:\Falcon\reports\org-hierarchy-mgmt-port-plan.md`.

**Why:** management-console org-hierarchy breaks on client login. SCOPE: Option B (targeted gap-fill) — user confirmed 2026-05-18. The 67-file mgmt folder is NOT a broken stub (Waves 2-9 wired, correctly client-flavored).

**ROOT CAUSE FOUND (code-verified 2026-05-18, plan §3.1):** the breakage is in the SHARED host-shell tree wrapper `apps/host-shell/.../shared-components/organization-hierarchy-tree/services/services.ts` — `OrgHierarchyTreeApiService` hard-codes `Gateway.SystemGateway` (lines 80,95) and always builds a synthetic `type:'root'` Falcon node (lines 104-111), ignoring `mode='client'`. Client session → 401/403 → empty tree → all tabs starved. Fix = make wrapper mode-aware (CoreGateway + no synthetic root in client mode); must not regress Falcon admin-console (shared component). 8 bugs ranked BUG-1..8 in plan §3.1.

**How to apply (source map, code-verified 2026-05-18):**
- New structure + theme = `polishing-v0.4` admin-console `features/org-hierarchy-page/` (signals, no SCSS).
- Working APIs = `origin/main` mgmt `account-administration/organization-hierarchy/` (no `master` branch — mainline is `origin/main`).
- Edit User v2 = `origin/feature/120380-edit-user-v2` host-shell `features/user-profile/` — ABSENT on polishing-v0.4; OLD PrimeNG+SCSS → needs structural rewrite; separate work item.

**Key findings:**
- mgmt `app.routes.ts` ALREADY registers the `organization-hierarchy` route (shellAccessGuard + `managementConsole.accountHierarchy.view()`); only the feature folder is replaced.
- Admin "new structure" is a UI-only MOCK for every Comm-Channels/Apps mutation (Do Payment, Edit Price Type/Value, Visibility, Enable/Disable) — `CommerceActionsService` dead code; adapter drops `availableActions`/`canHide`/`accountId`.
- Payment/pricing authority: visibility + price-type + price-value endpoints are `[Authorize(Policy="FalconOnly")]`. RECOMMENDATION for mgmt: remove inline price/visibility editors (display-only); keep + properly wire Do Payment + Enable/Disable only.
- Add Client wizard EXCLUDED — Falcon-only, no `acc.account.add` key.
- Move/Archive/Delete node must NOT render (Q-AM-18, GAP-AM-29 — no endpoints).
- origin/main bugs to NOT carry: fake-success catchError on price PUTs, silent `[]` on fetch failure.

Status: PLAN APPROVED-PENDING. No code written yet — user wants understanding locked first.
