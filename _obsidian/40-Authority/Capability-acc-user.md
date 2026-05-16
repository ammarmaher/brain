---
type: capability-map
cluster: 40-Authority
role: acc-user
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\acc-user.capability.md
verified-at: 2026-05-16
purpose: "Answers 'why acc-user is contact-groups-only + has the unique view-shared permission + cannot edit any role'. Open before rendering anything in mgmt-console for this role."
---

> [!tldr]
> ~60-row table for `acc-user`. Minimum-privilege role — contact-groups only. Has unique `view-shared` permission. Cannot edit any role (including self).

# Capability · acc-user

## Allowed
- ✅ Contact groups: view/create/own-edit/own-delete/own-share/download/download-original
- ✅ `view-shared` — **UNIQUE to acc-user**

## Explicit denies (most rows)
- ❌ Org-hierarchy · account · organization · services · settings · users
- ❌ Account-profile · password-security · IPs · quota · contracts
- ❌ Land on admin-console

## Role-edit reach
- ❌ NOTHING — empty matrix row in BuiltInRoleCatalog.cs:66-74

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\05-capability-maps\acc-user.capability.md`

## See also
- [[Capability-acc-owner]] · [[Capability-acc-admin]] · [[Roles]] · [[PES-Keys]]
