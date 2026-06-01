---
name: session-backup-mgmt-wallet-flat-table-to-expandable-tree-table-client-view
description: "Ported admin-console wallet's working expandable CSS-grid tree-table into mgmt-console Client view; native-chrome drawer fix"
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-28
  status: completed
  originSessionId: ec388185-676b-461f-8e96-12da072b241b
---

## What Was Done
Converted the management-console wallet (Client view) from a FLAT `<table>` to the
expandable hierarchy tree-table that the admin-console wallet actually ships, so it
renders like the admin console + the T2 "Show as Client" mockup. Browser-verified
live against Docker with `mitsubishi-owner`.

Files (all under `apps/management-console/src/app/features/wallet-balance-management/`,
git-UNTRACKED `??` — whole wallet feature is uncommitted working-tree work):
1. `wallet-balance-management.component.ts`
2. `wallet-balance-management.component.html`
3. `components/balance-transfer/balance-transfer.component.html`
4. `components/balance-transfer/balance-transfer.component.ts`

### CRITICAL reconciliation (brief said one thing, reality is another)
The brief said "copy admin's `<falcon-angular-tree-table>` markup + `treeTableColumns`/
`treeTableNodes`". But the admin wallet's **rendered** tree-table is NOT
`<falcon-angular-tree-table>` — it is a **bespoke 3-column CSS-grid** driven by:
`displayRows` / `pagedDisplayRows` / `treeGridTemplate` / `isRowExpanded` /
`toggleRowExpand` / `formatWalletCell` / `formatChannelCell` (the SoT-parity grid from
`[[project_wallet_card_treetable_sot_2026_05_28]]`).

The `<falcon-angular-tree-table>` import + `treeTableNodes` / `treeTableColumns` /
`toTreeNode` / `mapNodeBased` / `onTreeExpand` exist in BOTH admin AND mgmt components
as DOCUMENTED DEAD CODE (the "Defect B" mapping) — neither HTML wires them. I mirrored
what RENDERS (the grid), and left the dead tree-table code at parity with admin.
=> If a future agent searches for `<falcon-angular-tree-table>` in the wallet HTML they
   will NOT find it. The expandable table is hand-rolled CSS-grid. This is by design.

### TS changes (wallet-balance-management.component.ts)
- Added `IWalletDisplayRow` interface (id/depth/name/isHeader/isUser/hasChildren/walletText/channelTexts/node).
- Added `displayRows` computed: recursively walks `rootNode()` honoring `expandedTreeIds`;
  NodeBased prunes User leaves, UserBased keeps Users; depth-0 = session account = header
  row (bold, no value).
- Added `treeGridTemplate` computed: `minmax(0,1fr) <value>[ 90px]` — value = `160px`
  single-wallet OR `110px` per channel multi-wallet; the trailing `90px` transfer column
  appears ONLY when `canTransfer()` is true.
- Repointed pagination: `totalPages`/`pageStart`/`pageEnd` now count `displayRows()`;
  added `pagedDisplayRows` (replaced the flat `balanceRows`/`pagedRows` as the table source).
- Added `formatWalletCell` (single-wallet grouped number string), `isRowExpanded` +
  `toggleRowExpand`, `isCellEditable`, and `seedExpanded(root)` (seeds root + first-level
  expanded once per loaded account, called from `loadWallet` success branch; guarded by
  the existing `expandedSeeded` flag).
- Changed `formatChannelCell` missing return `'—'` → `'N/A'` so the ported admin template's
  `txt !== 'N/A'` branch works.
- New `@falcon` imports: `SVG_ICON_NAMES`, `SvgIconComponent`, `getCssVariable`.
  Added members `icons` / `symbolCurrencyColor` / `NodeType`.
