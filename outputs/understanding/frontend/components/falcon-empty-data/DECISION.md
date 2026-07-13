# falcon-empty-data — DECISION

## Brain SK final recommendation

**STATUS: READY / PREFERRED for table & page empty-states.** Use for the decorated empty render of any list/table (via the data-table `[emptyData]` shorthand) and for page-level zero-state heroes. It is the most-adopted empty visual in the platform (indirectly, through the data-table).

## Use this component for

- The empty render of a `<falcon-angular-data-table>` — pass `[emptyData]="config"` and let the table auto-mount it.
- A page-level zero-state hero (`mode="page"`) with the standard card + disc + optional CTA + optional info chip.
- Any empty list/dashboard where the richer card treatment (gradient, disc, button) is wanted.
- Message-only empties (CTA + info both off) when the operator cannot act (PES-denied lists).

## Avoid this component for

- A **minimal** centred icon + heading + text with NO card surface, OR when you need a **projected/custom action** → `<falcon-empty-state>` (it has a `slot="action"` + `<h3>` heading).
- Loading states → table `[loading]` skeleton.
- Error states → no error variant (GAP G5); use a dedicated error treatment.
- An arbitrary glyph not in the 8-key SVG set → `<falcon-empty-state>` (icon-font).

## Preferred variant / render path

**`useTailwind=true` (default)** — Light DOM `<falcon-empty-data-tw>`. Best for Studio token-runtime mutation + cross-framework parity. Note the `-tw` variant carries an extensive inline-`style` surface (all token-referenced) because Tailwind can't express the gradient/border shorthands (GAP G8).

**`useTailwind=false`** (Shadow `<falcon-empty-data>`) — switch only when you need style isolation from a noisy parent stylesheet; the Shadow CSS is the cleaner (pure-token) implementation.

> When auto-mounted by the data-table, the table patches `useTailwind` per its own config (`[CODE]` falcon-data-table.component.ts) — the signal-backed input makes the branch swap reactive.

## Required upgrades before wider use

None block today's use — it is production-grade and broadly adopted via the data-table. The gaps in `GAPS_AND_UPGRADES.md` are improvements: the highest-value one is **G2 (action slot)** so consumers can project a custom CTA, and **G3 (heading semantics)** for a11y. Both are HIGH-RISK-QUEUE (public API / a11y semantics).

## Relationship to other components

- **Lighter sibling:** `<falcon-empty-state>` — minimal slot-projected placeholder. The two are complementary fidelity tiers, NOT duplicates; neither is deprecated (see the reconcile flag in `GAPS_AND_UPGRADES.md`).
- **Primary host:** `<falcon-angular-data-table>` — auto-mounts this via `[emptyData]`, forwards the CTA as `(emptyDataAction)`.
- **Config provider:** `FalconConfigurationService.resolveEmptyData()` supplies default copy/icon.
- Does NOT compose `<falcon-angular-button>` — its CTA is an internal native `<button>` (GAP G2).

## Exact rule for future implementation tasks

1. **Empty data-table?** Use the data-table `[emptyData]="config"` shorthand (NOT a hand-mounted wrapper) and wire `(emptyDataAction)`.
2. **Empty page hero?** Render `<falcon-angular-empty-data mode="page">` directly; pick `containerFit`.
3. **Need a custom/projected action, or heading semantics, or a card-less look?** Use `<falcon-empty-state>` instead.
4. **Need an arbitrary glyph?** Use `<falcon-empty-state>` (icon-font) — empty-data has a closed 8-key SVG set.
5. **Default copy** belongs in `FalconConfigurationService` (`falcon-defaults.json` / `registerEmptyDataOverride`), not hardcoded per page. Per-instance `[input]` overrides it.
6. **Override visuals** via `--falcon-empty-data-*` tokens (host class). Never hardcode hex/px.
7. **Do NOT** set both `[emptyData]` and a `*falconDataTableEmpty` template — the template silently wins.
8. **Do NOT** normalise the wrapper's mixed `[prop]`/`[attr.*]` bindings or remove the eager `defineCustomElement` — both are load-bearing.

---

## Dynamic capability assessment

### 1. What is static today?

