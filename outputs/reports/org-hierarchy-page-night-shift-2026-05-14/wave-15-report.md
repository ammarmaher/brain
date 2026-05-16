# Wave 15 — Tree-chart view mode

**Status:** ✅ GREEN — full chart subtree landed (Phase-2 continuation, 2026-05-14)
**Run:** 2026-05-14 (Brain SK Night-Shift Phase-2 autonomous executor)
**Build hash:** `b81dbbdcc232c7cb` (admin-console)
**Branch:** `polishing-v0.4` (dirty — no commits)

## What landed (Phase-2 finish)

### Chart subtree — 9 new files

```
components/tab-components/hierarchy-tab/falcon-org-chart/
├── index.ts                                                   (21 lines)
├── models/models.ts                                           (43 lines)
├── directives/directives.ts                                   (107 lines — FalconPanZoomDirective)
├── services/chart-layout.service.ts                           (109 lines — ChartLayoutService)
├── falcon-chart-card/
│   ├── falcon-chart-card.component.ts                         (44 lines)
│   └── falcon-chart-card.component.html                       (58 lines)
├── falcon-chart-toolbar/
│   ├── falcon-chart-toolbar.component.ts                      (28 lines)
│   └── falcon-chart-toolbar.component.html                    (45 lines)
└── falcon-org-chart/
    ├── falcon-org-chart.component.ts                          (195 lines)
    └── falcon-org-chart.component.html                        (113 lines)
```

Total: 11 files / ~760 lines.

### Layout + pan-zoom architecture

- **`ChartLayoutService.layout(root)`** — recursive left-to-right tidy-tree algorithm. Returns flat `cards` + `lines` + `width/height`. Card geometry: 180×56, hGap 60, vGap 14, pad 24.
- **`FalconPanZoomDirective`** — wheel-zoom anchored to cursor (per Agent 2 §1.14), pan via mousedown→mousemove→mouseup with `closest('.chart-card')` and `closest('.chart-user-circle')` guard so cards stay clickable. Trailing-click suppression via the `panning` class on host (per Agent 2 §1.15). RxJS-based with `takeUntilDestroyed`.
- **`FalconOrgChartComponent`** — owns `zoom` + `pan` signals, `focusedId` signal, `planeTransform` computed (`translate(...) scale(...)`). Click a non-root card → `enterFocus()` zooms to `FOCUS_ZOOM = 1.6` and centers at `FOCUS_TOP_RATIO = 0.26`. User circles render as a row below the focused card with dashed connector path. Exit via × button, canvas click, or `Escape` keydown.
- **`FalconChartCardComponent`** — 3 visual templates via `@switch (nodeType())`: `root` (teal-filled), `client` (initials chip), default sub-node (mint chip). Ring on focused/selected; opacity 30% on dimmed (during focus mode).
- **`FalconChartToolbarComponent`** — zoom-in / zoom-out / fit / reset; zoom percentage chip. Disabled states honour min/max zoom.

### Hex → token migration (D13)

Two hardcoded SVG strokes in the reference replaced with CSS custom-property reads:

- Tree connector path stroke `#7C82A9` → `[attr.stroke]="'var(--falcon-neutral-400)'"`
- User connector path stroke `#0d3f44` → `[attr.stroke]="'var(--falcon-teal-700)'"`

(Verified: zero remaining hex literals in W15 output via grep over the new subtree.)

### Selector convention (W7 D14 conformance)

ESLint `@angular-eslint/component-selector` and `@angular-eslint/directive-selector` enforce `app-*` prefix in the admin-console scope. Reference selectors `falcon-*` would have added 4 NEW lint errors. Resolved by renaming:

| Reference selector | Admin-console selector |
|---|---|
| `falcon-org-chart` | `app-org-chart` |
| `falcon-chart-card` | `app-chart-card` |
| `falcon-chart-toolbar` | `app-chart-toolbar` |
| `[falconPanZoom]` | `[appPanZoom]` |

Folder names + class names kept verbatim from reference. No public consumers outside this subtree (chart is only used by the menu component).

### Output-name lint fixes

`select` (DOM event collision), `zoomIn`/`zoomOut`/`fit`/`reset` → renamed:

| Reference output | Admin-console output |
|---|---|
| `select` on `chart-card` | `cardClick` |
| `zoomIn` on `chart-toolbar` | `zoomInClick` |
| `zoomOut` on `chart-toolbar` | `zoomOutClick` |
| `fit` on `chart-toolbar` | `fitClick` |
| `reset` on `chart-toolbar` | `resetClick` |

