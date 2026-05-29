---
type: business-scenarios-atlas
volume: 5
title: "Falcon Business Scenarios Atlas — Volume 5: Edit User End-to-End + Permission Group Mid-Session"
purpose: "Q-UM-13 resolved overnight (deferred verification). Edit User is now buildable. This volume specifies it end-to-end with all edge cases, plus the permission-group-mid-session token-refresh problem business teams ask about."
volume-5-scenarios: 3
---

# Falcon Business Scenarios Atlas — Volume 5

> Wave 5b resolved Q-UM-13 (admin email/phone edit = deferred verification, no admin OTP needed). The Edit User wizard is now buildable. This volume specifies every edit path with edge cases.

---

## SCENARIO 22 — Admin Edits Another User's Profile (Edit User wizard, end-to-end)

**Business question:** "An Account Owner needs to update a user's email + name + role. Walk me through every field and what the user experiences."

### Wave 5b's resolution recap (the key unlock)

Per `understanding/backend/identity/controllers/UserController/VALIDATIONS.md`:

**Admin-driven email/phone change = DEFERRED VERIFICATION**
- Admin's change applies **immediately** in Zitadel + Mongo
- BUT `IsEmailVerified=false` / `IsPhoneVerified=false` flags are set
- The affected user must drive the OTP themselves via `POST /api/user/me/verify-email` (or phone) at their next session
- **No admin-initiated OTP exists** (and is not needed)

This means the Edit User wizard does NOT need:
- An OTP step embedded in the admin flow
- A "wait for target user to confirm" suspense state
- Any cross-user synchronous handshake

### The Edit User wizard, field by field

Backend: `PUT identity/api/user/{id}/profile` + `PUT identity/api/user/{id}/role` + `PUT identity/api/user/status` (three separate endpoints).

**Tab 1 — Personal Info** (editable: firstName, lastName, email, phoneNumber, profilePicture)

| Field | Rule | Edit behavior |
|---|---|---|
| firstName | ≤50, letters only — [PRD] BR-UM-11 | Immediate save, no verification |
| lastName | ≤50, letters only — [PRD] BR-UM-11 | Immediate save |
| **email** | Valid format | **Saved immediately to Zitadel + Mongo. `IsEmailVerified=false`. User must verify themselves.** |
| **phone** | Valid format (min 7 digits) | **Same: saved immediately. `IsPhoneVerified=false`.** |
| profilePicture | Optional (≤size limit, [PRD] BR-UM-16 + BR-UM-48) | Immediate save |
| username | Immutable — [PRD] BR-UM-19 | Field shown disabled, ignored in API |

**Critical constraint: BR-UM-21** — Reject save when BOTH email AND phone are modified in the same request. Wave 5b flagged this as currently NOT enforced server-side. The Edit User wizard should enforce this client-side AND the backend should add the validator.

**Tab 2 — Role & Status**

| Field | Editable when? | Notes |
|---|---|---|
| role | Always (per role-edit-reach matrix) — [CODE] `BuiltInRoleCatalog.cs:18-75` | Changing to NormalUser triggers `maxNormalUserLimit` re-check (BR-UM-09/17/38) |
| status | Per allowed transitions — [PRD] BR-UM-08 | Active → Suspended ✅. Active → Locked ❌ (system-only). Deleted → Active = Falcon-only (BR-UM-39) |
| permissionGroupId | Independent of role | Updating role does not auto-update Permission Group; explicit choice needed |

**Tab 3 — Permissions**

| Field | Editable when? |
|---|---|
| permissionGroup | Always (with `editPermissionGroup` rights) |
| (Custom permission overrides) | Currently not in PRD — Permission Group is the unit of assignment |

### What the target user experiences

**Case A — Admin updates First Name + Last Name only:**
- No verification needed
- Next session: name reflects the change everywhere
- ✅ Seamless

**Case B — Admin updates Email:**
- Next time user logs in, they see a banner: "Your email was changed by an administrator. Please verify it."
- User clicks "Verify" → OTP sent to NEW email
- User enters OTP → `POST /api/user/me/verify-email/confirm`
- `IsEmailVerified=true`
- Verification banner clears

**Case C — Admin updates Phone:**
- Same as Case B but for phone via `POST /api/user/me/verify-phone/confirm`
- OTP sent to NEW phone

