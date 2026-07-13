# falcon-badge — OVERVIEW

## Purpose

General-purpose visual indicator (count / status / label). Foundation primitive at Architect §5.12.1. Distinct from `<falcon-status-badge>` (workflow-state palette) and `<falcon-tag>` (chip with optional dismiss).

## Business / UI use case

Generic badge use — count indicator on a menu item ("Notifications 3"), feature flag ("Beta"), semantic label ("New" / "Updated"), inline status pill that doesn't fit the workflow-state vocabulary.

## When to use it

- Count badges (`Inbox 12`).
- Feature flags (`Beta` / `New` / `Updated`).
- Severity-bucketed semantic tags when you want surface treatment (solid/subtle/outline).

## When NOT to use it

- Workflow state on a list row → use `<falcon-status-badge>`.
- Removable chips → use `<falcon-tag dismissible>`.
- Severity-tagged labels with dismissible action → `<falcon-tag>`.

## Status

ACTIVE — Stencil Shadow + Light. Angular wrapper `<falcon-angular-badge>` with dual-render-path (`useTailwind` default `true` → Light DOM). Wave 9.E foundation. The wrapper class is standalone (Angular 21 standalone-by-default; it omits an explicit `standalone: true` flag but uses `imports: []` with no NgModule — `[CODE]` falcon-badge.component.ts:24-30). LOW-ADOPTION (0 production consumers).

## Paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-badge/falcon-badge.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-badge/falcon-badge.component.html` |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-badge/index.ts` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-badge/falcon-badge.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-badge/falcon-badge.css` (~4 KB) |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-badge-tw/falcon-badge-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-badge/falcon-badge.types.ts` |
| Tokens | `libs/falcon-ui-tokens/src/components/badge.tokens.css` (~85 lines) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/badge-tailwind-classes.ts` (consumed by the `-tw` twin) |
| Angular selector | `falcon-angular-badge` |

> Note (2026-06-03): the Shadow `.tsx` has a `.css`, `.types.ts`, and a `readme.md`; there is **no `.utils.ts`** and **no `.spec.ts`/`.e2e.ts`** (verified — zero badge spec files). The compiled `.js`/`.d.ts` artifacts next to the source are build output (the `falcon-badge.js` is a ~160-byte re-export stub — read the `.tsx`, not the stub).

## Consumers

- **0 consumers** of `<falcon-angular-badge>` across `apps/` + `libs/falcon/src` via grep — verified **2026-06-03** (unchanged since the Wave 7 sweep of 2026-05-17).
- Playground / showcase only. Production count badges + feature flags are still hand-rolled with raw Tailwind — adoption remains the open item (see GAPS_AND_UPGRADES.md).

## Related components

- `<falcon-status-badge>` — workflow-state palette (different severity vocabulary, different bucket map)
- `<falcon-tag>` — chip / dismissible severity tag

## Ownership

Stencil + Angular wrapper. The `falcon-badge.tokens.css` file is the SSOT for the 6-variant × 3-appearance matrix.

## Verification
🟢 code-verified — paths, selectors, dual-render default, and the 0-consumer count re-checked against live source on 2026-06-03 (REFRESH of the 2026-05-17 dossier). NOT runtime-verified.
