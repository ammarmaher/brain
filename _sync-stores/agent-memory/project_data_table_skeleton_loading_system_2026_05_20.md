---
name: data-table-skeleton-loading-system-providefalcondatatableskeleton
description: "Centrally-configured silent in-table skeleton for every Falcon data table (default 5 rows, shimmer animation, library config provider, applied platform-wide)."
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-20
  status: build-green
  build_hashes: 
    admin-console: f6e0fbf79b6e3253
    management-console: d38565a6c3605560
    host-shell: c5eea28a19a5d5f0
  originSessionId: fb20e440-d3dd-4a15-9321-c29fbbad1fca
---

## Why

Pre-existing state: every Falcon table already had a `loading` Stencil prop and
a `skeletonRows` prop (default 6) wired up in `<falcon-table>` /
`<falcon-table-tw>`, plus the Angular wrapper already proxied them. The
skeleton block was rendered but used `animate-pulse` (Tailwind stock) — fixed
animation, no library knob, no central config, and default 6 rows.

Owner ask (Ammar, 2026-05-20):

1. Silent skeleton inside the table when `[loading]="true"`.
2. **Default 5** skeleton rows.
3. Library-level configuration (animation, rows, block style — everything).
4. Best-practice defaults.
5. Applied on every data table in the system.
6. Use brain-SK to implement → consult + emit an Obsidian note.

## How to apply

Library defaults already drive every `<falcon-angular-data-table>` and
`<falcon-angular-table>` after this wave landed — no consumer change needed.

### Tune platform-wide

```ts
// apps/<app>/src/app/app.config.ts
import { provideFalconDataTableSkeleton } from '@falcon/studio';

providers: [
  // ...
  ...provideFalconDataTableSkeleton({
    defaults: {
      rows: 4,             // override default 5
      animation: 'pulse',  // override default 'shimmer'
      durationMs: 1600,    // override default 1400ms
      // any subset of the 10-key config is OK
    },
  }),
]
```

### Tune per-instance

```html
<falcon-angular-data-table
  [data]="rows()"
  [columns]="columns()"
  [loading]="loading()"
  [skeletonRows]="3"
  style="--falcon-data-table-skeleton-bg: #ddd">
</falcon-angular-data-table>
```

Tag-level overrides win. Library config still controls the per-app default.

## Config surface

| Key | Default | Notes |
|-----|---------|-------|
| `rows` | `5` | Skeleton row count while `[loading]="true"` |
| `animation` | `'shimmer'` | `'pulse' \| 'shimmer' \| 'none'` |
| `durationMs` | `1400` | ms |
| `easing` | `'ease-in-out'` | CSS easing |
| `iteration` | `'infinite'` | or a number |
| `blockHeight` | `'0.75rem'` | CSS length |
| `blockRadius` | `'var(--radius-xs, 0.25rem)'` | CSS length |
| `blockBg` | `'var(--color-falcon-neutral-100, #f1f3f5)'` | base bg |
| `blockBgHighlight` | `'var(--color-falcon-neutral-50, #f5f7f8)'` | shimmer peak |
| `respectReducedMotion` | `true` | CSS-enforced `@media (prefers-reduced-motion: reduce)` |

## Files changed

### New (3)

1. `libs/falcon-studio/src/lib/services/data-table-skeleton-defaults.token.ts`
   InjectionToken `FALCON_DATA_TABLE_SKELETON_DEFAULTS` (providedIn:'root'
   factory falls back to `BUILT_IN_FALCON_DATA_TABLE_SKELETON_DEFAULTS`).
2. `libs/falcon-studio/src/lib/services/data-table-skeleton-defaults.provider.ts`
   Granular `provideFalconDataTableSkeletonDefaults()` + `mergeDataTableSkeletonConfig()`.
3. `libs/falcon-studio/src/lib/services/provide-falcon-data-table-skeleton.ts`
   Aggregate `provideFalconDataTableSkeleton()` mirroring `provideFalconLoader()`.

### Modified (16)

