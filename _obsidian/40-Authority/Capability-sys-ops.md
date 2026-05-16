---
type: capability-map
cluster: 40-Authority
role: sys-ops
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\sys-ops.capability.md
verified-at: 2026-05-16
purpose: "Answers 'why sys-ops is the IP/firewall-ops persona (account-level IP edit only; root denied) + which silent-deny surface is largest'. Open before assuming sys-ops can run any feature."
---

> [!tldr]
> ~67-row capability table for `sys-ops`. "IP/firewall ops" persona — only role with `sys.account-allowed-ips.edit` without `sys.root-allowed-ips.edit`. Largest silent-deny surface.

# Capability · sys-ops

## Unique
- ✅ `sys.account-allowed-ips.edit` (without root counterpart)
- ✅ `sys.root-password-security-level.view` (but not edit)

## Explicit denies
- ❌ Edit root password security level
- ❌ Edit root allowed IPs
- ❌ Author contact groups

## Silent denies (huge surface)
- — Add accounts, edit profile/quota/account-password-security
- — All `sys.services.*` actions
- — All wallet ops

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\sys-ops.capability.md`

## See also
- [[Capability-sys-admin]] · [[Capability-sys-products]] · [[Roles]] · [[PES-Keys]]
