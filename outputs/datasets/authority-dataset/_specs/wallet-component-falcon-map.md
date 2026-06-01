---
type: feature-component-map
task: wallet-balance-mgmt-reskin
created: 2026-05-28
purpose: "Every visual region in the T2 mockup mapped to an existing Falcon UI Core component with its customization path (inputs > templates > slots > tokens > shared upgrade > new component > wrapper > raw HTML)."
---

# Wallet & Balance .Mng — Per-Component Falcon Mapping

> [!summary]
> Each scraped/mockup region mapped to a Falcon UI Core component with the **minimum customization** that still hits visual parity. Customization order strictly follows Brain SK Falcon Eyes rule: **inputs → templates/ng-template → slots → token override → shared component upgrade → new Falcon component → wrapper → raw HTML (last resort, flagged as GAP)**.

## Page-level layout

| Visual region | Falcon UI Core component | Customization path | Tokens to use | Notes |
|---|---|---|---|---|
| Page shell (sidebar + topbar + content) | host-shell (already mounted) | n/a | n/a | Existing infra — no change |
| Sidebar — `Wallet & Balance .Mng` nav item | Existing admin/mgmt sidebar nav (host-shell config) | inputs | `--falcon-color-nav-*` | Just register the route in `app.routes.ts` + sidebar config |
| Topbar (Home → Wallet & Balance breadcrumb + user menu) | host-shell topbar | n/a | n/a | Existing infra |

## Falcon view (admin-console)

| # | Region | Falcon component | Customization path | Tokens / inputs |
|---|---|---|---|---|
| 1 | Tree picker — left column (Falcon / Falcon Clients / nodes) | `<falcon-organization-hierarchy-tree>` (from `@falcon`) | inputs (`[treeNodes]`, `[selection]`, `(nodeSelect)`) | tokens defined in existing org-hierarchy dossier; no new tokens needed |
| 2 | Selected node header (avatar + name "Aramco") | `<falcon-avatar>` + plain Tailwind text on tokens | inputs | `--color-text`, `--font-size-h2` |
| 3 | Master Wallet card (header text + balance value `1.500.000`) | `<falcon-card>` w/ `[title]="'Master Wallet'"` + content slot for balance | inputs + content slot | `--falcon-card-padding`, `--falcon-card-radius`, `--font-size-display-1` for balance, `--color-primary` for currency mark |
| 4 | Master Wallet transfer icon button (top-right of card) | `<falcon-button variant="ghost-icon">` w/ `[disabled]="!canDoActions \|\| !canTransferWallet"` | inputs | `--falcon-icon-button-size-md` |
| 5 | Balance Type segmented control (`Node Based` / `User Based`) — Falcon-only | **VERIFY**: `<falcon-radio-group [layout]="'horizontal-pill'">` if variant exists; else **shared upgrade** to add `pill-segmented` variant to `falcon-radio-group` | input layout flag OR component upgrade | `--falcon-radio-group-pill-bg`, `--falcon-radio-group-pill-active-bg` — if missing, propose token addition |
| 6 | Wallet Type segmented control (`Single Wallet` / `Multiple Wallets`) | same as #5 | same | same |
| 7 | `Viewing as` role simulator (Falcon System Admin / Account Owner / Node Admin / Normal User) — **DROPPED** (mockup design aid) | n/a | n/a | n/a — drop per D-3 |
| 8 | `Switch perspective` button (Falcon-only) | `<falcon-button variant="outline">` | inputs | standard outline button tokens |
| 9 | `Edit` button (admin Falcon view) | `<falcon-button variant="primary">` w/ `*ngIf="canEditWalletStrategy"` | inputs | standard primary button tokens |
| 10 | Data table (Organizations / Wallet / Transfer columns, 9 rows) | `<falcon-data-table>` w/ column defs | inputs (column defs) + ng-template (cell templates) | `--falcon-table-row-height`, `--falcon-table-cell-padding-inline` (existing platform-wide rule per memory) |
| 11 | Data table — Organization cell (icon + indent + label) | `<falcon-data-table>` row template with `<falcon-icon>` slot | template projection | `--falcon-data-table-indent-step` for child node indent |
| 12 | Data table — Wallet cell (balance number, currency mark) | `<falcon-data-table>` row template + `<DecimalPipe>` + `<falcon-icon name="riyal">` suffix | template projection | `--font-size-table-numeric` |
| 13 | Data table — Transfer cell (icon button + per-row in-flight spinner) | `<falcon-data-table>` action cell with `<falcon-button variant="ghost-icon">` + `[loading]="isRowBusy(row.id)"` per [MEMORY] project_service_pricing_per_row_loader_wave_12 | template projection | shared busy-row pattern |
| 14 | Paginator (Rows per page 10/20/30/40, page nav) | `<falcon-paginator>` | inputs | existing tokens |
| 15 | Toasts (success / error feedback) | `<falcon-toast>` + `FalconNotificationService` | service call | existing tokens |
| 16 | Insufficient-balance dialog | `<falcon-insufficient-balance-dialog>` | inputs | existing |
| 17 | Empty state (no client selected) | `<falcon-empty-state>` | inputs | standard tokens |

