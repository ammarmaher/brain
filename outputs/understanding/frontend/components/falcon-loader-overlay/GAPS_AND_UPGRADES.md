# falcon-loader-overlay — GAPS AND UPGRADES

> Audit findings for this component live here in prose. Table rows are mirrored in `C:\Falcon\plans\library-deep-dive\FINDINGS\B-CAL.md`. Rubric dims: A Angular-21 · B Stencil-dual-render · C Falcon-house-rules · D a11y · E cross-framework-parity · F completeness/drift.

## Missing capabilities (active source verified)

### G1 — Wrapper listens for kebab event names the Stencil tags don't emit (P0 — likely dead `@Output`s)

`[CODE]` falcon-loader-overlay.component.html:13-16 binds `(falcon-loader-shown)="falconLoaderShown.emit()"` and `(falcon-loader-hidden)="falconLoaderHidden.emit()"`. But both Stencil tags emit the **camelCase** event names `falconLoaderShown` / `falconLoaderHidden` — the Shadow variant via explicit `eventName: 'falconLoaderShown'` (`[CODE]` falcon-loader-overlay.tsx:234,238) and the `-tw` via Stencil's auto-derivation from the field name (`[CODE]` falcon-loader-overlay-tw.tsx:325,329 — no `eventName`, so Stencil uses the property name `falconLoaderShown`). DOM event names are case-sensitive, so the wrapper's `(falcon-loader-shown)` listener never matches the emitted `falconLoaderShown`. **Result: the `falconLoaderShown` and `falconLoaderHidden` `@Output`s on the Angular wrapper almost certainly never fire.** Only `falconLoaderOverlayClose` works (both sides agree on the explicit kebab `falcon-loader-overlay-close`).

**Impact:** any consumer wiring `(falconLoaderShown)`/`(falconLoaderHidden)` gets silence. Low blast radius *today* (no app consumer uses them) but it is a latent correctness bug that will bite the first real adopter.

**Recommended fix (P0):** make the binding names match the emitted names. Either bind `(falconLoaderShown)`/`(falconLoaderHidden)` in the wrapper template, OR add explicit kebab `eventName: 'falcon-loader-shown'` / `'falcon-loader-hidden'` to BOTH Stencil tags so the kebab listeners match. Whichever side changes, change it on **both** render paths to keep parity. **Risk-class: HIGH-RISK-QUEUE** (changes a public event contract / behavior; needs a runtime check + a consumer sweep).

### G2 — Shadow ↔ `-tw` behavioural divergences (P1, dual-render parity)

Three concrete divergences between the two render paths that share one public contract:

1. **Config envelope.** `-tw` accepts a full `{ overlay: {...} }` wrapper and slices `.overlay` (`[CODE]` falcon-loader-overlay-tw.tsx:373-379); Shadow merges the raw object as-is (`[CODE]` falcon-loader-overlay.tsx:269). The same payload is interpreted differently by the two tags.
2. **Particle-count clamping.** Shadow clamps `bubbleCount`/`sparkleCount`/`starsCount` with `Math.max(0, Math.floor(...))` (`[CODE]` falcon-loader-overlay.tsx:282,292,301); `-tw` uses the raw value (`[CODE]` falcon-loader-overlay-tw.tsx:392,399,406) → a negative or fractional count throws `RangeError` in the default render path.
3. **Bad-JSON handling.** Shadow swallows silently; `-tw` `console.warn`s (`[CODE]` falcon-loader-overlay-tw.tsx:382-387). Minor, but a parity inconsistency.

**Recommended fix (P1):** lift `applyConfig`/`seedParticles` into a shared helper (or a `*.utils.ts`) consumed by both tags so envelope-unwrap + clamping + logging are identical. **Risk-class: safe-local** for the clamp + logging; the envelope-unwrap alignment is **HIGH-RISK-QUEUE** (it changes what payload shape each tag accepts).

### G3 — `customSvg` injected via `innerHTML` without sanitisation (P1, security)

Both paths inject `config.customSvg` raw: Shadow via a `ref` callback `el.innerHTML = raw` (`[CODE]` falcon-loader-overlay.tsx:794-796), `-tw` via the JSX `innerHTML={cfg.customSvg}` prop (`[CODE]` falcon-loader-overlay-tw.tsx:933-938). If a Loader Studio config can ever originate from an untrusted author (tenant-supplied theme, imported JSON), this is a stored-markup / script-injection sink (SVG can carry `<script>` / event handlers).

**Recommended fix (P1):** sanitise `customSvg` through a DOMPurify-equivalent (SVG profile) before injection, or constrain `customSvg` to a vetted allow-list of inner elements. **Risk-class: HIGH-RISK-QUEUE** (security).

### G4 — Accessibility parity gaps between Shadow and `-tw` (P1, a11y)

