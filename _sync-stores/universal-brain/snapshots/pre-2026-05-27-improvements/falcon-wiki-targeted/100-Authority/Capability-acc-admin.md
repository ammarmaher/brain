---
type: capability-map
cluster: 100-Authority
role: acc-admin
projection-source: _mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/acc-admin.capability.md
verified-at: 2026-05-16
purpose: "Answers 'what can acc-admin do/not do (middle-tier: org+account view+add but explicit deny on services/profile/contracts)'. Open when implementing or auditing Node-Admin features."
---

> [!tldr]
> ~60-row table for `acc-admin`. The middle tier — org/account view + org-user add + account-edit, but **explicit deny** on services, profile-edit, password/IPs/quota, and contracts. Cannot edit acc-owner.

# Capability · acc-admin

## Allowed
- ✅ Org-hierarchy view
- ✅ Account view + edit
- ✅ Organization view + add
- ✅ Org-user add (NOT account-user — that's owner-only)
- ✅ Account-settings view, Org-settings view, Users view
- ✅ Contact-group view + create + share + (own-only) edit/delete

## Explicit denies (NOT silent — actively blocked)
- ❌ `acc.services.*` (view / payment / disable)
- ❌ `acc.account-profile.edit`
- ❌ `acc.account-password-security-level.view + edit`
- ❌ `acc.account-allowed-ips.view + edit`
- ❌ `acc.account-quota.view + edit`
- ❌ `acc.contract.view`

## Role-edit reach
- ✅ acc-admin → acc-admin or acc-user
- ✅ acc-user → acc-admin or acc-user
- ❌ Cannot touch acc-owner or any sys-*

## Drill into Brain Outputs

[Full capability map → acc-admin.capability.md](../_mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/acc-admin.capability.md)

## See also

- [[Capability-acc-owner]] · [[Capability-acc-user]] — peer Client roles
- [[Roles]] · [[PES-Keys]] · [[Falcon-vs-Client]]
