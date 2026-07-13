# falcon-empty-data — GAPS AND UPGRADES

## RECONCILE FLAG — `falcon-empty-data` vs `falcon-empty-state` (overlap analysis)

`[CODE]` These two components **overlap in intent (both are "empty state" visuals) but are NOT duplicates** — they are two deliberate fidelity tiers, and the source code is explicit about it (`falcon-empty-data.tsx:4-5`: *"Distinct from `<falcon-empty-state>` (the minimal icon+title+description placeholder)"*).

| Axis | `<falcon-empty-state>` (Wave 9.E, §5.12.1) | `<falcon-empty-data>` (Wave 19) |
|---|---|---|
| Visual | Minimal centred icon + `<h3>` title + `<p>` description. No card. | Themed **card**: dashed border + glossy teal gradient + tinted glyph **disc**. |
| Icon | Falcon **icon-font** glyph (`.falcon-icon-{name}`), any name | **Inline SVG**, fixed 8-key set (`users`/`inbox`/`search`/…) |
| Action | A `slot="action"` — consumer projects ANY content (e.g. `<falcon-angular-button>`) | A **built-in native `<button>`** (3 sizes × 3 borders) emitting `(actionClick)` — no projection |
| Info chip | none | yes (`showInfo`/`infoText`) |
| Modes / sizing | `size` (sm/md/lg) | `mode` (table/page) + `containerFit` (fill/mini/fit) + `actionSize` |
| Output | NONE (presentational) | `(actionClick)` |
| Title element | `<h3>` (heading semantics) | `<div>` (no heading) |
| Config service | no | yes (`FalconConfigurationService.resolveEmptyData` default copy) |
| Data-table integration | only via `<ng-template falconDataTableEmpty>` projection (manual) | **auto-mounted via `[emptyData]` shorthand** (`[CODE]` falcon-data-table.component.ts:390) |
| Adoption (B12) | 3 direct renders (add-user-wizard ×2, new-wallet-balance) | 1 direct + 9 `[emptyData]`-config tables + 1 lib re-export |

**Canonical verdict (reconcile-flag — needs human ratification):**
- `<falcon-empty-data>` is the **canonical empty visual for data-tables and decorated page zero-states** — it is wired into the data-table shorthand and broadly adopted indirectly.
- `<falcon-empty-state>` is the **canonical minimal placeholder** for the cases where you want a slot-projected action and heading semantics without card chrome (the add-user "you cannot add here" explainer, the new-wallet-balance no-data block).
- **Neither should be deprecated** — they cover genuinely different fidelity needs. The redundancy is in the *naming* (both read "empty…"), which invites mis-selection, NOT in the *capability*. **Recommended action (HIGH-RISK-QUEUE — naming/API governance):** publish a one-line "use empty-data for cards/tables, empty-state for minimal slot-projected placeholders" rule (done in RECOGNITION/DECISION here) rather than merging them. A merge would be a large breaking refactor touching the data-table integration + 3 empty-state consumers; do NOT undertake without explicit approval. See FINDINGS B12 `HIGH-RISK-QUEUE` row.

## Missing capabilities (active source verified)

### G1 — No shared base / two parallel implementations (P2)

`[CODE]` empty-data + empty-state are entirely separate Stencil components with their own glyph rendering, their own size/mode axes, their own tokens. There is no shared "empty-base." A future consolidation could extract a common centred-stack layout primitive both compose. **Additive-only; low urgency** — they work today. (This is the structural side of the reconcile flag above.)

### G2 — No action slot / cannot project a custom CTA (P2)

`[CODE]` Unlike `<falcon-empty-state>` (which has `slot="action"`), `<falcon-empty-data>` renders a **native `<button>` internally** (`[CODE]` tsx:291-316) — you can set `actionLabel`/`actionSize`/`actionBorder` but you cannot project a `<falcon-angular-button>`, a link, or two buttons. Consumers needing a non-default action (e.g. a `routerLink`, an icon-only button, secondary+primary pair) cannot use this component.

