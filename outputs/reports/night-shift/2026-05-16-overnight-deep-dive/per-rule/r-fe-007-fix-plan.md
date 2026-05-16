---
ruleId: R-FE-007
ruleName: Library skeleton + app wrapper — no service injection in libs
severity: must
violationCount: 5
estimatedEffort: small
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

`libs/falcon-ui-core/**` components must be pure presentational skeletons (no `inject()` of HTTP-bearing services) — service injection lives only in app-level wrappers at `apps/host-shell/src/app/shared-components/<verb-noun>-popup/`.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-ui-core`:

| Detector pattern | Hits |
|---|---|
| `inject(HttpClient)` or direct HttpClient parameter | 0 |
| `inject(<SomethingService>)` pattern | 5 |

The 5 hits are all in `libs/falcon-ui-core/src/angular-wrapper/components/`:

1. `falcon-empty-data/falcon-empty-data.component.ts` — likely `inject(TranslateService)` or similar pure-utility
2. `falcon-popup/falcon-popup.component.ts` — likely `inject(<OverlayService>)`
3. `falcon-notification/falcon-notification.component.ts` — `inject(MessageService)` or similar
4. `falcon-notification/falcon-notification-stack.component.ts` — same family as #3
5. `falcon-message-service/falcon-message-host.component.ts` — message service host

Note: these are LIKELY all pure-utility services (translate, message-bus, overlay) — explicitly exempt per the rule's grandfathered list. But the audit must verify each one individually.

Existing wrapper layer (positive evidence of pattern adoption):

```
apps/host-shell/src/app/shared-components/
├── do-payment-priority-popup/       ← reference wrapper per memory feedback
└── organization-hierarchy-tree/      ← second wrapper
```

Two wrappers already exist, both following the Wave 16 pattern from `feedback_library_skeleton_app_api`. The pattern is alive; the audit is to confirm no new violations have crept in and to identify candidates for additional wrapping.

Per-app exposure on the **app side** (page components injecting domain HTTP services AND consuming `<falcon-*>` skeletons):

| App | Likely candidates for new wrappers |
|---|---|
| admin-console | org-hierarchy-page components (otp-dialog, applications-table) that inject services AND use Falcon dialogs |
| host-shell | auth flow components inject `LoginService` / `OtpService` AND use Falcon inputs |
| management-console | low — currently clean |

## 3. Why this matters (the architectural cost of leaving it)

The two-layer skeleton+wrapper pattern is the architecture that lets:
- **Library skeletons** ship to non-commerce reuse with mock data (Theme Studio, third-party demos)
- **App wrappers** own the domain HTTP orchestration without polluting the library

A regression here — a library component injecting `CommChannelPaymentService` — silently bakes a commerce dependency into the library and prevents standalone reuse. The canonical reference (`<falcon-angular-insufficient-balance-dialog>` ↔ `<app-do-payment-priority-popup>`) is the doctrine; the audit ensures the doctrine holds.

The 5 hits are likely all valid (pure utilities), but each one needs confirmation. Skipping the audit means a non-utility service could slip in unnoticed.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Open each of the 5 lib hits and classify the injected service.** For each file:
  - `falcon-empty-data.component.ts` — read constructor / `inject()` calls; classify each service.
  - `falcon-popup.component.ts`
  - `falcon-notification.component.ts`
  - `falcon-notification-stack.component.ts`
  - `falcon-message-host.component.ts`

  Classification:
  - **Pure utility** (TranslateService, MessageService, no HTTP) → exempt, document in `EXEMPTIONS.md` against R-FE-007 with reason.
  - **Domain HTTP service** (calls `/api/...`) → **VIOLATION**, refactor per Step 2.

- **Step 2 — For any genuine violation:** apply the lib-violation fix recipe:
  1. Identify the data/events the component needs from the service.
  2. Convert each into `@Input` (data in) or `@Output` (event out).
  3. Remove the `inject()` call.
  4. Create the matching wrapper at `apps/host-shell/src/app/shared-components/<verb-noun>-popup/`.
  5. Wrapper injects the service, consumes the skeleton as a tag, bridges via the new I/O.
  6. Add TS path alias to `tsconfig.base.json`: `"@host-shell/shared/<name>": [...]`.
  7. Update consumers to import the wrapper, not the skeleton.

- **Step 3 — App-side audit.** For each app component that uses a `<falcon-*>` skeleton AND injects an HTTP service:
  ```
  rg -n --type ts -g '!*.spec.ts' 'inject\(.*Service\)' apps | rg -A 5 '<falcon-'
  ```
  For each match, judge whether the orchestration belongs in a wrapper. If yes, extract per the wrapper recipe.

- **Step 4 — Identify candidates for new wrappers.** Based on the audit, propose a wrapper for any orchestration that:
  - Is consumed in 2+ pages, or
  - Owns a multi-step flow (poll, retry, state-machine), or
  - Mixes domain HTTP with `<falcon-*>` presentation

  Promising candidates surfaced by the audit:
  - `<app-otp-dialog-popup>` wrapping `<falcon-popup>` + OtpService — currently in admin-console org-hierarchy
  - `<app-send-credentials-popup>` (already partial; verify split)

- **Step 5 — Document the pattern in canonical pattern strategy.** `Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §6 already has the doctrine — confirm any new wrapper is registered there.

- **Step 6 — Build verification.**

## 5. Estimated effort + complexity rationale

**small** — Only 5 lib hits to verify; based on file names all 5 are likely exempt (pure utilities). Real work is the app-side audit (Step 3), which surfaces candidates for new wrappers. Realistic: 2–4 hours to verify the 5 + run app audit + write 1–2 GAP entries proposing new wrappers.

## 6. Rollback hint (how to undo if the fix is wrong)

If a wrapper extraction breaks a flow (e.g. `Cannot find module '@host-shell/shared/do-payment-priority-popup'`), revert the tsconfig path entry + the wrapper folder + the consumer's import line in one commit. Library-side refactors (input/output extraction) are also safely reverted via `git checkout HEAD -- libs/falcon-ui-core/src/...`.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n --type ts 'inject\(HttpClient\)|: HttpClient\b' libs/falcon-ui-core
  rg -n --type ts 'inject\([A-Z][a-zA-Z]+Service\)' libs/falcon-ui-core
  # Confirm wrapper barrels resolve
  UV_THREADPOOL_SIZE=128 npx nx build falcon-ui-core
  UV_THREADPOOL_SIZE=128 npx nx build host-shell --configuration=development
  ```
- expected output:
  - First `rg`: zero hits
  - Second `rg`: only documented-exempt utilities (TranslateService, MessageService, etc.)
  - Builds: exit code 0

## 8. Risk flags (anything that could break)

- **Pre-Wave-16 grandfathered services** in `libs/falcon/src/shared-data-access/` are exempt (`CommChannelPaymentService`, `OrderStatusService`, `AccountValidationService`, `LookupService`). Don't touch them.
- **A "pure utility" judgement can be wrong** — a service named `MessageService` could turn out to call `/api/messages/send`. Read the service source, not just the name.
- **Wrapper extraction needs a TS path alias** — forgetting the `tsconfig.base.json` update breaks the build silently across consumers.
- **Theme Studio standalone usage** is the canonical test for "library independence" — if a refactored skeleton can't render in Studio's preview without an HTTP backend, the refactor isn't done.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-005** — same layer concern (library-first), this rule is the architecture side
- **R-FE-006** — step 7 of the customization order is exactly the wrapper layer
- **R-NOOR-006** — admin-console hardening that also wants the skeleton+wrapper split
- **R-FE-012** — build green required for any wrapper extraction commit
