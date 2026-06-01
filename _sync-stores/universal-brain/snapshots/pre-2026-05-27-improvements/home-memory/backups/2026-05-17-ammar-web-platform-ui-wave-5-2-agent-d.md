---
name: Session Backup - Wave 5.2 Agent D — Add Client flow wiring
description: Wired eager password-gen + Sending Credentials + Completion Success popups into Add Client wizard
type: project
agent: ammar-web-platform-ui
date: 2026-05-17
status: completed
originSessionId: 2a52bf8c-342e-453c-aa93-6da0e279c4b0
---
## What Was Done

Wave 5.2 / Agent D — per Wave 5 plan + user-locked decisions.

### 1. Eager password generation
- `AddClientStateSlice` now injects `UserService` (already had `generatePassword(level)` for Add User).
- New `effect()` in constructor fires `userApi.generatePassword(Normal)` on every false→true transition of `addClientOpen`.
- Result stored in `lastGeneratedPassword` signal; resets to '' on wizard close.
- Wizard's existing `(generatedPassword)` input + internal effect copies it into Step 5 `ownerPwd`.

### 2. Sending Credentials popup
- Wizard `(submit)` no longer POSTs directly. Now calls `state.openSendingCredentials(payload)`.
- Slice parks payload in `pendingSubmitPayload`, derives `sendingCredentialsOpen` computed.
- New `<falcon-angular-sending-credentials-dialog>` mounted in `org-hierarchy-page-menu.component.html`.
- Cancel → drops parked payload, keeps wizard. Send → fires `submitCreateAccount(payload, method)`.

### 3. deliveryMethod plumbing
- Added `CreateAccountDeliveryMethod = 'email'|'sms'|'both'` type to `wire-builders.ts`.
- `CreateAccountWireRequest` gained `deliveryMethod?: ... | null` field.
- `buildCreateAccountWireRequest(...)` accepts `deliveryMethod` as optional last arg (default null).
- `client.service.ts.createClientFull(wire)` already passes wire as-is; no signature change.

### 4. Completion Success popup
- New `<falcon-angular-completion-success-dialog>` mounted with `[autoDismissMs]=10000`.
- Opens via `completionSuccessOpen` signal on successful create-account.
- `(closed)` → `onSendCredentialsSuccessDismissed()` in menu component.
- Handler closes wizard via slice + selects new node by id from `lastCreatedClientId`.

### 5. Backend error wiring
- HTTP UI config 400 rule got `title: 'Bad request'` for consistency with `applicationError` rule.
- Backend's `errorMessages` flows through `extractInBodyErrorDetail` → dispatcher → toast subtitle.
- No code change needed in dispatcher (defaults already use `ctx.backendMessage`).

### 6. Models split for size cap
- `add-client-wizard/models/models.ts` was 431 lines. After adding `deliveryMethod` it grew to 445.
- Extracted wire-related interfaces + builders into new `wire-builders.ts` (182 lines).
- `models.ts` now 302 lines, re-exports from `wire-builders.ts` so all consumers' imports keep working.

### 7. Menu component split for size cap
- `org-hierarchy-page-menu.component.ts` would have grown to 433 lines.
- Extracted ~85 lines of DOM-patching effect body into `stencil-prop-patches.ts` (117 lines).
- Component ts is now 358 lines.

### Facade updates
- `HierarchyPageStateService` re-exports: `sendingCredentialsOpen`, `sendingCredentialsOwner`, `completionSuccessOpen`, `lastCreatedClientId`.
- New facade methods: `openSendingCredentials`, `onCancelSendingCredentials`, `onSendCredentials`, `onCompletionSuccessDismissed`.
- Old `onAddClientSubmit` removed (replaced by new flow).

## What Remains

Wave 5.3 — Agent E:
- Add unit tests for new state slice + new dialogs.
- Live E2E verify of all 4 outcomes (success / 400 / 5xx / network).
- Final screenshot evidence.

## Key Decisions

| Decision | Choice |
|---|---|
| Password generation timing | On wizard mount (eager, one call) |
| Delivery method API | Piggyback on createClientFull wire payload |
| Post-success navigation | Back to org-hierarchy with new client selected in tree |
| 400 toast title | Added `'Bad request'` |

## Files Changed

- `apps/admin-console/src/app/features/org-hierarchy-page/services/state/add-client-state.signals.ts` — rewritten to 240 lines
- `apps/admin-console/src/app/features/org-hierarchy-page/services/hierarchy-page-state.service.ts` — +18 lines (315)
- `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/models/models.ts` — trimmed to 302 lines
- `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/models/wire-builders.ts` — NEW (182 lines)
- `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/services/client.service.ts` — +12 lines (192)
- `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` — 358 lines
- `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` — +25 lines (330)
- `apps/admin-console/src/app/features/org-hierarchy-page/components/stencil-prop-patches.ts` — NEW (117 lines)
- `apps/host-shell/src/app/core/http-ui/falcon-http-ui.config.ts` — +3 lines (67)

## Context for Next Agent

Build hashes:
- admin-console: `643d0bf547ec0b9e`
- host-shell: `521b37b13c3b3830`
- management-console: GREEN (cached)

Vitest: `client.service.spec.ts` — 10/10 passing.

Lint on admin-console has 49 pre-existing errors all related to `webpack.prod.config.ts` boundary issues — NOT caused by Wave 5.2 changes.

The flow is now wired end-to-end:
1. Open Add Client → password endpoint fires once on mount
2. Drive to Step 5 → password field pre-filled (readonly + eye toggleable)
3. Click Save → Sending Credentials dialog appears with owner info
4. Pick method + Send Credentials → POST fires with deliveryMethod in payload
5. Success → Completion Success dialog with 10s timer
6. 400 → top-right toast with backend message (title='Bad request')
7. Click anywhere on Completion Success OR wait 10s → wizard closes + tree refreshes + new client selected
