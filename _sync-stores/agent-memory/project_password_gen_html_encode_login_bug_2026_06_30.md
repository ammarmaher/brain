---
name: project_password_gen_html_encode_login_bug_2026_06_30
description: "GSD-005 fix — '&' removed from password generator set so emailed credential == Zitadel-stored password; Pending-user edited-email login now works"
metadata: 
  node_type: memory
  type: project
  originSessionId: 18b3f3ea-35f5-48f9-9274-bd0c8dfd9c64
---

GSD-005 CREDENTIAL-EMAIL LOGIN BUG — FIXED (identity-svc, backend-only). Pending user whose email/password is edited by an admin could log in with NEITHER the new nor the old emailed credentials. Root cause: `Infrastructure/Communications/UserCredentialsNotificationHandler.cs` HTML-encodes the password into the email body (`WebUtility.HtmlEncode(notification.Password)`), while `ZitadelPasswordService` sets the RAW password in Zitadel. `Domain/Policies/PasswordPolicy.cs:14` special set `"!@#$%^&*()_+-="` INCLUDED `&`, so any generated password with `&` got emailed as `&amp;` ≠ stored password → InvalidCredentials at the first Zitadel session PATCH (`ZitadelOtpService` password-check) BEFORE the Pending first-login/OTP step, hard-stuck. Email-edit reissue (`UpdateUserProfileHandler`) regenerates+resets a fresh password, killing the old one too.

FIX (minimal, deterministic, covers create + unlock + edit at once — all publish through the same encoder): removed `&` from the generator special set → `Special = "!@#$%^*()_+-=";` (`<`,`>`,`"`,`'` already absent). Now `HtmlEncode` is a guaranteed no-op for every generated password ⇒ emailed password == Zitadel password. Kept HTML-encoding of `firstName`/`username` in the handler (genuine XSS vector — do NOT remove). `PasswordPolicy.Validate` only needs *a* non-alphanumeric so trimmed set still passes. Did NOT touch `changeRequired=false` / Pending-forces-change (correct).

Added regression test `PasswordPolicyTests.Generate_NeverProducesHtmlSignificantChars_SoEmailEncodeIsNoOp` (2000 gens × 2 levels, asserts `HtmlEncode(pwd)==pwd` + no `&<>"'` + still Validate-passes). `dotnet build -warnaserror` GREEN (0/0). Tests: 33/33 relevant pass (PasswordPolicy + UserCredentialsNotificationHandler + Create/Update/ChangeStatus). Full suite 212 pass / 2 fail = PRE-EXISTING `ResendOtpProcessTests` (OTP counter, unrelated). UNCOMMITTED per Falcon standing rule [[feedback_fe_no_commit_no_branch_without_instruction_2026_06_22]]. Live E2E (Pending edited-email login on Docker stack) user-gated, not run.

FOLLOW-UP: existing users already issued a `&`-password stay broken until one admin re-edit/unlock regenerates a clean one (no data fix required). Relates to [[project_pending_contact_credential_resend_pr42881_merge_2026_06_24]] (the ContactUpdated reissue path) and [[project_unlock_locked_to_pending_reissue_credentials_2026_06_23]] (unlock reissue path) — both fixed by this single generator-set change.
