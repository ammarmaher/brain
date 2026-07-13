---
name: project_deleted_user_status_persist_backfill_2026_06_30
description: "Identity delete write-path now persists Status=Deleted + backfill migration so SA list shows \"Deleted\" not stale \"Active\" for soft-deleted users"
metadata: 
  node_type: memory
  type: project
  originSessionId: 37cd1031-dd3d-4c1a-9986-352d66d300cb
---

FIXED (identity-svc, backend-only, write-side + backfill): AO deletes a user → it leaves the AO (Client) list (correct, isDeleted filter), but the Falcon/SA list (which intentionally sends `IncludeDeleted=true` so admins can audit/restore — BY DESIGN, not a bug) showed the user with status **"Active"** instead of "Deleted". This is bug (4) of [[project_user_lifecycle_4_bugs_rootcause_2026_06_30]] (task 502153e6).

**Root cause:** delete write-path flips only the soft-delete flag, never Status. `ChangeUserStatusProcess.cs` Deleted branch called `userRepository.DeleteAsync(...)` (which in `MongoRepository.DeleteAsync` sets only `isDeleted=true`/`deletedAt`/`deletedBy`) and SKIPPED the `else` branch that would `b.Set(u=>u.Status, NewStatus)`. Read-path is blind to isDeleted: `UserMapper.MapToInfoResponse` maps `Status=user.Status` only; `UserInfoResponse` has no IsDeleted field; FE maps label purely from numeric status (`USER_STATUS_BY_NUM{5:'deleted'}` exists but status arrived as 2=Active). Enum `eUserStatus`: Pending=1/Active=2/Suspended=3/Locked=4/**Deleted=5**. System-gateway = pure YARP pass-through (not culprit). Handler already computed `effectiveStatus = IsDeleted ? Deleted : Status` for transition validation only — never persisted/projected.

**Fix (chose write-side + backfill over read-side derivation):**
1. `ChangeUserStatusProcess.cs` Deleted branch: kept `DeleteAsync` (preserves soft-delete audit + deletedAt/deletedBy) and ADDED `await userRepository.UpdateOneAsync(u=>u.Id==id, b=>b.Set(u=>u.Status, eUserStatus.Deleted))`. Restore branch (`Deleted→Active`, Falcon-only via `UserStatusTransitionPolicy`) already reverses both (Status→Active + clears isDeleted) — unchanged, validates because effectiveStatus=Deleted either way.
2. NEW `BackfillDeletedUserStatusMigration` (Id `2026-06-30-backfill-deleted-user-status`, modeled on `UnsetWalletOwnerFieldMigration`): `UpdateMany {isDeleted:true, status:{$ne:5}} → set status=5`. Idempotent. Registered in `ServiceCollectionExtensions.cs:187` after the wallet-owner migration; runs via `MongoMigrationRunner` on startup. Handles HISTORICAL rows soft-deleted under old code (isDeleted=true but Status=2).
3. No FE / DTO / gateway change — after fix DTO carries Status=5 → FE renders 'deleted'.

**Status-filter side-effect (intended):** `UserAggregator.GetNodeUsersAsync` with `statuses=[Active]` will now correctly EXCLUDE deleted users (they're Status=Deleted, not Active) — desired semantics, no caller relied on the old leak.

Tests (all GREEN): `ChangeUserStatusProcessTests` +2 (ActiveToDeleted persists Status=Deleted via captured update-builder; DeletedToActive restores Status=Active + clears isDeleted=false); `UserMapperTests` +1 (deleted user → InfoResponse.Status=Deleted); `BackfillDeletedUserStatusMigrationTests` +1. `dotnet build -warnaserror` 0/0; full suite **219 passed / 2 failed** — the 2 are PRE-EXISTING `ResendOtpProcessTests` (OTP code null, unrelated).

**UNCOMMITTED** on branch `fix/identity-mongo-migration-invalid-id-index` (the local-patched main from [[project_backend_flip_to_main_deploy_2026_06_30]]). 6 files mine; other modified files in tree (Zitadel*, UpdateUserProfile*, PasswordPolicy*) are pre-existing from other sessions, untouched. Live SA-list E2E (Docker) user-gated — verified at unit level only.
