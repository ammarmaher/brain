# falcon-resizable-split-pane — USAGE

## Real usage examples (active codebase)

### Example 1 — The behavioural oracle: wallet Organizations ⟷ Values split

`[CODE]` `apps/admin-console/src/app/features/new-wallet-balance/components/wb-allocation-table/wb-allocation-table.component.html:1-77`:

```html
<falcon-resizable-split-pane
  class="flex flex-1 min-h-0 w-full"
  [class.wb-no-xfer]="!canTransferRows()"
  [resizerAriaLabel]="'newWalletBalance.resizeColumns' | translate"
  [resizerTitle]="'newWalletBalance.resizeHint' | translate"
>
  <!-- LEFT card: Organizations — STATIC header (outside the mirrored scroll) -->
  <div slot="left-header" class="... bg-[var(--falcon-wallet-head-bg)] ... rounded-t-[var(--falcon-wallet-table-card-radius)]">
    {{ 'newWalletBalance.organizations' | translate }}
  </div>

  <!-- LEFT card body: Organizations rows (transform-mirrored to the right scroll) -->
  <div slot="left" class="grow min-w-max ... border-t-0 rounded-b-[var(--falcon-wallet-table-card-radius)]">
    @for (row of tableRows(); track row.id; let rowIdx = $index) { ... org rows ... }
  </div>

  <!-- RIGHT card: Wallet/Transfer values — the single scroll region (sticky head + rows) -->
  <div slot="right"> ... values card sticky header + rows ... </div>
</falcon-resizable-split-pane>
```

This is the canonical usage: a **static left header** in `[slot=left-header]` (stays put while the body scrolls), **mirrored left rows** in `[slot=left]`, and the **single scroll region** in `[slot=right]` (sticky header + values rows). Both cards iterate the SAME `tableRows()` so chevron expand/collapse updates both lockstep (comment html:2-4). The resizer label/title are translated strings.

### Example 2 — Per-instance token override (grip shadow → wallet SoT)

`[CODE]` `apps/admin-console/.../new-wallet-balance/new-wallet-balance.component.ts` sets, on the wallet's split-pane instance:

```ts
// (host-scoped style)
--falcon-split-pane-grip-shadow: var(--falcon-wallet-grip-shadow);
```

`[CODE]` resizable-split-pane.tokens.css:41-48 documents this: the component DEFAULTS its grip shadow to the platform action-overlay token (`--shadow-falcon-uploader-action`, `0 2px 6px rgba(0,0,0,.18)`); the wallet's SoT grip is `0 1px 5px rgba(0,0,0,.2)`, so for pixel-parity the wallet feature **overrides the default at its own scope** (the `--falcon-wallet-grip-shadow` token is therefore LIVE, not dead). This is the textbook per-instance token override the `:where()` (specificity-0) scope enables.

## Recommended usage for NEW Angular pages

```html
<falcon-resizable-split-pane
  class="flex flex-1 min-h-0 w-full"
  [leftDefaultWidth]="320"
  [leftMinWidth]="200"
  [rightReserveWidth]="280"
  [(leftWidth)]="splitLeftWidth"
  [resizerAriaLabel]="'common.resizeColumns' | translate"
  (resize)="onSplitResize($event)"
  (resetWidth)="onSplitReset()"
>
  <div slot="left-header"> <!-- optional static left header --> </div>
  <div slot="left"> <!-- left rows; will mirror-scroll with the right --> </div>
  <div slot="right"> <!-- the ONE scroll region: sticky header + body --> </div>
</falcon-resizable-split-pane>
```

Add `FalconResizableSplitPaneComponent` to `imports: []`. Put ALL scrollable content in `[slot=right]`; the left pane never scrolls itself (it mirrors). Use `[(leftWidth)]` only if you need to persist/restore the column width; otherwise omit it and the component manages it internally (starting from `leftDefaultWidth`).

## Reactive Forms / ngModel

