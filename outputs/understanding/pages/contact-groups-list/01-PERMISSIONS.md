*** Contact Groups List — Permissions ***
*** 9 PES checks · 2026-05-18 ***

# Contact Groups List — Permissions

## Route guards

- `authGuard`
- `adminConsoleGuard` (parent) → `FalconAccess.adminConsole.enter()`
- Feature-level: `FalconAccess.contactGroups.list()`

## 9 PES queries used

[CODE] `Brain Outputs/datasets/old-ui-dataset/10-pages/admin-console/contact-groups/05-PES.md`:

| PES key | Used for | Effect |
|---|---|---|
| `FalconAccess.contactGroups.list()` | Route guard | Page entry |
| `FalconAccess.contactGroups.viewShared()` | Show Shared tab | Hide tab if denied |
| `FalconAccess.contactGroup.view(groupId)` | Detail page entry | 403 if denied |
| `FalconAccess.contactGroup.edit(groupId)` | Edit panel access | Hide Edit button |
| `FalconAccess.contactGroup.delete(groupId)` | Delete kebab action | Hide |
| `FalconAccess.contactGroup.download(groupId)` | Download kebab action | Hide |
| `FalconAccess.contactGroup.share(groupId)` | Share panel access | Hide Share button |
| `FalconAccess.contactGroup.viewContacts(groupId)` | View Contacts pagination | Hide pagination |
| `FalconAccess.contactGroup.viewSoftDeleted()` | softDelete badge visibility | Falcon usertype only |

Plus the **row-owner overlay**: only the creator can edit/share their group ([CODE] models.ts:25 `RowActionFlags`).

## Per-role matrix

| Action | Falcon | AO (own) | AO (shared) | NA | NU |
|---|---|---|---|---|---|
| List own tab | YES (read-only) | YES | NO | YES | YES (limited) |
| List shared tab | YES | YES | YES | YES | YES |
| View detail | YES | YES | YES (shared) | per share-policy | per share-policy |
| Edit | NO (read-only) | YES (creator) | NO | per creator | per creator |
| Share | NO | YES (creator) | NO | NO | NO |
| Delete | NO | YES (creator) | NO | per PES | NO |
| Download | YES | YES | YES (shared) | per PES | per PES |

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