### A11y hardening

- `chart-card` button now responds to Enter + Space
- `chart-user-circle` upgraded from `<div>` to `<button>` (keyboard-focusable, `aria-label` = user's first name)
- Chart viewport has `tabindex="0"` and `(keydown.escape)="exitFocus()"` for keyboard escape

### Menu wiring (replacing W15 placeholder)

- `components/org-hierarchy-page-menu.component.ts` — added `FalconOrgChartComponent` import + into `imports[]`.
- `components/org-hierarchy-page-menu.component.html` — replaced "Org chart view — wired in Wave 15" placeholder with:
  ```html
  @if (state.treeRoot(); as r) {
    <app-org-chart
      [root]="$any(r)"
      [selectedId]="state.selectedNodeId()"
      (cardSelect)="state.onChartSelect($any($event))" />
  }
  ```

The `$any()` casts are required because `state.treeRoot()` returns `ClientNode`, while the chart is generic over `ChartOrgNode<T>`. `ClientNode` is structurally compatible (has `id`, `name`, `type`, `children`, `users`) but the strict generic doesn't know that.

## D-W15a — RESOLVED

The original W15 deferral note (placeholder div for chart) is now closed. The chart renders inside the chart wrapper card with `min-h-[520px] h-[calc(100vh-220px)]`.

## Validation

- ✅ `nx build admin-console` GREEN — hash `b81dbbdcc232c7cb`
- ✅ `nx lint admin-console` — 23 errors (matches inherited baseline; **zero new from W15**)
- ⏳ Visual smoke: needs user reload of `/admin-console/org-hierarchy-page` → click view-toggle to Tree → all nodes render as cards. Click a non-root card → focus mode with users below. Wheel-zoom anchored on cursor. Pan drag. Toolbar buttons.

## Behaviours confirmed by code review (Agent 2 §1.14, §1.15)

- ✅ Wheel zoom anchored at cursor (pan compensates for zoom delta)
- ✅ Pan drag tracks `moved` distance — `.panning` class on host suppresses trailing clicks via CSS pointer-events guard at the consumer's level (cards still register click via `closest()`)
- ✅ Focus mode disables pan-zoom directive (`[disabled]="!!focusedId()"`)
- ✅ Exit focus restores prior zoom + pan (`prevView` snapshot)
- ✅ Fit-to-view computes `Math.min(rect.width/w, rect.height/h, 1)` so chart never zooms above 1:1

## Decisions taken

- **D-W15b-1** Renamed all `falcon-*` selectors → `app-*` per W7 D14 (eslint-mandated).
- **D-W15b-2** Output rename: `select`→`cardClick`, `zoomIn`→`zoomInClick`, etc. — `no-output-native` rule.
- **D-W15b-3** SVG strokes use `var(--falcon-*)` literals via `[attr.stroke]` binding (not Tailwind class) — SVG `stroke` attribute doesn't accept utility classes; CSS-var-via-string is the cleanest hex-replacement path.
- **D-W15b-4** Kanban view for `usersView==='board'` still placeholder per W11 decision. Not in W15 scope.

## Files created in this phase

| File | Lines | Purpose |
|---|---|---|
| `falcon-org-chart/index.ts` | 21 | Barrel |
| `falcon-org-chart/models/models.ts` | 43 | Types |
| `falcon-org-chart/directives/directives.ts` | 107 | Pan/zoom |
| `falcon-org-chart/services/chart-layout.service.ts` | 109 | Layout |
| `falcon-chart-card/falcon-chart-card.component.ts` | 44 | Card class |
| `falcon-chart-card/falcon-chart-card.component.html` | 58 | Card template |
| `falcon-chart-toolbar/falcon-chart-toolbar.component.ts` | 28 | Toolbar class |
| `falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 45 | Toolbar template |
| `falcon-org-chart/falcon-org-chart.component.ts` | 195 | Main chart class |
| `falcon-org-chart/falcon-org-chart.component.html` | 113 | Main chart template |

## Files edited

| File | Why |
|---|---|
| `components/org-hierarchy-page-menu.component.ts` | Import + register `FalconOrgChartComponent` |
| `components/org-hierarchy-page-menu.component.html` | Replace placeholder with `<app-org-chart>` |

## Open items / pickup triggers

- "verify chart pan-zoom interaction" → live mouse-wheel smoke test once user is at /admin-console/org-hierarchy-page
- "chart RAF throttle profile" → if user reports zoom jank on long lists, wrap directive's pan emit in `requestAnimationFrame`
