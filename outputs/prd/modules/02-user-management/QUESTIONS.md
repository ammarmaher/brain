*** PRD Understanding - User Management - QUESTIONS ***

# 02-user-management - Open Questions

> Carried forward from `understanding.md:153-159` (existing questions) plus new ones from cross-reference.

## Inherited from existing understanding.md

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-UM-01 | On Forgot Password, should wrong OTP count toward lockout like in login? (BR-UM-32 vs BR-UM-27 inconsistency) | Today the PRD says wrong-OTP in forgot is silent (user stays Active); login says 3 wrong OTPs = Locked. Bug or intended? | latest-prd.md:84; ask Jawad. |
| Q-UM-02 | After Deleted -> Active, is the password reset or preserved? (BR-UM-46) | Account-restore UX: send fresh credentials or keep old hash. | latest-prd.md:126; ask Dina. |
| Q-UM-03 | Does changing password invalidate existing sessions on other devices? (BR-UM-50) | Affects refresh-token revocation strategy in Identity. Today's code revokes all sessions on `/api/user/change-password` per ENDPOINT_REGISTRY note. | latest-prd.md:127; Identity `ChangePasswordEndpoint.HandleAsync` notes. |
| Q-UM-04 | How is 30-min idle logout implemented — JWT expiry, server-side session tracker, or client-side timer? (BR-UM-47) | Determines whether disabled clients (offline) become exempt. | latest-prd.md:118; cross-check Identity session strategy. |
| Q-UM-05 | Profile picture file type / size constraints? (BR-UM-48) | Frontend validation + backend storage limits. | latest-prd.md (silent); ask Dina. |
| Q-UM-06 | Should "Contact administrator" / "contact your manager" alerts include manager contact info pulled from the hierarchy? (BR-UM-49) | UX polish + hierarchy integration. | latest-prd.md (silent); ask UX. |

## New questions surfaced during cross-reference

| # | Question | Why it matters | Where to look |
|---|---|---|---|
| Q-UM-07 | The Permission sheet has Tab 2 referenced but the CSV export captured Tab 1 only (`Permission list - Jawad`). What does Tab 2 contain? | The matrix may be incomplete. Per `attachments.md:16`, the PRD body mentions "sheet 1" and "sheet 2"; sheet 2 was not captured. | `02-user-management/attachments.md:13-17`; ask Jawad to re-export. |
| Q-UM-08 | Are Account Owner / Node Admin allowed to add Falcon-side users (sys-admin, operation, product)? | Permission matrix is silent on Client -> Falcon role granting; presumably blocked, but should be explicit. | `Permission list - Jawad`; cross-check with `attachments.md`. |
| Q-UM-09 | What is the exact password complexity per security level (Normal vs Advanced)? | Sheet `Account Setting & Others` is referenced (`01-account-management/attachments.md:33`) but not fully extracted. Today Identity `GeneratePasswordRequest` uses `ePasswordSecurityLevel` with values Low/Medium/High/Strict — **vocabulary mismatch with PRD's Normal/Advanced**. | Sheet `Account Setting & Others`; Identity `GeneratePasswordEndpoint`. |
| Q-UM-10 | When a User is moved between nodes (cross-hierarchy reassignment), is it the same User record or a re-creation? | Multi-tenant + Path implications. | PRD silent; ask Jawad. |
| Q-UM-11 | Bulk operations (bulk-disable, bulk-permission-change) — supported? | Today no `POST /users/bulk-*` endpoint visible in Identity. | latest-prd.md (silent); Identity `ENDPOINT_REGISTRY.md`. |
| Q-UM-12 | Why does Identity use `ePasswordSecurityLevel` = Low / Medium / High / Strict (4 levels) when the PRD only specifies Normal / Advanced (2 levels)? | Either Identity is over-generalized or the PRD is under-specified. | Identity DTO source. |
| Q-UM-13 | Identity exposes `/api/user/me/verify-email` + `/verify-phone` flows (with sub-routes `request`, `resend`, `confirm`). The PRD specifies admin Edit User does email/phone OTP per (BR-UM-21). What's the flow for admin-driven email change vs self-driven email change? | The endpoints look self-driven (`/me/`); admin edits another user's email via `PUT /api/user/{id}/profile` — but where's the OTP confirmation in that path? | Identity `ENDPOINT_REGISTRY.md` lines 41-46; PRD ambiguous. |
| Q-UM-14 | Is RoleKey (string) preferred over the integer `eUserRoles` for frontend payloads? Identity has both. | Migration discipline. | Identity DTO_DICTIONARY notes. |
| Q-UM-15 | The Permission list rows (`Allow / Not Allow / Deny / Can be overridden by Deny`) — how does the PES engine encode these? | Determines whether PES has 3-state or 4-state semantics. | `falcon-core-access-svc` (PES); `Permission list - Jawad` sheet. |

## Cross-cutting backlog items (from root-documents/latest-prd.md) that touch User Management

| # | Topic | Action |
|---|---|---|
| Q-UM-16 | "Falcon usertype can edit user phone number and status without validations." (root-documents/latest-prd.md:26) | Open: today the PRD says OTP is required for phone edits even for admin (BR-UM-36); the backlog item suggests Falcon admins should be able to skip validation. Needs Product confirmation. |

## Banned synonyms / glossary discipline

- The PRD uses **Username** consistently (one word). Code matches (`Username` field). Good.
- The PRD uses **Account Owner**; flag any UI/business copy that uses "owner" or "admin" alone (ambiguous with Node Admin).
- The PRD uses **Suspended** for admin-disabled. Code matches.
- The PRD uses **Locked** for auto-lockout. Code matches.
- The PRD uses **Deleted** as a status; flag any UI copy that uses "Removed" or "Archived".
- **Falcon usertype** vs **Client usertype** — both PRD-canonical. Avoid "internal/external user", "operator", etc.
