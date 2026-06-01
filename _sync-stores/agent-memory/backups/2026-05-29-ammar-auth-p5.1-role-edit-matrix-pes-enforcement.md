---
name: session-backup-p5-1-backend-role-edit-matrix-pes-enforcement-create-user
description: Identity create-user now consults PES for the creator→target role matrix; closes gap H5/R-6
metadata: 
  node_type: memory
  type: project
  agent: ammar-auth
  date: 2026-05-29
  status: completed
  originSessionId: a49778dd-5cee-4050-ad49-800ce188ebaf
---

## What Was Done
Closed gap **H5 / risk R-6** (PLAN P5.1) in **falcon-core-identity-svc**: the creator→target role-edit
matrix was enforced ONLY in the UI on both UIs, so a crafted `POST /api/user` with `roleKey=acc-owner`
from an acc-admin JWT passed every backend gate (privilege escalation). Now the create path consults PES
(the authority of record) and rejects with **403** when PES denies — without touching the endpoint.

**Seam chosen = Option E**: a guard step INSIDE `CreateUserProcess.Handle` (NOT the controller/endpoint).
Placed right after the role-vs-userType check, before any side effect (duplicate-check, quota, Zitadel
provisioning, Mongo persist, role-link Kafka publish, credential send). Fails CLOSED (PES deny/unreachable → reject).

### Key correction to the task brief
The prompt said to "reuse the existing PES authorize client e.g. `AccessRoleLinkClient`". That was wrong:
`AccessRoleLinkClient` is a **Kafka publisher** (fire-and-forget `UserRoleLinkSyncRequestedEvent`), NOT an
HTTP authorize client. Identity had **NO synchronous PES path at all**. So I added a thin one
(`RoleEditAuthorizationClient` → `POST /pes/authorize`), following the existing named-HttpClient +
`AddStandardResilienceHandler()` (Polly v8) pattern.

### PES contract (verified live, falcon-core-access-svc T2.PES)
- Single-resource `POST pes/authorize` body: `{ sub:{kind:"u:<zid>@<ns>"}, obj:{kind:"user.role.other"}, actions:["change-<target>-to-<target>"] }`
- Response: `{ results: { "<action>": bool } }` (true=allow). PES lowercases sub/obj.
- Subject = `u:<JWT.sub>@<ns>`; **JWT.sub = ZitadelUserId** (= `ICurrentUser.IdentityUserId`, NOT Mongo _id). ns = `system` for Falcon callers, caller's own tenantId for Client callers.
- A **create** = the matrix self-diagonal `change-<targetRole>-to-<targetRole>` (no prior role). This yields exactly the documented create reach: owner→{owner,admin,user}; admin→{admin,user} (NOT owner); user→{}; sys-*→all acc-*. Verified by direct PES probe AND end-to-end.
- The matrix p-rules already exist in PES for every tenant (3046 rules live); authority lives in PES, Identity only consults.

## Files Changed (working tree only — NO commits)
NEW:
- `src/.../Infrastructure/Access/ServicesClientsOptions.cs` — binds `ServicesClients:Pes:BaseUrl` (env `ServicesClients__Pes__BaseUrl` already present in compose).
- `src/.../Domain/Policies/RoleAssignmentPolicy.cs` — builds actor subject + diagonal action (PES-contract knowledge, static like UserRolePolicy).
- `src/.../Application/Access/Models/RoleAssignmentAuthorizationRequest.cs`
- `src/.../Application/Abstractions/IRoleEditAuthorizationClient.cs`
- `src/.../Infrastructure/Access/RoleEditAuthorizationClient.cs` — HttpClient `AccessControl` → `pes/authorize`, fail-closed.
MODIFIED:
- `src/.../Application/Users/UseCases/CreateUserProcess.cs` — ctor +`IRoleEditAuthorizationClient`; new guard call `EnsureCallerCanAssignRoleAsync` (the only logic change).
- `src/.../Startup/Extensions/ServiceCollectionExtensions.cs` — `AddAccessControlClient(configuration)` (named client + options bind + DI).
- `src/.../Startup/Constants/HttpClientNames.cs` — `AccessControl`.
- `src/.../Domain/Constants/FalconKeys.cs` — `UnauthorizedRoleAssignment`.
- `src/.../Startup/ExceptionHandlers/FalconExceptionHandler.cs` — map `UnauthorizedRoleAssignment` → 403.
- `src/.../Startup/Localization/Resources/ErrorMessages.resx` + `.ar.resx` — en/ar messages.
- `tests/.../Application/CreateUserProcessTests.cs` — stub new client in SetupHappyPath; +2 proof tests (deny→403+no-side-effects; subject/action wiring).

## Verification
- `dotnet build Falcon.Identity.sln` = **0 warnings, 0 errors** (warnings-as-errors on; had to swap a `"/"`-literal to `new Uri(baseUrl, UriKind.Absolute)` to satisfy Sonar S1075).
- `dotnet test` = **178 passed** incl. all 6 CreateUserProcessTests (2 new). **3 PRE-EXISTING unrelated failures**: `ResendOtpProcessTests` x2 (DevOtpCode null) + `UserCreationRequestedConsumerTests` (offset-commit) — none touch any file I changed; the Kafka consumer has its own mirrored provisioning (TODO comment), does not use the new client.
- **Live E2E** (recompiled `falcon-identity-1` via restart — it runs `dotnet run` off the mounted volume, so my edits were picked up; full stack Identity :7777 / PES :5296 / Zitadel / Mongo / Kafka up):
  - acc-admin → acc-owner = **HTTP 403** "You are not authorized to assign this role." (THE GAP, closed)
  - acc-owner → acc-admin = **HTTP 200** created
  - acc-admin → acc-user = **HTTP 200** created
  - acc-user → acc-user = **HTTP 403**
  - Identity logs from `RoleEditAuthorizationClient` confirm subject `u:<zid>@test-tenant-001` + diagonal action + decision, matching live PES exactly.
- Login is `/api/auth/login` (username not email); these seed users return Stage=4 (Authenticated)+tokens directly (no OTP). Create endpoint = `POST /api/user` (group `user`, RoutePrefix `api`). NOTE: endpoint sets 201 then calls Send.OkAsync→200, so PowerShell Invoke-WebRequest reports a quirk on success; use HttpClient to read the real 200. Pre-existing endpoint behavior — NOT modified (constraint).

## Context for Next Agent
- This is **review→implement of P5.1 only**. The compound partner is **H4 (FE Add-User fail-open, P2.2)** — per R6 §2 callout they should ship together so the hole is never half-closed. H4 is still OPEN (FE work, ammar-web-platform-ui).
- Left 2 throwaway users in test-tenant-001 from the live proof: `proofpt6dsz` (acc-admin), `proofj3u6c8` (acc-user). Harmless dev seed data; delete if a clean tenant is needed.
- The `RoleAssignmentPolicy.BuildAssignRoleAction` deliberately uses the self-diagonal for CREATE. If a future task wires the **role-CHANGE** path (`UpdateUserRoleHandler`, which is ALSO unenforced today), it should use `change-<currentRole>-to-<newRole>` (the target user's actual current role), reusing the same `IRoleEditAuthorizationClient`.
- PES `/pes/authorize` has NO auth and matches the caller-supplied subject (R3 §8/R-5). Safe ONLY if :5296 is network-isolated; the new client trusts the subject built from the verified `currentUser.IdentityUserId` (JWT.sub), not user input — so no new trust surface.
- Do NOT commit. `current-task.json` belongs to a different active task (commchannels-marketplace parity); this P5.1 work was a focused spawned sub-task — left that state untouched.
