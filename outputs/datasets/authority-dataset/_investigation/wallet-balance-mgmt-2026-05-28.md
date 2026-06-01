---
type: investigation
task: wallet-balance-mgmt-reskin-and-restore
created: 2026-05-28
audience: night-shift-feature run
---

# Investigation — Wallet & Balance .Mng (admin + mgmt) re-skin to T2 mockup

> [!tldr]
> The feature **already exists end-to-end on `origin/main`** for both consoles. The current branch `polishing-v0.4` has the mgmt-side intact but has **dropped admin-side wallet entirely**. The T2 mockup at `127.0.0.1:5173/T2 Falcon Admin.html` provides the new visual design with a **Falcon/Client switcher**. The work is (a) restore admin from origin/main, (b) re-skin both with T2 visual, (c) replace PrimeNG with Falcon UI Core, (d) keep BE wiring **byte-identical** to origin/main.

## 1 — State of the world (2026-05-28)

| Surface | Current branch (`polishing-v0.4`) | `origin/main` | Source |
|---|---|---|---|
| `apps/admin-console/.../wallet-balance-management/` | ❌ **MISSING — feature removed** | ✅ Full impl (10 files: component.ts/html/scss, models, services, components/balance-transfer, validations) | `[CODE] git ls-tree origin/main apps/admin-console/src/app/features` |
| `apps/management-console/.../wallet-balance-management/` | ✅ Wave-11 port (2026-05-18) — Falcon-mostly subset | ✅ Same Wave-11 port | `[CODE] mgmt component.ts:1-22` (comment header) |
| Backend `Charging` service — `WalletController` | ✅ 8 endpoints incl. `/transfer` | ✅ Same | `[BRAIN-OUT] understanding/backend/charging/ENDPOINT_REGISTRY.md:5-19` |
| Backend `Commerce` aggregator — `accounts/{id}/hierarchy` | ✅ Returns aggregated `IWalletDataResponse` (incl. server-driven `canSave`/`canTransfer`) | ✅ Same | `[CODE] origin/main wallet-balance.service.ts:20-38` |
| T2 mockup at `127.0.0.1:5173` | ✅ Reachable (HTTP 200, 5252 b) — single HTML SPA with in-page nav | n/a — design ref only | Probe: `curl -I` returned 200 |
| Feature parity matrix entry | ✅ Existing | ✅ Existing | `[BRAIN-OUT] 04-feature-parity-matrix/wallet-balance-management.compare.md` (174 lines) |

## 2 — Mockup capture summary

| Capture | Output folder | Highlights |
|---|---|---|
| Initial landing | `web-scrub/2026-05-28-0438_t2-falcon-admin-full` | Default = Org Hierarchy / Users. Sidebar shows 12 nav items incl. `Wallet & Balance .Mng`. |
| Wallet chooser screen | `web-scrub/2026-05-28-0440_t2-falcon-admin-wallet` | Two-card chooser: *Show as Falcon* (master pool, all clients) vs *Show as Client* (one-org scope). |
| Falcon view | `web-scrub/2026-05-28-0443_t2-wallet-falcon-view` | Tree (Falcon → 4 clients + BMW) · Master Wallet card (1,500,000) · `Balance Type: Node/User` · `Wallet Type: Single/Multi` · role simulator (`Viewing as` Falcon System Admin / Account Owner / Node Admin / Normal User) · `Switch perspective` button · `Edit` button · 9-row data table (Organizations · Wallet · Transfer columns). |
| Client view | `web-scrub/2026-05-28-0443_t2-wallet-client-view` | Single org context (Aramco) · Master Wallet card (1,500,000) — **mockup shows it; parity matrix says Falcon-only** · `Wallet Type: Single/Multi` · `Type: SAR/Points` selector · `Switch perspective` button · 9-row data table · NO Edit button · NO Balance Type segment · NO role simulator. |
| Source jsx + css | `web-scrub/_source-jsx/` (8 files: wallet, wallet-client, wallet-drawer, data, drawers, icons, sidebar, topbar + wallet.css) | 84.5 KB total of canonical React reference. |

## 3 — Balance Transfer Drawer — canonical structure (from mockup source)

[CODE] `web-scrub/_source-jsx/wallet-drawer.jsx:6-176` — `BalanceTransferDrawer` component.

