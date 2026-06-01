---
type: index
cluster: 04-feature-parity-matrix
purpose: "Answers 'which per-feature compare notes exist in the parity matrix'. Open to navigate to a specific feature's Falcon-vs-Client comparison."
---

# Feature Parity Matrix — Index

> [!tldr]
> One compare note per feature + a master matrix. 7 features × authority lens. Start at [[MATRIX]] for the at-a-glance grid; drill into individual notes for per-role × per-action detail.

## Files

| File | Class | Falcon | Client |
|---|---|---|---|
| [[MATRIX]] | (master) | — | — |
| [[organization-hierarchy.compare]] | Shared+ | ✅ Add Client wizard | ✅ Add Node/User |
| [[comms-hub.compare]] | Shared+ | ✅ flat | ✅ nested + children |
| [[marketplace-applications.compare]] | Shared | ✅ | ✅ |
| [[contact-groups.compare]] | Asymmetric | 👁️ view-only | ✅ full CRUD |
| [[wallet-balance-management.compare]] | Falcon-mostly | ✅ Master Wallet | 👁️ view + transfer |
| [[contracts-cost-management.compare]] | Falcon-mostly | ✅ full lifecycle | 👁️ acc-owner only |
| [[testing-charging.compare]] | Falcon-only | ✅ | ❌ not portable |

## Recommended reading order

1. [[MATRIX]] first.
2. Then drill into whichever feature you're porting / planning.
3. For each port, see the "What changes when copying admin → mgmt" section.
