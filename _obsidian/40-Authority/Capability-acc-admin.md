---
type: capability-map
cluster: 40-Authority
role: acc-admin
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\acc-admin.capability.md
verified-at: 2026-05-16
purpose: "Answers 'what can acc-admin do/not do (middle-tier: org+account view+add but explicit deny on services/profile/contracts)'. Open when implementing or auditing Node-Admin features."
---

> [!tldr]
> ~60-row table for `acc-admin`. Middle tier. Org/account view + org-user add + account-edit — but **explicit deny** on services, profile-edit, password/IPs/quota, contracts. Cannot edit acc-owner.

# Capability · acc-admin

## Allowed
- ✅ Org-hierarchy view · Account view+edit · Organization view+add
- ✅ Add org-user (NOT account-user)
- ✅ Settings view (account + org) · Users view
- ✅ Contact-group view/create/share + own-only edit/delete

## Explicit denies (not silent — actively blocked)
- ❌ All services actions · account-profile edit
- ❌ Password security view+edit · IPs view+edit · Quota view+edit
- ❌ Contract view

## Role-edit reach
- ✅ acc-admin → {acc-admin, acc-user}
- ✅ acc-user → {acc-admin, acc-user}
- ❌ Cannot touch acc-owner

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\acc-admin.capability.md`

## See also
- [[Capability-acc-owner]] · [[Capability-acc-user]] · [[Roles]] · [[PES-Keys]]
