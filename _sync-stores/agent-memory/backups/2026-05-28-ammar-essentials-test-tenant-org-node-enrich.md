---
name: session-backup-test-tenant-001-org-node-enrichment-image-sub-node-hierarchy
description: Enriched ensureTestTenantNode() so the accowner org tree shows a real image + a 2-level child hierarchy; verified live through core-gateway with an accowner JWT
metadata: 
  node_type: memory
  type: project
  agent: ammar-essentials
  date: 2026-05-28
  status: completed
  originSessionId: 5765fd0b-7ece-42b3-ba8b-b4490986863b
---

## What Was Done
Enriched `ensureTestTenantNode()` in
`C:\Falcon\Falcon\Falcon\falcon-essentials\seed\seed-service-scenarios.js`
so the canonical Client test tenant `test-tenant-001` (Main node
`000000000000000000a11001`) renders a real org node in the management-console
org tree: an IMAGE on the root + a child sub-node hierarchy (was a bare,
image-less, child-less leaf).

1. **Image** — added `accountDetails.profilePictureUrl` = `BinData(0, <b64>)`
   holding an 83-byte valid 16x16 teal PNG (PNG magic `89 50 4E 47`,
   `iVBORw0KGgo…`). Two paths: the node-insert branch now writes it, AND an
   idempotent back-fill `$set`s it on the (already-existing) live node only
   when `accountDetails.profilePictureUrl` is missing/empty.
2. **Children** — `TEST_TENANT_CHILDREN` array + a `forEach` upsert (keyed on
   deterministic `_id`). 5 direct (level 2) + 3 grandchildren (level 3) under
   Contact Center. Array order puts Contact Center before its grandchildren so
   the grandchild path-lookup finds the already-upserted parent on first run.

### Seeded hierarchy (ids + names + parent links)
```
000000000000000000a11001  Test Tenant 001     (Main, level 1, HAS IMAGE)
 ├─ 000000000000000000a11002  Human Resources    (Sub, level 2, parent a11001)
 ├─ 000000000000000000a11003  Digital Banking    (Sub, level 2, parent a11001)
 ├─ 000000000000000000a11004  Contact Center     (Sub, level 2, parent a11001, hasChildren)
 │    ├─ 000000000000000000a11007  Inbound Call   (Sub, level 3, parent a11004)
 │    ├─ 000000000000000000a11008  Outbound Call  (Sub, level 3, parent a11004)
 │    └─ 000000000000000000a11009  Customer Care  (Sub, level 3, parent a11004)
 ├─ 000000000000000000a11005  Marketing          (Sub, level 2, parent a11001)
 └─ 000000000000000000a11006  IT & Cybersecurity (Sub, level 2, parent a11001)
```
Every sub-node: `tenantId:"test-tenant-001"`, `type:2` (eNodeType.Sub),
`parentId: ObjectId(...)`, `path` = dot-joined node-id chain, no `accountDetails`.

## What Remains
Nothing required. The task is fully delivered and live-verified.
Optional future polish (NOT requested): give some sub-nodes their own
`profilePictureUrl` if a child image is ever wanted (children currently render
the initials chip by design, matching handler-created sub-nodes).

## Key Decisions
- **Store PNG BYTES, not a URL string.** Source contract: the FE root image is
  `node.AccountDetails.ProfilePicture` (`byte[]`, BSON field `profilePictureUrl`,
  Binary). `GetOrgHierarchyNodeHandler` → `FromBytesToImgSrc()` →
  `data:image/png;base64,...`. A string would not bind to the `byte[]` member.
  Mirrors how the C#-seeded brand nodes (Mitsubishi) store their logo.
- **`parentId` written as `ObjectId(...)`, never a string.** `Node.ParentId` is
  `[BsonRepresentation(BsonType.ObjectId)]`; `NodeAggregator` joins via
  `$lookup(localField:_id, foreignField:parentId)` and filters
  `Eq(n=>n.ParentId, id)`. A string parentId makes the node invisible to the
  children endpoint.
- **Did NOT rely on a stored `hasChildren` flag.** Backend computes it
  (`AnyAsync(c.ParentId==id)` for root; `$lookup relatedNodeIds.Any()` for
  children). Real child docs + ObjectId parentId are the structural truth.
- **Paths prefixed by root id** so `EnsureNodeInScopeAsync` (Client scope check:
  requested node Path must startWith user node Path) authorises accowner through
  every level.
- **Idempotent via deterministic `_id` upserts + a guarded image back-fill.**
  Re-ran twice → 9 nodes total, 0 duplicate names, image set exactly once.

## Files Changed
- `C:\Falcon\Falcon\Falcon\falcon-essentials\seed\seed-service-scenarios.js`
  (the ONLY file changed — added `TEST_TENANT_LOGO_B64/_BIN` + `TT` +
  `TEST_TENANT_CHILDREN` consts near the top; extended `ensureTestTenantNode()`
  with the image-in-insert, the back-fill `$set`, and the child upsert loop).
- No frontend code. No .NET recompile. NO git commits (working tree only).

## Context for Next Agent
- Source-of-truth handler: `GetOrgHierarchyNodeHandler.cs` (commerce). Root login
  fetch = NodeId empty → single own node; expand = `GET commerce/Node?NodeId=<id>`
  → `nodeAgg.GetChildrenHierarchyInfoAsync(id)`.
- Response DTO `GetHierarchyNodeResponse { Id, Label, TenantId, HasChildren, Url, Path }`.
- Live verification recipe (stack must be up):
  1. `TOKEN=$(curl -s -4 -X POST http://localhost:7777/api/auth/login -H "Content-Type: application/json" -d '{"username":"accowner","password":"Admin@1234"}' | … .result.tokens.accessToken)`
  2. `curl -s -4 -H "Authorization: Bearer $TOKEN" http://localhost:7038/commerce/Node`
     → root with `url=data:image/png;base64,…` + `hasChildren=true`.
  3. `…/commerce/Node?NodeId=000000000000000000a11001` → 5 direct children.
  4. `…/commerce/Node?NodeId=000000000000000000a11004` → 3 grandchildren.
- Running the seed: container has NO `/seed` mount right now. Copy the file in
  and run from `/tmp`, and PREFIX docker cp/exec with `MSYS_NO_PATHCONV=1` (Git
  Bash otherwise rewrites `/tmp/...` into a Windows path and the run fails ENOENT):
  ```
  MSYS_NO_PATHCONV=1 docker cp "<path>\seed-service-scenarios.js" falcon-mongo-1:/tmp/seed-service-scenarios.js
  MSYS_NO_PATHCONV=1 docker exec -i falcon-mongo-1 mongosh --quiet -u root -p example --authenticationDatabase admin /tmp/seed-service-scenarios.js
  ```
- accowner `node-id` Zitadel metadata already = `000000000000000000a11001`
  (set by `zitadel/seed-test-users.sh`), so no identity re-seed was needed.