- Removed now-orphaned `DecimalPipe` import (parent template no longer uses `| number`).
- LEFT dead `balanceRows` / `pagedRows` / `findChannelBalance` (harmless protected members,
  same as admin's leftover dead helpers).

### HTML changes (wallet-balance-management.component.html)
Replaced the `<table>/<thead>/<tbody>` block with the admin grid:
header row + body rows using `[style.grid-template-columns]="treeGridTemplate()"`,
chevron `<button>` (`[class.rotate-90]="isRowExpanded(row.id)"` + `(click)="toggleRowExpand"`),
depth indent (`[style.width.px]="row.depth*20"`), User avatar glyph, value cells
(`<falcon-svg-icon [name]="icons.CURRENCY_SAR">` + tabular-nums), per-row circular transfer
`<button>` gated `@if (canTransfer()) ... @if (!row.isHeader)`. Paginator counts
`displayRows().length`. Kept mgmt gating `canTransfer()` (NOT admin's `canTransferWallet()`)
+ `hasMultipleWallets()`. Tailwind tokens only (`text-[length:var(--falcon-font-size-*)]`,
no hex/arbitrary px in the table). NO Master Wallet card / Balance Type control / tree
picker (Client view per parity matrix — those stay omitted).

### Drawer native-chrome fix
Replaced `<falcon-angular-drawer>` (which wiped its projected default-slot body under
zoneless CD — same Stencil slot-relocation race the cards + admin drawer hit) with native
`bt-scrim` div + `<aside class="bt-drawer">` chrome (head/body/foot) mirroring the admin
drawer. Kept ALL mgmt field bindings (signal-based dropdowns/input-number/textarea,
quick-pick 25/50/Max, summaryError/serverError). Removed unused `FalconAngularDrawerComponent`
import + array entry. `onDrawerHide` left as harmless dead method.

## What Remains
- **Drawer runtime verification (BLOCKED by seed, not code):** the backend hierarchy
  response for Mitsubishi (`690000000000000000c10001`) returns `canTransfer: undefined`,
  so the per-row transfer button never renders → the drawer can't be opened in this seed.
  The native-chrome fix is BUILD-verified + applied on the strong admin prior, but is
  RUNTIME-UNTESTABLE until a Client account is seeded with `canTransfer:true`. (This is the
  documented Wave-1 G2 server-driven gate: no `managementConsole.wallet.transfer` PES key;
  the response flag is the gate; default-deny. The OLD flat table had identical gating.)
  A future agent with such a seed should click a transfer icon → confirm the drawer body
  (Source/Destination/Amount/Description) renders populated, not empty.
- Multi-wallet mode (channels) tree-table cells unexercised at runtime (Mitsubishi seed is
  single-wallet). The code path mirrors admin; not visually confirmed.

## Key Decisions
- Mirror what RENDERS (bespoke CSS-grid), not the brief's literal `<falcon-angular-tree-table>`
  (which is dead in admin too). Kept dead tree-table code for admin parity / lowest churn.
- Apply the drawer native-chrome fix proactively (vs "test-first then fix") — the trigger is
  un-renderable in this seed so test-first was impossible, and the admin drawer proved the
  exact fix on identical architecture. Zero regression risk (trigger never mounts).
- Build is the gate. Lint exits 1 repo-wide (admin-console exits 1 identically); my grid HTML
  added ZERO findings, my drawer added the SAME findings the shipped admin drawer has.

## Files Changed
- apps/management-console/src/app/features/wallet-balance-management/wallet-balance-management.component.ts
- apps/management-console/src/app/features/wallet-balance-management/wallet-balance-management.component.html
- apps/management-console/src/app/features/wallet-balance-management/components/balance-transfer/balance-transfer.component.html
- apps/management-console/src/app/features/wallet-balance-management/components/balance-transfer/balance-transfer.component.ts

## Build / Verify
- mgmt build GREEN hash `1fea30b8614c04d2` (`nx build management-console --skip-nx-cache`).
- host build GREEN hash `00daafda06b8ce7a`.
- Live E2E: `mitsubishi-owner` / `Admin@1234`, host :4200 + standalone mgmt :4301 (both freshly
  rebuilt + restarted). Tree-table renders Mitsubishi → ss + bmw expanded; instance count = 1;
  0 console errors; hierarchy + Node calls 200.
- Screenshot: `C:\Falcon\Brain Outputs\reports\web-scrub\2026-05-28-2220_verify-mgmt-treetable\screenshot-viewport.png`
- Tooling: kill dev servers with PowerShell `Stop-Process -Force` NOT bash `taskkill /F`
  (Git-Bash mangles `/F` → "Invalid argument 'F:/'"). Dev servers now bind `[::1]` (IPv6);
  `http://localhost:4200` resolves fine. web-scrub login = `POST :7777/api/auth/login`,
  tokens at `result.tokens.{accessToken,refreshToken}`, `requiresOtp:false stage:4`. Scrape
  injects them into sessionStorage as `access_token`/`refresh_token`.

## Context for Next Agent
NO COMMITS — files in working tree on branch `polishing-v0.4`, whole wallet feature untracked.
Both admin + mgmt wallet now render the same expandable tree-table; mgmt correctly omits the
Falcon-only Master Wallet card / Balance Type control / tree picker. The only open runtime gap
is drawer-open verification, blocked by the backend not emitting `canTransfer:true` for the
seeded Mitsubishi account (not a FE bug).
