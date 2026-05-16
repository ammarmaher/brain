# falcon-insufficient-balance-dialog — OVERVIEW

Custom pop-up notification — generic priority-reorder dialog. Self-contained: owns its backdrop, panel, warning icon, title, subtitle, priority list, info pill, footer, focus trap, and Esc/backdrop handling.

Built per the canonical Falcon component creation strategy as a **three-artefact** component:

| Artefact | Tag / Selector | Path |
| --- | --- | --- |
| Shadow Stencil | `<falcon-insufficient-balance-dialog>` | `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/` |
| Light/Tailwind Stencil twin | `<falcon-insufficient-balance-dialog-tw>` | `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/` |
| Angular wrapper | `<falcon-angular-insufficient-balance-dialog>` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-insufficient-balance-dialog/` |
| Token contract | `insufficient-balance-dialog.tokens.css` | `libs/falcon-ui-tokens/src/components/` |

## Import

```ts
import {
  FalconAngularInsufficientBalanceDialogComponent,
  type IbDialogItem,
  type FalconInsufficientBalanceDialogProceedDetail,
} from '@falcon/ui-core/angular';
```

## Why a self-contained dialog (NOT composing falcon-dialog)

The three configurable visual modes (`showGlossy`, `showIconColor`, `showIconBackground`) need full control over backdrop blur, icon color, and icon chip. Composing `<falcon-dialog>` would require passing CSS custom-property overrides through Shadow boundaries — fragile. Self-contained gives a clean token contract + direct control.

## Generic API

The dialog accepts an opaque list of `{ id: string; label: string }`. It emits the reordered IDs on confirm. The caller owns the backend (insufficient-balance detection, API submission, polling). Reuse is open — campaign recipient prioritization, route preference, anything that needs flat-list ranking.

## Configurable row dimensions (user-requested)

Token-driven per-row geometry — height, min-width, gap, padding, radius. Defaults set in `libs/falcon-ui-tokens/src/components/insufficient-balance-dialog.tokens.css`. Override globally or per-instance via `style="--falcon-ib-dialog-row-height: 56px"`.

## Showcase

Registered in `libs/falcon-ui-showcase-data/src/registry.json` under a NEW dedicated category:

```json
{ "id": "notifications", "label": "Custom Pop-up Notification" }
```

Positioned AFTER `feedback` in the categories array — appears at the bottom of the notification area in the showcase navigator.

## Status

🟢 Active — shipped 2026-05-15 (Wave 15, strategy-correct rebuild).

| Build target | Hash | Status |
| --- | --- | --- |
| `falcon-ui-core` | (multi-task) | ✅ green |
| `admin-console` | `313ac9c0d70d3886` | ✅ green |
| `host-shell` | `6cf9ad63b1444470` | ✅ green |

## Predecessor

This component replaces the wrong-path Angular feature component that was prototyped in `libs/falcon/src/shared-ui/lib/components/falcon-insufficient-balance-dialog/` (deleted in this run). That earlier attempt violated the canonical 3-artefact strategy — corrected here.
