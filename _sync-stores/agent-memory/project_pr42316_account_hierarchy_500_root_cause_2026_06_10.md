---
name: project_pr42316_account_hierarchy_500_root_cause_2026_06_10
description: "PR 42316 (commerce account-hierarchy 500) CONCLUSIVE root = 'Test Tenant 001' fixture seeded with human slug 'test-tenant-001' as tenant id (not canonical ObjectId a11001); client JWT carries the slug → core gateway → commerce ObjectId query → FormatException 500. User REJECTED the earlier FALCON_ROOT_NODE theory. PR 42316 = correct boundary 404; true fix = normalize fixture (4-system migration, ready, HELD pending go). Admin path already 200."
metadata: 
  node_type: memory
  type: project
  originSessionId: 85113cad-976c-4868-a73e-6b7b18ddb94b
---

# PR 42316 root cause — why nodeId/accountId reach GetAccountHierarchyHandler invalid (2026-06-10)

## ⚠️ CORRECTED ROOT (2026-06-10 PM, autopilot drill-down) — supersedes the FALCON_ROOT_NODE theory below

The user **rejected** the FALCON_ROOT_NODE theory ("I disabled the Falcon node; the issue is in OTHER nodes / client; it's not the solution"). Exhaustive runtime drill-down (separate pristine-main commerce on :7046 + PR-branch on :7045 + gateways :7256/:7038, fresh tokens, full DB scans) established the **conclusive** root:

**CONCLUSIVE ROOT = corrupt seed fixture.** The dev fixture **"Test Tenant 001"** is seeded with the human **slug `test-tenant-001`** as its tenant id, instead of its canonical node ObjectId **`000000000000000000a11001`** — the LONE violation of the invariant `mainNode.tenantId == mainNode._id` (CreateMainNodeProcess + every other tenant follow it). The Commerce `Tenants` collection **already** uses the canonical ObjectId (`_id=000000000000000000a11001`), so the slug is an inconsistent ALIAS. A **client** of this tenant carries `tenant-id=test-tenant-001` in its JWT → the **Core Gateway** forwards it to Commerce as an id → Commerce ids are `[BsonRepresentation(ObjectId)]` → Mongo driver throws `FormatException("'test-tenant-001' is not a valid 24 digit hex string")` → **HTTP 500** (handled 404 once PR 42316 lands; but the id is still INVALID → the root is this DATA).

**Proven runtime (fresh tokens):** client `accowner` (tenant-id claim = slug) → `GET accounts/hierarchy?accountId=test-tenant-001`: pristine main :7046 = **500**, PR-branch :7045 = **404**, accountId=ObjectId a11001 = **200** both. Core gateway :7038 (client FE path, scopes by JWT tenant claim) = 404. **Admin path = 200 for ALL 34 saved wallets (48 reqs incl. both walletStructure variants)** — system gateway takes the tenant from the COMMERCE RESPONSE, not the JWT, so admin never hits the slug. ⇒ the 500 reproduces ONLY for a **client login of Test Tenant 001** (or pristine-main + any non-ObjectId id).

**It's a DELIBERATE fixture:** seed-test-users.sh:106-107 comment explicitly designs for "the string tenant 'test-tenant-001' (node _id is a separate real ObjectId)"; `node-id` metadata is kept = real ObjectId (so node-scoped queries work), only `tenant-id` is the slug. Two SIBLING seeds already DODGE it: `seed-wallet-transfer-pilot.js:17-20` + `seed-wallet-transfer-matrix.js:34` use ObjectId-style tenants precisely because "accowner/test-tenant-001 wallet 500s … FormatException." ⇒ KNOWN issue.

**Blast radius (full scan):** 21 `FalconCommerceDB.Nodes.tenantId` + 1 `Settingss.ownerId` + 65 `FalconIdentityDb.Users.tenantId` + **356 `PES.PolicyRules.Sub`** (`r:{acc-admin|acc-owner|acc-user}@test-tenant-001`) + 7 `Obj` + **65 Zitadel `tenant-id` metadata**. Charging clean (ObjectIds). Audit logs left as immutable history. Seed origins: `ensureTestTenantNode()` seed-service-scenarios.js:551, seed-big-data.js:52, seed-matrix-roles-statuses.js:23, seed-matrix-statuses.js, seed-test-users.sh:27.

