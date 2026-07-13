# falcon-page-skeleton — OVERVIEW

> **Single-render pure-Angular shared-ui component** (`libs/falcon/src/shared-ui`). It is NOT a dual-render Stencil component — **no Shadow tag, no `-tw` Light twin, no `falcon-ui-tokens` component file**. Styling is an inline Tailwind template string on the `@Component` (no external `.html`/`.css`/`.scss`). Rubric dims **B (Stencil dual-render parity)** and **E (React/Vue cross-framework parity)** are **N/A** — restated in API.md / TOKENS.md.

## Component purpose

`[CODE]` falcon-page-skeleton.component.ts:1-12 — A **flat, animated page-loading skeleton** that mimics the org-hierarchy / templates workspace layout while data loads: a left tree pane (indented shimmering rows) + a right "main" card (tab strip + node header + a data table with shimmering rows and status pills + a footer). Every shape is a `bg-…/animate-pulse` placeholder block. It exists so a feature can show a structurally-faithful placeholder during its initial fetch instead of a blank screen or a spinner.

`[CODE]` It is a **verbatim duplicate** of the app-local `app-org-hierarchy-skeleton` (`apps/admin-console/.../org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts`), promoted byte-equivalent into shared-ui "for Templates alignment" so the loading state is pixel-identical across the org-hierarchy and Templates features (ts:2-9). A `TODO` (ts:11-12) marks the intent to deduplicate by migrating Hierarchy onto this shared component later.

## Business / UI use case

- The **Templates** page (list view) loading placeholder in BOTH consoles — shown as an absolutely-positioned overlay while the templates list loads (`[CODE]` templates-list.component.html:8-12).
- `[INFERRED]` Intended to also back the org-hierarchy loading state once the dedup `TODO` lands (it is currently the COPY of that skeleton, not yet the source).

## When to use it / when NOT to use it

**Use it for:**
- A full-page loading placeholder on a **tree + table** workspace layout (org-hierarchy / Templates shape).
- A "structural shimmer" while the page's initial data loads, where a generic spinner would feel jarring.

**Do NOT use it for:**
- A loading state whose layout is NOT the tree+table workspace shape — this skeleton is hardcoded to that specific layout (no inputs to reshape it; GAP G2). A different page shape needs a different skeleton.
- Per-row / per-cell loading inside an already-rendered table — this is a whole-page overlay, not an in-table skeleton (the data table does a hard content-swap, see INTEGRATION_VALIDATION).
- A small inline placeholder (a single field/avatar loading) — overkill; use a small shimmer block.

## Status

**ACTIVE / SHARED — but a known DUPLICATE (dedup pending).** `[CODE]` ts:2-12 — deliberately byte-equivalent to `app-org-hierarchy-skeleton`; the header comment itself flags the duplication and a `TODO` to deduplicate "in a future commit (out of scope for the Templates-alignment pass)." Not deprecated; actively rendered by Templates. The duplication is **intentional + documented**, not accidental drift.

## Replaces

- `[CODE]` Nothing — it is a **copy** of `app-org-hierarchy-skeleton` (ts:3-9), created to give Templates the same loading look. It does not yet replace the original (that is the pending `TODO`).

## Source file paths

| Layer | Path |
|---|---|
| Angular component TS (template inline) | `libs/falcon/src/shared-ui/lib/components/falcon-page-skeleton/falcon-page-skeleton.component.ts` (192 ln — inline `template:` string, no external HTML) |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-page-skeleton/index.ts` (3 ln) |
| Shared-ui re-export | `libs/falcon/src/shared-ui/index.ts:190` (`export * from './lib/components/falcon-page-skeleton'`) |
| Component HTML / CSS / SCSS | **NONE** — `template:` is inline on the decorator; no external `.html`/`.css`/`.scss` (Glob 2026-06-03). |
| Stencil Shadow / `-tw` twin | **NONE** — single-render pure-Angular component. |
| `falcon-ui-tokens` component file | **NONE** — no `page-skeleton.tokens.css`. |
| Original it duplicates | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` (`app-org-hierarchy-skeleton`) `[CODE]` ts:3-6 |
| Spec / tests | **NONE** (`*.spec.ts` Glob empty 2026-06-03) — GAP G1. |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-page-skeleton` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-page-skeleton` across the workspace = **2 render sites / 2 files** (both Templates list, one per console):

- `apps/admin-console/src/app/features/templates-page/components/templates-list.component.html:10` — `<falcon-page-skeleton [forceVisible]="true" />` inside an `@if (showSkeleton())` absolute overlay (`bg-falcon-neutral-75`, `pointer-events-none`).
- `apps/management-console/src/app/features/templates-page/components/templates-list.component.html` — same pattern.

`[CODE]` **0 consumers in `libs/falcon`.** Low adoption (2) because it is a freshly-promoted shared copy and the dedup migration of Hierarchy hasn't happened yet.

## Related components

- **Duplicates:** `app-org-hierarchy-skeleton` (app-local org-hierarchy loading skeleton) — byte-equivalent source.
- **Pairs with:** the consumer's real content (the Templates list / table) which it overlays while `showSkeleton()` / `loading()` is true; the data table itself does a hard content-swap (no per-row skeleton).
- **Sibling shared-ui:** `<falcon-node-details-section>`, `<falcon-info-card>` (B25), `<falcon-view-toggle>` (B25) — all single-render pure-Angular.

## Ownership / responsibility

`libs/falcon/src/shared-ui`. `[CODE]` Promoted for "Templates alignment" (ts:2-9). The dedup `TODO` (ts:11-12) is owned by whoever migrates Hierarchy onto it. No token contract.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26 sweep, NEW dossier). Source confirmed: single 192-line TS with an inline `template:` (no external HTML/CSS/SCSS, no Stencil twin, no token file). Verbatim-duplicate provenance + dedup `TODO` read from ts:1-12. Consumer sweep: 2 render sites (admin + mgmt Templates list), 0 in `libs/falcon`.
