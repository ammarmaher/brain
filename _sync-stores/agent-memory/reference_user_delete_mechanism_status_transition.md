---
name: reference_user_delete_mechanism_status_transition
description: How Falcon deletes a user — no hard-delete endpoint; PUT /identity/user/status to Deleted(5); Pending users need two-step Pending→Active→Deleted; end state = Mongo soft-delete + Zitadel deactivate
metadata: 
  node_type: memory
  type: reference
  originSessionId: 7b8c2343-b061-42ef-ab18-767849fe9f56
---

Falcon Identity has **no dedicated delete endpoint**. Deleting a user = `PUT /identity/user/status` (gateway) → identity `PUT /api/user/status` with body `{ userId, newStatus }` where `userId` is the Mongo `User._id` (NOT identityUserId) and `newStatus = eUserStatus.Deleted (5)`. Endpoint: `ChangeUserStatusEndpoint` → `ChangeUserStatusProcess`.

`UserStatusTransitionPolicy` ([CODE] `Domain/Policies/UserStatusTransitionPolicy.cs`) state machine:
- Pending → Active | Locked   (⚠️ **NOT** Deleted — so a Pending user can't be deleted in one call)
- Active → Suspended | Deleted | Locked
- Suspended → Active · Locked → Pending · Deleted → Active (restore is **Falcon-user-only**)

So to delete a **Pending** user you must two-step: **Pending → Active → Deleted** (this is exactly what the mgmt-console user-details status dropdown drives; the FE dropdown only offers backend-allowed transitions via `STATUS_TRANSITIONS` rules).

The Deleted branch (`ChangeUserStatusProcess`): calls Zitadel `DeactivateUserAsync(identityUserId)` then `userRepository.DeleteAsync` (soft-delete: sets `isDeleted=true`, `deletedAt`, `deletedBy`; the `status` field is left unchanged — `effectiveStatus = IsDeleted ? Deleted : Status` makes isDeleted authoritative) + invalidates the user-status cache. **End state = Mongo soft-delete + Zitadel account `USER_STATE_INACTIVE` (no hard removal; restorable by a Falcon admin via Deleted→Active).**

Client (acc-owner) callers never see deleted users: `ListNodeUsersHandler` strips Deleted from the status filter and forces `includeDeleted=false` for non-Falcon; `IncludeDeleted=true` is Falcon-only. So a soft-deleted user disappears from the mgmt-console list automatically.

Verified end-to-end 2026-06-23 deleting QA user qa_owner_6657513 (Pending acc-owner on node a11002) via Core Gateway :7038 as accowner — both PUTs 200, Mongo isDeleted=true, list totalCount=0, Zitadel USER_STATE_INACTIVE. Related: [[project_unlock_locked_to_pending_reissue_credentials_2026_06_23]] (the Locked→Pending branch of the same process).
