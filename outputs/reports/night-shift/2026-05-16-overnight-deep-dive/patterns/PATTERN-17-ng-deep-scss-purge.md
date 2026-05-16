---
patternId: PATTERN-17
name: `:host` / `::ng-deep` in SCSS → removed (collateral of PATTERN-04)
violatesRules: [R-FE-002, R-NOOR-008]
estimatedReach: 25 occurrences across 14 files (mostly inside the SCSS files already targeted by PATTERN-04)
estimatedEffortPerOccurrence: 0 marginal (rolled up into PATTERN-04 / PATTERN-13)
totalEffortHours: 0 (already covered)
ammarAgent: ammar-web-platform-ui
priority: low
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
`:host`, `:host-context`, and `::ng-deep` appear inside the same SCSS files targeted by PATTERN-04 and PATTERN-13. R-NOOR-008 (global selector hygiene) forbids style escape hatches; R-FE-002 forbids SCSS entirely. This pattern exists as a separate entry only because the regex is independent and a future audit should pick it up if any SCSS slips back in.

## Where it appears (top 10 file paths)
- `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.scss` (3 ::ng-deep)
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.scss` (3)
- `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.css` (3 :host)
- `libs/falcon-ui-core/src/components/falcon-switch/falcon-switch.css` (3 :host)
- `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.css` (2)
- `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.css` (2)
- `libs/falcon-ui-core/src/components/falcon-calendar/falcon-calendar.css` (1)
- `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.css` (1)
- `libs/falcon-ui-core/src/components/falcon-paginator/falcon-paginator.css` (1)
- `libs/falcon\src\shared-ui\lib\components\falcon-mobile-number\falcon-mobile-number.component.scss` (1)

**Note on libs/falcon-ui-core/src/components/*.css** — these are the Stencil component CSS files (allowed by exception per `libs/falcon-ui-core/CSS-EXCEPTIONS.md`). `:host` is the correct Stencil pattern there. ONLY app-side and the legacy `libs/falcon/shared-ui` matches are violations.

## What replaces it
- Inside an app component SCSS being killed by PATTERN-04: the `:host` block usually maps to a wrapper class on the template root.
- Inside `libs/falcon/shared-ui` SCSS: same as PATTERN-04 — port to Tailwind on the template and delete.

## Migration steps
This pattern is auto-completed by PATTERN-04 + PATTERN-13 + PATTERN-12. No separate work.

## Detection regex (for future audits)
```
::ng-deep|:host-context\(|^:host\s
```
Exclude paths matching `libs/falcon-ui-core/src/components/`.

## Falcon components / libs involved
- N/A

## Risk + verification
- N/A (covered by upstream patterns).
