---
type: specialist-hub
hub: pes-catalog-specialist
created: 2026-05-18
authority: "Vol 50 (deep audit) + Wave 17 code-mining + BuiltInRoleCatalog.cs + falcon-access.registry.ts"
status: canonical-code-verified
tags:
  - specialist/pes
  - specialist/permissions
  - specialist/authorization
  - specialist/security
  - hub
---

# 🛡️ PES Catalog — Specialist Hub

> **Your entry point** for anything permissions/authorization/role-based access.

## 🚀 Quick triage

| If you're asking... | Start here |
|---|---|
| "Which role can do action X?" | [Vol 50 §3](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-50-PES-CATALOG-DEEP-AUDIT.md) seed grid |
| "What's the 6-role hierarchy?" | [Vol 50 §1](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-50-PES-CATALOG-DEEP-AUDIT.md) — sys/acc, no inheritance, `OtherRoleEditMatrix` |
| "How is creator-gate enforced?" | [Vol 50 §7](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-50-PES-CATALOG-DEEP-AUDIT.md) — PES policy expression `r.obj.createdby == r.sub.userid` |
| "Does PES check user status?" | **NO** — see [Vol 50 §6](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-50-PES-CATALOG-DEEP-AUDIT.md) — status is handler-layer |
| "Does PES check hierarchy scope?" | **NO** — see [Vol 50 §8](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-50-PES-CATALOG-DEEP-AUDIT.md) — node-scope is handler-layer |
| "Why is the Add-User wizard broken on Falcon side?" | [Vol 50 §4](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-50-PES-CATALOG-DEEP-AUDIT.md) — 3 orphan keys |
| "PR review checklist" | [Vol 50 §11](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-50-PES-CATALOG-DEEP-AUDIT.md) |

## 🧠 The mental model (one paragraph)

Falcon has **6 canonical roles** (3 Falcon: sys-admin/sys-ops/sys-products; 3 Client: acc-owner/acc-admin/acc-user) at `BuiltInRoleCatalog.cs:77-290`. No type inheritance — hierarchy is encoded in `OtherRoleEditMatrix` (a role×role grid). **58 key factories** in `falcon-access.registry.ts` (PRD-stated 47 is a collapsed count — drift). **412 total seeded p-rules** distributed across roles. PES answers **WHO** (role + tenant); the handler layer answers **WHEN** (status) and **WHERE** (node-scope). Tenant boundary IS enforced in PES via `PolicySubjectContract` (`u:<sub>@<tenant>`); status, hierarchy, and last-admin guards are handler-side.

## ⚠️ 12 PRD↔Code Drifts (Q-AM-16 closure)

5 HIGH + 7 MED — see [Vol 50 §5.2](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-50-PES-CATALOG-DEEP-AUDIT.md) for the full table.

**HIGH priorities (task chips spawned):**
1. Template module is entirely PES-blind (no factory family at all)
2. Contract & Cost lacks `sys.contract/view` family — Falcon can't view contracts
3. `sys.user/add` orphan blocks Add-User wizard
4. `sys.user-permission-group/assign` orphan blocks group assignment
5. `sys.user-profile-picture/upload` orphan blocks profile pic

## 🔑 The 6 canonical roles

| Tier | Key | Display | Seeded rules |
|---|---|---|---|
| Falcon | sys-admin | System Administrator | 68 |
| Falcon | sys-ops | System Operations | 56 |
| Falcon | sys-products | System Products | 67 |
| Client | acc-owner | Account Owner | 74 |
| Client | acc-admin | Node Admin | 72 |
| Client | acc-user | Normal User | 75 |
| **Total** | | | **412** |

## 🧩 9 Orphan Keys (factory exists, no seed)

| Key | Module | Severity |
|---|---|---|
| `sys.user/add` | User Mgmt | HIGH |
| `sys.user-permission-group/assign` | User Mgmt | HIGH |
| `sys.user-profile-picture/upload` | User Mgmt | HIGH |
| `sys.contact-group/share-other` | Contact Group | MED |
| `acc.contact-group/share-other` | Contact Group | MED |
| `dashboard/view` | System | MED |
| `auth_view/view` | System | MED |
| `user_profile/view` | System | MED |
| `microapp.*/view` | System | MED |

## 🚦 The 3-layer enforcement stack

```
Layer 1: Authentication (JWT + tenant namespace)
    ↓ pass
Layer 2: PES authorization (role + key + creator-gate if applicable)
    ↓ pass
Layer 3: Handler / Domain policy (status + scope + invariants)
    ↓ pass
Execute command
```

## 📚 Sources of truth (priority order)

1. **`[CODE] BuiltInRoleCatalog.cs:77-290`** — the 6 roles + seeded p-rules (412 total)
2. **`[CODE] falcon-access.registry.ts:1-185`** — the 58 key factories
3. **`[BRAIN-OUT] Vol 50`** — full audit + drift analysis
4. **`[BRAIN-OUT] WAVE-17-CODE-MINING-PES-CATALOG.md`** — agent report (~510 lines)
5. **`[BRD-EXTRACTED] Permission-List-Jawad.txt`** — PRD source
6. **`[BRAIN-OUT] datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md`** — historical 47-key count

## 🛡️ CRITICAL security boundary

**`PolicySubjectContract`** enforces multi-tenant safety at PES level. Bypassing this is a platform-level data-breach risk. Regression test task chip spawned (Q-PES-05).

## 🎯 The 7 creator-gated rules (Contact Group only)

Located at `BuiltInRoleCatalog.cs:205, 206, 243, 244, 283, 284, 285`. All use the policy expression `r.obj.createdby == r.sub.userid`. FE marks them `ignoreExpression: true` — server enforces.

This is the ONLY place where PES does object-level (creator) authorization. Everywhere else is role-only.

## ❓ Open questions

| ID | Topic | Severity |
|---|---|---|
| Q-PES-01 | 47-vs-58 key count drift reconciliation | LOW |
| Q-PES-02 | Audit acc-user vs acc-owner seed delta | LOW |
| Q-PES-03 | Is Add-User wizard currently broken or dev-bypassed? | **HIGH** |
| Q-PES-04 | Status-gating consistency across all handlers | MED |
| Q-PES-05 | PolicySubjectContract regression test | **CRITICAL** |
| Q-PES-06 | Template module PES design + seed | **HIGH** |
| Q-PES-07 | `sys.contract/view` design + seed | **HIGH** |

## 🔗 See also

- [[WALLET-SPECIALIST-HUB]] — wallet actions require Active status (handler-gate, not PES)
- [[USER-LIFECYCLE-SPECIALIST-HUB]] — status-conditional gating in `UserStatusTransitionPolicy.cs`
- [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] — template-side enforcement gap (HIGH drift #1)
- [[VOL-44-TRUTH-TAUTOLOGIES]] §5 (Contact Group) — PES enforces CG-TT-02 via creator-gate
- [[ATLAS_MASTER_INDEX]]
- [[AMMAR_BRAIN_HOME]]

#specialist/pes #specialist/permissions #specialist/authorization #specialist/security #hub #canonical
