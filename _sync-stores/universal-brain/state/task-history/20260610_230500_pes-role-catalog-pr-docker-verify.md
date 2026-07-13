# PES role-catalog PR 42325 — Docker run + runtime verify (2026-06-10)

**Task:** Confirm system roles come from PES backend (one SoT) for Add User / Edit User info tab / Users list; ensure PR is running in Docker; restart + verify. NO code edits (verification-only, per user).

## What was done
1. Identified PR: **42325** "feat: Canonical role display names (Operation/Product) + provisioner name-sync", branch `feature/role-catalog-canonical-names-sync` → `main` in `falcon-core-access-svc`, ACTIVE, mergeStatus succeeded, 0 reviewers, source commit 2ebc0d2 == local tip, merge-base == main tip ed139d3 (no divergence).
2. `falcon-pes-1` bind-mounts `C:\Falcon\Falcon` and runs `dotnet run` from `falcon-core-access-svc/src/T2.PES.API` → checked out PR branch + `docker restart falcon-pes-1`.
3. **Runtime evidence (all PASS):**
   - Mongo `PES.Roles` BEFORE: sys-ops="System Operation", sys-products="Products" → AFTER restart: **"Operation" / "Product"** (provisioner name-sync ran at startup, idempotent: Created roles 0 / rules 0).
   - `GET :5296/pes/roles?targetUserType=system` (sysadmin JWT via `POST :7777/api/auth/login`, Admin@1234) → canonical names served.
   - `GET :5296/pes/roles?targetUserType=account` NO tenantId → **HTTP 200 catalog template** (creater="catalog-template"; pre-PR = 400). NEW PR behavior live.
   - `GET :5296/pes/roles?targetUserType=account&tenantId=test-tenant-001` → DB rows, names correct.
   - Container `Up (healthy)`.
4. **FE audit (Explore agent):** all 3 flows use ONE source — `RoleCatalogStore` singleton → `GET {baseURLPes}/pes/roles` (`user-api.service.ts:248-284`). Add-User wizard step 2 builds options ONLY from catalog; Edit-User role tab resolves catalog per target user; Users list/org-chart resolve display names via `roleCatalog.label()`. FE pinned fallback labels (`role-key.constants.ts:73-74`) already match PR canonical names. No hardcoded role lists.

## State left behind
- `falcon-core-access-svc` checked out on `feature/role-catalog-canonical-names-sync` (NOT main) so running PES = PR code. Switch back to main when PR merges or other work needs main.
- PR 42325 still needs reviewers/votes → merge.

## Restored
- current-task.json restored to paused task `sidebar-org-hierarchy-click-dead-2026-06-10` (in_progress).
