---
type: feature-compare
feature: wallet-balance-management
purpose: "Answers 'why is master-wallet + cross-account tree-picker Falcon-only + how does Client side route the transfer call through ChargingGateway'. Open before touching wallet/transfer UI."
admin-side-app: admin-console
admin-side-route: /wallet-balance-management
admin-side-gateway: SystemGateway
mgmt-side-app: management-console
mgmt-side-route: /wallet-balance-management
mgmt-side-gateway: CoreGateway
falcon-only: false
falcon-mostly: true
client-only: false
shared: true
pes-keys-admin:
  - app.admin-console / view
  - sys.wallet-strategy / view
  - sys.wallet-strategy / edit
  - sys.master-wallet / view
  - sys.wallet / transfer
pes-keys-mgmt:
  - app.management-console / view
  - (none feature-scoped — server-driven `canSave` only)
extracted: 2026-05-16
---

# Feature compare · wallet-balance-management

> [!tldr]
> Wallet strategy + balance + transfer surface, mounted on both consoles. **Power asymmetry is large: Falcon side owns the master wallet, balance distribution strategy, and inter-wallet transfer; Client side can only configure its own account's wallet strategy and trigger transfers — there is no master-wallet view and no cross-account picker.** Routing path is identical (`/wallet-balance-management`); behind the scenes admin-console hits System Gateway → Commerce+Charging while management-console hits Core Gateway → Commerce, with an explicit `useGateway(Gateway.ChargingGateway)` override on the transfer call.

## At a glance

| Aspect | Falcon (admin-console) | Client (management-console) | Notes |
|---|---|---|---|
| App | `admin-console` (:4204) | `management-console` (:4301) | Both are Module-Federation remotes |
| Route slug | `/wallet-balance-management` | `/wallet-balance-management` | Identical URL |
| Default gateway | `Gateway.SystemGateway` (:7256) | `Gateway.CoreGateway` (:7038) | `[CODE] apps/admin-console/src/app/app.config.ts:52` vs the mgmt default |
| Account selection | Org-hierarchy tree picker — Falcon admin can choose ANY account | **Hardcoded to `session.tenantId \|\| session.client_id`** — Client user can only configure own account | `[BRAIN-OUT] old-ui-dataset/.../wallet-balance-management.diff.md:17-29` |
| Master Wallet card | ✅ Shown when `canViewMasterWallet` (resource `sys.master-wallet`) | ❌ **No equivalent — `sys.master-wallet` is Falcon-only** | `[CODE] falcon-access.registry.ts:127` (sys-only namespace) |
| Inter-wallet transfer | ✅ Master ↔ CommChannel ↔ Node/User; gated by `sys.wallet / transfer` | ✅ But only within Client's own account scope; **no PES key** — server-driven `canSave` only | `[BRAIN-OUT] wallet-balance-management.diff.md:62-78` |
| Transfer endpoint gateway | `charging/wallet/transfer` via default System Gateway | `wallet/transfer` via **explicit `useGateway(Gateway.ChargingGateway)`** — one of the only places mgmt-console overrides | `[CODE] admin-console/.../wallet-balance.service.ts:64` vs `management-console/.../wallet-balance.service.ts:62-65` |
| Route-level PES gate | `shellAccessGuard` declared but **no `data.access` set** → no-op | **No `shellAccessGuard` at all** — app-level guard only | `[CODE] features/routes.ts:53-61` (admin) ; `[BRAIN-OUT] wallet-balance-management.diff.md:6-13` (mgmt) |
| Save account-id | Selected tree node ID | Resolved through `accountInfo.accountId ?? session.tenantId ?? session.client_id ?? …` — always the **main account**, never a child node | `[BRAIN-OUT] wallet-balance-management.diff.md:107-121` |

## Per-role capability

> Source: `[CODE] BuiltInRoleCatalog.cs:85-290` extracted into `[BRAIN-OUT] authority-dataset/01-roles/*.md`.

