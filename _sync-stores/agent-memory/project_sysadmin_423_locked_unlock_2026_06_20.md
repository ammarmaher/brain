---
name: project_sysadmin_423_locked_unlock_2026_06_20
description: "Test-user login returns 423 \"account locked\" — root cause is Falcon Identity Mongo status=4, fix is reset to status=2; Zitadel is usually already active."
metadata: 
  node_type: memory
  type: project
  originSessionId: 691b088d-9a8c-4bba-acc7-d6b9e88e458c
---

# Test-user login 423 "Your account has been locked" — two-layer lock + fix

A seeded test user (observed on `sysadmin`, 2026-06-20) hits **HTTP 423 Locked**
("Your account has been locked. Please contact support.") on
`POST http://localhost:7777/api/auth/login`, and it persists across every retry.

## Root cause (two-layer lock, but only one layer stays stuck)

1. The user (or QA) typed the **wrong password** repeatedly. The seeded password for
   ALL test users is `Admin@1234` (`[CODE]` `seed-test-users.sh:31`). In the live case the
   UI had `Admin@1430`.
2. Repeated wrong attempts trip **Zitadel's** password lockout. On the failing attempt
   `passwordResult.IsLocked` is true, so `[CODE]`
   `falcon-core-identity-svc/.../Application/Auth/UseCases/LoginProcess.cs:51-56`
   mirrors the lock into the Identity DB: `FalconIdentityDb.Users.status = 4 (Locked)`
   (`eUserStatus.Locked = 4`, `[CODE]` `Domain/Constants/Enums.cs:60`).
3. From then on `[CODE]` `LoginProcess.cs:35` calls
   `LoginEligibilityPolicy.Validate(user.Status)` which throws `UserLocked` → **423**
   `[CODE]` `Domain/Policies/LoginEligibilityPolicy.cs:18` — **BEFORE** the password is
   ever sent to Zitadel. So Zitadel never sees more attempts and its own state goes back to
   `USER_STATE_ACTIVE`. The stuck lock lives **only in Falcon's Mongo `status` field**.

## Fix (verified live 2026-06-20)

Reset the Identity DB status to Active; Zitadel usually needs nothing.

```bash
docker exec -i falcon-mongo-1 mongosh --quiet \
  "mongodb://root:example@localhost:27017/admin?replicaSet=rs0&authSource=admin" \
  --eval 'db.getSiblingDB("FalconIdentityDb").Users.updateOne({username:"sysadmin"},{$set:{status:NumberInt(2)}})'
```

Only if Zitadel state is genuinely `USER_STATE_LOCKED` (check
`GET http://localhost:8080/management/v1/users/{zitadelUserId}` with the PAT at
`Falcon/falcon-essentials/zitadel/admin.pat`) also call
`POST http://localhost:8080/management/v1/users/{zitadelUserId}/_unlock`.
In the 2026-06-20 case Zitadel returned `"User is not locked"` — Mongo-only fix sufficed.

Verification: after reset, `sysadmin`/`Admin@1234` → HTTP **200** + JWT (stage Authenticated);
wrong password → 401 (not 423) and a single wrong attempt does NOT instantly re-lock.

**Why:** the eligibility gate short-circuits ahead of the IdP, so the DB mirror is the
gate that matters for login. Fixing only Zitadel (or only Mongo) is insufficient when both
are locked, but in practice Mongo is the one left stuck.

**How to apply:** when ANY seeded user shows 423 on login — reset its
`FalconIdentityDb.Users.status` to `2`, confirm the seeded password `Admin@1234` is being
used (re-locks happen when the wrong password is retried), and only touch Zitadel if its
state is actually LOCKED. Seeded test users + creds: [[MEMORY]] `07-cross-cutting/test-users.md`.
Related role/status work: [[project_edituser_status_matrix_centralized_rules_2026_06_08]].
