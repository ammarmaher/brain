# PES — organization-hierarchy

> Permission / Eligibility / Subscription gating. The page is purely PES-gated — no eligibility (feature flag) checks, no subscription-level checks beyond what `<falcon-organization-hierarchy-tree>` itself does internally. All entry points are listed below with citations.

## Permission keys consumed (13 distinct `FalconAccess.adminConsole.*` queries)

| # | Key path | Action | Resource | Where checked | File:line |
|---|---|---|---|---|---|
| 1 | `FalconAccess.adminConsole.enter()` | `view` | `app.admin-console` | `adminConsoleGuard` (root canActivate of admin-console remote) | `libs/falcon/src/core/lib/guards/admin-console.guard.ts:17` |
| 2 | `FalconAccess.adminConsole.accountHierarchy.view()` | `view` | `sys.acc-hierarchy` | `shellAccessGuard` via `route.data.access` | `apps/admin-console/src/app/features/routes.ts:20` |
| 3 | `FalconAccess.adminConsole.account.add()` | `add` | `sys.account` | `OrganizationHierarchyComponent.primeAccess` — gates `canAddAccount` → adds `'add-client'` to `allowedTreeActions` + enables `addClient()` button (`HierarchyTabComponent.onEmitAction`) | `organization-hierarchy.component.ts:599` |
| 4 | `FalconAccess.adminConsole.accountProfile.edit()` | `edit` | `sys.account-profile` | `OrganizationHierarchyComponent.primeAccess` — gates `canEditAccountProfile`; passed into `HierarchyTabComponent` to enable "Edit" button on info view | `organization-hierarchy.component.ts:600` |
| 5 | `FalconAccess.adminConsole.rootPasswordSecurityLevel.view()` | `view` | `sys.root-password-security-level` | `NodeSettingsTabComponent.ensureAccess` — gates `canViewRootPasswordSecurityLevel` for root-node settings | `node-settings-tab.component.ts:334` |
| 6 | `FalconAccess.adminConsole.rootPasswordSecurityLevel.edit()` | `edit` | `sys.root-password-security-level` | `NodeSettingsTabComponent.ensureAccess` — gates `canEditRootPasswordSecurityLevel` | `node-settings-tab.component.ts:335` |
| 7 | `FalconAccess.adminConsole.accountPasswordSecurityLevel.edit()` | `edit` | `sys.account-password-security-level` | `NodeSettingsTabComponent.ensureAccess` — gates `canEditAccountPasswordSecurityLevel` for non-root nodes | `node-settings-tab.component.ts:336` |
| 8 | `FalconAccess.adminConsole.rootAllowedIps.edit()` | `edit` | `sys.root-allowed-ips` | `NodeSettingsTabComponent.ensureAccess` — gates `canEditRootAllowedIps` | `node-settings-tab.component.ts:337` |
| 9 | `FalconAccess.adminConsole.accountAllowedIps.edit()` | `edit` | `sys.account-allowed-ips` | `NodeSettingsTabComponent.ensureAccess` — gates `canEditAccountAllowedIps` | `node-settings-tab.component.ts:338` |
| 10 | `FalconAccess.adminConsole.accountQuota.edit()` | `edit` | `sys.account-quota` | `NodeSettingsTabComponent.ensureAccess` — gates `canEditAccountQuota` | `node-settings-tab.component.ts:339` |
| 11-13 | (implicit via `<falcon-table>` row menu) `FalconAccess.adminConsole.services.payment / editPriceType / editPriceValue / visibility` | varies (`payment`, `edit-price-type`, `edit-price-value`, `visibility`) | `sys.services` | These are NOT directly invoked by `apps-services-tab` or `comm-channels-services-tab` — instead the **backend** is the source of truth: each row item carries an `allowedActions: FalconRowAction[]` array, and the tab filters the row menu via `row.allowedActions.includes(actionEnum)` (`apps-services-tab.component.ts:724-737`, `comm-channels-services-tab.component.ts:733-748`). The frontend trusts the backend's permission decision per row. | (no client-side keys; see `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:116-121`) |

