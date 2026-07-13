# falcon-tooltip — GAPS AND UPGRADES

> B16 AUDIT findings for `falcon-tooltip` in prose. We fix NOTHING this pass. Row-level record in `FINDINGS/B16.md`.

## Headline — sound but ZERO-adoption primitive

`[CODE]` The tooltip is well-built (dual-render parity, Top-Layer promotion, pure-fn positioning) but has **0 feature-template consumers** (Consumer Sweep). It is not deprecated — it is simply unused. The opportunity is adoption (icon-only buttons across both consoles), not deletion. `risk-class = safe-local` (no action needed; an adoption recommendation, not a code change).

## Missing capabilities (active source verified)

### G1 — No flip / collision-aware placement (P1)

`[CODE]` `computeOffset` honors ONLY the requested `placement` (`[CODE]` falcon-tooltip.utils.ts:22-48); a `placement="right"` tooltip with no room overflows the viewport. There is no auto-flip. The Top-Layer promotion fixes ANCESTOR-clipping but NOT viewport-edge overflow. **Proposed:** a `flipPlacement` array (try in order) or `placement="auto"` (best-fit) — `computeOffset` already returns x/y, so extending it to test alternatives is a moderate refactor with high payoff (Radix/Floating-UI parity). `risk-class = safe-local` (additive).

### G2 — No `@Watch('disabled')` (P1)

`[CODE]` `disabled` has no `@Watch` (`[CODE]` falcon-tooltip.tsx:37) — toggling `disabled=true` while OPEN doesn't close the panel; the consumer must call `close()`. **Proposed:** add `@Watch('disabled')` that calls `scheduleHide('disabled')` when `true`. `risk-class = safe-local` (internal behavior; the `'disabled'` hide-reason already exists in the type, so it was clearly intended).

### G3 — Angular wrapper does not proxy `open()` / `close()` (P2)

`[CODE]` `<falcon-tooltip>`/`-tw` expose `@Method() open()` + `close()` but `FalconAngularTooltipComponent` has no proxies — reach into the inner Stencil element via `ViewChild`. Same class as falcon-input G2 / toast G1. `risk-class = safe-local`.

### G4 — Hide delay hardcoded (P2)

`[CODE]` `scheduleHide()` uses a fixed 80ms (`[CODE]` falcon-tooltip.tsx:110); show delay IS configurable (`delay`), hide is not. Note: the token file even declares `--falcon-tooltip-hide-delay: 80ms` (`[CODE]` tooltip.tokens.css:68) but the timer NEVER reads it — a token/behavior disconnect. **Proposed:** a `hideDelay` input (default 80) OR have `scheduleHide` read the token. `risk-class = safe-local`.

### G5 — Trigger gets `tabIndex=0` unconditionally (P2)

`[CODE]` falcon-tooltip.tsx:171 — any wrapped element becomes a focus stop; wrapping an element with an existing `tabIndex` doubles it. **Proposed:** `[focusableTrigger]="false"` opt-out. `risk-class = HIGH-RISK-QUEUE` (a11y/keyboard semantics — removing the default focus stop would break keyboard discovery for some; must be opt-out, not default-off).

### G6 — `aria-describedby` not persistent (P2 — a11y)

`[CODE]` falcon-tooltip.tsx:171 — `aria-describedby` is set ONLY while showing (showLabel-gated). WAI-ARIA APG suggests a persistent association. **Proposed:** always emit the panel id on the trigger (panel exists in DOM only when open, so screen readers may not find the description otherwise). `risk-class = HIGH-RISK-QUEUE` (a11y semantics).

### G7 — No Esc-to-dismiss (P3 — a11y)

`[CODE]` Close paths are pointer-leave / blur / programmatic only — no keyboard Esc. `risk-class = safe-local`.

### G8 — No show/hide animation; arrow always on; no max-height (P3)

