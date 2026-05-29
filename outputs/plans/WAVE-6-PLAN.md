# Wave 6 — Polish, Architecture, Eager Loading

**Date:** 2026-05-17
**Owner:** Ammar
**Scope:** 7 fixes the user flagged after Wave 5 visual review

---

## 1. User Requirements

| # | Requirement | Acceptance |
|---|---|---|
| **R13** | All Add Client wizard form initial values must be **null** (no `'Government'`, no `'Account Owner'` defaults). Every signal/state starts empty | `emptyClientInfo()`, `emptyClientSettings()`, `emptyClientAccountOwner()` return null/empty fields. Step `isFormValid` reflects this on first render. |
| **R14** | After uploading any image, the form state holds `{ extension, fileBase64String }`. Always. Same for client picture AND owner picture | Photo uploader pipeline produces the object; wire builder reads it as-is (no more `null` for `profilePictureImageInfo` / `accountOwnerProfilePictureImageInfo`) |
| **R15** | `deliveryMethod` in the wire payload must be a NUMBER (enum) not a string | Use existing `DeliveryMethod` enum (`Email=1`, `Sms=2`, `Both=3`) from `libs/falcon/src/shared-types/lib/enums/globels.ts`. Sending Credentials dialog still emits `'email'|'sms'|'both'` for UX; state slice maps to enum int before POST |
| **R16** | Step 3 + 4 (Communication Channels + Applications): row inputs (priceType dropdown + priceValue) must show inline red invalid state when visible row missing required values. Stepper rail dot must paint red on Next click | Touch keys + computed signals; row-table consumes a `revealed` input from the step; step's `isFormValid` wired into wizard's stepperSteps |
| **R17** | The price-value `<falcon-angular-input-number>` in Step 3/4 must show a Saudi Riyal SVG icon on its left | Add `[leftIcon]` (or equivalent) input to `FalconAngularInputNumberComponent` (Angular wrapper + Stencil web component). Wire it in row-table column. |
| **R18** | All eager-loading APIs (`generate-password`, `list-commchannels`, `list-applications`, `lookup Country`, `lookup City`) fire ONCE on wizard mount in parallel. Steps consume cached results. Navigation between steps must NOT fire new API calls. | `forkJoin(...)` on wizard open. Each step reads from wizard-level signals exposing the cached data. |
| **R19** | Per-step `signals/` folder. Each Add Client step's signals live INSIDE that step's component folder. Wizard-wide state lives inside the wizard component folder, not in `services/state/` | Move `add-client-state.signals.ts` → `add-client-wizard/signals/add-client-wizard.signals.ts`. Each `<step>/signals/<step>.signals.ts` owns its form value + valid + dirty + revealed-errors. Page route still injects everything; facade re-exports unchanged public API. |

---

## 2. Locked Decisions (no user input needed)

| Decision | Choice | Rationale |
|---|---|---|
| `DeliveryMethod` enum values | `Email=1, Sms=2, Both=3` | Already exists in `libs/falcon/src/shared-types/lib/enums/globels.ts:97-101` |
| Photo data shape | `{ extension: string, fileBase64String: string }` | Matches backend wire shape (`profilePictureImageInfo` + `accountOwnerProfilePictureImageInfo`) |
| Photo uploader API change | Add `pictureChange` output emitting `{extension, fileBase64String}` alongside existing `fileSelected: File` + `photo` model (data-URL for preview). Backward compatible | Avoids breaking existing consumers |
| Eager loading | `forkJoin({ pwd, channels, apps, countries, cities })` on wizard mount (when `addClientOpen` flips false → true) | One round trip; cached in wizard signals; freed on close |
| State refactor scope | Add Client wizard ONLY. Don't move Add User signals (user didn't ask) | Limit blast radius |
| Saudi Riyal icon | Inline SVG copied from React source (if present) or standard SAR glyph | Match existing app iconography |

---

## 3. Wave Decomposition

### Wave 6.1 — Behavioral fixes (3 parallel agents, ~25 min)

#### Agent F — Null defaults + DeliveryMethod enum + Photo upload object format
**Files:**
- `add-client-wizard/models/models.ts` — make `empty*()` return null/empty; change `deliveryMethod` field to `DeliveryMethod | null`
- `add-client-wizard/models/wire-builders.ts` — propagate `DeliveryMethod` enum; populate `profilePictureImageInfo` + `accountOwnerProfilePictureImageInfo` from the form's photo objects
- `services/state/add-client-state.signals.ts` — map dialog's `'email'|'sms'|'both'` to `DeliveryMethod.Email|Sms|Both`
- `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.ts` — add `pictureChange = output<{extension:string; fileBase64String:string}>()` that emits parsed object on file pick; keep existing `photo` model + `fileSelected` for backward compat
- All wizard step templates that use the uploader — bind `(pictureChange)` to update form state's image object

**Acceptance:** Submit a real client → wire payload shows `deliveryMethod: 1` (or 2 or 3), `info.profilePictureImageInfo: { extension: 'png', fileBase64String: '...' }`, etc.

