---
name: Test user password standard
description: Standing rule — every test user created in any Falcon env must use Admin@1234
type: feedback
originSessionId: 81361cfc-7c04-485a-a440-35fd8e3eb2cd
---
# Test user password = `Admin@1234` (always)

The user has set this as the canonical password for ALL test/seed users in every Falcon environment.

**Why:** consistency across sessions, easy to type and remember, satisfies Zitadel default policy (10 chars, upper + lower + digit + symbol).

**How to apply:**
- Any new test user → password `Admin@1234`
- Any password-change script → default to `Admin@1234`
- Any docs/handover → list `Admin@1234` as the password
- The re-runnable script `Falcon/Falcon/falcon-essentials/zitadel/seed-test-users.sh` already defaults to `Admin@1234` (env override: `FALCON_TEST_PASSWORD`)

Replaces the old `Pass123!` default from the original 2026-05-16 user-creation pass.
