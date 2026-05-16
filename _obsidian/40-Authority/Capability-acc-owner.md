---
type: capability-map
cluster: 40-Authority
role: acc-owner
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\acc-owner.capability.md
verified-at: 2026-05-16
purpose: "Answers 'what unique powers acc-owner has (only acc-* with account-user.add, services, profile edit, contracts)'. Open when implementing or auditing Account-Owner features."
---

> [!tldr]
> ~62-row table for `acc-owner`. Client-side super-user. Only acc-* role with account-user creation, account-profile edit, password/IPs/quota, services view+payment+disable, and contract view.

# Capability · acc-owner

## Unique (vs other acc-*)
- ✅ Add account-user — **only acc-* role**
- ✅ Services view + payment + disable
- ✅ Account-profile edit · password-security view+edit · IPs view+edit · quota view+edit
- ✅ View contract

## Role-edit reach
- ✅ All acc-* roles
- ❌ Cannot reach any sys-*

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\acc-owner.capability.md`

## See also
- [[Capability-acc-admin]] · [[Capability-acc-user]] · [[Roles]] · [[PES-Keys]]
