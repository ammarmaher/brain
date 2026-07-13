# falcon-info-card — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — No tests (P1)

`[CODE]` There is **no `falcon-info-card.component.spec.ts`** (the folder has only `.ts`/`.html`/`index.ts`). Untested: `gridClass()` mapping for `columns` 2/3/4 (the JIT-literal logic, ts:54-62), `fullWidth` → `col-span-full`, `@for track f.label` rendering, and that projected `<ng-content>` cells append after `[fields]`. A signals-only OnPush component is trivial to unit-test.

**Recommended fix (P1):** add `falcon-info-card.component.spec.ts` — cover (a) each `columns` value yields the right `lg:grid-cols-*` literal; (b) `fields` render in order with label/value text; (c) `fullWidth` adds `col-span-full`; (d) projected content renders inside the grid after fields.

### G2 — `title`/`label`/`value` not translated (by design — document) (P3)

`[CODE]` ts:19/42 — the component takes pre-resolved strings and does NOT pipe `translate`. This is a deliberate convention (mirrors `<falcon-node-details-section>`), but it is a foot-gun: a consumer passing an i18n key shows the raw key. Worth a prominent doc note (done in API/USAGE/INTEGRATION). No code change needed unless the team wants an optional `translateKeys` mode.

### G3 — No loading / empty / error state (P2)

`[CODE]` The card always renders its chrome + whatever `[fields]` it's given. There is no built-in **loading skeleton** (for while the entity is fetching), no **empty state** (when `fields=[]` and no projected content — it renders an empty grid), and no error state. Consumers must handle loading/empty around the card (the live templates-details wraps it in an `@if (template(); as tpl)` / loading branch).

**Recommended fix (P2):** add optional `@Input() loading = false` (render a token-driven row-skeleton) and an `@Input() emptyText?` (or compose `<falcon-angular-empty-data>` when `fields` is empty + no projected content).

### G4 — Header is a non-semantic `<div>`, not a heading (P2 — a11y)

`[CODE]` html:10-14 — the card title is a styled `<div>` with no `role="heading"`/`aria-level` and no `<h*>` element. Screen readers don't announce it as a card heading, and it's not in the document outline. (See a11y A1.)

**Recommended fix (P2):** render the title as an `<h3>` (or add `role="heading" aria-level="3"`) + optionally accept an `@Input() headingLevel` so the consumer can fit it into the page outline.

### G5 — No `dense`/`size` axis (P3)

`[CODE]` Fixed `py-4 px-5` grid padding + `py-3.5 px-4` header + `text-sm`/`text-2xs` type. A compact "review" card next to dense content can't be tightened. A `dense` toggle would help.

**Recommended fix (P3):** add `@Input() dense = false` mapping to tighter padding/gap class sets.

### G6 — No token contract / no style hook (P3)

`[CODE]` No `--falcon-info-card-*` token file and no `wrapperClass`/`headerClass` inputs. The card chrome colors + radius + dark-mode are hardcoded inline (cleanly, with tokens — but not customizable). A feature needing a different header bg or a non-default border can't customize without forking. (Lower priority than the other two B25 components because info-card's inline values are already token-utilities, not raw literals.)

**Recommended fix (P3):** if a second visual variant is ever needed, extract `info-card.tokens.css` under `:where(.falcon-info-card, ...)` and read shell/header colors from `--falcon-info-card-*`; or add `headerClass`/`wrapperClass` inputs for layout extras.

### G7 — Fields-then-projected ordering only (P3)

`[CODE]` html:16-28 — `[fields]` cells render first (declaration order), `<ng-content>` cells after. You cannot interleave a projected cell *between* two plain fields. For most details cards this is fine (the live consumers put all chips/multi-selects at the end), but a layout needing a chip in the middle of the field grid can't express it without making everything projected.

**Recommended fix (P3):** allow `FalconInfoCardField` to optionally carry a `TemplateRef` (custom cell) so projected cells can be ordered inline with plain fields. Optional — current ordering covers the live needs.

### G8 — `value` is `string` only (P3)

`[CODE]` ts:26 — `FalconInfoCardField.value: string`. A field that is naturally numeric/boolean/date must be stringified by the consumer (the live builder does `${tpl.creationDate} · ${tpl.creationTime}`). Fine, but a `value: string | number` or a formatter hook could reduce consumer boilerplate. Low priority.

## Missing accessibility features

