# falcon-loader-overlay — DECISION

## Brain SK final recommendation

**STATUS: LIBRARY-READY but PARKED / LOW-ADOPTION. Use ONLY for fullscreen brand boot / route-transition / scoped blocking veils. For everyday in-app busy states use `<falcon-angular-loader-inline>` (the project default since 2026-05-19). Before any wider adoption, fix G1 (dead lifecycle events) and G3/G4 (security + a11y parity).**

## Use this component for

- A fullscreen, brand-grade boot / route-transition splash (animated Falcon mark + caption).
- The Loader Studio editor live preview (its canonical render site today).
- A scoped, blocking fullscreen veil that must occlude every other surface (top of the z-ladder).
- Anywhere the design literally shows the React "FullscreenLoader" — this is its Angular/Stencil port.

## Avoid this component for

- The **default in-app global loader** → `<falcon-angular-loader-inline>`.
- A region/button/table-scoped spinner → `<falcon-angular-loader-inline>` keyed by target id.
- A data-table skeleton → the data-table skeleton surface.
- Anything needing a form value, a return, or content projection → wrong component (it is a config sink).

## Preferred variant / render path

**`useTailwind=true` (default)** — the Light-DOM `<falcon-loader-overlay-tw>`. Best for:
- Studio token-runtime mutation + consuming the app's Tailwind v4 build.
- Cross-framework parity (the token contract is shared).
- BUT note the `-tw` path currently has the a11y parity gaps (G4) and unclamped particle counts (G2) — fix before relying on it for a blocking modal.

**`useTailwind=false`** (Shadow path) — switch to it when you need style isolation from a noisy parent stylesheet, or when you want the (currently superior) Shadow a11y on the progress bar. Note Shadow lacks `aria-busy` (G4) and silently swallows bad JSON (G2).

## Required upgrades before wider use

- **G1 (P0)** — the wrapper's `falconLoaderShown`/`falconLoaderHidden` `@Output`s are almost certainly dead (event-name mismatch). This MUST be fixed before any consumer depends on lifecycle events.
- **G3 (P1)** — sanitise `config.customSvg` (innerHTML sink) before allowing non-first-party configs.
- **G4 (P1)** — bring Shadow↔`-tw` to a11y parity (progressbar / aria-hidden / aria-busy).

These three are the gate. The remaining gaps (G2 partial, G5–G8, specs) are improvements, not blockers.

## Relationship to other components

- **Sibling primitive:** `<falcon-angular-loader-inline>` — the centered-card loader that supplanted this as the global loader. Both read the same `FalconLoaderService.config()` (overlay block vs inline block).
- **Controller:** `FalconLoaderService` (in `falcon-studio-runtime`) — the App=API layer; the wrapper injects nothing.
- **Editor:** the Loader Studio component (`libs/falcon-studio`) authors the JSON this overlay renders.
- **Config SoT:** `libs/falcon-studio-runtime/.../config.types.ts` + `defaults.ts` (the types/defaults are inlined verbatim into the Stencil layer).

## Exact rule for future implementation tasks

1. **Need a fullscreen brand boot/route-transition splash?** Use `<falcon-angular-loader-overlay>` with `useTailwind=true`.
2. **Need an everyday in-app busy indicator?** Use `<falcon-angular-loader-inline>` — NOT this overlay.
3. **Drive `[config]` + `[visible]` from `FalconLoaderService`** (`loader.config().overlay`, `loader.overlayVisible()`); never inject services into the wrapper.
4. **Author appearance in the Loader Studio editor** (the JSON config); override only **geometry tokens** for containment.
5. **Never bind `(falconLoaderShown)`/`(falconLoaderHidden)`** until G1 lands — derive lifecycle from `[visible]`.
6. **Never pass untrusted `config.customSvg`** (G3).
7. **For a blocking modal (`showBehind=false`)**, add your own focus management / Esc (the element has none — A2).

---

## Dynamic capability assessment

### 1. What is static today?
- The Falcon brand mark path-d (`FALCON_BRAND_MARK_PATH_D`) — hardcoded in both `.tsx` files (logo source `t2`).
- The full set of `@keyframes` (`flo*`) — fixed animation curves; the config picks WHICH keyframe, not the curve.
- The close-button glyph (`×`), `aria-label="Close loader"`, and its 42px geometry (`-tw` path).
- The `100vh` stage min-height (`-tw`) — not tokenised (G7).
- The `DEFAULT_OVERLAY_CFG` values (duplicated, G8).

