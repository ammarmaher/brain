---
name: Falcon cross-framework demos — INSIDE workspace
description: SUPERSEDED 2026-05-15 — the described demo apps were never committed / no longer on disk. Only demos/angular-playground/ exists today. libs/falcon-ui-showcase-data/ remains on disk but is orphaned.
type: project
originSessionId: bd24e7cf-bfce-4231-b1a2-9bc918219140
status: superseded
supersededDate: 2026-05-15
supersededBy: project_falcon_cross_framework_demos_angular_only_pivot
---
# Falcon Cross-Framework Demos — Inside Workspace (2026-05-11)

> **🟠 SUPERSEDED 2026-05-15 (Wave 22D).** Verified against disk: `apps/demo/{angular,react,vue}/` do NOT exist. The 4500/4501/4502 demo apps described below were never actually committed (or were later removed). The ONE demo app that exists is `demos/angular-playground/` (port 5175, Vite + Analog). `libs/falcon-ui-showcase-data/` is still on disk but has no consumer — orphaned scaffolding from this plan.
>
> See **Wave 22D pivot** at the bottom of this file for the new reality.

**STATUS:** 🟢 GREEN — all three demo apps build cleanly. Three new Nx apps + one new lib added to `falcon-web-platform-ui` workspace.

## What changed (2026-05-11)

Reversed the 2026-05-09 directive that put demos outside the workspace at `C:\Falcon\demos\`. Per user instruction, demos are now **first-class Nx apps at the same level as host-shell / admin-console / management-console**.

## New structure

```
C:\Falcon\falcon-web-platform-ui\
├── apps\
│   ├── host-shell\               (production, port 4200)
│   ├── admin-console\            (production, port 4204)
│   ├── management-console\       (production, port 4301)
│   └── demo\                     ← NEW group
│       ├── angular\              (demo-angular, port 4500, Angular 21)
│       ├── react\                (demo-react,   port 4501, Vite + React 19)
│       └── vue\                  (demo-vue,     port 4502, Vite + Vue 3)
└── libs\
    └── falcon-ui-showcase-data\  ← NEW shared lib (registry.json + 28 MD docs)