**Recommended fix (P2):** add an optional `<slot name="action">` to both variants; render the built-in `<button>` only when the slot is empty (`:empty` fallback). Additive.

### G3 — Title is a `<div>`, not a heading (a11y) (P2)

`[CODE]` tsx:283 / tw.tsx:366 — the title renders as `<div class="falcon-empty-data-title">`, so screen-reader heading navigation skips it. `<falcon-empty-state>` correctly uses `<h3>`. **Recommended fix (P2):** render the title as a configurable heading (`<h2>`/`<h3>`) or at minimum add `role="heading" aria-level`. *(Semantics change → HIGH-RISK-QUEUE per §6 a11y-semantics rule.)*

### G4 — `context.dismissable` has no dismiss UI (P3)

`[CODE]` tsx:265 — `data-dismissable='on'` is reflected for styling, but no close button renders and no dismiss event fires. The flag is a style-hook with no behavior. **Recommended fix (P3):** either render a token-driven close button + `(dismiss)` output, or document `dismissable` as style-only.

### G5 — No error variant (P3)

`[CODE]` `context.feedbackLevel='destructive'` changes only `role`/`aria-live` (`[CODE]` tsx:250-251), not the visual. There is no red/error card. A failed-load needs a different component today. **Recommended fix (P3):** add a `variant`/`tone` axis (`empty`/`error`/`info`) with token surfaces, OR keep empty-data empty-only and document the redirect.

### G6 — Stale `falcon-empty-data-shadow` selector + token comment (P3, safe-local)

`[CODE]` empty-data.tokens.css:12 + 24-27 reference a `<falcon-empty-data-shadow>` component that **does not exist** (only `falcon-empty-data` + `falcon-empty-data-tw`). Also the token header comment (lines 8-13) describes three Angular sub-components that don't match the real two-tag structure. Harmless but misleading. **Recommended fix (P3, safe-local):** drop `falcon-empty-data-shadow` from the selector + fix the header comment; optionally add `falcon-angular-empty-data` to the `:where()` for host-element styling parity.

### G7 — No tests (P2)

`[CODE]` No `.spec.ts` / `.e2e.ts` for empty-data (any layer). For a component the data-table auto-mounts in production, the gap matters. **Recommended fix (P2):** add `falcon-empty-data.component.spec.ts` covering: config-default hydration (per-instance wins), `(actionClick)` re-emit, `showInfo && infoText` info-chip gate, `useTailwind` branch swap; + a Stencil spec for the glyph switch + clamp.

### G8 — Large inline-style surface on the `-tw` variant + one hardcoded weight (P2, safe-local)

`[CODE]` falcon-empty-data-tw.tsx:264-330 sets ~25 inline `style` properties (card/glyph/title/body/button/info colors + borders + gradient). All are `var(--falcon-empty-data-*)` references (token-compliant), BUT: (a) the title style hardcodes `font-weight: String(600)` (`[CODE]` tw.tsx:295) instead of reading `--falcon-empty-data-title-weight`; (b) such a large inline-style surface is harder to override than CSS classes. **Recommended fix (P2, safe-local):** read the weight token; consider a `<style>`-block-per-component approach for the parts Tailwind can't express, to shrink the inline surface. Functionally correct today.

### G9 — Glyph icon set is closed (8 keys) (P3)

`[CODE]` tsx:100-231 — the inline-SVG switch supports exactly `users`/`inbox`/`search`/`folder`/`doc`/`bell`/`box`/`star`. Unlike `<falcon-empty-state>` (any icon-font name), empty-data cannot show an arbitrary glyph. **Recommended fix (P3):** add an `iconFont` escape (project a `.falcon-icon-{name}` like empty-state does) OR a `customIconSlot`.

## Missing accessibility features

- **A1 (P2):** title is not a heading (see G3).
- **A2 (P3):** the card's `aria-live='polite'` announces on every appearance even when purely decorative; consider `aria-live='off'` when `feedbackLevel='informational'` and the card is static.
- **A3 (P3):** CTA `<button>` relies on visible text only; fine, but document that `actionLabel` must be meaningful (no icon-only CTA without a label).

