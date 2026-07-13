# falcon-loader-inline — OVERVIEW

## Component purpose
A **per-region, always-alive brand loader** — the Falcon falcon-mark icon inside a shaped "stage" with an orbit ring, optional glow/halo/stars/ripples/pattern, plus a caption + dots + optional skeleton rows. Driven by a **30-group JSON config** (the inline half of the Loader Studio schema). Mounted once per loadable region, kept in the DOM, and toggled via a reflected `[visible]` attribute that the token cascade reads to flip `display:none` + pause every animation (zero paint / zero CPU when hidden). Dual-render: Shadow `<falcon-loader-inline>` + Light `<falcon-loader-inline-tw>` + Angular CVA-free wrapper `<falcon-angular-loader-inline>`.

## Status — the CURRENT default GLOBAL loader (since 2026-05-19)
`[CODE]` app.ts:58-75 — **as of 2026-05-19 the INLINE loader engine (not the full-screen overlay) IS the default global app loader**: a centered loader card on a dim Falcon-teal backdrop, pinned to the viewport, driven by `FalconLoaderService.overlayVisible()`. The full-screen `<falcon-angular-loader-overlay>` is **no longer** the global loader — it stays available for scoped use (the do-payment-priority popup mounts its own overlay). This makes `falcon-loader-inline` one of the most visible components in the platform despite having few direct tag consumers (the global mount + Studio previews).

**ACTIVE / PREFERRED.** Loader Studio rebuild — Wave 5a (Shadow) / 5b (`-tw`) / 5c (wrapper) / Wave 6 (service) / Wave 7 (typed event handlers).

## Business / UI use case
- **Global app loader** (its primary role) — every `FalconLoaderService.showOverlay(reason)` call surfaces this centered inline card over a dim backdrop (`[CODE]` app.ts:66-78).
- **Per-region loaders** — drop into a `position:relative` card/panel/section; `FalconLoaderService.showInline(target)` keys visibility per region so multiple loaders can coexist on one page (currently exercised live only by the Loader Studio mini-previews — `[CODE]` loader-studio.component.html:213-236).
- **Section skeletons** — `skeletonOn` renders progressively-narrowing placeholder rows below the icon.

## When to use it / when NOT to use it
**Use it for:**
- A scoped "loading…" state inside a card / panel / table region (`showInline(target)`).
- The global blocking loader (already wired in `app.ts` — you call `FalconLoaderService.showOverlay()`, you do NOT mount the tag).

**Do NOT use it for:**
- A full-screen particle/bubble splash veil → that is `<falcon-angular-loader-overlay>` (the sibling; see its dossier — B-CAL).
- A button busy-spinner → use `<falcon-angular-button [loading]>`.
- A bare CSS spinner → this component is heavyweight (30 config groups); a small skeleton/spinner is overkill territory.

## Replaces
- The pre-2026-05-19 full-screen `<falcon-angular-loader-overlay>` global loader (demoted to scoped use).
- Ad-hoc per-feature spinners / PrimeNG `<p-progressSpinner>`.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-loader-inline/falcon-loader-inline.component.ts` (152 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-loader-inline/falcon-loader-inline.component.html` (31 ln — pure tag-switcher) |
| Angular wrapper CSS | _None_ — the wrapper has no `styleUrl` (relies on the token cascade + the inner tags). |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-loader-inline/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-loader-inline/falcon-loader-inline.tsx` (901 ln, `shadow: true`) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-loader-inline/falcon-loader-inline.css` (832 ln — `fli-*` keyframes + token reads) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-loader-inline-tw/falcon-loader-inline-tw.tsx` (909 ln, `shadow: false`) |
| Stencil Light CSS | `libs/falcon-ui-core/src/components/falcon-loader-inline-tw/falcon-loader-inline-tw.css` (154 ln — global `fli-*` keyframes) |
| Types | `libs/falcon-ui-core/src/components/falcon-loader-inline/falcon-loader-inline.types.ts` (281 ln — `FalconLoaderInlineCfg` 30 groups, inlined from the Studio SoT) |
| Tailwind helper | _None_ — the `-tw` twin inlines all layout classes + token reads (GAP G6; same shape as loader-overlay). |
| Component token file | `libs/falcon-ui-tokens/src/components/loader-inline.tokens.css` (260 lines; 20 categories; visibility-gate cascade) |
| App=API service | `libs/falcon-studio-runtime/src/lib/services/falcon-loader.service.ts` (164 ln — `showOverlay`/`showInline`/`isInlineVisible` + the live config signal) |
| Stencil spec/e2e | _None on disk (verified 2026-06-03)_ — GAP G7. |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-loader-inline` |
| Stencil Shadow tag | `<falcon-loader-inline>` |
| Stencil Light tag | `<falcon-loader-inline-tw>` |

## Known consumers (grep verified 2026-06-03)
`[CODE]` `<falcon-angular-loader-inline>` renders at **4 sites**:
- `apps/host-shell/src/app/app.ts:72` — **the global app loader mount** (the canonical, highest-traffic consumer; bound to `FalconLoaderService.overlayVisible()` + `inlineConfig()`).
- `libs/falcon-studio/.../loader-studio/loader-studio.component.html:213,230,233,236` — the Loader Studio editor preview + 3 mini-previews (light/mid/dark backgrounds, `[useTailwind]="true"`).

`[CODE]` Separately, **6 app files inject `FalconLoaderService`** and drive the loader *programmatically* (no tag render): `app.ts`, `do-payment-priority-popup.component.ts` (`showOverlay`), `service-pricing.component.ts` (`showOverlay`), `organization-hierarchy-tree.component.ts` (`showOverlay`), `login-transition.service.ts` (`showOverlay`), + the do-payment popup html. **No app currently uses the per-target `showInline(target)` path** outside the Studio previews — the global mount uses the overlay COUNTER (`overlayVisible()`), not per-target inline counters (see INTEGRATION).

## Related components
- **Sibling:** `<falcon-angular-loader-overlay>` (full-screen veil; both read `FalconLoaderService.config()` — overlay reads `.overlay` slice, inline reads `.inline` slice). See B-CAL dossier `components/falcon-loader-overlay/`.
- **Controller:** `FalconLoaderService` (`falcon-studio-runtime`) — the App=API layer that owns counters + the live config signal.
- **Studio:** `loader-studio.component` (the visual editor that mutates the live config).

## Ownership / responsibility
`libs/falcon-ui-core` owns the Stencil + Angular wrapper (cross-framework skeleton). `libs/falcon-studio-runtime` owns `FalconLoaderService` + the config schema + defaults (App=API). `libs/falcon-ui-tokens` owns the token contract. Per doctrine §6 "Library = Skeleton, App = API": the wrapper injects NOTHING and knows nothing about the service.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B17 sweep — NEW dossier). All source layers read on disk; the "current global loader since 2026-05-19" role confirmed at app.ts:58-78; 4 render sites + 6 service-consumer files grep-verified; event-name parity confirmed (both tags explicit kebab `eventName` — unlike loader-overlay's B-CAL bug). Cross-referenced to the loader-overlay dossier (B-CAL).
