# Falcon Cross-Framework — OVERVIEW

> Non-component library AREA covering THREE libs at once (SPEC §7 lighter 5-file set: OVERVIEW · SURFACE · USAGE · AUDIT · DECISION). Mirrors the falcon-input / @falcon-sdk dossier tone; adapts the structure for *generated wrapper* + *demo-data* libraries. Every Falcon fact is source-prefixed.

## Purpose

This area documents the **framework-bridge tier** of the Falcon UI system — how the Stencil web components in `@falcon/ui-core` reach **non-Angular** consumers, plus the shared demo catalog that drives the cross-framework showcase apps. Three libs, one story:

| Lib | Package | Role | One line |
|---|---|---|---|
| `falcon-ui-react` | `@falcon/ui-react` | **Generated React wrappers** | Thin React function-components wrapping every `@falcon/ui-core` custom element, auto-emitted by `@stencil/react-output-target`. `[CODE]` `libs/falcon-ui-react/src/index.ts:1-3`. |
| `falcon-ui-vue` | `@falcon/ui-vue` | **Generated Vue 3 proxies** | Thin Vue 3 component proxies wrapping the same custom elements, emitted by a **custom post-build script** (`generate-vue-proxies.cjs`), NOT the Stencil Vue plugin. `[CODE]` `libs/falcon-ui-vue/src/index.ts:1-3`. |
| `falcon-ui-showcase-data` | `@falcon/ui-showcase-data` | **Demo/showcase catalog** | A static TS+JSON registry of components (slug/name/tag/category) + 28 hand-written markdown doc files, consumed by the cross-framework playground apps. `[CODE]` `libs/falcon-ui-showcase-data/src/index.ts:1-2`. |

The headline question of this batch (SPEC §5 dim E) is **cross-framework parity**: does every Stencil component have a React AND a Vue wrapper, and are the generated wrappers still in sync with the current Stencil component set? **Answer (measured 2026-06-03): YES — 106 Stencil custom-element folders → 106 React wrappers → 106 Vue wrappers, byte-for-byte identical tag set, 100% parity.** Multiple earlier component batches flagged "no React/Vue parity" for specific components (e.g. `loader-overlay`); **those flags are FALSE** — see AUDIT dim E for the per-flag refutation.

## Business / architectural use case

- **Stencil's "write once, render anywhere" promise.** `@falcon/ui-core` compiles to framework-agnostic custom elements (`dist-custom-elements`). A raw custom element is awkward in React (no JSX typing, events via `addEventListener`, props-vs-attributes pitfalls) and in Vue (`is`/`v-bind` ceremony). The two wrapper libs make `<FalconButton onFalconClick={…}/>` (React) and `<FalconButton @falcon-click="…"/>` (Vue) feel native. `[BRAIN-OUT]` `reference_fe_structure_standard_angular21_2026_06_02` — repo is Angular 21 + webpack-MF; the React/Vue libs are the **outbound** framework story, not used by the Angular apps themselves.
- **One Stencil source, three framework consumers.** Angular consumes the components through `@falcon` `falcon-angular-*` wrappers (the in-repo apps); React/Vue consume through these two generated libs. The intended audience is **external teams or future Falcon micro-frontends** built on React/Vue — see DECISION for the "published-but-unconsumed" status.
- **Showcase-data = the single catalog behind the demo playgrounds.** `[CODE]` `libs/falcon-ui-showcase-data/src/index.ts:2` — "Consumed by apps/demo/{angular,react,vue}. Add a component once here, it appears in all three." The registry classifies each component into 8 categories and points at a markdown doc; the playgrounds render a gallery + a docs panel from it.

## What lives here / what does NOT

**Lives here:**
| Lib | Files |
|---|---|
| `falcon-ui-react` | `src/index.ts` (barrel) · `src/components.ts` (2088-line generated wrapper file) · `package.json` · `project.json` · `tsconfig.json` · `package-lock.json` (isolated local install) · `WAVE-6-REACT-TARGET.md` (build recon doc) |
| `falcon-ui-vue` | `src/index.ts` (2656-line generated proxy file) · `src/index.ts.bak` (4-line orphan stub) · `package.json` · `project.json` · `tsconfig.lib.json` · `WAVE-7-VUE-TARGET.md` (build recon doc) |
| `falcon-ui-showcase-data` | `src/index.ts` (typed catalog API) · `src/registry.json` (28-component registry) · `src/docs/*.md` (28 component docs + `README.md`) · `package.json` · `project.json` · `tsconfig.json` |

**Does NOT live here:** the Stencil component source (`libs/falcon-ui-core/src/components/*`), the generation engines (`@stencil/react-output-target` is a host-installed devDep of `falcon-ui-core`; `generate-vue-proxies.cjs` lives in `libs/falcon-ui-core/`, NOT in the vue lib), the Angular wrappers (`libs/falcon-ui-core/src/angular-wrapper/`), and the playground apps (`demos/angular-playground/` is a standalone Vite app, NOT an nx project). These libs are **pure outputs + a static catalog** — the seam, not the engine.

