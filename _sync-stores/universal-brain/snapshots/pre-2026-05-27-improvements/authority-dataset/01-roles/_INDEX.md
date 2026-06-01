---
type: index
cluster: 01-roles
verified-at: 2026-05-16
purpose: "Answers 'what are the 6 built-in roles in Falcon + which PES keys does each have'. Open when planning a new feature, scoping access, or seeding a test user."
---

# 01-roles - Built-in Falcon roles

> [!tldr]
> 6 built-in roles split across 2 kingdoms. **sys-*** roles live on the Falcon staff tenant (admin-console); **acc-*** roles live on Client tenants (management-console). Each note carries the role's exact PES key list, kingdom, scope, and capabilities matrix.

## The 6 roles

### Kingdom A - Falcon staff (admin-console)

| Role | File | Scope | Pithy description |
|---|---|---|---|
| `sys-admin` | [sys-admin.md](sys-admin.md) | Full platform | Super-admin: every PES key the staff side owns |
| `sys-ops` | [sys-ops.md](sys-ops.md) | Ops + monitoring | Read-heavy + selected write ops |
| `sys-products` | [sys-products.md](sys-products.md) | Catalog | Product catalog + pricing CRUD |

### Kingdom B - Client tenant (management-console)

| Role | File | Scope | Pithy description |
|---|---|---|---|
| `acc-owner` | [acc-owner.md](acc-owner.md) | Tenant root | Full Client tenant; can transfer ownership |
| `acc-admin` | [acc-admin.md](acc-admin.md) | Tenant ops | All mgmt actions except destructive tenant-level |
| `acc-user` | [acc-user.md](acc-user.md) | Self + assigned nodes | Most-restricted; PES gates almost every UI |

## Source of truth

Each role note is generated from `BuiltInRoleCatalog.cs` at parse time. The role -> PES-key mapping is the **runtime catalog** (not the PRD Permission Sheet). For drift between the two, see `07-cross-cutting/permission-sheet-gaps.md`.

## When to use this cluster

| Question | Answer is in |
|---|---|
| "What can `sys-admin` do?" | `sys-admin.md` (full action inventory) |
| "Does `acc-user` have permission for X?" | `acc-user.md` -> grep for X |
| "Which role do I seed for the comms-hub mgmt-side smoke test?" | `acc-admin.md` (has `mc.commsHub.*`) |
| "Is there drift between PRD Permission Sheet and code?" | `07-cross-cutting/permission-sheet-gaps.md` |

## See also

- `02-statuses/` - status enums (some PES keys gate based on status)
- `04-feature-parity-matrix/` - which features each role can use
- `05-capability-maps/` - capability matrices per role
- `07-cross-cutting/permission-sheet-gaps.md` - PRD-vs-code drift
