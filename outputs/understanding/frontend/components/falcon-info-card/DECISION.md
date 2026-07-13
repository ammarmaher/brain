# falcon-info-card — DECISION

## Brain SK final recommendation

**STATUS: READY (shared primitive). Use for any read-only "entity details" / "wizard review" card in new Angular code.** It is the canonical Falcon details-grid card, extracted from the Templates `.tpl-details-card` for reuse. It is **NOT a duplicate of `falcon-card`** (none exists) — it is a purpose-built read-only label/value grid. It is also the **house-rule-clean exemplar** of the B25 batch (token-utility styling, dark-mode handled, no raw literals). Low current adoption (4 Templates sites) but the correct home for the pattern.

## Use this component for

- A **read-only details / summary / review** panel: a titled card with a grid of label→value pairs.
- The same panel when a few cells are non-text (status chip, badge, multi-select) — project them as `<ng-content>` cells.
- Wizard "review before submit" steps; entity "details" views.

## Avoid this component for

- **Editable** data → form controls (`<falcon-angular-input>`, etc.); info-card has no CVA / no inputs.
- A **node identity header** (avatar + name + actions) → `<falcon-node-details-section>`.
- A **data table / list** → `<falcon-angular-data-table>` / `<falcon-angular-table>`.
- A generic empty card shell — no `<falcon-card>` exists; info-card always renders a header bar + grid chrome.

## Preferred variant / render path

`[CODE]` Single render path (pure Angular, no Shadow/`-tw`). Only axis is `[columns]` (2/3/4 for the wide-screen layout; collapses to 1/2 below `lg`). Pick `4` for dense details (templates-details), `2` for short reviews (wizard step3). Mix plain `[fields]` + projected `<ng-content>` cells for non-text values.

## Required upgrades before wider use

None block usage today. The most valuable additions for broader adoption are a component spec (G1), a loading/empty state (G3), and a semantic heading + `<dl>` association (G4/A2) — all additive, see GAPS_AND_UPGRADES.

## Relationship to other components

- **NOT related to a `falcon-card`** — none exists; no duplication concern.
- **Convention sibling:** `<falcon-node-details-section>` (info-card mirrors its "pre-resolved label/value" convention; node-details-section is the header strip, info-card is the details grid — complementary).
- **Projected into it (live):** `<falcon-status-chip>` (status cells) + a Shared-With multi-select.
- **Sibling shared-ui promotions:** `<falcon-view-toggle>`, `<falcon-org-node-header>` (this batch), `<falcon-status-chip>`.

## Exact rule for future implementation tasks

1. **Need a read-only "details / review" card (label/value grid)?** Use `<falcon-info-card>` — do not hand-roll a `.details-card`.
2. **Build `[fields]`** as a `FalconInfoCardField[]` in TS, with translation (`this.i18n.translate(k)`) + formatting done there. Pass resolved strings.
3. **Pick `[columns]`** = `4` (dense) / `2` (review) / `3` (medium).
4. **Project non-text cells** (status chips, multi-selects) wrapped in `<div class="flex flex-col gap-1">` + a `text-2xs text-falcon-neutral-500` label `<span>`; use `fullWidth`/`col-span-full` for long values.
5. **Do NOT** use it to edit (no CVA) — use form controls.
6. **Do NOT** pass i18n keys to `title`/`label`/`value` — resolve first.
7. **Do NOT** add consumer CSS to restyle it — there is no token-override path; raise G6.

---

## Dynamic capability assessment

### 1. What is static today?

