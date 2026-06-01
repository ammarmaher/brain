---
name: Session Backup - Org-Hierarchy full E2E seed for 3 Client roles
description: Comprehensive reproducible seed so the mgmt-console Org-Hierarchy page tests E2E across acc-owner/acc-admin/acc-user; fixed Settings-404 + user-node-link gap
type: project
agent: ammar-essentials
date: 2026-05-28
status: completed
---

## What Was Done
Extended the two seed files (NO frontend, NO git commits) so EVERY Org-Hierarchy tab/panel
loads for the test-tenant-001 account across all 3 Client roles, verified live against the
running 18-container stack with real JWTs through the core-gateway (:7038).

Files changed (working tree only):
- `C:\Falcon\Falcon\Falcon\falcon-essentials\seed\seed-service-scenarios.js`
- `C:\Falcon\Falcon\Falcon\falcon-essentials\zitadel\seed-test-users.sh`

### Settings-404 ROOT CAUSE + FIX (req #3)
`GET commerce/Setting?ownerId=<a11001>` returned 404 SettingsNotFound. Root cause (code-verified):
- [CODE] GetSettingsHandler.GetTenantIdAsync() resolves the passed ownerId (a NODE id) to
  `node.TenantId`, then GetSecuritySettingsAsync/GetQuotaSettingsAsync query `Settingss` by
  `OwnerId == <resolvedTenantId>`.
- [CODE] UpdateSettingsHandler / ConfigureWalletSettingsHandler query by `OwnerId == command.OwnerId`
  (the RAW node id — no tenant resolution).
- For c1000x brand accounts node `_id == tenantId`, so a single `ownerId=nodeId` doc satisfies BOTH.
  For test-tenant-001 node `_id (a11001) != tenantId ("test-tenant-001")` → the nodeId-keyed doc
  is invisible to the READ path → 404. (test-tenant is the ONLY account where _id != tenantId.)
- FIX: seed BOTH Settings docs — `ownerId="test-tenant-001"` (satisfies GET/the Settings TAB) AND
  `ownerId="000000000000000000a11001"` (satisfies PUT/wallet-config). Both carry Advanced(2) +
  3 allowed IPs + quota (maxNormalUserLimit 100 / maxSystemUserLimit 10 / maxNodeLevels 5 /
  balanceTransferLimitPercentage 25). Verified GET now 200 with real values.

### User→node link gap + FIX (req #6)
`identity/user?NodeId=<x>` returned 0 users. Root cause (code-verified):
- [CODE] UserAggregator.GetNodeUsersAsync filters on Mongo `User.nodeId` (Eq) + `User.path` (regex `^prefix`).
- The seed wrote only `node-id` Zitadel METADATA, never the Mongo `nodeId`/`path` fields → 0 matches.
- FIX: `upsert_identity_user` now writes `nodeId` (as ObjectId() so the [BsonRepresentation(ObjectId)]
  Eq filter matches) + `path` (looked up live from the node). Existing-doc branch now converges ALL
  mutable fields incl. `tenantId` (a stale wrong tenantId from a buggy first run hid users from
  their node — the aggregator filters `u.TenantId == currentUser.TenantId`).
- Added 4 EXTRA users at sub-nodes (11th provision_user arg = sub-node id, threaded into BOTH the
  Mongo nodeId/path AND the node-id metadata, mirroring CreateUserProcess prod behavior):
  accadmin-hr@a11002, accadmin-db@a11003, accuser-cc@a11004, accuser-care@a11009 (deep grandchild).

### Apps/Channels/Info/Images (req #1/#2/#4/#5)
- applyServicesToNode() (node-_id-targeted variant of applyServices) seeds the test-tenant root
  with 3 apps + 3 channels (varied statuses/visibilities + 2 pending-price shadow rows) and the
  Digital Banking sub-node (a11003) with a smaller different mix (2 apps + 1 channel) so tabs
  differ per selected node. Shapes match FalconServiceConfigurationBase exactly (svc() already correct).
- Information enriched on root: full officialData (entityName, sector[string], licenseNo→BudgetNo,
  anotherId, vatRegistrationNumber, classification VIP/Bank) + full address. Idempotent back-fill
  for the already-created node.
- Sub-node images (3 distinct 1x1 PNGs) on a11002/a11004/a11009 via accountDetails.profilePictureUrl
  (raw PNG bytes BinData subtype 0). Render confirmed as data:image/png;base64,… via tree endpoint.