| Role | View master wallet | View wallet strategy | Edit wallet strategy | Transfer between wallets | Cross-account scope | App entry |
|---|---|---|---|---|---|---|
| `sys-admin` | ✅ allow | ✅ allow | ✅ allow | ✅ allow | ✅ any account (tree picker) | admin-console |
| `sys-ops` | ❌ silent deny | ❌ silent deny | ❌ silent deny | ❌ silent deny | ✅ tree visible (`sys.acc-hierarchy.view`), but every wallet action denied | admin-console |
| `sys-products` | ✅ allow | ✅ allow | ✅ allow | ✅ allow | ✅ any account (tree picker) | admin-console |
| `acc-owner` | ❌ resource doesn't exist in `acc.*` | ❌ no feature PES — server-driven `canSave` | ❌ same — server-driven | ✅ within own account only | ❌ own account only (hardcoded) | management-console |
| `acc-admin` | ❌ | ❌ | ❌ | ❌ | ❌ | management-console |
| `acc-user` | ❌ | ❌ | ❌ | ❌ | ❌ | management-console |

### Notes on the per-role table

- `sys-ops` lands on the page (app-level `app.admin-console.view` = allow + parent route guard passes) but **every PES flag resolves to false** — so the page renders the tree, the Master Wallet card is hidden, the Settings card is hidden, the Save button is hidden, and per-row Transfer buttons are `disabled`. The page becomes effectively a read-only tree browser. `[CODE] BuiltInRoleCatalog.cs:118-134` confirms no rule for `sys.master-wallet`, `sys.wallet-strategy`, `sys.wallet`.
- For Client roles the *feature PES universe is empty* — there is no `managementConsole.walletStrategy.*` or `managementConsole.wallet.transfer` in the registry. `[CODE] falcon-access.registry.ts:36-88` (managementConsole namespace) confirms only entry, hierarchy, account, org, services, settings, users, account-profile, password-security, IPs, quota, contract, and contact-group keys exist — **no wallet keys at all**. Mgmt-console relies entirely on (1) the parent `managementConsoleGuard` and (2) the server-driven `canSave: boolean` field in the wallet hierarchy response.

## PES keys consumed

### Admin side (Falcon)

| Key | Resolves to | File:line |
|---|---|---|
| `FalconAccess.adminConsole.enter()` | `{ action: 'view', resource: 'app.admin-console' }` | `[CODE] libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:90`; consumed at `[CODE] apps/admin-console/src/app/app.routes.ts:8` |
| `FalconAccess.adminConsole.walletStrategy.view()` | `{ action: 'view', resource: 'sys.wallet-strategy' }` | `[CODE] falcon-access.registry.ts:123`; consumed at `[CODE] apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.ts:878` |
| `FalconAccess.adminConsole.walletStrategy.edit()` | `{ action: 'edit', resource: 'sys.wallet-strategy' }` | `[CODE] falcon-access.registry.ts:124`; consumed at `[CODE] wallet-balance-management.component.ts:879` |
| `FalconAccess.adminConsole.masterWallet.view()` | `{ action: 'view', resource: 'sys.master-wallet' }` | `[CODE] falcon-access.registry.ts:127`; consumed at `[CODE] wallet-balance-management.component.ts:880` |
| `FalconAccess.adminConsole.wallet.transfer()` | `{ action: 'transfer', resource: 'sys.wallet' }` | `[CODE] falcon-access.registry.ts:130`; consumed at `[CODE] wallet-balance-management.component.ts:881` |

Resolution pattern (verbatim from `[CODE] wallet-balance-management.component.ts:876-884`):

```typescript
private async primeAccess(): Promise<void> {
  Object.assign(this, await this.accessControlFacade.resolveFlags({
    canViewWalletStrategy: FalconAccess.adminConsole.walletStrategy.view(),
    canEditWalletStrategy: FalconAccess.adminConsole.walletStrategy.edit(),
    canViewMasterWallet:   FalconAccess.adminConsole.masterWallet.view(),
    canTransferWallet:     FalconAccess.adminConsole.wallet.transfer(),
  }));
  this.cdr.markForCheck();
}
```

