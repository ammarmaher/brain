---
name: User Profile React layout port
description: Ported the React "User Profile" two-column UI/UX into the @falcon/user-details shared lib — design-only, validation/PES untouched.
type: project
originSessionId: 24b820e4-1494-4fea-a778-74170dc90f53
---
🟢 BUILD-GREEN 2026-05-18. Ported the React "User Profile" design (`Source_of_truth_theme/React/Profile info one/admin/userdetails.jsx`) into the shared `@falcon` user-details feature lib at `libs/falcon/src/shared-features/user-details/`.

**Scope was strictly UI/UX** — user corrected an initial over-scoped plan twice. Validation (`validations/validations.ts`), PES resolution, OTP, dirty-tracking, save-pipeline structure were left untouched. Only additive plumbing for the avatar.

What landed:
- Two-column layout: LEFT identity card (avatar + edit/delete pins + status/role pills + Email/Phone/National ID/Joined) + Permissions Summary card; RIGHT tabs card with two-tile VIEW Role pane. Personal tab hidden in VIEW mode.
- `models/user-details.models.ts` — additive `image` + `joinedAt` fields (backend `UserResponse` already returns `image` + `createdAt`).
- `signals/signals.ts` — additive `pictureDraft` signal + `setPicture`/`deletePhoto`; avatar wired into existing save payload via `profilePictureInfo`/`deleteImage`.
- Avatar built inline in the identity card (96px circle, initials fallback, pins gated to edit mode + `permFlags().canEditPicture`). Hidden native file input + `dataUrlToPicture` helper.

**Why:** D1 decision — Department + Gender rows omitted (no backend field, no fake data). D2 — avatar pins gated to edit mode. D3 — status dropdown kept read-only.

**How to apply:** builds green on host-shell + admin-console + management-console (2026-05-18). Not runtime-verified in browser yet — that is a separate user-initiated phase.
