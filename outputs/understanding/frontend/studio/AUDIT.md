# @falcon/studio + @falcon/studio-runtime — AUDIT (best-practice rubric §5)

Scope note: these are an **editor + runtime-controller** library pair, not Stencil dual-render UI primitives. Rubric **B (Stencil dual-render)** is N/A (the editor consumes Stencil wrappers but ships none of its own). **D (accessibility)** applies only to the editor's interactive surface. The audit weights **A (Angular-21 idioms)**, **C (house rules)**, **F (completeness / FE-CYCLE-01 leaf-extraction integrity / drift)** — the dimensions that bite here. The **runtime leaf and the editor are scored separately** where they differ.

## Rubric scorecard

| Dim | `@falcon/studio-runtime` (leaf) | `@falcon/studio` (editor) | One-line basis |
|---|---|---|---|
| **A — Angular 21** | PASS | 🟡 minor | Leaf: `FalconLoaderService` is signal-first, counter-based, `inject()`, `providedIn:'root'`, zoneless-safe — exemplary. Editor: standalone + OnPush + signals + `@if/@for/@switch` (zero `*ngIf/*ngFor` across the whole lib), `CUSTOM_ELEMENTS_SCHEMA` where Stencil tags render; minor — `studio-page`/`falcon-studio` still import `CommonModule` despite using only new control-flow, and use legacy `@HostListener` + raw DOM (`document.createElement('a')` for download). |
| **B — Stencil dual-render** | ⚪ N/A | ⚪ N/A | Ships no Stencil components; consumes `@falcon/ui-core` wrappers. |
| **C — Falcon house rules** | 🟡 minor | 🟠 medium | Leaf: pure TS, terse `*** ***` banners, kebab-case, frozen consts ✅; tokens-over-literals N/A (config carries hex *as data*). Editor: Falcon-components-only doctrine HONORED in loader-studio (every row is `<falcon-angular-*>`), but **one studio-local raw-ish primitive** (`<falcon-studio-slider>`, GAP-LIB-slider) + `<falcon-studio-color-picker>` exist; `falcon-studio.component.css` carries declared CSS rules (whitelisted in eslint, an explicit SCSS-rule carve-out); the gallery uses ad-hoc preview markup. |
| **D — Accessibility** | ⚪ N/A | 🟡 minor | Editor: `<falcon-studio>` engineering view has `role="tablist"/"tab"`+`aria-selected`+`aria-label` ✅; the loader-studio editor relies on Falcon components for control a11y but its own bespoke chrome (color swatches, SVG paste) is unaudited; Test-Fullscreen has Esc + close-X but the bespoke editor is not a focus-trapped dialog. |
| **E — Cross-framework parity** | ⚪ N/A | ⚪ N/A | The Studio editor + loader runtime are Angular-only by design (the loader *config model* is framework-neutral TS; the React SoT generated it, but there is no React/Vue Studio). |
| **F — Completeness / drift / leaf integrity** | 🟠 medium | 🟠 medium | **FE-CYCLE-01 leaf extraction is INTEGRITY-CLEAN** (verified below). But: **ZERO `*.spec.ts` in either lib** (G3) — the validator + service counter + import/export round-trip are untested in-lib; **`defaults.ts` / `FALCON_BRAND_MARK_PATH_D` inlined VERBATIM in 3 places** synced by comments (B-CAL G8, G4); a **stale doc-comment** in host `app.config.ts:173` still points at the pre-move `libs/falcon-studio/.../data-table-skeleton-defaults.token.ts` path (G5); the FE-standard doc's "route removed" claim is stale (G6). |

**Area verdict: 🟠 (medium).** The runtime leaf is high-quality, signals-first infrastructure and the cycle-breaking extraction is **genuinely correct** (no suppression). The medium rating is driven entirely by **hygiene**: no in-lib tests, a verbatim-defaults DRY hazard shared with the loader primitives, and a couple of stale doc/path references — all `safe-local`, none runtime-breaking.

---

## A — Angular 21

