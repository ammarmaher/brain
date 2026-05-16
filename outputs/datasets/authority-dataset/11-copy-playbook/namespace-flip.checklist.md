---
type: checklist
cluster: 11-copy-playbook
title: PES Namespace Flip — adminConsole.* → managementConsole.*
purpose: "Answers 'which adminConsole.* PES keys have managementConsole.* equivalents + which must be dropped or replaced with row-level checks'. Open during Step 3 of the 12-step port recipe."
extracted: 2026-05-16
---

# Checklist · PES Namespace Flip (Step 3)

> [!tldr]
> Search/replace `FalconAccess.adminConsole.X` → `FalconAccess.managementConsole.X` across the copied feature. Not every admin key has an mgmt counterpart — keys with NO counterpart must be dropped or replaced with row-level / server-driven checks. Verify with `grep` after the flip.

## Search/replace patterns

The PES factory namespaces live at `[CODE] libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts`. The two namespaces have **different cardinality**: admin has ~21 feature-scoped factories; mgmt has ~14 (drops wallet, master-wallet, account-add, root-level password / IP / quota).

### 1:1 maps (safe regex flip)

| Admin pattern | Mgmt pattern | Resource flip |
|---|---|---|
| `FalconAccess.adminConsole.enter()` | `FalconAccess.managementConsole.enter()` | `app.admin-console` → `app.management-console` |
| `FalconAccess.adminConsole.services.view()` | `FalconAccess.managementConsole.services.view()` | `sys.services` → `acc.services` |
| `FalconAccess.adminConsole.services.payment()` | `FalconAccess.managementConsole.services.payment()` | same resource flip |
| `FalconAccess.adminConsole.users.<action>()` | `FalconAccess.managementConsole.users.<action>()` | `sys.user` → `acc.user` |
| `FalconAccess.adminConsole.org.<action>()` | `FalconAccess.managementConsole.org.<action>()` | `sys.org-hierarchy` → `acc.org-hierarchy` |
| `FalconAccess.adminConsole.hierarchy.view()` | `FalconAccess.managementConsole.hierarchy.view()` | `sys.acc-hierarchy` → `acc.acc-hierarchy` |
| `FalconAccess.adminConsole.account.view()` | `FalconAccess.managementConsole.account.view()` | `sys.account` → `acc.account` |
| `FalconAccess.adminConsole.accountProfile.<action>()` | `FalconAccess.managementConsole.accountProfile.<action>()` | `sys.account-profile` → `acc.account-profile` |
| `FalconAccess.adminConsole.settings.<action>()` | `FalconAccess.managementConsole.settings.<action>()` | `sys.account-settings` → `acc.account-settings` |
| `FalconAccess.adminConsole.passwordSecurity.<action>()` | `FalconAccess.managementConsole.passwordSecurity.<action>()` | `sys.password-security-level` → `acc.password-security-level` |
| `FalconAccess.adminConsole.allowedIps.<action>()` | `FalconAccess.managementConsole.allowedIps.<action>()` | `sys.allowed-ips` → `acc.allowed-ips` |
| `FalconAccess.adminConsole.quota.<action>()` | `FalconAccess.managementConsole.quota.<action>()` | `sys.account-quota` → `acc.account-quota` |
| `FalconAccess.adminConsole.contract.<action>()` | `FalconAccess.managementConsole.contract.<action>()` | `sys.contract` → `acc.contract` |

### Regex for the safe portion

```regex
// Search (multi-file, regex):
FalconAccess\.adminConsole\.

// Replace:
FalconAccess.managementConsole.
```

After running this, manually review each hit — some calls (next section) must be **deleted**, not flipped.

## Keys that have NO mgmt counterpart

Drop the call or replace it. Citations to `[CODE] libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` (positions vary by version) and to feature compare notes where the gap was observed.

| Admin-only key | Why no mgmt equivalent | Replacement strategy |
|---|---|---|
| `FalconAccess.adminConsole.wallet.transfer()` (`sys.wallet`) | Mgmt has no `acc.wallet.transfer` feature key — wallet transfer is server-gated via `IWalletDataResponse.canSave` instead | `[CODE] wallet-balance-management.compare.md:152` says: replace `canTransferWallet` references with constant `true`; gate Save button on server-driven `canSave` |
| `FalconAccess.adminConsole.walletStrategy.view()` (`sys.wallet-strategy`) | No `acc.wallet-strategy` resource | Replace `canViewWalletStrategy` with constant `true`; UI gates via `canSave` |
| `FalconAccess.adminConsole.walletStrategy.edit()` (`sys.wallet-strategy`) | Same | Same — `canEditWalletStrategy` → constant `true`, then `isSettingsDisabled = !canSave` |
| `FalconAccess.adminConsole.masterWallet.view()` (`sys.master-wallet`) | Master Wallet is Falcon-only — drop entirely | Delete `canViewMasterWallet` field + `primeAccess()` query + entire `*ngIf="canViewMasterWallet"` block |
| `FalconAccess.adminConsole.account.add()` (`sys.account/add`) | Clients don't create clients (5-step Add Client wizard is Falcon-only) | Drop the Add Client button + wizard entry-point |
| `FalconAccess.adminConsole.rootPasswordSecurityLevel.<action>()` | Falcon-root-only — applies to the synthetic Falcon root | Drop the root-level settings surface; mgmt has no synthetic root |
| `FalconAccess.adminConsole.rootAllowedIps.<action>()` | Same — root-level allowlist | Same |
| `FalconAccess.adminConsole.accountPasswordSecurityLevel.edit()` (no `acc` counterpart) | Mgmt does have `acc.password-security-level.view/edit`, but NOT the cross-account edit | Use `FalconAccess.managementConsole.passwordSecurity.edit()` for own account; drop cross-account |
| `FalconAccess.adminConsole.services.editPriceType()` (`sys.services/edit-price-type`) | Mgmt clients don't set their own service prices | Drop `EditPriceType` row action + handler + `canEditPriceType` flag |
| `FalconAccess.adminConsole.services.editPriceValue()` (`sys.services/edit-price-value`) | Same | Same |
| `FalconAccess.adminConsole.services.visibility()` (`sys.services/visibility`) | Falcon staff control service visibility per tenant — clients don't | Drop `Disable` / `Enable` row actions + `canManageVisibility` flag; replaced by `acc.services.disable()` for owner-only disable |

