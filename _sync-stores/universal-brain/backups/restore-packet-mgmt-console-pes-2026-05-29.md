# RESTORE / HANDOFF PACKET — Mgmt-Console Authority + PES Parity

> Written 2026-05-29 for an **account swap**. The previous Claude session was interrupted mid-task to let the user log in with a different Claude account. **Same machine (`C:\Falcon`, Windows, PowerShell) — only the Claude account/session changes.** All files, repos, the brain, the Docker stack, and the reports below persist. RESUME from here; do NOT restart.

## 0. TL;DR for the resuming Claude
Research is DONE and 3 of 7 HTML reports + the master plan are written and good. You must: regenerate **4 missing reports** (+ an index.html), then **run the PES seeding** against the live stack and **verify per client type**. Then (coordinated with the user) do the full-stack FE + PES parity work per `PLAN-master.html`.

## 1. The task (verbatim intent)
Make the **new-UI management console** (branch `polishing-v0.4`) behave **exactly like old-UI `main`** (the proven source of truth). The ONLY difference should be UI/UX. Deliver: HTML reports + a perfect plan (taking from PRDs + main branch), covering — for **every client type and every client status** — what they can **view** and what **action** they can do, including the **organization hierarchy tree**; PLUS deep-dive and **run PES implementation + PES seeding** for client + user-creation flows.

### User's locked decisions (asked via AskUserQuestion)
1. **Execution mode** = multi-agent **ultracode workflow** (user opted in explicitly — the "ultra code" feature).
2. **This-turn scope** = Reports + plan **+ RUN the seeding now** (no second approval gate for seeding).
3. **Plan reach** = **Full stack** (FE gating + access-svc PES rules `BuiltInRoleCatalog.cs` + essentials seeding) — end-to-end parity with main.

### Interpretation flagged
**"PIS" = "PES"** (Policy Enforcement Service / the `acc.*` permission keys). The brain has no "PIS" concept; the rest of the user's message says "PES". Proceeding as PES.

