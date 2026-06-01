---
name: Vol 50 — PES Catalog Deep Audit (Q-AM-16 closure)
description: 12 PES↔PRD drifts confirmed; 6 roles + 58 factories + 412 p-rules grid documented; status/scope are handler-layer not PES; creator-gate is PES-only for Contact Group; tenant boundary via PolicySubjectContract
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
# Vol 50 — PES Catalog Deep Audit — 2026-05-18

**Status:** 🟢 LANDED 2026-05-18 (Wave 17 autopilot).

## What landed

- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-50-PES-CATALOG-DEEP-AUDIT.md` — 14 sections
- `Brain Outputs/.../WAVE-17-CODE-MINING-PES-CATALOG.md` — agent report (~510 lines)
- `Brain SK/_obsidian/00-Home/PES-CATALOG-SPECIALIST-HUB.md` — Obsidian hub
- `Brain SK/_obsidian/10-Pages/Vol 50 — PES Catalog Deep Audit.md` — graph node
- 2 task chips: 5-HIGH-drifts bundle + CRITICAL PolicySubjectContract regression test
- AMMAR_BRAIN_HOME updated · ATLAS_MASTER_INDEX updated · MEMORY.md updated

## Q-AM-16 CLOSED with 12 drifts

### 5 HIGH drifts
1. **Template module entirely PES-blind** — no `*.template/*` factories, no seeds
2. **Contract & Cost lacks `sys.contract/view`** — Falcon roles can't view contracts via PES
3. **`sys.user/add` orphan** — blocks Add-User wizard for Falcon side
4. **`sys.user-permission-group/assign` orphan** — blocks permission-group assignment
5. **`sys.user-profile-picture/upload` orphan** — blocks profile-picture upload

### 7 MED drifts
6. `sys.contact-group/share-other` orphan
7. `acc.contact-group/share-other` orphan
8. `dashboard/view` orphan
9. `auth_view/view` orphan
10. `user_profile/view` orphan
11. `microapp.*/view` orphan
12. `acc.contact-group/view-shared` only seeded for acc-user (should be all 3 client roles)

## Key code-verified facts

### The 6 canonical roles (BuiltInRoleCatalog.cs:77-290)

| Tier | Role | Seeded p-rules |
|---|---|---|
| Falcon | sys-admin | 68 |
| Falcon | sys-ops | 56 |
| Falcon | sys-products | 67 |
| Client | acc-owner | 74 |
| Client | acc-admin | 72 |
| Client | acc-user | 75 |
| **TOTAL** | | **412** |

### Architecture boundaries (NEW knowledge)

| What PES enforces | What it does NOT |
|---|---|
| WHO (role) | WHEN (status) |
| Tenant boundary | Hierarchy / node-scope |
| Creator-gate (Contact Group only) | Last-admin guard |

Status/scope/invariants are enforced at the **handler / domain-policy layer**:
- `UserStatusTransitionPolicy.cs:16-40`
- `LoginEligibilityPolicy.cs:14-26`
- `ForgotPasswordProcess.cs:35-36`

### Creator-gated rules (PES-side, 7 rules in CG only)

Located at `BuiltInRoleCatalog.cs:205, 206, 243, 244, 283, 284, 285`. Policy expression: `r.obj.createdby == r.sub.userid`. FE bypasses display logic via `ignoreExpression: true`; server enforces.

### Tenant boundary enforcement

`PolicySubjectContract` enforces subject format `u:<userId>@<tenant-namespace>`. This is the multi-tenant safety foundation — a regression here is a CRITICAL security issue.

## Open questions

| ID | Severity |
|---|---|
| Q-PES-01 | LOW — 47-vs-58 count reconciliation |
| Q-PES-02 | LOW — acc-user vs acc-owner seed delta |
| Q-PES-03 | **HIGH** — Is Add-User wizard broken or dev-bypassed? |
| Q-PES-04 | MED — Status-gating consistency across all handlers |
| Q-PES-05 | **CRITICAL** — PolicySubjectContract regression test |
| Q-PES-06 | **HIGH** — Template module PES design + seed |
| Q-PES-07 | **HIGH** — `sys.contract/view` design + seed |

## Trigger phrases

- `vol 50 pes catalog`
- `pes catalog specialist hub`
- `Q-AM-16 closed`
- `BuiltInRoleCatalog 6 roles`
- `falcon-access.registry.ts factories`
- `PolicySubjectContract`
- `9 orphan keys`
- `creator-gated rules contact group`
- `status not in PES handler layer`
- `node scope not in PES`
- `tenant boundary PES`
- `412 seeded p-rules`
