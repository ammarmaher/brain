---
name: Active session handover — Story #115329 Contact Group Permission
description: Complete state + contract for the Contact Group permission work so the next session resumes without loss
type: handover
updated: 2026-04-19
originSessionId: 02a11723-953d-4f03-ab41-1be58f7e474b
---
# Story #115329 — Contact Group Permission

**Status:** In progress. User demands ZERO bugs and only root-cause fixes (no workarounds). Exhaustive test+fix loop in flight.

## The matrix (contract — MUST pass end-to-end, FE and BE)

| Action | Falcon SA/P/O | Client AO | Client NA | Client NU |
|---|---|---|---|---|
| View list | ✅ tenant-wide | ✅ tenant-wide | ✅ tenant-wide | ✅ own only |
| View detail | ✅ read-only banner | ✅ | ✅ | ✅ |
| Create | ❌ 403 `FalconUserNotAllowed` | ✅ | ✅ | ✅ |
| Edit | ❌ 403 `FalconUserNotAllowed` | 👤 creator-only · 403 `NotContactGroupOwner` on other | 👤 | 👤 |
| Delete | ❌ 403 `FalconUserNotAllowed` | 👤 | 👤 | 👤 |
| Share | ❌ 403 `FalconUserNotAllowed` | ✅ always (override) | ✅ always (override) | 👤 · 403 `CannotShareContactGroup` on other |
| Download (validated) | ✅ | ✅ | ✅ | ✅ |
| Download (original) | ✅ | ✅ | ✅ | ✅ |

Every cell must pass both:
- **PES** `/authorize/resources` returning the correct allow/deny for that role+action
- **Actual HTTP call** via gateway → backend returning the correct status/error code

## Branches & PRs

All 4 repos have a single branch named `feature/115329-contact-group-permission`. PRs are draft.

