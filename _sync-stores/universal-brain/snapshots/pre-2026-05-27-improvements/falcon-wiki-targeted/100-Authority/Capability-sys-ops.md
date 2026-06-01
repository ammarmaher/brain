---
type: capability-map
cluster: 100-Authority
role: sys-ops
projection-source: _mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/sys-ops.capability.md
verified-at: 2026-05-16
purpose: "Answers 'why sys-ops is the IP/firewall-ops persona (account-level IP edit only; root denied) + which silent-deny surface is largest'. Open before assuming sys-ops can run any feature."
---

> [!tldr]
> ~67-row table for `sys-ops`. The "IP/firewall ops" persona — only role with `sys.account-allowed-ips.edit` but NOT `sys.root-allowed-ips.edit`. Largest silent-deny surface of any sys-* role.

# Capability · sys-ops

## Unique powers
- ✅ Edit account-level allowed IPs (without root-level edit)
- ✅ View root password security level (but not edit)

## Explicit denies
- ❌ Edit root password security level
- ❌ Edit root allowed IPs
- ❌ Authorship of contact groups (create/edit/delete/share)

## Silent denies (huge surface)
- — Add accounts (`sys.account.add` no rule)
- — Edit profile / quota / account-password-security (no rule)
- — All service actions (`sys.services.*` no rule)
- — All wallet ops (`sys.wallet-strategy.*`, `sys.master-wallet.view`, `sys.wallet.transfer` no rule)

Effectively: hierarchy view + IP/firewall ops + contact-group view-only. That's it.

## Drill into Brain Outputs

[Full capability map → sys-ops.capability.md](../_mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/sys-ops.capability.md)

## See also

- [[Capability-sys-admin]] · [[Capability-sys-products]] — peer Falcon roles
- [[Roles]] · [[PES-Keys]] · [[Falcon-vs-Client]]
