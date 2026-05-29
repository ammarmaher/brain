# Wave 5 — Add Client End-to-End Polish + Architecture Refactor

**Date:** 2026-05-17
**Owner:** Ammar
**Scope:** Add Client wizard finalization, state-service architecture cleanup, new flow popups, validation hardening
**Source of truth (React):** `C:\Falcon\Source_of_truth_theme\React\Falcon-Taha2\admin\addclient.jsx` lines 680–767

---

## 1. User Requirements (verbatim, parsed)

| # | Requirement | Acceptance |
|---|---|---|
| **R1** | Each Add Client step gets its own `validations/validations.ts` folder mirroring Add User wizard | Folder + InjectionToken + provider per step; rules apply inline; Next disabled when invalid |
| **R2** | Split `hierarchy-page-state.service.ts` (1080 lines today). Max 300-400 lines per file. Shared helpers → `shared/`. Tab/component-wide signals → "signal status folder" with TS file | Final file sizes all ≤ 400 lines; orchestrator facade re-exports public API; build green; live behavior unchanged |
| **R3** | Step 5 password auto-filled from backend before user reaches Step 5 — Add Client must call the same `user/generate-password` endpoint Add User uses | On wizard mount (or Step 1 enter), POST `user/generate-password` once, store in state. Step 5 binds password from state. Operator can Next-Next-Next-Next without filling password manually |
| **R4** | Backend validation errors must show the actual backend message, not generic copy. Title from rule/category, body from backend `errorMessages` | Notification subtitle = backend message string (already wired in `extractInBodyErrorDetail`); title comes from rule's `title` field or category default |
| **R5** | Per-field inline validation across ALL steps. If invalid → red inline message + Next button disabled | Every step uses `*Error` computed signals + `isFormValid` blocks `valid.set(true)`; wizard's `forwardLockedFrom` already wired |
| **R6** | All errors → top-right toast (red, error intent, error message service) | `applicationError` rule + `4xx` rule + per-call overrides — already in place after Wave 4.2; just confirm visually |
| **R7** | NEW component: **Sending Credentials** popup. Title + subtitle + 3 delivery method cards (Email / SMS / Both) + AO summary (Name, Phone, Email) + Cancel/Send buttons | Pixel-parity to React source @ lines 680–749; uses Falcon library components (no native `<button>`/`<input>`); opens after final Save click |
| **R8** | NEW component: **Completion Successful** popup. No buttons. Click anywhere dismisses. Configurable timer (default 10s). On timer/dismiss → route to user-list with selected node | Pixel-parity to React source @ lines 751–767; emits `closed` output the wizard listens on to navigate |
| **R9** | Final flow: Save click → Sending Credentials popup → user picks delivery → calls Create Account API → if success → Completion Successful popup → 10s auto-close → user list; if 400 → top-right toast (business error); if other error → confirmation popup from existing service | Single state machine in the wizard or state service drives transitions; all 4 outcomes verifiable |
| **R10** | New custom components match Falcon library style. Use Falcon library components only. Add new statuses for customization if needed | Zero native HTML interactive elements; rolling into `libs/falcon-ui-core/.../falcon-confirm-dialog` extensions OR new `libs/falcon-ui-core/.../falcon-sending-credentials-dialog` + `falcon-completion-success-dialog` |
| **R11** | Performance: backend-validation hit count covered (debounced) | Account-name + username async pipelines already use `debounceTime(300)`; verify password-generation happens at MOST once per wizard session (cached by signal) |
| **R12** | Parallelize via multiple agents, multiple waves | Orchestrate with Agent tool, send parallel calls where independent |

---

## 2. Current State (verified by exploration)

### File sizes today

| File | Lines | Risk |
|---|---|---|
| `services/hierarchy-page-state.service.ts` | **1080** | ⚠️ ~3x over limit |
| `services/services.ts` | TBD | likely OK |
| `add-client-wizard.component.ts` | 349 | OK |
| `add-user-wizard.component.ts` | 436 | ⚠️ slightly over |
| `client-information-step.component.ts` | 243 | OK |
| `client-account-owner-step.component.ts` | 176 | OK |
| `add-client-wizard/models/models.ts` | 431 | ⚠️ over |
| `add-user-wizard/services/user.service.ts` | 201 | OK |
| `add-client-wizard/services/client.service.ts` | 178 | OK |

