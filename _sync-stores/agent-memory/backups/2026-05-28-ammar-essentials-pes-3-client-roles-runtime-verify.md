---
name: session-backup-pes-verify-runtime-exercise-for-3-client-roles-test-tenant-001
description: "Verified+runtime-exercised the PES integration for test-tenant-001 (acc-owner/acc-admin/acc-user), focus user-creation. No seed edits needed (data already complete). Found user-creation is NOT PES-gated at backend."
metadata: 
  node_type: memory
  type: project
  agent: ammar-essentials
  date: 2026-05-28
  status: completed
  originSessionId: 5765fd0b-7ece-42b3-ba8b-b4490986863b
---

## What Was Done
- Deep-dived the SoT: `falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs` (the catalog the BuiltInRoleProvisioner emits), the FE `falcon-access.registry.ts`, and the authority dataset (`05-capability-maps`, `03-pes-keys/REGISTRY-RAW.md`). Did NOT guess.
- Ran a 3-way diff (catalog vs `pes-account-role-rules.json` template vs LIVE PES `GET :5296/pes/policyrule`) via a Node script. Result: for every brief-scoped resource, 0 missing / 0 conflicts / 0 extras. The only catalog rules NOT in template/live are the 9/9/9 `acc.wallet-balance`+`transfer-*` rules (out of this brief's scope; wallet has its own seed path).
- Confirmed all 7 g-rules (links) present + correctly oriented.
- Logged in all 3 canonical users, queried live PES `authorize/resources` decisions (FE-shaped requests), and ACTUALLY created users via `POST identity/user` through the gateway.
- Cleaned up all 4 throwaway users (Mongo soft-delete + Zitadel deactivate + PES g-link delete). Restored pristine state.

## What Remains
- Nothing required for this task. The PES data for `test-tenant-001` was already complete + correct — no seed edits were needed.
- OPEN (flagged, out of scope): backend does NOT enforce the Add-User PES gate (see Key Decisions). A separate task was spawned to evaluate/fix.

## Key Decisions
- **Followed the authority dataset over the brief's framing.** The brief said "GRANT add-user to owner AND admin". The catalog/authority truth: `acc.account-user.add` (ROOT add-user) is acc-owner ALLOW, acc-admin **silent-deny (no rule)**, acc-user DENY; `acc.org-user.add` (SUB-NODE add-user) is owner+admin ALLOW, user DENY. The brief explicitly permitted "or whatever the authority dataset says — cite it".
- **Did NOT add wallet rules** to `pes-account-role-rules.json` — out of the brief's feature scope and wallet PES is seeded elsewhere.
- **Did NOT edit any seed file** — the in-scope PES data was already 100% correct vs catalog.

## Files Changed
- None (no seed/code edits; data verified complete). No git commits.
- Memory updated: `active-session-log.md` (full entry).

## Context for Next Agent
- **The Add-User PES gate (`acc.account-user`/`acc.org-user` add) is FRONT-END-ONLY.** Runtime-proven: `POST identity/user` via core-gateway `:7038` with acc-user's JWT → HTTP 200 (user created), NOT 403. Root cause [CODE]: identity `CreateUserEndpoint`+`CreateUserProcess` (`falcon-core-identity-svc/src/Falcon.Identity.Api/Endpoints/Users/CreateUserEndpoint.cs`, `.../Application/Users/UseCases/CreateUserProcess.cs`) have NO PES check — only `RequireAuthorization()` + role-validity + quota + dup-username + tenant/node-context. Gateway `identity-proxy` route (`falcon-int-core-gateway-svc/.../appsettings.json`) uses `AuthorizationPolicy:"ClientOnly"` = `RequireClaim(UserType==Client)` only (all 3 acc-* are Client). So acc-user is denied ONLY by the FE hiding the button. If a server-side gate is ever wanted, it must be added in the identity service or a gateway endpoint that calls PES.
- **PES decision query recipe** (matches FE `access-control.facade.ts`): `POST :5296/pes/authorize/resources` with `{sub:{kind:"u:<zitadelSub>@<tenant>",departments:[],attr:{}}, resources:[{seqNo, obj:{kind:"<resource>",attr:{},ignoreExpression:false}, actions:["<action>"]}]}`. Response: `results["<kind>_<seqNo>"]["<action>"]=bool`; **when seqNo==0 PES drops the suffix** → key is bare `"<kind>"` (FE `readDecision` tries `kind_seqNo` then bare `kind`).
- **jq gotcha**: `($r[k1][a]) // ($r[k2][a])` is WRONG for booleans — jq treats `false` as empty so it falls through to k2; use `if ($r|has(k1)) then $r[k1] else $r[k2] end`.
- **Tooling**: `jq` = winget `C:\Users\User\AppData\Local\Microsoft\WinGet\Packages\jqlang.jq_*\jq.exe`, feed it cygpath-`-w` paths. `python`/`python3` on PATH are the Windows Store stub (no-op) — use Node for parsing. Identity login `POST :7777/api/auth/login {username,password}` → `result.tokens.accessToken` (JWT); test users are `requiresOtp:false stage:4`.
- **PES rule shapes**: p-rule `{type:p, sub:"r:<role>@<tenant>", obj:"<resource>", action, effect, expression}`; g-rule `{type:g, sub:"r:<role>@<tenant>", obj:"u:<zitadelId>@<tenant>", action:"all", effect:"allow"}`. Delete by id via `DELETE :5296/pes/policyrule {Permissions:[<id>...], DeletedBy:"..."}`.
- **Test creds (all `Admin@1234`, tenant test-tenant-001)**: accowner(role4 acc-owner)/accadmin(role5 acc-admin)/accuser(role6 acc-user) at root a11001; accadmin-hr@a11002, accadmin-db@a11003 (acc-admin); accuser-cc@a11004, accuser-care@a11009 (acc-user). All 7 login-verified stage=4.
