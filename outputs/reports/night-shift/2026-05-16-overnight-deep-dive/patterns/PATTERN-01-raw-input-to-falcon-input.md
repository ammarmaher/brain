---
patternId: PATTERN-01
name: Raw <input> → <falcon-angular-input>
violatesRules: [R-FE-005, R-FE-006]
estimatedReach: 13 occurrences across 7 files
estimatedEffortPerOccurrence: 5 minutes
totalEffortHours: ~1.5
ammarAgent: ammar-web-platform-ui
priority: high
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
Templates use raw native `<input type="text|password|email|number">` directly instead of the Falcon library wrapper. R-FE-005 (Falcon library first) and R-FE-006 (customization order: inputs → templates → … → raw HTML only as GAP) require `<falcon-angular-input>` for any rendered form field unless a documented GAP exists. The same files import other `<falcon-angular-*>` components — only the inputs were skipped, almost certainly because the original markup was ported over from React/HTML mocks and the input row was missed.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\change-password\change-password.component.html (lines 29, 100, 144)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\forgot-password-flow.component.html (lines 26, 228, 268)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\get-started\get-started.component.html (lines 34, 65)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-node-drawer\falcon-org-node-drawer.component.html (line 25)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-service-row-table\client-service-row-table.component.html (line 56)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-settings-step\client-settings-step.component.html (line 47 — keeps native input under documented GAP for FalconIpAddressDirective)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\playground\playground.page.html (line 2429 — playground, expected)

## What replaces it (the canonical pattern)
```html
<!-- Before -->
<input
  type="text"
  class="w-full bg-transparent border-0 border-b border-falcon-neutral-200 ..."
  [class.border-falcon-red-500]="!!nameError() && touched()"
  [placeholder]="'hierarchy.drawer.namePlaceholder' | translate"
  [value]="nameValue()"
  (input)="nameValue.set($any($event.target).value)"
  (blur)="touched.set(true)" />

<!-- After -->
<falcon-angular-input
  size="sm"
  type="text"
  [ngModel]="nameValue()"
  (ngModelChange)="nameValue.set($event)"
  [placeholder]="'hierarchy.drawer.namePlaceholder' | translate"
  [error]="touched() ? (nameError() | translate) : ''"
  (blur)="touched.set(true)" />
```

## Migration steps (one-time refactor)
1. Read `Brain Outputs\understanding\frontend\components\falcon-input\API.md` to confirm prop names (`type`, `size`, `placeholder`, `error`, `ngModel`).
2. For each match: replace `<input ...>` with `<falcon-angular-input ...>`, drop the hand-rolled Tailwind class list, map `[value]/(input)` to `[ngModel]/(ngModelChange)`, map error styling to the `error` input.
3. If a documented GAP exists (e.g. directive-only behaviour like `falconIpAddress` on `client-settings-step` L47), leave the raw input and add a `<!-- GAP: Falcon input does not project FalconIpAddressDirective -->` comment.
4. Run `nx build host-shell admin-console` and `nx build management-console`.

## Detection regex (so future audits catch new instances)
```
<input\s+(?![^>]*\bfalcon-)(?![^>]*type="(checkbox|radio|file|hidden)")
```

## Falcon components / libs involved
- `<falcon-angular-input>` from `@falcon/ui-core` (Angular wrapper around `<falcon-input>` Stencil component)
- Dossier: `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-input\`

## Risk + verification
- Build verification: `nx build host-shell`, `nx build admin-console`.
- Visual smoke test: change-password page, forgot-password flow, get-started login, add-node drawer, add-client wizard service rows.
- Form binding: ensure reactive form / signal binding still emits change events and validators still fire.
