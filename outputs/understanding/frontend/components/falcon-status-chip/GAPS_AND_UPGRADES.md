# falcon-status-chip — GAPS AND UPGRADES

> **This is where the B24 AUDIT findings for `falcon-status-chip` live in prose.** Findings rows are in `plans/library-deep-dive/FINDINGS/B24.md`. We FIX NOTHING this pass — gaps are documented + (where appropriate) queued for human triage.

## Missing capabilities (active source verified)

### G1 — Status-vocabulary overlap with `<falcon-status-badge>` ("is it a duplicate?") (P1, HIGH-RISK-QUEUE to resolve)

`[CODE]` The header comment calls this "the single source of truth for status indicators across the Falcon platform" (ts:1-2). It is **not**: there is a second, older, dual-render Stencil status component — `<falcon-angular-status-badge>` (`@falcon/ui-core`) — whose `FalconStatusBadgeSeverity` is a **9-value account/user lifecycle set**: `active | pending | suspended | locked | deleted | inactive | paid | expired | disabled` (`[CODE]` `libs/falcon-ui-core/src/components/falcon-status-badge/falcon-status-badge.types.ts:6-15`). `falcon-status-chip`'s set is a **6-value templates set**: `approved | pending | rejected | deleted | review | none`.

**Overlap:** only `pending` + `deleted` are shared words. The two sets are otherwise disjoint, and the two components have different render models (chip = single Angular template + Tailwind utilities; badge = Stencil Shadow + `-tw` twin + `status-badge.tokens.css` + a `status-badge-tailwind-classes.ts` helper + React/Vue wrappers). **Verdict: NOT a true duplicate — it is a partial-overlap with a domain-scoped vocabulary.** But two "status pill" components with overlapping intent IS a consistency smell: a builder must choose by status vocabulary, and the chip's "platform SoT" claim actively misleads.

