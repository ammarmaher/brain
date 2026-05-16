---
patternId: PATTERN-15
name: Token CSS-var defensive fallback (var(--token, #hex)) → drop fallback once token is guaranteed-loaded
violatesRules: [R-FE-004]
estimatedReach: 7 occurrences across 4 files (templates only — token CSS files are exempt)
estimatedEffortPerOccurrence: 1 minute
totalEffortHours: ~0.25
ammarAgent: ammar-web-platform-ui
priority: low
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
Templates embed defensive fallbacks like `var(--color-falcon-neutral-30, #f7f8fa)` for safety in case the token CSS hasn't loaded. Since the Falcon token files are imported by the global theme entry on every app boot (`libs/falcon-theme/src/falcon-tailwind-tokens.css`), the fallback is dead code AND a hex literal landmine. R-FE-004 wants tokens-only; the hex fallback is the leak.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\org-hierarchy-page-menu.component.html (1)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\verify\otp-dialog.component.html (2)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\enter-otp\enter-otp.component.html (2)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\forgot-password-flow.component.html (2)

## What replaces it (the canonical pattern)
```html
<!-- Before -->
style="--falcon-table-header-bg: var(--color-falcon-neutral-30, #f7f8fa);"

<!-- After (token guaranteed) -->
style="--falcon-table-header-bg: var(--color-falcon-neutral-30);"

<!-- Even better — promote the override to a class -->
class="falcon-table-neutral-header"
/* in token CSS */
.falcon-table-neutral-header { --falcon-table-header-bg: var(--color-falcon-neutral-30); }
```

The "even better" form drops PATTERN-03 (inline style) at the same time.

## Migration steps
1. Verify the falcon theme file is loaded synchronously in `apps/*/src/main.ts` (it is — confirmed).
2. Sweep replace `var(--token, #hex)` → `var(--token)`.
3. Where the result is still an inline style, apply PATTERN-03 cleanup.

## Detection regex
```
var\(--[a-zA-Z0-9-]+,\s*#[0-9a-fA-F]{3,8}\)
```

## Falcon components / libs involved
- `libs/falcon-theme/src/falcon-tailwind-tokens.css`
- `libs/falcon-ui-tokens/src/primitives/colors.css`

## Risk + verification
- Lowest possible risk.
- Confirm pre-load order: `import 'tailwind.css'` first → all tokens present at first paint.
