# Agent 2 — Component Coverage

## In-scope components (Agent 2)

| Component | Status | Source files read | Gaps found | Notes |
|---|---|---|---|---|
| `falcon-table` | covered | 4 (Shadow tsx, Light tsx, types, tokens) + helpers | 11 (FT-01 to FT-11) | PrimeIcon P0 violation; basic Angular wrapper deprecated |
| `falcon-data-table` | covered | 4 (component ts, html, types, directive ts) | 9 (FDT-01 to FDT-09) | Production-canonical; Strategy E projection orchestrator |
| `falcon-tree-table` | covered | 3 (tsx, types, wrapper ts) | 8 (FTT-01 to FTT-08) | Angular wrapper lacks template projection |
| `falcon-paginator` | covered | 3 (tsx partial, types, wrapper ts) | 4 (FP-01 to FP-04) | Wrapper API lags Stencil PR-3 |
| `falcon-filter-panel` | covered | 3 (tsx partial, types, wrapper ts) | 5 (FFP-01 to FFP-05) | Native HTML atoms; needs Falcon-atom migration |
| `falcon-status-badge` | covered | 3 (tsx, types, wrapper ts) + tokens | 5 (FSB-01 to FSB-05) | Verified zero production adoption |
| `falcon-badge` | covered | 3 (tsx, types, wrapper ts) + tokens | 3 (FB-01 to FB-03) | Wrapper does project `<ng-content>` (verified) |
| `falcon-tag` | covered | 3 (tsx, types, wrapper ts) + tokens | 6 (FT-01 to FT-06) | Wrapper has dead-code `classes` computed |
| `falcon-empty-state` | covered | 3 (tsx, wrapper ts, wrapper html) | 5 (FES-01 to FES-05) | Wrapper projects `slot=action` content correctly |
| `falcon-organization-hierarchy-tree-tw` | covered | 3 (tsx partial, types, tokens partial) | 6 (FOHT-01 to FOHT-06) | Light DOM only — no Shadow, no Angular wrapper |

## Cross-link (NOT my scope — mention only)

| Component | Owned by | Notes |
|---|---|---|
| `falcon-tree` | Agent 4 | Generic recursive tree (no per-row data columns) |
| `falcon-tree-panel` (legacy) | Agent 4 | Pre-Stencil bespoke Angular tree shell |

## Per-component file inventory

Each in-scope component folder contains the mandatory 6 files:

```
agent-02-data/components/<component-name>/
  OVERVIEW.md
  API.md
  USAGE.md
  GAPS_AND_UPGRADES.md
  TOKENS.md
  DECISION.md
```

## Source files counted per component (active codebase reads)

| Component | Stencil tsx | Stencil types | Wrapper ts | Wrapper html | Tokens | Tailwind helpers | Total |
|---|---|---|---|---|---|---|---|
| falcon-table | 2 (Shadow + Light) | 1 | 1 (basic wrapper) | 1 | 1 | 1 | 7 |
| falcon-data-table | 0 (composes falcon-table-tw) | 1 | 1 | 1 | 1 | 0 | 4 + directive file |
| falcon-tree-table | 2 (Shadow + Light listed) | 1 | 1 | 0 | 1 | 0 | 5 |
| falcon-paginator | 1 (partial) | 1 | 1 | 0 | 1 | 0 | 4 |
| falcon-filter-panel | 1 (partial) | 1 | 1 | 0 | 1 | 0 | 4 |
| falcon-status-badge | 1 | 1 | 1 | 1 | 1 | 0 | 5 |
| falcon-badge | 1 | 1 | 1 | 1 | 1 | 0 | 5 |
| falcon-tag | 1 | 1 | 1 | 1 | 1 | 0 | 5 |
| falcon-empty-state | 1 | 1 | 1 | 1 | 1 | 0 | 5 |
| falcon-organization-hierarchy-tree-tw | 1 (partial) | 1 | 0 (none) | 0 (none) | 1 (partial) | 0 | 3 |

## Coverage gaps

- Wrapper templates (`.html`) for `falcon-tree-table`, `falcon-paginator`, `falcon-filter-panel` — not explicitly read this session but template binding patterns inferred from wrapper TS + Stencil source.
- Tailwind helpers (`*-tailwind-classes.ts`) for any component — not read in detail; behaviours inferred from imports inside the `*-tw.tsx` files.
- Stencil Light variants for `falcon-tree-table-tw`, `falcon-paginator-tw`, `falcon-filter-panel-tw`, `falcon-status-badge-tw`, `falcon-badge-tw`, `falcon-tag-tw`, `falcon-empty-state-tw` — file existence verified; not read in detail. They mirror Shadow contracts.

These gaps don't affect the brain knowledge mission since the Shadow + types + wrapper triplet captures the API contract. The Light variant exists primarily to swap rendering substrate (Light DOM with Tailwind helper output instead of Shadow DOM with scoped CSS).
