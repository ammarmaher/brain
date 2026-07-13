# falcon-resizable-split-pane — OVERVIEW

> **Single-render pure-Angular shared-ui component** (`libs/falcon/src/shared-ui`). It is NOT a dual-render Stencil component — **no Shadow tag, no `-tw` Light twin**. But UNLIKE the other shared-ui components in B25/B26, it **DOES ship a dedicated `falcon-ui-tokens` component token file** (`resizable-split-pane.tokens.css`) AND uses an inline `styles:` block (`ViewEncapsulation.None`) for CSS that utilities can't express. Rubric dim **B (Stencil dual-render parity)** is **N/A**; dim **E (React/Vue cross-framework parity)** is **N/A** (Angular-only). It is the most architecturally complete shared-ui unit in the batch.

## Component purpose

`[CODE]` falcon-resizable-split-pane.component.ts:1-34 — A **generic two-pane resizable split** with a draggable vertical divider, a CSS-centred grip pill, and **ONE synced vertical scroll**:

```
[LEFT pane: fixed-basis, body transform-mirrored] ⟷ [resizer hit-strip + grip] ⟷ [RIGHT pane: flex-1, owns the single scrollbar]
```

The right pane is the sole scroll region; on scroll, the left stack is translated up by the same amount (rAF mirror), so the two panes stay row-aligned. A wheel over the left pane is forwarded to the right. The divider supports mouse + touch drag, double-click reset, and ArrowLeft/ArrowRight keyboard step, with the left width clamped to `[minLeftWidth, container − rightReserve]`. All geometry decisions go through pure, unit-tested helpers in `falcon-resizable-split-pane.math.ts`.

## Business / UI use case

- The **new-wallet-balance allocation table** (admin Falcon view) — Organizations card (left) ⟷ shared resizer/grip ⟷ Wallet/Transfer values card (right), sharing one vertical scroll so both cards expand/collapse lockstep (`[CODE]` wb-allocation-table.component.html:1-10; comment ts:7-9 "the wallet allocation table is the first consumer and the behavioural oracle").
- `[CODE]` Built in **Wave W3 of the new-wallet-balance Falcon-standard migration (2026-06-02)**, promoted out of the wallet allocation-table so any feature can place two row-aligned panes with a draggable boundary (ts:5-7; index.ts:1-5).

## When to use it / when NOT to use it

**Use it for:**
- Two side-by-side panes that must stay **row-aligned** while sharing ONE scrollbar, with a user-draggable boundary (the wallet org-vs-values pattern).
- Any "master/detail" or "two-column ledger" layout where the user should be able to resize the columns and both columns scroll together.

**Do NOT use it for:**
- A simple non-resizable two-column layout → use plain flex/grid.
- Two independently-scrolling panes → this enforces a single synced scroll (right owns it).
- A horizontal (top/bottom) split → it is vertical-divider only (left/right).
- More than two panes → it is strictly two (`[slot=left]` / `[slot=right]`, plus an optional `[slot=left-header]`).

## Status

**ACTIVE / SHARED / NEW (W3 wave).** `[CODE]` Created 2026-06-02 as part of the new-wallet-balance Falcon-standard migration; promoted from the wallet allocation table so it is reusable (ts:1-7, index.ts:1-5). Not deprecated. The wallet allocation table is its first consumer and behavioural oracle.

## Replaces

- `[CODE]` The bespoke resizer/scroll machinery formerly inline in `apps/admin-console/.../wb-allocation-table.component.ts` (the math header notes a "1:1 port of the wallet allocation-table resizer/scroll machinery", math.ts:8-16). It extracted that logic into a reusable shared component + a pure math core.

## Source file paths