The two render paths diverge on ARIA:
- **`aria-busy`** — set on the `-tw` host (`[CODE]` falcon-loader-overlay-tw.tsx:1103) but NOT on the Shadow host.
- **`role="progressbar"` + `aria-valuemin/max/now`** — present on the Shadow progress bar (`[CODE]` falcon-loader-overlay.tsx:705-708) but **absent** on the `-tw` progress bar (`[CODE]` falcon-loader-overlay-tw.tsx:1024-1052 — a plain `<div>`).
- **`aria-hidden` on decorative layers** — the Shadow path marks grid/scanlines/noise/vignette/halo/ring/etc. `aria-hidden="true"`; the `-tw` path uses `data-fl-part` markers but omits `aria-hidden`, so a screen-reader may traverse the decorative spans.

**Recommended fix (P1):** bring the `-tw` twin to ARIA parity — add `role="progressbar"`+values on its progress bar, add `aria-hidden="true"` to its decorative layers; add `aria-busy` to the Shadow host. **Risk-class: HIGH-RISK-QUEUE** (a11y semantics on a public component).

### G5 — Token file hardcodes brand hex instead of `--color-falcon-*` aliases (P2, house-rule)

`[CODE]` loader-overlay.tokens.css:65-242 declares ~30 brand colours as raw hex/rgba (`#0a2f33`, `#15803d`, `#a16207`, `rgba(255,255,255,…)`) rather than `--color-falcon-*` palette aliases (the convention `input.tokens.css` follows). Consequence: the loader does NOT auto-follow palette/theme changes. Partly intentional (the React JSON SoT ships explicit hex), but the *token defaults* should still alias the palette where a 1:1 colour exists.

**Recommended fix (P2):** replace literal hex with `var(--color-falcon-{family}-{shade}, #fallback)` where the palette has the colour; keep the hex as the fallback. **Risk-class: safe-local.**

### G6 — No Tailwind class-builder helper for the `-tw` twin (P2, consistency/drift)

