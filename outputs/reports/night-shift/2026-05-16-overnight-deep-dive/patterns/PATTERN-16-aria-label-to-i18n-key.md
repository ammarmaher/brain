---
patternId: PATTERN-16
name: Hardcoded English aria-label="…" → `[attr.aria-label]="'key' | translate"`
violatesRules: [R-NOOR-007]
estimatedReach: 13 hardcoded aria-labels across 8 files
estimatedEffortPerOccurrence: 3 minutes
totalEffortHours: ~0.5
ammarAgent: ammar-web-platform-ui
priority: medium
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
Accessibility labels (`aria-label="Close"`, `aria-label="Back"`, `aria-label="Add IP"`) are hardcoded English. R-NOOR-007 requires every visible AND every assistive string to flow through the translate pipe. Screen-reader users in Arabic locales hear English labels through these.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\user-details\user-details-page.component.html L10 — `aria-label="Back"`
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-node-drawer\falcon-org-node-drawer.component.html L14 — `aria-label="Close"`
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\client-settings-step\client-settings-step.component.html L12 — `aria-label="Password security level"`
- L60 — `aria-label="Add IP"`
- L64 — `aria-label="Exit add mode"`
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\verify\otp-dialog.component.html (3)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\change-password\change-password.component.html (3)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\get-started\get-started.component.html (1)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\forgot-password-flow.component.html (2)

## What replaces it (the canonical pattern)
```html
<!-- Before -->
<button aria-label="Close" (click)="onCancel()">×</button>
<button aria-label="Add IP" (click)="addIp()">+</button>

<!-- After -->
<button [attr.aria-label]="'common.close' | translate" (click)="onCancel()">×</button>
<button [attr.aria-label]="'hierarchy.settings.addIp' | translate" (click)="addIp()">+</button>
```

For static labels on `role="img"` SVG decorations, prefer `aria-hidden="true"` if the icon is purely decorative; otherwise translate.

## Migration steps
1. List every hardcoded English aria-label.
2. For each: add a key to the i18n catalogue (en + ar) under the feature's namespace.
3. Replace with `[attr.aria-label]="'key' | translate"`.
4. Verify in Arabic mode — every focus stop should announce the Arabic label.

## Detection regex
```
aria-label="[A-Z][a-zA-Z ]+"
```
(Tightens to: starts with capital letter — catches English; misses single-word Arabic accidentally typed in.)

## Falcon components / libs involved
- `libs/falcon/language` (translate pipe + service)
- i18n catalogue: `apps/*/src/assets/i18n/{en,ar}.json` (verify path per app)

## Risk + verification
- Low.
- Verification: switch language to Arabic; screen-reader announcements should be Arabic.
