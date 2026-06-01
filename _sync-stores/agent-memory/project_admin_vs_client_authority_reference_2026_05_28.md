---
name: admin-vs-client-authority-reference-2026-05-28
description: Consolidated Falcon-vs-Client authority reference (HTML+PDF) covering 6 roles × 7 features × 2 consoles + verification checklist + known gaps; the go-to artifact for admin-console PRD double-checks.
metadata: 
  node_type: memory
  type: project
  originSessionId: 2a0ddd99-cd2a-4a94-aaf3-0c704ea7bfaf
---

# Falcon Admin-vs-Client Authority & Visibility Reference (HTML + PDF)

A consolidated, source-prefixed reference deliverable was produced for Ammar on 2026-05-28 to double-check the admin console against the PRDs.

**Location:** `C:\Falcon\Brain Outputs\reports\falcon-admin-vs-client-authority-2026-05-28\`
- `Falcon-Admin-vs-Client-Authority-Reference.html` (~106 KB, self-contained, print-optimized)
- `Falcon-Admin-vs-Client-Authority-Reference.pdf` (31 pages, rendered via headless Edge `--no-pdf-header-footer`)

**Covers:** the two kingdoms (admin-console/`sys-*`/SystemGateway vs management-console/`acc-*`/CoreGateway); 6 role capability cards (see/do/cannot); 7-feature parity (org-hierarchy, comms-hub, marketplace, contact-groups, wallet, contracts, testing-charging) with per-role action grids; role-edit matrix; a per-console/per-feature **verification checklist** ("things to double-check"); and a **brain-known gaps** register; PRD BR/V-rule citations inline.

**Why:** Ammar wanted deep understanding of the admin console (Falcon vs client pages) BEFORE working on code, with a reviewable PDF. Built entirely from the [[brain-query-layer-wave-11]] authority dataset — NOT new analysis.

**How to apply:** If asked again about Falcon-vs-client page differences, per-role visibility/actions, or to audit the admin console vs PRD — point to this artifact or regenerate it from the authority dataset. The headline asymmetries to recall: acc-user = contact-groups-only; acc-admin = "denied middle" (no services/profile-edit/security/quota/contract); only acc-owner sees services + contracts on Client side; contact-groups is REVERSED (Falcon staff read-only, Client owns CRUD); testing-charging is Falcon-only by security design.

**Top open gap surfaced (security edge):** G-1 — the Client contracts route declares `acc.contract.view` on `data.access` but has NO `shellAccessGuard` consuming it, so acc-admin/acc-user are kept out only by the hidden menu, not the route. See also wallet-mgmt missing `acc.*` PES keys, no Falcon-side `adminConsole.contracts.*` cluster, and K-1 (PRD-02 Permission Sheet Tab 2 uncaptured — Q-UM-07).

Authority model is code-verified against `BuiltInRoleCatalog.cs` and PES-gate runtime-verified 21/21 (2026-05-16) + E2E 16/18 (2026-05-28). Related: [[project_admin_to_mgmt_e2e_verified_2026_05_28]], [[validation-xlsx-sot-flip-wave-f]]. NO COMMITS (deliverable lives under Brain Outputs/reports).

## Companion (same folder): Organization-Hierarchy-PRD-Sourced-Authority (HTML + 13pp PDF)

Follow-up 2026-05-28: Ammar asked for org-hierarchy specifically, **PRD-sourced with links** — who sees the tree, who sees each tab (Hierarchy / CommChannels&Services / Apps&Services / Settings), who edits node info, who edits user info. Built `Organization-Hierarchy-PRD-Sourced-Authority.html` + `.pdf` (13pp) in the same report folder.

**PRD source map (the citable "links" — Brain stores NO clickable Drive URL, only doc-name + local synced path + line):**
- Account Mgmt: `Brain SK\skills\imported-business\prd-knowledge\modules\01-account-management\latest-prd.md` ("Account Management Module VB4"; hierarchy :26-29, settings/tabs :42-51).
- User Mgmt: `...\02-user-management\latest-prd.md` ("User Management Module - V2") — **role capabilities = lines 20-30**; Add/Edit User :44-107.
- **Authoritative per-action matrix = "Permission list - Jawad" Google Sheet**, but **Tab 2 was never captured (Q-UM-07 / F-009)** → implemented `BuiltInRoleCatalog.cs` is the operational SoT; PRD-vs-PES drift = Q-AM-16.

**Key PRD↔code drifts surfaced (need Product decision):** D-1 PRD says Operation/sys-ops CAN disable CommChannel/Apps but runtime gives sys-ops NO `sys.services` rule (can't); D-2 PRD says Node Admin "no access to settings" but runtime lets `acc-admin` VIEW the Settings tab (all edits denied) = view-vs-none; D-3 PRD internal inconsistency on NA scope (Account-Mgmt "Sub-nodes only" vs User-Mgmt "Main or Sub node"). Tree + Hierarchy tab: PRD and code MATCH (acc-user is the only role with no tree).

**How to apply:** for org-hierarchy tab/tree/edit visibility the PRD-prose answer is User-Mgmt latest-prd.md:20-30; for the *exact* per-tab allow/deny the captured PRD is incomplete (Q-UM-07), so cite code as implemented truth and flag the drifts. Always state the PRD "link" as doc-name + local synced path + line, never invent a Drive URL.

### v1.1 (2026-05-28): added live implementation audit (Impl. column + 75% scorecard)

Ammar asked to mark each row implemented-as-expected-or-not (1 / ½ / 0) + %. Regenerated the org-hierarchy doc to v1.1 with an **Impl. score column + "what's implemented now" column + scorecard (overall 75%, 39/52 rows)**. Per-section: Tree 100% · Hierarchy tab 100% · CommChannels tab 58% · Apps tab 58% · Settings tab 92% · Edit-node 83% · Editable-user-fields 60% · Who-edits-users 58%.

**LIVE-CODE findings (working tree `apps/*/features/org-hierarchy-page`, verified this session — these CORRECT stale brain docs):**
- Current page is `features/org-hierarchy-page` (a rebuild), NOT `organization-hierarchy` (that path was origin/main / old-ui-dataset naming — does not exist in working tree).
- Its `tab-components/` has **ONLY hierarchy-tab + settings-tab** → the **CommChannels & Apps embedded tabs are NOT rebuilt** here (grep for services PES = no matches). Comm-channel/app mgmt lives on standalone comms-hub `/comm-mgmt` + marketplace pages (built + E2E-verified). This is the main reason overall < 100%.
- **PES IS wired now** (older IMPLEMENTATION_SCORECARD.md "PES 0%" / "placeholders" is STALE): `settings-tab/signals/settings-tab.signals.ts:142-147` (root/account pwd, root/account IP, quota edit), `falcon-org-info-panel/signals/info-panel-state.signals.ts:169` (accountProfile.edit), `add-user-wizard.component.ts:252-258` (user.add / userPermissionGroup.assign / userProfilePicture.upload / userRole.other).
- **Admin** `org-hierarchy-page.routes.ts` has **NO feature access guard** (only breadcrumb + canDeactivate; app-level adminConsoleGuard covers entry). **Mgmt** route HAS `shellAccessGuard` + `data.access = managementConsole.accountHierarchy.view()` (acc-owner/admin allow, acc-user deny) — E2E-verified.
- Add Client / Add User wizards are skeletons (~15-30% built); OTP modal ~75%; "More Details" user drill-in deleted (0%).

**Rubric (reuse for future impl-audits):** 1 = enforced as PRD expects + verified; ½ = drift OR surface-not-rebuilt-but-capability-elsewhere OR unverified; 0 = missing/placeholder. Overall % independently matched the brain's ~74% aggregate scorecard — good cross-check. RULE: when asked "is it implemented", verify the WORKING TREE directly (brain scorecards drift); the authority/PES layer is implemented+verified, the FE page rebuild is the gap.

### Remediation Plan + a CORRECTION to v1.1 (2026-05-28)

Third deliverable in same folder: `Organization-Hierarchy-Remediation-Plan-to-100.html` + `.pdf` (7pp) — agent-executable: Correct(don't-touch) / Wrong(fix) / Missing(build) / Decisions-first / ordered action plan with files + acceptance + verify.

**⚠ CORRECTION — v1.1 (and the bullets above re "skeletons" / "tabs not rebuilt") were WRONG via too-narrow code search.** On full live re-audit of `org-hierarchy-page-menu.component.html`:
- The page has 4 tabs in `@switch`: hierarchy / commChannels / apps / settings. **CommChannels & Apps tabs ARE built on BOTH consoles** — they render shared `<app-service-pricing kind="comm-channel|application">` (`apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts`), which wires `FalconAccess.adminConsole.services.*` PES (`:245-254`) + backend `availableActions` + do-payment. **Browser-verified** (service-pricing Wave 11/12). My earlier grep missed it because the logic is in the SHARED host-shell component, not in `org-hierarchy-page/`.
- **Add Client wizard = 5 steps BUILT** (`wizard-components/add-client-wizard/client-{information,settings,comm-channels,applications,account-owner}-step`); **Add User = 3 steps BUILT**. NOT skeletons. BUT their **API services are STUBS** (routes.ts comment: "AddClient/AddUser API services are stubs") → no real persistence. **That (backend persistence) is the actual gap**, plus User-Details save is in-memory.
- Corrected overall ≈ **83%** (not 75%); CommChannels/Apps re-scored 58%→**92%**. v1.1 carries a correction banner pointing here.

**Real gaps to 100% (the remediation backlog):** M-1 wire Add-Client persistence (`POST commerce/Node/create-account`), M-2 Add-User persistence + delivery dialog, M-3 user-details/profile persist + email/phone OTP, M-4 OTP 60s timer, M-5 tests; W-4 seed `sys.user*` keys (BuiltInRoleCatalog); W-1/W-2/W-3 drift decisions (DEC-1..3); W-5 verify mgmt `app-service-pricing` gating (it uses `adminConsole.services.*` keys on BOTH consoles → on mgmt resolves deny, relies on backend availableActions — possible bug, verify acc-owner do-payment); W-6 IB modal; DEC-4 re-export Permission-sheet Tab 2 (Q-UM-07). **DO NOT build:** Move/Archive/Delete node (Q-AM-18), Kanban, duplicate service mgmt.

**META-LESSON (important):** when auditing "is X implemented", grep the SHARED component locations (`apps/host-shell/src/app/shared-components/`, `libs/falcon/src/shared-features/`), not just the feature folder — Falcon pages compose shared components (service-pricing, org tree, etc.), so a feature-folder-only grep produces false negatives. Twice this session a too-narrow search under-reported (PES "0%" and tabs "not rebuilt"); both were wrong.

### FE-only fixes APPLIED 2026-05-28 (via ammar-web-platform-ui, verified, NO COMMIT)

Ammar asked to fix the "wrongs" FRONTEND-ONLY (no backend, no PES seed changes). 3 fixes landed in the working tree + all 3 nx builds GREEN (host-shell `125c9ae028c4145d`, admin `b04d75896562b70e`, mgmt `34c5a3379f4b1eba`); verified by reading the actual diffs:
- **W-8** — admin `org-hierarchy-page.routes.ts` now PES-guarded: added `canActivate:[shellAccessGuard]` + `data.access = FalconAccess.adminConsole.accountHierarchy.view()` (mirrors mgmt). 
- **W-5** — shared `apps/host-shell/.../service-pricing/service-pricing.component.ts` made scope-aware: new `isFalconConsole()` reads `SessionProvider.session.userType === USER_TYPE_STRINGS.FALCON_USER` (house convention, same as `organization-hierarchy-tree/services/services.ts:87-90`); Falcon branch UNCHANGED (sys.services), Client branch resolves `managementConsole.services.payment()` + hard-FALSE visibility/editPriceType/editPriceValue (acc.* has no price/visibility keys). FE now SEES the client PES instead of all-false.
- **Email+phone** — PRODUCT DECISION (overrides PRD BR "cannot edit email AND phone in same request"): both can now be saved in ONE request. Found the mutex in `libs/falcon/src/shared-features/user-details/{signals,validations}` — it was ALREADY commented-out by a prior dev (combined save already worked); agent removed the dead `isEmailPhoneExclusiveViolation` + helpers; per-field Verify-button OTP gating (`isSaveDisabled`) preserved. i18n key `emailPhoneExclusive` left (caller-less, harmless).

Status: BUILD-GREEN, NOT browser-verified (needs live Docker + test users to confirm acc-owner sees payment on mgmt). NO COMMIT. Skipped per instruction: W-1/W-2/W-3 (decisions), W-4 (seed sys.user — backend), all M-* backend persistence.

⚠ WORKING-TREE NOTE: `git status` on `C:\Falcon\Falcon\falcon-web-platform-ui` shows ~15 modified + several untracked dirs, but only 4 are THIS task's (the 2 routes/service-pricing + 2 user-details). The rest are PRE-EXISTING uncommitted work from earlier waves (admin→mgmt port, node-scope fix, wallet-reskin route restore, i18n) — the tree is a shared dirty tree; do NOT assume a clean before/after from git status alone.