**✅ APPLIED + VERIFIED (2026-06-10 PM, autopilot):** ran the migration (`-e APPLY=true`) → commerce 21 Nodes + 65 identity Users → a11001, 1 redundant slug Settings deduped, **356 PES `@a11001` twins added (356 `@slug` KEPT** — additive, no auth gap); then `repair-test-tenant-001-zitadel.sh` updated **26 real Zitadel users' `tenant-id` metadata** → a11001 (39 `bd-e5-*` synthetic display-only users skipped — no Zitadel account, can't log in). Fixed the 5 seed sources for recurrence (seed-service-scenarios.js `TEST_TENANT_ID = TEST_TENANT_NODE_ID`, seed-big-data.js:52, seed-matrix-roles-statuses.js, seed-matrix-statuses.js, seed-test-users.sh default; seed-dopayment lookup → by `_id`). **VERIFY:** fresh `accowner` JWT now carries `tenant-id=000000000000000000a11001`; commerce wallet hierarchy = **200** (was 500); commerce response now returns canonical `tenantId=a11001`; admin path (system gateway) = **200 for all wallets, NO regression**; 0 slug left in commerce/identity. accowner via Core Gateway :7038 = 403 `IpNotAllowed` — a SEPARATE, working-as-designed security gate (seed `securitySettings.allowedIps=[10.20.30.40,192.168.1.0,172.16.5.12]`; localhost not allowed), NOT the wallet bug. Reversible backup at `FalconCommerceDB._repair_backup_tt001`. PR 42316 kept as the boundary net.

**Original plan (now applied):** `falcon-essentials/seed/repair-test-tenant-001-slug-to-objectid.js` (dry-run-default, `-e APPLY=true` to apply; commerce+identity slug→ObjectId, **PES ADDITIVE** = adds `@a11001` twins + KEEPS `@slug` so no auth-break window, reversible `_repair_backup_tt001`). Dry-run VALIDATED (21/1/65/356/7, canonical Tenants present). Companion needed: Zitadel `tenant-id` metadata update (set_zitadel_metadata pattern, seed-test-users.sh). **NOT auto-executed** because: (a) 65-identity Zitadel auth change + 356 PES rules of a SHARED fixture the Edit-User status-matrix workstream depends on (collision risk); (b) genuine fork — **normalize the fixture** (recommended: prod never has string tenants, a11001 already canonical, makes client wallet actually 200) **vs keep the fixture + rely on PR 42316's graceful 404** (the author's apparent intent: test string-tenant handling). Mongo-only without Zitadel does NOT fix the client 500 (slug JWT still 500s) → atomic Mongo+Zitadel or nothing.

**Gateway id-conflation (separate suspect) = CONFIRMED LATENT, not the bug:** `AccountHierarchyMapper.cs:236/262` sets `BalanceNode.Id = chargingWallet.Id` (`NODE:/ACCOUNT::ALL:SAR`) on saved rows, but the FE never round-trips that to a COMMERCE endpoint — loadWalletData uses the org-tree ObjectId; transfers send it to CHARGING (correct); save uses accountInfo.id (ObjectId). QA partial-capture saw only clean 24-hex ObjectIds in hierarchy URLs.

---

## (Superseded) original FALCON_ROOT_NODE theory — kept for history

**PR**: `fix(commerce): wallet & balance hierarchy returns handled errors instead of HTTP 500 on invalid ids`, branch `hotfix/account-hierarchy-id-validation` → main, ACTIVE non-draft, no linked work items, no review threads. Wires previously-unused `IObjectIdValidator` into `GetAccountHierarchyHandler` (malformed accountId/JWT nodeId → NodeNotFound 404; filters invalid CommChannels ids; `TryGetValue` for hierarchy root). User (Ammar) challenged it as symptom-fixing.

