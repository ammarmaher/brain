# falcon-loader-inline — GAPS AND UPGRADES

## Missing capabilities (active source verified 2026-06-03)

### G1 — `-tw` host lacks `role="status"` / `aria-live` / `aria-busy` (P1, a11y parity)
`[CODE]` The Shadow tag's `<Host role="status" aria-live="polite" aria-busy={visible}>` (falcon-loader-inline.tsx:875) announces the busy state to assistive tech. The `-tw` twin's `<Host>` has **none of these** (falcon-loader-inline-tw.tsx:891). Since `useTailwind=true` is the DEFAULT render path, the canonical loader announces nothing to screen readers unless the consumer adds `role="status"` on a wrapper (the global app mount does — app.ts:71 — but a bare `<falcon-angular-loader-inline>` elsewhere does not).

**Fix (P1):** add `role="status" aria-live="polite" aria-busy={this.visible ? 'true':'false'}` to the `-tw` `<Host>` to reach parity with the Shadow tag. **risk-class: HIGH-RISK-QUEUE** (a11y semantics on the default render path).

### G2 — Wrapper uses classic `@Input()`, no signal inputs (P3)
`[CODE]` falcon-loader-inline.component.ts:59-85 — legacy `@Input()`, not Angular-21 `input()`/`model()`. Functionally fine; house direction is signals-first. Low-priority.

### G3 — No `prefers-reduced-motion` freeze (P2, a11y)
`[CODE]` Neither render path nor the token CSS has an `@media (prefers-reduced-motion: reduce)` rule — the full particle field + ring + icon animation run regardless of OS reduced-motion. (Same gap as loader-overlay B-CAL A4.)

**Fix (P2):** add a reduced-motion rule that pauses/freezes the particle field + ring + icon animation. **risk-class: safe-local.**