- `[CODE]` The card chrome: border (`border-falcon-neutral-200`), radius (`rounded-lg`), header bar (`py-3.5 px-4 border-b font-bold`), grid padding (`py-4 px-5`), label/value typography (`text-2xs`/`text-sm`). All fixed token-utilities — clean but not customizable.
- The fields-then-projected ordering; the `2/3/4` column options.
- No loading/empty/error state, no `dense`/`size`, no semantic heading.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **3 inputs:** `[title]` (required, pre-resolved), `[fields]` (the full label/value/`fullWidth` array — fully data-driven content), `[columns]` (2/3/4). Everything content-related — how many cells, their labels/values, which span full-width, how many columns — is dynamic.
- `[CODE]` **No outputs** — passive display.

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` **One default `<ng-content>`** (html:27) for non-text cells, appended into the grid after `[fields]`. No `ng-template` inputs (so projected cells can't yet be interleaved with plain fields — GAP G7).

### 4. What is dynamic through token/theme overrides?

- `[CODE]` **Dark mode** flips automatically via inline `dark:` variants on every surface (html:8/11/19/22). But there is **no `--falcon-info-card-*` token contract** (GAP G6) — a consumer cannot retheme the header bg / border without forking.

### 5. What is dynamic through Tailwind classes?

- `[CODE]` Only the **host** `class=` (the host is `block`) for layout/spacing — the live templates-details adds `class="px-5"`. No `wrapperClass`/`headerClass` hook into the inner card/header.

### 6. What is missing to make this component reusable across pages?

- A loading/empty state (G3) — pages currently guard externally.
- A semantic heading + `<dl>` label↔value association (G4/A2) — a11y.
- A `dense` axis (G5) and a token/style hook (G6).
- Inline-orderable custom cells (G7) for layouts needing a chip mid-grid.

### 7. What capability should be added to shared component (not page hack)?

- Loading skeleton + empty state (G3) and semantic heading/`<dl>` (G4/A2) — these belong at the primitive so every adopter benefits and no feature re-implements them.
- A token contract (G6) only if/when a second visual variant is needed.

### 8. What flags / options / templates / slots would make it better?

- `@Input() loading`, `@Input() emptyText`, `@Input() dense`, `@Input() headingLevel`, `@Input() headerClass`.
- `FalconInfoCardField.cell?: TemplateRef` for inline-ordered custom cells (G7).
- `value: string | number` (G8) to reduce consumer stringification.

### 9. What is the safest upgrade path?

1. **Phase A (additive, zero risk):** add `loading`, `emptyText`, `dense`, `headingLevel`, `headerClass` inputs. Render `<h{headingLevel}>` for the title (keep current visual). No consumer break.
2. **Phase B (a11y):** convert the field grid to a `<dl><dt><dd>` structure (or add `aria-labelledby`) for label↔value association (A2).
3. **Phase C (custom cells):** add optional `field.cell?: TemplateRef` to interleave custom cells with plain fields (G7).
4. **Phase D (tokenize):** only if a second variant lands — extract `info-card.tokens.css` (G6).

All phases additive — no consumer break.

### 10. What is risky to change because other pages depend on it?

- `[CODE]` **The `gridClass()` literal-string technique** (ts:51-62) — the Templates grids depend on the literal `lg:grid-cols-*` classes being JIT-visible; refactoring into dynamic concatenation would silently break all four sites' columns.
- `[CODE]` **The pre-resolved-string contract** — both consumers pass already-translated/formatted strings; if the component started translating, it would double-translate or show keys.
- `[CODE]` **Fields-then-projected ordering** — the live templates-details places its status chips + multi-select AFTER the plain fields; changing the projection order would reflow those cards.
- `[CODE]` **The default `columns=4`** — templates-details relies on it implicitly via `[columns]="4"` (explicit) but a default change would surprise any consumer omitting `columns`.
- The fixed chrome — any restyle ripples to all (currently 4) adopters; treat as a shared-component change.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Recommendation: READY / shared primitive; NOT a `falcon-card` duplicate (none exists); house-rule-clean exemplar of the batch. 3 inputs (`title` required + `fields` + `columns`), no outputs, one default `<ng-content>` grid slot; substantive additive upgrades = spec (G1) + loading/empty (G3) + semantic heading/`<dl>` (G4/A2). NEW dossier created this pass.
