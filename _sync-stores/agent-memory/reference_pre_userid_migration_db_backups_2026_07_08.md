---
name: reference-pre-userid-migration-db-backups-2026-07-08
description: "Full dev-stack DB backups (Mongo all 7 DBs + Zitadel Postgres + Redis RDB) taken 2026-07-08 before the userId→Zitadel-id migration; one-command restore script; ANY session asked to \"restore the backups\" runs it"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 91d60cf0-557e-4b34-bac6-62f1854bf742
---

**Backups live at `C:\Falcon\backups\pre-userid-migration-2026-07-08\`** — taken 2026-07-08 before the userId → identityUserId (Zitadel) one-shot conversion, per Ammar's instruction. No production data exists; this is the dev/QA seeded state.

Contents (all verified restorable at creation): `falcon-mongo-all.archive.gz` (mongodump of ALL 7 app DBs — FalconIdentityDb **Users=406**, Commerce, Charging, ContactGroup, Provisioning, Template, PES; 12.7 MB), `zitadel.pgdump` (pg_dump -Fc of the zitadel Postgres DB — the Zitadel accounts/identityUserIds), `pg-globals.sql` (zitadel role), `redis-dump.rdb` (340 keys; Redis has `appendonly yes` so restore must delete `/data/appendonlydir` — script handles it), `README.md` (full manifest + credentials), `restore-backups.ps1`.

**If Ammar asks in ANY session to restore the backups / go back to the seeded data, run:**
```powershell
C:\Falcon\backups\pre-userid-migration-2026-07-08\restore-backups.ps1 -Force -RestartApps
```

**Why:** this is the agreed one-command undo for the userId-deletion migration ([[project-userid-vs-identityuserid-consolidation-audit-2026-07-07]]). Mongo + Zitadel must be restored together — Zitadel metadata `user-id` ↔ Mongo `identityUserId` cross-reference; restoring one alone breaks logins.

**How to apply:** stack containers are `falcon-mongo-1` (root/example), `falcon-postgres-1` (postgres/postgres), `falcon-redis-1` (volume `falcon_redis-data`). Kafka/MinIO deliberately not backed up (re-derivable / untouched by the migration). Expected post-restore check: FalconIdentityDb.Users = 406.

**⚠ POST-CONVERSION (2026-07-08):** the Zitadel-ID conversion HAS BEEN RUN on live. Live DB is now the ONE-ID world (Users._id = Zitadel id, no identityUserId field, 405 users). A SECOND checkpoint backup of the PRE-conversion 405-user state is at `C:\Falcon\backups\checkpoint-pre-conversion-2026-07-08\` (its restore-backups.ps1 copy still points at the pre-migration archive path — to restore the 405-user pre-conversion state, restore that folder's own falcon-mongo-all.archive.gz manually or edit the path). Restoring EITHER backup reverts to the OLD two-id world — you must also revert code (branch feature/zitadel-id-consolidation) and the docker-compose.override.yml NuGetAudit line, else services expect one-id data. See [[project-zitadel-id-consolidation-live-done-2026-07-08]].