**Recommended resolution (queue for human triage — public-surface decision):**
- (a) **Re-scope the comment** to "templates-domain status indicator" (safe-local doc fix); OR
- (b) **Converge** — fold the templates statuses into `<falcon-status-badge>` (add `approved`/`rejected`/`review`/`none` severities + a `variant="text"` mode) and retire the chip; OR
- (c) **Keep both but document the split loudly** (this dossier + `<falcon-status-badge>`'s).
- Convergence (b) is a real refactor touching public API + both consoles' Templates pages → **HIGH-RISK-QUEUE**. The comment re-scope (a) is safe-local.

### G2 — No per-instance color override / no token file (P2)

`[CODE]` Color is fully determined by `status` via the hardcoded `STATUS_TOKENS` Tailwind strings (ts:39-76). There is **no token file** and **no color-override input** — unlike the gold `falcon-input` (per-instance `--falcon-input-*` override). Recoloring a single page's chip is impossible without editing the shared record.

**Recommended fix (P2):** if per-instance theming is ever needed, introduce a `--falcon-status-chip-{family}-*` token contract in `falcon-ui-tokens` (gate-12 `:where()`-scoped) and read it via arbitrary utilities — OR accept that a status pill's color is intentionally global (the simpler, current stance). Document the latter as the deliberate choice.

### G3 — Only `sm`/`md` sizes; no `lg` (P3)

`[CODE]` `FalconStatusChipSize = 'sm' | 'md'` (ts:24). The platform `<falcon-status-badge>` has `sm`/`md`/`lg`. A consumer wanting a large chip (e.g. a details-page hero status) has no `lg`.

**Recommended fix (P3):** add `'lg'` + the padding/font/dot branches in `filledClasses()`/`textClasses()`/`dotClasses()`. Additive, low-risk.

### G4 — `text`-variant dot ignores `size` (P3)

`[CODE]` The filled-variant dot uses size-aware `dotClasses()` (ts:130-133), but the `text`-variant dot is hardcoded `inline-block w-1.5 h-1.5 ... me-1` (ts:97) regardless of `size`. A `size="sm" variant="text" showDot` chip shows an md-sized dot.

**Recommended fix (P3):** reuse `dotClasses()` in the text branch (or add a size-aware text-dot). Currently moot in production (the text-variant consumers pass `[showDot]="false"`), but it is a latent inconsistency.

### G5 — `pending` and `review` (and `rejected`/`deleted`) are color-indistinguishable (P3, by-design)

`[CODE]` ts:52-57 / ts:64-69 — `pending`≡`review` (amber) and `rejected`≡`deleted` (red) share an identical color triple, differing only in `defaultLabelKey`. In a monochrome / color-blind context the two states are indistinguishable without the label.

**Recommended fix (P3):** either accept (the label disambiguates; this is the current intentional design) OR introduce a secondary affordance (an outline / icon) for the rarer member of each pair. Document as a deliberate choice unless accessibility review objects.

### G6 — No `icon` affordance (P3)

`[CODE]` The chip renders only a dot + label. `<falcon-status-badge>` is dot+label too, but `<falcon-angular-tag>` supports a leading `icon`. Some status designs want a glyph (✓ / ✕ / ⏳).

**Recommended fix (P3):** add an optional `@Input() icon?: string` (Falcon icon-font class) rendered before the dot/label. Additive.

## Missing accessibility features

- **A1 / G-A11Y-1 (P2):** the chip is a plain `<span>` with **no status semantics** (`role="status"` / `role="img"` + `aria-label`). For most cases the translated text content is sufficient, but a programmatically-announced status role would be more robust — especially in the `text` variant where the only signal to a sighted user is italic color. (`[CODE]` ts:84-101.)
- **A2 (P3):** the leading dot `<span>` is decorative but **not `aria-hidden="true"`** (ts:88,97). Harmless (empty span) but should be marked decorative for cleanliness (the gold `falcon-input` marks its decorative icon spans `aria-hidden`).
- **A3 (P3):** color is the redundant channel; the chip relies on the **label always being present + meaningful** for non-color users. With `[labelKey]` overrides this is the consumer's responsibility — document it.

## Missing tests

- `[CODE]` **No `*.spec.ts` for this component** (Glob 2026-06-03). The logic is pure + trivially unit-testable: `tokens()` mapping per status, `filledClasses()`/`textClasses()`/`dotClasses()` per `size`, the `variant` template branch, the `labelKey ?? defaultLabelKey` fallback, and `[showDot]` gating. **GAP-TEST:** add `falcon-status-chip.component.spec.ts` (TestBed + a status-matrix truth table). No Stencil constraint here (pure Angular), so unlike the `falcon-input` `-tw`/wrapper gap, a full component spec is straightforward.

## Missing Tailwind / token parity

- **N/A** — single-render Angular component; there is no Shadow/`-tw` pair to keep in parity and no token file to scope. The only "parity" concern is cross-COMPONENT consistency with `<falcon-status-badge>` (G1), not intra-component render-path parity.

## Performance risks

- **None.** Signals + `OnPush` + pure `computed` string concatenation. The chip re-renders only on input change; class strings are tiny. No risk.

## Visual / interaction risks

- `[CODE]` Two color-identical status pairs (G5) — a monochrome export of the templates list cannot distinguish `pending`/`review` or `rejected`/`deleted`.
- `[INFERRED]` Dark-mode tint contrast unverified (`TOKENS.md` G-DARK-1) — the `*-50`/`*-100` tints may read poorly on a dark canvas since the chip has no dark-surface flip.

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G1 | Resolve overlap with `<falcon-status-badge>` (re-scope comment, or converge, or document split) | P1 | comment=safe-local · converge=HIGH-RISK-QUEUE |
| A1/G-A11Y-1 | Add status semantics (`role`/`aria-label`) | P2 | safe-local |
| G2 | Token contract / decide global-color stance | P2 | safe-local |
| G-TEST | Add component spec | P2 | safe-local |
| G3 | Add `lg` size | P3 | safe-local |
| G4 | Size-aware `text`-variant dot | P3 | safe-local |
| G5 | Disambiguate color-identical status pairs | P3 | safe-local |
| G6 | Optional `icon` input | P3 | safe-local |
| A2 | `aria-hidden` on decorative dot | P3 | safe-local |

## Concrete upgrade API (additive, illustrative)

```ts
// additive inputs
readonly size = input<'sm' | 'md' | 'lg'>('md');     // G3
readonly icon = input<string | null>(null);          // G6
// template: role + aria + aria-hidden dot
//   <span role="status" [class]="filledClasses()"> … <span aria-hidden="true" [class]="dotClasses()"></span> … </span>
```

## Fix-shared-vs-per-page

All gaps belong in the **shared component** (it is already the one place the templates-status contract lives). The G1 convergence decision is a library-architecture call, not a per-page hack.

## Workarounds (if upgrade blocked)

- For G1 today: pick by vocabulary — templates statuses → this chip; account/user statuses → `<falcon-status-badge>`. Ignore the misleading "platform SoT" comment.
- For G3 today: a `lg` chip isn't available — use `md` or wrap in a larger context.
- For G2 today: color is global; do not attempt a per-page recolor.

## Deep-Dive Sweep Findings (2026-06-03 — B24, NEW)

**Consumer count: 28 occurrences / 8 files** (4 HTML templates + 4 TS imports), all Templates list/details across both consoles ([CODE] grep `<falcon-status-chip[\s>]`).

- **NEW dossier created** — no prior dossier existed; this is the first canonical write.
- **Sibling-overlap finding (G1):** partial-overlap with `<falcon-status-badge>` (9-severity Stencil) — NOT a true duplicate (disjoint vocabularies, different render model), but the chip's "platform SoT" comment over-claims. Re-scope (safe-local) or converge (HIGH-RISK-QUEUE).
- **Best-practice posture:** PASS on Angular-21 modern surface (standalone, `input()`/`computed`, `OnPush`, zoneless-safe, no NgModule, `@if` control flow, no SCSS, no hex/px, RTL-safe). Gaps are feature-breadth (sizes/icon/token) + a11y semantics + zero tests + the G1 consistency smell.
- **No deletion/promotion flags** — component stays ACTIVE/IN-PRODUCTION (templates-scoped).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24) against `falcon-status-chip.component.ts` (134 ln) + the `<falcon-status-badge>` type file + the `@falcon` barrel. G1 overlap quantified (6-value templates set vs 9-value account set; 2 shared words). All other gaps source-confirmed from the inline template + the `STATUS_TOKENS` record. Zero-spec + no-token-file confirmed via Glob. Dark-mode contrast (G-DARK-1) 🔴 INFERRED.
