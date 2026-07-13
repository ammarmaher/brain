# falcon-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-dialog` is the **substrate modal primitive** — a centered overlay that blocks the page and demands the operator's attention before they continue. In business terms it is the "stop and deal with this" surface: a focused work area lifted out of the page flow. It is rarely the *business answer* itself — it is the container that other, business-specific overlays are built on.

`[CODE]` `falcon-dialog.tsx:1-7` — the component owns backdrop, header/body/footer slots, focus trap, focus restore, and Esc/backdrop dismissal. It is presentational scaffolding, not a domain feature.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| No direct business rule | `[INFERRED]` | The dialog itself encodes no PRD `BR-*` rule — it is a layout primitive. Business rules live in the *content* projected into it (the share form, the confirm-save body). |
| "Action-required flows use a canonical overlay" | `[BRAIN-OUT]` registry note (OVERVIEW.md) | The dialog is **deprecated for new code**; the 4 canonical action flows must use `<falcon-angular-popup>`, OK/Cancel prompts must use `<falcon-angular-confirm-dialog>`. A design-system governance rule, not a PRD rule. |
| Share-a-contact-group is a multi-field side task | `[CODE]` share-dialog.component.html:7-15 | The contact-groups Share dialog uses `falcon-angular-dialog` because the body (AllUsers toggle + user multiselect + status badges + error banner) is genuinely bespoke — no `popup` variant fits. This is the textbook legitimate direct use. |

## Business constraints baked in
- `[BRAIN-OUT]` **`@deprecated` for direct use** — net-new code must not render `<falcon-angular-dialog>` directly unless the body is bespoke. It survives as the composition substrate (`falcon-angular-confirm-dialog`) and a slot-friendly host for custom modal bodies. `[CODE]` Note the deprecation is **convention-only** — there is no source `@deprecated`/warning (GAP G-DEP), so nothing stops accidental reach-for-it.
- `[CODE]` `falcon-dialog.tsx:132,123` **`dismissible=false` is a hard lock** — when false, both Esc and backdrop click are suppressed regardless of `closeOnEsc`/`closeOnBackdrop`. Business meaning: a flow can force the operator to make an explicit choice (the × or a projected button) and forbid casual dismissal — useful for irreversible or in-flight operations. `[CODE]` The contact-groups dialog achieves the same effect granularly by binding `[closable]`/`[closeOnBackdrop]`/`[closeOnEsc]` to `!submitting()` (share-dialog.component.html:11-13) — no dismissal while a save is in flight.
- `[CODE]` `falcon-dialog.tsx:88` **`disabled=true` blocks programmatic opening** — `show()` is a no-op while disabled. A guard flag a parent can flip to prevent the dialog from being summoned under invalid conditions.
- `[CODE]` **No built-in decision buttons** — `falcon-confirm`/`falcon-cancel` events exist but no rendered button emits them (only a close × is rendered). A flow that needs a "commit" decision must project its own footer buttons; the dialog will not encode the decision.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Share a contact group | management-console / contact-groups | `[CODE]` share-dialog.component.html:7 — bespoke share form (multiselect + AllUsers mutex); dismissal locked during submit. |
| Confirm save (wallet) | admin-console / new-wallet-balance | `[CODE]` wb-confirm-save-modal.component.ts — confirm-before-commit shell composing the dialog. |
| Flow-type selection (templates) | both consoles / templates-page | `[CODE]` flow-type-modal.component.ts — pick a message-flow type inside a custom modal body. |
| OK / Cancel confirm prompts | (all) | Indirect — `<falcon-angular-confirm-dialog>` composes this as its shell (per registry; not re-verified 2026-06-03). |

## Business gotchas
- `[BRAIN-OUT]` A dialog is **page-blocking** — the heaviest attention surface. Using it for a passive message (use `notification`/`toast`) or a hint (use `tooltip`) over-escalates the interaction and trains operators to dismiss modals reflexively.
- `[CODE]` `falcon-dialog.tsx:52` **`errorMessage` is a dead prop** — accepted by wrapper + Stencil but never rendered. A builder who binds `[errorMessage]` expecting an inline error banner gets nothing (GAP G-ERR). The contact-groups dialog correctly renders its own error banner in the body slot instead.
- `[CODE]` `falcon-dialog.tsx:50,194,203` **`position="side-right"` is a trap** — it visually mimics a right-anchored drawer but lacks drawer edge-radius defaults. A side panel is the drawer's job. Use `<falcon-angular-drawer position="right">`.
- `[INFERRED]` The dialog destroys its body on close (`[CODE]` `falcon-dialog.tsx:186` `render()` returns `null` when `!open`). Any unsaved form state inside is lost — lift business state to the parent before opening.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B14). `dismissible` lock (tsx:132), `disabled` no-op `show()` (tsx:88), dead `errorMessage` (tsx:52), `side-right` trap, body-destroy-on-close (tsx:186) all re-confirmed in live source. ✅ Contact-groups Share dialog is the user-facing legitimate-direct-use business flow (CODE-cited). No PRD `BR-*` rule binds this primitive — layout scaffolding. Deprecation ✅ `[BRAIN-OUT]` registry (convention-only — no source annotation).