Form fields (in order):

| # | Field | Type | Visibility | Validation |
|---|---|---|---|---|
| 1 | Source | dropdown of all wallets (Master + orgs + users) | always | required, ≠ destination |
| 2 | Source Wallet | channel select (WhatsApp/Voice/etc.) | only if `walletType === 'multiple'` AND source selected | required when shown |
| 3 | Destination | dropdown filtered to exclude source | always | required, ≠ source |
| 4 | Destination Wallet | channel select | only if `walletType === 'multiple'` AND dest selected | **locked to source channel if source ≠ Master** (cross-channel transfers forbidden — Rule B) |
| 5 | Transfer Amount | numeric input + Riyal suffix + quick-pick (25% / 50% / Max) + "Available: X" hint | always | required, > 0, ≤ source balance |
| 6 | Transfer Description | textarea (3 rows) | always | required when source OR dest is CommChannel (per `isDescriptionRequired()` helper) |

`canSave` formula: `sourceId && destId && sourceId !== destId && amountNum > 0 && amountNum <= sourceMax`.

Confirm payload (mockup): `{ sourceId, sourceCh, destId, destCh, amount, description }` — null-coalesces `__master` to `null`.

## 4 — Backend mapping (zero BE changes needed)

| FE field (drawer) | BE DTO `TransferBalanceRequest` | Source |
|---|---|---|
| `amount` (number) | `decimal Amount` | `[BRAIN-OUT] charging/DTO_DICTIONARY.md:22` |
| `currency` (default SAR) | `eCurrency Currency` (1=SAR, 2=Points) | `[BRAIN-OUT] charging/DTO_DICTIONARY.md:22` |
| `description` (textarea) | `string Description` | same |
| `sourceId` → null when Master | `Source.WalletId` (`null` = master) | `[CODE] origin/main transfer.models.ts:84-91` (`ITransferEndpoint`) |
| `sourceCh` | `Source.ChannelId` | same |
| `destId` → null when Master | `Destination.WalletId` | same |
| `destCh` | `Destination.ChannelId` | same |

| FE service call | Endpoint | Gateway | Source |
|---|---|---|---|
| `WalletBalanceService.getWalletData(query)` | `GET api/commerce/accounts/{accountId}/hierarchy?currency=&balanceDistribution=&walletStructure=` | admin: SystemGateway (default arg-less `useGateway()`); mgmt: CoreGateway (default arg-less `useGateway()`) | `[CODE] origin/main admin wallet-balance.service.ts:18-38` + `[CODE] mgmt wallet-balance.service.ts:62-87` |
| `WalletBalanceService.saveChanges(req)` | `POST commerce/setting/wallets` | admin: SystemGateway; mgmt: CoreGateway | `[CODE] origin/main admin wallet-balance.service.ts:43-50` |
| `WalletBalanceService.transfer(req)` | admin: `POST charging/wallet/transfer` (arg-less `useGateway()`); mgmt: `POST wallet/transfer` w/ **explicit `useGateway(Gateway.ChargingGateway)`** | admin: SystemGateway-routed (charging prefixed); mgmt: ChargingGateway override | `[CODE] origin/main admin wallet-balance.service.ts:63-68` + `[CODE] mgmt wallet-balance.service.ts:106-114` |

**BE controller**: `[CODE] falcon-core-charging-svc Falcon.Charging.Api WalletController.TransferBalance()` — `POST /api/Wallet/transfer` returning `ServiceOperationResult<TransferBalanceResponse>`. See `[BRAIN-OUT] charging/ENDPOINT_REGISTRY.md:18`.

## 5 — PES authority context

### Admin (Falcon) side

Five PES keys consumed by `primeAccess()` (per `[CODE] origin/main admin component.ts:876-884`):

| Key factory | Resolves to | Used for |
|---|---|---|
| `FalconAccess.adminConsole.walletStrategy.view()` | `{ action: 'view', resource: 'sys.wallet-strategy' }` | Show Settings card |
| `FalconAccess.adminConsole.walletStrategy.edit()` | `{ action: 'edit', resource: 'sys.wallet-strategy' }` | Enable Save button + edit segments |
| `FalconAccess.adminConsole.masterWallet.view()` | `{ action: 'view', resource: 'sys.master-wallet' }` | Show Master Wallet card |
| `FalconAccess.adminConsole.wallet.transfer()` | `{ action: 'transfer', resource: 'sys.wallet' }` | Enable Transfer drawer + per-row Transfer button |

