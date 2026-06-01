---
name: Add Client photo not persisted — wire field-name mismatch
description: Root cause + fix for new client/owner profile pictures not saving; FE wire builder field names didn't match the Commerce backend CreateAccountRequest DTO
type: project
originSessionId: 5b2512b2-3198-4930-931a-52efc8fb6045
---
Add Client wizard: uploaded client photo + account-owner photo were silently NOT persisted — new tree nodes showed a blank/initials avatar.

**Root cause:** field-name mismatch between the FE wire builder and the Commerce `CreateAccountRequest` DTO. The FE sent `info.profilePictureImageInfo` and `accountOwner.accountOwnerProfilePictureImageInfo`; the backend DTO ([CreateAccountRequest.cs](../../../../Falcon/falcon-core-commerce-svc/src/Falcon.Commerce.Contracts/Models/RequestsDtos/CreateAccountRequest.cs)) declares `Info.ProfilePictureInfo` and `AccountOwner.AccountOwnerProfilePictureInfo` — i.e. the FE name had an extra `Image` token. `System.Text.Json` is case-insensitive but NOT fuzzy, so the unmatched keys were silently dropped → `ProfilePictureInfo` stayed null → `account.ProfilePicture` never set → tree GET returns `Url = null` → no avatar. Same break dropped the owner photo (which the backend forwards to Identity via Kafka).

**Fix (FE, `wire-builders.ts`):** renamed wire fields to match the backend exactly — `profilePictureImageInfo` → `profilePictureInfo`, `accountOwnerProfilePictureImageInfo` → `accountOwnerProfilePictureInfo`. Inner shape `{extension, fileBase64String}` was already correct.

**Why (reusable):** A FE↔backend JSON contract mismatch produces NO error — the field just arrives null. When wiring a new request payload, verify each field name against the backend DTO, not against intuition.

**How to apply:** The backend flow IS otherwise correct end-to-end — create-account persists `AccountInfo.ProfilePicture` (bytes), tree GET (`GET commerce/Node`) returns it as a data-URI in `GetHierarchyNodeResponse.Url`, FE maps `imageUrl = url ?? icon` → org-node avatar. If a node image still fails after this, check that path, not the wire name.