## Live Verification Matrix (core-gateway :7038, real JWTs, Admin@1234)
PER-NODE (probed as accadmin / NodeAdmin):
  a11001 Root        image=YES settings=200 info=YES apps=3 chans=3 visChans=3 users=3
  a11002 HR          image=YES settings=200 info=n/a* apps=0 chans=0 visChans=0 users=1 (accadmin-hr)
  a11003 DigitalBank image=no  settings=200 info=n/a* apps=2 chans=1 visChans=1 users=1 (accadmin-db)
  a11004 ContactCtr  image=YES settings=200 info=n/a* apps=0 chans=0 visChans=0 users=1 (accuser-cc)
  a11009 CustCare    image=YES settings=200 info=n/a* apps=0 chans=0 visChans=0 users=1 (accuser-care)
  * sub-nodes are eNodeType.Sub → GetMainNodeInfoHandler (Main-only) returns null BY DESIGN.
PER-ROLE (root node):
  accowner : tree=200 settings=200 info=200 apps=3 visChans=3 users@root=3 users@HR=3 (NodeId ignored→own node)
  accadmin : tree=200 settings=200 info=200 apps=3 visChans=3 users@root=3 users@HR=1 (NodeAdmin honors NodeId)
  accuser  : tree=200 settings=200 info=200 apps=3 visChans=3 users@root=3 users@HR=3 (NodeId ignored→own node)
PathPrefix subtree (CC = a11001.a11004 + IgnoreNodeIdFilter): 2 users (accuser-cc + accuser-care/grandchild). ✓
Idempotency: both seeds re-ran → STABLE (8 sub-nodes, 3+3 root apps/chans, 1 Settings per ownerId, 7 users).

## Key Decisions / Learnings
- KEY SECURITY MODEL: [CODE] ListNodeUsersHandler.ResolveNodeIdAsync — AccountOwner(4)/NormalUser(6)
  are LOCKED to currentUser.NodeId (request NodeId IGNORED); only NodeAdmin(5)=acc-admin may browse
  any node in the tenant. So "click sub-node → different user list" is an acc-admin-only behavior;
  accowner/accuser always see their own (root) node's users. This is correct, not a bug.
- Settings is TENANT-scoped on read (handler resolves nodeId→tenantId), so Setting?ownerId=<any
  sub-node> ALSO returns 200 (sub-node.tenantId == test-tenant-001 → same tenant Settings doc).
- node-id metadata is Client-ONLY: [CODE] SessionProvider.NodeId getter THROWS for a Falcon user
  carrying node-id. Seed already guards (only when tenant_id non-empty).
- Mongo is replica set rs0 (primary). Run order: commerce seed BEFORE user seed (user metadata
  looks up the node live).

## Tooling Notes (host = Windows / Git-Bash)
- `jq` not on host → installed via `winget install jqlang.jq` (1.8.1) at
  `C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\jqlang.jq_*\jq.exe`. Add to PATH to run seed.
- Native jq.exe CANNOT open MSYS `/tmp/...` paths → patched provision_account_roles_for_tenant() to
  `cygpath -w` the jq --slurpfile/input/missing paths (no-op on Linux/in-container). That PES step is
  a confirmed no-op (test-tenant acc-* `p` rules already exist: 92 p + 7 g rules).
- Run commerce seed: `docker cp seed/seed-service-scenarios.js falcon-mongo-1:/tmp/seed-svc.js &&
  MSYS_NO_PATHCONV=1 docker exec -i falcon-mongo-1 mongosh --quiet -u root -p example
  --authenticationDatabase admin /tmp/seed-svc.js`
- Run user seed: from `falcon-essentials/zitadel`, jq on PATH, `MSYS_NO_PATHCONV=1 bash seed-test-users.sh`
- JWT custom claims live INSIDE `urn:zitadel:iam:user:metadata` (base64 values), NOT top-level —
  the auth middleware flattens them into ClaimsPrincipal server-side.

## What Remains / Open
- 🟢 BROWSER-VERIFICATION pending: all checks were live-API (HTTP+JWT), not a real browser session.
  The actual mgmt-console FE render of the now-populated tabs has not been clicked through this session.
- NO COMMITS — both files are in the working tree awaiting user "commit".
- Node ids: a11001 root / a11002 HR / a11003 DigitalBank / a11004 ContactCtr (a11007 Inbound /
  a11008 Outbound / a11009 CustCare grandchildren) / a11005 Marketing / a11006 IT&Cyber.
- Users: accowner/accadmin/accuser @ root; accadmin-hr@a11002, accadmin-db@a11003, accuser-cc@a11004,
  accuser-care@a11009. All password Admin@1234.
