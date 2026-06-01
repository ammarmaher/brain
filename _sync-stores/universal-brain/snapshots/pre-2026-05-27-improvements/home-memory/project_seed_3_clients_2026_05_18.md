---
name: Seed 3 car-brand client accounts + 9 users
description: Backend seed code for Mitsubishi/Honda/Mercedes clients + 9 role-varied users for PES testing. Code-complete, NOT compiled (.NET 10 SDK absent).
type: project
originSessionId: a8853276-9745-4ce1-8626-4531781606e3
---
Backend seed code added 2026-05-18 so the local Falcon backend auto-creates 3 test client accounts + 9 users on startup — for PES + integration testing.

**Commerce** (`falcon-core-commerce-svc/.../Infrastructure/Seeding/`): new `ClientAccountSeedData.cs` + `DatabaseSeeder.SeedClientAccountsAsync`; new seed-only factory `Node.CreateSeedMainNode` in `Node.Operations.cs`. Seeds 3 accounts — each a Node (Level 1, `NodeType.Main`) + Settings + Tenant with deterministic `Id == TenantId == Path`:
- Mitsubishi `690000000000000000c10001`
- Honda `690000000000000000c10002`
- Mercedes `690000000000000000c10003`
Calls `IAccessRoleBootstrapClient.BootstrapAccountRolesAsync(tenantId)` per client. Logo = `LogoBase64` constant per client, currently `null` (TODO — owner to supply images).

**Identity** (`falcon-core-identity-svc/.../Infrastructure/Seeding/`): extended `SeedData.cs` + `DatabaseSeeder.cs`. 9 client users via the existing idempotent `SeedUserAsync` (Zitadel import + Mongo + metadata). New `SyncClientUserRoleLinkAsync` does per-user PES sync (`IAccessRoleLinkClient.SyncPrimaryRoleAsync`). Users (password `Admin@1234`, `<username>@falcon.local`): `<client>-owner` (AccountOwner), `<client>-nodeadmin` (NodeAdmin), `<client>-user` (NormalUser) for mitsubishi/honda/mercedes.

**Architecture note:** seeded clients are top-level `NodeType.Main` Level-1 nodes — identical shape to the existing BMW client. `GET commerce/Node` returns all top-level Main nodes; the FE renders them all as children of the synthetic "Falcon" root. So all clients appear "under one node" by construction — no separate linking step exists.

**Status 2026-05-18 — SEEDED & LIVE.** The docker compose runs the services off `mcr.microsoft.com/dotnet/sdk:10.0` with source volume-mounted (`dotnet run` compiles in-container) — so a `docker compose restart` was all that was needed (no host .NET 10 SDK). Seed code compiled clean. Confirmed: 3 client accounts in `FalconCommerceDB`, 9 users in `FalconIdentityDb.Users` + Zitadel, `POST /api/auth/login` for the seeded users succeeds.

**PES grants — RESOLVED 2026-05-18.** The 9 users now have correct per-tenant PES grants (9 `g`-rules + per-tenant `p`-rules; verified `pes/authorize` returns role-correct allow/deny). Two pre-existing infra bugs were fixed:
1. **Commerce→PES bootstrap 401** — `pes/roles/bootstrap/account/{tenantId}` is `SystemOnly`; the startup seeder has no JWT. Fixed in PES `falcon-core-access-svc/.../PolicyDataSource/RoleDbDataSource.cs` — `EnsureRoleExistsAsync` now provisions the per-tenant `acc-*` role catalog **on-demand** (via `IBuiltInRoleProvisioner`) instead of throwing. Production `CreateMainNodeProcess` was never affected (it runs in an authed request).
2. **PES Kafka Avro deserialization failure** — NOT a schema mismatch: the `pes` service in `docker-compose.yml` was **missing `Kafka__SchemaRegistryUrl`** → fell back to a host-only URL unreachable from the container → schema fetch refused. Fixed by adding `Kafka__SchemaRegistryUrl: http://schema-registry:8081` to the `pes` service. **This was a real production bug** — the Add User wizard's role-link events were also being silently dropped in this local stack.

**Standing fact:** any Kafka-consuming service needs `Kafka__SchemaRegistryUrl` set in docker-compose, else Avro deserialization fails with a generic `Local: Value deserialization error`.

Known minor: Commerce still logs a harmless 401 warning at startup for the bootstrap HTTP call (PES on-demand provisioning covers it). Clean follow-up = give Commerce a Zitadel service-to-service token.

**Client-user login fixes 2026-05-18:**
- `applications`/`comm-channels` 500 — seeded service rows used `id` instead of `_id` (Mongo driver expects `_id`) + invalid `status:None+visibility:true` rows. Seed-data fix.
- `commerce/Node`-scoped endpoints 500 — the FE sent the synthetic string `FALCON_ROOT_NODE` as a node id → Commerce `FormatException` parsing it as an ObjectId. Fixed: `OrgHierarchyTreeApiService` (`host-shell/.../organization-hierarchy-tree/services/services.ts`) now uses session-resolved `useGateway()` (Falcon→System, Client→Core) and builds the synthetic `Falcon` root ONLY for Falcon users — client users root at their real tenant node. Backend defense: 4 Commerce handlers now `400` on malformed node ids via `IObjectIdValidator`.
- **SECURITY — cross-tenant leak:** via Core Gateway a client user could read another tenant's node `information` (HTTP 200, full payload). Fixed `GetMainNodeInfoHandler` with `ValidateClientOwnershipAsync` → now `422`. **STILL OPEN:** `GetAccountApplicationsHandler` + `GetAccountCommunicationChannelsHandler` lack the same ownership check — a client can still list another tenant's services/channels. Follow-up flagged.
- Identity login `Regex.Escape(null)` 500 on blank username → guarded, now clean `401`.

Verified live: `mitsubishi-owner` own-tenant endpoints all 200, cross-tenant 422, Falcon admin no regression. Not committed/pushed.
