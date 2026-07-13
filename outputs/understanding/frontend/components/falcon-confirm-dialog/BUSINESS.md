# falcon-confirm-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` As-designed, the confirm-dialog was Falcon's small "simple yes/no with custom verbs" prompt — "Approve / Reject", "Continue / Go back", "Activate / Deactivate" — sitting between the opinionated 4-variant `<falcon-popup>` (too prescriptive) and the fully-custom `<falcon-dialog>` (too low-level). `[CODE]` falcon-confirm-dialog.tsx:1-3 — Architect §5.12.2 "specialized composed pattern" over `<falcon-dialog>`.

> ⚠️ **In practice this component carries NO business value today** — it is dormant (Angular wrapper commented out) with zero consumers (`[CODE]` grep 2026-06-03). The binary-confirm *business need* it was built for is now served entirely by `FalconConfirmService.confirm()` → `<falcon-angular-popup variant="error">` (`[CODE]` falcon-confirm.service.ts:91-105). The business facts below describe the **need the component was meant to meet**, not a live flow.

## PRD / business rules touched

| Rule | Source | How the confirm need is enforced today |
|---|---|---|
| Discard-unsaved-changes before leaving an edit | `[CODE]` add-client-wizard.component.ts:361 / add-user-wizard.component.ts:404 (`FalconConfirmService.confirm({...})`) | The Add Client / Add User wizards raise a discard prompt via `FalconConfirmService` — **not** via this confirm-dialog. The edits are abandoned only on `accepted === true`. |
| Delete a contact group / member | `[CODE]` contact-groups-list.component.ts:382, contact-group-detail.component.ts:346 | `window.confirm` was replaced by `FalconConfirmService.confirm()` (Wave 15, `[CODE]` comment :379/:343) — the platform-canonical confirm modal. |
| Non-canonical operational confirmations | `[BRAIN-OUT]` DECISION.md | Approve/Reject, Continue/Go-back style decisions — handled by `FalconConfirmService` (popup) where they don't fit a `<falcon-popup>` variant. |

## Business constraints baked in (as-designed)

- `[CODE]` falcon-confirm-dialog.tsx:85-95 — **every dismissal is a business "no".** `handleReject` AND `handleDialogClose` emit the SAME `falcon-confirm-reject`. Backdrop / Esc / close-X / Reject button are indistinguishable — the caller must treat all four as "operator declined". (This same all-dismissals-are-cancel semantic IS preserved in the live `FalconConfirmService`: `cancelCallback` resolves `Observable<boolean>` as `false` for ×/ESC/backdrop — `[CODE]` falcon-confirm.service.ts:98-104.)
- `[CODE]` falcon-confirm-dialog.tsx:39-40 — **default verbs are `OK` / `Cancel`.** Conventional; non-default verbs pass `acceptLabel`/`rejectLabel` explicitly.
- `[CODE]` falcon-confirm-dialog.tsx:124-139 — **the two footer buttons are fixed.** A "Save / Discard / Cancel" 3-way decision cannot use this component as-is.
- `[CODE]` falcon-confirm-dialog.tsx:79-83 — the dialog **self-closes on Accept** (`open = false` set before the event emits) — the confirmed action runs *after* the dialog is gone, with no built-in busy state.

## Business flows using this component

| Flow | Page | Role |
|---|---|---|
| _(none live)_ | — | The component has zero render consumers. All confirm flows route through `FalconConfirmService`. |

`[CODE]` The live confirm callers (for reference — they use the SERVICE, not this component): Add Client / Add User wizards (admin + mgmt), org-hierarchy state services (admin + mgmt), contact-groups list + detail (mgmt), do-payment-priority-popup (host-shell), user-details-page (libs/falcon).

## Business gotchas

- A builder who finds this component in the library and tries to use it for a confirm will hit a compile error (wrapper not exported) — the correct tool is `FalconConfirmService`. Do not "fix" the dormant wrapper to make it usable; that re-introduces a third overlapping confirm path (GAP G1).
- `severity="danger"` is **expected** to make the Accept button red, but in the `-tw` twin the accept button reads `--falcon-teal-700` regardless of severity (`[CODE]` tw.tsx:98) — the danger tone does NOT reach the `-tw` accept button (`[BRAIN-OUT]` TOKENS.md static-style risks). The live popup path applies the correct error styling instead.
- The dialog has **no `loading` / async-accept state** — a confirmed action that calls an API has no built-in spinner; the global app loader / HTTP-error pipeline surfaces progress and failure (the live `FalconConfirmService`→popup path benefits from the same global pipeline).
- Do not use this for the 4 canonical flows — a delete confirmation belongs in `<falcon-popup variant="delete">`.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B15) from `falcon-confirm-dialog.tsx` + the live `FalconConfirmService` callers. Drift corrected vs prior dossier: the "Add Client client-settings-step uses this component" claim is now stale (that flow uses `FalconConfirmService`); business value reframed as superseded. All-dismissals-are-cancel + fixed-2-button + self-close-on-accept ✅ re-verified in source.
