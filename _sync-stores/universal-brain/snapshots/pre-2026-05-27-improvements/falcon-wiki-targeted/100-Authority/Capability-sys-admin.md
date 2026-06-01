---
type: capability-map
cluster: 100-Authority
role: sys-admin
projection-source: _mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/sys-admin.capability.md
verified-at: 2026-05-16
purpose: "Answers 'what unique powers sys-admin has (only role for root-password-security.edit + root-allowed-ips.edit + cross-namespace role-edit)'. Open when implementing top-Falcon-staff features."
---

> [!tldr]
> ~67-row table of every page × every action × verdict for `sys-admin`. Most-powerful role: only role with `sys.root-password-security-level.edit`, `sys.root-allowed-ips.edit`, and cross-namespace role-edit reach.

# Capability · sys-admin

## Unique powers (the top-line)
- ✅ Edit ROOT password security level — **only role**
- ✅ Edit ROOT allowed IPs — **only role**
- ✅ Cross-namespace role-edit (can promote/demote ANY role in either family)
- ✅ Full Falcon-side admin + commercial powers (account add · profile edit · password security · IPs · quota · services × 4 actions · wallet-strategy · master-wallet · wallet-transfer)

## Explicit denies
- ❌ Authorship of contact groups (`sys.contact-group.create/edit/delete/share` all explicit deny)

## Drill into Brain Outputs

[Full capability map → sys-admin.capability.md](../_mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/sys-admin.capability.md)

## See also

- [[Roles]] — all 6 role overviews
- [[PES-Keys]] — the 47-key universe sys-admin is checked against
- [[Capability-sys-ops]] · [[Capability-sys-products]] — peer Falcon roles
- [[Falcon-vs-Client]] — feature matrix
