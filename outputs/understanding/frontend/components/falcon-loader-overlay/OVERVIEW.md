# falcon-loader-overlay — OVERVIEW

## Component purpose

Always-alive, fullscreen **brand loader / boot splash** rendered entirely from a JSON config (the "Loader Studio" surface). It is the dual-render-path Stencil overlay (Shadow DOM `<falcon-loader-overlay>` + Light DOM `<falcon-loader-overlay-tw>` + Angular passthrough wrapper `<falcon-angular-loader-overlay>`) that draws the animated Falcon mark, halo, orbit ring, particle field, caption, progress bar and 21 numbered visual groups over a full-viewport stage. Unlike the form-control wrappers (`<falcon-angular-input>` family), it carries **no CVA, no form value, no slots** — it is a one-way config sink driven by `FalconLoaderService`.

## Business / UI use case

- **Boot / route-transition splash** — the Falcon-branded "Preparing your workspace…" screen the app shows while the shell hydrates or a remote loads.
- **Loader Studio live preview** — the editor at `/falcon-ui-showcase/loader-studio` mounts this overlay inside a contained preview card and pipes live JSON edits straight into its `config` so a designer sees the loader paint in real time (`[CODE]` libs/falcon-studio/src/lib/components/loader-studio/loader-studio.component.html:207).
- **Scoped post-save / in-flight gate** — available for any flow that needs a brand-grade fullscreen veil rather than the lighter inline loader (the do-payment-priority popup drives `FalconLoaderService.showOverlay()` for exactly this reason, though it mounts no element of its own).

## When to use it / when NOT to use it

**Use it for:**
- A fullscreen, brand-heavy boot / route-transition / "reloading the world" experience where the animated Falcon mark + caption are wanted.
- The Loader Studio editor preview (its canonical live render site today).
- A scoped fullscreen veil that must occlude EVERY other surface (it sits at the top of the unified z-ladder, `--falcon-loader-overlay-z-index: 100002`).

**Do NOT use it for:**
- The **default in-app global loader** — that role moved to `<falcon-angular-loader-inline>` on 2026-05-19 (a centered card on a dim teal backdrop). The fullscreen overlay is no longer the global loader (`[CODE]` apps/host-shell/src/app/app.ts:58-65).
- A small in-region / in-card spinner → use the inline loader primitive.
- A button-scoped or table-scoped busy state → use the inline loader keyed by target id (`FalconLoaderService.showInline(target)`).
- Anything needing a return value, a form contract, or content projection → wrong component (this is a pure config sink).

## Status

**ACTIVE / LIBRARY-READY, but currently LOW-ADOPTION.** Built in the "Loader Studio rebuild" wave series (Shadow = Wave 2, `-tw` = Wave 3, Angular wrapper = Wave 4, service = Wave 6, polish = Wave 8). The Angular wrapper is NOT mounted in any application template today — its only live render site is the Loader Studio editor preview (see Consumer Sweep in USAGE.md). The shell deliberately renders the **inline** loader instead. Not deprecated; it is the parked-but-supported fullscreen path.

## Replaces

- The legacy hand-rolled fullscreen boot splash.
- 100% visual parity target: the React `FullscreenLoader` engine at `C:\Falcon\Source_of_truth_theme\React\Loader Studio\admin\loader-studio.jsx` (`[CODE]` falcon-loader-overlay.tsx:5-8).

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-loader-overlay/falcon-loader-overlay.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-loader-overlay/falcon-loader-overlay.component.html` |
| Angular wrapper CSS | _none — the wrapper has no `.component.css`; it is a pure tag-switcher with zero layout rules._ |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-loader-overlay/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-loader-overlay/falcon-loader-overlay.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-loader-overlay/falcon-loader-overlay.css` (~24 KB — scoped `flo-*` rules + `@keyframes`) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-loader-overlay-tw/falcon-loader-overlay-tw.tsx` |
| Stencil Light CSS | `libs/falcon-ui-core/src/components/falcon-loader-overlay-tw/falcon-loader-overlay-tw.css` (global `@keyframes` only — `flo*` prefix) |
| Types | `libs/falcon-ui-core/src/components/falcon-loader-overlay/falcon-loader-overlay.types.ts` (inlined verbatim from the studio SoT) |
| Utils | _none — no `.utils.ts`; helpers are private methods on each component._ |
| Tailwind helper | _none — the `-tw` twin uses inline `style={{…}}` token reads, NOT a `*-tailwind-classes.ts` helper (divergence from the input/badge pattern; see GAPS G6)._ |
| Component token file | `libs/falcon-ui-tokens/src/components/loader-overlay.tokens.css` (~271 lines, 19 numbered categories) |
| Studio config SoT | `libs/falcon-studio-runtime/src/lib/registry/loader-studio/config.types.ts` (the canonical `FalconLoaderOverlayCfg`; the types file above is a verbatim inline copy) |
| Runtime controller | `libs/falcon-studio-runtime/src/lib/services/falcon-loader.service.ts` (`FalconLoaderService` — counter-based show/hide + live config signal) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-loader-overlay` |
| Stencil Shadow tag | `<falcon-loader-overlay>` |
| Stencil Light tag | `<falcon-loader-overlay-tw>` |

## Known consumers (grep verified, 2026-06-03)

- `libs/falcon-studio/src/lib/components/loader-studio/loader-studio.component.html:207` — the **only live render site** of `<falcon-angular-loader-overlay>`; the editor's "Test Fullscreen" preview card. Drives `[config]` from the studio's live signal and overrides positioning to `absolute` via descendant arbitrary-variant classes.
- `apps/host-shell/src/app/app.ts:63` — **comment only** (documents why the overlay is NOT mounted as the global loader; the inline loader is mounted instead).
- `apps/host-shell/src/app/app.config.ts:160` — **comment only** (provider wiring for `FalconLoaderService` + `FALCON_LOADER_DEFAULTS`).
- `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.html:31` — **comment only** (notes it drives `showOverlay()` but mounts no element).

> Net: **1 live consumer** (the Studio editor preview). No application feature page renders the overlay tag today. See USAGE.md Consumer Sweep.

## Related components

- **Sibling primitive:** `<falcon-loader-inline>` / `<falcon-angular-loader-inline>` — the centered-card loader that is now the default global loader. Both read the SAME `FalconLoaderService.config()` signal (overlay block vs inline block).
- **Editor:** `libs/falcon-studio` Loader Studio component — authors the JSON config this overlay renders.
- **Controller:** `FalconLoaderService` — the App=API layer (the wrapper itself injects nothing per doctrine §6 "Library = Skeleton, App = API").

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework Stencil + Angular wrapper). The JSON config contract is owned by `libs/falcon-studio-runtime` (registry/loader-studio). Token contract lives in `libs/falcon-ui-tokens`. Visual parity SoT is the React Loader Studio engine.

## Verification
🟡 code-derived from the wrapper / Shadow / `-tw` sources + token file + `FalconLoaderService` + grep'd consumer set (2026-06-03). React-parity claim 🔴 unverified/inferred (asserted by the source banner; not re-rendered side-by-side in this read-only pass). NOT runtime-verified — no build/serve permitted this pass.