**N/A** — not a form control. The width is a `model()` (`[(leftWidth)]`), not an `ngModel` form value.

## Tailwind-only usage

`[CODE]` The host base is `falcon-resizable-split-pane flex flex-1 min-h-0 min-w-0` (ts:75). Add layout utilities on the host `class=` (e.g. `flex-1 min-h-0 w-full`, as the wallet does). The internal geometry/colours come from the `--falcon-split-pane-*` tokens — do not hand-roll Tailwind to override them; override the tokens instead (Example 2).

## Per-instance token override

`[CODE]` Add a host class (or inline style) on the consumer that mutates `--falcon-split-pane-*` tokens. The token file is scoped under `:where(...)` (specificity 0), so per-instance overrides win. The most common override is the grip shadow (Example 2). Others worth knowing (resizable-split-pane.tokens.css):
- `--falcon-split-pane-left-default-w` / `-left-min-w` / `-right-reserve-w` (geometry; though the numeric `@Input`s are the primary path).
- `--falcon-split-pane-grip-bg` / `-grip-width(-active)` / `-grip-height(-active)` / `-grip-opacity(-active)` (grip look).
- `--falcon-split-pane-gap` (gap between panes + resizer; wallet uses 0).

## Do / Don't

| Do | Don't |
|---|---|
| Put ALL scroll content in `[slot=right]`. | Try to scroll the left pane independently — it mirrors the right (its own scrollbar is hidden). |
| Use `[slot=left-header]` for a header that must NOT scroll. | Put the left header inside `[slot=left]` if it should stay fixed. |
| Drive geometry via the numeric `@Input`s (`leftDefaultWidth` etc.). | Hardcode pixel widths in Tailwind on the panes. |
| Override the look via `--falcon-split-pane-*` tokens (e.g. grip shadow). | Hand-roll Tailwind to recolour the grip/resizer. |
| Pass translated `resizerAriaLabel`/`resizerTitle`. | Pass raw English (it's rendered as-is — no internal i18n). |
| Use `[(leftWidth)]` only to persist/restore width. | Bind `[leftWidth]` one-way and expect the drag to also work (the drag writes back via the model — use two-way or omit). |
| Let the grip centre itself via CSS. | Reintroduce JS grip placement — the CSS-centred grip fixed the old `position:fixed` bug. |

## Consumer Sweep (2026-06-03)

`[CODE]` grep `<falcon-resizable-split-pane` across the workspace → **1 render site / 1 file**; **0 in `libs/falcon`**:

- `apps/admin-console/.../new-wallet-balance/components/wb-allocation-table/wb-allocation-table.component.html:10` — the wallet Organizations ⟷ Values split (behavioural oracle).

Non-render references (token/wiring, not a second render site):
- `apps/admin-console/.../new-wallet-balance/new-wallet-balance.component.ts` — grip-shadow token override (Example 2).
- `apps/admin-console/.../wb-allocation-table/wb-allocation-table.component.ts` — consumer wiring.
- `libs/falcon-ui-tokens/src/components/wallet.tokens.css` + `resizable-split-pane.tokens.css` — token contract + override token.

> `[CODE]` Adoption = **1** (brand-new W3 extraction). **Correction to the task brief:** the brief says "used by new-wallet-balance **drawer** + alloc-table" — the live render site is the **alloc-table only**; there is **no `<falcon-resizable-split-pane>` render in any wallet drawer component** (grep confirms). The wallet drawer uses other layout primitives; the split-pane is the alloc-table's resizer.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26). Example 1 confirmed at wb-allocation-table.component.html:1-77 (3 slots, same-`tableRows()` lockstep). Example 2 (grip-shadow override) cross-confirmed against resizable-split-pane.tokens.css:41-48 + new-wallet-balance.component.ts. Consumer Sweep re-run (`<falcon-resizable-split-pane` → 1 render site + 0 in libs/falcon); the "drawer" consumer in the brief is NOT a render site (corrected).