### Validation folders today

- **Add User wizard:** 3/3 steps have `validations/validations.ts` ✅
- **Add Client wizard:** 0/5 steps have it ❌

### Password-generation endpoint

- ✅ Endpoint exists: `POST user/generate-password` via Identity Gateway
- ✅ Service method: `UserService.generatePassword(level)` in add-user-wizard service
- ❌ Add Client wizard does NOT call this — Step 5 currently has empty `ownerPwd` until backend echoes it after submit (which it doesn't yet, hence empty)

### Popups today

- ✅ `FalconHttpErrorDialogService` for 4xx/5xx/network popups
- ✅ `FalconNotificationService` for toasts (top-right after Wave 4.2)
- ❌ No "Sending Credentials" component
- ❌ No "Completion Successful" component

---

## 3. Wave Decomposition

### Wave 5.1 — Foundation (3 parallel agents, ~25 min each)

Independent, no cross-dependencies.

#### Agent A — State Service Refactor (`ammar-web-platform-ui`)
**Goal:** Split `hierarchy-page-state.service.ts` (1080 lines) into ≤400-line modules.

**Output folder:**
```
services/
├── hierarchy-page-state.service.ts        # ≤150 lines — slim orchestrator facade
├── state/                                  # NEW: domain-scoped state slices
│   ├── tree-state.signals.ts               # tree + selection + structure-view + search
│   ├── users-state.signals.ts              # users list + pagination + view toggle
│   ├── add-client-state.signals.ts         # Add Client open/close + submit + new password
│   ├── add-user-state.signals.ts           # Add User open/close + submit
│   ├── node-drawer-state.signals.ts        # drawer mode/target/busy/selected
│   └── settings-state.signals.ts           # settings tab
├── shared/                                 # NEW: shared helpers (cross-state)
│   ├── http-status-inference.ts            # inferStatus, statusFromHttpError, collectErrorMessages
│   ├── account-settings.helpers.ts         # to/fromAccountSettings
│   └── pending-tree-selection.helpers.ts   # discard-on-retarget logic
└── services.ts                             # (existing, unchanged unless found big)
```

**Approach:**
- Each slice file exports an `Injectable({ providedIn: 'root' })` class OR plain provider factory exposing signals + actions
- Facade injects all slices, re-exports public API for backward compatibility (template doesn't change)
- Use `@Injectable({ providedIn: 'root' })` so multiple consumers share the same instance

**Acceptance:** Every file ≤ 400 lines; `nx build admin-console` GREEN; component behavior identical (smoke test).

#### Agent B — New Falcon Library Components (`ammar-web-platform-ui`)
**Goal:** Create 2 new dialog components in the Falcon library matching the React source.

**Output:**
```
libs/falcon-ui-core/src/angular-wrapper/components/
├── falcon-sending-credentials-dialog/
│   ├── falcon-sending-credentials-dialog.component.ts          # ~150 lines
│   ├── falcon-sending-credentials-dialog.component.html        # ~80 lines
│   ├── falcon-sending-credentials-dialog.types.ts              # interfaces
│   └── index.ts
└── falcon-completion-success-dialog/
    ├── falcon-completion-success-dialog.component.ts            # ~100 lines (auto-dismiss timer)
    ├── falcon-completion-success-dialog.component.html          # ~50 lines
    └── index.ts
```

**Sending Credentials Inputs:**
```typescript
@Input() open: boolean;
@Input() ownerName: string;
@Input() ownerPhone: string;
@Input() ownerEmail: string;
@Input() defaultDelivery: 'email' | 'sms' | 'both' = 'email';
@Output() cancel = new EventEmitter<void>();
@Output() send = new EventEmitter<'email' | 'sms' | 'both'>();
```

**Completion Success Inputs:**
```typescript
@Input() open: boolean;
@Input() title = 'Completed successfully';
@Input() subtitle = 'Credentials sent to the user';
@Input() autoDismissMs = 10_000;
@Output() closed = new EventEmitter<void>();
```

**Style:** Use Tailwind utility classes via existing falcon-popup pattern; SVG illustrations inlined (copied from React source). NO native `<button>`, `<input>`, `<dialog>` — use `<falcon-angular-button>` + Falcon library primitives.

**Acceptance:** Renders pixel-close to screenshots; Stencil + Angular wrapper barrels updated; `nx build admin-console + host-shell` GREEN.

#### Agent C — Per-Step Validations (`ammar-web-platform-ui`)
**Goal:** Create `validations/validations.ts` for all 5 Add Client steps.

**Output folder:**
```
add-client-wizard/
├── client-information-step/
│   └── validations/validations.ts          # accountName + financeId + classCat + classSub etc.
├── client-settings-step/
│   └── validations/validations.ts          # IPs + 3 limits
├── client-comm-channels-step/
│   └── validations/validations.ts          # row-level price validators
├── client-applications-step/
│   └── validations/validations.ts          # row-level price validators
└── client-account-owner-step/
    └── validations/validations.ts          # ownerFirst + ownerLast + ownerUser + nid + phone + email
```

**Pattern:** Mirror `add-user-wizard/user-personal-step/validations/validations.ts` — `InjectionToken<FalconFieldRules<T>>` + `*RulesProvider()` factory.

**Acceptance:** Each step component imports its rules via DI; `isFormValid` computed signal uses the rules; Next disabled when any field invalid.

### Wave 5.2 — Wiring (1 agent, sequential, ~20 min)

Depends on Waves 5.1 A + B + C.

#### Agent D — Wizard Flow Integration (`ammar-web-platform-ui`)
**Goal:** Wire the new password-generation, the new popups, and the corrected error routing into the Add Client wizard.

**Tasks:**

1. **Eager password generation**
   - In `AddClientWizardComponent`, on `ngOnInit` call `clientService.generatePassword('normal')`
   - Store result in state slice: `addClientState.generatedPassword.set(pwd)`
   - Step 5 binds `[ngModel]="state.generatedPassword()"` (readonly, eye still toggleable per Wave 4.2)
   - **Performance**: generate once per wizard mount. If user cancels + reopens, generate fresh.

2. **Replace direct submit with new flow**
   - Save click on Step 5 → opens `<falcon-sending-credentials-dialog>` with owner info
   - User picks delivery + clicks Send Credentials → calls `clientService.createClientFull(wire, { deliveryMethod })`
   - Send Credentials dialog closes
   - Branching:
     - **Success (200, isSuccessful:true)** → open `<falcon-completion-success-dialog>` → 10s auto-dismiss → navigate to user list filtered by new node
     - **400** → top-right toast via existing `applicationError` rule (no popup)
     - **Other 4xx/5xx/network** → existing `FalconHttpErrorDialogService` popup (no change)

3. **Backend error title/body wiring**
   - Confirm the toast for `applicationError` rule sets `title` from rule + `body` from backend `errorMessages` (extractor → subtitle)
   - If backend gives `errorCodes`, surface the matched i18n title; else generic "Validation error"

4. **Add `deliveryMethod` to the wire payload**
   - Either piggyback on `createClientFull` (extra optional param) OR fire a separate `send-credentials` call after success
   - Check Add Client playbook + brain registry for canonical answer

**Acceptance:**
- Manually drive wizard end-to-end
- Auto-password visible on Step 5
- Save fires Sending Credentials popup
- Send fires backend call
- Success → Completion Successful → 10s → navigate
- 400 → top-right toast with backend message in subtitle
- Build GREEN

### Wave 5.3 — Tests + Verification (1 agent, sequential, ~15 min)

#### Agent E — Test Coverage + Live Verify (`ammar-web-platform-ui`)
**Goal:** Add unit tests for new components + state slices, run all suites, drive live E2E.

**Tests to add:**

| Spec file | Coverage |
|---|---|
| `falcon-sending-credentials-dialog.component.spec.ts` | Renders 3 cards, selection state, emits cancel/send with the chosen method, closes on overlay click |
| `falcon-completion-success-dialog.component.spec.ts` | Auto-dismiss after configured ms, emits closed, clicking anywhere dismisses, X dismisses |
| `add-client-state.signals.spec.ts` | `generatedPassword` set/clear lifecycle, `addClientOpen` toggle |
| `tree-state.signals.spec.ts` | Selection + structure-view + search basics |
| `http-status-inference.spec.ts` | inferStatus + statusFromHttpError edge cases |

**Live verify:**
- Restart `nx serve host-shell` clean
- Drive wizard with spoofed success → confirm Completion popup + navigation
- Drive wizard with spoofed 400 → confirm top-right toast with backend message
- Drive wizard with spoofed 500 → confirm popup
- Final screenshot evidence in `Brain Outputs/reports/wave-5/`

---

## 4. Architectural Decisions Made Up-Front

| Decision | Choice | Rationale |
|---|---|---|
| State slices vs single service | Multiple `@Injectable({providedIn:'root'})` slices + thin facade | Keeps each file under 400 lines + matches Angular signal-first DI |
| Popup placement | NEW components in `libs/falcon-ui-core/src/angular-wrapper/components/falcon-{sending-credentials,completion-success}-dialog` | Library-first per Falcon doctrine; reusable across apps |
| Password generation timing | On wizard mount (ngOnInit) | One call per session; cached in state slice; user sees field already filled at Step 5 |
| Delivery method API contract | Add optional `deliveryMethod: 'email'\|'sms'\|'both'` to wire request | Backend playbook says CreateAccountRequest can carry it; falls back to 'email' if backend ignores |
| Error popup vs toast for backend errors | 400 → top-right toast (Wave 4.2 `applicationError` rule); 5xx/network → popup (existing default rules) | Already in place; no new code needed |
| Auto-dismiss timer for success popup | Default 10s, `@Input() autoDismissMs = 10_000` | Per user requirement; configurable for accessibility |
| Navigation after success | `router.navigate(['/admin-console/org-hierarchy-page'], { queryParams: { selectedNode: id } })` | Returns to caller path with selection |

---

## 5. Open Questions (need user confirmation before Wave 5.2)

These are the only decisions I can't make alone:

### Q1. **Password generation timing**
- Option A: On wizard mount (eager, 1 API call)
- Option B: On Step 1 → Step 2 transition (slightly lazier)
- Option C: On Step 4 → Step 5 transition (just-in-time)

### Q2. **Send Credentials API**
- Option A: Piggyback — pass `deliveryMethod` inside the existing `createClientFull` body
- Option B: Two-stage — `createClientFull` creates the account, then a separate `POST send-credentials` call from the Sending Credentials popup

### Q3. **Success popup auto-dismiss**
- Option A: 10s timer, then route to user list (per user)
- Option B: 10s timer, route AND open the new client's details immediately
- Option C: 10s timer, route to user list with new client pre-selected/highlighted

---

## 6. Out of scope (explicitly defer)

- Migrating Add User wizard to the new state-slice pattern (Add User keeps current shape; only Add Client refactors)
- Internationalizing the new popup copy (use English literals; i18n keys can be added later)
- Translating React SVG illustrations (use them as-is, copy-pasted)
- Backend changes (we assume `user/generate-password` works as-is)

---

## 7. Risk Register

| Risk | Mitigation |
|---|---|
| HMR breaks during state-service refactor | Build production after each agent finishes; smoke-test imports |
| Password endpoint requires auth headers not currently set | Reuse Add User's exact call pattern (Identity Gateway) |
| Popup z-index conflicts with stepper | Use Falcon `z-falcon-modal` token |
| 10s auto-dismiss conflicts with user reading speed | Make timer configurable + click-anywhere to dismiss |
| Visual parity to React source | Cross-reference at every step; ask user for approval after first render |

---

## 8. Estimated Wall-Clock

| Wave | Agents | Estimated time |
|---|---|---|
| 5.1 (parallel: A+B+C) | 3 | 25 min (limited by slowest) |
| 5.2 (sequential: D) | 1 | 20 min |
| 5.3 (sequential: E) | 1 | 15 min |
| **Total** | 5 agents | **~60 min wall** + 30 min live verify |