| PR | Repo | Scope |
|---|---|---|
| [#40864](https://dev.azure.com/t2development/Falcon/_git/falcon-core-access-svc/pullrequest/40864) | `falcon-core-access-svc` | PES catalog + role seeding + ABAC expression |
| [#40865](https://dev.azure.com/t2development/Falcon/_git/falcon-core-contact-group-svc/pullrequest/40865) | `falcon-core-contact-group-svc` | user-type guard + ownership + share rules + role fallback + DI fix |
| [#40866](https://dev.azure.com/t2development/Falcon/_git/falcon-web-platform-ui/pullrequest/40866) | `falcon-web-platform-ui` | PES service + resolver + UI gating + read-only banner + id-space fix |
| [#40867](https://dev.azure.com/t2development/Falcon/_git/falcon-core-identity-svc/pullrequest/40867) | `falcon-core-identity-svc` | expose `Path` on `/user/me` |

Merge order (dependency): 40867 → 40864 → 40865 → 40866.

## Environment

- Docker stack at `C:/falcon/Falcon` (`docker compose up -d` brings up backend; FE runs locally via WebStorm / `nx serve host-shell`).
- Backend `feature/115329-contact-group-permission` branches checked out in each repo + containers restarted to pick up code.
- Identity `Security__OtpRequiredOnLogin: "false"` in docker-compose (OTP disabled for testing).
- PES seeded with 30 contact-group policy rules + 6 role-link (`g`-type) rules using Zitadel identityUserIds.
- MongoDB has 20 seeded ContactGroups with owner-prefixed names (`AO — …`, `NA — …`, `NU — …`).

## Test users (all password `Falcon@2026!`, no OTP)

| Username | Role (PES key) | User-type | Portal | Mongo `_id` | Zitadel id (JWT `sub`) |
|---|---|---|---|---|---|
| test.sa | sys-admin | Falcon | Admin Console | 69e4caa74b7d74dc4af24e15 | 369276197533646856 |
| test.p | sys-products | Falcon | Admin Console | 69e4caaf4b7d74dc4af24e17 | 369276212163379208 |
| test.o | sys-ops | Falcon | Admin Console | 69e4cab84b7d74dc4af24e19 | 369276227564863496 |
| test.ao | acc-owner | Client | Management Console | 69e4cabf4b7d74dc4af24e1b | 369276237849296904 |
| test.na | acc-admin | Client | Management Console | 69e4cac84b7d74dc4af24e1d | 369276253150117896 |
| test.nu | acc-user | Client | Management Console | 69e4cad54b7d74dc4af24e1f | 369276267897290760 |

Tenant (BMW): `69dd0985292aa01889681c57`.
Sample group ids (fixtures): `G_AO=69e4e4d183f59d66a244ba89`, `G_NA=69e4e4d183f59d66a244ba99`, `G_NU=69e4e4d183f59d66a244baa5`.

## Two id spaces — critical to remember

- `session.subjectId` = JWT `sub` = **Zitadel** id (digits). Used for **PES subject** `u:<sub>@<tenant|system>`.
- `session.identityUserId` = decoded from JWT metadata `user-id` = **Falcon Identity Mongo `_id`** (hex). Used for **ownership** comparisons against `row.createdByUserId`.
- `session.roleKey` = fetched from Identity `/api/user/me` = canonical role string (e.g. `acc-owner`). Used by `resolveContactGroupRole`.

## Fixes already landed (all on the single branch per repo)

- BE-1 PES catalog + seeding + ABAC operand quoting
- BE-2 `ClientUserOnlyPreProcessor` + DI lifetime fix (resolve scoped via `HttpContext.RequestServices`)
- BE-3 ownership + share rules + role fallback to Identity `/user/me` when JWT lacks role claim
- FE-1 `ContactGroupPermissionsService` + resolver + `ignoreExpression: true` on PES query + `obj.attr = {}` (strict-equality gotcha)
- FE-2 UI gating + read-only banner restyled per screenshot
- Identity `UserResponse.Path` exposed + `UserMapper.MapToResponse` populates it
- `isCreator` compares `identityUserId` (not `subjectId`) — fixed the id-space mismatch
- Role resolver prefers `session.roleKey` from `/user/me` — agent in flight at handover time to land this

## Open known issues as of handover

- Role resolver fallback to Identity `roleKey` — fix in flight (agent `a3a2bd7493fd84f39`). Will auto-update PR #40866 once committed + pushed.
- `/api/contact-groups/shared` endpoint doesn't exist on backend — FE short-circuits to empty page.
- `ListContactGroupsHandlerTests.cs` excluded from compilation via `<Compile Remove>` in contact-group-svc (entity drift, pre-existing). Needs a follow-up rewrite ticket — NOT part of #115329.

## Rules (critical — violations broke things in the past)

1. **No `git push` without the user explicitly saying "push"**. Draft PRs update automatically on push.
2. **No UI testing / `nx serve` / preview tools during implementation.** Build + lint + unit tests only.
3. **Root-cause fixes only — no workarounds.** If a symptom indicates a bug, fix the underlying cause.
4. **Orchestrator voice** — don't narrate agent plumbing or paste briefs to the user.
5. **`--` prefix = spawn agent immediately in parallel** (see `feedback_double_dash_immediate_parallel.md`).
6. **Follow wiki naming conventions + Tailwind grid-first + features-in-apps**.
7. **Frontend never talks to Zitadel directly** — always via Identity Service.

## Handy PowerShell snippets

```powershell
# Login as any test user (password Falcon@2026!, OTP disabled)
$login = Invoke-RestMethod -Uri 'http://localhost:7777/api/auth/login' -Method Post -ContentType 'application/json' -Body '{"username":"test.ao","password":"Falcon@2026!"}'
$tok = $login.result.tokens.accessToken

# PES authorize/resources shape (camelCase, obj.attr empty)
$body = '{"sub":{"kind":"u:<sub>@<tenant>","departments":[],"attr":{}},"resources":[{"seqNo":0,"obj":{"kind":"contact-group","attr":{},"ignoreExpression":true},"actions":["view"]}],"scope":""}'
Invoke-RestMethod -Uri 'http://localhost:5296/pes/authorize/resources' -Method Post -Headers @{Authorization="Bearer $tok"} -ContentType 'application/json' -Body $body

# List contact groups (Client user via Core Gateway)
Invoke-RestMethod -Uri 'http://localhost:7038/contactgroup/contact-groups?NodeId=69dd0985292aa01889681c57&page=1&pageSize=20' -Headers @{Authorization="Bearer $tok"}

# Test-seed reset
cat C:/falcon/tmp/reseed-contact-groups.js | docker exec -i falcon-mongo-1 mongosh "mongodb://root:example@localhost:27017/FalconContactGroupDb?authSource=admin" --quiet

# QA automation
powershell -NoProfile -File C:/falcon/qa/run-backend-tests.ps1 -TaskFilter all
```

## What the next session must achieve

1. Wait for or read the output of agent `a3a2bd7493fd84f39` (role-resolver Identity fallback) — it likely committed locally.
2. Push to origin (PR #40866 auto-updates) ONLY after user says "push".
3. Run the full 32-cell matrix (8 actions × 4 role groups) end-to-end — FE PES response + real HTTP mutation.
4. Any failing cell: diagnose to root cause, fix the root cause (not a workaround), commit atomically.
5. Repeat 3-4 until the matrix is 100% green for all 6 test users.
6. Update PR descriptions with final evidence, notify user, await "push" / "merge" instructions.
7. Do NOT merge PRs without user approval.

## Helpful pointers

- `C:/falcon/test-users.csv` — seeded user creds
- `C:/falcon/qa/test-cases-115329.csv` — 110 pre-written test cells
- `C:/falcon/qa/run-backend-tests.ps1` — automation runner (has synthetic-subject quirk — prefer `C:/falcon/qa/run-real-user-scenarios.ps1` when re-testing real behavior)
- `C:/falcon/tmp/reseed-contact-groups.js` — the seed script (owner-prefixed names)
- `C:/falcon/falcon-wiki/Home/Software-Architecture-Design/Contact-Group-Permission-Story-115329.md` — primary Obsidian note
- `C:/falcon/falcon-wiki/Home/Software-Architecture-Design/PES-Gotchas-obj-AttrAsString.md` — `obj.attr` strict-equality caveat
- `C:/falcon/falcon-wiki/Home/Software-Architecture-Design/Identity-User-Role-Claims-on-JWT.md` — JWT metadata structure

## Azure DevOps access

PAT lives in Windows user env var `AZDO_PAT`. Read fresh per call via PowerShell:

```powershell
$pat = [Environment]::GetEnvironmentVariable('AZDO_PAT','User')
$auth = 'Basic ' + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(':'+$pat))
```

Org `t2development`, project `Falcon`. PAT scopes: Code Read + Work Items Read (sufficient for branch/PR/WI reads; linking WIs requires Write — user declined to grant).

## Key environment notes

- `C:/falcon/Falcon/docker-compose.yml` has FE services under `profiles: ["frontend"]` (FE runs locally, not in Docker).
- `Security__OtpRequiredOnLogin: "false"` on identity service.
- Contact-group service has `ServicesClients__Identity__BaseUrl: http://identity:7777` in compose env.
- `C:/falcon/Falcon/docker-compose.yml` has a fix removing a duplicate `schema-registry` dep from contact-group service.