### G4 — `-tw` does NOT clamp particle/skeleton counts (P2, parity)
`[CODE]` The Shadow tag clamps `starsCount`/`rippleCount`/`skeletonRows` via `Math.max(0, Math.floor(...))` (falcon-loader-inline.tsx:328,342,849). The `-tw` twin loops raw `for (i < cfg.starsCount)` in `refreshSeedsIfNeeded` (falcon-loader-inline-tw.tsx:338-358) + `renderSkeleton` (:851). A fractional count truncates differently; a negative count is a silent no-op (loop won't run — milder than the loader-overlay B-CAL G2 `RangeError`, but still a divergence).

**Fix (P2):** share a clamped seed util across both tags. **risk-class: safe-local.**

### G5 — Default config brand colours are raw hex, not palette aliases (P2)
`[CODE]` `DEFAULT_INLINE_CFG` in BOTH `.tsx` files hardcodes `#0d3f44` / `#15803d` / `#F1F6F6` (falcon-loader-inline.tsx:42-208) instead of `--color-falcon-{teal,green,neutral}-*` aliases — so the loader doesn't auto-follow palette changes. The token file also has a raw `rgba(255,255,255,…)` glossy overlay (loader-inline.tokens.css:90). (Same family as loader-overlay B-CAL G5.)

**Fix (P2):** alias to `var(--color-falcon-*, #fallback)` where a 1:1 palette colour exists. **risk-class: safe-local.**

### G6 — No `loader-inline-tailwind-classes.ts` helper (P2, cross-framework SSOT)
`[CODE]` The `-tw` twin inlines ALL layout class strings + token reads (`relative flex flex-col items-center gap-3`, the absolute-positioned layers, etc.) — there is no `tailwind/loader-inline-tailwind-classes.ts` SSOT (unlike input/button/badge). This blocks a clean React/Vue twin reuse and means layout drift between any future framework wrappers. (Same as loader-overlay B-CAL G6.)

**Fix (P2):** extract static layout class strings + keyframe-name maps into a shared helper. **risk-class: safe-local.**

### G7 — No spec / e2e coverage (P2)
`[CODE]` grep 2026-06-03 → **no `*loader-inline*.spec.ts` / `.e2e.ts`** for either Stencil tag or the wrapper, despite config-merge + particle-seed + visibility-event + clamp logic.

**Fix (P2):** add a Stencil spec (config merge / bad-JSON fallback / count clamp) + a wrapper spec (`configJson()` object-vs-string + the two visibility-event re-emits — would lock the clean event-name parity). **risk-class: safe-local.**

### G8 — `DEFAULT_INLINE_CFG` + brand-mark path-d duplicated in 3 places (P2, DRY/drift)
`[CODE]` The 30-group defaults + `FALCON_BRAND_MARK_PATH_D` are inlined VERBATIM in the Shadow `.tsx` (:29-212), the `-tw` `.tsx` (:40-193), AND the Studio `registry/loader-studio/defaults.ts`, kept in sync only by "KEEP IN SYNC" comments (the Stencil `rootDir` pin forbids value-imports from `@falcon/studio`). Editing one copy silently drifts the others. (Same family as loader-overlay B-CAL G8.)

**Fix (P2):** codegen the inlined copies from the Studio SoT, or relocate defaults into a Stencil-importable leaf. **risk-class: safe-local.**

### G-SVG — `customSvg` injected via unsanitised `innerHTML` (P1, security)
`[CODE]` Both tags inject `config.customSvg` raw: Shadow via a `ref` callback `el.innerHTML = raw` (falcon-loader-inline.tsx:762-766), `-tw` via JSX `innerHTML={cfg.customSvg}` (falcon-loader-inline-tw.tsx:684). SVG can carry `<script>` / event handlers. Only the Studio editor feeds `customSvg` today (low live risk), but it is a raw HTML sink. (Same as loader-overlay B-CAL G3.)

**Fix (P1):** sanitise `customSvg` (DOMPurify SVG profile) or constrain to an allow-list before injection. **risk-class: HIGH-RISK-QUEUE.**

## Missing template slots
- **None applicable** — the loader is intentionally slot-free (config-driven). `customSvg` is the only content-injection mechanism (and it's a security concern — G-SVG).

## Missing flags / states
- No `@Method() setVisible()` / programmatic API on the tags — visibility is purely prop-driven (fine for the service-bound pattern).
- No "determinate progress" mode — the inline loader is indeterminate only (the loader-OVERLAY has a progress bar; the inline one does not).

## Missing accessibility features
- **A1 (P1):** the `-tw` host live-region gap (G1) — the headline a11y issue.
- **A2 (P2):** no reduced-motion freeze (G3).
- `[CODE]` The Shadow tag correctly `aria-hidden`s every decorative layer + the dots; the `-tw` twin marks layers `pointer-events-none` but doesn't `aria-hidden` every one consistently — minor.

## Missing tests
See G7 — zero spec/e2e for a component that is the global loader.

## Missing Tailwind / token parity
- See G6 (no tailwind-classes helper) + G4 (count-clamp divergence) + G5 (raw-hex defaults).
- `[CODE]` Token parity at the cascade level is OK — both tags read the same `--falcon-loader-inline-*` chrome tokens; the divergence is in how each path applies CONFIG (Shadow `buildVars` writes CSS vars; `-tw` writes inline styles).

## Performance risks
- `[CODE]` Memoised `@State` particle seeds (re-seeded only on count change) keep re-renders cheap — good.
- `[CODE]` The hidden-loader animation pause (`:not([visible]) * { animation-play-state: paused !important }`) means the always-mounted global card costs zero CPU when idle — the deliberate "lightweight contract."
- `[INFERRED]` With many decorative layers enabled (stars + ripples + bg-anim + halo + pattern + noise simultaneously) on a large `size`, compositing cost rises — but the default config enables only ring + glow + dots, so the common case is cheap.

## Visual / interaction risks
- Two render paths can drift if config-application logic ships to one tag only (process risk — guard via a parity spec, G7). The a11y host gap (G1) and count-clamp gap (G4) are existing instances.
- The global loader's dim teal backdrop is on the APP wrapper `<div>` (app.ts), not the loader element — so a per-region `showInline` loader has NO backdrop (by design; it fills its `position:relative` parent).

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| G-SVG | Sanitise `customSvg` innerHTML sink | P1 | HIGH-RISK-QUEUE |
| G1 | `role/aria-live/aria-busy` parity on `-tw` host | P1 | HIGH-RISK-QUEUE |
| G3 | `prefers-reduced-motion` freeze | P2 | safe-local |
| G4 | Clamp particle/skeleton counts in `-tw` | P2 | safe-local |
| G5 | Alias default brand colours to palette tokens | P2 | safe-local |
| G6 | Extract `loader-inline-tailwind-classes.ts` | P2 | safe-local |
| G7 | Add Stencil + wrapper specs | P2 | safe-local |
| G8 | De-duplicate 3-way config defaults | P2 | safe-local |
| G2 | Migrate wrapper to `input()` signals | P3 | safe-local |

## Fix-shared-vs-per-page
All gaps belong in the **shared Falcon component / token file / service**, NOT per-page. The loader is the single global busy surface; per-page hacks would fork the cross-framework SSOT + the service counters.

## Workarounds (if upgrade blocked)
- For G1 today: add `role="status"` on your wrapper `<div>` when using `useTailwind` (as `app.ts` does).
- For G-SVG today: never feed user-supplied `customSvg`; keep it Studio-editor-only.
- For G3 today: none at the component level — the consumer cannot inject reduced-motion CSS into the Shadow path.

## Deep-Dive Sweep Findings (2026-06-03 — B17)

**Consumer count: 4 render sites / 2 files + 6 service-consumer files** ([CODE] grep `<falcon-angular-loader-inline>` + `FalconLoaderService`).

NEW dossier created from scratch (no prior `falcon-loader-inline/` dir — verified absent). Key findings:
- **Event-name parity is CLEAN** (both tags explicit kebab `eventName`) — the loader-overlay B-CAL G1 class-of-bug does NOT exist here. Documented as a positive contrast.
- **2 HIGH-RISK-QUEUE:** G-SVG (customSvg innerHTML sink) + G1 (`-tw` host a11y live-region gap on the DEFAULT render path).
- **7 safe-local:** G2-G8 (signal-inputs / reduced-motion / count-clamp / raw-hex / no-tailwind-helper / no-specs / 3-way default dup).
- Cross-referenced to the loader-overlay dossier (B-CAL) — same `FalconLoaderService`, same customSvg/default-dup/tailwind-helper families, BUT loader-inline is the current GLOBAL loader (since 2026-05-19) while loader-overlay is demoted to scoped use.
- See FINDINGS/B17.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17 — NEW) against all source layers. G1 (a11y host gap) + G4 (count clamp) + G-SVG (innerHTML) confirmed by direct Shadow-vs-`-tw` comparison; G7 (no specs) + G8 (3-way default dup) grep/read-verified. Component is ACTIVE/PREFERRED (the global loader) — no deletion/promotion flags.
