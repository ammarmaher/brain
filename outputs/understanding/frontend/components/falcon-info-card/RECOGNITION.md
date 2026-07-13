# falcon-info-card — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-info-card>` as the component to use, and how to compose it to parity.

## Visual fingerprint

A **bordered, rounded card** with a **bold header bar** (a title with a bottom divider line) and, below it, a **multi-column grid of label→value pairs**: each cell is a small muted label stacked above a slightly-bolder value. The grid is typically 2-4 columns on desktop and collapses to 1-2 on small screens. Some cells may span the full width (a long address, a "shared with" list). Occasionally a cell is not plain text — a coloured **status chip** or a **multi-select** sits where a value would be. It is the canonical "entity details" / "review summary" panel — read-only, no inputs, no buttons of its own.

## Cross-library equivalents

| Library | Their pattern | Parity notes |
|---|---|---|
| MUI | `<Card>` + `<CardHeader title>` + a `<Grid>` of label/value `<Typography>` pairs | Falcon bakes the header bar + responsive grid + label/value styling into one component. |
| Ant Design | `<Descriptions>` (with `<Descriptions.Item label>`) inside a `<Card>` | Ant's `Descriptions` IS this — a labelled read-only grid. Falcon's `[fields]` ≈ `Descriptions.Item`s; `columns` ≈ Ant's `column`. |
| PrimeNG | `<p-card>` + a custom definition-list/grid | Equivalent via composition; Falcon is purpose-built. |
| Bootstrap | `.card` + `.card-header` + a `.row`/`.col` grid or a `<dl class="row">` | Hand-rolled; Falcon tokenizes + handles dark mode. |
| Radix / shadcn | `<Card>` + `<CardHeader>` + a custom `<dl>` grid | shadcn Card is an empty shell; you'd build the grid. Falcon ships it. |
| plain HTML | `<section>` + `<h3>` + `<dl><dt><dd>` grid | The semantic ideal; `falcon-info-card` is close (though it uses `<div>`s, not `<dl>` — a11y A2). |

> **Closest single match: Ant Design `<Descriptions>`.** If a design maps to "a titled read-only grid of label/value pairs", that is `<falcon-info-card>`.

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| a titled read-only grid of label/value pairs (details / review) | `<falcon-info-card>` | — |
| a node identity header (avatar + name + actions) | `<falcon-node-details-section>` | info-card |
| an editable form | form controls (`<falcon-angular-input>`, …) | info-card (no CVA) |
| a tabular list of many rows | `<falcon-angular-data-table>` / `<falcon-angular-table>` | info-card |
| a single status pill | `<falcon-status-chip>` / `<falcon-angular-tag>` (project INTO info-card as a cell) | a card |
| an empty/generic card shell | _(no `<falcon-card>` exists)_ — project free-form content as `<ng-content>` cells (header bar + grid always present) | info-card if you need NO header/grid chrome |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.

1. **Inputs** — `[title]` (pre-resolved string), `[fields]` (`FalconInfoCardField[]` — label/value pairs, translated/formatted in TS), `[columns]` (2/3/4 for the wide layout).
2. **Templates** — none (no `ng-template` inputs). Cells are data-driven (`[fields]`) or projected.
3. **Slots** — one default `<ng-content>` for **non-text cells** (status chips, multi-selects). Wrap each projected cell in `<div class="flex flex-col gap-1">` + a `text-2xs text-falcon-neutral-500` label `<span>` to match the plain-field look. Use `fullWidth` on a field (or `col-span-full` on a projected cell) for long values.
4. **Variants** — none today (no `dense`/`size`). If the design needs a compact card, that is GAP G5.
5. **Token override** — none available (no token file — GAP G6). The chrome colors are fixed token-utilities; a different header bg would need an upstream token contract.
6. **Upgrade** — needs loading skeleton / semantic heading / inline-ordered custom cells? Those are GAPs G3/G4/G7 — raise them rather than forking.
7. **Wrapper** — don't wrap; consume directly. The legitimate "composition" is the `infoFields()` builder in your TS.

## Anti-patterns

- Passing i18n keys as `title`/`label`/`value` — the component does NOT translate; resolve strings in TS (or pipe `[title] | translate`).
- Dropping a bare `<falcon-status-chip>` / control as `<ng-content>` — wrap it in the documented cell `<div>` + label `<span>`, or it renders without the grid-cell layout.
- Flattening a business status into a plain `[fields]` value — project a `<falcon-status-chip>` instead to keep the colour semantics.
- Using it to edit data — it is read-only; use form controls.
- Reusing the same field `label` twice in one card — breaks `@for track f.label`.
- Building the responsive grid classes via dynamic string concatenation (in a refactor) — they MUST be literals for Tailwind's JIT (ts:51-62), or columns silently break.
- Adding consumer `.component.css` rules to restyle the card — breaks the shared-style + no-SCSS rules; there is no token-override path.
- Expecting a `<falcon-card>` base — none exists; info-card is the opinionated details/review card.

## Verification
🟡 CODE-DERIVED from `falcon-info-card.component.ts` + `.html` + the live Templates usage (`infoFields()` builder + projected chips). Sibling routing table cross-checked against `OVERVIEW.md` "When NOT to use it" + the shared-ui barrel (confirmed NO `falcon-card`). Cross-library mapping 🟡 `[INFERRED]` standard-library knowledge (Ant `Descriptions` = closest match, MUI Card+Grid).
