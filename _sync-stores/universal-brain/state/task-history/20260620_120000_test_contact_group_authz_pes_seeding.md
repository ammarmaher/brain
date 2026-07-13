# Task History — Verify 2 pushed branches (PR 42603 + PR 42601)

- **Date:** 2026-06-20
- **Type:** Testing/verification (NO feature code — fetch/build/run/seed/verify only)
- **Result:** STEP 2 PASS (one task-expectation superseded by the pinned SHA); STEP 3 PASS (a–d)

## Branches landed (STEP 0)
| Repo | Branch | Expected | Resolved | Status |
|---|---|---|---|---|
| falcon-core-access-svc | feat/pes-contact-group-act-on-other | b8fbbc8 | **b8fbbc8** | clean, no ahead/behind |
| falcon-core-contact-group-svc | feat/contact-group-validation-permissions-svc | 683bcb9 | **683bcb9** | clean, no ahead/behind |

- contact-group had 15 files of local WIP → stashed `stash@{0}` ("pre-test-stash-2026-06-20"). Restore: `git stash pop`.

## Infra (STEP 1)
Already up; compose project `falcon` (C:/Falcon/Falcon/Falcon/docker-compose.yml), bind-mount C:/Falcon/Falcon→/workspace. mongo27017/redis6379/kafka9092/zitadel8080/postgres5432 healthy. pes=falcon-pes-1:5296, contact-group=falcon-contact-group-1:7300→8080. Both restarted to rebuild from target branches (dotnet run, no hot-reload).

## STEP 2 — PES seeding (PASS, edit-other expectation superseded)
Boot log (pes restart): `Ensured built-in Account roles for all existing tenants. New rules created: 378` → no migration; grants reached existing tenants on boot.
Live catalog GET /pes/policyrulesByObj?obj=acc.contact-group across **42 tenants**:
- acc-owner share-other allow: **42/42** ✓
- acc-admin share-other allow: **42/42** ✓
- acc-user share-other: **0** ✓ (own-only; share keeps creator ABAC)
- **edit-other: 0 for ALL roles** — catalog has none.
Unit tests (T2.PES.Test, run in sdk:6.0 container with -p:OutDir=/tmp to dodge live-API file lock):
- account_roles_contact_group_share_other_matrix → **PASSED**
- account_roles_contact_group_edit_other_matrix → **FAILED** ("Expected acc-owner to have acc.contact-group/edit-other = allow", line 168) — STALE.
Root: branch commit 23f2ab9 added edit-other+share-other; HEAD b8fbbc8 ("Supersedes the earlier edit-other grant") removed edit-other (edit creator-only for all) but did NOT update the test. Task's STEP 2 written expectation (acc-owner edit-other) is OUTDATED vs the pinned SHA.

## STEP 3 — contact-group authz (PASS a–d)
Literal fixture (group 6a33d4ec…, BMW tenant, Test AO/NA) ABSENT from this DB. Verified the identical code path with equivalent real data: Mitsubishi tenant 690000000000000000c10001 (mitsubishi-owner=AO / -nodeadmin=NA / -user=NU, pwd Admin@1234) + Toyota c10004 (cross-tenant). Seeded 2 not-shared/Completed fixtures: F1=6a367a650ec47f4c459df8a3 (NA-created), F2=6a367a8ebddce868e69df8a3 (NU-created).
Through Core Gateway :7038 /contactgroup/contact-groups/… (details, /contacts, /files/Original):
| viewer | details | contacts | download |
|---|---|---|---|
| (a) AO mitsubishi-owner | 200 | 200 | 200 (was 403) |
| (b) NA mitsubishi-nodeadmin | 200 | 200 | 200 |
| (c) NU mitsubishi-user | 403 | 403 | 403 |
| (d) cross-tenant toyota-owner | 404 | 404 | 404 |
F2 bonus: AO 200, NA 200 (both non-creator → hierarchy branch), NU(creator) 200, cross 404.
Gate = ContactGroup.IsViewableBy (683bcb9): Falcon | creator | shared | (role≠NormalUser AND Path==userPath or Path startsWith userPath+"."). origin/main (de2c1a3) gate = creator/shared only → AO/NA non-creator=403; NU on branch still uses that path (403) = runtime proxy for the "before". 
NOTE: origin/main FAILS to build here (NU1902/NU1903 SharpCompress 0.30.1 / Snappier 1.0.0 vuln warnings-as-errors); branch Directory.Build.props excepts them → branch also fixes local buildability.

## Open items for user
1. PR 42603 ships a STALE unit test (`account_roles_contact_group_edit_other_matrix`) that will fail CI — update or remove it.
2. Task STEP 2 "acc-owner edit-other" expectation no longer matches the pinned SHA (deliberately superseded).
3. origin/main currently un-buildable locally (NU1902/NU1903).
4. contact-group `stash@{0}` = user's set-aside WIP → `git stash pop` to restore.
5. Seeded DELETE_ME fixtures left for optional UI re-verify; cleanup command in progress-log.
