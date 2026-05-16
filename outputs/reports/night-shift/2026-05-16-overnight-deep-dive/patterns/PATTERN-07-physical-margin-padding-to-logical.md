---
patternId: PATTERN-07
name: Physical ml-*/mr-*/pl-*/pr-* → Logical ms-*/me-*/ps-*/pe-* (RTL safety)
violatesRules: [R-NOOR-007]
estimatedReach: 8 occurrences across 7 files (in production code only — admin-console + host-shell)
estimatedEffortPerOccurrence: 2 minutes
totalEffortHours: ~0.5
ammarAgent: ammar-web-platform-ui
priority: medium
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
Templates use physical horizontal margin/padding utilities (`ml-*`, `mr-*`, `pl-*`, `pr-*`) which break in RTL locales — they always pin to the left/right of the screen, not the start/end of the writing direction. Noor instructions (R-NOOR-007 i18n/RTL) require logical equivalents (`ms-*`, `me-*`, `ps-*`, `pe-*`). The Falcon platform ships both LTR (English) and RTL (Arabic) variants.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\org-hierarchy-page-menu.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-info-panel\falcon-org-info-panel.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-settings-step\client-settings-step.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-service-row-table\client-service-row-table.component.html (uses `ms-auto` already in some places — good signal)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\change-password\change-password.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\forgot-password-flow.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\get-started\get-started.component.html

## What replaces it (the canonical pattern)
```html
<!-- Before -->
<div class="ml-4 pr-2">
<div class="mr-auto">

<!-- After -->
<div class="ms-4 pe-2">
<div class="me-auto">
```

Mapping:
| Physical | Logical | Notes |
|---|---|---|
| `ml-N` | `ms-N` | margin-inline-start |
| `mr-N` | `me-N` | margin-inline-end |
| `pl-N` | `ps-N` | padding-inline-start |
| `pr-N` | `pe-N` | padding-inline-end |
| `text-left` | `text-start` | |
| `text-right` | `text-end` | |
| `left-N` | `start-N` | |
| `right-N` | `end-N` | |
| `border-l` | `border-s` | |
| `border-r` | `border-e` | |
| `rounded-l-*` | `rounded-s-*` | |

## Migration steps
1. Sweep replace per the mapping table.
2. After each file, eyeball the layout in LTR — it should be identical.
3. Spot-check in RTL by toggling the language to Arabic (Falcon i18n service).

## Detection regex
```
\b(ml|mr|pl|pr)-(\d|\[)
```
Tighten with: ensure the file lives under `apps/` (not `libs/falcon-ui-*` — those tokens may legitimately reference physical sides via the Stencil component itself).

## Falcon components / libs involved
- Tailwind v4 ships logical utilities natively — no extra config needed.

## Risk + verification
- Very low — pure search-and-replace.
- Verification: switch the app to Arabic via the language selector in the topbar; nothing should break, and start-of-line padding should flip to the right side.