All four declared at `[CODE] libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts:123-130`.

### Mgmt (Client) side

**No feature-scoped PES keys exist.** Per `[BRAIN-OUT] wallet-balance-management.compare.md:62-95`:

- The Client wallet page has NO `data.access` declaration
- Only fine-grained gate = server-driven `IWalletDataResponse.canSave` + `canTransfer` flags
- 2 PES keys are MISSING from the registry: `managementConsole.wallet.view` + `managementConsole.wallet.transfer` (G-1, G-2 per Wave-11 component header)

Per DECISION-PROTOCOL **F-021** (new acc-* resource needed with no PES rule): **halt-and-flag** — PES seed update is human-reviewed. Workaround in place: rely on app-level `managementConsoleGuard` + server-driven gates.

## 6 — Role table (verbatim from authority-dataset)

| Role | View master | View strategy | Edit strategy | Transfer | Cross-account scope | Console |
|---|---|---|---|---|---|---|
| `sys-admin` | ✅ allow | ✅ allow | ✅ allow | ✅ allow | ✅ tree picker | admin-console |
| `sys-ops` | ❌ silent deny | ❌ silent deny | ❌ silent deny | ❌ silent deny | ✅ tree visible, all wallet actions denied | admin-console |
| `sys-products` | ✅ allow | ✅ allow | ✅ allow | ✅ allow | ✅ tree picker | admin-console |
| `acc-owner` | ❌ (no acc.* equiv) | ❌ no PES | ❌ no PES | ✅ within own account | ❌ own only | management-console |
| `acc-admin` | ❌ | ❌ | ❌ | ❌ | ❌ | management-console |
| `acc-user` | ❌ | ❌ | ❌ | ❌ | ❌ | management-console |

Source: `[CODE] BuiltInRoleCatalog.cs:85-290` + `[BRAIN-OUT] 04-feature-parity-matrix/wallet-balance-management.compare.md:50-58`.

## 7 — Business rules (from transfer.models.ts on origin/main)

- **Rule A** — Balance type filtering: `NodeBased` shows nodeType 1+2 (Organization, Service); `UserBased` shows nodeType 3 (User)
- **Rule B** — Multiple Wallets hierarchy:
  - Master can transfer only to an account channel wallet
  - Account channel wallet → matching owner channel wallet
  - Owner channel wallets → same channel only
- **Rule C** — Master Wallet only from master-wallet action (never paired with node/user directly in multi mode)
- **Rule D** — Source ≠ Destination
- **Description required** when source or dest is CommChannel (per `isDescriptionRequired()` helper at `[CODE] transfer.models.ts:179-191`)

## 8 — Mockup vs parity-matrix deltas (FLAGS)

| # | Item | Mockup says | Parity matrix says | Resolution |
|---|---|---|---|---|
| **D-1** | Master Wallet card on Client view | ✅ shown (with `1,500,000`) | ❌ Falcon-only (no `acc.master-wallet` resource in registry) | **HALT-AND-FLAG** per DECISION-PROTOCOL F-021. Recommend: omit Master Wallet from Client view (follow parity); record mockup deviation in `_pending-questions/`. |
| **D-2** | `Type: SAR / Points` selector in Client view | ✅ shown | Not enumerated | OK — `Currency` enum supports both; existing `currencyOptions` array has both. No new field. |
| **D-3** | `Viewing as` role simulator in Falcon view | ✅ 4 roles (Falcon System Admin / Account Owner / Node Admin / Normal User) | Not part of feature spec | **Mockup-only design aid.** Drop. The PES system + login as different user handles real role testing. |
| **D-4** | `Switch perspective` button on both views | ✅ shown | Not enumerated | Maps to the Falcon/Client switcher at the top of `Wallet & Balance .Mng`. Implement as a route-level toggle visible **only to `isFalconUser`** (so client users never see it). |
| **D-5** | `Edit` button in Falcon header | ✅ shown | Equivalent to "Save" pattern in existing impl | Keep — wire to the existing `saveChanges()` flow. |

## 9 — PrimeNG audit (origin/main admin impl)

