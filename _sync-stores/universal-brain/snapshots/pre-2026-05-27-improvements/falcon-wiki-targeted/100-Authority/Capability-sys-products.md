---
type: capability-map
cluster: 100-Authority
role: sys-products
projection-source: _mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/sys-products.capability.md
verified-at: 2026-05-16
purpose: "Answers 'why sys-products is the commercial admin (services + wallet-strategy + master-wallet) + is stricter than sys-ops on root-password-security'. Open before any commercial admin work."
---

> [!tldr]
> ~67-row table for `sys-products`. The "commercial admin" persona — full services + wallet-strategy + master-wallet + wallet-transfer + account-creation. Stricter than sys-ops on password security (deny on BOTH view and edit).

# Capability · sys-products

## Unique powers (shared only with sys-admin)
- ✅ Add accounts
- ✅ Master Wallet view
- ✅ Wallet transfer
- ✅ Wallet-strategy view + edit
- ✅ Services payment + edit-price-type + edit-price-value + visibility

## Explicit denies
- ❌ View root password security level (stricter than sys-ops which has view)
- ❌ Edit root password security level
- ❌ Edit allowed IPs (root or account)
- ❌ Authorship of contact groups

## Drill into Brain Outputs

[Full capability map → sys-products.capability.md](../_mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/sys-products.capability.md)

## See also

- [[Capability-sys-admin]] · [[Capability-sys-ops]] — peer Falcon roles
- [[Roles]] · [[PES-Keys]] · [[Falcon-vs-Client]]
