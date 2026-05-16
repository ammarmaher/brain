# PES — account-administration

## Permission keys used (`FalconAccess.managementConsole.*`)

### Route guard
| Key path | Where checked | File:line |
|---|---|---|
| `FalconAccess.managementConsole.accountHierarchy.view()` | `data.access` consumed by `shellAccessGuard` | `routes.ts:13` |

### Container (OrganizationHierarchyComponent.primeAccess)
| Key path | Maps to flag | File:line |
|---|---|---|
| `FalconAccess.managementConsole.account.view()` | `canViewAccount` | `organization-hierarchy.component.ts:546` |
| `FalconAccess.managementConsole.organization.view()` | `canViewOrganization` | `organization-hierarchy.component.ts:547` |
| `FalconAccess.managementConsole.organization.add()` | `canAddOrganization` | `organization-hierarchy.component.ts:548` |
| `FalconAccess.managementConsole.accountUser.add()` | `canAddAccountUser` | `organization-hierarchy.component.ts:549` |
| `FalconAccess.managementConsole.orgUser.add()` | `canAddOrgUser` | `organization-hierarchy.component.ts:550` |
| `FalconAccess.managementConsole.account.edit()` | `canEditAccount` | `organization-hierarchy.component.ts:551` |
| `FalconAccess.managementConsole.services.view()` | `canViewServices` | `organization-hierarchy.component.ts:552` |
| `FalconAccess.managementConsole.accountSettings.view()` | `canViewAccountSettings` | `organization-hierarchy.component.ts:553` |
| `FalconAccess.managementConsole.orgSettings.view()` | `canViewOrgSettings` | `organization-hierarchy.component.ts:554` |
| `FalconAccess.managementConsole.users.view()` | `canViewUsers` | `organization-hierarchy.component.ts:555` |

### Settings tab (NodeSettingsTabComponent.ensureAccess)
| Key path | Maps to flag | File:line |
|---|---|---|
| `FalconAccess.managementConsole.accountSettings.view()` | `canViewAccountSettings` | `node-settings-tab.component.ts:369` |
| `FalconAccess.managementConsole.orgSettings.view()` | `canViewOrgSettings` | `node-settings-tab.component.ts:370` |
| `FalconAccess.managementConsole.accountPasswordSecurityLevel.view()` | `canViewAccountPasswordSecurityLevel` | `node-settings-tab.component.ts:371` |
| `FalconAccess.managementConsole.accountPasswordSecurityLevel.edit()` | `canEditAccountPasswordSecurityLevel` | `node-settings-tab.component.ts:372` |
| `FalconAccess.managementConsole.accountAllowedIps.view()` | `canViewAccountAllowedIps` | `node-settings-tab.component.ts:373` |
| `FalconAccess.managementConsole.accountAllowedIps.edit()` | `canEditAccountAllowedIps` | `node-settings-tab.component.ts:374` |
| `FalconAccess.managementConsole.accountQuota.view()` | `canViewAccountQuota` | `node-settings-tab.component.ts:375` |
| `FalconAccess.managementConsole.accountQuota.edit()` | `canEditAccountQuota` | `node-settings-tab.component.ts:376` |

### Apps & CommChannels tabs (primeAccess in both tabs)
| Key path | Maps to flag | File:line |
|---|---|---|
| `FalconAccess.managementConsole.services.payment()` | `canDoPayments` | `comm-channels-services-tab.component.ts:886` & `apps-services-tab.component.ts:1030` |
| `FalconAccess.managementConsole.services.disable()` | `canManageServices` (Enable+Disable+Visibility) | `comm-channels-services-tab.component.ts:887` & `apps-services-tab.component.ts:1031` |

## AccessControlFacade usage

Service: `AccessControlFacade` from `@falcon` (resolves via library — fed by PES API)

### Pattern — batch resolve all flags at once
The standard pattern across this feature: `resolveFlags({ flagName: FalconAccess.... })` returns an object with the same keys → boolean values, then `Object.assign(this, result)`.

```typescript
// organization-hierarchy.component.ts:544-557
private async primeAccess(): Promise<void> {
  Object.assign(this, await this.accessControlFacade.resolveFlags({
    canViewAccount:        FalconAccess.managementConsole.account.view(),
    canViewOrganization:   FalconAccess.managementConsole.organization.view(),
    canAddOrganization:    FalconAccess.managementConsole.organization.add(),
    canAddAccountUser:     FalconAccess.managementConsole.accountUser.add(),
    canAddOrgUser:         FalconAccess.managementConsole.orgUser.add(),
    canEditAccount:        FalconAccess.managementConsole.account.edit(),
    canViewServices:       FalconAccess.managementConsole.services.view(),
    canViewAccountSettings:FalconAccess.managementConsole.accountSettings.view(),
    canViewOrgSettings:    FalconAccess.managementConsole.orgSettings.view(),
    canViewUsers:          FalconAccess.managementConsole.users.view(),
  }));
  // ... derives allowedTreeActions + tabsConfig from flags
}
```

### Derived tree-actions array
```typescript
// organization-hierarchy.component.ts:558-561
this.allowedTreeActions = [
  ...(this.canAddOrganization ? ['add-node'] : []),
  ...((this.canAddAccountUser || this.canAddOrgUser) ? ['add-user'] : []),
];
```
Passed to `<falcon-organization-hierarchy-tree [allowedActions]="allowedTreeActions">` — the tree component hides context-menu items not in the array.

### Conditional tab enable
```typescript
// organization-hierarchy.component.ts:571-602 (excerpt)
this.tabsConfig = [
  { ..., enabled: true },  // Hierarchy — always
  { ..., enabled: isRootSelection && this.canViewServices }, // CommChannels
  { ..., enabled: isRootSelection && this.canViewServices }, // Apps
  { ..., enabled: isRootSelection ? this.canViewAccountSettings : this.canViewOrgSettings },
];
```

### Per-node user-add resolution (root vs child)
```typescript
// organization-hierarchy.component.ts:729-737
private canAddUserForNode(nodeId: string | null): boolean {
  const targetNode = ...;
  return this.isRootSelection(targetNode) ? this.canAddAccountUser : this.canAddOrgUser;
}
```

## Route guards

### App-level: `managementConsoleGuard`
Applied to every route in `app.routes.ts:13`. Source in `@falcon`. Validates the session has access to management-console (user-type / context check).

### Route-level: `shellAccessGuard`
Applied to organization-hierarchy route. Reads `route.data.access = FalconAccess.managementConsole.accountHierarchy.view()` and validates via `AccessControlFacade`. Redirects unauthorized users.

## Eligibility / Subscription checks
- **User-type checks** — `SessionProvider.session.userType === USER_TYPE_STRINGS.FALCON_USER` controls:
  - Whether to skip the root-API call and use `FALCON_ROOT_NODE` sentinel (`organization-hierarchy.component.ts:138`, `213-217`)
  - Whether visibility column appears in apps/commChannels tabs (`apps-services-tab.component.ts:644-661` — only Falcon users see/toggle visibility)
  - Whether the InformationComponent shows/edits "Account Information" section (`information.component.ts:364-372`)
- **No subscription gating** detected in this feature — it relies entirely on PBAC flags.

## Permission namespace summary
Every PBAC key in this feature uses `FalconAccess.managementConsole.*` (vs `FalconAccess.adminConsole.*` in admin-console). **28 distinct keys** are referenced.
