---
patternId: PATTERN-05
name: Arbitrary Tailwind values (w-[Npx] / text-[Npx] / gap-[Npx]) → Token-backed utility
violatesRules: [R-FE-004, R-FE-001]
estimatedReach: ~98 occurrences across 23 files (17 with sizing arbitraries + 81 occurrences of text/p/m/gap arbitraries)
estimatedEffortPerOccurrence: 3 minutes
totalEffortHours: ~5
ammarAgent: ammar-web-platform-ui
priority: medium
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
Tailwind arbitrary-value utilities — `w-[140px]`, `h-[34px]`, `text-[11px]`, `gap-[6px]`, `p-[16px]` — appear scattered across templates. R-FE-004 (tokens only) requires that every dimension trace back to a token in the Tailwind scale or `falcon-tailwind-tokens.css`. Arbitrary px in the class list is the same anti-pattern as inline `style=` — it just hides inside `[...]`.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-settings-step\client-settings-step.component.html (26 occurrences)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\components\topbar\topbar.component.html (12)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\user-details\user-details-page.component.html (9)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\verify\otp-dialog.component.html (4)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\org-hierarchy-page-menu.component.html (5)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\add-client-wizard.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-user-wizard\add-user-wizard.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-service-row-table\client-service-row-table.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-info-panel\falcon-org-info-panel.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-chart\*

## What replaces it (the canonical pattern)
```html
<!-- Before -->
<div class="w-[140px] h-[34px] text-[11px] gap-[6px] p-[16px]">

<!-- After (typical mappings) -->
<div class="w-36 h-[34px] text-xs gap-1.5 p-4">
<!--                ^^^^^^^^^ keep arbitrary ONLY if no token exists; otherwise add a token -->

<!-- Even better: register the value as a token alias -->
<!-- libs/falcon-theme/src/falcon-tailwind-tokens.css -->
@theme {
  --spacing-falcon-row: 34px;  /* row height token */
}
<div class="w-36 h-falcon-row text-xs gap-1.5 p-4">
```

Common mappings on this project:
| Arbitrary | Replacement | Token in tokens.css |
|---|---|---|
| `text-[11px]` | `text-[11px]` (no standard token; add `--font-size-xs2: 11px` if used 3+ times) | open |
| `text-[18px]` | `text-lg` | exists |
| `gap-[6px]` | `gap-1.5` | exists |
| `p-[16px]` | `p-4` | exists |
| `h-[34px]` | introduce `--height-input-sm: 34px` | open |
| `w-[140px]` | `w-36` (default scale = 144px) — confirm pixel-perfect first | exists/close |
| `w-[96px]` | `w-24` | exists |
| `w-[180px]` | `w-44` (176px) or `w-[180px]` (open token) | open |

## Migration steps (one-time refactor)
1. Grep each file with the detection regex and triage every arbitrary into one of: `default-scale`, `existing-token`, `needs-new-token`, `acceptable-arbitrary (rare)`.
2. Land token aliases first (one PR per token group, append-only on `falcon-tailwind-tokens.css`).
3. Sweep replace arbitrary → token classes.
4. Build all three apps + visual diff.

## Detection regex
```
\b(w|h|max-w|max-h|min-w|min-h|p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|gap|text|leading|tracking|rounded|top|left|right|bottom|inset)(-[xy])?-\[\d+(\.\d+)?(px|rem|em)\]
```

## Falcon components / libs involved
- `libs/falcon-theme/src/falcon-tailwind-tokens.css`

## Risk + verification
- Low visual risk if mappings are pixel-perfect.
- Build all 3 apps.
- Test the affected pages end-to-end; the wizard steps are the heaviest concentration.