### Mgmt side (Client)

| Key | Resolves to | File:line |
|---|---|---|
| `FalconAccess.managementConsole.enter()` | `{ action: 'view', resource: 'app.management-console' }` | `[CODE] falcon-access.registry.ts:37`; consumed by app-level `managementConsoleGuard` |
| (no feature-scoped keys) | — | The Client wallet page **has no `data.access` declaration and no `AccessControlFacade.resolveFlags` call**. `[BRAIN-OUT] wallet-balance-management.diff.md:87-99` documents this gap. The only fine-grained gating is the server-driven `IWalletDataResponse.canSave` field at `[CODE] wallet-balance.models.ts:206`. |

### Per-button gating (admin side only — mgmt mirrors the same UI shape but with all PES flags effectively `false`)

| UI surface | Gate | File:line |
|---|---|---|
| Master Wallet card | `*ngIf="canViewMasterWallet"` | `[CODE] wallet-balance-management.component.html:197` |
| Master Wallet transfer icon | `[disabled]="!canDoActions \|\| !canTransferWallet"` | `[CODE] wallet-balance-management.component.html:204` |
| Settings card (currency/distribution/structure) | `*ngIf="canViewWalletStrategy \|\| canEditWalletStrategy"`; inputs `[disabled]="isSettingsDisabled"` | `[CODE] wallet-balance-management.component.html:239, 250, 271, 292` |
| Save button | `*ngIf="isSaveEnabled"` (= `canEditWalletStrategy && canSave`) + early-return at `[CODE] wallet-balance-management.component.ts:434-437` | `[CODE] wallet-balance-management.component.html:180-188` |
| Per-row Transfer button | `[disabled]="!isCellEditable(node.data) \|\| !canTransferWallet"` | `[CODE] wallet-balance-management.component.html:428` |
| Transfer submit | `onTransferSubmit()` early-return `!canTransferWallet` | `[CODE] wallet-balance-management.component.ts:495-498` |
| Master Wallet click | requires `isFalconUser` **AND** `canTransferWallet` | `[CODE] wallet-balance-management.component.ts:479-482` |

## Differences

> Full per-section diff: `[BRAIN-OUT] old-ui-dataset/10-pages/management-console/_diffs/wallet-balance-management.diff.md`.

### Routing (`[BRAIN-OUT] wallet-balance-management.diff.md:6-13`)
- Both apps use the same URL slug.
- Admin: `loadComponent` lazy + `canActivate: [shellAccessGuard]` (data-less → no-op) + parent `adminConsoleGuard`.
- Mgmt: synchronous `component:` ref + **no `shellAccessGuard`** + parent `managementConsoleGuard`.

### Component shape (`[BRAIN-OUT] wallet-balance-management.diff.md:14-46`)
- Admin owns the tree picker (`<falcon-organization-hierarchy-tree>` + `OrgHierarchyApiService`) for cross-account selection.
- Mgmt has **no tree** — `selectedOrgNodeId` is wired from the session in `initializeAccountContext()` at `[CODE] management-console/.../wallet-balance-management.component.ts:381-400`.
- Mgmt's `BalanceTransferComponent` is a clean component-folder extraction; admin's transfer UI is in the same folder but the drawer component is similar in shape.
- Both share the draft/snapshot pattern, currency / distribution / structure selectors, and the per-cell editable table.

### Service / API endpoints