## Client view (management-console)

| # | Region | Falcon component | Customization path | Notes |
|---|---|---|---|---|
| 1 | Page header (`Wallet & Balance .Mng` + breadcrumb) | host-shell + plain Tailwind on tokens | inputs | n/a |
| 2 | Selected client header band (`Aramco` icon + name) | `<falcon-avatar>` + Tailwind text | inputs | session-driven, never tree-picked |
| 3 | Master Wallet card | **HALT-AND-FLAG D-1** — default: OMIT per parity matrix. If Ammar approves mockup → same `<falcon-card>` pattern as admin #3 | conditional inputs | pending decision |
| 4 | Wallet Type segmented control (`Single Wallet` / `Multiple Wallets`) | same as admin #5 | same | mgmt has Wallet Type but NOT Balance Type per mockup |
| 5 | `Type: SAR / Points` selector | `<falcon-select>` (compact) — or `<falcon-dropdown>` | inputs | `--falcon-select-compact-height` |
| 6 | `Switch perspective` button | **DROP** on mgmt (Falcon-only affordance per D-4) | n/a | n/a |
| 7 | Data table (Organizations / Wallet / Transfer) | same as admin #10-13 | same | rows scoped to single account hierarchy |
| 8 | Per-row Transfer button (gated by server `canTransfer` flag) | `<falcon-button variant="ghost-icon">` w/ `[disabled]="!row.canTransfer"` | input | server-driven flag |
| 9 | Paginator / Toasts / Empty state / Insufficient-balance dialog | same as admin #14-17 | same | n/a |

## Balance Transfer Drawer (shared, both consoles)

Source: `wallet-drawer.jsx` (mockup) + existing `BalanceTransferComponent` (mgmt).