## How the wrappers are generated (the pipeline)

| | React (`@falcon/ui-react`) | Vue (`@falcon/ui-vue`) |
|---|---|---|
| **Engine** | `@stencil/react-output-target@0.7.4` — a Stencil **output target** that runs **in-process** during `nx build falcon-ui-core`. `[VAULT]`-equiv `WAVE-6-REACT-TARGET.md:14`; `[CODE]` `stencil.config.ts:47` (`reactOutputTarget({...})`). | `generate-vue-proxies.cjs` — a **standalone post-build Node script** in `libs/falcon-ui-core/`, called from `build.cjs` after the Stencil build (both the clean and EMFILE-recovery paths). `[CODE]` `WAVE-7-VUE-TARGET.md:27-37`. **NOTE:** `stencil.config.ts` contains **NO `vueOutputTarget` reference** (`Grep 'vue'` = 0 hits) — the WAVE-7 doc's `vueOutputTarget()` snippet is STALE; the live mechanism is the custom script (AUDIT F1). |
| **Why custom for Vue** | n/a | On Windows, Stencil's virtual-FS never flushes output-target files when the build exits on EMFILE (file-handle exhaustion during the PostCSS/Tailwind scan). The Stencil Vue plugin's `compilerCtx.fs.writeFile` becomes a no-op. The standalone `.cjs` re-parses `@Prop()`/`@Event()` decorators from `.tsx` and emits the proxies deterministically. `[CODE]` `WAVE-7-VUE-TARGET.md:21-30`. |
| **Output** | `libs/falcon-ui-react/src/components.ts` (re-exported via `src/index.ts`). `'use client';` directive at top (Next.js RSC compat). `[CODE]` `components.ts:1`. | `libs/falcon-ui-vue/src/index.ts` directly. Calls `defineCustomElements()` at module load (`includeDefineCustomElements:true`). `[CODE]` `index.ts:8`. |
| **Hand-edit?** | **NO** — banner: "DO NOT hand-edit this barrel — re-run nx build falcon-ui-core to regenerate." `[CODE]` `index.ts:1-3`, `components.ts:4-5`. | **NO** — banner: "auto-generated vue proxies — regenerated by generate-vue-proxies.cjs on nx build falcon-ui-core". `[CODE]` `index.ts:3`. |
| **Build target** | `nx:run-commands` → `tsc -p tsconfig.json`; `dependsOn: ['install', 'falcon-ui-core:build']` so wrappers regenerate before compile. `[CODE]` `project.json:21-30`. Has its OWN local `install` target (isolated `node_modules`, `--legacy-peer-deps`). | `nx:run-commands` → `tsc --project tsconfig.lib.json --noEmitOnError false` wrapped in `|| exit 0` (JS emits even on type errors). `[CODE]` `project.json:13-18`. |

`falcon-ui-showcase-data` is **hand-maintained** (not generated): `registry.json` carries `"generatedAt": "2026-05-11"` but is edited by hand per the docs README's "How to add a new component doc" procedure. `[CODE]` `registry.json:4`; `docs/README.md:36-42`.

## Status

- **`falcon-ui-react` / `falcon-ui-vue`:** ACTIVE outputs, **0.1.0**, regenerated on every `falcon-ui-core` build. **Published-but-unconsumed in-repo** — `Grep '@falcon/ui-react'` / `'@falcon/ui-vue'` across `apps/` + `libs/` = **0 importers** (the Angular apps use `@falcon` `falcon-angular-*` instead). Intended for external/future React/Vue consumers. `[CODE]` consumer sweep 2026-06-03.
- **`falcon-ui-showcase-data`:** ACTIVE catalog, **0.0.1**, `private:true`. Also **0 in-repo barrel importers** — the only existing playground (`demos/angular-playground`) reads its OWN duplicated copy of the docs (`demos/component-docs/`, 28 files) and its own `studio/registry.ts`, NOT this lib. `[CODE]` consumer sweep + `Grep` of `demos/angular-playground`. The README's `demos/react-playground` + `demos/vue-playground` **do not exist** on disk (only `angular-playground` + `component-docs`). `[CODE]` `ls demos/`.

## Source file paths