- **A1 (P2):** the title is a non-semantic `<div>` (G4) — not announced as a heading, not in the outline.
- **A2 (P2):** fields have **no programmatic label↔value association** — they are adjacent `<span>`s, not a `<dl><dt><dd>` and no `aria-labelledby`. AT reads them as separate text fragments, losing the "this label belongs to this value" relationship. Consider a `<dl>` structure (label = `<dt>`, value = `<dd>`).
- **A3 (P3):** projected interactive cells (status chips are non-interactive; the Shared-With multi-select IS) rely on the projected control's own a11y — fine, but document that the card adds no labelling for projected cells (the consumer supplies the label `<span>`).

## Missing tests

- `[CODE]` No spec (G1). Add `falcon-info-card.component.spec.ts`.

## Missing Tailwind / token parity

- `[CODE]` No token file (G6) — but the inline styling IS token-utility-based (no raw literals), so there's no Stencil-twin parity gap and no raw-value debt (unlike org-node-header/view-toggle). The only "parity" item is the absent token contract for a future second variant.

## Performance risks

- `[CODE]` `@for ... track f.label` (html:17) — correctly keyed. `gridClass()` is a cheap `computed()` that only recomputes when `columns()` changes. **No real risk.**

## Visual / interaction risks

- `[CODE]` **Empty grid when `fields=[]` + no projected content** (G3) — renders a header bar over an empty padded grid. A consumer should guard against the all-empty case.
- `[CODE]` **`gridClass()` JIT-literal dependency** (ts:51-62) — a future refactor that builds the class via fragment concatenation would silently break the columns at runtime (Tailwind wouldn't emit the class). The comment warns against it; keep the literals.
- `[CODE]` **Projected cell mis-wrapping** — a bare projected element renders without the cell layout/label; consumers must wrap per the documented pattern.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Add component spec | P1 |
| G3 | Loading / empty state | P2 |
| G4 | Semantic heading for the title | P2 |
| A2 | `<dl>` label↔value association | P2 |
| G5 | `dense` axis | P3 |
| G6 | Token contract / style hook | P3 |
| G7 | Inline-orderable custom cells | P3 |

## Recommended upgrade API (concrete)

```ts
// additive inputs
@Input() loading = false;          // render row-skeleton while fetching
@Input() emptyText?: string;       // shown when fields empty + no projected content
@Input() dense = false;            // tighter padding/gap
@Input() headingLevel: 2 | 3 | 4 = 3;  // render <h{level}> for the title
@Input() headerClass = '';         // header bar extras
// FalconInfoCardField gains: readonly value: string | number;
//                            readonly cell?: TemplateRef<unknown>;  // inline custom cell
```

All additive — no consumer break.

## Fix-shared-vs-per-page

All gaps belong in the **shared component** (`libs/falcon/src/shared-ui/.../falcon-info-card`), not per-page. The four Templates render sites already share it; per-page restyling/loading-handling would re-fragment the extracted card.

## Workarounds (if upgrade blocked)

- For G3 (loading/empty today): the consumer guards with `@if (entity(); as e) { <falcon-info-card …/> } @else { <skeleton/> }` (the live templates-details pattern).
- For G4/A2 (a11y today): none within the card; a consumer cannot inject a heading element. Upstream the fix.
- For G6 (restyle today): none without forking; do NOT add consumer CSS targeting the inner card.

## Deep-Dive Sweep Findings (2026-06-03 — B25)

**Consumer count: 4 app render sites (Templates feature, admin + mgmt) + 0 in `libs/falcon`** (`[CODE]` grep `<falcon-info-card[\s>]`).

- **NEW dossier** — no prior dossier existed; created from scratch. Component stays **ACTIVE / SHARED**.
- **NOT a duplicate of `falcon-card`** — no `falcon-card` exists (Glob empty + no barrel export). info-card is a standalone read-only details-grid card, not a thin wrapper/duplicate (task §4 question answered: not a duplicate).
- **House-rule EXEMPLAR** — info-card is the **cleanest** of the three B25 components: token-utility styling only, NO arbitrary `rgba()`/px literals, dark-mode handled on every surface, no stale comments. Its findings are all `safe-local` and mostly *additive enhancements* (tests, loading state, semantic heading, `<dl>` a11y) rather than debt.
- **No deletion/promotion flags** — correctly promoted; the right home for the details/review-card pattern.
- **No HIGH-RISK items** — see FINDINGS/B25.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25) against falcon-info-card.component.ts (63 ln) + .html (29 ln). Gaps enumerated from live source: no spec (G1), no-translate by design (G2), no loading/empty (G3), non-semantic heading (G4 / a11y A1), no dense (G5), no token contract (G6), fields-then-projected ordering (G7), string-only value (G8); a11y A1 (heading) + A2 (no `<dl>` association). NOT a `falcon-card` duplicate (none exists). All findings `safe-local`; component is the house-rule-clean exemplar of the batch.
