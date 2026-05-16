---
patternId: PATTERN-11
name: <i class="falcon-icon falcon-icon-xxx"> → <falcon-angular-icon name="xxx">
violatesRules: [R-FE-005, R-FE-006]
estimatedReach: 38 occurrences across 11 files
estimatedEffortPerOccurrence: 2 minutes
totalEffortHours: ~1.5
ammarAgent: ammar-web-platform-ui
priority: medium
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
Templates use the post-PrimeNG `<i class="falcon-icon falcon-icon-name">` icon-font idiom (created during the PrimeIcons purge to keep things working) instead of the canonical Falcon Stencil icon component. The Falcon library exposes `<falcon-icon>` / `<falcon-angular-icon>` which renders the same glyph, picks the right size token, and applies the right colour token. Mixing both keeps two icon stacks alive.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\components\sidebar\sidebar.component.html — already migrated (uses `<falcon-angular-icon>` x4) — keep as reference
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\org-hierarchy-page-menu.component.html (8)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\not-found\not-found.component.html (1)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\user-details\user-details-page.component.html (4)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\settings-tab\settings-tab.component.html (2)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\enter-otp\enter-otp.component.html (3)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\change-password\change-password.component.html (5)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\forgot-password-flow.component.html (9)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\get-started\get-started.component.html (3)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-settings-step\client-settings-step.component.html (1)

## What replaces it (the canonical pattern)
```html
<!-- Before -->
<i class="falcon-icon falcon-icon-times text-[14px]"></i>
<i class="falcon-icon falcon-icon-search text-falcon-neutral-600"></i>

<!-- After -->
<falcon-angular-icon name="times" size="sm" />
<falcon-angular-icon name="search" tone="neutral-600" />
```

If a specific glyph is not in the icon registry yet, raise a registry-gap before continuing (do not introduce a one-off image).

## Migration steps
1. Snapshot the icon registry: `libs/falcon-ui-core/src/components/falcon-icon/icon-names.ts` (or equivalent).
2. For each match in the codebase, map `falcon-icon-foo` → `<falcon-angular-icon name="foo">`.
3. Translate the colour Tailwind class to the `tone` input (or leave the class on the wrapper if the icon component supports class-pass-through).
4. Build + visual.

## Detection regex
```
<i\s+class="[^"]*\bfalcon-icon\b[^"]*"
```

## Falcon components / libs involved
- `<falcon-icon>` / `<falcon-angular-icon>` from `@falcon/ui-core`
- Dossier: `Brain Outputs/understanding/frontend/components/falcon-icon/`

## Risk + verification
- Verify icon glyph + sizing matches; if the wrapper `text-[Npx]` was setting font-size for the icon, the Stencil component's `size` prop must give the same pixel size.
- Tone/colour: confirm Tailwind classes on the icon container translate cleanly.
