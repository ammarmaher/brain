# falcon-alert-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` The alert-dialog is how Falcon makes a user **stop and read before a high-consequence decision**, or **acknowledge an important message**. In business terms it is the platform's icon-led "are you sure?" gate (money / data-loss / irreversible) AND the surface for system-issued advisories (an error list, a configuration-locked notice). It deliberately slows the user: a 56px centered severity icon, a heavy title, a narrow centered subtitle, and a 2-button footer. `[CODE]` falcon-alert-dialog.tsx:104-131 — severity drives the icon glyph; `[CODE]` :72-82 — Confirm and Cancel are distinct events so the flow branches on the decision.

It is one of TWO live confirm substrates (the other is `<falcon-angular-popup>`). The imperative `FalconConfirmService` renders the popup; alert-dialog is the substrate that **`ErrorDialogService`** and the **message-orchestrator** render for acknowledgements + error lists.

## PRD / business rules touched

| Rule | Source | How this component surfaces it |
|---|---|---|
| Surface backend error messages as a readable acknowledgement | `[CODE]` falcon-error-dialog-host.component.html:4-25 (`ErrorDialogService` → alert-dialog with a `<ul>` of messages, `hideCancel`) | The platform's error-list modal IS an alert-dialog: title + subtitle + a bullet list of `errorMessages()`, single OK (`hideCancel`). |
| Configuration-locked acknowledgement | `[CODE]` falcon-modal-adapter.component.ts:75-85 (`configuration-required` without `actionCallback` → alert-dialog, `severity="warning"`, `hideCancel`) | A "read this, acknowledge" config notice renders as a single-CTA alert-dialog. |
| Insufficient-balance funding decision (SoT origin) | `[BRAIN-OUT]` derived from React `InsufficientBalanceModal` | The component's centered-icon + priority-list + Proceed/Cancel layout was built for the Add-Client payment funding decision. |
| Destructive operations require explicit acknowledgement | `[CODE]` USAGE.md destructive template (`severity="danger"` + `[closeOnBackdrop]="false"`) | A delete confirm can't be dismissed by accidental backdrop click. |

## Business constraints baked in

- `[CODE]` falcon-alert-dialog.tsx:134 — **severity is a business signal, not decoration.** `danger`/`warning` → `role="alertdialog"` (assertive); `info`/`success` → `role="dialog"`. Reserve `danger` for genuinely irreversible operations (overuse trains users to ignore red).
- `[CODE]` falcon-alert-dialog.tsx:161-178 — **at least one action button must remain.** Do NOT set both `hideConfirm` and `hideCancel` or the user is trapped.
- `[CODE]` falcon-alert-dialog.tsx:95-101 — **every dismissal is a business "no".** Backdrop / Esc / close-X / Cancel all emit `falcon-alert-cancel` (with a `reason`); only Confirm emits `falcon-alert-confirm`. Treat all four cancel reasons as "operator declined".
- `[CODE]` falcon-alert-dialog.tsx:89-93 — **closes optimistically on Confirm** (`open=false` set before emit) — a confirmed action that fails async surfaces via the global error pipeline, not back inside the dialog (no `confirmLoading` — GAP).
- `[INFERRED]` **alert-dialog is BEFORE the action, never after** — post-action "saved!" feedback belongs to a toast.

## Business flows using this component

| Flow | Page / app | Role of the component |
|---|---|---|
| Backend error-message list | platform-wide (`ErrorDialogService`) | Render a bullet list of error messages as a single-OK acknowledgement. |
| Configuration-locked notice | platform-wide (orchestrator) | Single-CTA "acknowledge this config state" modal. |
| Insufficient-balance funding decision (SoT) | Add Client → Payment | Prioritise wallet channels, then Proceed/Cancel the payment. |
| Destructive deletion (recommended) | platform-wide | `severity="danger"` "this cannot be undone" gate. |

> ⚠️ **Drift correction:** the prior dossier listed `settings-tab` + Add-Client `client-settings-step` as live alert-dialog flows. `[CODE]` Those are now **superseded** — `settings-tab.component.ts:85-89` comments that it *replaced* its inline alert-dialog with an orchestrator confirm flow, and `client-settings-step` no longer mounts alert-dialog (grep clean). The live flows are the `ErrorDialogService` + orchestrator paths above.

## Business gotchas

- `severity="warning"` and `severity="danger"` share the SAME red icon AND the SAME teal Confirm color (`[CODE]` falcon-alert-dialog.css:32-37, 126) — the only behavioural difference is the ARIA role. Do NOT assume `danger` produces a red Confirm button; it does not.
- The body is the ONLY consumer-projected region (`[CODE]` tsx:156-158) — header + footer are component-rendered. A flow needing a custom header (a badge above the title) is on the wrong component → drop to `<falcon-angular-dialog>` (exactly what `wb-confirm-save-modal` did, documenting the reason — `[CODE]` wb-confirm-save-modal.component.ts:17-23).
- `title`/`subtitle` are plain-text — passing HTML renders literal markup. Rich content goes in the body slot.
- Per-instance `--falcon-alert-dialog-*` token overrides do NOT reach the `-tw` (default) render path's Confirm/icon/cancel colors (they read theme vars directly) — a builder retinting via `style="--falcon-alert-dialog-confirm-bg"` will see no effect on the live `-tw` render (`[BRAIN-OUT]` TOKENS.md parity break; GAP).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15). Live business flows re-anchored to the `ErrorDialogService` error-list (falcon-error-dialog-host.component.html) + orchestrator config-acknowledgement (falcon-modal-adapter.component.ts) — the prior dossier's `settings-tab`/`client-settings-step` flows are superseded. severity-shares-icon + at-least-one-button + optimistic-close + `-tw` token-parity gotchas re-confirmed in source.
