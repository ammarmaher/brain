---
name: Add User Wizard Submit Loader
description: Wave 12 — in-flight loader on Add User wizard Finish button + Cancel/Back lockout; success toast already wired top-right.
type: project
originSessionId: 3c6eb4d3-1acd-410f-88fc-0e249d20b4a6
---
🟢 LANDED 2026-05-17 (Wave 12). `nx build admin-console` GREEN `69d34ea2382b46c2`/17.81s.

**User ask:** "After adding, the user should show the loader. When the response is back, the loader should not be shown. Also, it should show, at the top right, the business messages that say the user added successfully."

**Diagnosis:**
- [CODE] `apps/host-shell/src/app/app.ts:24` — `<falcon-angular-message-host position="top-right">` already mounted at host root
- [CODE] `add-user-state.signals.ts:66-72` — success branch already calls `FalconMessageService.add({ severity:'success', summary:hierarchy.addUser.success.title, detail:hierarchy.addUser.success.detail, life:12000 })`
- [CODE] `en.json` + `ar.json` — `hierarchy.addUser.success.{title,detail}` already present
- ✅ Top-right success toast was already wired end-to-end. Only the in-flight loader was missing.

**Delta (4 files):**
1. `services/state/add-user-state.signals.ts` — added `submitting = signal<boolean>(false)`; wrapped `createUser` pipe with `tap(start)` + RxJS `finalize(() => submitting.set(false))` so it resets on success AND every error/catch branch (catchError-converted httpFailure included)
2. `services/hierarchy-page-state.service.ts` — re-exported as `addUserSubmitting = this.addUserSlice.submitting` through the facade
3. `components/wizard-components/add-user-wizard/add-user-wizard.component.ts` — added `submitting = input<boolean>(false)`
4. `components/wizard-components/add-user-wizard/add-user-wizard.component.html` — Finish button: `[loading]="submitting()"` (renders Stencil spinner + aria-busy) + `[disabled]="submitting()"`; Cancel + Back: `[disabled]="submitting()"`
5. `components/org-hierarchy-page-menu.component.html` — piped `[submitting]="state.addUserSubmitting()"` into `<app-add-user-wizard>`

**Why `[loading]` works:** [CODE] `libs/falcon-ui-core/src/components/falcon-button/falcon-button.tsx:36` exposes `@Prop({ reflect: true }) loading = false` which renders an inline SVG spinner, sets `aria-busy="true"`, sets `disabled`, and dims label opacity. The Angular wrapper at [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/falcon-button.component.ts:36` declares `@Input() loading = false` which forwards directly.

**Why Cancel/Back lockout matters:** [MEMORY] `project_add_client_wizard_mastery_2026_05_17.md` flagged "Sending Credentials/IP-delete parked-state on close" as a known bug class — a partial Kafka failure where Account created but AO user fails leaves orphaned state if the user dismisses mid-request. Locking dismissal during the in-flight window prevents that.

**Why `finalize` (not subscribe.complete):** the `next` handler returns inside both the success and validation-failure branches (line 51 + 61 of add-user-state.signals.ts); the `error` handler fires only for un-caught throws. `finalize` runs on success AND error AND complete — single-line guarantee that `submitting()` flips back regardless of which branch terminates.

**Trigger to revisit:** `add user loader` / `submit in-flight wizard` / any work on the Add User submit pipeline.