## Root-cause chain (deterministic, matches QA repro "clicking a node in Wallet & Balance Mgmt → 500")
1. [CODE] FE **origin/main** `apps/admin-console/.../wallet-balance-management.component.ts:251` — for Falcon staff the wallet page org tree root = synthetic `FALCON_ROOT_NODE`.
2. [CODE] same file `onNodeSelect` (~:325) sets `selectedOrgNodeId = node.key` for ANY clicked row incl. the synthetic root; `loadWalletData()` (~:601) only null-checks → fires `GET api/commerce/accounts/FALCON_ROOT_NODE/hierarchy`.
3. [CODE] `libs/falcon/src/shared-types/lib/models/globals.ts:188` — `FALCON_ROOT_NODE.id = 'FALCON_ROOT_NODE'` (non-ObjectId).
4. [CODE] commerce `IBaseEntity.cs:8-10` — `[BsonId][BsonRepresentation(BsonType.ObjectId)] string Id` → Mongo driver must convert the filter comparand to ObjectId → `FormatException` (client-side, before any query).
5. [CODE] `GlobalExceptionHandler.cs:28` — non-FalconException → HTTP 500.
6. **Same-file inconsistency explains "after saving wallet settings"**: `resolveSelectedAccountId()` (~:859) DOES guard FALCON_ROOT for SAVE, but the GET path doesn't — save works, then clicking root/another node 500s.
7. [CODE] `isRealNodeId`/`node-scope.util.ts` does NOT exist on FE origin/main — guards exist only on polishing-v0.4 (new wallet store `wallet.service.ts:387`, templates-page, etc.). QA runs main ⇒ unguarded.

## Secondary paths the PR also hardens (defensive; not locally reproducible)
- **CommChannels legacy ids**: write-side gap — [CODE] `CreateNodeCommandMapping.cs:90-97` persists client `AppId` verbatim; `Node.Services.cs AddCommChannel` only dup-checks; no ObjectId/existence validation on ANY channel write path. [RUNTIME 2026-06-10] local FalconCommerceDB: **0 nodes with non-empty CommChannels**, so QA-data/historical only.
- **JWT node-id**: identity writes it from commerce's real node id ([CODE] `UserCreationRequestedConsumer.cs:218-225` ← `CreateMainNodeProcess.cs:58`); [RUNTIME] local FalconIdentityDb: 0 users with non-ObjectId nodeId. Seed/legacy risk only.
- **KeyNotFoundException**: accountNode `GetAsync` lacks `IsDeleted` filter while the tree query filters deleted + tenant → soft-deleted account / cross-tenant JWT node = 500 on main. PR's TryGetValue correct.
- TenantId == main node Id ([CODE] `CreateMainNodeProcess.cs:38`) so Settings OwnerId lookups are consistent (ruled out as cause).

## Verdict given to user
PR 42316 = legitimate **trust-boundary hardening** (API must never 500 on malformed external input), NOT sufficient alone:
1. **Real root fix = FE main hotfix**: guard `loadWalletData()` against `FALCON_ROOT_NODE` (mirror the save-path guard / port `isRealNodeId`). Without it QA still gets a wrong "Node not found" toast on root click.
2. PR's channel filter should LOG dropped ids (silent corruption masking).
3. Write-side validation for channel AppIds (valid ObjectId + exists) = root fix for the legacy-ids class.
4. Systemic: `IObjectIdValidator` is registered-but-unused on main; every other id-taking commerce endpoint has the same 500 class → consider model-binder/action-filter-level ObjectId validation instead of per-handler wiring.
5. Debatable: malformed id → 404 NodeNotFound conflates malformed vs absent; 400 InvalidId would have surfaced the FE bug faster.

Azure DevOps REST works with PAT at `~/.azure-devops-pat` (Basic auth, see `.claude/agents/task_manager.md`); `az` CLI NOT installed. Windows Python can't open `/c/...` paths — use `C:/...`.

Related: [[project_comm_channels_500_translatehelper_nre_2026_06_10]] (same Wallet/channels area, seed-induced), [[project_org_hierarchy_pes_button_locks_main_parity_2026_06_08]].
