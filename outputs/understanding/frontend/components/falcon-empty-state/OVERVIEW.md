# falcon-empty-state — OVERVIEW

## Purpose

The **minimal** empty-state placeholder: a centred icon (Falcon icon-font) + a `<h3>` title + an optional `<p>` description + a projected `slot="action"`. Architect §5.12.1 foundation, Wave 9.E. The lighter, card-less sibling of `<falcon-empty-data>` (the decorated themed card). `[CODE]` falcon-empty-state.tsx:1-3.

## Business / UI use case

"No users found", "You cannot add a user here", "No results match your search", "Welcome — invite teammates to get started" — any state where a list/panel has no data (or an action is unavailable) and the user needs a compact, slot-projected nudge **without** the full card chrome of `<falcon-empty-data>`.

## When to use it

- A compact zero-state where you want to **project your own action** (any content via `slot="action"`) — a `<falcon-angular-button>`, two buttons, a link.
- A zero-state that needs **heading semantics** (`<h3>` title) for the document outline.
- An "action unavailable" explainer inside a wizard/drawer (e.g. "you cannot add a user at this node").
- An empty data-table cell projected via `<ng-template falconDataTableEmpty>` when you want the minimal look rather than the auto-mounted `<falcon-empty-data>` card.

## When NOT to use it

- A **decorated** empty card with a disc, glossy gradient, built-in CTA button and info chip → use `<falcon-empty-data>` (the richer sibling; also what the data-table auto-mounts via `[emptyData]`).
- Loading states (use the table `[loading]` skeleton).
- Error states (no `error` variant; FES-04).
- Permanent labels / static UI.

## Status

**ACTIVE** — Stencil Shadow `<falcon-empty-state>` + Light `<falcon-empty-state-tw>` + Angular wrapper `<falcon-angular-empty-state>` (dual-render-path via `useTailwind`). NOT deprecated; it is the minimal-tier counterpart to `<falcon-empty-data>`.

## Paths

| Layer | Path |
|---|---|
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-empty-state/falcon-empty-state.tsx` (63 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-empty-state/falcon-empty-state.css` (93 ln — token-driven) |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-empty-state-tw/falcon-empty-state-tw.tsx` (54 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-empty-state/falcon-empty-state.types.ts` (`FalconEmptyStateSize`) |
| Tokens | `libs/falcon-ui-tokens/src/components/empty-state.tokens.css` (56 ln) |
| Tailwind helpers | `libs/falcon-ui-core/src/tailwind/empty-state-tailwind-classes.ts` (77 ln) |
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-state/falcon-empty-state.component.ts` (66 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-state/falcon-empty-state.component.html` (21 ln — pure tag-switcher) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-empty-state/index.ts` |
| Angular selector | `falcon-angular-empty-state` |
| Spec/tests | _none found_ — `[CODE]` no `*.spec.ts` / `*.e2e.ts` (FES test gap) |

## Consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-empty-state>` across `apps/` = **3 files** (UP from "1" at Wave 7):
- `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html:53` — "you cannot add a user here" explainer (`iconName="user-x"`, `size="md"`, no action).
- `apps/management-console/.../add-user-wizard/add-user-wizard.component.html:53` — same explainer in mgmt.
- `apps/management-console/.../new-wallet-balance/new-wallet-balance.component.ts:155` — no-data block (`iconName="building"`, `size="md"`, no action).

`[CODE]` NOT re-exported from `libs/falcon/src/shared-ui/index.ts` (only `<falcon-angular-empty-data>` is). The `user-details-page.component.html:228` "empty-state" hit is a **code comment**, not a render.

## Related components

- **Richer sibling:** `<falcon-empty-data>` — themed card (dashed border + glossy gradient + disc + built-in CTA button + info chip + table/page modes). The data-table auto-mounts THAT one via `[emptyData]`, not this. The two are complementary fidelity tiers, NOT duplicates (see GAPS_AND_UPGRADES reconcile note).
- `<falcon-data-table>` — composes this only via the manual `<ng-template falconDataTableEmpty>` projection (the auto-mount path uses `<falcon-empty-data>`).
- `<falcon-angular-button>` — typical action projected into `slot="action"`.

## Ownership

`libs/falcon-ui-core`. Wave 9.E / Architect §5.12.1 foundation. Token contract in `libs/falcon-ui-tokens`. The Stencil component declares one `action` slot.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 refresh). Consumer count corrected 1 → 3 (add-user-wizard ×2 + new-wallet-balance, grep-verified); the richer/lighter relationship to `<falcon-empty-data>` clarified (prior dossier mislabelled empty-data as the "lighter" one); icon-font (not inline-SVG) render confirmed; spec gap re-confirmed.
