---
type: capability-map
cluster: 100-Authority
role: acc-owner
projection-source: _mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/acc-owner.capability.md
verified-at: 2026-05-16
purpose: "Answers 'what unique powers acc-owner has (only acc-* with account-user.add, services, profile edit, contracts)'. Open when implementing or auditing Account-Owner features."
---

> [!tldr]
> ~62-row table for `acc-owner`. The Client-side super-user — full management-console powers. Only acc-* role with account-user creation, account-profile edit, password security, IPs, quota, and services + contracts view.

# Capability · acc-owner

## Unique powers (vs other acc-*)
- ✅ Add account-user (`acc.account-user.add`) — **only acc-* role**
- ✅ Services view + payment + disable
- ✅ Account-profile edit · account-password-security view+edit · account-allowed-ips view+edit · account-quota view+edit
- ✅ View contract
- ✅ Full role-edit reach across acc-* roles

## Explicit denies
- ❌ Land on admin-console
- ❌ Edit own contact-groups created by others (expression-gated to `r.obj.createdby == r.sub.userid`)

## Silent denies
- — Every `sys.*` resource
- — Cross-namespace promotion (cannot reach `sys-*` roles)

## Drill into Brain Outputs

[Full capability map → acc-owner.capability.md](../_mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/acc-owner.capability.md)

## See also

- [[Capability-acc-admin]] · [[Capability-acc-user]] — peer Client roles
- [[Roles]] · [[PES-Keys]] · [[Falcon-vs-Client]]
