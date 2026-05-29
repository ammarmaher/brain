---
tags: [loading, skeleton, data-table, falcon-studio, theming, frontend]
type: pattern
status: build-green
date: 2026-05-20
build_hashes:
  admin-console: f6e0fbf79b6e3253
  management-console: d38565a6c3605560
  host-shell: c5eea28a19a5d5f0
note: |
  Original task contract specified location 35-Loading/, but 35-Architecture/
  and 36-Theming/ are already in use in the vault, so this note lives at
  37-Loading/ to keep the number-prefix sort stable. Adjust if the vault is
  later renumbered.
---

# Data-Table Skeleton Loading System

A centrally-configured, silent, in-table skeleton-loading state for every
Falcon data table. One `[loading]` flag drives the skeleton; one
`provideFalconDataTableSkeleton()` call drives the look, animation, row count,
and block sizing platform-wide.

## At a glance

- Default **5 skeleton rows** when `[loading]="true"` and `[skeletonRows]` is
  not explicitly bound.
- Default animation = **shimmer** (gradient sweep), `1400ms`,
  `ease-in-out`, `infinite`.
- Defaults pulled from a frozen config (`BUILT_IN_FALCON_DATA_TABLE_SKELETON_DEFAULTS`)
  registered against the `FALCON_DATA_TABLE_SKELETON_DEFAULTS` InjectionToken
  with `providedIn: 'root'` — works even when the aggregate provider is not
  installed.
- Override surface mirrors `provideFalconLoader()` — same shape, same place,
  same merge semantics.

## Public surface

`@falcon/studio` exports:

- `FALCON_DATA_TABLE_SKELETON_DEFAULTS` — InjectionToken<FalconDataTableSkeletonConfig>
- `BUILT_IN_FALCON_DATA_TABLE_SKELETON_DEFAULTS` — the frozen seed
- `FalconDataTableSkeletonConfig` — full shape (10 keys)
- `FalconDataTableSkeletonAnimation` — `'pulse' | 'shimmer' | 'none'`
- `FalconDataTableSkeletonConfigOverride` — `Partial<FalconDataTableSkeletonConfig>`
- `provideFalconDataTableSkeleton(options?)` — aggregate provider (preferred)
- `provideFalconDataTableSkeletonDefaults(override?)` — granular provider
- `mergeDataTableSkeletonConfig(base, override)` — shallow merge helper

## Config keys

| Key | Default | Notes |
|-----|---------|-------|
| `rows` | `5` | Count of skeleton rows rendered while loading |
| `animation` | `'shimmer'` | `'pulse' \| 'shimmer' \| 'none'` |
| `durationMs` | `1400` | Animation duration |
| `easing` | `'ease-in-out'` | CSS easing function |
| `iteration` | `'infinite'` | Or a number |
| `blockHeight` | `'0.75rem'` | Skeleton block height |
| `blockRadius` | `'var(--radius-xs, 0.25rem)'` | Skeleton block radius |
| `blockBg` | `'var(--color-falcon-neutral-100, #f1f3f5)'` | Block base bg |
| `blockBgHighlight` | `'var(--color-falcon-neutral-50, #f5f7f8)'` | Shimmer peak |
| `respectReducedMotion` | `true` | Enforced in CSS (`@media (prefers-reduced-motion: reduce)`) |

## Override precedence

1. Per-instance literal `style="..."` attribute on the `<falcon-angular-data-table>` tag → highest
2. Per-instance `[skeletonRows]` binding on the wrapper → wins over config
3. Aggregate provider `provideFalconDataTableSkeleton({ defaults })` at app root → wins over built-in
4. Built-in `BUILT_IN_FALCON_DATA_TABLE_SKELETON_DEFAULTS` → fallback

## Worked example — single app retune

```ts
// apps/<app>/src/app/app.config.ts
import { provideFalconDataTableSkeleton } from '@falcon/studio';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    ...provideFalconDataTableSkeleton({
      defaults: {
        rows: 4,
        animation: 'pulse',
        durationMs: 1600,
      },
    }),
  ],
};
```

All `<falcon-angular-data-table>` and `<falcon-angular-table>` in that app
now show **4 skeleton rows** with a **pulse animation** when loading.

## Worked example — per-instance override

