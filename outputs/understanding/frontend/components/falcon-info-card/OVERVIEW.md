# falcon-info-card — OVERVIEW

## Component purpose

`[CODE]` falcon-info-card.component.ts:1-20 — A **reusable read-only "details" card**: a bordered, rounded card with a bold header bar (bottom divider) and an N-column **label/value field grid** below. Plain text fields are data-fed via `[fields]`; any non-text cells (status chips, multi-selects, …) are projected as `<ng-content>` and flow into the same grid. **Display-only** — no `ngModel`, no editing.

This is a **single-render pure-Angular shared-ui component** (no Stencil Shadow tag, no `-tw` twin, no tailwind-classes helper, no token file). All styling is inline Tailwind on the template. The falcon-input dual-render layers do **not** exist here — say so, don't fabricate them.

## Is it a duplicate of `falcon-card`? (per task §4 instruction)

`[CODE]` **There is NO `falcon-card` component** — Glob of `libs/falcon/src/shared-ui/lib/components/falcon-card/**` returns nothing, and the shared-ui barrel (`shared-ui/index.ts`) has no `falcon-card` export. So `falcon-info-card` is **NOT a thin wrapper around `falcon-card`** and is **NOT a duplicate of it** — there is nothing to duplicate. It is a **standalone, purpose-built read-only details-grid card.** It is also distinct from a generic "card container" (it bakes a header bar + a label/value grid + responsive column logic; it is not an empty slotted shell). `[INFERRED]` If a generic `<falcon-card>` shell is ever introduced, `falcon-info-card` could be refactored to compose it (header bar + grid as content) — but today no such base exists, so no duplication concern. **Verdict: not a duplicate; keep as-is.**

## Business / UI use case

`[CODE]` Both live consumers are in the **Templates** feature (admin + management consoles):
- **Templates details view** (`templates-details.component.html:82-110`) — the read-only "Template details" card: 4-column grid of plain fields (name, channel, language, …) via `[fields]`, PLUS projected non-text cells (a `<falcon-status-chip>` for status, a full-width Shared-With multi-select).
- **Templates wizard Step 3 (Share/Submit review)** (`step3-share-submit.component.html:9-13`) — the read-only "review Steps 1-2" card: a 2-column data-only grid of the values the operator entered, shown before submit.

`[CODE]` ts:19-20 — labels/values are passed **already-resolved** (the consumer translates), mirroring the `<falcon-node-details-section>` convention.

## When to use it / when NOT to use it

**Use it for:**
- A **read-only "details / summary / review"** panel: a titled card with a grid of label→value pairs.
- The same panel when a few cells are non-text (status chip, badge, multi-select) — project those as `<ng-content>` cells into the grid.
- Wizard "review before submit" steps and entity "details" views.

**Do NOT use it for:**
- **Editable** forms — it has no inputs, no CVA. Use form controls (`<falcon-angular-input>` etc.) for editing.
- A node identity header (avatar + name + actions) → use `<falcon-node-details-section>`.
- A generic empty card shell / arbitrary card content → there is no `<falcon-card>` today; `falcon-info-card` is opinionated (header + label/value grid). For free-form card content, project everything as `<ng-content>` cells (works, but the header bar + grid chrome are always present).
- A data table / list → use `<falcon-angular-data-table>` / `<falcon-angular-table>`.

## Status

`[CODE]` shared-ui/index.ts:192-196 (`export * from './lib/components/falcon-info-card'`) — **ACTIVE / SHARED.** Extracted from the Templates details card (`.tpl-details-card`) for cross-feature reuse (ts comment + barrel comment). 4 live render sites. Not deprecated.

## Replaces

- `[CODE]` shared-ui/index.ts:192-196 — replaced the Templates feature's bespoke `.tpl-details-card` markup with a shared component.

## Source file paths

> Single-render Angular shared-ui component — three source files. No `.css`, no Stencil `.tsx`/`-tw`, no tailwind helper, no token file.

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon/src/shared-ui/lib/components/falcon-info-card/falcon-info-card.component.ts` (63 ln) |
| Angular component HTML | `libs/falcon/src/shared-ui/lib/components/falcon-info-card/falcon-info-card.component.html` (29 ln) |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-info-card/index.ts` (exports class + `FalconInfoCardField` + `FalconInfoCardColumns`) |
| Library re-export | `libs/falcon/src/shared-ui/index.ts:192-196` |
| Component CSS | **(none — inline Tailwind in .html)** |
| Stencil / `-tw` / tailwind helper / token file | **(none — not a dual-render component)** |
| Spec / tests | **(none found)** — GAP G1. |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-info-card` `[CODE]` falcon-info-card.component.ts:34 |
| Stencil tags | none |

> `[CODE]` Host class is `block` (component.ts:39) — a plain block element; the bordered card is the inner `<div class="bg-white ... border ... rounded-lg">` (html:7-9).

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-info-card[\s>]` across `apps/` = **4 render sites** (2 admin-console + 2 management-console — identical in both apps), all in the **Templates** feature. **0 render consumers under `libs/falcon/`** (only the component's own source). TS-import sites: `templates-details.component.ts` + `step3-share-submit.component.ts` in both apps (import `FalconInfoCardComponent`).

- `apps/admin-console/src/app/features/templates-page/components/templates-details/templates-details.component.html:82`
- `apps/admin-console/src/app/features/templates-page/components/templates-wizard/steps/step3-share-submit.component.html:9`
- `apps/management-console/src/app/features/templates-page/components/templates-details/templates-details.component.html:82`
- `apps/management-console/src/app/features/templates-page/components/templates-wizard/steps/step3-share-submit.component.html:9`

See `USAGE.md` Consumer Sweep for details.

## Related components

- **Convention sibling:** `<falcon-node-details-section>` (`[CODE]` ts:19-20 — info-card "mirrors the `<falcon-node-details-section>` convention" of passing pre-resolved labels/values). Node-details-section is the avatar+label+actions header; info-card is the label/value details grid. Complementary, not overlapping.
- **Projected into it (live):** `<falcon-status-chip>` (status cells, templates-details.component.html:95/105) + a Shared-With multi-select.
- **NOT related to a `falcon-card`** — none exists (see "Is it a duplicate?").
- **Sibling shared-ui promotions:** `<falcon-view-toggle>`, `<falcon-org-node-header>` (this batch), `<falcon-status-chip>`.

## Ownership / responsibility

`libs/falcon/src/shared-ui` (Falcon shared-ui Angular library). Owned by the Falcon FE team. No token contract.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Source-file table confirmed (3 files, no `.css`/Stencil/token layers). **No `falcon-card` exists** (Glob empty + no barrel export) → info-card is NOT a duplicate/wrapper; it is a standalone read-only details-grid card. Consumer sweep `<falcon-info-card[\s>]` → 4 app render sites (Templates feature), 0 in `libs/falcon`. NEW dossier — created from scratch.