```

## Shared lib — `@falcon/ui-showcase-data`

Single source of truth for the catalog. 28 components across 7 categories (actions / forms / layout / disclosure / feedback / data / stats). Add a component once in `registry.json` + drop an MD file in `src/docs/` — it appears in all three demos automatically.

Exports: `registry`, `components`, `componentsByCategory`, `categories`, `getComponent(slug)`, `getCategoryLabel(id)`, `type ComponentEntry`, `type ComponentCategory`, `type ShowcaseRegistry`.

tsconfig path aliases added: `@falcon/ui-showcase-data` + `@falcon/ui-showcase-data/docs/*`.

## How each demo loads Falcon UI Core

All three call `defineCustomElements()` from `@falcon/ui-core/loader` at bootstrap. Stencil's lazy loader fetches per-component chunks from `libs/falcon-ui-core/dist/components/*` at runtime (186 chunks already on disk from a prior successful build).

- **Angular** (`apps/demo/angular`) — Angular wrappers consumable via `@falcon/ui-core/angular`. Loader called in `src/main.ts` before `bootstrapApplication`. Uses raw custom elements with `CUSTOM_ELEMENTS_SCHEMA` for preview components.
- **React** (`apps/demo/react`) — raw Stencil custom elements in JSX. JSX types augmented via `src/falcon-elements.d.ts`. Loader call in `src/main.tsx` before `createRoot().render(...)`. Has a `falcon-loader-shim.ts` Vite-aliased over `@falcon/ui-core/loader` as a safety net — no-ops if the lib isn't built.
- **Vue** (`apps/demo/vue`) — raw Stencil custom elements in templates. `app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('falcon-')` set in `src/main.ts`. Loader called before `createApp(...).mount(...)`.

## Routes (identical across all 3)

| Route | Page |
|---|---|
| `/` | Landing — hero "Falcon UI for {framework}" + CTA |
| `/getting-started` | Install snippet + minimal usage |
| `/components` | Sidebar + welcome panel |
| `/components/:slug` | Live preview + MD doc + props doc + breadcrumbs |
| `/tokens` | Canonical Falcon token swatches |

## Shared UX shell (per framework, identical structure)

- Top sticky header: T2 brand logo, framework switcher `[Angular | React | Vue]` (current = pill highlight; others link to `localhost:4500/4501/4502`), theme toggle, GitHub icon.
- Left sidebar (on `/components/**`): grouped by category from `componentsByCategory`.
- Right: router outlet with subtle page fade-in (~150–200ms ease-out).
- Footer.

## Build state (2026-05-11)

| App | Dev build | Prod build | Initial bundle (prod) |
|---|---|---|---|
| demo-angular | ✅ PASS | ✅ PASS | 968.59 KB raw / 153.36 KB gzipped |
| demo-react | ✅ PASS | ✅ PASS | 304 KB JS + 42 KB CSS |
| demo-vue | ✅ PASS | ✅ PASS | 181 modules, ~1.0s build |

All three under the production budget (2 MB warning / 3 MB error).

## Known pre-existing blocker (unrelated to demos)

`nx build falcon-ui-core` fails on this Windows machine with EMFILE during PostCSS scan despite the build script's graceful-fs mitigation. **However**, the previously-built `dist/components/*` (186 chunks) and `loader/index.js` ARE on disk — so all three demos load Falcon components at runtime via the existing artifacts. Future rebuilds of `falcon-ui-core` will need this EMFILE issue addressed (out of scope for the demos work).

## Nx tags

- `apps/demo/{angular,react,vue}/project.json` → tags `["scope:demo", "type:app"]`
- `libs/falcon-ui-showcase-data/project.json` → tags `["scope:demo", "type:data", "lang:ts"]`

Tag-based isolation keeps the demos out of production bundle audits — replaces the prior "folder-outside-workspace" mechanism. Standing user directive "SKIP DEMOS in enhancement / bundle calculation" still applies, now enforced via Nx tags.

## Legacy location

`C:\Falcon\demos\` has been archived to `C:\Falcon\demos.legacy\`. The 28 MD component docs were copied (not moved) into `libs/falcon-ui-showcase-data/src/docs/` before archiving. Reference patterns from the legacy apps informed the new in-workspace scaffolds; the legacy folder is untouched after the move and can be deleted later if desired.

## Compliance summary

- ✅ Tailwind v4 utilities ONLY on templates — zero SCSS, zero component CSS, zero `styleUrls`, zero `::ng-deep`, zero inline styles
- ✅ Zero arbitrary Tailwind values (`w-[123px]` patterns) — regex-verified across all 3 apps
- ✅ Zero Tailwind default palette leakage (`bg-blue-500` etc.) — Falcon tokens only
- ✅ Zero PrimeNG / PrimeFlex / PrimeIcons
- ✅ No production-app imports from demo apps; no demo-app imports from production apps
- ✅ No commits, no pushes — working tree dirty, awaiting user "commit"/"push" instruction per standing rule

## How to run

```
npx nx serve demo-angular   # http://localhost:4500
npx nx serve demo-react     # http://localhost:4501
npx nx serve demo-vue       # http://localhost:4502
```

## What replaces what in memory

- **Supersedes** `project_falcon_demos_outside_workspace` (2026-05-10) — that decision is REVERSED.
- **Supersedes** `project_falcon_ui_react_vue_playgrounds` (2026-05-09) — those Vite playgrounds are now legacy (`demos.legacy/`).
- **Supersedes** `project_falcon_ui_cross_framework_demos` (2026-05-10) — verification of legacy 5173/5174/5175 demos no longer relevant; replaced by 4500/4501/4502 in-workspace demos.

---

## 🟠 Wave 22D pivot (2026-05-15) — what actually exists

Verified against disk during Wave 22D (close-out of FU-01 — shadow rows showcase). The state described above is **inaccurate**:

| Claim above | Reality on disk (2026-05-15) |
|---|---|
| `apps/demo/angular/` (port 4500) | **Does not exist.** No `apps/demo/` directory at all. |
| `apps/demo/react/`   (port 4501) | **Does not exist.** |
| `apps/demo/vue/`     (port 4502) | **Does not exist.** |
| `libs/falcon-ui-showcase-data/`  | **Exists** but has no consumer — orphaned scaffolding. |
| `demos/angular-playground/` (port 5175, Vite + Analog) | **Exists** — the ONE real demo app. Has its own structure (gallery + skeletons + ~28 Stencil-tag previews). Now extended with a shadow-rows demo via Wave 22D. |

### Why the pivot

Wave 22D added the FU-01 shadow-rows showcase. Two options were considered:

1. Resurrect `apps/demo/{angular,react,vue}/` per this memory.
2. Add the demo to the one app that actually exists: `demos/angular-playground/`.

Option 2 won because:
- Shadow rows are **fundamentally Angular-only** — the projection orchestrator uses Angular's `ViewContainerRef.createEmbeddedView` (Strategy E2). React/Vue equivalents would need their own orchestrators in `libs/falcon-ui-react/` and `libs/falcon-ui-vue/` — multi-day work, out of scope for FU-01.
- Bootstrapping 3 missing Nx apps + 2 framework-specific orchestrators is a multi-day project; FU-01 was scoped as a single demo.

### What was actually built in Wave 22D

- `demos/angular-playground/src/studio/shadow-rows/shadow-rows-demo.component.ts` — 4 scenarios (single view-only, single view↔edit, multi-shadow per parent, sticky-actions + shadow).
- `demos/angular-playground/src/app.component.ts` — pill toggle between Gallery and Shadow Rows demo.
- `demos/angular-playground/vite.config.ts` — added `@falcon/ui-core/angular` alias.
- `demos/angular-playground/tsconfig.json` — added matching TS path-mapping.
- `vite build` GREEN. (Pre-existing `tsc -b` errors in `main.ts` + `component-docs-panel.component.ts` are unrelated to this work.)

### Future plan if cross-framework demos are revived

Significant effort, summarised:

1. **Scaffold three Nx apps** at `apps/demo/{angular,react,vue}/` with Vite (or Webpack for Angular) + appropriate framework bindings. Wire ports 4500/4501/4502.
2. **Build React + Vue projection orchestrators** in `libs/falcon-ui-react/` and `libs/falcon-ui-vue/` — each consumes the same `<falcon-table-tw>` Stencil events + DOM contract but exposes idiomatic React/Vue template-projection APIs (e.g. `renderShadow` prop in React; `<template #shadow>` slot in Vue).
3. **Resurrect `libs/falcon-ui-showcase-data/`** as the shared registry. 28 MD docs are already in `libs/falcon-ui-showcase-data/src/docs/`.
4. **Port the angular-playground gallery pattern** to the three new apps so each gets `/`, `/components`, `/components/:slug`, `/tokens` etc.
5. **Re-add the Wave 22D shadow-rows demo** in all three apps once the React + Vue orchestrators ship.

Estimated effort: multi-day, multi-wave. Out of scope for any single feature; tracked as a strategic plan rather than a follow-up.

### Standing rule unchanged

"SKIP DEMOS in enhancement / bundle calculation" still applies. Currently enforced by `demos/angular-playground/` living outside the `apps/` tree (Nx tags `scope:demo` are not in play because the playground is a standalone Vite app, not an Nx project).