**Leaf — PASS.** `[CODE]` `falcon-loader.service.ts`:
- `@Injectable({providedIn:'root'})`, all state in `signal()`/`computed()`, `inject(FALCON_LOADER_DEFAULTS)` (`:24-44`). Counter-based `showOverlay/showInline` return idempotent disposers (guarded by a local `dismissed` flag, `:71-86`) — clean, zoneless-safe, no manual change detection.
- `isInlineVisible(target)` caches a `computed` per target (`:148-157`) — avoids re-creating signals; good.
- Providers use modern `Provider`/`useFactory` with deep-merge purity (`loader-defaults.provider.ts:23-52`); no NgModules anywhere.

**Editor — 🟡 minor.** `[CODE]`:
- `loader-studio.component.ts:76-96` — standalone, OnPush, explicit `imports`, `CUSTOM_ELEMENTS_SCHEMA`, signals (`testOverlayOpen`, `toast`, `svgPasteValue`), `computed` (`visibleModules`), `effect` for live-sync, `inject()`. Exemplary.
- `falcon-studio.component.ts` + `studio-page.component.ts` — same modern shape; the template uses `@if/@for/@switch` (`falcon-studio.component.ts:41-108`). `[CODE]` `Grep '*ngIf|*ngFor|[ngClass]|ngSwitch'` across `libs/falcon-studio/src/lib` = **0** → control-flow migration is COMPLETE.
- 🟡 `studio-page.component.ts:33` imports `CommonModule` but uses only new control-flow → likely unused/over-broad import (the loader-studio component correctly imports no `CommonModule`). `safe-local`.
- 🟡 Legacy decorators: `@HostListener('window:keydown',...)` (`falcon-studio.component.ts:130`), `@HostListener('document:keydown.escape')` (`loader-studio.component.ts:364`) — functional but the codebase elsewhere is moving to `inject()`-based listeners; acceptable. Raw DOM in `downloadJson` (`document.createElement('a')`, `loader-studio.component.ts:214-224`) — pragmatic blob-download, fine.

## C — Falcon house rules

**Leaf — 🟡 minor.** ✅ Pure side-effect-free TS, terse `*** ***` banners on every file, kebab-case filenames, `Object.freeze` on all seed consts. Tokens-over-literals is **N/A** — `defaults.ts` carries hex strings (`bgColor:'#0d3f44'`, `:20`) *as configuration data* (the loader config IS a colour payload), not as styling literals. The data-table skeleton defaults correctly point at `var(--color-falcon-neutral-100,...)` tokens (`data-table-skeleton-defaults.token.ts:64-65`) ✅.
- 🟡 `FalconLoaderService.setConfig` logs `console.error` on reject (`:53-54`) with a leading blank line (lint-disable artifact) — minor.

**Editor — 🟠 medium.** ✅ The loader-studio editor enforces the **Falcon-components-only** doctrine: every form row is `<falcon-angular-input/switch/tabs/tag/textarea/button>` (`loader-studio.component.ts:38-46`), with the documented `<falcon-studio-slider>` exception (GAP-LIB-slider — `<falcon-angular-slider>` not yet in falcon-ui-core, `:32-37`). ✅ terse banners, kebab-case.
- 🟠 **C-1 — studio-local UI primitives.** `<falcon-studio-slider>` and `<falcon-studio-color-picker>` are hand-built controls living in the editor lib rather than `@falcon/ui-core`. The slider is explicitly a stopgap with a migration note; the color-picker is undocumented. Per the house "Falcon-components-over-raw-UI" rule these are GAP/promotion candidates. `safe-local` (the slider is doctrine-acknowledged).
- 🟡 **C-2 — declared CSS rules.** `falcon-studio.component.css` carries real CSS (it is one of exactly 3 files whitelisted in `eslint.config.mjs:439-444` as a no-CSS-rules-loaded carve-out). The Tailwind-only house rule is bent here; acknowledged + whitelisted. `safe-local`.

## D — Accessibility (editor only)

