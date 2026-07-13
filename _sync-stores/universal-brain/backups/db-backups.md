# Database backups registry (universal brain)

## pre-userid-migration-2026-07-08

- **Location:** `C:\Falcon\backups\pre-userid-migration-2026-07-08\`
- **What:** full dev/QA snapshot before the userId → Zitadel identityUserId one-shot conversion — Mongo (all 7 Falcon DBs, Users=406), Zitadel Postgres, Redis RDB. Manifest in the folder's `README.md`.
- **Restore (any session):** `C:\Falcon\backups\pre-userid-migration-2026-07-08\restore-backups.ps1 -Force -RestartApps`
- **Rule:** Mongo + Zitadel restore together (cross-referenced IDs). Never delete this folder without explicit user instruction (brain hard rule: never delete brain backups automatically).
