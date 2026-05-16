---
ruleId: R-NOOR-001
ruleName: Layout ownership — shell owns chrome, page owns content
severity: must
violationCount: 36
estimatedEffort: medium
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Inside `apps/admin-console/**`, fullscreen wrappers + viewport-height containers (`fixed top-0`, `h-screen`, `w-screen`) may only appear in `apps/admin-console/src/app/layout/**`, and leaf components must not declare outer margins (`m-*` / `ms-*` / `me-*` / `mx-*` / `my-*`) on their host element — page-level grids own inter-section spacing.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console`:

| Detector pattern | Hits |
|---|---|
| `h-screen` / `min-h-screen` / `w-screen` outside layout/ | 0 (clean) |
| `fixed top-0` / `absolute inset-0` outside layout/ | 0 in admin-console |
| `m-*` / `ms-*` / `me-*` / `mx-*` / `my-*` on app-level elements | 36 across 15 files |

The chrome-leak axis is clean — admin-console is small enough that shell ownership has been respected.

The margin-leak axis has 36 hits across 15 files, all in `org-hierarchy-page` components. These are NOT all violations — `m-*` on a layout-level page section is allowed; only `m-*` on a **leaf component's root element** is the violation.

Top 5 offender files (by margin-leak hit count):

1. `apps/admin-console/.../client-settings-step/client-settings-step.component.html` — 9 margin hits (also #1 in many other R-FE plans; this file is the densest issue site)
2. `apps/admin-console/.../org-hierarchy-page-menu.component.html` — 5 margin hits
3. `apps/admin-console/.../falcon-org-info-panel.component.html` — 4 margin hits
4. `apps/admin-console/.../falcon-chart-card.component.html` — 2 margin hits
5. `apps/admin-console/.../falcon-org-node-drawer.component.html` — 2 margin hits

(11 more files have 1–3 hits each.)

Per-app: this rule is admin-console-only by scope.

## 3. Why this matters (the architectural cost of leaving it)

The Noor design system needs page-level grid control — designers slide sections up/down by editing the parent grid, not by re-tuning component internals. A leaf component that ships `mt-6` "because it usually sits below a heading" is the single most common parity-break in Admin Console (Contracts / Pricing / Tariff / OCS).

The 9 margin hits in `client-settings-step.component.html` are particularly damaging because that component is consumed both inside the Add Client wizard AND inside the Settings tab (per `docs/_plans/W34-A-settings-tab-plan.md`). A margin baked into the leaf collapses control over both contexts simultaneously.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Build the inventory.** Run:
  ```
  rg -n -g '*.html' '\bclass="[^"]*\b(m-\d+|mx-\d+|my-\d+|mt-\d+|mb-\d+|ml-\d+|mr-\d+|ms-\d+|me-\d+)\b' apps/admin-console > audit/r-noor-001-margins.txt
  ```

- **Step 2 — Per-file verdict.** For each hit, check whether the margin is on:
  - **The component's ROOT element** (the first element after the `<ng-container>` or directly inside `<template>`) → VIOLATION.
  - **An interior element** (nested inside the component's root layout) → ALLOWED; this is component-internal spacing.

  Use Read tool to load the template; verify the hit is at the structural root.

- **Step 3 — Fix root-element margin leaks.** For each violation:
  1. Open the template.
  2. Remove the `m-*` / `mx-*` / `ms-*` etc. from the root element.
  3. Find every consumer of this component (search for `<app-<name>` and `<falcon-<name>` references).
  4. Add the equivalent spacing to the consumer's grid: `<section class="grid gap-6">` instead of `<app-child class="mt-6">`.
  5. If multiple consumers each need different spacing → that's evidence the leaf was correctly margin-free; consumers must each express their own grid.

- **Step 4 — Tackle `client-settings-step.component.html` first.** Its consumers (Add Client wizard step 5 + Settings tab) must each define their grid. The wizard ALREADY has a grid (the 5-step wrapper); ensure the Settings tab also wraps the step in a proper grid container.

- **Step 5 — Sweep the remaining 14 offender files.**

- **Step 6 — Verify chrome-leak axis remains clean.** Re-run the `h-screen` / `fixed top-0` patterns to confirm no regression.

- **Step 7 — Build verification + Falcon Eyes visual diff** against Admin Console baseline.

## 5. Estimated effort + complexity rationale

**medium** — 36 candidates, each requiring per-hit verdict (root-element vs. interior). The actual fix is mechanical (delete margin, add grid to parent), but the "find every consumer" step can cascade — a component used in 6 places needs 6 consumer-side grids updated. Realistic: 4–6 hours.

## 6. Rollback hint (how to undo if the fix is wrong)

Per-file: `git checkout HEAD -- <file>.html` restores the margins. If a regression appears at the consumer side (section now collapsed), restore the margin temporarily and file the issue as a consumer-side grid missing — fix at the consumer, not by re-adding the leak.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  # Should drop significantly (only interior margins remain)
  rg -n -g '*.html' '\bclass="[^"]*\b(m-\d+|mx-\d+|my-\d+|mt-\d+|mb-\d+|ms-\d+|me-\d+)\b' apps/admin-console | Measure-Object | Select-Object -ExpandProperty Count
  rg -n -g '*.html' '\b(h-screen|min-h-screen|w-screen)\b' apps/admin-console | rg -v 'src/app/layout/'
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  ```
- expected output:
  - First count: <15 (only interior margins legitimately remaining)
  - Second `rg`: zero (chrome primitives only in layout/)
  - Build: exit code 0

## 8. Risk flags (anything that could break)

- **Removing a leaf margin can collapse the visual layout** if the consumer doesn't already have a grid. Always pair leaf-fix with consumer-grid-add in the same commit.
- **Multi-consumer components** (like `client-settings-step` used in wizard AND settings tab) need each consumer audited. Don't miss one — the missing one will show as a visual regression.
- **Modal/dialog overlay components** legitimately use `fixed inset-0` — confirm they're in an overlay slot before flagging.
- **Page route components** are allowed `grid` / `flex` on root (they ARE the layout). Don't strip them.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-008** — grid-first; admin-console refactors should adopt grid for the consumer-side spacing
- **R-NOOR-002** — spacing tokens go through theme promotion; the new consumer grids use Noor spacing tokens
- **R-NOOR-006** — Falcon library wrappers also obey this ownership split
- **R-FE-002** — closes the `:host { margin: ... }` escape hatch (no component CSS)
