---
patternId: PATTERN-13
name: Host-shell layout/topbar/sidebar SCSS → Tailwind (with extra care)
violatesRules: [R-FE-001, R-FE-002]
estimatedReach: 4 SCSS files in host-shell layout cluster
estimatedEffortPerOccurrence: 45 minutes per file (layout files cascade)
totalEffortHours: ~3
ammarAgent: ammar-web-platform-ui
priority: medium
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
The host-shell layout cluster (`layout.component.scss`, `sidebar.component.scss`, `topbar.component.scss`, `not-found.component.scss`, `dashboard.component.scss`) is the platform shell that every app renders inside. These SCSS files include scroll behaviour, sticky positioning, brand padding tokens, and z-index ladders. Migrating them is higher-risk than feature SCSS — but the rule is the same (R-FE-002, R-FE-001).

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\layout.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\components\sidebar\sidebar.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\components\topbar\topbar.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\dashboard\dashboard.component.scss
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\not-found\not-found.component.scss

## What replaces it (the canonical pattern)
Same as PATTERN-04 (Tailwind utilities on the template) — but with a stricter checklist:
1. Capture every CSS variable the scss references (z-index, sticky-top, sidebar-width).
2. Verify each variable already exists as a Falcon token; if not, add it BEFORE the rewrite.
3. Use `[ngClass]` or static utility classes; never re-introduce a scss file.
4. Use logical Tailwind utilities (PATTERN-07).

```scss
/* Before — sidebar.component.scss */
.sidebar {
  width: var(--falcon-sidebar-width, 280px);
  position: sticky;
  top: var(--falcon-topbar-height, 64px);
  z-index: 30;
  background: var(--color-falcon-neutral-0);
  border-inline-end: 1px solid var(--color-falcon-neutral-100);
}
```

```html
<!-- After -->
<aside class="w-falcon-sidebar sticky top-falcon-topbar z-30 bg-falcon-neutral-0 border-e border-falcon-neutral-100">
  ...
</aside>
```

## Migration steps
1. Read the original scss + ALL selectors carefully — note pseudo-classes, descendants, and nested overrides.
2. Add any missing token aliases to `falcon-tailwind-tokens.css`.
3. Move declarations to the template incrementally, one screen at a time.
4. Delete the scss + the `styleUrls` line.
5. Build + visual-diff vs a screenshot baseline.

## Detection regex
```
styleUrls?\s*:\s*\[?\s*['"]\./(layout|sidebar|topbar|dashboard|not-found)\.component\.scss
```

## Falcon components / libs involved
- `falcon-tailwind-tokens.css` — likely needs new tokens for sidebar-width, topbar-height, layout z-index ladder.

## Risk + verification
- HIGH risk — every page renders inside this layout.
- Verification: every route smoke-tested (home, dashboard, hierarchy, settings, auth fallback).
- RTL toggle to verify the `border-inline-end` translation.
- Mobile breakpoint smoke.
