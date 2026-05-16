---
patternId: PATTERN-02
name: Raw <button> → <falcon-angular-button>
violatesRules: [R-FE-005, R-FE-006, R-FE-004, R-NOOR-006]
estimatedReach: 87 occurrences across 18 files (most density in playground; ~30 in production code)
estimatedEffortPerOccurrence: 4 minutes
totalEffortHours: ~5
ammarAgent: ammar-web-platform-ui
priority: high
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
Templates use raw `<button type="button">` with hand-rolled Tailwind class lists ("inline-flex items-center h-[34px] px-5 rounded-md bg-falcon-teal-700 text-white text-sm font-semibold hover:bg-falcon-teal-800 …") to re-implement what `<falcon-angular-button>` already provides via `variant` + `size`. Every place that does this is duplicating button styling tokens and losing the centralised hover/disabled/focus/loading states the Falcon button ships with.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-node-drawer\falcon-org-node-drawer.component.html (lines 14, 45, 50 — Save/Cancel)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\verify\otp-dialog.component.html (close, primary)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\add-client-wizard.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-user-wizard\add-user-wizard.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\get-started\get-started.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\forgot-password-flow.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\change-password\change-password.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\components\sidebar\sidebar.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\components\topbar\topbar.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\user-details\user-details-page.component.html

## What replaces it (the canonical pattern)
```html
<!-- Before -->
<button type="button"
        class="inline-flex items-center h-[34px] px-5 rounded-md bg-falcon-teal-700 text-white text-sm font-semibold hover:bg-falcon-teal-800 disabled:opacity-50 disabled:cursor-not-allowed"
        [disabled]="!canSave()"
        (click)="onSave()">
  {{ 'hierarchy.drawer.addNode.save' | translate }}
</button>

<!-- After -->
<falcon-angular-button
  variant="primary"
  size="md"
  [disabled]="!canSave()"
  (click)="onSave()">
  {{ 'hierarchy.drawer.addNode.save' | translate }}
</falcon-angular-button>
```

For icon-only "close" buttons inside dialogs/drawers, prefer the host component's `closable` input rather than reimplementing a close button.

## Migration steps (one-time refactor)
1. Categorise each raw button by intent: primary, secondary, ghost/text, icon-only-close.
2. For primary/secondary: replace with `<falcon-angular-button variant="..." size="...">` and delete the Tailwind class list.
3. For close buttons inside `<falcon-angular-drawer>` / `<falcon-angular-dialog>`: enable `[closable]="true"` on the host and remove the manual close button entirely.
4. Skip `apps/host-shell/src/app/playground/playground.page.html` (dev playground, intentionally low-level demos).
5. Verify visually + run `nx build`.

## Detection regex
```
<button(\s+type="(button|submit)")?(\s+[^>]*)?\s*>(?![^<]*</falcon-)
```
Together with a class-list check: `class="[^"]*\b(bg-falcon-|h-\[\d+px\]|rounded-md|inline-flex)`.

## Falcon components / libs involved
- `<falcon-angular-button>` from `@falcon/ui-core`
- Dossier: `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-button\`

## Risk + verification
- Build: `nx build host-shell admin-console management-console`.
- Visual smoke test of every auth flow, every wizard step, drawer Save/Cancel rows, dialog primary actions.
- Beware: a few "buttons" are actually anchor tags or `(click)` on a div — those should also migrate but are not in the regex above.
