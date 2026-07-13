---
name: project_pes_role_catalog_pr42325_docker_runtime_verify_2026_06_10
description: PR 42325 (role-catalog canonical names + name-sync + tenant-less Account template) RUNTIME-VERIFIED in Docker; roles SoT = PES for Add-User/Edit-User/Users-list; PES repo left on PR branch
metadata: 
  node_type: memory
  type: project
  originSessionId: 2e8baba9-28e3-4521-9e8e-e5cf09f8cc3f
---

**PR 42325** `falcon-core-access-svc` "feat: Canonical role display names (Operation/Product) + provisioner name-sync" — branch `feature/role-catalog-canonical-names-sync` → main, ACTIVE (created 2026-06-10 by Ammar, 0 reviewers, mergeStatus succeeded, tip 2ebc0d2, merge-base = main tip ed139d3). URL: https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-access-svc/pullrequest/42325 (dev.azure.com unreachable from this machine; az CLI NOT installed — use REST + PAT at `C:\Users\User\.azure-devops-pat`).

**RUNTIME-VERIFIED 2026-06-10 (all PASS):** checked out PR branch + `docker restart falcon-pes-1` (container bind-mounts `C:\Falcon\Falcon`, runs `dotnet run` from `falcon-core-access-svc/src/T2.PES.API` → compiles whatever is checked out; Mongo DB name = `PES`, collections Roles/PolicyRules — NOT `Falcon_PES` as older `_activate_v2.sh` says).
1. Startup provisioner name-sync renamed Mongo `PES.Roles`: sys-ops "System Operation"→**"Operation"**, sys-products "Products"→**"Product"** (before/after snapshots; idempotent, 0 creates).
2. `GET :5296/pes/roles?targetUserType=system` serves canonical names (JWT: `POST :7777/api/auth/login` {username:"sysadmin",password:"Admin@1234"} → `.result.tokens.accessToken`; seeded users sysadmin/sysops/sysprod + acc users tenant test-tenant-001).
3. NEW PR behavior live: `?targetUserType=account` WITHOUT tenantId → HTTP 200 built-in catalog template (`creater:"catalog-template"`; pre-PR 400 "tenantId is required") — feeds Add-Client owner-role dropdown.
4. Tenant-scoped account roles correct from DB.

**Roles one-SoT CONFIRMED (FE audit):** Add-User wizard step 2, Edit-User role tab, Users-list/org-chart ALL resolve role values+display names via shared `RoleCatalogStore` → `GET {baseURLPes}/pes/roles` (`apps/host-shell/src/app/core/user/user-api.service.ts:248`); zero hardcoded role lists; FE pinned fallback labels `role-key.constants.ts:73-74` already match PR canonical names (load/offline fallback only).

**Users-list wire proof (live):** `GET :7256/identity/user?NodeId=000000000000000000a11001` returns per-user `role` (number) + `roleKey` (string) and **NO role display name**; identity Mongo `FalconIdentityDb.Users` stores `role` as number only (sysadmin=1, sysprod=2, sysops=3, acc-owner=4, acc-admin=5, acc-user=6) — a stale role name CANNOT come from identity. List table cell = `roleLabel(roleKey)` → `RoleCatalogStore.label()` → PES catalog name (`node-workspace.component.html:238`).

**Why:** user needed proof the PR runs in Docker and that all three user flows read system roles from PES backend.
**How to apply:** PES repo intentionally LEFT ON THE PR BRANCH so running container = PR code; switch back to main after merge or if other work needs main. PR still needs review→merge. Token recipe + seeded users above are the fastest way to probe any authorized PES endpoint. Related [[project_edituser_status_matrix_centralized_rules_2026_06_08]] · [[project_pr41131_edituser_v2_pes_status_seed_review_2026_06_08]].
