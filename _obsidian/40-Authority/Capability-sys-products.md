---
type: capability-map
cluster: 40-Authority
role: sys-products
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\sys-products.capability.md
verified-at: 2026-05-16
purpose: "Answers 'why sys-products is the commercial admin (services + wallet-strategy + master-wallet) + is stricter than sys-ops on root-password-security'. Open before any commercial admin work."
---

> [!tldr]
> ~67-row capability table for `sys-products`. "Commercial admin" persona — full services + wallet-strategy + master-wallet + wallet-transfer + account-creation. Stricter than sys-ops on password security.

# Capability · sys-products

## Unique (shared only with sys-admin)
- ✅ Master Wallet view
- ✅ Wallet transfer + strategy view/edit
- ✅ Services × 4 actions
- ✅ Account add + profile edit

## Explicit denies
- ❌ View root password security (stricter than sys-ops)
- ❌ Edit allowed IPs (root or account)
- ❌ Author contact groups

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\sys-products.capability.md`

## See also
- [[Capability-sys-admin]] · [[Capability-sys-ops]] · [[Roles]] · [[PES-Keys]]
