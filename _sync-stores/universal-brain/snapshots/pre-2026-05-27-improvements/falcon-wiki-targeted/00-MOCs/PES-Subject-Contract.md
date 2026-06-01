---
type: reference
role: standing-rule
audience: backend-engineers + ai-agents + seed-script-authors
scope: falcon-core-access-svc + falcon-core-identity-svc + seed scripts
severity: P0
updated: 2026-05-16
tags: [layer/backend, scope/auth, status/active]
---

> [!tldr]
> PES `g`-rule `obj` **MUST be the Zitadel user-id**, never the MongoDB `_id`. The frontend builds its PES subject from `JWT.sub` (= Zitadel id); a `g`-rule keyed by Mongo id will silently return **deny for every page**. Identity's normal user-creation flow gets this right; only **seed scripts** have ever made this mistake.

# PES Subject Contract

## The rule

For any PES policy rule of `type: g` (user → role binding):

```
sub  =  r:<role-key>@<namespace>       ← role subject
obj  =  u:<ZitadelUserId>@<namespace>  ← user subject — MUST be Zitadel id
```

Where:
- `<role-key>` ∈ `{sys-admin, sys-ops, sys-products, acc-owner, acc-admin, acc-user}` (and any future role registered in `BuiltInRoleCatalog.cs`)
- `<namespace>` = `system` for Falcon users, `<tenantId>` for Client users (any string that isn't literal `"system"`)
- `<ZitadelUserId>` = the long numeric id Zitadel assigns at user creation (e.g. `373185572597923850`), surfaced on the User document as `IdentityUserId`

**Never** use `<MongoObjectId>` (24-char hex like `6a085934e1191397bb7c4856`) here.

## Why this rule exists (the bug we caught)

Source: `[CODE]` `falcon-web-platform-ui/libs/falcon/src/core/lib/access-control/current-subject.builder.ts:27` →

```ts
// Pseudocode
const login = session.login ?? session.subjectId;  // session.login is hardcoded null
const ns    = session.userType === 'Falcon' ? 'system' : session.tenantId;
return `u:${login}@${ns}`;                          // PES subject the FE will query
```

And `[CODE]` `libs/falcon/src/core/lib/services/session-provider.service.ts:136` hardcodes `login: null` (by design — comment at line 135 calls it out). Therefore `subjectId` is always used, and `subjectId` = `JWT.sub` = Zitadel user-id.

PES `DecisionPoint.LoadPolicyRules` then resolves a user's permissions by matching the incoming subject against existing `g`-rules. If the `g`-rule was written with a different id (e.g. Mongo `_id`), the match fails silently and the user has **zero permissions** — every page check returns deny, every navigation looks "logged in but locked out".

## Where this is wired correctly

`[CODE]` `falcon-core-identity-svc/src/Falcon.Identity.Api/Application/Users/UseCases/CreateUserProcess.cs:104`:

```csharp
await accessRoleLinkClient.SyncPrimaryRoleAsync(
    BuildPrimaryRoleLinkSyncRequest(user, tenantId), ct);
```

`BuildPrimaryRoleLinkSyncRequest` (line 164) passes `user.IdentityUserId` — which by convention is the Zitadel user-id, set from the `userId` returned by the Zitadel mgmt create-user call. **Any user created through the normal Identity flow is fine.**

## Where it's been wrong (and how to spot it)

`seed-test-users.sh` v1 (pre-2026-05-16) called `ensure_pes_link "$mongo_id" "$role_key" "$namespace"` after `upsert_identity_user` returned the Mongo `_id`. Result: 6 `g`-rules keyed by Mongo id, all 6 users silently denied on every PES check. Fixed in v2 (rename param `mongo_id` → `zitadel_id`, pass `$zuid` from `create_zitadel_user`).

### Diagnostic — is your seed script bitten?

```bash
# Pull all g-rules and look at obj — Mongo _id is 24-char hex, Zitadel id is long numeric.
curl -sS http://localhost:5296/pes/policyrule \
  | jq -r '.[] | select(.type=="g") | .obj' \
  | sort -u
```

- ✅ Correct: `u:373185572597923850@system` (long numeric → Zitadel)
- ❌ Wrong: `u:6a085934e1191397bb7c4856@system` (24-char hex → Mongo)

### Fix (in-place — works for any environment)

```bash
docker run --rm --network "container:falcon-zitadel-1" \
  -v "$(pwd)/falcon-essentials/zitadel:/work" badouralix/curl-jq:latest sh -c '
TOKEN=$(cat /work/admin.pat | tr -d "\r\n")
USERS=$(curl -sS -X POST http://localhost:8080/management/v1/users/_search \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{}")
# For each user/role pair, delete stale g-rule and insert correct one.
# (Concrete commands documented in [[Local-Test-Users]].)
'
```

Full fix transcript and recovery script in:
- `_mounts/memory/feedback_pes_g_link_uses_zitadel_id.md`
- `Falcon/Falcon/falcon-essentials/zitadel/seed-test-users.sh` (v2+)
- `Falcon/Falcon/falcon-essentials/zitadel/pes-verification-2026-05-16.csv` (282-row decision matrix proving the fix)

## Standing-rule checklist for ALL future seed scripts

When writing or reviewing a script that creates PES `g`-rules:

- [ ] The user id passed to `ensure_pes_link` (or equivalent) is the **Zitadel** id returned by `POST /management/v1/users/human/_import` → `.userId`
- [ ] **Not** the Mongo `_id` returned by `db.Users.insertOne(...)`
- [ ] **Not** the `username` (FE doesn't put it in `session.login`)
- [ ] If the script later reads back `IdentityUserId` from Mongo, confirm it stores Zitadel id (it does — `CreateUserProcess` writes `user.IdentityUserId = createUserResponse.UserId` where `UserId` is the Zitadel one)
- [ ] After running the script, smoke-test with: log in as the new user → check at least one expected `pes/authorize` call returns `allow` → check at least one expected `deny` returns `deny`

## See also

- [[falcon-core-access-svc]] — PES service note
- [[falcon-core-identity-svc]] — Identity service note (the canonical writer)
- [[Local-Test-Users]] — the 6 seeded test users this rule unblocked
- [[Authorization-Security-MOC]] — full auth model
- `_mounts/memory/feedback_pes_g_link_uses_zitadel_id.md` — standing-rule memory note
- `Home/Software-Architecture-Design/Permissions-&-Authorization-Module-(Policy-Based-Access-Control)` — Wiki source
