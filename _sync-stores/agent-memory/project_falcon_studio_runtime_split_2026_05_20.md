# Falcon Studio runtime subpath split — 2026-05-20

## Symptom (browser)
`http://localhost:4200/#/login` (host-shell) died on bootstrap with:

```
main.ts:7 TypeError: Cannot read properties of undefined (reading 'FalconAngularCalendarComponent')
    at Module.FalconAngularCalendarComponent (index.ts:1:1)
    at 37703 (container-nav-examples.ts:476:22)
    at 62304 (styles.js:13044:90)
    at 64825 (styles.js:2400:95)
    at 67362 (styles.js:3169:92)
    at 28618 (styles.js:9786:87)
```

This surfaced AFTER the NG0201 animations fix (EPV-Z FINAL — `apps/host-shell/src/app/app.config.ts:9-19`). The earlier crash was masking this latent eager-load TDZ.

## Root cause — eager-load chain

| # | File | Line | What happens |
|---|------|------|--------------|
| 1 | `apps/host-shell/src/app/app.config.ts` | 51 | `import { provideFalconLoader, provideFalconDataTableSkeleton } from '@falcon/studio';` |
| 2 | `apps/host-shell/src/app/app.ts` | 12 | `import { FalconLoaderService } from '@falcon/studio';` |
| 3 | `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts` | 55 | `import { FalconLoaderService } from '@falcon/studio';` |
| 4 | `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts` | 73 | `import { FalconLoaderService } from '@falcon/studio';` |
| 5 | `libs/falcon-studio/src/index.ts` | 156-161 | Public barrel re-exports `FALCON_STUDIO_COMPONENT_REGISTRY` from `./lib/registry/component-examples.registry` |
| 6 | `libs/falcon-studio/src/lib/registry/component-examples.registry.ts` | — | `import { FALCON_STUDIO_CONTAINER_NAV_EXAMPLES } from './examples/container-nav-examples';` |
| 7 | `libs/falcon-studio/src/lib/registry/examples/container-nav-examples.ts` | 19 | `import { ..., FalconAngularCalendarComponent } from '@falcon/ui-core/angular';` |
| 8 | same file | 476 | `render: render(FalconAngularCalendarComponent, {...})` — called at TOP LEVEL inside `const CALENDAR_ENTRY = {...}` |
| 9 | runtime | — | Webpack's named-binding getter for `FalconAngularCalendarComponent` dereferences the imported module namespace and finds it undefined → TypeError. TDZ from the eager-load ordering. |

Host-shell's bootstrap eagerly dragged the FULL Studio component-examples registry (30+ entries with top-level `render(...)` calls) into the bundle just to wire up `FalconLoaderService` + two providers. The TDZ surface is too large.

Ruled out: stale cache (cleaned, repro identical), compile error (`nx serve` reports ready), true circular dep (calendar component only imports `@angular/core` + local Stencil helper), animations (already fixed in EPV-Z FINAL).

## Fix — runtime-only subpath

**New file:** `libs/falcon-studio/src/runtime.ts` — thin barrel that re-exports ONLY:

- `FALCON_LOADER_DEFAULTS` + `provideFalconLoaderDefaults` + `mergeLoaderConfig` + `FalconLoaderService` + `FalconLoaderDismiss` type + `provideFalconLoader` + `ProvideFalconLoaderOptions` type
- `FALCON_DATA_TABLE_SKELETON_DEFAULTS` + `BUILT_IN_FALCON_DATA_TABLE_SKELETON_DEFAULTS` + `FalconDataTableSkeletonConfig` + `FalconDataTableSkeletonAnimation` types + `provideFalconDataTableSkeletonDefaults` + `mergeDataTableSkeletonConfig` + `FalconDataTableSkeletonConfigOverride` type + `provideFalconDataTableSkeleton` + `ProvideFalconDataTableSkeletonOptions` type

Nothing that touches `FALCON_STUDIO_COMPONENT_REGISTRY`, gallery components, examples, abstractions, presets, or token registries.

**Path mapping:** `tsconfig.base.json:49-54` — added `"@falcon/studio/runtime": ["./libs/falcon-studio/src/runtime.ts"]` next to the existing `"@falcon/studio"` mapping.

**Imports flipped** (all 4 eagerly-bundled host-shell files):

1. `apps/host-shell/src/app/app.config.ts:51` — `from '@falcon/studio'` → `from '@falcon/studio/runtime'`
2. `apps/host-shell/src/app/app.ts:12` — same flip
3. `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts:55` — same flip
4. `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts:73` — same flip

Each flipped import carries a 1-line comment pointing to the runtime barrel for the next reader.

**Untouched (intentionally):** `apps/host-shell/src/app/features/falcon-ui-showcase/falcon-ui-showcase.routes.ts:17` — `loadComponent: () => import('@falcon/studio').then(m => m.FalconLoaderStudioComponent)` is correctly LAZY; the showcase route is the only consumer that legitimately needs the full Studio surface. Confirmed in the build manifest by the dedicated chunk `apps_host-shell_src_app_features_falcon-ui-showcase_falcon-ui-showcase_routes_ts.js`.

## Files changed (6 total — initial pass)
- NEW `libs/falcon-studio/src/runtime.ts`
- `tsconfig.base.json` (+3 lines for the path mapping)
- `apps/host-shell/src/app/app.config.ts` (import + 8-line provenance comment)
- `apps/host-shell/src/app/app.ts` (import + 2-line comment)
- `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts` (import + 1-line comment)
- `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts` (import + 1-line comment)

## 2026-05-20 FOLLOW-UP — initial pass was incomplete
Browser still crashed at `#/login` with the identical trace after the 4 host-shell-app file flips. Root cause: the eager-load chain also runs THROUGH `@falcon/ui-core/angular`, which `host-shell/app.ts` imports for `FalconAngular*HostComponent`. Two ui-core wrapper components held bare `@falcon/studio` value imports for `FALCON_DATA_TABLE_SKELETON_DEFAULTS`:

- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts:37-40`
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.ts:41-44`

Both flipped to `@falcon/studio/runtime`. Build evidence:
- `npx nx build falcon-ui-core` — 41.7 s green (warnings are pre-existing reserved-prop names).
- `npx nx build host-shell` — Hash `1ce0a5f656348156`, 8.5 s. Showcase chunk still lazy at 4.22 kB.
- Initial host-shell hash from first pass: `789f468a4d3a4f0d`, 13.5 s.

## Still-bare `@falcon/studio` value-imports (NOT a host-shell-login problem, but same TDZ risk on those bundles)
- `apps/admin-console/src/app/app.config.ts:27` — `provideFalconDataTableSkeleton`
- `apps/management-console/src/app/app.config.ts:26` — `provideFalconDataTableSkeleton`
- Lazy showcase route at `apps/host-shell/src/app/features/falcon-ui-showcase/falcon-ui-showcase.routes.ts:17` — INTENTIONAL, lazy-loaded.
- Type-only imports/exports (no runtime impact): `falcon-loader-overlay/{index.ts,*.component.ts}`, `falcon-loader-inline/{index.ts,*.component.ts}`.

## Why NOT modify `libs/falcon-studio/src/index.ts`
Keeping the main barrel as the full surface preserves backward compatibility for the lazy showcase route and any future Studio editor consumer that legitimately needs the registry. The split is additive: new opt-in subpath; existing API unchanged.

## Pattern (reusable)
Any future `@falcon/*` library that mixes runtime services with heavy gallery/example registries should ship a `runtime.ts` subpath alongside `index.ts`. App-root bootstrap imports the runtime barrel; lazy-loaded editor pages import the full barrel.
