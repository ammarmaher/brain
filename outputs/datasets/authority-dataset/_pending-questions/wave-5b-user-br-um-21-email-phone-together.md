---
name: Wave 5b Pending Question — BR-UM-21 Email AND Phone modified together
description: PRD says reject save when both Email AND Phone change in same request. Current handler does not enforce.
type: pending-question
agent: ammar-auth
wave: 5b
controller: UserController
date: 2026-05-18
status: OPEN
prd_ref: BR-UM-21
module: user-mgmt
feature: edit-user
verification: unverified
last-verified: 2026-05-18
tags: ["#status/open", "#module/user-mgmt", "#verification/unverified", "#layer/be"]
up: "[[Q-tickets-MOC]]"
parent: "[[Q-tickets-MOC]]"
tracked-as-task: true
priority: medium
due: 
blocked-on: [prd-clarification]
---

## Question

PRD-02 (`BR-UM-21`) reads: "Reject save when Email AND Phone modified in the same request."

Should `PUT /api/user/profile` and `PUT /api/user/{id}/profile` **throw** when both `email` and
`phoneNumber` are present and changed from their stored values? Today they **accept the request,
update both fields, and return both `Requires*Verification` flags**.

## Code evidence

[CODE] `Application/Users/UseCases/UpdateUserProfileHandler.cs:34-72`

```csharp
var phoneChanged = command.PhoneNumber is not null
                   && !string.Equals(command.PhoneNumber, user.PhoneNumber, StringComparison.Ordinal);
var emailChanged = command.Email is not null
                   && !string.Equals(command.Email, user.Email, StringComparison.OrdinalIgnoreCase);

// ... profile update applied to both fields ...

var requiresPhoneVerification = phoneChanged && user.Status == eUserStatus.Active;
var requiresEmailVerification = emailChanged && user.Status == eUserStatus.Active;
return new UpdateUserProfileResult(true, requiresPhoneVerification, requiresEmailVerification);
```

There is no `if (phoneChanged && emailChanged) throw ...` guard.

## Two interpretations

**Strict (reject)**: PRD literal — throw a domain error so the user picks one channel at a time.
Rationale: simpler verification UX, fewer race conditions if user abandons one OTP mid-flow.
Implementation: add a new error code (e.g. `CannotEditPhoneAndEmailTogether`) and throw at handler
boundary before any Zitadel call.

**Permissive (accept + double-flag)**: current behaviour. PRD wording was a UX recommendation, not
an absolute rule. Rationale: BE returns both flags; FE drives sequential OTP flows. Today this is
what the code does.

## Recommendation

Confirm with PM. If strict: add an error code + throw. If permissive: update the PRD comment to
clarify the rule is FE-side ("the wizard should not present both fields editable simultaneously")
and document the current double-flag UX in `UserController/FRONTEND_CONTRACT.md` more loudly.

## Test cases needed

If strict:
- `UpdateUserProfileHandler_emailAndPhoneTogether_throws` — Active user, changes both → `CannotEditPhoneAndEmailTogether`.
- `UpdateUserProfileHandler_emailOnly_succeeds`.
- `UpdateUserProfileHandler_phoneOnly_succeeds`.
- `UpdateUserProfileHandler_neither_succeeds` (no-op).

## Files referenced

- C:\Falcon\Brain Outputs\understanding\backend\identity\controllers\UserController\VALIDATIONS.md (BR-UM-21 section)
- C:\falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Users\UseCases\UpdateUserProfileHandler.cs

## Tasks-plugin tracking

- [ ] [[wave-5b-user-br-um-21-email-phone-together]] Wave 5b Pending Question — BR-UM-21 Email AND Phone modified together 🔼 #blocked-on/prd-clarification
