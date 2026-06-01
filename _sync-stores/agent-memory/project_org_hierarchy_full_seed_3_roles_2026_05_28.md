# Org-Hierarchy full E2E seed for 3 Client roles + Settings-404 fix + user-node link (2026-05-28)

🟢 LIVE-API-VERIFIED (HTTP+JWT through :7038, all 3 roles) · NO COMMITS · ammar-essentials

## What
Extended the two essentials seed files so EVERY mgmt-console Org-Hierarchy tab/panel loads for
`test-tenant-001` across acc-owner/acc-admin/acc-user. Files (working tree only):
- `C:\Falcon\Falcon\Falcon\falcon-essentials\seed\seed-service-scenarios.js`
- `C:\Falcon\Falcon\Falcon\falcon-essentials\zitadel\seed-test-users.sh`

## Two root-cause fixes (code-verified against commerce/identity C# source)
1. **Settings-404** (`GET commerce/Setting?ownerId=<a11001>` → 404): GetSettingsHandler resolves the
   ownerId (node id) → `node.TenantId` then queries `Settingss` by `OwnerId == tenantId`; Update/Wallet
   handlers query by RAW node id. Brand accounts mask it (node `_id == tenantId`); test-tenant is the
   ONLY account where `_id (a11001) != tenantId ("test-tenant-001")`. FIX: seed BOTH Settings docs
   (`ownerId=tenantId` for GET + `ownerId=nodeId` for PUT). Now 200 with Advanced + 3 IPs + quota.
2. **User-node link** (`identity/user?NodeId=` → 0): UserAggregator.GetNodeUsersAsync filters Mongo
   `User.nodeId` (Eq) + `User.path` (regex). Seed wrote only `node-id` METADATA, never the Mongo
   fields. FIX: upsert_identity_user writes `nodeId` (as ObjectId()) + `path`; existing-doc branch now
   converges ALL mutable fields incl. tenantId (stale tenantId hid users). +4 sub-node users.

## Enrichment (req #1/#2/#4/#5)
applyServicesToNode() seeds root 3 apps+3 channels (varied + 2 shadow rows) + Digital Banking sub-node
(2+1, different). Information full officialData+address on root (VIP/Bank, sector, BudgetNo, VAT). Sub-node
images (3 distinct 1x1 PNGs) on a11002/a11004/a11009 → render as data:image/png;base64,….

## KEY SECURITY MODEL (the non-obvious bit)
[CODE] ListNodeUsersHandler.ResolveNodeIdAsync: AccountOwner(4)+NormalUser(6) are LOCKED to their own
node (request NodeId IGNORED); only **NodeAdmin(5)=acc-admin** can browse arbitrary nodes. So
"click sub-node → different user list" is an **acc-admin-only** behavior; accowner/accuser always see
their own (root) node users. Correct, not a bug. PathPrefix subtree needs IgnoreNodeIdFilter=true (else
ANDs with the resolved nodeId). node-id metadata is Client-ONLY (SessionProvider.NodeId THROWS for Falcon).

## Verification (Admin@1234, :7038)
accadmin per-node users: root=3, HR=1(accadmin-hr), DigitalBank=1(accadmin-db), ContactCtr=1(accuser-cc),
CustCare=1(accuser-care). accowner/accuser: every NodeId→root's 3 users. PathPrefix a11001.a11004 → 2
(accuser-cc + grandchild accuser-care). Settings 200, Information populated, apps/chans/visChans all >0
on root. Idempotent (re-ran both seeds → stable counts). Full detail + tooling notes (winget jq, cygpath
jq-path fix, run commands) in `backups/2026-05-28-ammar-essentials-org-hierarchy-full-seed.md`.

## Node/user id map
a11001 root / a11002 HR / a11003 DigitalBank / a11004 ContactCtr / a11005 Marketing / a11006 IT&Cyber /
a11007 Inbound / a11008 Outbound / a11009 CustCare. Users: accowner/accadmin/accuser@root +
accadmin-hr@a11002, accadmin-db@a11003, accuser-cc@a11004, accuser-care@a11009.

## Open
🟢 BROWSER-verify pending (all checks were live-API not a clicked FE session). NO COMMITS.
Supersedes the data gaps in [[project_seed_node_id_metadata_fix_2026_05_28]] (which fixed node-id metadata
+ test-tenant node) and resolves B-13 (Setting 404) noted in [[project_admin_to_mgmt_e2e_verified_2026_05_28]].