`[CODE] origin/main wallet-balance-management.component.ts:7-9` imports:

```typescript
import { TreeNode, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
```

Per user UI policy: **No PrimeNG allowed**. Re-skin must replace:

| PrimeNG dep | Falcon UI Core replacement |
|---|---|
| `ToastModule` + `MessageService` (showSuccess/showError) | `falcon-toast` + `FalconNotificationService` (per `[BRAIN-OUT] understanding/frontend/components/falcon-toast/`) |
| `TreeNode` interface (PrimeNG shape) | Falcon's own tree-node model (already used by `OrganizationHierarchyTreeComponent` from `@falcon`) |

Note: mgmt-side is **already PrimeNG-clean** (uses `FalconAngularCardComponent` + `FalconAngularButtonComponent`).

## 10 — Falcon UI Core component coverage

| Mockup region | Falcon UI Core component | Customization path | Dossier |
|---|---|---|---|
| Master Wallet card | `falcon-card` | Input `[title]` + token override for balance-number typography | `[BRAIN-OUT] understanding/frontend/components/falcon-card/` |
| `Show as Falcon / Client` chooser cards | `falcon-card` × 2 + `falcon-button` | inputs only | same |
| Sidebar nav | already mounted (host-shell) | n/a — existing | n/a |
| Tree picker (Falcon view) | `falcon-organization-hierarchy-tree` (existing) | inputs only | `[CODE] @falcon` re-export |
| `Balance Type` / `Wallet Type` segmented control | `falcon-radio-group` w/ `[layout]="'horizontal-pill'"` OR new `falcon-segmented-control` if missing | input layout — verify in dossier | `[BRAIN-OUT] understanding/frontend/components/falcon-radio-group/` |
| `Type: SAR / Points` dropdown | `falcon-select` or `falcon-dropdown` | input options | `[BRAIN-OUT] understanding/frontend/components/falcon-select/` |
| `Viewing as` simulator (Falcon view) | DROPPED (mockup-only) — see D-3 | n/a | n/a |
| `Switch perspective` button | `falcon-button` variant=outline | input | `[BRAIN-OUT] understanding/frontend/components/falcon-button/` |
| `Edit` button | `falcon-button` variant=primary | input | same |
| Data table (Organizations / Wallet / Transfer) | `falcon-data-table` OR `falcon-tree-table` (if hierarchy needed inline) | column defs + cell templates | `[BRAIN-OUT] understanding/frontend/components/falcon-data-table/` + `falcon-tree-table/` |
| Per-row Transfer icon button | `falcon-icon-button` slot inside `falcon-data-table` action column | template projection | dossier |
| Paginator | `falcon-paginator` | inputs | `[BRAIN-OUT] understanding/frontend/components/falcon-paginator/` |
| Balance Transfer drawer | `falcon-drawer` | content projection + footer slot | `[BRAIN-OUT] understanding/frontend/components/falcon-drawer/` |
| Drawer · Source/Destination dropdowns | `falcon-select` w/ search variant | input | `[BRAIN-OUT] understanding/frontend/components/falcon-select/` |
| Drawer · Channel select (icon + label) | `falcon-select` w/ custom item template | template projection | same |
| Drawer · Amount input | `falcon-input-number` w/ Riyal suffix slot | template projection | `[BRAIN-OUT] understanding/frontend/components/falcon-input-number/` |
| Drawer · Quick-pick (25% / 50% / Max) | `falcon-button` × 3 (variant=ghost-small) inside hint slot | inputs | dossier |
| Drawer · Description textarea | `falcon-textarea` | input | `[BRAIN-OUT] understanding/frontend/components/falcon-textarea/` |
| Drawer · Cross-channel locked hint | `falcon-tooltip` or inline `falcon-icon` + text | template | dossier |
| Insufficient-balance toast/dialog | `falcon-insufficient-balance-dialog` (already shipped!) | inputs | `[BRAIN-OUT] understanding/frontend/components/falcon-insufficient-balance-dialog/` |
| Empty state (no client selected) | `falcon-empty-state` | inputs | `[BRAIN-OUT] understanding/frontend/components/falcon-empty-state/` |
| Toast (success/error feedback) | `falcon-toast` + `FalconNotificationService` | service call | `[BRAIN-OUT] understanding/frontend/components/falcon-toast/` |