## 2. Source of truth & repo layout (all under `C:\Falcon\Falcon\`, all git)
- **Old-UI = SOURCE OF TRUTH.** `falcon-web-platform-ui` -> `origin/main` (old UI). Clean checkout worktree at **`C:\Falcon\Brain Outputs\worktrees\falcon-old-ui-main\`**.
- **New-UI = TARGET.** `falcon-web-platform-ui` current branch **`polishing-v0.4`** (working tree `C:\Falcon\Falcon\falcon-web-platform-ui\`).
- **PES engine** (on `main`): `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES\Authorization\BuiltInRoleCatalog.cs` — the 6-role built-in `g`-rule catalog + role-edit matrix.
- **FE PES key factories** (47): `libs\falcon\src\shared-types\lib\constants\falcon-access.registry.ts` (exists in both worktrees).
- Other services on `main`: `falcon-core-identity-svc`, `falcon-core-commerce-svc`, `falcon-core-provisioning-svc`, `falcon-core-charging-svc`, `falcon-int-core-gateway-svc`, `falcon-int-system-gateway-svc`, `falcon-core-contact-group-svc`.

### Seeding dir — note the THREE `Falcon` segments
`C:\Falcon\Falcon\Falcon\falcon-essentials\zitadel\` — contains:
`seed.sh` (master), `seed-test-users.sh` (the 6 test users), `seed-toyota-users.sh`, `bootstrap-cluster.sh`, `apply-zitadel-config.py`, **`pes-account-role-rules.json`** (the tenant-scoped p-rule template), `verify-zitadel.sh`, `pes-verification-2026-05-16.csv`, `admin.pat`, `login-client.pat`.

## 3. Authority model (confirmed facts — cite when reused)
- **6 roles.** System (Falcon, `userType:1`): `sys-admin`, `sys-ops`, `sys-products`. **CLIENT (`userType:2`): `acc-owner`(4), `acc-admin`(5), `acc-user`(6)** — these 3 are the "client types".
- **Management console = the client-facing app** (default `Gateway.CoreGateway` :7038). Admin console = Falcon-facing (`Gateway.SystemGateway` :7256).
- **PES subject format:** `u:<ZitadelUserId>@<tenant-id>` (NOT Mongo `_id`).
- **6 mgmt features** (testing-charging is admin-only, not in mgmt). Landing grid for acc-* (route guard):
  - organization-hierarchy -> owner + admin (user DENY)
  - comms-hub -> owner only
  - marketplace-applications -> owner only
  - contact-groups -> owner + admin + user (user **uniquely** sees the Shared tab)
  - wallet-balance-management -> owner only (view + transfer)
  - contracts-cost-management -> owner only (admin + user explicit DENY)
- **Client statuses:** `eUserStatus`(Pending1/Active2/Suspended3/Locked4/Deleted5), `eAccountCreationStatus`(Pending1..Completed7), `eFalconServiceStatus`(None0/InActive1/Active2/Expired3/Disabled4), `eProductSubscriptionStatus`(InActive1/Paid2/Active3/Expired4/Disabled5), `eContractStatus`(Pending1/Active2/Expired3), `eOrderStatus`(Pending1/Paid2/Failed3), `eNodeType`(Main1/Sub2).

## 4. PES SEEDING model (the heart of the user's request)
`pes-account-role-rules.json` = **~90 tenant-scoped `p`-rules**, subject `r:<role>@{TENANT_ID}` for acc-owner / acc-admin / acc-user. `{TENANT_ID}` is substituted per tenant at seed time.
- **acc-owner**: 31 allow rules (full `acc.*` incl. services view/payment/disable, contract view, account-profile view/edit, password-security/allowed-ips/quota view+edit, contact-group full CRUD + share + download). edit/delete on contact-group carry own-only ABAC `"r.obj.createdby" == "r.sub.userid"`.
- **acc-admin**: allow org-hierarchy / account view+edit / organization view+add / org-user add / users view / account+org settings view / contact-group CRUD; **explicit DENY** on services(view/payment/disable), account-profile.edit, password-security(view/edit), allowed-ips(view/edit), quota(view/edit), contract.view. (No `acc.account-user.add` — only org-user.)
- **acc-user**: DENY everything in `acc.*` EXCEPT contact-group (view/create/edit-own/delete-own/share-own/download/download-original) + **`view-shared`** (unique to acc-user).
- **New user creation** -> the user inherits a role's p-rules via a `g`-rule: `g, u:<userid>@<tenant>, r:<role>@<tenant>`. So "PES seeding for client user creation" = (per tenant) seed the ~90 p-rules + (per user) the g-rule linking subject->role.
- **Test users** (all password `Admin@1234`, reseed idempotent via `seed-test-users.sh`): `sysadmin`/`sysops`/`sysprod` (system, tenant `""`); `accowner`/`accadmin`/`accuser` (tenant `test-tenant-001`). All seeded Active + email/phone verified + OTP factor.

## 5. Live environment
**Docker stack is UP** (18 containers, ~3h, `falcon-pes-1` healthy, zitadel/identity/commerce/charging/provisioning all up). Seeding can run live — no bring-up needed. Ports per dataset: Identity :7777, PES :5296, core-gateway :7038, system-gateway :7256.

## 6. What is DONE vs MISSING
Output dir: **`C:\Falcon\reports\mgmt-console-authority-pes-2026-05-29\`**
- DONE `PLAN-master.html` (64.6 KB, 17 tables) — the master plan: 7 falsifiable success criteria, 7 phases P0-P6 (P0 seeding -> P6 E2E verify) with owning agent/files/acceptance per task, ordered seeding runbook, 11-item risk register (cites B-W1 + MFE double-mount + Stencil projection traps), 3x6x3 verification matrix, 4-wave sequencing. **Read this first — it drives the rest.**
- DONE `R2-status-lifecycle.html` (62.3 KB, 14 tables) — all 7 status enums x gating; surfaced 9 gaps incl. missing backend role-matrix enforcement, new-UI **fail-open on PES error**, `ArgumentOutOfRangeException` on Paid/Grace statuses, silent integer mis-render on old-UI/main, 3-way int drift Commerce/Provisioning/Gateway for service status.
- DONE `R5-org-hierarchy-authz.html` (47.6 KB, 10 tables) — tree authz; surfaced 8 gaps incl. **3 opposite-direction drifts** in tab visibility (old-UI PES-gated tabs vs new-UI node-type-only `visibleTabs` computed signal).
- MISSING `R1-authority-matrix.html` (client type x feature view/action, reconciled with PRD)
- MISSING `R3-pes-implementation.html` (end-to-end PES decision flow)
- MISSING `R4-pes-seeding.html` (seeding model + executable runbook)
- MISSING `R6-gap-analysis.html` (old-UI vs new-UI prioritized gap worklist)
- MISSING `index.html` (links all reports + plan)

### Why they're missing (and the fix already applied)
The workflow `wf_c8e59e7b-8b5` (COMPLETED; 8 research + 7 report agents; 1.74M tokens) ran the 6 report writers on **`model:'sonnet'`**. 4 of them (R1/R3/R4/R6) **completed without calling StructuredOutput and never wrote their files**; the Opus PLAN writer + 2 sonnet writers (R2, R5) succeeded. **Fix already applied:** the persisted script `C:\Users\User\.claude\projects\C--Falcon\8b8aa8c2-a2b5-4375-b480-0cc08a1889e9\workflows\scripts\mgmt-console-authority-pes-wf_c8e59e7b-8b5.js` has been edited to remove `model:'sonnet'` from all 6 report writers (they now inherit Opus).

### The workflow run CANNOT be resumed in a new session
`resumeFromRunId` is **same-session only**. A fresh account/session can't reuse the `wf_c8e59e7b-8b5` cache. Options to regenerate the 4 reports:
- **(Recommended, cheap)** Write R1/R3/R4/R6 + index.html directly. Most of their content already lives in `PLAN-master.html` (17 tables incl. authority matrix, seeding runbook, gap list, verification matrix) + R2 + R5. Fill remaining detail from the source files in sections 2-4. Match the existing reports' style (open one to copy its embedded `<style>` + chip/cell classes).
- **(Thorough, costly)** Re-run the corrected script **fresh** (it re-researches all 8 streams on Opus + writes all 7): `Workflow({scriptPath:"C:\\Users\\User\\.claude\\projects\\C--Falcon\\8b8aa8c2-a2b5-4375-b480-0cc08a1889e9\\workflows\\scripts\\mgmt-console-authority-pes-wf_c8e59e7b-8b5.js"})`. (This overwrites the 3 good files too — they regenerate fine.) Requires the user to re-opt-into a workflow ("workflow" keyword / ultracode).
- The raw research findings from the completed run live in the subagent transcripts at `C:\Users\User\.claude\projects\C--Falcon\8b8aa8c2-a2b5-4375-b480-0cc08a1889e9\subagents\workflows\wf_c8e59e7b-8b5\` (large JSONL — mine only if needed).

## 7. NEXT STEPS (in order)
1. Read `PLAN-master.html`, `R2`, `R5` to absorb the plan + findings.
2. Regenerate `R1`, `R3`, `R4`, `R6` + build `index.html` (see section 6 options).
3. **Execute P0 PES seeding** per the PLAN runbook against the live stack: from `C:\Falcon\Falcon\Falcon\falcon-essentials\zitadel\` run `./seed-test-users.sh` (and/or `seed.sh` as the runbook specifies); confirm acc-owner/acc-admin/acc-user p-rules seeded for `test-tenant-001` (substituted into `pes-account-role-rules.json`). Idempotent. Watch the B-W1 gotcha: wallet/account id = JWT TenantId (string `test-tenant-001`) vs hex node `_id` -> 500 mismatch.
4. **Verify per client type** through the real PES gate: login each of accowner/accadmin/accuser (POST Identity :7777 `/api/auth/login`, pw `Admin@1234`) -> call PES :5296 `/pes/authorize` with subject `u:<JWT.sub>@test-tenant-001` for the key resources; assert allow/deny matches the section-3 grid + section-4 rules. (Or run Ammar QA-Web / Chrome MCP E2E.)
5. Then proceed to the FE + access-svc parity work (PLAN P1-P6), coordinating waves with the user. Key thesis from the PLAN: consoles already at route-guard parity for 3 features; real work = seeding + reconciling the JSON seed/stale dataset to the **live `BuiltInRoleCatalog.cs` SoT**, closing the new-UI **contact-group over-permit**, fixing **Add-User fail-open**, deciding the **org-hierarchy tab-visibility divergence**, and porting 2 leaking route guards into old-UI.

## 8. Brain protocol (mandatory)
- Source-prefix every Falcon fact: `[CODE] file:line` / `[BRAIN-OUT] path` / `[VAULT]` / `[PRD] module` / `[INFERRED]`.
- main = source of truth; HALT-AND-FLAG when ambiguity >= 7 or a security/data fork lacks a rule.
- **NO commits/pushes** without explicit user instruction. The stack is LIVE — seeding mutates real state; verify before/after.
- Update memory + `current-task.json` at task end.
- Relevant memory entries: `project_wallet_seed_brands_per_node_2026_05_28` (B-W1), `project_wallet_reskin_2026_05_28` (MFE double-mount), `project_wallet_card_treetable_sot_2026_05_28` (Stencil projection), `project_admin_to_mgmt_e2e_verified_2026_05_28` (E2E recipe + test users).