#### Agent G — Row-table validation visual + Falcon input-number icon
**Files:**
- `libs/falcon-ui-core/src/components/falcon-input-number-tw/falcon-input-number-tw.tsx` — add `iconLeft?: string` prop (slot OR SVG-string prop)
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input-number/falcon-input-number.component.{ts,html}` — pass `iconLeft` through. Add `[iconLeftSvg]` Angular input that accepts an SVG-string OR Tailwind icon class
- `add-client-wizard/client-service-row-table/client-service-row-table.component.{ts,html}` — apply `state="error"` to dropdown + input-number when invalid AND revealed; wire `revealed` input that the step passes down on Next click
- `add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.{ts,html}` + `client-applications-step/client-applications-step.component.{ts,html}` — implement `revealErrors()` to set `revealed=true`, propagate to row-table; update `isFormValid` to use row-table's validity
- `add-client-wizard/client-service-row-table/client-service-row-table.component.html` — add Riyal SVG icon to the price-value `<falcon-angular-input-number>`

**Acceptance:**
- Toggle a row visible, leave priceType empty, click Next → step rail paints red AND that row's dropdown is red-bordered
- Set priceType but leave priceValue empty/negative, click Next → row's input-number is red-bordered
- All visible-row inputs with valid values render normally

#### Agent H — Eager loading on wizard mount
**Files:**
- `add-client-wizard/services/client.service.ts` — keep `listCommunicationChannels()` + `listApplications()`. Maybe add a single `prefetchWizardData()` that forks them all
- `services/state/add-client-state.signals.ts` — add eager signals: `eagerCommChannels`, `eagerApps`, `eagerCountries`, `eagerCities`. On `addClientOpen.set(true)`, fire `forkJoin(...)`, populate all 5 signals. On close, clear.
- `add-client-wizard/client-information-step/client-information-step.component.ts` — REMOVE the inline `forkJoin({countries, cities})` constructor call. Instead `input()` country + city options from state.
- `add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.ts` — REMOVE its own list call. Read rows from state.
- `add-client-wizard/client-applications-step/client-applications-step.component.ts` — same.
- `add-client-wizard/add-client-wizard.component.ts` + `.html` — pass eager data as inputs to children OR rely on shared state slice (preferred — DRY)

**Acceptance:**
- Open wizard → DevTools Network shows 5 calls fired in parallel at t=0: `generate-password`, `commerce/CommunicationChannel`, `commerce/Application`, `commerce/Lookup/<countryId>`, `commerce/Lookup/<cityId>`
- Navigate Step 1 → 2 → 3 → 4 → 5: **zero new XHR**
- Close + reopen wizard → 5 calls fire again

### Wave 6.2 — Architecture refactor (1 sequential agent, ~25 min)

#### Agent I — Per-step signals folder + move wizard state into wizard folder

**Move FROM:**
- `services/state/add-client-state.signals.ts`

**Move TO:**
- `add-client-wizard/signals/add-client-wizard.signals.ts` — wizard-wide state (open/close, pending submit, eager data, password, dialogs, wizardBackendErrors)
- `add-client-wizard/client-information-step/signals/client-information-step.signals.ts` — `step1Value`, `step1Valid`, `step1Dirty`, `revealed`
- `add-client-wizard/client-settings-step/signals/client-settings-step.signals.ts`
- `add-client-wizard/client-comm-channels-step/signals/client-comm-channels-step.signals.ts`
- `add-client-wizard/client-applications-step/signals/client-applications-step.signals.ts`
- `add-client-wizard/client-account-owner-step/signals/client-account-owner-step.signals.ts`

**Pattern (matches the per-step validations pattern):**
- Each step's signals file exports an `@Injectable()` class OR a provider function returning the signals bundle
- Step component injects its own signals service
- Wizard component injects the wizard-wide signals service AND has access to step signals via `viewChild()` refs (already in place)

**Provider wiring:**
- Page route still imports the slice providers via the existing `HIERARCHY_PAGE_STATE_PROVIDERS` aggregate
- The Add Client wizard signals service moves out of that aggregate into a new `ADD_CLIENT_WIZARD_PROVIDERS` array exported from `add-client-wizard/signals/index.ts`
- `org-hierarchy-page.routes.ts` adds the new array to its `providers` list

**Acceptance:**
- `services/state/` directory no longer contains `add-client-state.signals.ts`
- Each step folder has its own `signals/` folder
- Build green
- Facade `HierarchyPageStateService` still exposes the same public API surface (just delegates differently)

---

## 4. File-Size Discipline

Every new/touched file ≤ 400 lines. If a file would exceed, split it.

---

## 5. Out of Scope

- Moving `tree-state.signals.ts`, `users-state.signals.ts`, etc. to per-component folders (user didn't request these — defer)
- Translating new copy
- Add User wizard signals reorg (user didn't ask)
- Tests (user explicitly said "I will test")
- Live E2E from agents (user said the same)

---

## 6. Estimated Wall-Clock

| Wave | Agents | Time |
|---|---|---|
| 6.1 (parallel F+G+H) | 3 | 25 min |
| 6.2 (sequential I) | 1 | 25 min |
| **Total** | 4 agents | **~50 min wall** |

After Wave 6.2 → I report back. User runs the app and reports findings.
