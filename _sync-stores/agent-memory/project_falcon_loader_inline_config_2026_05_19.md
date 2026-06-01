---
name: Falcon Loader inline config applied
description: Where the Falcon Loader is configured + how InLine.txt Loader Studio exports get applied
type: project
originSessionId: 93a8f353-7c99-4064-b20e-87a7754930a8
---
🟢 BUILD-GREEN + RUNTIME-VERIFIED 2026-05-19.

**Where the Falcon Loader is configured** (overlay + inline engines):
1. Library seed `BUILT_IN_FALCON_LOADER_DEFAULTS` — `libs/falcon-studio/src/lib/registry/loader-studio/defaults.ts` (`INLINE_DEFAULTS` / `OVERLAY_DEFAULTS`). The permanent SoT + Loader Studio "Reset" baseline.
2. Per-app bootstrap override — `provideFalconLoader({ defaults: { inline|overlay: {...} } })` deep-merges over the seed. host-shell `apps/host-shell/src/app/app.config.ts` is the ONLY app that wires it (`provideFalconLoader`). `FalconLoaderService` reads the `FALCON_LOADER_DEFAULTS` token.

**What was done:** Applied a React Loader Studio export `C:\Users\User\Downloads\InLine.txt` (format `{mode,config[]}` — a key/value list, NOT the code's `{$schema,overlay,inline}` shape, so it needs transforming) to host-shell `app.config.ts` via the `provideFalconLoader` override (app-level, library `defaults.ts` untouched). Only 24 "live" inline keys applied; 18 "dead" keys skipped.

**RULE for future Loader Studio exports:** apply a key only if it (a) differs from the current default AND (b) sits in an enabled feature group. NEVER apply values inside a group whose boolean enabler is false (skeleton/stars/ripple/halo/innerShadow/dropShadow/iconShadow/autoCycle etc.) — those are inert and exports often carry stale leftovers (InLine.txt had red #56101b/#ca6363/#450d20 in disabled shadow groups).

**Verification:** host-shell webpack build compiled clean (fresh hash). The live runtime config exported via the Loader Studio "Export" button confirmed all 24 live keys = file values and all 18 dead keys = built-in defaults. Note: Loader Studio's "Loader engine" (overlay/inline) tablist renders empty — pre-existing Stencil-tab bug, blocks switching engines in the UI.

## Update — inline loader is the global DEFAULT loader (2026-05-19)

host-shell `app.ts` previously mounted the full-screen `<falcon-angular-loader-overlay>` as the always-alive global loader. Changed: the global mount is now `<falcon-angular-loader-inline>` — the inline engine is the default global loader, centered on the viewport, top z-index.

- Wrapper `<div data-fl-global-loader>` in `app.ts`: `fixed inset-0 z-[2000]` (loader tier — matches `--falcon-loader-overlay-z-index`), `flex items-center justify-center` centers the card. `display` toggled via `[class.flex]`/`[class.hidden]` bound to `overlayVisible()`.
- Backdrop: `bg-[color:var(--color-falcon-teal-alpha-18)]` (shared Falcon dialog/drawer backdrop token; resolves ~`rgba(105,142,146,0.3)`). A `backdrop-blur-[4px]` was tried then removed — full-viewport `backdrop-filter` is a per-load GPU cost (made the headless screenshot capture time out).
- Bound to `FalconLoaderService.overlayVisible()` (global show/hide counter) + `loader.config().inline`.
- The full-screen overlay is NO LONGER the global loader; it stays available for scoped use (`do-payment-priority-popup` mounts its own).
- ⚠️ No production code calls `showOverlay()` yet — only the Loader Studio "Test Fullscreen" button. The inline loader is now the established global DEFAULT, but won't actually appear until a trigger (route-change / HTTP interceptor) is wired.
- RUNTIME-VERIFIED via Studio "Test Fullscreen": inline `<falcon-loader-inline-tw>` card renders, card center === viewport center, `z-index:2000`, covers viewport, dim backdrop; idle → wrapper `display:none` (page not blocked).

## Update — inline loader animations were pause-locked, fixed (2026-05-19)

BUG: every inline-loader animation (orbit ring `fli-spin`, icon `fli-pulse`, 3 dots `fli-dot`) was permanently `animation-play-state: paused`. Root cause in `libs/falcon-ui-tokens/src/components/loader-inline.tokens.css` — the pause-when-hidden rule's 2nd selector group was `:where(.falcon-loader-inline, [data-falcon-loader-inline]):not([data-visible='true']) *`. The `-tw` component renders `<div data-falcon-loader-inline>` on its card as a token-cascade marker and NEVER sets `data-visible`, so `[data-falcon-loader-inline]:not([data-visible='true'])` matched unconditionally → pause-locked all descendants. Never caught before because the inline loader was never mounted-and-visible anywhere until it became the global loader.

FIX: removed `[data-falcon-loader-inline]` from that selector group → `:where(.falcon-loader-inline):not([data-visible='true']) *`. Group 1 (`:where(falcon-loader-inline, falcon-loader-inline-tw):not([visible]) *`) still correctly pauses a hidden loader via the tag's reflected `[visible]`. RUNTIME-VERIFIED on a clean reload: all 5 animations `running` + ticking (~983ms/sample).

GOTCHAS (dev server): (1) the Angular/webpack dev build does NOT watch transitively-`@import`ed CSS — editing a token CSS file under `falcon-ui-tokens/src/components/` triggers no rebuild; touch the styles entry `apps/host-shell/src/tailwind.css` or cold-restart. (2) `falcon-loader-inline-tw` loads from a pre-built `dist/` artifact — patching the `.tsx` needs a Stencil rebuild of `falcon-ui-core`; fixing the token CSS avoids that. (3) HMR can leave a stale `styles.css?t=<ts>` sheet across a dev-server restart — a clean full reload clears it.

## Update — do-payment-priority-popup uses the global inline loader (2026-05-19)

`apps/host-shell/src/app/shared-components/do-payment-priority-popup/` previously mounted its OWN `<falcon-angular-loader-overlay [visible]="processing()">` (a per-popup full-screen overlay). Changed: removed that element + the `FalconAngularLoaderOverlayComponent` import; the component now injects `FalconLoaderService` and an `effect()` in the constructor bridges its `processing` signal → `showOverlay()` (held dismiss disposer, released when processing ends + on destroy). So the popup's loading feedback is now the GLOBAL inline loader (centred card + dim backdrop), never a full-screen overlay.

- This is the FIRST real production caller of `FalconLoaderService.showOverlay()` — previously only the Loader Studio "Test Fullscreen" button called it.
- Consequence: the full-screen overlay engine (`falcon-angular-loader-overlay`) now has ZERO product-feature consumers — only the Loader Studio dev tool uses it.
- `effect()` may write signals (Angular 19+ allows it) — `showOverlay()` mutates the service's counter signal; fine.
- Verified: build compiles clean (`b97c99d0fe56f498`). NOT live-flow-tested — the popup is consumed by admin-console/management-console (host-shell type-checks it but doesn't mount it itself, hence the pre-existing "unused" tsconfig warning), and a real do-payment flow needs a logged-in session. The global loader it now drives was itself runtime-verified earlier.
