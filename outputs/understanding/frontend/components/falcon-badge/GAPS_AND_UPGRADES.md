# falcon-badge — GAPS & UPGRADES

## Missing capabilities

### No usage in production

- Zero direct consumer in `apps/`. Production pages currently use raw Tailwind utility classes for count badges / feature flags (status-chip pattern). **P1 — refactor opportunity, but also probably means consumers are uncertain about the three-component split (`badge` vs `status-badge` vs `tag`).**

### Documentation contrast

- The three sibling badges (`falcon-badge`, `falcon-status-badge`, `falcon-tag`) have overlapping visual identities. A docs comparison table would help. **P2 — Agent 7 territory; mention in COMPONENT_COVERAGE.**

### A11y — `ariaLabel` reachable ONLY on the Shadow tag (EXPANDED 2026-06-03)

- `ariaLabel` exists on the **Shadow** `<falcon-badge>` only (`[CODE]` falcon-badge.tsx:37,48). It is **absent on the `-tw` twin** (`[CODE]` falcon-badge-tw.tsx:19-27) AND not surfaced on the Angular wrapper. Since the wrapper defaults to `useTailwind=true` (→ `-tw`), **the default render path has NO accessible-label path at all** for a dot-only badge — you must explicitly drop to the raw Shadow `<falcon-badge ariaLabel="…">`. This is broader than the prior "wrapper lacks the input" framing. **P2 → effectively P1 for any dot-only usage. Risk-class: HIGH-RISK-QUEUE (a11y semantics + adds a prop to both the `-tw` twin and the wrapper).**

### `iconName` icon resolution

- The icon class is `falcon-icon falcon-icon-{name}` — relies on the Falcon icon font being loaded. If consumer passes a non-existent name, the `<i>` renders empty. **P3 — fallback or dev warning.**

### `solid` appearance reuses the `*-dot-bg` token family (NEW 2026-06-03)

- `[CODE]` badge-tailwind-classes.ts:32-49 — `variantSolidClasses()` paints the solid-appearance background from `--falcon-badge-{variant}-dot-bg` (the SAME tokens `falconBadgeDotClasses()` uses, `[CODE]` :114-127). There is no dedicated `--falcon-badge-{variant}-solid-bg`. Consequence: a per-instance override of a dot colour silently retints every solid badge of that variant, and vice-versa. **P3 token-naming smell. Risk-class: safe-local** (add `*-solid-bg` tokens aliased to the dot value, then repoint the helper — additive, no visual change).

### `-tw` has an undocumented `rootExtraClass` prop (NEW 2026-06-03)

- `[CODE]` falcon-badge-tw.tsx:27 — the `-tw` twin has a `rootExtraClass` escape hatch absent from the Shadow tag and not surfaced on the wrapper. Harmless asymmetry, but it is an undocumented public prop on the default render path. **P3. Risk-class: safe-local** (document it, or surface it on the wrapper for parity).

### Tests

- No specs (`[CODE]` verified 2026-06-03 — zero `*badge*.spec.ts`/`.e2e.ts`). **P3** — pure presentational, but a spec would lock the Shadow↔`-tw` parity (and would have caught the `ariaLabel` divergence). **Risk-class: safe-local.**

## Reusable upgrades needed

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| FB-01 | Expose `[ariaLabel]` on the Angular wrapper **AND** add it to the `-tw` twin (default path has no a11y-label today) | **P1** | HIGH-RISK-QUEUE |
| FB-02 | Visual-comparison docs (sibling badges) | **P2** | safe-local |
| FB-03 | Specs (lock Shadow↔`-tw` parity) | **P3** | safe-local |
| FB-04 | Add `--falcon-badge-{variant}-solid-bg` tokens (stop aliasing solid bg onto dot tokens) | **P3** | safe-local |
| FB-05 | Document / surface the `-tw`-only `rootExtraClass` prop | **P3** | safe-local |

## Workarounds available

- `<ng-content>` already works on the wrapper — no workaround needed for content projection.

## Future-proof recommendation

Promote `<falcon-angular-badge>` as the canonical count / feature-flag indicator across the system via consumer refactor. Add `[ariaLabel]` to the wrapper for parity with the Stencil core.

## Wave 7 Findings (2026-05-17)

**Consumer count: 0** ([CODE] grep `<falcon-angular-badge>` across `apps/` + `libs/falcon/`).

**Gap: Zero adoption** — component is showcase/playground-only. Either promote in an upcoming feature (recommended for primitives like `accordion`/`avatar`/`badge`) or formally retire if redundant. Priority: P2 — usability watch, not blocker.

## Calibration Sweep Findings (2026-06-03)

**Consumer count: 0** ([CODE] grep `<falcon-angular-badge>` across `apps/` + `libs/falcon/src` — UNCHANGED since Wave 7). Zero adoption persists.

**New/corrected this REFRESH:**
- **Doc correction:** USAGE.md previously claimed the wrapper does NOT project `<ng-content>` — WRONG; it does on both branches (`[CODE]` falcon-badge.component.html:11,20). Corrected.
- **FB-01 expanded:** `ariaLabel` is Shadow-only; the default `-tw` path has no a11y-label surface (raised from P2 to P1 for dot-only usage).
- **FB-04 (new):** solid appearance reuses `*-dot-bg` tokens (no `*-solid-bg`).
- **FB-05 (new):** `-tw` has an undocumented `rootExtraClass` prop.
- **Token scope:** `badge.tokens.css` is gate-12 compliant — scoped under `:where(...)`, not `:root` (`[CODE]` badge.tokens.css:17).

No structural regressions; the public surface is unchanged since 2026-05-17. All findings mirrored to `FINDINGS/B-CAL.md`.

## Verification
🟢 code-verified — every finding re-checked against the live `.tsx`/`.html`/tokens/tailwind-helper on 2026-06-03. The `<ng-content>` correction and the Shadow↔`-tw` `ariaLabel` divergence are 🟢 code-verified by direct line citation. NOT runtime-verified.
