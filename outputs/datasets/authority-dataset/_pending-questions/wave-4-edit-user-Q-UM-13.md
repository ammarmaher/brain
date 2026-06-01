---
type: pending-question
id: Q-UM-13
severity: HIGH
status: OPEN
raised-by: Wave 4 page-mining · edit-user
raised-on: 2026-05-18
blocks: edit-user implementation
module: user-mgmt
feature: edit-user
verification: unverified
last-verified: 2026-05-18
tags: ["#status/open", "#module/user-mgmt", "#verification/unverified", "#layer/be"]
up: "[[Q-tickets-MOC]]"
parent: "[[Q-tickets-MOC]]"
tracked-as-task: true
priority: p1
due: 
blocked-on: [prd-clarification]
---

# Q-UM-13 — Admin OTP path for editing another user's email/phone

## Question

When a Falcon admin (or any admin actor) edits another user's email or phone in the Edit User flow, which OTP path applies?

Three possibilities:
1. **OTP to target user's new contact** — admin clicks Save, OTP goes to the target user's new email/phone, target user enters code somewhere?
2. **OTP to admin's own contact** — admin's email/phone receives the OTP (admin attestation flow).
3. **Falcon admins bypass OTP entirely** — admin-override, no verification needed.

## Source of ambiguity

- [PRD] `Brain Outputs/prd/modules/02-user-management/BUSINESS_RULES.md:74` (BR-UM-36):

  > Editable personal fields (admin): First Name, Last Name, Profile Picture, Email (with OTP to new email), Phone (with OTP to new phone).

- [CODE] `apps/host-shell/src/app/features/user-profile/services/profile-otp.service.ts:23-60` — only `/api/user/me/verify-{email|phone}` endpoints exist (operates on CURRENT logged-in user).

- [BRAIN-OUT] `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:41-46` — no `POST /api/user/{id}/verify-{email|phone}` endpoint exists today.

## Why this blocks

Without a definitive answer:
- New endpoints may need to be added to Identity (path 1 or 2).
- OR FE must implement an admin-bypass for Falcon admins only (path 3).
- OR FE must restrict email/phone editing to self-edit (My Profile) only, removing it from Edit User entirely (path 4: scope reduction).

Each path has different implications for UX, security, and backend surface.

## Recommendation (pending product review)

Path 1 (OTP to target user's new contact) is **least secure** for admin-edit (admin can't proceed; target user must be online). Path 3 (admin bypass) is **simplest** and aligns with industry pattern (admins are trusted). Path 2 (OTP to admin) is a **defense-in-depth attestation** — admins prove they intended the change.

[INFERRED] Recommend Path 3 (admin bypass) for Falcon admins (System Admin · Product), Path 1 for Client admins (AO · Node Admin) editing users in their own account.

## Resolution plan

1. Schedule product clarification call.
2. Update BR-UM-36 with explicit path.
3. If Path 1 or 2: add new Identity endpoints + FE wiring.
4. If Path 3: define which roles bypass + add `admin-override` audit log event.

## Status

- 2026-05-18 — raised by Wave 4 page-mining. Implementation paused on email/phone change in Edit User.

## See also

- [pages/edit-user/13-GAPS_AND_DRIFTS.md](../../../understanding/pages/edit-user/13-GAPS_AND_DRIFTS.md) GAP-UM-21
- [pages/edit-user/05-SECTION_OTP_VERIFICATION.md](../../../understanding/pages/edit-user/05-SECTION_OTP_VERIFICATION.md)
- [pages/edit-user/14-IMPLEMENTATION_CHECKLIST.md](../../../understanding/pages/edit-user/14-IMPLEMENTATION_CHECKLIST.md) (Pre-flight HALT)

## Tasks-plugin tracking

- [ ] [[Q-UM-13]] Q-UM-13 — Admin OTP path for editing another user's email/phone 🔼 #blocked-on/prd-clarification
