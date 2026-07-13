# falcon-unsaved-changes-host — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` This unit is the **platform's data-loss guard**. In business terms it protects an operator from accidentally throwing away unsaved edits — when they try to navigate away (router move, tab switch, tree-node select, in-page menu, wizard close) with dirty form state, it interrupts with a uniform "You have unsaved changes — discard & leave?" decision. `[CODE]` `falcon-unsaved-changes.service.ts:43-90` — `confirm()` returns an Observable that the leave path waits on; `true` discards + proceeds, `false` keeps the operator on the page. Centralizing it in one service means the prompt, copy, and behavior are **identical everywhere** — a consistency + trust property, not just a convenience.

## PRD / business rules touched

| Rule | Source | How this unit enforces / surfaces it |
|---|---|---|
| Navigating away mid-edit must warn before discarding | `[CODE]` `hierarchy-page-state.service.ts:205-260` `confirmDiscardIfDirty()` | THE single gate: router CanDeactivate / tab / tree / menu all call it; emits `true` only when not dirty, else prompts. |
| The unsaved prompt must be identical platform-wide | `[CODE]` `add-user-wizard.component.ts:395-397` ("same generic gate the Info panel edit flow uses … so the popup + message are identical everywhere") | All callers use the SAME `FalconUnsavedChangesService.confirm()`; copy varies only by the caller-supplied `bodyOverride`. |
| Discard must actually reset the dirty surface | `[CODE]` `hierarchy-page-state.service.ts:208-210` (".. on confirm, discards the dirty surface (resets its form + returns it to view mode) BEFORE emitting `true`") | On `true`, the gate resets the form to view mode before the navigation proceeds — no half-dirty state survives. |
| One gate across host-shell + every remote | `[CODE]` `app.ts:54-57` (MF singleton via `@falcon/ui-core`) | The service is a `providedIn:'root'` singleton shared by Module Federation, so a remote's wizard and the shell's router guard hit the same gate. |

## Business constraints baked in

- `[CODE]` **The prompt is action-required (blocking)** — `confirm()` routes to the orchestrator's `action-required` category (priority 1000, modal, blocking; `message-priorities.json:6`). It ALWAYS beats toasts and blocks the leave until the operator decides. A data-loss guard MUST block — this is the correct routing.
- `[CODE]` **Sequential, one-decision-at-a-time** — a new `confirm()` while one is open resolves the previous as `false` (stay). Business meaning: two competing leave attempts collapse to "stay on the most recent one"; the operator never gets two stacked discard prompts.
- `[CODE]` **`false` is the safe default** — cancel / backdrop / Esc / unsubscribe all resolve `false` (stay). The operator's edits are preserved unless they EXPLICITLY click Discard. No accidental data loss via stray dismissal.
- `[CODE]` **Copy is the caller's responsibility** — the service bakes in English defaults but every live caller passes translated, context-specific `bodyOverride` (info vs settings vs wizard). The service owns the *behavior*, the caller owns the *words*.
- `[CODE]` **`hintOverride` is silently dropped** (Phase 5) — a business-meaningful hint line that the pre-Phase-5 popup showed is now lost (GAP G-HINT-DROP). Callers passing `hintOverride` (org-hierarchy gate, both wizards) get no hint rendered.

## Business flows using this unit

| Flow | Page | Role of the unit in the flow |
|---|---|---|
| Leave Org Hierarchy page mid-edit | org-hierarchy (admin + mgmt) | `[CODE]` `confirmDiscardIfDirty()` guards router CanDeactivate / tab switch / tree select / menu — context-aware body (info/settings/wizard). |
| Close Add User wizard with edits | org-hierarchy | `[CODE]` `add-user-wizard.component.ts onExit()` — discard & close vs stay. |
| Close Add Client wizard with edits | org-hierarchy (admin) | `[CODE]` `add-client-wizard.component.ts` — wizard discard. |
| Leave Info-panel edit mode | org-hierarchy (hierarchy tab) | `[CODE]` `info-panel-state.signals.ts` — discard pending info edits. |
| Switch tree node while Add Client open | org-hierarchy (admin) | `[CODE]` `hierarchy-page-state.service.ts:505-514` — clicking a non-root node prompts discard. |

## Business gotchas

- `[CODE]` **The guard discards, it does not save** — `confirm()=true` means "throw away the edits"; there is no "save & leave" branch. A flow that wants save-on-leave must implement it separately.
- `[CODE]` **"The popup didn't show its hint"** — the `hintOverride` callers pass is dropped in Phase 5 (G-HINT-DROP). If product expects a hint line, fold it into `bodyOverride` or wire the orchestrator to carry a hint.
- `[INFERRED]` **The unit owns no business data + no dirty-state** — the *consumer* computes "is dirty" (e.g. `isAnyDirty()` / `confirmDiscardIfDirty`); this unit only opens the decision. "Why didn't it prompt?" is almost always the consumer's dirty flag, not this unit.
- `[CODE]` **Hardcoded English defaults** — a caller that forgets overrides ships English (G-I18N). Production callers always pass translated overrides.
- `[CODE]` **The host renders nothing** — restyling/relocating `<falcon-unsaved-changes-host>` has no business effect; the live modal is the orchestrator's popup.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B18) — blocking action-required routing, sequential one-decision semantics, safe-`false` default, discard-resets-form, and the dropped `hintOverride` all confirmed against `falcon-unsaved-changes.service.ts` + `hierarchy-page-state.service.ts` + `add-user-wizard.component.ts`. Flow attribution 🟡 CODE-DERIVED from the cited call-sites (user-confirmed working leave-guard per the org-hierarchy feature).
