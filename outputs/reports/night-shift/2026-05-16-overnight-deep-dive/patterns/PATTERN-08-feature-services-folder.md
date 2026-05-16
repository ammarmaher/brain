---
patternId: PATTERN-08
name: Loose *.service.ts files → consolidated services/services.ts
violatesRules: [R-FE-009]
estimatedReach: 16 loose `*.service.ts` files across host-shell + admin-console features
estimatedEffortPerOccurrence: 8 minutes (move + update barrel imports)
totalEffortHours: ~2
ammarAgent: ammar-web-platform-ui
priority: medium
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
R-FE-009 (folder structure pattern) requires every feature to use the canonical layout:
- `models/models.ts` — all models/interfaces/types for the feature in one file
- `services/services.ts` — all services for the feature in one file
- `resolvers/resolvers.ts`
- `directives/directives.ts`

Several features ship one-service-per-file (`change-password.service.ts`, `otp.service.ts`, `forgot-password-flow.service.ts`, etc.) instead of consolidating into `services/services.ts`. The wizard features already follow the correct pattern (e.g. `add-user-wizard/services/services.ts`) — proving the rule is enforceable and the migration is straightforward.

## Where it appears (top 10 file paths)
**Loose service files (violation):**
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\change-password\services\change-password.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\enter-otp\services\otp.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\forgot-password-flow\services\forgot-password-flow.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\get-started\services\login.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth\services\auth-flow-state.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\falcon-ui-showcase\showcase-config.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\core\auth\auth-api.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\core\auth\auth.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\core\auth\token-storage.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\core\user\user-api.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\core\services\remote-route.service.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\services\hierarchy-page-state.service.ts (peer-of services.ts — should merge)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\services\otp-mock.service.ts (peer-of services.ts — should merge)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\tab-components\hierarchy-tab\falcon-org-chart\services\chart-layout.service.ts (peer-only — should be services/services.ts)

**Reference compliant files (canonical pattern):**
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-user-wizard\services\services.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\components\wizard-components\add-client-wizard\services\services.ts
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\admin-console\src\app\features\org-hierarchy-page\services\services.ts

## What replaces it (the canonical pattern)
```
features/
└── auth/
    ├── change-password/
    │   ├── change-password.component.ts
    │   ├── change-password.component.html
    │   ├── models/models.ts          ← all models for change-password
    │   └── services/services.ts      ← all services for change-password
```

Inside `services/services.ts`:
```ts
*** services for the <feature> feature — single source of truth ***
@Injectable({ providedIn: 'root' })
export class FooService { /* ... */ }

@Injectable({ providedIn: 'root' })
export class BarService { /* ... */ }
```

## Migration steps
1. For each feature with loose `*.service.ts`, create `services/services.ts` next to the component file.
2. Move every `@Injectable` class into the new file.
3. Update all import paths from `./services/foo.service` → `./services/services`.
4. Delete the old files.
5. `tsc --noEmit` per project (or `nx build`) to catch import misses.

## Detection regex
File-path glob (per feature folder):
```
apps/**/features/**/*.service.ts  (excluding services/services.ts)
apps/**/core/**/*.service.ts  (excluding services/services.ts)
```

## Falcon components / libs involved
- Pure structural — no library involvement.

## Risk + verification
- Low risk; pure rename/merge.
- Verification: `nx build host-shell admin-console management-console` + every feature smoke test (auth flows, hierarchy page).
- Watch for circular imports if two services reference each other — consolidate cleanly.
