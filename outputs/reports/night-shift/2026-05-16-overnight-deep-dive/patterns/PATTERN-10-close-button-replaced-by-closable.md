---
patternId: PATTERN-10
name: Manual close <button> + aria-label → `[closable]` input on Falcon dialog/drawer
violatesRules: [R-FE-005, R-FE-006]
estimatedReach: ~6 manual close buttons across drawer/dialog templates
estimatedEffortPerOccurrence: 4 minutes
totalEffortHours: ~0.5
ammarAgent: ammar-web-platform-ui
priority: medium
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
Templates render `<falcon-angular-drawer>` / `<falcon-angular-dialog>` with `[closable]="false"`, then re-implement a close button inline using `<button aria-label="Close"><i class="falcon-icon falcon-icon-times"></i></button>`. The Falcon components ship a built-in close button — toggling `[closable]="true"` and listening for `(drawerHide)` / `(dialogClose)` gives the same UX with zero markup, proper focus management, and consistent positioning.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-node-drawer\falcon-org-node-drawer.component.html L14
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\verify\otp-dialog.component.html L53
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-user-wizard\add-user-wizard.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\add-client-wizard.component.html
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\shared-components\do-payment-priority-popup\do-payment-priority-popup.component.html

## What replaces it (the canonical pattern)
```html
<!-- Before -->
<falcon-angular-drawer
  [open]="visible()"
  position="right"
  size="md"
  [closable]="false"
  [modal]="true"
  (drawerHide)="onHide()">

  <div slot="header" class="flex items-center justify-between gap-2 px-6 pt-5 pb-3">
    <h3>{{ title | translate }}</h3>
    <button type="button" aria-label="Close"
            class="inline-flex items-center justify-center w-7 h-7 rounded-md ..."
            (click)="onCancel()">
      <i class="falcon-icon falcon-icon-times text-[14px]"></i>
    </button>
  </div>
  ...
</falcon-angular-drawer>

<!-- After -->
<falcon-angular-drawer
  [open]="visible()"
  position="right"
  size="md"
  [closable]="true"
  [modal]="true"
  (drawerHide)="onCancel()">

  <div slot="header" class="px-6 pt-5 pb-3">
    <h3>{{ title | translate }}</h3>
  </div>
  ...
</falcon-angular-drawer>
```

## Migration steps
1. Identify every place `[closable]="false"` is paired with a manual close `<button>` inside the same drawer/dialog block.
2. Flip `[closable]` to `true`.
3. Delete the manual close button + its container if it was only present for the close button.
4. Re-route the original (click)="onCancel()" to the host's `(drawerHide)` / `(dialogClose)` output.
5. Verify keyboard escape still works (Falcon dialog/drawer handles ESC natively).

## Detection regex
```
\[closable\]="false"
```
And separately:
```
aria-label="Close"
```

## Falcon components / libs involved
- `<falcon-angular-drawer>` — `closable`, `drawerHide`
- `<falcon-angular-dialog>` — `closable`, `dialogClose`
- Dossiers: `Brain Outputs/understanding/frontend/components/falcon-drawer/`, `falcon-dialog/`

## Risk + verification
- Visual: confirm close-button placement is identical (Falcon close-button position vs. the manual one).
- Keyboard: ESC, focus trap, tab order — all should still work.
- Build all three apps.