- `libs/falcon-studio/src/index.ts` — new public surface re-exports.
- `libs/falcon-ui-core/src/components/falcon-table/falcon-table.tsx:115` — Stencil Shadow-DOM default `6 → 5`.
- `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx:161` — Stencil Light-DOM default `6 → 5`.
- `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.css` — added keyframes + token-driven animation rule + reduced-motion override.
- `libs/falcon-ui-core/src/components/falcon-table/falcon-table.css` — same keyframes + animation for Shadow-DOM variant.
- `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts` — dropped `animate-pulse`; added `falcon-table-skeleton-block` class hook so the CSS-driven rule binds.
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts` — injected `FALCON_DATA_TABLE_SKELETON_DEFAULTS`, sentinel-tracked `skeletonRows` setter/getter, host-bound `[style.--falcon-data-table-skeleton-*]` CSS-var map (8 vars).
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.ts` — added `skeletonRows` input (sentinel-tracked) + same DI + host-style binding.
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.html` — pushes `[attr.skeleton-rows]` to both `<falcon-table-tw>` and `<falcon-table>` branches.
- `libs/falcon-ui-tokens/src/components/data-table.tokens.css` — added `--falcon-data-table-skeleton-bg-highlight` + 4 animation tokens (animation-name / duration / easing / iteration).
- `apps/host-shell/src/app/app.config.ts` — installed `provideFalconDataTableSkeleton()` (no override).
- `apps/admin-console/src/app/app.config.ts` — same.
- `apps/management-console/src/app/app.config.ts` — same.
- `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` — `TODO(skeleton)` comment next to the Users sub-table (no existing `usersLoading()` signal).
- `apps/admin-console/.../client-applications-step.component.html` — `TODO(skeleton)` comment (synchronous wizard table, no async source).
- `apps/admin-console/.../client-comm-channels-step.component.html` — same.

## Default values shipped

```ts
{
  rows: 5,
  animation: 'shimmer',
  durationMs: 1400,
  easing: 'ease-in-out',
  iteration: 'infinite',
  blockHeight: '0.75rem',
  blockRadius: 'var(--radius-xs, 0.25rem)',
  blockBg: 'var(--color-falcon-neutral-100, #f1f3f5)',
  blockBgHighlight: 'var(--color-falcon-neutral-50, #f5f7f8)',
  respectReducedMotion: true,
}
```

## Build evidence

```
nx build falcon-ui-tokens       OK   token registry 3596 tokens / 51 components
nx build falcon-ui-core         OK   49.47s — 103 Stencil tags re-emitted
nx build falcon-studio          OK   tsc --noEmit pass
nx build admin-console          OK   20.7s   hash f6e0fbf79b6e3253
nx build management-console     OK   19.8s   hash d38565a6c3605560
nx build host-shell (prod)      OK   24.3s   hash c5eea28a19a5d5f0
```

All six builds green. No warnings introduced by this work (the 4 pre-existing
Stencil "reserved Prop name" warnings on `title` / `scrollHeight` are unrelated
and pre-date this wave).

## Deferred / flagged

- `<falcon-tree-table>` skeleton — Stencil tree-table has NO loading or
  skeletonRows props at all. Halt-and-flag trigger from the task contract:
  "ship the flat table first." Deferred to a follow-up wave (likely needs a
  per-node skeleton story).
- Three consumer tables marked with `TODO(skeleton)`:
  - `org-hierarchy-page-menu.component.html` (Users sub-table) — needs a
    `state.usersLoading()` signal added to `OrgHierarchyPageStateService`.
  - `client-applications-step.component.html` (Add-Client Step 4) —
    synchronous local rows, no async source.
  - `client-comm-channels-step.component.html` (Add-Client Step 3) — same.
- **Runtime verification not yet performed** — code is build-green and the
  contract surface is complete, but the actual shimmer/pulse animation has
  not been visually observed in a running app. Next session should serve
  admin-console + flip `state.loading()` on a tab table to confirm.

## Context for next agent

If you're rerouted here for a follow-up:

1. To wire a missing consumer: search for the relevant component's `.ts` for
   a `loading`/`busy`/`submitting`/`isLoadingX$` signal that gates the HTTP
   call feeding the table. If one exists, bind it to `[loading]`. If not, do
   NOT invent one — leave the `TODO(skeleton)` in place.
2. To add tree-table support: the Stencil `<falcon-tree-table>` lives at
   `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.tsx`.
   It currently has no `loading`/`skeletonRows` props — these need to be
   added (mirror `<falcon-table>`/`<falcon-table-tw>` PR-2 pattern). The
   Angular wrapper at
   `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree-table/falcon-tree-table.component.ts`
   then needs the same DI / host-style binding from the flat wrapper.
3. To bump the library defaults: edit
   `BUILT_IN_FALCON_DATA_TABLE_SKELETON_DEFAULTS` in
   `libs/falcon-studio/src/lib/services/data-table-skeleton-defaults.token.ts`.
   No consumer changes needed — every app picks up the new defaults on
   rebuild.
4. To customise a single app, add `defaults` to that app's
   `provideFalconDataTableSkeleton()` call (no `defaults` provider override
   was installed in any app at landing time — all three apps run on the
   library defaults).

## Constraints honoured

- Tailwind only — no SCSS.
- No PrimeNG / PrimeIcons.
- Token-driven — every animation/colour knob lives in
  `libs/falcon-ui-tokens/src/components/data-table.tokens.css`.
- No DTO drift — pure FE.
- No interactive prompts.
- PowerShell-safe — no `&&`, no `2>&1` on native exes.
- No commits made — owner instruction: "no commits unless run is fully
  green at the end, then surface 'ready to commit'." Run is green; ready
  to commit on user signal.
- Backward-compatible — only additions to the public surface; no input
  renames, no removed APIs.
- Consumer overrides preserved — sentinel-tracked setter on `skeletonRows`
  and host-bound CSS vars layered first so any `style="..."` attribute on
  the tag still wins.