| Lib | Concern | Path | Size |
|---|---|---|---|
| react | Barrel | `libs/falcon-ui-react/src/index.ts` | 5 lines |
| react | Generated wrappers | `libs/falcon-ui-react/src/components.ts` | 2088 lines (106 `export const`) |
| react | Manifest | `libs/falcon-ui-react/package.json` | 29 lines |
| react | Nx config | `libs/falcon-ui-react/project.json` | 38 lines |
| react | tsconfig | `libs/falcon-ui-react/tsconfig.json` | 25 lines |
| react | Isolated lockfile | `libs/falcon-ui-react/package-lock.json` | 676 lines |
| react | Build recon doc | `libs/falcon-ui-react/WAVE-6-REACT-TARGET.md` | 92 lines |
| vue | Generated proxies | `libs/falcon-ui-vue/src/index.ts` | 2656 lines (106 `export const`) |
| vue | Orphan stub | `libs/falcon-ui-vue/src/index.ts.bak` | 4 lines (`export {}`) |
| vue | Manifest | `libs/falcon-ui-vue/package.json` | 26 lines |
| vue | Nx config | `libs/falcon-ui-vue/project.json` | 32 lines |
| vue | tsconfig | `libs/falcon-ui-vue/tsconfig.lib.json` | 19 lines |
| vue | Build recon doc | `libs/falcon-ui-vue/WAVE-7-VUE-TARGET.md` | 101 lines |
| showcase | Catalog API | `libs/falcon-ui-showcase-data/src/index.ts` | 55 lines |
| showcase | Registry | `libs/falcon-ui-showcase-data/src/registry.json` | 53 lines (28 components, 8 categories) |
| showcase | Component docs | `libs/falcon-ui-showcase-data/src/docs/*.md` | 28 component MDs + `README.md` |
| showcase | Manifest | `libs/falcon-ui-showcase-data/package.json` | 9 lines |
| showcase | Nx config | `libs/falcon-ui-showcase-data/project.json` | 17 lines (build/lint = `nx:noop`) |

**Spec/tests:** `[CODE]` NONE across all three libs (Glob over each `src/**/*` finds zero `*.spec.ts`). Generated wrapper correctness is unverified by a test; the showcase catalog has no validation test (and its `$schema` target is missing — AUDIT F2). See AUDIT F.

## Import paths / selectors

- `@falcon/ui-react` → `libs/falcon-ui-react/src/index.ts`. `[CODE]` `tsconfig.base.json:97-99`.
- `@falcon/ui-vue` → `libs/falcon-ui-vue/src/index.ts`. `[CODE]` `tsconfig.base.json:100-102`.
- `@falcon/ui-showcase-data` → `libs/falcon-ui-showcase-data/src/index.ts`; sub-path `@falcon/ui-showcase-data/docs/*` → `src/docs/*`. `[CODE]` `tsconfig.base.json:103-108`.
- React selectors: PascalCase components (`FalconButton`, `FalconButtonTw`, …) wrapping `falcon-*` tags. Vue selectors: same PascalCase names wrapping the same tags.

## Known consumers (grep-verified 2026-06-03)

- `@falcon/ui-react`: **0** in-repo importers (`apps/`+`libs/`+`tools/`).
- `@falcon/ui-vue`: **0** in-repo importers.
- `@falcon/ui-showcase-data`: **0** real importers — the 4 matches are nx workspace metadata (`.nx/workspace-data/*`, `graph.json`) + `tsconfig.base.json` path alias only.
- The lone playground `demos/angular-playground/` consumes a **duplicated, in-app** copy of the registry + docs (`src/studio/registry.ts`, `demos/component-docs/`), not the `@falcon/ui-showcase-data` barrel. (AUDIT F4 — drift/duplication.)

This is the defining property of the area: **three correctly-built, fully-in-sync output libraries with zero current in-repo consumers** — see DECISION for why that is intentional (external-facing) yet a maintenance signal.

## Related areas

- **`falcon-ui-core`** (L-core / Falcon-UI-Core.md) — the Stencil source these wrappers mirror; the React/Vue/Angular generation all originate from its `stencil.config.ts` + `build.cjs`.
- **`@falcon`'s `falcon-angular-*` wrappers** (`libs/falcon-ui-core/src/angular-wrapper/`) — the **Angular** equivalent of this batch; the in-repo apps use those, not these.
- **`falcon-ui-tokens`** — the shared CSS-token contract both React/Vue wrappers inherit (the wrappers carry no styling; they render the same Shadow/`-tw` custom elements which read the tokens).
- **`demos/angular-playground`** — the only live showcase consumer (standalone Vite, duplicates the catalog).

## Ownership

`libs/falcon-ui-react`, `libs/falcon-ui-vue`, `libs/falcon-ui-showcase-data` — owned by the Falcon UI / design-system team alongside `falcon-ui-core`. The two wrapper libs are **derivative artifacts of `falcon-ui-core`** — never edited directly; any component change flows from the Stencil source through the build. The showcase catalog is hand-curated and must be kept in step with both the Stencil component set and the playground apps.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L08 sweep). All config + barrel + generated-file headers read; 106↔106↔106 Stencil/React/Vue tag parity computed by set-diff (`comm`); generation engines confirmed (React = `@stencil/react-output-target@0.7.4` in-process; Vue = `generate-vue-proxies.cjs` post-build, NO `vueOutputTarget` in `stencil.config.ts`); 0 in-repo consumers for all three grep-verified; `demos/react-playground`+`vue-playground` confirmed absent.
