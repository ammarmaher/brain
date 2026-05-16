---
type: capability-map
cluster: 40-Authority
role: sys-admin
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\sys-admin.capability.md
verified-at: 2026-05-16
purpose: "Answers 'what unique powers sys-admin has (only role for root-password-security.edit + root-allowed-ips.edit + cross-namespace role-edit)'. Open when implementing top-Falcon-staff features."
---

> [!tldr]
> ~67-row capability table for `sys-admin`. Most-powerful role: only one with `sys.root-password-security-level.edit`, `sys.root-allowed-ips.edit`, and cross-namespace role-edit reach.

# Capability · sys-admin

## Unique powers
- ✅ Edit ROOT password security level — **only role**
- ✅ Edit ROOT allowed IPs — **only role**
- ✅ Cross-namespace role-edit (every sys-* AND every acc-*)
- ✅ Full Falcon-side commercial + admin powers

## Explicit denies
- ❌ Author contact groups (`sys.contact-group.create/edit/delete/share`)

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\sys-admin.capability.md`

## See also
- [[Capability-sys-ops]] · [[Capability-sys-products]] · [[Roles]] · [[PES-Keys]] · [[Falcon-vs-Client]]
