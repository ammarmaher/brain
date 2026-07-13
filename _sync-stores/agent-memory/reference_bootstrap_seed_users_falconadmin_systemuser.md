---
name: reference-bootstrap-seed-users-falconadmin-systemuser
description: "The auto-seeded bootstrap chain — Zitadel machine PATs (Docker) + FalconAdmin & system-user (identity DatabaseSeeder at startup); live IDs, PES rule, config pin; MUST survive any userId migration and bootstrap new envs"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 91d60cf0-557e-4b34-bac6-62f1854bf742
---

**The Falcon bootstrap chain (live-verified 2026-07-08), three layers:**

1. **Docker/Zitadel first-instance (machine accounts, not Falcon users):** compose seeds Zitadel machine user `admin` (IAM_OWNER, PAT at `falcon-essentials/zitadel/admin.pat` → used by identity's `ZitadelAdmin` HTTP client) and `login-client` (PAT for login UI v2). [CODE] docker-compose.yml:272-280. No Mongo docs; unaffected by any user-id migration.
2. **Identity startup seeder** ([CODE] Infrastructure/Seeding/DatabaseSeeder.cs — idempotent Cases A-D, runs every identity boot): seeds TWO Falcon users (SeedData.cs): `FalconAdmin` (Admin@1234) and `system-user` (UserPassword1!), both SystemAdministrator/Falcon/Active, phone+email pre-verified, OTP SMS registered → login-capable from first boot in ANY environment.
3. **Live IDs (dev stack):** `system-user` → Zitadel `373183196222717962`, Mongo `6a085523280ff3f06d692615`; `FalconAdmin` → Zitadel `373183967806881802`, Mongo `6a085523280ff3f06d692613`.

**Where their IDs appear (full 7-DB scan 2026-07-08 — only 3 places):** their own `Users` docs; 2 `AuditLogs` creation rows (entityId = Mongo id); ONE PES g-rule `u:373183196222717962@system → r:sys-admin@system` (already Zitadel-id). Plus config pin `appsettings.Development.json Zitadel:Initialization:SystemUserId = 373183196222717962` (Zitadel id — migration-safe) and Zitadel metadata `user-id` mirror (retired by the migration).

**⚠ GAP: `FalconAdmin` has NO PES g-rule** — only `system-user` can pass PES. `system-user` is THE working bootstrap admin.

**Why:** Ammar's standing requirement — every environment (dev/staging/prod) must self-bootstrap one login-capable Falcon admin, and any userId→Zitadel-id migration MUST preserve these users. They survive automatically: login is by username via Zitadel (untouched), JWT sub = Zitadel id (unchanged), PES rule already Zitadel-keyed, config pin already Zitadel-id.

**How to apply:** in the one-shot conversion, the seeder (DatabaseSeeder + SeedData) is one of the 3 creation sites to rewrite — new-world Case D inserts Mongo doc with `_id = <zitadel id>`, no identityUserId field, no metadata mirror; then fresh staging/prod envs bootstrap directly in the one-ID world with zero migration. Consider seeding FalconAdmin's missing g-rule at the same time. Related: [[project-userid-vs-identityuserid-consolidation-audit-2026-07-07]], [[reference-pre-userid-migration-db-backups-2026-07-08]].
