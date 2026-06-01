---
name: PES g-link must use Zitadel id (= JWT.sub), NOT Mongo _id
description: Standing rule — every PES policy-subject for type=g links the user via u:<ZitadelId>@<namespace>, matching what the FE builds at runtime
type: feedback
date: 2026-05-16
originSessionId: 81361cfc-7c04-485a-a440-35fd8e3eb2cd
---
# Rule

PES `g`-rule object MUST be `u:<ZitadelUserId>@<namespace>`.

- **Namespace**: `system` for Falcon users, `<tenantId>` for Client users.
- **Zitadel user-id**: the long numeric id returned by Zitadel mgmt API (e.g. `373185572597923850`). NOT the MongoDB `_id`.

## Why

- Frontend builds `sub.kind = u:<session.subjectId>@<namespace>` where `session.subjectId = JWT.sub`.
- JWT `sub` is the Zitadel user-id.
- PES `DecisionPoint` matches the request against `g`-rules where `obj == sub.kind` — so the `g`-rule object must equal `u:<JWT.sub>@<namespace>`.
- Backend authoritative path (`Identity.CreateUserProcess → AccessRoleLinkClient.SyncPrimaryRoleAsync`) already does this: it passes `user.IdentityUserId` (= Zitadel id) as the `identityUserId` parameter that becomes the policy subject.

## What broke 2026-05-16

`seed-test-users.sh` originally passed `mongo_id` to `ensure_pes_link`, producing g-rules like:
```
sub=r:sys-admin@system  obj=u:6a085915164fb80e0b9df8a3@system   ← Mongo _id  WRONG
```
But the FE was sending:
```
sub.kind = u:373185572597923850@system    ← JWT.sub (Zitadel id)
```
No match → every PES check denied for the 6 seeded test users. Original `system-user` worked because its `g`-link used the Zitadel id (its mongo doc had `_id` equal to the Zitadel id by coincidence).

Fixed by:
1. Live PES: deleted 6 stale g-rules (mongo-id form) and inserted 6 correct ones (Zitadel-id form).
2. `Falcon/Falcon/falcon-essentials/zitadel/seed-test-users.sh`: `ensure_pes_link` now takes `zitadel_id` (not `mongo_id`) and is called with `"$zuid"` instead of `"$mongo_id"`.

## Verification (final state)

| user | JWT.sub | built kind | app.admin-console | app.management-console |
|---|---|---|---|---|
| sysadmin | 373185572597923850 | u:373185572597923850@system | allow | deny |
| sysops | 373185573654888458 | u:373185573654888458@system | allow | deny |
| sysprod | 373185574745407498 | u:373185574745407498@system | allow | deny |
| accowner | 373185575819149322 | u:373185575819149322@test-tenant-001 | deny | allow |
| accadmin | 373185576859336714 | u:373185576859336714@test-tenant-001 | deny | allow |
| accuser | 373185577933078538 | u:373185577933078538@test-tenant-001 | deny | allow |

Full 6-user × 47-resource/action matrix verified. CSV: `Falcon/Falcon/falcon-essentials/zitadel/pes-verification-2026-05-16.csv`.

## When seeding any new user manually

Always grab the Zitadel id (search via `POST /management/v1/users/_search`), NOT the mongo `_id`, when inserting the `g`-rule. The Mongo `_id` is the wrong value.
