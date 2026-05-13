*** PRD Understanding - User Management - WORKFLOWS ***

# 02-user-management - Workflows

> Drive Drawings (`Creating/Editing User - Jawad`, `Dina- Edit user status`, `User 1-Change User Status`, `Dina - Add user`) visualize the flows but were not text-extracted. See `attachments.md:28-32`.

## W1: Add User (3 tabs)

- **Trigger:** Admin clicks `Add User` on the Users list of a node in Organization Hierarchy.
- **Source:** `latest-prd.md:44-65`; Drive `Dina - Add user`.
- **Steps:**
  1. **Tab 1 - Personal Information**: First Name, Last Name, Username, Email, Phone, auto-generated Password, optional Profile Pic.
  2. **Tab 2 - Role & Status**: pick Role, Status defaults to Pending.
  3. **Tab 3 - Permissions**: pick Permission Group.
  4. **Save**: if role = Normal User AND account.normalUserLimit reached -> reject with alert (BR-UM-17). Otherwise commit.
  5. **Confirmation Dialog**: choose credential delivery — Email / Phone / Both.
- **Success:** User row persisted; credentials dispatched; status Pending.
- **Failure modes:** Validation (Username uniqueness, format). Normal-User limit reached. Permission denied (per role matrix).

## W2: First Login (Pending -> Active)

- **Trigger:** New user clicks credentials link / opens login page.
- **Source:** `latest-prd.md:67-74`; Identity endpoints `/api/auth/login`, `/api/auth/verify-otp`, `/api/auth/first-login`.
- **Steps:**
  1. Enter Username + Password.
  2. **IP check** (BR-UM-24) — if not on account.allowedIps, generic reject (no enumeration leak).
  3. Credentials check. Wrong -> increment wrong-attempt counter. >=3 -> Locked.
  4. OTP sent (default channel per delivery config). Validity 60s. Resend appears on expiry.
  5. Wrong OTP / resend >=3 -> Locked.
  6. Force-change-password screen — enter new password (complexity per account.passwordSecurityLevel).
  7. Status -> Active.
- **Success:** Authenticated session created; tokens returned.
- **Failure modes:** Locked due to 3 wrong attempts or 3 wrong OTPs. IP rejected.

## W3: Regular Login (Active only)

- **Trigger:** Active user opens login.
- **Source:** `latest-prd.md:76-78`; Identity `/api/auth/login` + `/api/auth/verify-otp` + `/api/auth/refresh-token`.
- **Steps:**
  1. Same path as W2 minus force-change-password.
  2. Non-Active statuses (Locked / Suspended / Deleted / Pending) -> specific alert message per status.
- **Success:** Authenticated session created.
- **Failure modes:** Non-Active -> specific alert. Wrong credentials, wrong OTP -> Locked after 3.

## W4: Forgot Password

- **Trigger:** User clicks `Forgot Password` on login screen (Active users only).
- **Source:** `latest-prd.md:80-85`; Identity `/api/auth/forgot-password`, `/api/auth/forgot-password/set-password`.
- **Steps:**
  1. Enter Username + Phone.
  2. IP check.
  3. If Username+Phone match in DB -> OTP to phone. Otherwise: silent (generic alert).
  4. Enter OTP. Wrong OTP -> silent (per BR-UM-32, **diverges from login** where wrong OTP locks).
  5. Correct OTP -> enter new password (complexity per security level).
  6. Redirect to login.
- **Success:** Password reset; status stays Active.
- **Failure modes:** Username+Phone mismatch -> generic alert. OTP expired -> resend up to limit.

## W5: Change Password (from My Profile)

- **Trigger:** Self -> Change Password.
- **Source:** `latest-prd.md:87-90`; Identity `/api/user/change-password`.
- **Steps:**
  1. Enter Current Password.
  2. Enter New Password (complexity per security level).
  3. Confirm New Password (must match).
  4. Save.
  5. Force logout (all sessions? scope unclear - Q-UM-04). Re-login with new password.
- **Success:** Password updated.
- **Failure modes:** Current password wrong. New ≠ Confirm. Complexity fails.

## W6: Edit User (Admin)

- **Trigger:** Admin opens More Details on a user row -> Edit.
- **Source:** `latest-prd.md:91-105`; Identity `/api/user/{id}/profile`, `/api/user/{id}/role`, `/api/user/status`.
- **Steps:**
  1. Modify Personal (First Name, Last Name, Profile Picture).
  2. Modify Email -> OTP to new email (verify-email/{request,resend,confirm}).
  3. Modify Phone -> OTP to new phone (verify-phone/{request,resend,confirm}).
  4. Modify Role (changing to Normal User re-validates account.normalUserLimit).
  5. Modify Status (per BR-UM-08 allowed transitions).
  6. Modify Permission Group.
  7. **Reject if Email AND Phone modified in the same save** (BR-UM-21).
  8. Save.
- **Success:** User updated. Audit trail in UserStatusHistory if status changed.
- **Failure modes:** Email+Phone simultaneous edit. Normal-User limit reached. Status transition not allowed. Permission denied.

## W7: Edit Own Profile

- **Trigger:** User clicks `My Profile`.
- **Source:** `latest-prd.md:107`; Identity `/api/user/profile` and `/api/user/me/verify-{email,phone}/*`.
- **Steps:**
  1. Same as W6 minus Role, Status, Permission Group (not editable).
- **Success:** Own profile updated.
- **Failure modes:** Same as W6.

## W8: Status Change (Admin)

- **Trigger:** Admin selects user -> change status from a dropdown.
- **Source:** `latest-prd.md:42-43`; Identity `/api/user/status`.
- **Steps:**
  1. Validate transition per BR-UM-08.
  2. If target = Active for Normal User -> validate account.normalUserLimit.
  3. If target = Active and from = Deleted -> Falcon usertype only.
  4. Commit; append UserStatusHistory.
- **Success:** Status flipped.
- **Failure modes:** Disallowed transition. Limit reached. Non-Falcon caller for Deleted->Active.

## W9: Lockout (Automatic)

- **Trigger:** 3 wrong logins OR 3 wrong OTPs / OTP resend exceeded (BR-UM-25, BR-UM-27).
- **Source:** `latest-prd.md:72-73`; Identity Zitadel webhook `/api/webhook/zitadel` consumes UserLocked event.
- **Steps:**
  1. Counter increments per LoginAttempt or OtpChallenge.
  2. Threshold reached -> User.status = Locked.
  3. Zitadel webhook fires; Identity updates local Mongo state.
- **Success:** User locked; cannot login until reset to Pending by admin (BR-UM-08).
- **Failure modes:** Webhook signature failure.

## W10: Idle Timeout

- **Trigger:** No user activity for 30 minutes (BR-UM-29).
- **Source:** `latest-prd.md:118`; not visible in Identity endpoint registry — implementation strategy is the open Q-UM-04.
- **Steps:**
  1. Session.lastActivityAt watched.
  2. (now - lastActivityAt) > 30 min -> session invalidated.
  3. Refresh-token denied.
- **Success:** User forced to re-login.
- **Failure modes:** Implementation-dependent (client-side timer can be bypassed; server-side enforcement is more secure - Q-UM-04).