**Verification needed at Wave 4 (FE components)**:
- Does `falcon-radio-group` support the "horizontal pill segmented" layout the mockup uses? If not → propose token + variant addition (customization order: token first, then component upgrade).
- Does `falcon-data-table` action column support icon buttons natively? Yes per existing mgmt impl.

## 11 — Existing impl details to preserve

| Detail | Source | Why preserve |
|---|---|---|
| `resolveSelectedAccountId()` returns main account never sub-node (mgmt) | `[CODE] mgmt wallet-balance.service.ts:48-51` | Compare-doc rule — Save scope must be main account |
| `useGateway(Gateway.ChargingGateway)` override on mgmt transfer | `[CODE] mgmt wallet-balance.service.ts:106-114` | Only place mgmt deviates from default — preserve exactly |
| Server-driven `canSave` + `canTransfer` for mgmt gating | `[CODE] mgmt component.ts:1-22` header | No PES key exists for mgmt — server flags ARE the gate |
| Account-id PATH form (not query param) | `[CODE] mgmt wallet-balance.service.ts:55-79` | Bare query form hits generic proxy and omits gates — Transfer button never mounts |
| Description-required logic | `[CODE] origin/main transfer.models.ts:179-191` | Backend-driven business rule (Rule B) |
| Currency enum 1=SAR, 2=Points | `[CODE] models/wallet-balance.models.ts:15-18` | Matches backend `eCurrency` |
| `Currency` Default = SAR; `WalletBalanceType` Default = NodeBased; `WalletType` Default = SingleWallet | `[CODE] mgmt wallet-balance.service.ts:117-124` | Default-query convention |

## 12 — Ambiguity score (per SPEC-PROTOCOL Step 5)

| Item | Multiple plausible interpretations? | Resolved by | Score weight |
|---|---|---|---|
| Master Wallet on Client view | Mockup says yes; parity says no | **HALT-AND-FLAG (F-021)** — recommend follow parity, but user decides | +2 |
| `Viewing as` role simulator | Real feature or design aid? | DROPPED per D-3 (no PES backing) | 0 |
| `Switch perspective` button placement | Top of page (consistent across both views) | DECIDED — top-right of page header, only visible to `isFalconUser` | 0 |
| `Edit` button vs Save flow | Mockup shows Edit; existing impl uses Save-on-strategy-change | DECIDED — `Edit` toggles strategy-edit mode; existing `saveChanges()` fires on commit | 0 |
| `Type: SAR/Points` selector position | Different in Falcon (probably top right) vs Client (clearly top right) | DECIDED — top-right of summary band, always-visible | 0 |
| Falcon view tree vs mgmt single-context | Already resolved by existing impl + parity matrix | DECIDED | 0 |
| Description required logic | UI/UX vs business rule | DECIDED — keep `isDescriptionRequired()` exactly as origin/main | 0 |
| Cross-channel locked rule | UI shows hint + disabled state | DECIDED — wallet-drawer.jsx shows the exact pattern | 0 |
| Falcon UI Core 1:1 vs upgrade-needed | Need to verify `falcon-radio-group` segmented variant | DECIDED — Wave 4 verifies; upgrade if missing per Brain SK Falcon Eyes customization order | 0 |

**Ambiguity total: 2 → verdict `proceed-with-defaults`** (one halt-and-flag item: D-1 Master Wallet on Client).

## 13 — Conservative defaults applied (per DECISION-PROTOCOL)

| # | Fork | Default applied | Justification |
|---|---|---|---|
| F-021 (D-1) | Master Wallet on Client view | **Follow parity matrix → omit Master Wallet card from Client view**; file `_pending-questions/wallet-2026-05-28-master-on-client.md` for Ammar to decide | DECISION-PROTOCOL "default to more restrictive option (security)" + parity matrix is the canonical authority cross-check |
| F-016 (mockup imports use jQuery-style globals) | Reference jsx is a design demo only — never imported in Falcon code | Decision logged | DECISION-PROTOCOL "code is reality" — mockup is reference only |
| F-019 | Empty state when no client selected (admin) | `falcon-empty-state` w/ icon + "Select a client to view balances" message | conservative default #3 |
| F-020 | Loading state during hierarchy fetch | Skeleton via `falcon-data-table` `[loading]` | conservative default #4 |
| F-022 | Choice between `falcon-data-table` vs `falcon-tree-table` for the 9-row balance table | `falcon-data-table` (current mgmt impl) — tree-table only if inline expansion needed | mgmt's existing implementation already uses flat data-table with per-row state |

