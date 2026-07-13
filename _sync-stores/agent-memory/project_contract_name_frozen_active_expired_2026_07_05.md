---
name: project-contract-name-frozen-active-expired
description: Contract Name field now locked (disabled) at BOTH Active and Expired statuses via the freeze matrix in all 3 model copies + tests
metadata: 
  node_type: memory
  type: project
  originSessionId: 80cf079e-af90-4a52-8ed1-79a029e1ada1
---

Contract Name must be non-editable when contract status is **active** or **expired** (user request 2026-07-05). Previously only `expired` locked it.

**What changed (FE-only, uncommitted):** `getContractFieldFreezeFlags('active').contractName` flipped `false → true` in all THREE copies of the freeze matrix in `C:\Falcon\Falcon\falcon-web-platform-ui`:
- `apps/admin-console/src/app/features/contracts-cost-management/models/contracts-display.models.ts` (canonical; admin `models.ts` re-exports it)
- `apps/management-console/src/app/features/contracts-cost-management/models/models.ts`
- `apps/management-console/src/app/features/contracts-cost-management/models/contracts-display.models.ts`

The admin edit pane already binds `[disabled]="freezeFlags().contractName"` on the contractName input (`contracts-edit-contract.component.html:112`), so no template change was needed. Mgmt is view-only (flags = visual lock indicator).

**Tests updated:** admin+mgmt `tests/contracts/models.spec.ts` (active-case expectation + monotonic lockCount active 2→3) and admin `tests/contracts/contracts-edit-contract.component.spec.ts` (freezeFlags active case).

**Verification:** admin suite 895/895 tests pass; mgmt contract specs all pass (models 48, edit/view etc.). `nx build` GREEN ×2. PRE-EXISTING unrelated failures: admin `contracts-cost-management.component.spec.ts` (vitest can't resolve `@host-shell/shared/organization-hierarchy-tree` import) and mgmt `contact-groups/create-contact-group.component.spec.ts`.

Related: [[project-contract-wizard-dropdown-visibility]], [[feedback-fe-no-commit-no-branch-without-instruction]].
