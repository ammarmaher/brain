# Task — Data-table skeleton-loading system + provideFalconDataTableSkeleton

- **Started:** 2026-05-20 16:00 UTC
- **Completed:** 2026-05-20 19:05 UTC
- **Owner:** claude (ammar-web-platform-ui)
- **Status:** completed (build-green; runtime visual pending)

## Goal

Centrally-configured silent in-table skeleton-loading for every Falcon data
table. Default **5 rows**. Library-level `provideFalconDataTableSkeleton()`
covering animation, row count, block shape, style. Applied platform-wide.

## What shipped

- New `@falcon/studio` public surface: `FALCON_DATA_TABLE_SKELETON_DEFAULTS`,
  `provideFalconDataTableSkeleton()`, `provideFalconDataTableSkeletonDefaults()`,
  `mergeDataTableSkeletonConfig()`, `FalconDataTableSkeletonConfig`,
  `FalconDataTableSkeletonAnimation`, `FalconDataTableSkeletonConfigOverride`,
  `ProvideFalconDataTableSkeletonOptions`, `BUILT_IN_FALCON_DATA_TABLE_SKELETON_DEFAULTS`.
- 10-key config: rows / animation / durationMs / easing / iteration /
  blockHeight / blockRadius / blockBg / blockBgHighlight /
  respectReducedMotion.
- Stencil defaults `skeletonRows: 6 → 5` in both `<falcon-table>` and
  `<falcon-table-tw>`.
- Angular wrappers (`<falcon-angular-data-table>`, `<falcon-angular-table>`)
  inject the token, host-bind 8 skeleton CSS vars, and use a sentinel
  setter so per-instance `[skeletonRows]` always wins.
- Token sheet `data-table.tokens.css` gained 4 animation tokens +
  `--falcon-data-table-skeleton-bg-highlight`.
- Two CSS files (`falcon-table.css` + `falcon-table-tw.css`) gained
  `falcon-skeleton-pulse` + `falcon-skeleton-shimmer` keyframes + a
  token-driven `.falcon-table-skeleton-block` rule + a
  `prefers-reduced-motion: reduce` override.
- `animate-pulse` dropped from the TW class string so the var-driven
  `animation` shorthand has authority.
- `provideFalconDataTableSkeleton()` installed in all 3 `app.config.ts` —
  library defaults drive every consumer.
- 3 consumer tables marked with `TODO(skeleton)` (no existing loading
  source; no signal invention per task contract).

## Build evidence

```
nx build falcon-ui-tokens       OK
nx build falcon-ui-core         OK   49.47s
nx build falcon-studio          OK
nx build admin-console          OK   20.7s   hash f6e0fbf79b6e3253
nx build management-console     OK   19.8s   hash d38565a6c3605560
nx build host-shell (prod)      OK   24.3s   hash c5eea28a19a5d5f0
```

## Outputs

- Memory: `C:/Users/User/.claude/projects/C--Falcon/memory/project_data_table_skeleton_loading_system_2026_05_20.md`
- MEMORY.md index entry: prepended at top of "Platform Knowledge — Frontend Work"
- Brain SK note: `C:/Falcon/Brain SK/_obsidian/37-Loading/Data-Table-Skeleton.md`

## Deferred / flagged

- `<falcon-tree-table>` skeleton — no Stencil props yet; halt-and-flag honoured.
- 3 consumer tables left with TODO comments — see memory file for rationale.
- Runtime visual verification — pending. Recommend serving admin-console and
  flipping `state.loading()` on a tab table.

## Commits

None — owner instruction was "ready to commit" surfacing, not auto-commit.