`<falcon-input-tw>` / `<falcon-badge-tw>` consume a `*-tailwind-classes.ts` SSOT helper; `<falcon-loader-overlay-tw>` does not — it inlines all layout + token reads as `style={{…}}` / `class="…"` literals throughout the `.tsx` (`[CODE]` falcon-loader-overlay-tw.tsx). This is defensible (the loader's classes are highly conditional per the 21 groups) but it breaks the cross-framework SSOT pattern and means a future React/Vue loader would have to re-derive the class logic rather than import it.

**Recommended fix (P2):** extract the static layout class strings + the keyframe-name maps into `loader-overlay-tailwind-classes.ts` so React/Vue twins (if built) share them. **Risk-class: safe-local.**

### G7 — `min-height: 100vh` on the `-tw` stage breaks containment (P2)

`[CODE]` falcon-loader-overlay-tw.tsx:1122 hardcodes `minHeight: '100vh'`, forcing consumers who contain the overlay in a card to override it with `[&_[data-fl-part=stage]]:!min-h-0` (the Studio editor does exactly this). The fullscreen assumption is baked into the stage rather than the position token.

**Recommended fix (P2):** drive the stage min-height from a `--falcon-loader-overlay-stage-min-height` token (default `100vh`) so containment overrides the token instead of needing `!important`. **Risk-class: safe-local.**

### G8 — Default config duplicated across 3 files with manual "KEEP IN SYNC" (P2, drift)

`DEFAULT_OVERLAY_CFG` is inlined verbatim in `falcon-loader-overlay.tsx` (`[CODE]` :41-198) AND `falcon-loader-overlay-tw.tsx` (`[CODE]` :58-195), with a third canonical copy at `libs/falcon-studio-runtime/.../defaults.ts`. Likewise `FALCON_BRAND_MARK_PATH_D` and the types. Sync is enforced only by comment banners (`[CODE]` falcon-loader-overlay-tw.tsx:55-57). The Stencil `rootDir` pin (`libs/falcon-ui-core/src`) is the cited reason value-imports from `@falcon/studio` are impossible, forcing the duplication.

**Recommended fix (P2):** generate the two inlined copies from the studio SoT at build time (a codegen step), or move the defaults into a leaf the Stencil rootDir can import. **Risk-class: safe-local** (build tooling; no runtime behavior change).

### G9 — No imperative API / no `@Method()` (P3, by design but worth noting)

Neither tag exposes `show()`/`hide()`/`setFocus()`. Visibility is reflected-prop-driven and orchestrated by `FalconLoaderService`. This is consistent with the "service owns control" doctrine — documented, not a defect — but a consumer using the raw tag outside the service has no imperative handle. **Recommended:** none (intentional). Document the service as the only control surface.

## Missing accessibility features

- **A1 (P1):** see G4 — `-tw` progress bar lacks `role="progressbar"`; decorative layers lack `aria-hidden`; Shadow host lacks `aria-busy`.
- **A2 (P2):** no focus trap / Esc handling when `showBehind=false` (blocking modal mode). The element relies on the consumer (the Studio editor adds its own Esc). A blocking fullscreen veil should manage focus.
- **A3 (P3):** `aria-live="polite"` announces presence, but the caption text change (e.g. "Preparing…") is not announced as an update if the loader is already visible. Acceptable for a boot splash; worth a doc note.
- **A4 (P3):** no `prefers-reduced-motion` handling — the loader runs full animation regardless of the OS reduced-motion setting. A `@media (prefers-reduced-motion: reduce)` rule pausing/“freezing” the field would be a meaningful a11y win.

## Missing tests

- **No spec/e2e of any kind** for either Stencil tag or the Angular wrapper (grep `*loader-overlay*.spec.ts` / `*.e2e.ts` → 0 files, 2026-06-03). Given the config-merge + particle-seed + event logic, this is a real coverage hole. **GAP — add (a) a Stencil spec covering `applyConfig` merge + bad-JSON fallback + particle clamping, and (b) an Angular-wrapper spec covering `configJson()` object/string/null handling + the event re-emission (which would have caught G1).** **Risk-class: safe-local.**

## Missing Tailwind / token parity

- Token contract is shared via the `:where()` cascade (Shadow + `-tw` + wrapper) — **parity OK at the token level** (gate-12 clean).
- But the *render-path behaviour* diverges (G2) and the *a11y attributes* diverge (G4) and there is no shared Tailwind helper (G6). **Parity is contract-level only, not implementation-level.**

## Cross-framework parity (rubric E)

- **React/Vue wrappers: ABSENT.** No `libs/falcon-ui-react` / `libs/falcon-ui-vue` loader-overlay wrapper was found. The component is Stencil-core + Angular-wrapper only. Since the brand SoT *is* React, a `falcon-ui-react` wrapper would be the natural parity target. **GAP (E) — note for the cross-framework agent; safe-local.**

## Performance risks

- Particle fields are memoised in `@State` and re-seeded only on `@Watch('config')` (`[CODE]` falcon-loader-overlay.tsx:225-308) — good; paints don't reshuffle.
- A high `bubbleCount`/`starsCount` (config-driven) creates many animated DOM nodes; with the loader at the top of the z-ladder this is a fullscreen compositing cost. Acceptable for a transient boot splash; a long-lived overlay with hundreds of particles would be wasteful. **Watch, not a defect.**
- `regenerateParticles()` runs on every config change including `visible` toggles? No — `visible` has its own `@Watch` that only emits; particles re-seed only on `config` change. ✅ efficient.

## Visual / interaction risks

- Two render paths can drift (G2/G4 already realised). **Process risk — guard via a parity spec.**
- The `100vh` stage (G7) + `fixed` position (token) means a careless mount covers the viewport unexpectedly. Documented in USAGE "Bad usage."

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G1 | Fix wrapper event-name mismatch (dead `@Output`s) | P0 | HIGH-RISK-QUEUE |
| G3 | Sanitise `customSvg` innerHTML | P1 | HIGH-RISK-QUEUE |
| G4 | Shadow↔`-tw` a11y parity (progressbar/aria-hidden/aria-busy) | P1 | HIGH-RISK-QUEUE |
| G2 | Unify config-envelope + particle clamping across paths | P1 | mixed |
| G5 | Alias token hex → `--color-falcon-*` | P2 | safe-local |
| G6 | Extract `-tw` Tailwind helper SSOT | P2 | safe-local |
| G7 | Token-ise stage min-height | P2 | safe-local |
| G8 | De-duplicate default config (codegen) | P2 | safe-local |
| — | Add Stencil + wrapper specs | P2 | safe-local |
| A2 | Focus trap / Esc for blocking mode | P2 | HIGH-RISK-QUEUE |

## Fix-shared-vs-per-page

Every gap above lives in the **shared Falcon component** (the two Stencil tags + the wrapper + the token file), not per-page. The single live consumer (the Studio editor) must not paper over G1/G4 locally — fixing them at the component is the only correct move.

## Workarounds (if upgrade blocked)

- For G1 today: do NOT bind `(falconLoaderShown)`/`(falconLoaderHidden)`; derive lifecycle from `[visible]` / `FalconLoaderService.overlayReasons()`.
- For G3 today: never source `config.customSvg` from untrusted input; keep `logoSource: 't2'` unless the SVG is first-party.
- For G7 today: override `[&_[data-fl-part=stage]]:!min-h-0` when containing the overlay (the Studio pattern).
- For G2 (`-tw` clamp) today: ensure config particle counts are non-negative integers before passing.

## Calibration Sweep (2026-06-03)

**Consumer count: 1 live render site** ([CODE] grep across `apps/` + `libs/`; the Loader Studio editor preview). See `USAGE.md` Consumer Sweep. **New dossier (B-CAL batch)** — created from scratch this pass. Findings G1–G9 + A1–A4 surfaced and mirrored to `FINDINGS/B-CAL.md`.

## Verification
🟢 code-verified — every G/A finding cites a source line in the wrapper / Shadow / `-tw` / token file. The *runtime* manifestation of G1 (dead events) is 🟡 code-derived (read from the binding-name vs emit-name mismatch; not reproduced in a browser this read-only pass). React/Vue absence (E) confirmed by directory grep.
