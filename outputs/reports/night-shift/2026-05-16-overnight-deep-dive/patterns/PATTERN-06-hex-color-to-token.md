---
patternId: PATTERN-06
name: Hardcoded hex colour → token-backed Tailwind class
violatesRules: [R-FE-004, R-NOOR-005]
estimatedReach: ~25 occurrences in templates + scss files outside the token catalogue
estimatedEffortPerOccurrence: 4 minutes
totalEffortHours: ~1.5
ammarAgent: ammar-web-platform-ui
priority: high
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
Hex colour literals (`#F3F8F5`, `#0D3F44`, etc.) appear inside `style="…"`, inline `var(..., #fallback)` shorthands, and inside the auth-feature SCSS files. R-FE-004 (tokens only) requires colours to come from the Tailwind token scale (`bg-falcon-teal-50`, `text-falcon-neutral-900`), not raw hex literals. Token CSS files (`libs/falcon-ui-tokens/**/*.tokens.css`, `libs/falcon-theme/src/falcon-tailwind-tokens.css`) are the only legitimate place hex literals live.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\falcon-table-edit-row\falcon-table-edit-row.component.html L18: `background: #F3F8F5`
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\org-hierarchy-page-menu.component.html L217: `var(--color-falcon-neutral-30, #f7f8fa)`
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\verify\otp-dialog.component.html L44: `box-shadow: 0 30px 80px -20px rgba(13, 63, 68, 0.30)`
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\enter-otp\enter-otp.component.html L2 (verify)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\forgot-password-flow.component.html L2
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\login-layout\login-layout.component.scss L2
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\get-started\get-started.component.scss L1
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\enter-otp\enter-otp.component.scss L11
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\forgot-password-flow.component.scss L9
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\dashboard\dashboard.component.scss L15

## What replaces it (the canonical pattern)
```html
<!-- Before -->
<div style="background: #F3F8F5; padding-inline: 16px;">

<!-- After -->
<div class="bg-falcon-teal-50 px-4">
```

```css
/* Before */
.login-bg { background: #0D3F44; }

/* After (apply on template instead, drop the scss) */
class="bg-falcon-teal-900"
```

For `var(--color-falcon-neutral-30, #f7f8fa)` defensive fallbacks — these are acceptable IF and only IF the token is loaded before the use site. Verify; if the token is always loaded, drop the fallback.

## Migration steps
1. Grep every hex literal under `apps/` (and any scss that survives PATTERN-04 / inline-style cleanup).
2. For each, look it up in `libs/falcon-ui-tokens/src/primitives/colors.css` — find the named token.
3. Replace the literal with the named token class on the template OR delete the scss in conjunction with PATTERN-04.
4. If a literal does not exist in the catalogue, raise it as a token gap before continuing.

## Detection regex
Templates:
```
\sstyle="[^"]*#[0-9a-fA-F]{3,8}
```
All files (filter out token CSS):
```
#[0-9a-fA-F]{6}\b
```
Exclude paths matching `(libs/falcon-ui-tokens/|libs/falcon-theme/|libs/falcon-studio/registry/|assets/)`.

## Falcon components / libs involved
- Token primitives: `libs/falcon-ui-tokens/src/primitives/colors.css`
- Token aliases: `libs/falcon-theme/src/falcon-tailwind-tokens.css`

## Risk + verification
- Visual: confirm shade is the same before/after on the affected page; the named token sometimes differs slightly from the literal someone hand-picked.
- Build: `nx build host-shell admin-console`.
