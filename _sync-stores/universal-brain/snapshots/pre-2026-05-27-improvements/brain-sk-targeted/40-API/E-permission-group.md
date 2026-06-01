---
type: entity
id: E-permission-group
title: Permission Group
status: stub
created: 2026-05-18
source: Business deep-dive mining 2026-05-18 (GAP-BIZ-X-08)
priority: highest
tags: [entity, cross-module, permissions, pes, stub]
---

# E-permission-group — Permission Group

> [!warning] **STUB — Authoring required**
> This entity was identified by the 2026-05-18 business mining pass as the **single highest-priority missing E-\* entity**. It is cited by BR-UM-40, BR-UM-42, BR-UM-43, BR-UM-44 + every module's permission story, but had no vault note until this stub.

## One-line shape

Permission Group is a **named bundle of permission tuples** assigned 1:1 to a User. It is the unit of permission delegation across Falcon. Created/edited by admins inside an account scope (account-scoped) OR by platform admins (Falcon-scoped).

## Provisional fields

| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key |
| `name` | MultiLanguageName(En, Ar) | Display name; unique within scope |
| `description` | MultiLanguageName(En, Ar) | Optional |
| `scope` | enum {Falcon, Account} | Falcon-scoped = platform-wide; Account-scoped = tenant-bound |
| `tenantId` | string? | Required when `scope = Account`; null otherwise |
| `permissions[]` | E-permission[] | The actual tuples (see E-permission stub) |
| `createdAt` | datetime | Audit |
| `createdBy` | userId | Audit |
| `updatedAt` | datetime | Audit |
| `updatedBy` | userId | Audit |
| `assignedUserCount` | int (derived) | Count of users carrying this PG |

## Cardinality

- **PG : User** = 1 : N (one PG can be assigned to many users; per BR-UM-42 each user has exactly one PG)
- **PG : Permission** = 1 : N (many tuples per PG)
- **PG : Tenant** = N : 1 (when account-scoped)

## Cross-module references

- **02-user-management** — owner module (BR-UM-40 assignment; BR-UM-42 one-per-user; BR-UM-43 sheet authoritative; BR-UM-44 row values)
- **01-account-management** — account-scoped PGs created inside Account context (BR-AM-02 Add Client wizard creates an account; first PGs created post-wizard)
- **03-contract-packaging-charging-billing** — Send Transaction policy checks read PG permissions (Falcon-only edit / view rights)
- **04-contact-group-management** — Share-with picker filter uses PG to determine who can see what
- **05-templates** — Checker role (BR-TM-22) SHOULD be a PG permission key (BR-X-CHECKER-ROLE-01)

## Open questions

- Cross-account PG sharing — BR-X-PERMISSION-GROUP-01 proposes FORBIDDEN; needs product confirmation (Q-X-NEW-09)
- PG inheritance on node move — Q-UM-NEW-12 / GAP-BIZ-UM-08
- Default PGs auto-created per account — none documented

## Backend reality (verify)

[INFERRED] Backend should expose:
- `GET /permission-group?scope={Falcon|Account}&tenantId={…}`
- `POST /permission-group`
- `PUT /permission-group/{id}`
- `DELETE /permission-group/{id}` (cascade: re-assign users? require replacement?)
- `GET /permission-group/{id}/users` (assigned users)

Not yet verified against `[CODE]` since this is a stub.

## Bound by BR rules

- BR-UM-40 (Permission Group assignment editable)
- BR-UM-42 (one PG per user)
- BR-UM-43 (Permission List - Jawad sheet authoritative for cross-account; PRD Q-UM-07 Tab 2 still blocked)
- BR-UM-44 (4-state row values: Allow / NotAllow / Deny / CanBeOverriddenByDeny)
- BR-X-PERMISSION-GROUP-01 (proposed cross-module rule)

## See also

- `[[E-permission]]` (stub) — the tuple shape
- `[[E-user]]` — references PermissionGroupId
- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md` — 47 PES key factories
- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/_pending-questions/wave-2-02-user-Q-UM-07.md` — Permission Sheet Tab 2 blocker

## Authoring status

- 🟡 Provisional shape — not validated against backend code
- ⏳ Awaiting Q-UM-07 (Tab 2) resolution before locking the `value` enum on E-permission
- ⏳ Awaiting Q-X-NEW-09 (cross-account sharing) for scope semantics