| Operation | Admin (System Gateway → Commerce/Charging) | Mgmt (Core Gateway → Commerce/Charging) |
|---|---|---|
| Read wallet hierarchy + balances + strategy + channels | `GET api/commerce/accounts/{id}/hierarchy?currency=…&balanceDistribution=…&walletStructure=…` `[CODE] admin-console/.../wallet-balance.service.ts:20-38` | Same URL — gateway swaps base host only `[BRAIN-OUT] wallet-balance-management.diff.md:48-55` |
| Save strategy | `POST commerce/setting/wallets` `[CODE] admin-console/.../wallet-balance.service.ts:43-50` | Same URL |
| Transfer | `POST charging/wallet/transfer` (default gateway) `[CODE] admin-console/.../wallet-balance.service.ts:63-68` | `POST wallet/transfer` **with explicit `useGateway(Gateway.ChargingGateway)`** `[CODE] management-console/.../wallet-balance.service.ts:60-66` |
| Tree root | `GET commerce/Node` via shared `OrgHierarchyApiService` | Not called (no tree) |
| Tree children | `GET commerce/Node?NodeId={parentId}` | Not called |

The `[BRAIN-OUT] wallet-balance-management.diff.md:62-78` comment explains the gateway split for transfer: mgmt-console is the only mgmt route that bypasses its app-default gateway in favor of an explicit one.

### DTOs (`[BRAIN-OUT] wallet-balance-management.diff.md:80-86`)
- `IWalletQuery`, `IWalletDataResponse`, `ISaveBalancesRequest`, `IBalanceChange`, `IBalanceNode`, `IChannel`, `IChannelBalance`, `IWalletAccountInfo`, `IWalletSummary`, `IWalletChannelBalance` — **identical in both apps**.
- `ITransferRequest`, `ITransferResponse`, `ITransferContext`, `ITransferEntity`, `ITransferEndpoint`, `ITransferWallet` — **identical in both apps**, both at `models/transfer.models.ts`.
- Enums `Currency`, `WalletBalanceType`, `WalletType`, `NodeType`, `TransferMode`, `EntityType`, `TransferEntityType`, `TransferErrorCode` — **identical in both apps**.
- Verbatim DTO definitions: `[BRAIN-OUT] old-ui-dataset/10-pages/admin-console/wallet-balance-management/04-DTOS.md`.

### Gateway routing
- Admin: app-default `Gateway.SystemGateway` set at `[CODE] apps/admin-console/src/app/app.config.ts:52` via `provideAppDefaultGateway(Gateway.SystemGateway)`. All endpoints inherit through arg-less `useGateway()`.
- Mgmt: app-default `Gateway.CoreGateway`. Transfer call overrides to `Gateway.ChargingGateway` explicitly.
- Gateway resolution mechanism: `[CODE] libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts:128-137` (`useGateway()`) + `[CODE] runtime-base-url.interceptor.ts:29-39` (interceptor reads `USE_GATEWAY_CONTEXT` + optional `SPECIFIC_GATEWAY_CONTEXT`).

## What changes when copying admin → mgmt

If you take the admin-console `wallet-balance-management` and port it to mgmt-console, these are the concrete edits:

