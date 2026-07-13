# falcon-loader-overlay — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` falcon-loader-overlay.tsx:2-3 — the loader-overlay is the **brand's "we are working" face**: the fullscreen Falcon-mark splash an operator sees while the platform boots, switches routes, or reloads the world after a save. In business terms it is **reassurance + a gate** — it tells the user the system is busy AND (when `showBehind=false`) physically blocks interaction so no half-loaded state can be acted on. It carries **no business logic and no `BR-*` rule of its own** — it is a presentation surface whose every pixel is supplied by the Loader Studio JSON config.

`[CODE]` falcon-loader-overlay.tsx:5-8 — the source explicitly pins it to **100% visual parity with the React `FullscreenLoader` engine** (the brand SoT). The business value of this component is therefore *brand fidelity*: the Angular/Stencil platform must show exactly the loader the design studio produced, with no drift.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| (none direct) | — | The overlay is presentational — it surfaces "busy", it enforces no domain rule. |
| Brand loader must match the React Loader Studio output | `[CODE]` falcon-loader-overlay.tsx:5-11 | The component renders the same 21 config groups the React engine does, from the same JSON contract — brand parity is the contract. |
| In-flight operations should be unambiguous | `[CODE]` loader-overlay.tokens.css:42-50 | The overlay sits at the **top of the z-ladder (100002)** so when shown it occludes drawer / popover / toast — the busy gate is visually unambiguous. |

## Business constraints baked in
- `[CODE]` apps/host-shell/src/app/app.ts:58-65 — **the fullscreen overlay is deliberately NOT the default global loader.** As of 2026-05-19 the product chose the lighter **inline** loader (centered card + dim teal backdrop) as the everyday busy indicator, reserving the fullscreen overlay for boot/route-transition and explicit scoped use. A builder must NOT "promote" the overlay back to global without a product decision — the demotion was intentional (less jarring for routine waits).
- `[CODE]` falcon-loader-overlay.component.ts:78-84 — **the overlay never closes itself.** The `(falconLoaderOverlayClose)` event is advisory; the *caller* owns the dismiss so a business flow can **veto** a user's attempt to close the loader mid-operation (e.g. a payment must finish). This is a deliberate "consumer decides" contract.
- `[CODE]` falcon-loader.service.ts:68-86 — **visibility is counter-based.** Multiple concurrent business reasons can hold the loader open; it only hides when the LAST reason disposes. A builder calling `showOverlay('payment')` MUST hold the disposer and call it on completion, or the loader sticks. `hideOverlay()` is a force-reset escape hatch for the global error handler only.
- `[CODE]` falcon-loader-overlay.tsx:265-277 — **invalid config can never crash the boot loader.** Bad JSON is swallowed and the component falls back to `DEFAULT_OVERLAY_CFG`. Business consequence: a corrupt Studio export degrades to the default brand splash rather than a white screen during boot — a deliberate resilience choice.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Loader design / preview | Loader Studio editor (`/falcon-ui-showcase/loader-studio`) | The live preview canvas — a designer edits JSON and watches the brand loader repaint. **This is the only live business flow that renders it today.** |
| Boot / route transition | host-shell shell | _Intended_ role; currently served by the **inline** loader instead (overlay parked). |
| Scoped in-flight gate | e.g. do-payment-priority popup | Drives `showOverlay()` for a blocking brand veil during a critical operation (mounts no element of its own — relies on a global mount that is currently the inline loader). |

## Business gotchas
- **"Why does my fullscreen loader never show in the app?"** — because no app template mounts `<falcon-angular-loader-overlay>`; the shell mounts the **inline** loader. `showOverlay()` increments a counter that the inline loader's `overlayVisible()` reads — the *inline* loader appears, not the fullscreen one. Mounting the fullscreen overlay is a deliberate, currently-unused option (`[CODE]` app.ts:58-65).
- **A stuck loader is almost always a missing disposer** — `showOverlay()` returns a function; not calling it leaves the counter > 0 forever. Not a component bug.
- **The loader is brand-dark in both themes** — it does not follow light/dark mode (TOKENS.md "Dark mode"). That is intentional brand behaviour, not a theming gap.
- **`config.customSvg` renders arbitrary markup** — a Studio export with a custom logo injects raw SVG via `innerHTML` (`[CODE]` falcon-loader-overlay.tsx:794-796). If Studio exports ever come from untrusted authors, this is a stored-markup exposure (see `INTEGRATION_VALIDATION.md` + GAPS G3) — a *business-trust* boundary, not just a code nit.
- **The lifecycle events are unreliable** — a flow that gates business logic on `(falconLoaderShown)`/`(falconLoaderHidden)` firing will silently never run (event-name mismatch, GAPS G1). Gate on `visible` / service counters instead.

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-loader-overlay.tsx + falcon-loader.service.ts + app.ts. The "overlay is not the global loader" business decision ✅ VERIFIED against `[CODE]` app.ts:58-65 (dated 2026-05-19 in-source). No `BR-*` rule binds this presentational primitive. React-parity business intent 🔴 asserted by source banner, not re-rendered this pass.