| # | Drawer region | Falcon component | Customization path | Notes |
|---|---|---|---|---|
| 1 | Drawer shell + header + footer | `<falcon-drawer>` w/ `[title]` input + footer slot | inputs + slots | standard drawer tokens |
| 2 | Drawer footer — Cancel button | `<falcon-button variant="secondary">` | inputs | per-style |
| 3 | Drawer footer — Save button | `<falcon-button variant="primary" [disabled]="!canSave">` | inputs | reactive disabled |
| 4 | Source dropdown (all wallets) | `<falcon-select>` w/ search + custom item template (Master + orgs + users w/ indent) | inputs + item template | `--falcon-select-menu-max-height` |
| 5 | Source Wallet channel select (icon + name, multi-wallet mode only) | `<falcon-select>` w/ icon item template | template projection | per-channel icon palette |
| 6 | Destination dropdown (filtered to exclude source) | `<falcon-select>` | inputs | filter logic in component |
| 7 | Destination Wallet channel select (locked when source ≠ Master) | `<falcon-select [disabled]="destWalletLocked">` w/ lock icon hint | inputs + hint template | `<falcon-tooltip>` for "Cross-channel transfers not allowed" message |
| 8 | Transfer Amount input | `<falcon-input-number>` w/ Riyal-mark suffix slot + `[max]="sourceMax"` + `inputmode="numeric"` | inputs + suffix slot | per existing money-input pattern |
| 9 | Amount quick-pick buttons (25% / 50% / Max) | `<falcon-button variant="ghost-small">` × 3 inside hint slot of input-number | inputs | small button tokens |
| 10 | Amount hint (`Available: 1,500,000`) | plain Tailwind on tokens beneath input-number | inputs | `--font-size-hint`, `--color-text-muted` |
| 11 | Transfer Description textarea (3 rows, required when CommChannel involved) | `<falcon-textarea>` | inputs | per existing textarea pattern |
| 12 | Form-level error display (after submit failure) | `<falcon-form-field [error]>` wrapping the offending control + inline message | input | per existing 3-layer validation pattern (sync + async + backend) per `[MEMORY] project_form_control_error_bg_symmetry_2026_05_21` |

## Required Falcon UI Core checks (verify in Wave 4)

| Component | Capability to verify | Action if missing |
|---|---|---|
| `falcon-radio-group` | `horizontal-pill` segmented layout variant | Brain SK Falcon Eyes order step 5: shared upgrade to add `pill-segmented` variant. NOT a new component. |
| `falcon-input-number` | suffix-slot for currency mark + quick-pick buttons in hint slot | If suffix slot missing → input upgrade (variant or slot). If hint quick-pick buttons not slotted → use plain markup inside form-field's hint area. |
| `falcon-select` | search variant + custom item template (icon + indented label) | Both should exist per existing dossiers. Verify before assuming. |
| `falcon-drawer` | footer slot + scrollable body | Existing — verified per Add Client wizard usage |
| `falcon-data-table` | `[loading]` skeleton per row (via `busyRowIds`) + per-row action cell | Pattern proven in [MEMORY] project_service_pricing_per_row_loader_wave_12 |
| `falcon-organization-hierarchy-tree` | `[refreshPath]` for selecting + opening a node by id-chain | Pattern proven in [MEMORY] project_org_hierarchy_path_refresh_2026_05_20 |
| `falcon-insufficient-balance-dialog` | Already exists per dossier listing | Just wire it. |

## Tokens — new vs existing

If the mockup color palette doesn't match existing Falcon palette:

- New tokens go in `libs/falcon-ui-tokens/src/` per [MEMORY] project_night_shift_static_value_token_migration_2026_05_18
- Naming convention `--falcon-<area>-<role>-<variant>` per `Brain Outputs/strategies/falcon-component-creation/05-SCORING_RUBRIC.md`
- **NEVER inline hex colors** — gate:hardcoded-value-lint will fail the build
- Re-skin tokens (proposed if missing): `--falcon-wallet-master-bg`, `--falcon-wallet-segmented-pill-active`, `--falcon-wallet-balance-display-color`. Verify at Wave 5 (i18n + tokens).

## Customization-order discipline

For every visual region: try **inputs** first. If pixel parity not achieved → try **ng-template projection**. If still missing → check for a **slot**. Only then **token override**. Only then **shared component upgrade** (one PR per upgrade). Only then **new Falcon component**. Wrappers + raw HTML are forbidden in the wallet feature folder per UI policy.

If ANY region in this table requires "raw HTML" or "wrapper", file a GAP in `_pending-questions/` and halt the wave.

## See also

- Investigation: `_investigation/wallet-balance-mgmt-2026-05-28.md`
- Mockup capture: `web-scrub/2026-05-28-0443_t2-wallet-falcon-view/` + `web-scrub/2026-05-28-0443_t2-wallet-client-view/`
- Source JSX: `web-scrub/_source-jsx/wallet-drawer.jsx`
- Falcon component dossiers: `Brain Outputs/understanding/frontend/components/<name>/`