1. **Drop the tree picker.** Remove `<falcon-organization-hierarchy-tree>` from the template; remove `OrgHierarchyApiService` + `loadRoot()` + `loadChildren()` + tree state fields. Replace with the mgmt-style `initializeAccountContext()` at `[CODE] management-console/.../wallet-balance-management.component.ts:381-400` that pins the account from `session.tenantId \|\| session.client_id`.
2. **Drop the Master Wallet card.** `sys.master-wallet` does not exist on the Client side — there is no `acc.master-wallet` resource in `[CODE] falcon-access.registry.ts:36-88`. Remove `canViewMasterWallet` field + `primeAccess()` query + the entire `*ngIf="canViewMasterWallet"` block in the HTML (lines around `:197` in admin) + Master Wallet transfer icon (line `:204`) + `onMasterWalletTransferClick()` handler.
3. **Replace `FalconAccess.adminConsole.*` keys with — nothing.** The mgmt side has no feature-scoped PES keys for wallet. Delete the `primeAccess()` call entirely. Replace all `canViewWalletStrategy / canEditWalletStrategy / canTransferWallet` references with constant `true` (the page is gated app-level only), then re-introduce the server-driven `canSave` from `IWalletDataResponse.canSave` as the sole runtime guard. **Recommendation:** add new PES keys `managementConsole.walletStrategy.{view,edit}` + `managementConsole.wallet.transfer` in the registry rather than leaving the page unprotected.
4. **Flip the app-default gateway.** Remove `provideAppDefaultGateway(Gateway.SystemGateway)` if you copied `app.config.ts`. The mgmt app is configured with `Gateway.CoreGateway` as its default elsewhere.
5. **Add the Charging Gateway override on transfer.** Change `POST charging/wallet/transfer` (admin) to `POST wallet/transfer` with `useGateway(Gateway.ChargingGateway)` explicitly — see verbatim shape at `[CODE] management-console/.../wallet-balance.service.ts:60-66` quoted in `[BRAIN-OUT] wallet-balance-management.diff.md:71-78`.
6. **Fix the account-ID resolution for save.** The mgmt-side `saveChanges` must use the **main account ID** not whichever child node was viewed. Copy the `resolveSelectedAccountId()` helper at `[CODE] management-console/.../wallet-balance-management.component.ts:710-721`.
7. **Drop the `shellAccessGuard` route declaration** (or keep it data-less — same effect). Mgmt route does not declare it; rely entirely on app-level `managementConsoleGuard`.
8. **Endpoints that simply do not exist on the other side:** none — both apps hit the same Commerce + Charging URLs. Only the gateway prefix and the explicit `Gateway.ChargingGateway` override on transfer differ.

If you go the other direction — **mgmt → admin** — you instead **add** the tree picker, **add** the Master Wallet card and `sys.master-wallet.view` query, **add** all four `FalconAccess.adminConsole.*` queries to `primeAccess()`, **drop** the `Gateway.ChargingGateway` override (admin defaults to SystemGateway and uses arg-less `useGateway()` for the transfer call), and **flip** the account-id resolution back to the selected-tree-node ID.

## Cross-references

- Role notes:
  - `[BRAIN-OUT] authority-dataset/01-roles/sys-admin.md` — `sys.wallet.transfer` + `sys.master-wallet.view` + `sys.wallet-strategy.{view,edit}` all allow
  - `[BRAIN-OUT] authority-dataset/01-roles/sys-ops.md` — every wallet permission silent-denied; can still land on page
  - `[BRAIN-OUT] authority-dataset/01-roles/sys-products.md` — full wallet control (mirror of sys-admin for this feature)
  - `[BRAIN-OUT] authority-dataset/01-roles/acc-owner.md` — no feature PES; only server-driven `canSave`
  - `[BRAIN-OUT] authority-dataset/01-roles/acc-admin.md` — no wallet feature; lands on mgmt-console but nothing gates the page off because there is no PES key (server-side enforcement only)
  - `[BRAIN-OUT] authority-dataset/01-roles/acc-user.md` — no wallet feature; menu likely hidden
- PES registry: `[BRAIN-OUT] authority-dataset/03-pes-keys/REGISTRY-RAW.md` — see `adminConsole.walletStrategy.*`, `adminConsole.masterWallet.view`, `adminConsole.wallet.transfer` (lines 48-51 in registry doc); mgmt namespace has no wallet entries.
- Old-UI source: `[BRAIN-OUT] old-ui-dataset/10-pages/admin-console/wallet-balance-management/00-README.md` through `08-RULES-APPLIED.md` (8 files).
- Cross-app diff: `[BRAIN-OUT] old-ui-dataset/10-pages/management-console/_diffs/wallet-balance-management.diff.md`.
- Status notes: not directly relevant — wallet doesn't use a status enum; closest related is `[BRAIN-OUT] authority-dataset/02-statuses/service-status.md` (service-status drives the linked contracts/billing flow, which the wallet feeds).