## Edge case: `contactGroup` keys (scope arg, not factory swap)

`contact-groups` is the only feature in the platform whose PES namespace is shared via a **scope arg**. The same TypeScript factory produces `sys.contact-group/*` keys for admin-console callers and `acc.contact-group/*` keys for mgmt-console callers.

`[CODE] contact-groups.compare.md:79-89`:

```typescript
contactGroup: {
  view:              (scope) => contactGroupQuery('view', scope),
  create:            (scope) => contactGroupQuery('create', scope),
  edit:              (scope) => contactGroupQuery('edit', scope),
  share:             (scope) => contactGroupQuery('share', scope),
  shareOther:        (scope) => contactGroupQuery('share-other', scope),
  delete:            (scope) => contactGroupQuery('delete', scope),
  downloadValidated: (scope) => contactGroupQuery('download', scope),
  downloadOriginal:  (scope) => contactGroupQuery('download-original', scope),
}
```

**Flip strategy:** search for `FalconAccess.contactGroup.<action>('sys')` and replace with `FalconAccess.contactGroup.<action>('acc')`. The factory name doesn't change — only the scope string.

```regex
// Search:
FalconAccess\.contactGroup\.(\w+)\('sys'\)

// Replace:
FalconAccess.contactGroup.$1('acc')
```

**Asymmetry note**: `FalconAccess.contactGroups.viewShared()` (plural `contactGroups`) always returns `acc.contact-group/view-shared` regardless of console — there is no `sys.contact-group/view-shared` rule, so the call always silent-denies on admin-side. Leave it as-is when porting both directions. `[CODE] contact-groups.compare.md:114`.

## Verification

After flipping, run:

```bash
# Should return ZERO hits in apps/management-console/
grep -r "FalconAccess.adminConsole" apps/management-console/

# Should return ZERO hits in apps/admin-console/
grep -r "FalconAccess.managementConsole" apps/admin-console/

# Should return ZERO hits in apps/management-console/ for contact-group sys scope
grep -r "FalconAccess.contactGroup.\w\+('sys')" apps/management-console/
```

Any non-zero result is an unflipped call. Either flip it (1:1 maps) or delete it (no-counterpart keys).

## Common mistakes

1. **Forgetting `enter()`** — `FalconAccess.adminConsole.enter()` is wired into the app's root guard (`adminConsoleGuard` reads `app.admin-console / view`). The mgmt analog is `FalconAccess.managementConsole.enter()` → `app.management-console / view`. This is rarely in the copied component code (lives in `app.routes.ts`), but worth checking.
2. **Flipping `wallet.transfer` instead of dropping** — there is no `FalconAccess.managementConsole.wallet.transfer()` factory. The flip will fail at compile time. Drop and use server-driven `canSave` instead. `[CODE] wallet-balance-management.compare.md:152`.
3. **Flipping `masterWallet.view` instead of dropping** — same reason. Master Wallet UI block must be removed entirely.
4. **Leaving an `Object.assign(this, await this.accessControlFacade.resolveFlags({...}))` block** — `[CODE] comms-hub.compare.md:150` says mgmt-side typically drops the entire `primeAccess()` method. Component-level PES resolution is rare on mgmt; the route-level `data.access` + backend `row.allowedActions` is the standard pattern.
5. **Flipping `contactGroups.viewShared()`** — the registry entry always resolves to `acc.contact-group/view-shared` regardless of caller. There is no `'sys'` scope arg version. Leave it alone; admin-side will silently never see the Shared tab.

## Cross-references

- [`copy-admin-feature-to-mgmt.md`](copy-admin-feature-to-mgmt.md) — full 12-step recipe (this is Step 3)
- [`../03-pes-keys/REGISTRY-RAW.md`](../03-pes-keys/REGISTRY-RAW.md) — the 47 PES key factories
- [CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` — registry source
- `[CODE] wallet-balance-management.compare.md:151-152` — concrete drop-not-flip cases
- `[CODE] contact-groups.compare.md:79-114` — scope-arg pattern