**Case D — Admin changes Role:**
- Effective on next token refresh (≤30 min by default)
- If user is mid-session, their JWT still carries old role until refresh
- **Risk:** brief window where user can act with stale privileges. Mitigation: force-logout-on-role-change (currently NOT implemented; recommend adding)

**Case E — Admin changes Status to Suspended:**
- User's existing JWT is still valid until expiry (≤30 min)
- BUT every PES check should re-validate User.status — if Suspended, deny
- Without per-action User.status check, user could operate for up to 30 min after suspension
- **Mitigation:** add User.status check in PES path (defense-in-depth)

### Edge cases

| Case | Behavior | Recommendation |
|---|---|---|
| Email + Phone changed in same request | **Should reject** per BR-UM-21 (Wave 5b found backend doesn't enforce yet) | Add server-side validator |
| Admin changes target's email, target user is currently logged in | Old email stays in their session display; verification banner appears on next page load | Confirmed acceptable UX |
| Target user is in Pending status | Edit allowed (per [PRD] BR-UM-08 transition matrix) but target hasn't completed first login | Edit applied; First Login still required |
| Target user is Suspended | Edit allowed by admin; target can't see the change until re-activated | Acceptable; document |
| Admin edits self via Edit User wizard | Should reject — self-edit must go through My Profile (different endpoint per BR-UM-41) | Validate `id != currentUser.id` at controller |

### Business implications

| Question | Answer |
|---|---|
| "Can an admin force-verify a user's email without involving them?" | **NO** — by design. The verification step must come from the target user (proves they own the new contact). This protects against admin-impersonation attacks. |
| "If we change an Account Owner's email, do they immediately lose access?" | **No** — login still works on the EXISTING email until they verify the new one. The user transitions gradually. |
| "What if a user is fired and we change their email to nobody@?" | They'd have an unverified email. Their account would still work (login uses username), but recovery flows would fail. **Recommend: deactivate-then-edit pattern (suspend the user first, then edit).** |
| "Can a Node Admin edit an Account Owner?" | **No** — role-edit-reach matrix prevents NA from editing AO (an "upward" edit). NA can only edit Normal Users in their sub-tree. |
| "What's the email verification UX for the target user?" | Banner on next session: "Your email was changed. [Verify]." Click → OTP sent → enter OTP → done. ≤60s expected. |

---

## SCENARIO 23 — Permission Group Changed Mid-Session

**Business question:** "An admin demotes a user's Permission Group while they're actively logged in. What can they still do, and for how long?"

### The architecture

- User's JWT carries: `usertype + tenantId + path + sub (Zitadel ID)`
- Permission Group ID is **read from Mongo** during PES `POST /pes/authorize` requests
- The PES makes a fresh DB lookup OR consults a cache (per PES service design)
- Falcon Access service: `POST /pes/authorize` evaluates per-request

### The fresh-vs-cached question

| Behavior | Effect on mid-session change |
|---|---|
| PES does fresh DB read on every request | Permission change is effective within ms. **Strongest enforcement.** |
| PES caches with TTL (e.g., 60s) | Up to 60s lag — old permissions still apply. |
| PES caches without TTL (cache-until-invalidated) | Lag depends on invalidation: could be permanent until restart. **Risk if no invalidation event fires.** |

[INFERRED] from `Brain Outputs/understanding/backend/access/` dossier: Falcon PES has a tenant-scoped policy template. The `g`-rules for users are likely fresh-read per request, but verify in code.

### What the user experiences

**Before the change:**
- User opens admin-console / management-console
- FE calls `POST /pes/authorize/resources` on page load
- Gets back: `{ "feature.X": true, "feature.Y": true }`
- UI renders X and Y buttons

**At the moment of change:**
- Admin updates `User.permissionGroupId = newGroupId` in Mongo
- This is an atomic update; no event published downstream (or is there? Verify)

**After the change (user's perspective):**
- User's existing page still shows X and Y buttons (FE cached the resources response)
- User clicks Y button → FE calls `POST /api/feature-y/action` with their JWT
- BE service calls `POST /pes/authorize` to check
- PES does fresh DB read → sees newGroupId → newGroup doesn't have permission Y → denies
- User gets a 403 error
- User refreshes the page
- FE re-fetches `POST /pes/authorize/resources`
- Now Y button is hidden

### The window of confusion

Between the permission change and the user's next page refresh:
- Buttons are visible but actions return 403
- This is **acceptable but confusing UX**
- User has no idea their permissions changed unless an admin tells them

### Mitigations

| Option | Tradeoff |
|---|---|
| Force-logout on permission group change | Drastic but cleanest — user definitely sees the change. Annoying for users in middle of work. |
| Push notification on permission change | Subtle banner: "Your permissions were updated. Refresh to see changes." Requires real-time channel (WebSocket / SSE). Heavy infra. |
| Invalidate FE cache on every action | Re-fetch `authorize/resources` after every backend call. Wasteful. |
| **Current state (recommended)** | Accept the small UX window. Train support team to say "refresh your page" on confusing permission errors. |

### Business implications

| Question | Answer |
|---|---|
| "If we demote a user, when is it effective?" | **Backend: immediately.** Frontend: until next page refresh (up to a minute or two of confusing UI). Permanent enforcement is achieved at backend. |
| "Can a user act on stale permissions for hours?" | **No** — every action backend-check is against current Permission Group. The window is the FE cache lifetime (page-scoped). |
| "What if we promote a user — do they see new features immediately?" | Same window in reverse — they need to refresh to see new buttons. Backend would accept their actions even on the stale cached UI (because backend authorizes against current state). |
| "Should we add force-logout on Permission Group change?" | Tradeoff. For high-privilege changes (e.g., demoting an admin), yes. For minor changes (adding a feature), no. **Recommend: add a `forceLogout` flag in the update endpoint, used at admin's discretion.** |

---

## SCENARIO 24 — User Tries to Edit Their Own Email via My Profile

**Business question:** "An ordinary user wants to update their own email. Walk through the flow vs the admin-edit-other-user flow."

### My Profile flow — [PRD] BR-UM-41

User opens My Profile (host-shell or management-console).
Submits new email via the My Profile form.

**Different from admin-driven edit:** the user is changing their OWN email, so they don't need someone else to validate. But they still need to PROVE they control the new email.

### The endpoints

| Step | Endpoint | What happens |
|---|---|---|
| 1 | `PUT /api/user/profile` with new email | Stores the new email as **pending** (alongside old) OR sends OTP to new email immediately — verify in code |
| 2 | `POST /api/user/me/verify-email` (no body — just trigger send) | OTP sent to new email |
| 3 | `POST /api/user/me/verify-email/confirm` with OTP code | If valid, email field updated, `IsEmailVerified=true`, old email replaced |

### Key difference from admin-driven flow

| Step | My Profile (self) | Admin Edit (other user) |
|---|---|---|
| Save new email | Either pending OR replace + unverify | Replace immediately + `IsEmailVerified=false` |
| OTP trigger | User triggers explicitly | Target user triggers themselves on next session |
| Verification | User completes in same session | Target completes whenever they next log in |

### Edge cases

| Case | My Profile | Admin Edit |
|---|---|---|
| User cancels mid-flow (closes browser) | Profile may be in inconsistent state (new email pending but unverified) | Admin doesn't see the inconsistent state — they just know they submitted a change |
| User enters wrong OTP | Re-prompt — try again | n/a |
| OTP expires (60s) | Resend (BR-UM-26) | n/a |
| User changes mind, wants old email back | They'd need to submit another change to revert. **Username is immutable but email is mutable.** | n/a |

### Business implications

| Question | Answer |
|---|---|
| "Why two different flows?" | Self-edit = user proves they own the new email immediately in their own session. Admin-edit = admin can't prove they own the user's new email, so the target must prove it. Different trust model. |
| "What if a user changes their email and forgets the verification step?" | Their account works on the OLD email + username until they verify. They have a persistent banner reminding them. No data loss. |
| "Can a user change their email to one already used by another Falcon user?" | Likely yes — email is not unique in Falcon (username is). Email is for OTP delivery, not for identity. Verify in code (BR-UM-* doesn't explicitly forbid duplicate emails). |
| "Can we force a user to re-verify their email periodically?" | Not in current PRD. Could be added (e.g., every 90 days re-verify email). |

---

## Continuous mining queue update

Volumes 1-5 = 24 scenarios + 4 compliance deep-dives. Remaining queue:
- **Vol 6:** Scaling scenarios (1M users / 10M messages/day)
- **Vol 7:** Negotiation & contract amendment patterns
- **Vol 8:** Data export & client off-boarding
- **Vol 9:** Refund flows (Q-CC-49 OPEN)
- **Vol 10:** Sales handoff playbook

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 5 (Edit User) written 2026-05-18 · Q-UM-13 buildable now, deferred verification flow specified.*
