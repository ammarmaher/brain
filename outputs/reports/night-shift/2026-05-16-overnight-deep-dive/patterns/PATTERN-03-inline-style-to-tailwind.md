---
patternId: PATTERN-03
name: Inline style="…" → Tailwind utilities + tokens
violatesRules: [R-FE-003, R-FE-004]
estimatedReach: 22 occurrences across 4 files (otp-dialog 11, falcon-table-edit-row 9, applications-table 1, org-hierarchy-page-menu 1)
estimatedEffortPerOccurrence: 6 minutes
totalEffortHours: ~2.5
ammarAgent: ammar-web-platform-ui
priority: high
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
HTML elements use `style="…"` attributes for dimensions, padding, gaps, font-size, background colours, and box-shadows. R-FE-003 (no inline styles) and R-FE-004 (tokens only) require Tailwind utility classes that map to the canonical token CSS files. Most of these inlines hardcode `px` values that already have a token alias in `libs/falcon-theme/src/falcon-tailwind-tokens.css`.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\verify\otp-dialog.component.html (lines 18, 44, 48, 53, 63, 67, 72, 73, 76, 111, 127) — 11 inline styles, includes a full positioning block + 4 font-size literals
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\falcon-table-edit-row\falcon-table-edit-row.component.html (lines 18, 22, 24, 27, 39, 52, 54, 56, 59) — 9 inline widths/backgrounds, includes raw `#F3F8F5` literal
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\applications-table\applications-table.component.html (line 1)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\org-hierarchy-page-menu.component.html (line 217 — overriding Falcon table CSS vars inline)

## What replaces it (the canonical pattern)
```html
<!-- Before -->
<div class="flex items-end gap-4 px-0 py-3.5"
     style="background: #F3F8F5; padding-inline: 16px;">

<div class="flex-shrink-0" style="width: 96px;"></div>

<p class="text-falcon-neutral-800 leading-relaxed" style="font-size: 18px;">
  ...
</p>

<!-- After (use semantic tokens + Tailwind utilities) -->
<div class="flex items-end gap-4 px-4 py-3.5 bg-falcon-teal-50">

<div class="flex-shrink-0 w-24"></div>  <!-- 96px = w-24 in default scale -->

<p class="text-falcon-neutral-800 leading-relaxed text-lg">  <!-- 18px ≈ text-lg -->
  ...
</p>
```

For dimensions that don't fit the default scale, prefer adding a token to `falcon-tailwind-tokens.css` rather than using arbitrary `w-[96px]`. For the `--falcon-table-header-bg` overrides on `org-hierarchy-page-menu.component.html:217`, this is a documented CSS-var-override pattern — replace inline style with a wrapper class that sets the vars in a CSS class.

## Migration steps (one-time refactor)
1. Pre-flight: grep each file for hard-coded hex colours (`#F3F8F5` etc.); confirm they map to an existing token in `falcon-tailwind-tokens.css`. If not, add a new token (do not introduce hex literals into Tailwind classes).
2. Per occurrence:
   - Translate each `style="key: value;"` pair to a Tailwind utility from the default or extended scale.
   - For arbitrary px values, check the token catalogue first — only use `[…px]` if no token exists AND opening a token-catalogue gap.
   - For CSS-variable overrides (Falcon table/dialog theming hooks), introduce a wrapper component CSS class instead of inline style.
3. Build + visual diff.

## Detection regex
```
\sstyle="[^"]+"
```
Tighten with negative lookahead for `[svg]` or `[data-*]` if false positives appear.

## Falcon components / libs involved
- Tokens: `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-theme\src\falcon-tailwind-tokens.css`
- Token catalogue per component: `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-tokens\src\components\*.tokens.css`

## Risk + verification
- Build: `nx build admin-console`.
- Pixel-diff the OTP dialog and the inline-edit row vs. the screenshots referenced in their hand-port comments (the table-edit-row component has a "Round 3" comment block referencing the React SoT — that screenshot is the bar).
- Watch for layout regressions where inline padding interacted with a sibling's margin collapse.
