---
type: pattern
slug: basic-app-sot-parity-tokens
prd-implements: [PRD-06]
status: verified
created: 2026-07-12
---
*** Pattern note — SoT pixel parity + THE falcon token-override mechanism (platform-wide) ***

# SoT Parity and Token Re-pointing

## The mechanism (applies to EVERY falcon component, not just basic-app)
Token sheets (`libs/falcon-ui-tokens/src/components/*.tokens.css`) declare vars via zero-specificity
`:where(falcon-x, falcon-x-tw, falcon-angular-x, …)` **on the consuming inner element**. A custom
property declared on the element itself beats any inherited value → **wrapper-level `[style.--falcon-*]`
bindings silently do nothing**. Working levers:
1. Scoped `:host ::ng-deep <inner-el> { --var: v }` in component styles (real specificity beats `:where()`, survives Stencil re-renders) — comm-mkt-view precedent.
2. `el.style.setProperty()` on the inner element — stencil-prop-patches precedent (must re-run after re-renders).

## Live-verified SoT-exact values (extracted from the RUNNING React SoT, 2026-07-12)
- Send button: `#0d3f44` bg (hover `#0a3338`) · 38px · 13px/600 · 16px inline padding · radius 10
- Panel: white, radius 14 · table header `#F5F5F5`, weight 500, **60px** (cells ride `h-[var(--falcon-table-row-height)]` — scope th/td separately) · body rows **71px**
- Status pills (12px/500 · h22 · dot 6 · gap 6 · pad 4/10/4/8 · radius 999): completed `#d9f2e4/#0f7a3a/#1aab5a` (live value; the doc's `#e7f6ee` was wrong) · in_progress `#e8f1fe/#1d5fc4/#3b82f6` · partial `#fff4e6/#c46a00/#f08c00` · failed `#ffeded/#a1191d/#d92d20` · canceled `#f1f3f5/#5a6470/#adb5bd` · scheduled `#fff8e1/#a67c00/#f2b705` · deleted `#f1f3f5/#868e96/#ced4da`
- Tabs: line-height 21px (channel keeps 18/16 padding → 57px-class strip; sub-tabs 16/14 → 53px-class)
- Tailwind-mode status badge collapses 9 severities into 4 var buckets: `active|paid`→active-* · `pending`→pending-* · `suspended|locked|inactive|disabled`→inactive-* · `deleted|expired`→danger-* — hence `BasicAppStatusPillComponent` keys colors off a `data-status` host attribute.

## Standing customization rule (per [[Architecture Ruling 2026-07-12]])
Feature-side styling like the above is fine INSIDE `apps/basic-app`. If a customization deserves to
live in the library, express it as a **generic, app-agnostic input/flag** on the shared component
(e.g. `static: true|false`) — never an app-named variant or token.

Links: [[00 Basic App MOC]] · [[Feature — Home Transactions]]
