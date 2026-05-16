---
type: moc
cluster: 40-Authority
title: Falcon vs Client — feature parity overview
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\04-feature-parity-matrix\MATRIX.md
verified-at: 2026-05-16
purpose: "Answers 'which features are Falcon-only / Falcon-mostly / Shared / asymmetric'. Open before deciding whether to port a feature admin → mgmt."
---

> [!tldr]
> 7 features compared across admin-console (Falcon) and management-console (Client). 1 Falcon-only · 2 Falcon-mostly · 4 Shared (config-flip or enrichment). Use this note to decide port direction + scope.

# Falcon vs Client

## Master classification

| Feature | Class | Admin | Client |
|---|---|---|---|
| organization-hierarchy | Shared + Falcon enrichment | ✅ tree + Add Client wizard | ✅ tree (no Add Client) |
| comms-hub | Shared + Client enrichment | ✅ flat list | ✅ nested + 3 stub children |
| marketplace-applications | Shared (config-flip) | ✅ | ✅ |
| contact-groups | Asymmetric | 👁️ view-only | ✅ full CRUD + share + wizard |
| wallet-balance-management | Falcon-mostly | ✅ Master Wallet + transfer | 👁️ view + transfer (no Master Wallet) |
| contracts-cost-management | Falcon-mostly | ✅ full lifecycle | 👁️ view-only (acc-owner only) |
| testing-charging | Falcon-only | ✅ | ❌ not portable |

## Who can land on each page

| Feature | sys-admin | sys-ops | sys-products | acc-owner | acc-admin | acc-user |
|---|---|---|---|---|---|---|
| organization-hierarchy | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| comms-hub | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| marketplace-applications | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| contact-groups | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| wallet-balance-management | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| contracts-cost-management | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| testing-charging | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

> `acc-user` only sees contact-groups. Every other mgmt feature `acc.<resource>.view` is deny or no rule.

## Falcon-only features

1. **testing-charging** — entire feature (security: mutates real OCS state).
2. **Master Wallet + cross-account transfer** (inside wallet-balance-management).
3. **Add Client 5-step wizard** (inside organization-hierarchy).

## Client-only features

1. **Contact-group create / edit / delete / share** — admin can view + download but cannot author.
2. `acc.contact-group / view-shared` — only `acc-user` has it.

## Drill into individual features (Brain Outputs)

- `C:\Falcon\Brain Outputs\datasets\authority-dataset\04-feature-parity-matrix\organization-hierarchy.compare.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\04-feature-parity-matrix\comms-hub.compare.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\04-feature-parity-matrix\marketplace-applications.compare.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\04-feature-parity-matrix\contact-groups.compare.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\04-feature-parity-matrix\wallet-balance-management.compare.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\04-feature-parity-matrix\contracts-cost-management.compare.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\04-feature-parity-matrix\testing-charging.compare.md`

## See also

- [[Roles]] — the 6 roles
- [[PES-Keys]] — the 47 PES key factories
- [[Statuses]] — every status enum