```html
<falcon-angular-data-table
  [data]="rows()"
  [columns]="columns()"
  [loading]="loading()"
  [skeletonRows]="3"
  style="--falcon-data-table-skeleton-bg: #ddd">
</falcon-angular-data-table>
```

Tag-level overrides win against the library config — same Falcon contract as
every other Falcon component.

## Files

### New (3)

- `[CODE] libs/falcon-studio/src/lib/services/data-table-skeleton-defaults.token.ts` — InjectionToken + config interface + BUILT_IN defaults
- `[CODE] libs/falcon-studio/src/lib/services/data-table-skeleton-defaults.provider.ts` — granular `provideFalconDataTableSkeletonDefaults()` + merge helper
- `[CODE] libs/falcon-studio/src/lib/services/provide-falcon-data-table-skeleton.ts` — aggregate `provideFalconDataTableSkeleton()`

### Modified (14)

- `[CODE] libs/falcon-studio/src/index.ts` — re-export new public surface
- `[CODE] libs/falcon-ui-core/src/components/falcon-table/falcon-table.tsx:115` — default `6 → 5`
- `[CODE] libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx:161` — default `6 → 5`
- `[CODE] libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.css` — keyframes (`falcon-skeleton-pulse`, `falcon-skeleton-shimmer`) + `.falcon-table-skeleton-block` animation rule + reduced-motion override
- `[CODE] libs/falcon-ui-core/src/components/falcon-table/falcon-table.css` — same keyframes + animation rule for the Shadow-DOM variant
- `[CODE] libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts` — removed hard-coded `animate-pulse`, added `falcon-table-skeleton-block` class hook
- `[CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` — DI inject, computed host-style map for skeleton CSS vars, sentinel-tracked `skeletonRows` setter/getter
- `[CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.ts` — added `skeletonRows` input + DI host-style map
- `[CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.html` — pushes `[attr.skeleton-rows]` to both Stencil branches
- `[CODE] libs/falcon-ui-tokens/src/components/data-table.tokens.css:181-205` — added `--falcon-data-table-skeleton-bg-highlight` + 4 animation tokens
- `[CODE] apps/host-shell/src/app/app.config.ts` — added `provideFalconDataTableSkeleton()`
- `[CODE] apps/admin-console/src/app/app.config.ts` — added `provideFalconDataTableSkeleton()`
- `[CODE] apps/management-console/src/app/app.config.ts` — added `provideFalconDataTableSkeleton()`
- `[CODE] apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` — TODO comment (no existing `usersLoading()` signal)
- `[CODE] apps/admin-console/.../client-applications-step.component.html` — TODO comment (synchronous wizard table)
- `[CODE] apps/admin-console/.../client-comm-channels-step.component.html` — TODO comment (synchronous wizard table)

## Build evidence

```
nx build falcon-ui-tokens       OK   (token registry: 3596 tokens, 51 components)
nx build falcon-ui-core         OK   49.47s — 103 Stencil tags re-emitted
nx build falcon-studio          OK   tsc --noEmit pass
nx build admin-console          OK   20.7s   hash f6e0fbf79b6e3253
nx build management-console     OK   19.8s   hash d38565a6c3605560
nx build host-shell (prod)      OK   24.3s   hash c5eea28a19a5d5f0
```

## Deferred / flagged

- **`<falcon-tree-table>` skeleton** — the Stencil tree-table has NO
  `loading` / `skeletonRows` props at all. Halt-and-flag trigger from the
  task contract: "If `<falcon-tree-table>` skeleton implementation differs
  structurally from `<falcon-table>`, flag and ship the flat table first."
  Deferred. Will need a per-node skeleton story (e.g. skeleton-leaf rows
  under each expanded node) — out of scope for this 2026-05-20 wave.
- **Three consumer tables** marked with `TODO(skeleton)` — no existing
  loading source to wire without inventing one.
- **Runtime verification** — every build is green and the InjectionToken /
  Stencil props / Angular wrappers are all in place, but the actual
  shimmer/pulse animation has not yet been observed in a running browser.
  Next session should serve at least admin-console and verify against
  `<falcon-org-info-panel>` or `<users-table>`.

## Related

- [[Loader Studio]] — sibling system, same provider shape
- [[Theming]] — neutral-palette tokens drive the block colours
- [[Tailwind Falcon Alignment Scorecard]] — token philosophy