| Layer | Path |
|---|---|
| Angular component TS (+ inline `styles:`) | `libs/falcon/src/shared-ui/lib/components/falcon-resizable-split-pane/falcon-resizable-split-pane.component.ts` (307 ln; `ViewEncapsulation.None`, inline `styles` block ts:78-128) |
| Angular component HTML | `libs/falcon/src/shared-ui/lib/components/falcon-resizable-split-pane/falcon-resizable-split-pane.component.html` (79 ln) |
| Pure math core | `libs/falcon/src/shared-ui/lib/components/falcon-resizable-split-pane/falcon-resizable-split-pane.math.ts` (105 ln — DOM-less, unit-testable) |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-resizable-split-pane/index.ts` (18 ln — exports component + 8 math fns + `SplitPaneClampConfig`) |
| **Component token file** | `libs/falcon-ui-tokens/src/components/resizable-split-pane.tokens.css` (131 ln; `:where(falcon-resizable-split-pane, .falcon-resizable-split-pane, [data-falcon-resizable-split-pane])` — gate-12 compliant) |
| Shared-ui re-export | `libs/falcon/src/shared-ui/index.ts:174` (`export * from './lib/components/falcon-resizable-split-pane'`) |
| Component `.css`/`.scss` file | **NONE separate** — CSS lives in the inline `styles:` block (ts:78-128) + the token file. |
| Stencil Shadow / `-tw` twin | **NONE** — single-render pure-Angular component. |
| Spec / tests | `[CODE]` The component itself has **no `*.spec.ts`** in this folder (Glob 2026-06-03), but the math core is described as covered by a "split-pane-math.spec" (math.ts:1-5, 99-101) — see GAPS G1. |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-resizable-split-pane` |
| Content slots | `[slot=left-header]` · `[slot=left]` · `[slot=right]` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-resizable-split-pane` across the workspace = **1 render site / 1 file** (plus the component's own source + the two token-CSS files):

- `apps/admin-console/src/app/features/new-wallet-balance/components/wb-allocation-table/wb-allocation-table.component.html:10` — the wallet Organizations ⟷ Values split (the behavioural oracle).

`[CODE]` Also referenced (non-render) in:
- `apps/admin-console/.../new-wallet-balance/new-wallet-balance.component.ts` — sets `--falcon-split-pane-grip-shadow` override on its instance.
- `libs/falcon-ui-tokens/src/components/wallet.tokens.css` + `resizable-split-pane.tokens.css` — the token contract + the wallet's grip-shadow override token.
- `apps/admin-console/.../wb-allocation-table/wb-allocation-table.component.ts` — wires the consumer.

> `[CODE]` **0 consumers in `libs/falcon`.** Adoption = 1 (the wallet alloc-table) because it is a brand-new W3 extraction. The prompt's "used by new-wallet-balance drawer + alloc-table" is **partially confirmed**: the live render site is the **alloc-table**; the wallet **drawer** is NOT a current render site (no `<falcon-resizable-split-pane` in a drawer component — see USAGE Consumer Sweep).

## Related components

- **Extracted from / oracle:** the wallet allocation table (`wb-allocation-table`).
- **Consumed within:** the `new-wallet-balance` feature (admin), which also overrides its grip-shadow token at its own scope (`new-wallet-balance.component.ts`; wallet.tokens.css `--falcon-wallet-grip-shadow`).
- **Sibling shared-ui:** `<falcon-node-details-section>`, `<falcon-page-skeleton>` (B26), `<falcon-info-card>`, `<falcon-view-toggle>` (B25) — all single-render pure-Angular, but THIS is the only one with a token file + inline `styles` + a math core.

## Ownership / responsibility

`libs/falcon/src/shared-ui` (component) + `libs/falcon-ui-tokens` (token contract). `[CODE]` Built W3 of the new-wallet-balance migration (ts:4-7). Token SSOT documented to cascade from `libs/falcon-theme/src/falcon-tailwind-tokens.css` (resizable-split-pane.tokens.css:11-13).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26 sweep, NEW dossier). Source confirmed: component (307 ln, `ViewEncapsulation.None`, inline `styles`) + HTML (79 ln) + pure math core (105 ln) + barrel + a real `resizable-split-pane.tokens.css` (131 ln, gate-12 `:where`). Consumer sweep: 1 render site (wb-allocation-table.component.html:10), 0 in `libs/falcon`; the wallet drawer is NOT a render site (corrects the prompt's "drawer + alloc-table" — only the alloc-table renders it).