🟡 minor. ✅ `[CODE]` `falcon-studio.component.ts:48-63` — engineering-view nav uses `role="tablist"`, per-tab `role="tab"` + `[attr.aria-selected]` + `aria-label`. ✅ Loader-studio Test-Fullscreen has Esc handler + close-X (`loader-studio.component.ts:193-202,364-369`).
- 🟡 **D-1** — the bespoke loader-studio chrome (colour swatches via `swatchBackground`, the SVG-paste textarea, module master toggles) leans on Falcon-component a11y but its own surrounding markup is unaudited; Test-Fullscreen is not a true focus-trapped dialog. `safe-local` (it's an internal authoring tool, not a customer surface).

## F — Completeness / drift / **FE-CYCLE-01 leaf-extraction integrity**

### F.0 — Leaf extraction INTEGRITY (the headline check) — ✅ CLEAN

The FE-CYCLE-01 claim ("the `falcon-studio → falcon-ui-core-angular → falcon-studio` cycle was eliminated for real by extracting the runtime surface DOWN into a leaf") is **CODE-VERIFIED on disk**:
1. **Direction is downward.** Wrappers in `@falcon/ui-core/angular` import the runtime from `@falcon/studio/runtime` (the leaf), never the heavy barrel. `[CODE]` 8 wrapper files (`falcon-loader-overlay/inline`, `falcon-data-table`, `falcon-table`, `falcon-image/document-uploader`, `falcon-wizard-finalization`) import `@falcon/studio/runtime` only.
2. **The leaf is a genuine leaf.** `[CODE]` `libs/falcon-studio-runtime/project.json:14-21` — build target has **NO `dependsOn`** and the barrel imports nothing from the workspace except `@angular/core` (verified across `index.ts` + service files). It cannot cycle.
3. **`falcon-studio` depends DOWN on it.** `[CODE]` `falcon-studio` `index.ts:244` `export * from '@falcon/studio/runtime'` (re-export for back-compat) + the editor imports the leaf via `@falcon/studio/runtime` (`loader-studio.component.ts:53-61`, `loader-studio-state.service.ts:16-26`). `falcon-studio/project.json:22-28` `dependsOn` falcon-ui-core (it consumes the wrappers) — correct.
4. **The scoped boundary allow was DELETED, not relied on.** `[CODE]` `eslint.config.mjs:85-96` documents the former scoped `@nx/enforce-module-boundaries` allow for `@falcon/ui-core/angular` (last scoped to `libs/falcon-studio/**`) is DELETED, cycle gone with NO allowance.
5. **Back-compat preserved.** Every prior `@falcon/studio` consumer (`FalconLoaderService`, the `*_DEFAULTS` tokens, config types, `FALCON_LOADER_MODULES`, `FALCON_COMPONENT_DEFAULTS`) still resolves through the re-export. The dual TS-path aliases (`@falcon/studio` + `@falcon/studio/runtime`) both exist. `[CODE]` `tsconfig.base.json:55-60`.
6. **MF singleton transparency.** `@falcon/studio` and `@falcon/studio/runtime` both match the `libraryName.startsWith('@falcon/')` branch in the host MF resolver → **singleton + eager** when loaded; they are NOT in the explicit `additionalShared` list (only `@falcon` + `@falcon/sdk` are listed there, but the `shared()` branch covers all `@falcon/*`). `[CODE]` `apps/host-shell/module-federation.config.ts:41-50,108-130`. So the runtime service is a true singleton across federated bundles — the FE-CYCLE-01 "MF singleton transparent (any `@falcon/*` → singleton eager)" claim is CORRECT.

→ **No integrity defect found.** The split is the textbook fix, and the original `@falcon/studio/runtime` TDZ-crash concern (gallery eager-init) is structurally impossible from the leaf (it can't reach the gallery registry). `[CODE]` leaf `index.ts:16-21` rationale.

### F.1–F.6 — drift / hygiene findings

- 🟠 **G3 — ZERO in-lib tests.** `[CODE]` Glob over `libs/falcon-studio/src/**` and `libs/falcon-studio-runtime/src/**` → **0 `*.spec.ts`**. The runtime `validateLoaderConfig` (parse/schema-gate/enum-guard/merge), `FalconLoaderService` counter + disposer idempotency, `mergeLoaderConfig` deep-merge, and the editor's import/export round-trip have no unit coverage. For a foundational always-mounted service this is the top hygiene gap. `safe-local`.
- 🟠 **G4 / B-CAL-G8 — verbatim-defaults DRY hazard.** `[CODE]` `BUILT_IN_FALCON_LOADER_DEFAULTS` + `FALCON_BRAND_MARK_PATH_D` (`defaults.ts:16,371`) are the SoT, but the Stencil primitives `falcon-loader-overlay.tsx` + `falcon-loader-overlay-tw.tsx` inline a `DEFAULT_OVERLAY_CFG` + the same brand-mark path VERBATIM (Stencil `rootDir` pin forbids value-imports from `@falcon/studio`), synced only by "KEEP IN SYNC" comments. A change here must be hand-mirrored in 3 places → silent drift risk. (Same finding surfaced in B-CAL.) `safe-local`.
- 🟡 **G5 — stale doc-path in host app.config.** `[CODE]` `apps/host-shell/src/app/app.config.ts:173` comment still says "See `libs/falcon-studio/src/lib/services/data-table-skeleton-defaults.token.ts`" — but that file moved to `libs/falcon-studio-runtime/...` in FE-CYCLE-01. Doc-only; cosmetic. `safe-local`.
- 🟡 **G6 — FE-standard doc stale.** `[BRAIN-OUT]` `ANGULAR_AND_TAILWIND_RULES.md:147` says the host-shell route is removed; the loader-studio route is LIVE (`falcon-ui-showcase.routes.ts:17`). Corrected in this dossier's OVERVIEW; the source doc should be updated. `safe-local`.
- 🟡 **G7 — `setField` type-erasure.** `[CODE]` `loader-studio-state.service.ts:101-107` — the generic `setField(key:string, value:unknown)` dispatches via `key as ...Key` + `value as never`. Type safety relies on the row-renderer pairing each control with a correct typed key from its module spec; a registry typo would not be caught at compile time. Acknowledged in-comment. `safe-local`.
- 🟡 **G8 — app-level test references the old path.** `[CODE]` `apps/host-shell/tests/falcon-component-defaults.spec.ts:14` comment points at `libs/falcon-studio/src/lib/registry/loader-studio` (pre-move). Stale comment in a passing test. `safe-local`.
- 🟡 **G9 — `<falcon-studio>` orphaned (editor).** The token/theme editor shell is exported but route-less (0 app mounts). 100+ supporting components (gallery, token editors, abstraction-map, popup matrix, ~26 skeletons) exist purely for this dormant surface + the gallery. Decide: revive (route it), or accept it as the in-repo design-tool kept on disk. `safe-local` (dead-but-intentional per "hidden-but-kept").

## HIGH-RISK-QUEUE items (do NOT fix this pass)

**NONE.** Every finding is `safe-local` (tests / DRY-codegen / stale-doc / dead-but-kept editor / acknowledged type-erasure). The B-CAL `customSvg` raw-`innerHTML` XSS sink lives in the **loader-overlay Stencil primitives**, not in these two libs — the editor only strips the `<svg>` wrapper and stores the string; it is already in the loader-overlay HIGH-RISK-QUEUE (B-CAL G3). The studio libs neither introduce nor mitigate it.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L09). Each finding cites a read source line. Leaf-extraction integrity (F.0) verified against both project.json (no leaf `dependsOn`), 8 wrapper import sites, the deleted eslint allow (`eslint.config.mjs:85-96`), the dual tsconfig aliases, and the MF `@falcon/*` singleton branch. Test-absence verified by Glob (0 specs in either src tree). Control-flow migration verified complete (`*ngIf/*ngFor` count = 0). Area verdict 🟠 medium; **0 HIGH-RISK-QUEUE**, 9 safe-local.
