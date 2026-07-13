# falcon-completion-success-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` This dialog is the **operator's "you're done" moment** at the end of a creation flow. In business terms: after the operator creates a new client / user and the system delivers credentials to that user, this branded confirmation tells them — unambiguously and with a celebratory illustration — that the work succeeded and the credentials are on their way. It is the visual full-stop on the Add Client / Add User wizards. `[CODE]` `falcon-completion-success-dialog.component.ts:1-3` — a pixel-parity port of the React `SuccessModal`, so the Angular platform matches the established product UX for this milestone.

## PRD / business rules touched

| Rule | Source | How this component surfaces it |
|---|---|---|
| New-user creation delivers credentials to the user | `[CODE]` default subtitle `'Credentials sent to the user'` (`:90`) + `falcon-wizard-finalization` flow header (`.ts:1-9`) | The dialog is shown only AFTER `submitFn()` succeeds (credentials sent) — it is the confirmation that the credential-delivery step completed. |
| Success acknowledgement must NOT read as an error / decision | `[CODE]` `falcon-wizard-finalization.component.html:14-23` (2026-05-24 addendum) | The Phase 3 orchestrator route rendered an OK/Cancel red-icon error popup — *wrong tone*; reverted to this branded ack. A business-visible correctness decision. |
| Operator should not be blocked after success | `[CODE]` `autoDismissMs` default 10s (`:93`) + button-less + click-anywhere dismiss | The ack auto-clears and never demands a click — the operator is free to move on. |

## Business constraints baked in

- `[CODE]` **Shown only on success, never on error** — the finalization flow routes the submit-ERROR to an orchestrator `business-error` toast (`falcon-wizard-finalization.component.ts` `showSubmitErrorToast()`), and opens THIS dialog only on success (`showCompletionAck()`, :248). A builder must NOT repurpose it for error states.
- `[CODE]` **Passive, not transactional** — there is no confirm button and no callback that commits anything. `(closed)` only signals the ack was dismissed (→ the finalization component emits `finalized`, e.g. to navigate away or reset the wizard). The *business commit* already happened (the credentials were sent) before the dialog opened.
- `[CODE]` **Copy is the caller's responsibility** — `title`/`subtitle` are pre-translated strings. The finalization component supplies channel-aware copy (`successTitle()` / `successSubtitle()`), so the same dialog can say "Credentials sent" for one flow and a different message for another. The dialog bakes in NO business copy of its own beyond the English defaults.
- `[CODE]` **Auto-dismiss is a UX courtesy, not a state transition** — when it auto-closes, `(closed)` fires exactly as if the user clicked. Downstream logic must treat auto-dismiss and manual dismiss identically (the spec confirms both paths fire `closed`).

## Business flows using this component

| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard finalization | org-hierarchy (admin) | `[CODE]` `add-client-wizard.signals.ts` → `<falcon-angular-wizard-finalization>` → this dialog is the success ack after the client + owner credentials are sent. |
| Add User wizard finalization | org-hierarchy (admin + mgmt) | `[CODE]` `add-user-state.signals.ts` → finalization → this dialog confirms the user was created + credentials delivered. |
| (general) any creation-finalization | any | Wherever `<falcon-angular-wizard-finalization>` is used with a `submitFn`, this dialog is the success terminus. |

## Business gotchas

- `[CODE]` **Click-anywhere dismisses** — a business user reaching to read or screenshot the confirmation will close it. Documented React-parity behavior (GAP G-CLICK-ANYWHERE); not a defect, but a support-question source ("the success popup vanished when I clicked it").
- `[CODE]` **Do not route through the orchestrator** — the temptation to "use the central message system for everything" is explicitly wrong here (the 2026-05-24 addendum). The orchestrator is for toasts + decision modals; this branded ack is intentionally bespoke.
- `[INFERRED]` **The dialog owns no business data** — it is a presentation terminus. The created entity (client/user) is persisted by Commerce/Identity *before* this opens; the dialog only reflects that it happened.
- `[CODE]` **Hardcoded English default copy** — a flow that forgets to pass translated `[title]`/`[subtitle]` ships "Completed successfully / Credentials sent to the user" in English regardless of locale (GAP G-I18N). Production callers pass translated strings, so this bites only new/careless integrations.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B18) — success-only mount, button-less passive ack, caller-supplied copy, auto-dismiss-equals-manual, and the deliberate non-orchestrator decision all confirmed in `falcon-completion-success-dialog.component.{ts,html}` + `falcon-wizard-finalization.component.{ts,html}`. Add Client / Add User flow attribution 🟡 CODE-DERIVED from the signals-file references.
