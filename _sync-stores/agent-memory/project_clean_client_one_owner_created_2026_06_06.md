---
name: project_clean_client_one_owner_created_2026_06_06
description: Recipe + created credentials for a CLEAN local client tenant (no sub-nodes) with exactly one all-permissions acc-owner user; plus the correct PES /pes/authorize request shape (brain doc was wrong).
metadata: 
  node_type: memory
  type: project
  originSessionId: bd7109ff-a48f-4bfb-8acc-7a80b19f080b
---

On 2026-06-06 (claude) created a **clean local client** on the running stack (compose `C:\Falcon\Falcon\Falcon\docker-compose.yml`) per user request "create a client with one user, all permissions, NO nodes, give me username+password".

**Credentials handed over:** username `cleanowner` / password `Admin@1234` (the standard local pwd). Tenant/account = **"Clean Client"**, tenantId `690000000000000000c10009` (ObjectId-style: Main node `_id == ObjectId(tenantId)`, path == tenantId). Zitadel id `376257239960256522`, Identity Mongo `_id` 6a2448d92261be70bb9df8a3. Role = **acc-owner** (role int 4, userType 2). Logs into the **Management/Client console** (FE dev server was up at http://localhost:4200), NOT admin-console (clients get `app.admin-console/view → deny` by design). "No nodes" = exactly 1 Main(root) node, 0 sub-nodes (`hasChildren:false`).

**Why acc-owner = "all pages":** `pes-account-role-rules.json` gives acc-owner `allow` on EVERY management-console object (`app.management-console`, `acc.org-hierarchy/account/organization/services/users/wallet-balance/account-settings/org-settings/contract/contact-group/account-profile/account-quota/account-allowed-ips/account-password-security-level`) — it is the broadest client role; there is no higher client role.

**RECIPE (mirrors the proven seed split — NO product create-account/Kafka, full password control, status Active so login is immediate):**
1. Commerce docs via `docker exec -i falcon-mongo-1 mongosh -u root -p example --authenticationDatabase admin` — mirror `seed-service-scenarios.js ensureToyotaNode()`: `FalconCommerceDB.Nodes` Main (type 1, level 1, `_id=ObjectId(TID)`, path=TID, accountDetails{financeId,classificationCategory:3,officialData}), `Settingss` (ownerId=TID, security+quota), `Tenants` (`_id=ObjectId(TID)`). NO children = clean.
2. User via Zitadel mgmt API (PAT at `falcon-essentials/zitadel/admin.pat`, org "ZITADEL"): `POST /management/v1/users/human/_import` (password=Admin@1234, email+phone verified) → zuid; `FalconIdentityDb.Users` upsert (role 4, userType 2, status 2, isEmail/PhoneVerified, nodeId=ObjectId(TID), path=TID, identityUserId=zuid); `POST /management/v1/users/{zuid}/metadata/_bulk` base64 entries user-id(mongo _id)/user-type(2)/tenant-id(TID)/node-id(TID); `POST /v2/users/{zuid}/otp_sms`.
3. PES (`http://localhost:5296`): g-link `POST /pes/policyrule [{type:g, sub:"r:acc-owner@TID", obj:"u:{zuid}@TID", action:all, effect:allow}]`; then `sed s/{TENANT_ID}/TID/ pes-account-role-rules.json` and POST the 245 p-rules.
4. Verify: login `POST :7777/api/auth/login {userName,password}` → `result.stage:4` + token (OTP off in dev); gateway `GET :7038/commerce/Node` with Bearer → 200 root only; org hierarchy 0 children.

**⚠️ BRAIN CORRECTION — PES `/pes/authorize` request shape.** `authority-dataset/07-cross-cutting/test-users.md` shows a WRONG flat `{"sub":"u:..@ns","obj":"app.x","action":"view"}` (yields 400 "could not convert to T2.PES.Subject"). REAL shape ([CODE] `falcon-core-access-svc/src/T2.PES/PDP/AuthRequest.cs` + `DecisionPoint.cs:110-123`): `{"sub":{"kind":"u:{zuid}@{tenant}"},"obj":{"kind":"app.management-console"},"actions":["view"]}` → response `{"results":{"view":true|false}}`. `Sub.Kind` is lowercased then `GetByObj(Sub.Kind)` finds the g-link. Verified: all mgmt pages true, admin-console false.

NO repo/app source changed; NO commits. Pure data seeding against the live stack (idempotent). charging container was "unhealthy" (does not block login/pages). Related [[reference_static_remote_rebuild_after_app_edit_2026_06_04]].
