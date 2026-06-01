---
name: project-seed-node-id-metadata-fix-2026-05-28
description: "Fixed the local-dev seed so seeded account users get node-id Zitadel metadata = their commerce Main node _id, so the mgmt-console org-hierarchy tree injects the selected node. Also seeded a Main node for the string tenant test-tenant-001 (which could not use the ObjectId(tenantId) convention). JWT-decode + GET commerce/Node verified for accowner/accadmin/toyota-owner/toyota-user."
metadata:
  type: project
  agent: ammar-essentials
  originSessionId: shared
  date: 2026-05-28
  status: completed
---

🟢 RUNTIME-VERIFIED 2026-05-28 (re-seed + login + JWT decode + GET commerce/Node against the live 18-container stack). NO COMMITS — files in working tree.

## The bug (two halves, both confirmed)
The mgmt-console org-hierarchy tree renders empty for seeded users because the FE root resolves as `sessionProvider.node?.id ?? session.nodeId` ([CODE] `falcon-web-platform-ui/apps/host-shell/.../organization-hierarchy-tree/services/services.ts:108` getTree). Both inputs were null:

1. **No `node-id` Zitadel metadata.** `set_zitadel_metadata()` in both seed scripts wrote only `user-id`/`user-type`/`tenant-id` → `session.nodeId` always null. FE reads it at `libs/falcon/.../session-provider.service.ts:122` (`node-id`, base64 via `atob`). Commerce reads the same claim at `SessionProvider.cs:34/73` (`ClaimNodeId="node-id"`).
2. **No commerce Main node for `test-tenant-001`.** Every commerce node uses `_id == ObjectId(tenantId)` (the c1000x convention via `ensureToyotaNode`), but `test-tenant-001` is NOT a 24-hex ObjectId, so it had NO node at all → `GET commerce/Node` returned empty → `sessionProvider.node` never populated. Proven: `ObjectId("test-tenant-001")` throws; `Nodes.findOne({tenantId:"test-tenant-001"})` returned null pre-fix.

## Key backend fact (load-bearing)
[CODE] `falcon-core-commerce-svc/.../GetOrgHierarchyNodeHandler.cs:36` — for a Client user with no NodeId in the query, the root is `GetNodeInfoAsync(currentUser.NodeId ?? currentUser.TenantId)` then `Nodes.GetAsync(x => x.Id == id)`. So for `test-tenant-001` the `node-id` metadata is REQUIRED (not just cosmetic): without it the handler falls back to `TenantId == "test-tenant-001"` and finds no node whose `Id == "test-tenant-001"`.

[CODE] `SessionProvider.cs:74-75` — **THROWS `UnauthorizedUserToPerformThisAction` if a Falcon (system) user carries a `node-id` claim.** So node-id MUST be attached to Client/account users ONLY. The seed scripts gate it on non-empty `tenant_id`; verified sysadmin has only `user-id`+`user-type`.

## Fix (3 files, all under `C:\Falcon\Falcon\Falcon\falcon-essentials\` — note triple "Falcon")
- `seed/seed-service-scenarios.js`: added `ensureTestTenantNode()` (mirrors `ensureToyotaNode`) creating a Main node `_id=000000000000000000a11001` (deterministic real ObjectId), `tenantId:"test-tenant-001"`, type Main(1), level 1, `path=_id`, + `Settingss{ownerId:_id}` + `Tenants{_id:ObjectId}`. Wired into section [A].
- `zitadel/seed-test-users.sh`: added `lookup_main_node_id(tenant)` (mongosh `getSiblingDB("FalconCommerceDB").Nodes.findOne({tenantId,type:1,isDeleted:{$ne:true}})._id`); `set_zitadel_metadata` now appends `node-id` (base64) INSIDE the non-empty-tenant block only. ALSO added `ZITADEL_HOST_HEADER` override (mirrors toyota) + `HOST_HDR` on `mgmt_post`/`mgmt_get`/`register_otp_sms` — without it the documented containerised run fails with "Instance not found" (Zitadel ExternalDomain=localhost).
- `zitadel/seed-toyota-users.sh`: same `lookup_main_node_id` (honors `MONGO_MODE`) + `node-id` appended for all (Toyota users are all Client).

## Node _id values used
- Toyota tenant `690000000000000000c10004` → node-id `690000000000000000c10004` (== tenantId; ObjectId tenant).
- test-tenant-001 → node-id `000000000000000000a11001` (NEW seeded Main node; string tenant can't be its own _id).
- All seeded users sit at the tenant ROOT (no sub-nodes created by either script — `seed-toyota-users.sh:193` puts even `-nodeadmin` on the root), so node-id == root Main node _id uniformly.

## Verification (all PASS, login `stage:4` via `POST :7777/api/auth/login`, password `Admin@1234`)
Token is nested at `.result.tokens.accessToken`. Decoded JWT `urn:zitadel:iam:user:metadata`:
| user | node-id (decoded) | GET commerce/Node (CoreGateway :7038 → container :8080) |
|---|---|---|
| accowner | `000000000000000000a11001` | rows:[{id:`000000000000000000a11001`, label:"Test Tenant 001"}] ✓ |
| accadmin | `000000000000000000a11001` | same ✓ |
| toyota-owner | `690000000000000000c10004` | rows:[{id:`690000000000000000c10004`, label:"Toyota"}] ✓ |
| toyota-user | `690000000000000000c10004` | same ✓ |
| sysadmin | ABSENT (only user-id+user-type) | n/a (Falcon-guard respected) |

## How to re-seed (host lacks jq+curl; use the containerised form)
1. Commerce/charging: `docker cp seed/seed-service-scenarios.js falcon-mongo-1:/tmp/` then `docker exec -i falcon-mongo-1 mongosh --quiet -u root -p example --authenticationDatabase admin /tmp/seed-service-scenarios.js` (run docker exec via PowerShell, NOT Git-Bash — MSYS rewrites the `/tmp/...` arg to a Windows temp path; or set `MSYS_NO_PATHCONV=1`).
2. Users: `docker run --rm --network falcon_default -v ".../zitadel:/zitadel" -e ZITADEL_API=http://falcon-zitadel-1:8080 -e ZITADEL_HOST_HEADER=localhost -e PES_API=http://falcon-pes-1:5296 -e MONGO_URI=mongodb://root:example@falcon-mongo-1:27017/admin?authSource=admin -w /zitadel mongo:latest bash -c "apt-get update -qq && apt-get install -y -qq curl jq [docker.io] && bash ./seed-<test|toyota>-users.sh"`. test-users also needs the docker socket mounted (`-v //var/run/docker.sock:/var/run/docker.sock`) + `docker.io` because its internal mongosh calls use `docker exec falcon-mongo-1`; toyota-users runs fully containerised via `MONGO_MODE=direct`.
3. ORDER MATTERS: run seed-service-scenarios.js BEFORE the user seeds, so the Main node exists for `lookup_main_node_id`.

## Rules learned
- A seeded account user's org-tree node-id == its commerce Main node `_id`, sourced LIVE from `Nodes{tenantId,type:Main}` — never hardcode (correct for both ObjectId tenants where _id==tenantId and string tenants where _id is separate).
- NEVER attach `node-id` to system/Falcon users — `SessionProvider.cs:74` throws.
- String (non-ObjectId) tenants like `test-tenant-001` need an explicitly-seeded Main node with a deterministic real ObjectId `_id`; the `ObjectId(tenantId)` convention silently can't apply.