`[CODE]` The tooltip appears by DOM insertion + transform — no fade/scale (the `-enter-opacity`/`-enter-scale` tokens exist but aren't wired into a transition state, `[CODE]` tooltip.tokens.css:90-91). The arrow is always rendered (no `[arrow]="false"`). Only `maxWidth` exists, no `maxHeight`. `risk-class = safe-local`.

## `-tw` vs Shadow parity

`[CODE]` Prop/event/slot/role parity is CLEAN (content/placement/delay/disabled/interactive/maxWidth all mirrored; both emit `falcon-show`+`falcon-hide`; both project default + `content` slots; both `role="tooltip"`; both `aria-describedby` showLabel-gated). The ONE divergence is COSMETIC-by-necessity: the `-tw` arrow uses an inline `getArrowStyle()` style object (`[CODE]` falcon-tooltip-tw.tsx:155-191) because Tailwind has no attribute-selector arbitrary value to replace the Shadow CSS `[data-placement^='top'] .arrow {…}` rules — both read `--falcon-tooltip-arrow-*` tokens, so visually identical. NOT a gap, documented divergence.

## Missing tests

`[CODE]` **NO `*tooltip*.spec.ts` / e2e in `falcon-ui-core`** (verified 2026-06-03). The placement math (`computeOffset` — a pure fn, trivially unit-testable), the show/hide debounce, the disabled-suppress, the interactive panel-hover, and the Top-Layer acquire/release are ALL untested. GAP. `risk-class = safe-local`.

## Missing cross-framework parity

`[CODE]` **No React (`libs/falcon-ui-react`) or Vue (`libs/falcon-ui-vue`) tooltip wrapper** (verified 2026-06-03 — zero `*tooltip*` files in either lib). Stencil core is cross-framework-capable; only Angular ships. `risk-class = safe-local`.

## Performance risks

- `computeOffset()` runs in one `requestAnimationFrame` after the panel mounts — cheap.
- `parseOffset()` does `getComputedStyle().getPropertyValue()` per show — micro-cost, acceptable.
- The Top-Layer acquire adds one rAF + one `querySelector` + `showPopover` per show — negligible.

## Visual / interaction risks

- No viewport-edge collision avoidance (G1) — tooltips can overflow off-screen.
- No animation (G8) — abrupt appearance.
- `interactive=true` requires crossing the 8px gap from trigger to panel without it closing — finicky on coarse/touch pointers.

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| (headline) | ADOPT it (icon-only buttons across consoles) | — | safe-local |
| G1 | Collision-aware flip placement | P1 | safe-local (additive) |
| G2 | `@Watch('disabled')` auto-close | P1 | safe-local |
| G6 | Persistent `aria-describedby` | P2 | HIGH-RISK-QUEUE (a11y) |
| G5 | `focusableTrigger` opt-out | P2 | HIGH-RISK-QUEUE (a11y) |
| G3 | Proxy `open()`/`close()` on wrapper | P2 | safe-local |
| G4 | `hideDelay` input (or read the token) | P2 | safe-local |
| G7 | Esc-to-dismiss | P3 | safe-local |
| G8 | Animation / `arrow` toggle / `maxHeight` | P3 | safe-local |

## Fix-shared-vs-per-page

All belong in the shared component. No per-page work.

## Future-proof recommendation

Collision-aware flip (G1) is the most-asked tooltip feature in modern libraries (Radix, Floating UI) and `computeOffset` is already a pure x/y function — extending it to try alternative placements is the single highest-payoff upgrade. Pair with `@Watch('disabled')` (G2) and the two a11y items (G5/G6) and the tooltip is fully production-hardened — then DRIVE adoption.

## Deep-Dive Sweep Findings (2026-06-03 — B16)

**Consumer count: 0** (`[CODE]` grep — zero `apps/**`; playground showcase removed).

Corrected/added vs prior dossier:
- Consumer count 1 → **0** (playground route gone; showcase → falcon-studio gallery).
- ADDED: the Wave-6 Top-Layer/Popover promotion (a real wrapper behavior the prior dossier omitted) + clarified it fixes ANCESTOR-clipping, NOT viewport-edge overflow (G1 still open).
- ADDED: G4 token/behavior disconnect (`--falcon-tooltip-hide-delay` token unread by the timer).
- ADDED: no React/Vue parity; no spec/e2e.
- ADDED: the `-tw` arrow inline-style divergence documented as accepted (NOT a gap).
- a11y items (G5/G6) tagged HIGH-RISK-QUEUE; everything else safe-local.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16) against all source layers. Gaps re-derived from live source; Top-Layer integration + token-disconnect + parity divergence added. Two HIGH-RISK-QUEUE a11y items (G5/G6); rest safe-local. No deletion — component is sound but unused (ADOPT, don't remove).