## Missing tests
- See G7 — zero specs at any layer.

## Missing Tailwind / token parity
- `[CODE]` Shadow CSS reads `--falcon-empty-data-title-weight`; the `-tw` inline style hardcodes `600` (G8). Minor parity break.
- Otherwise both variants share `--falcon-empty-data-*` via the `:where()` chain — parity OK at the token level. The `-tw` reads several via inline `style` rather than CSS, but the same vars.

## Performance risks
- `[CODE]` Eager `defineCustomElement` at module load (ts:50-55) defines BOTH variants up-front — slightly more eager than lazy, but deliberately so (correctness). Negligible cost.
- The data-table mounts/destroys the wrapper via `createComponent` on every empty↔non-empty transition (`[CODE]` falcon-data-table.component.ts:1023/1083) — fine for list pages; not a hot path.

## Visual / interaction risks
- `[CODE]` `--falcon-empty-data-card-radius: 0px` default — square card corners surprise consumers expecting rounded cards; override per instance.
- Two render paths can drift (G8 weight hardcode is one instance). Guard via Studio parity tests.

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| RECONCILE | Publish empty-data-vs-empty-state selection rule (no merge) | P1 | HIGH-RISK-QUEUE (naming/API governance) |
| G2 | Action slot for custom CTA | P2 | HIGH-RISK-QUEUE (public API change) |
| G3 | Title as heading (a11y) | P2 | HIGH-RISK-QUEUE (a11y semantics) |
| G7 | Tests | P2 | safe-local |
| G6 | Stale `falcon-empty-data-shadow` selector/comment | P3 | safe-local |
| G8 | Inline-style weight hardcode | P2 | safe-local |
| G5 | Error/tone variant | P3 | HIGH-RISK-QUEUE (visual + API) |
| G4 | Dismiss UI for `dismissable` | P3 | HIGH-RISK-QUEUE (API + behavior) |
| G9 | Open icon set / icon-font escape | P3 | safe-local |

## Fix-shared-vs-per-page
All gaps belong in the **shared Falcon component** (Stencil core + wrapper + tokens). Per-page hacks (e.g. hand-rolling a custom CTA next to the card) would break the data-table auto-mount contract and the cross-framework SSOT.

## Workarounds (if upgrade blocked)
- For G2 (custom CTA) today: do NOT use empty-data; use `<falcon-empty-state>` (which HAS a `slot="action"`) and accept the lighter card-less look, OR project a `*falconDataTableEmpty` template with your own markup (it beats `[emptyData]`).
- For G5 (error) today: use a different error treatment, not this card.
- For G9 (custom glyph) today: pick the nearest of the 8 keys, or use `<falcon-empty-state>` with the right icon-font glyph.

## Deep-Dive Sweep Findings (2026-06-03 — B12)

**Consumer count: 1 direct render + 9 `[emptyData]`-config files + 1 lib re-export** (`[CODE]` grep).

NEW dossier created this pass (empty-data had none). Findings:
- **Reconcile flag raised** vs `falcon-empty-state` — overlap is fidelity-tier, NOT duplication; neither deprecated; selection rule published. HIGH-RISK-QUEUE (governance/merge) row in FINDINGS/B12.md.
- **G2 (no action slot), G3 (`<div>` title a11y), G5 (no error variant), G4 (dismiss no-op)** = capability/a11y gaps, HIGH-RISK-QUEUE.
- **G6 (stale `falcon-empty-data-shadow` selector), G7 (no tests), G8 (inline-weight hardcode), G9 (closed icon set)** = `safe-local`.
- No deletion/promotion flag — component stays ACTIVE/PREFERRED.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12, NEW) against all source layers. Reconcile analysis grounded in `falcon-empty-data.tsx:4-5` ("Distinct from `<falcon-empty-state>`") + the data-table `[emptyData]` integration + the consumer split. Gaps G1-G9 each cite source lines. No deletion/promotion flags.
