# falcon-empty-state — GAPS & UPGRADES

## Missing capabilities

### Not composed by default in `<falcon-table>` core

- The Stencil `<falcon-table>` renders a bare text-only empty cell (`<td>{emptyMessage}</td>`). It does NOT compose `<falcon-empty-state>` by default. Consumers reach this via `<ng-template falconDataTableEmpty>` projection only. **P2 — wire the table to compose this primitive automatically when an `emptyStateIconName`/`emptyStateDescription` input is supplied. See `falcon-table` FT-05.**

### No usage in production

- Zero direct consumer in `apps/` (grep). All current empty states are bare strings.

### Image / illustration variant

- The component supports an icon name only — no illustration (SVG / image) variant. **P3 — add `[illustrationUrl]` or `<slot name="illustration">` for product-marketing-grade zero states.**

### Action slot is single-region

- One `<slot name="action">` for buttons. Multiple buttons sit side-by-side. Layout (column vs row) is fixed by the component. **P3 — add `[actionLayout]="'row'|'column'"`.**

### No "error variant"

- Empty state is presentational and could double as a generic error state with a different icon. Today no `[variant]="'empty'|'error'|'success'|'info'"` driver. **P3 — add variant input + token surface per variant.**

### A11y

- `role="img"` + `aria-label={titleText}` is set on the root, with `ariaLabel` prop override on Stencil only. **P3 — expose `[ariaLabel]` on Angular wrapper for parity.**

### Tests

- No specs. **P3** — pure presentational.

## Reusable upgrades needed

| ID | Title | Priority |
|---|---|---|
| FES-01 | Auto-compose inside `<falcon-table>` empty cell | **P2** |
| FES-02 | Illustration slot | **P3** |
| FES-03 | `[actionLayout]` input | **P3** |
| FES-04 | `[variant]` input for error / success / info | **P3** |
| FES-05 | Expose `[ariaLabel]` on Angular wrapper | **P3** |

## Workarounds available

- Auto-compose: today consumer must project `<ng-template falconDataTableEmpty>` per table.
- Illustration: drop down to Stencil and use a custom slot if you want a non-icon visual.

## Visual / interaction risks

- Default heading `<h3>` may collide with the consumer page's heading hierarchy. Consumer should ensure the H3 fits the document outline.

## Future-proof recommendation

Add an `[emptyState]` input on `<falcon-angular-data-table>` that auto-composes this primitive without requiring a template projection — most empty states need the same icon + title + description + action shape, so a shorthand reduces boilerplate.

## Wave 7 Findings (2026-05-17)

**Consumer count: 1** ([CODE] grep `<falcon-angular-empty-state>` across `apps/` + `libs/falcon/`). See `USAGE.md` for the file list.

No new structural gaps detected by Wave 7 sweep beyond items already listed above.

## RECONCILE NOTE — `falcon-empty-state` vs `falcon-empty-data` (B12)

`[CODE]` These two overlap in *intent* (both are "empty state" visuals) but are **NOT duplicates** — the source is explicit (`falcon-empty-data.tsx:4-5`: *"Distinct from `<falcon-empty-state>` (the minimal icon+title+description placeholder)"*). They are two fidelity tiers:
- **`<falcon-empty-state>` (this) = minimal tier** — icon-font glyph + `<h3>` + `<p>` + a *projected* `slot="action"`. No card, no built-in button, no info chip, no output. 3 consumers (minimal explainers).
- **`<falcon-empty-data>` = card tier** — dashed-border card + glossy gradient + tinted SVG disc + built-in CTA `<button>` (`(actionClick)`) + info chip + table/page modes + config-service defaults. Auto-mounted by the data-table `[emptyData]` shorthand; broadly adopted.

**Verdict (reconcile-flag): keep both; deprecate neither.** The duplication is in *naming* (both read "empty…"), which risks mis-selection — NOT in capability. Selection rule (now in DECISION/RECOGNITION): minimal/slot-projected/heading-semantics → `empty-state`; decorated card / data-table empty → `empty-data`. A *merge* would be a large breaking refactor (touches the data-table integration + 3 empty-state consumers) → **HIGH-RISK-QUEUE**, do not undertake without approval. (Full table lives in `falcon-empty-data/GAPS_AND_UPGRADES.md`.)

## FES-01 status update (B12)

`[CODE]` FES-01 ("auto-compose THIS inside the `<falcon-table>` empty cell") is effectively **superseded**: the data-table's auto-mount path (`falcon-data-table.component.ts:1056-1083`) mounts `<falcon-empty-data>` (the card sibling), NOT `<falcon-empty-state>`, when `[emptyData]` is set. So the "rich auto-empty in a table" need is met by empty-data. `<falcon-empty-state>` reaches a table only via the explicit `<ng-template falconDataTableEmpty>` projection. FES-01 should be re-scoped/closed accordingly.

## Deep-Dive Sweep Findings (2026-06-03 — B12)

**Consumer count: 3** ([CODE] grep `<falcon-angular-empty-state>` across `apps/`; not re-exported from `libs/falcon`). See `USAGE.md`.

- **Consumer count corrected 1 → 3** (add-user-wizard ×2 + new-wallet-balance) — all minimal/action-less.
- **Reconcile flag raised** vs `<falcon-empty-data>` (above) — fidelity tiers, not duplication; neither deprecated. HIGH-RISK-QUEUE (merge/governance) row in FINDINGS/B12.md.
- **FES-01 superseded** by the data-table → empty-data auto-mount (above).
- **Token/dossier drift fixed** — font is `--font-sans` (not `--font-display`), icon color neutral-400 (not teal-500), token name `-title-size` (not `-title-font-size`); the RECOGNITION sibling row was wrong (empty-data is the RICHER tier). All `safe-local` (doc).
- No deletion/promotion flag — component stays ACTIVE (minimal tier).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 refresh). Consumer count 1→3; reconcile flag + FES-01-superseded recorded; doc/token drift corrected. No deletion/promotion flags.