## 14 — Open assumptions (cap 3 per SPEC-PROTOCOL)

1. **[INFERRED]** The `polishing-v0.4` branch dropped admin-console wallet **intentionally** as part of the v0.4 polish wave — not by accident. To verify before restoring, check the branch's last commit touching `apps/admin-console/src/app/app.routes.ts` for an explicit removal. If intentional, the SPEC's restoration step needs an "explicit re-enable" confirmation.
2. **[INFERRED]** The T2 mockup at `127.0.0.1:5173` is owned by the design team (not a build artifact of falcon-web-platform-ui). Confirmed: `curl /` returns "T2 Falcon — Project Index" with 4 HTMLs (Admin + 3 Login variants); the React JSX files are inline-Babel, not the production stack.
3. **[INFERRED]** The mockup's `Viewing as` role simulator is for design preview only (D-3), not a real feature. **Risk**: if the design team actually wants a role-switcher (admin can "preview as client"), that's a new feature outside this scope and must be split.

## 15 — Dataset gap analysis (per SPEC-PROTOCOL Step 4)

| Axis | Status | Detail |
|---|---|---|
| Authority | 🟡 partial | Mgmt-side PES keys missing (G-1, G-2 = `managementConsole.wallet.view` + `managementConsole.wallet.transfer`). Workaround in place via server-driven `canSave`/`canTransfer`. Halt-and-flag if creating new keys. |
| Feature shape | ✅ resolved | `wallet-balance-management.compare.md` (174 lines) is canonical |
| V-rules | ✅ resolved | Embedded in `transfer.models.ts` (Rules A-D + description required) — no xlsx row for wallet transfer needed for v1 re-skin |
| Entity drift | ✅ resolved | FE models 1:1 match BE Charging DTOs (`TransferBalanceRequest`/`Response`, `GetAccountWalletsRequest`/`Response`) |
| Business rules | ✅ resolved | Same as V-rules + Master/account/owner channel hierarchy |
| Non-PES gates | ✅ resolved | Server-driven `canSave`/`canTransfer` on mgmt side; `canDoActions` flag on admin side per existing impl |
| Port recipe | ✅ resolved | This is a re-skin + restore, not a port — parity-matrix copy-recipe still informs the structural differences |
| Error codes | ✅ resolved | `TransferErrorCode` enum (INSUFFICIENT_BALANCE / NO_ACTIVE_CONTRACTS / CONTRACT_DEDUCTION_FAILED / INVALID_*  / SAME_SOURCE_DESTINATION / UNAUTHORIZED / UNKNOWN) maps to BE `TransferBalanceResponse.errorCode` |
| Visual target | ✅ resolved | T2 mockup at `127.0.0.1:5173/T2 Falcon Admin.html` + scraped evidence + wallet-drawer.jsx source |
| Pitfalls | ✅ aware | Wave-7 stencil/angular FE compile errors (F-007) → workspace state risk; mgmt impl uses Falcon-Angular wrappers already |
| Test cases | 🟡 partial | Existing mgmt impl is build-green but lacks browser-verified evidence. Add per-action smoke tests as Wave 6. |
| Runtime verification path | ✅ resolved | Existing PES-verify lane: login as `sys-admin` (Falcon view) + `acc-owner` (Client view) → confirm permissions match table in §6 |

## 16 — Next steps (to SPEC.md)

Proceed to write:
- `_specs/wallet-admin-2026-05-28.md` — Falcon-side SPEC
- `_specs/wallet-mgmt-2026-05-28.md` — Client-side SPEC
- `_specs/wallet-action-api-map.md` — per-action ↔ endpoint mapping
- `_specs/wallet-component-falcon-map.md` — visual region ↔ Falcon UI Core component
- `_specs/wallet-wave-plan-2026-05-28.md` — multi-wave build plan with gates
- `_specs/wallet-risk-register-2026-05-28.md` — risks + open questions
- `_pending-questions/wallet-2026-05-28-master-on-client.md` — Ammar decision required (D-1)