- The 8-key inline-SVG glyph set (`users`/`inbox`/`search`/`folder`/`doc`/`bell`/`box`/`star`) — closed.
- The built-in CTA `<button>` markup + the leading `+` SVG; the info chip + its info-circle SVG.
- The title is a `<div>` (not a heading) — fixed element.
- `--falcon-empty-data-card-radius: 0px` default (square corners).
- The `-tw` title `font-weight: 600` hardcode (G8).
- No action slot, no methods, no error variant.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **~24 wrapper `@Input`s** — `titleText`, `body`, `iconKey`, `iconSize`, `cardBackground`, `glossyGradient`, `iconBackground`, `coloredIcon`, `iconOpacityOn`, `opacity`, `showAction`, `actionLabel`, `actionSize`, `actionBorder`, `showInfo`, `infoText`, `mode`, `containerFit`, `padX`, `padY`, `marginX`, `marginY`, `context`, `useTailwind`. Most hydrate from `FalconConfigurationService` when unbound (per-instance wins).
- `[CODE]` **One `@Output`: `(actionClick)`** (`{ actionLabel }`), re-emitted from the Stencil `falcon-action-click`.

### 3. What is already dynamic through slots / ng-template?

- **Nothing.** No `<slot>`, no `<ng-content>`, no `ng-template` input. CTA + info render from props. (Contrast `<falcon-empty-state>`'s `slot="action"`.) — GAP G2.

### 4. What is dynamic through token/theme overrides?

- Every visual axis (~60 `--falcon-empty-data-*` tokens): card chrome/gradient, glyph disc, title, body, CTA (3 sizes × 3 borders), info chip, layout/min-height. Host-class + per-instance scope via the `:where()` chain.
- Dark mode inherits the platform neutral inversions (not independently re-verified — TOKENS caveat).

### 5. What is dynamic through Tailwind classes?

- Host `class=` flows to the host element (layout/spacing). There are **no `wrapperClass`/`inputClass` inputs** (unlike `falcon-input`). The `-tw` variant's internal classes are token-driven and not consumer-extendable.

### 6. What is missing to make this component reusable across pages?

- An action slot for custom CTAs (G2) — the single biggest reuse limiter.
- Heading semantics for the title (G3).
- An error/tone variant (G5).
- An open icon set / icon-font escape (G9).
- A dismiss UI for `dismissable` (G4).
- Tests (G7).

### 7. What capability should be added to shared component (not page hack)?

- `slot="action"` (G2) — every page wanting a non-default CTA will otherwise drop to `empty-state` or a projected template.
- Heading semantics (G3) and an error tone (G5) — both belong in the shared component, not per-page.

### 8. What flags / options / templates / slots would make it better?

- `<slot name="action">` (+ render the built-in button only as `:empty` fallback).
- `@Input() headingLevel?: 2|3|4` (or render title as a heading).
- `@Input() tone?: 'empty' | 'error' | 'info'` with token surfaces.
- `@Output() dismiss` + an opt-in close button when `dismissable`.
- An `iconFont`/`customIcon` escape for arbitrary glyphs.

### 9. What is the safest upgrade path?

1. **Phase A (additive, zero risk):** read the `--falcon-empty-data-title-weight` token in the `-tw` style (G8); fix the stale `falcon-empty-data-shadow` selector/comment (G6); add specs (G7).
2. **Phase B (additive API):** add `<slot name="action">` to both variants with an `:empty` fallback to the built-in button (G2); add an `iconFont` escape (G9).
3. **Phase C (semantics — needs review):** render the title as a heading (G3) — verify no consumer layout assumes a `<div>`.
4. **Phase D (visual + API — needs review):** add a `tone` variant (G5) + a dismiss control (G4).

Phases A–B are additive; C–D touch semantics/visual → HIGH-RISK-QUEUE.

### 10. What is risky to change because other pages depend on it?

- **The data-table `[emptyData]` auto-mount contract** — the table does `createComponent` + `setIfDefined` against the wrapper's exact input names; renaming/removing inputs breaks every `[emptyData]` consumer (9 files).
- **The eager `defineCustomElement` + mixed `[prop]`/`[attr.*]` binding** — removing either reintroduces the `showAction`/`showInfo`-shadowing bug.
- **The default `useTailwind=true`** — flipping it changes DOM (Light ↔ Shadow) and the inline-style surface.
- **The `(actionClick)` / `falcon-action-click` event name** — the data-table re-emits it as `(emptyDataAction)`; renaming breaks the chain.
- **Merging with `<falcon-empty-state>`** — a large breaking refactor (HIGH-RISK-QUEUE); do NOT attempt without approval. The two are intentionally distinct.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12, NEW). Recommendation: READY/PREFERRED for table+page empties; `<falcon-empty-state>` for minimal/slot-projected placeholders. Counts: ~24 wrapper `@Input`s, 1 `@Output` (`actionClick`), 0 slots, 0 methods, no CVA — all confirmed against source. Reconcile flag + G2/G3/G5 queued HIGH-RISK.
