---
patternId: PATTERN-14
name: Multi-row flexbox layouts → CSS Grid (Tailwind grid utilities)
violatesRules: [R-FE-008]
estimatedReach: 22 files with `flex flex-col`/`flex flex-row` clusters of 3+ siblings where Grid is more appropriate
estimatedEffortPerOccurrence: 10 minutes
totalEffortHours: ~3
ammarAgent: ammar-web-platform-ui
priority: low
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
R-FE-008 / feedback_tailwind_grid_first.md says CSS Grid is the default layout primitive; flexbox is only for small inline alignment. The wizard step templates, the org-info-panel, and the falcon-table-edit-row routinely use `flex flex-col gap-N` wrapping 3–8 children when those children are field rows on a grid (2-column or N-column). Switching to `grid grid-cols-2 gap-x-N gap-y-M` keeps them aligned across columns and removes the need for hard-coded width spacers (which is what falcon-table-edit-row.component.html currently does at L22/L24/L52/L54 — `flex-shrink-0 w-[Npx]` spacers).

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\falcon-table-edit-row\falcon-table-edit-row.component.html (uses 5 inline-style spacers to recreate columns)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-account-owner-step\client-account-owner-step.component.html (5+ form rows, flex-only)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-user-wizard\user-personal-step\user-personal-step.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-info-panel\falcon-org-info-panel.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\user-details\user-details-page.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-information-step\client-information-step.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-settings-step\client-settings-step.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\verify\otp-dialog.component.html

## What replaces it (the canonical pattern)
```html
<!-- Before — flex with width spacers (falcon-table-edit-row) -->
<div class="flex items-end gap-4">
  <div class="flex-shrink-0 w-24"></div>
  <div class="flex-shrink-0 w-[140px]"></div>
  <div class="flex flex-col gap-1 w-[180px]">...field...</div>
  <div class="flex flex-col gap-1 w-[220px]">...field...</div>
</div>

<!-- After — grid columns matching the parent table -->
<div class="grid grid-cols-[96px_140px_180px_220px_1fr] items-end gap-x-4">
  <div></div>
  <div></div>
  <div class="flex flex-col gap-1">...field...</div>
  <div class="flex flex-col gap-1">...field...</div>
</div>
```

For form rows:
```html
<!-- Before -->
<div class="flex flex-col gap-4">
  <div class="flex gap-4">
    <falcon-angular-input class="flex-1" ... />
    <falcon-angular-input class="flex-1" ... />
  </div>
  <div class="flex gap-4">
    <falcon-angular-input class="flex-1" ... />
    <falcon-angular-input class="flex-1" ... />
  </div>
</div>

<!-- After -->
<div class="grid grid-cols-2 gap-4">
  <falcon-angular-input ... />
  <falcon-angular-input ... />
  <falcon-angular-input ... />
  <falcon-angular-input ... />
</div>
```

## Migration steps
1. Identify clusters of `flex flex-col` / `flex flex-row` wrapping a uniform grid of fields.
2. Replace with `grid grid-cols-N gap-x-M gap-y-P`.
3. Drop the inner row wrappers and any width spacers (PATTERN-03 cleanup falls out for free).
4. Verify on narrow viewport.

## Detection regex
HTML scan for files matching: 3+ consecutive `<div class="flex` opening tags within a 20-line window. (No simple single-regex; use a higher-level scan.)

## Falcon components / libs involved
- N/A — pure layout refactor.

## Risk + verification
- Medium. Wizard steps are touched daily; pixel-diff before/after.
- RTL: grid handles direction naturally.
- Narrow viewport: ensure responsive `md:grid-cols-2 grid-cols-1` is added where needed.