> The 4 service-payment keys (#11-13) are listed in the registry for completeness, but this feature only enforces them indirectly via `row.allowedActions`. The backend computes them per row and embeds the result in the response. **New UI must preserve this contract** — do not start gating service actions client-side on the new theme.

## AccessControlFacade usage

### Service
- `AccessControlFacade` lives in `libs/falcon/src/core/lib/access-control/access-control.facade.ts` (referenced via `@falcon`).
- Used via two patterns in this feature:
  - `facade.resolveFlags({ flagName: AccessQuery, ... })` — bulk-resolves to a `{ flagName: boolean }` map. Used by `OrganizationHierarchyComponent.primeAccess` and `NodeSettingsTabComponent.ensureAccess`.
  - `facade.ensure(query)` + `facade.can(query)` — used by route guards (single-query check).

### Pattern (quote — `organization-hierarchy.component.ts:597-608`)
```typescript
private async primeAccess(): Promise<void> {
  Object.assign(this, await this.accessControlFacade.resolveFlags({
    canAddAccount: FalconAccess.adminConsole.account.add(),
    canEditAccountProfile: FalconAccess.adminConsole.accountProfile.edit(),
  }));
  this.allowedTreeActions = [
    'add-node',
    'edit-node',
    'add-user',
    ...(this.canAddAccount ? ['add-client'] : []),
  ];
}
```

### Pattern (quote — `node-settings-tab.component.ts:332-345`)
```typescript
private async ensureAccess(): Promise<void> {
  Object.assign(this, await this.accessControlFacade.resolveFlags({
    canViewRootPasswordSecurityLevel: FalconAccess.adminConsole.rootPasswordSecurityLevel.view(),
    canEditRootPasswordSecurityLevel: FalconAccess.adminConsole.rootPasswordSecurityLevel.edit(),
    canEditAccountPasswordSecurityLevel: FalconAccess.adminConsole.accountPasswordSecurityLevel.edit(),
    canEditRootAllowedIps: FalconAccess.adminConsole.rootAllowedIps.edit(),
    canEditAccountAllowedIps: FalconAccess.adminConsole.accountAllowedIps.edit(),
    canEditAccountQuota: FalconAccess.adminConsole.accountQuota.edit(),
  }));
  if (!this.canEditSelectedSettings && this.isEditingSettings) {
    this.onCancelSettings();
  }
}
```

Note: `ensureAccess` is called inside `ngOnChanges`, so the flags refresh whenever the selected node changes — this is the only place in the feature that does per-node-change permission re-evaluation.

## Route guards
- **`adminConsoleGuard`** (root canActivate) — `libs/falcon/src/core/lib/guards/admin-console.guard.ts:14-27`
  - Pulls `FalconAccess.adminConsole.enter()`.
  - On miss → `router.createUrlTree([APP_ROUTES.UNAUTHORIZED])`.
  - On exception → `router.createUrlTree([APP_ROUTES.ERROR])`.
- **`shellAccessGuard`** (per-route canActivate) — `libs/falcon/src/core/lib/access-control/shell-access.guard.ts:49-100`
  - Reads `route.data['access']` (set to `FalconAccess.adminConsole.accountHierarchy.view()` in `apps/admin-console/src/app/features/routes.ts:20`).
  - Same redirect pattern as above.

## In-component conditional gating examples

### `HierarchyTabComponent.canShow()` (`hierarchy-tab.component.ts:321-328`)
```typescript
canShow(): boolean {
  const session = this.sessionProvider.session;
  if (!session || !session.userType) return false;
  const userTypeStr = String(session.userType || '').trim();
  return (userTypeStr === USER_TYPE_STRINGS.FALCON_USER ||
          userTypeStr === USER_TYPE_STRINGS.CLIENT_USER) &&
         (this.isMainMenu) && (!this.isFalconMenu);
}
get canShowEditButton(): boolean {
  return this.mode === HierarchyTabMode.View && this.canShow() && this.canEditAccountProfile;
}
```
- The "Edit" button on the info view requires: (1) user-type is FALCON_USER or CLIENT_USER, (2) the selected node is a "main menu" / first-level node, (3) it is not the synthetic Falcon root, (4) currently in View mode, (5) `canEditAccountProfile` PES flag is true.

### `OrganizationHierarchyComponent.addClient()` (`organization-hierarchy.component.ts:503-508`)
```typescript
addClient() {
  if (!this.canAddAccount) return;
  this.showCreateClient = true;
}
```

### Onsave guards inside info view (`hierarchy-tab.component.ts:254-258`)
```typescript
onSave(form: NgForm): void {
  if (!this.canEditAccountProfile) return;
  ...
}
```

### `NodeSettingsTabComponent` UI-section getters (`node-settings-tab.component.ts:103-134`)
- `canViewPasswordSecuritySection`, `canEditPasswordSecurityLevel`, `canViewAllowedIpsSection`, `canEditAllowedIps`, `canViewQuotaSection`, `canEditSelectedSettings`
- Each composes the appropriate PES flag with `isRootSelection` (`selectedNode?.data?.isFalconNode === true`) and `isMainNodeSelection` (`selectedNode?.data?.isFirstLevelChild === true`).
- `canEditSelectedSettings` (129-134) **also requires** the node to be root OR main-node — this prevents editing settings on a 2nd-level-or-deeper sub-node. This is a business rule embedded as a PES dependency.

### Tab-visibility (not PES — node-type-based)
`TabsLayoutComponent.defaultTabsConfig` (`tabs-layout.component.ts:91-125`):
- CommChannelsServices and AppsServices tabs are `enabled: !isFalcon && isMain` — only show on main-menu non-root nodes (first-level child of root that's NOT the synthetic Falcon root).
- Hierarchy and Settings tabs are `enabled: true` always (subject to row-level gating inside).

## Eligibility / Subscription checks
**None observed.** The feature treats every node uniformly once PES + node-type checks pass.

## Hidden / unused PES references
- `FalconAccess.adminConsole.walletStrategy.view/edit`, `masterWallet.view`, `wallet.transfer`, `wallet.transferAccount` — defined in the registry but not consumed by org-hierarchy (they belong to wallet-balance-management).
- `FalconAccess.adminConsole.services.payment / editPriceType / editPriceValue / visibility` — defined in the registry; never read by client TS in this feature. Enforced server-side and surfaced via `row.allowedActions`.

## Summary count
- **Route guards using PES**: 2 (`adminConsoleGuard` + `shellAccessGuard`)
- **PES queries called from component TS**: 8 (2 in container, 6 in settings tab)
- **PES queries enforced via backend `row.allowedActions`**: 4 (apps/comm-channel services — payment, edit-price-type, edit-price-value, visibility)
- **Non-PES (node-type) gates**: 4 (`isMainMenu`, `isFalconMenu`, `isRootSelection`, `isMainNodeSelection`)
- **Session-type gates (`USER_TYPE_STRINGS`)**: 3 use sites (container, hierarchy-tab, node-settings-tab)