### 2. What is already dynamic through inputs/outputs?
- **Everything visual** flows through the single `[config]` JSON (21 groups, ~130 keys): stage bg mode/colours, vignette/noise/grid/scanlines, tint, animated bg (6 types), pattern (6 kinds), stars, waves, ripples, spotlight, halo, ring (5 styles), bubbles (4 directions), sparkles, logo (+ 12 motions), progress (2 styles), caption/sub-caption/dots (3 styles), skeleton, global opacity, `showBehind`.
- `[visible]` (presence) + `[useTailwind]` (render path).
- 3 outputs: `falconLoaderOverlayClose` (works), `falconLoaderShown`/`falconLoaderHidden` (dead today — G1).

### 3. What is already dynamic through slots / ng-template?
- **Nothing.** No `<slot>` / `<ng-content>`. Logo/caption/custom SVG are config keys, not projected content.

### 4. What is dynamic through token/theme overrides?
- **Geometry/containment** — `--falcon-loader-overlay-position`/`-z-index`/`-inset`/`-transition-*` (the correct override surface for embedding).
- The ~130 visual tokens act as DEFAULTS, but the JSON config writes inline CSS vars that WIN, so token override of appearance is normally moot (override the JSON instead).
- No dark-mode/density/auto-palette following (intentional brand-dark surface).

### 5. What is dynamic through Tailwind classes?
- Host `class=` flows to the wrapper (layout/containment — e.g. `block w-full h-full`).
- Descendant arbitrary-variants (`[&_falcon-loader-overlay-tw]:[--token:value]`) are the documented containment technique.
- There is no `wrapperClass`/`inputClass` input and no `*-tailwind-classes.ts` helper (G6).

### 6. What is missing to make this component reusable across pages?
- Working lifecycle events (G1).
- Sanitised custom-logo path (G3).
- a11y parity on the `-tw` path (G4) so it is safe as a blocking modal.
- A tokenised stage min-height (G7) so it embeds without `!important`.
- Specs (none exist).

### 7. What capability should be added to shared component (not page hack)?
- The G1 event fix, G3 sanitisation, G4 a11y parity — all belong in the two Stencil tags + wrapper, never per-page.
- A shared `applyConfig`/`seedParticles` util (G2) so both render paths behave identically.

### 8. What flags / options / templates / slots would make it better?
- `@media (prefers-reduced-motion)` handling (A4) — pause/freeze the field for reduced-motion users.
- An optional `trapFocus`/`closeOnEsc` flag for blocking-modal mode (A2).
- A `sanitizeCustomSvg` default-on guard (G3).

### 9. What is the safest upgrade path?
1. **Phase A (correctness, low risk):** fix the wrapper event-name mismatch (G1) — align binding names on both render paths; add a wrapper spec that asserts the events fire.
2. **Phase B (a11y parity):** add `role="progressbar"`+values + `aria-hidden` decorative markers to the `-tw` twin; add `aria-busy` to the Shadow host (G4).
3. **Phase C (security):** sanitise `customSvg` before `innerHTML` (G3).
4. **Phase D (hygiene, zero behavior change):** alias token hex → `--color-falcon-*` (G5), token-ise stage min-height (G7), extract a Tailwind helper (G6), codegen the duplicated defaults (G8).

Phases A–C touch public behavior/semantics → HIGH-RISK-QUEUE (need runtime verification). Phase D is safe-local.

### 10. What is risky to change because other pages depend on it?
- The `[visible]` presence-only contract — the token cascade's `:not([visible])` rule + the Studio editor both depend on it; changing to a boolean attr would break visibility.
- The `--falcon-loader-overlay-position: fixed` + `z-index: 100002` defaults — the Studio editor token-overrides them; other consumers (if any appear) would too.
- The `config` JSON shape (`FalconLoaderOverlayCfg`) — it is the contract with the Loader Studio editor + the React SoT; additive keys are safe, renames/removals break the editor.
- The `data-fl-part` attribute names on the `-tw` path — the Studio editor targets `[data-fl-part=stage]` for containment; renaming them breaks the preview.
- Demoting/removing the Shadow path — the Studio editor preview uses the `-tw` path, but the dual-render contract is a platform promise; do not drop either tag.

## Verification
🟢 code-verified against the wrapper / Shadow / `-tw` / token file / `FalconLoaderService` / Studio editor usage (2026-06-03). The "parked, inline is global" status ✅ VERIFIED against `[CODE]` app.ts:58-65. G1 runtime impact 🟡 code-derived (not browser-reproduced this read-only pass). React-parity 🔴 asserted by source banner.
