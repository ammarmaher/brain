---
type: capability-map
cluster: 100-Authority
role: acc-user
projection-source: _mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/acc-user.capability.md
verified-at: 2026-05-16
purpose: "Answers 'why acc-user is contact-groups-only + has the unique view-shared permission + cannot edit any role'. Open before rendering anything in mgmt-console for this role."
---

> [!tldr]
> ~60-row table for `acc-user`. The minimum-privilege role — contact-groups only. Has the unique `acc.contact-group.view-shared` permission. Cannot edit ANY role (including self).

# Capability · acc-user

## Allowed (contact groups only)
- ✅ View contact-groups
- ✅ Create contact-groups
- ✅ Edit own contact-group (expression: `r.obj.createdby == r.sub.userid`)
- ✅ Delete own contact-group (same expression)
- ✅ Share own contact-group (same expression — tighter than acc-admin/acc-owner)
- ✅ Download / Download-original
- ✅ **View-shared (`acc.contact-group.view-shared`) — UNIQUE to acc-user**

## Explicit denies (most rows)
- ❌ Org-hierarchy view
- ❌ Account view / edit
- ❌ Organization view / add
- ❌ All services / payment / disable
- ❌ All settings (account / org)
- ❌ Users view
- ❌ Account-profile / password-security / IPs / quota
- ❌ Contract view
- ❌ Land on admin-console

## Role-edit reach
- ❌ NOTHING — every target empty in BuiltInRoleCatalog.cs:66-74

## Drill into Brain Outputs

[Full capability map → acc-user.capability.md](../_mounts/brain-outputs/datasets/authority-dataset/05-capability-maps/acc-user.capability.md)

## See also

- [[Capability-acc-owner]] · [[Capability-acc-admin]] — peer Client roles
- [[Roles]] · [[PES-Keys]] · [[Falcon-vs-Client]]
