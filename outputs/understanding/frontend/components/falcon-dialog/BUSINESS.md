# falcon-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-dialog` is the **substrate modal primitive** — a centered overlay that blocks the page and demands the operator's attention before they continue. In business terms it is the "stop and deal with this" surface: a focused work area lifted out of the page flow. It is rarely the *business answer* itself — it is the container that other, business-specific overlays are built on.

`[CODE]` `falcon-dialog.tsx:1-7` — the component owns backdrop, header/body/footer slots, focus trap, focus restore, and Esc/backdrop dismissal. It is presentational scaffolding, not a domain feature.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| No direct business rule | `[INFERRED]` | The dialog itself encodes no PRD rule — it is a layout primitive. Business rules live in the *content* projected into it (e.g. a confirm prompt, a credential form). |
| "Action-required flows use a canonical overlay" | `[BRAIN-OUT]` `OVERVIEW.md` — registry note | The dialog is **deprecated for new code**; the 4 canonical action flows (error / delete / unsaved / save) must use `<falcon-angular-popup>`, OK/Cancel prompts must use `<falcon-angular-confirm-dialog>`. This is a design-system governance rule, not a PRD rule. |

## Business constraints baked in
- `[BRAIN-OUT]` `OVERVIEW.md:24` **`@deprecated` for direct use** — the registry marks it deprecated; net-new code must not render `<falcon-angular-dialog>` directly. It survives only as the composition substrate for `falcon-angular-confirm-dialog` and as a slot-friendly host for bespoke modal bodies.
- `[CODE]` `falcon-dialog.tsx:48,132-138` **`dismissible=false` is a hard lock** — when `dismissible` is false, both Esc and backdrop click are suppressed regardless of `closeOnEsc` / `closeOnBackdrop`. Business meaning: a flow can force the operator to make an explicit choice (the × or a projected button) and forbid casual dismissal — useful for irreversible or in-flight operations.
- `[CODE]` `falcon-dialog.tsx:88-90` **`disabled=true` blocks programmatic opening** — `show()` is a no-op while disabled. Business meaning: a guard flag a parent can flip to prevent the dialog from being summoned under invalid conditions.
- `[INFERRED]` **No built-in decision buttons** — `falcon-confirm` / `falcon-cancel` events exist but no rendered button emits them (`[CODE]` `falcon-dialog.tsx` — only a close × is rendered). A flow that needs a "commit" decision must project its own footer buttons; the dialog will not encode the decision for you.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| OK / Cancel confirm prompts | (all) | Indirect — `<falcon-angular-confirm-dialog>` composes this as its shell. `[BRAIN-OUT]` `OVERVIEW.md:9`. |
| Credential delivery (legacy) | Add Client / Add User finalize | Historical — the legacy `send-credentials-popup` used `<falcon-angular-dialog>` as its shell. That component is now an ORPHAN (see `send-credentials-popup/BUSINESS.md`); the live successor `falcon-sending-credentials-dialog` does **not** compose `falcon-dialog`. |
| Bespoke custom modals | (rare) | Direct — only when a custom-shaped body genuinely does not fit the `popup` / `confirm-dialog` variants. `[BRAIN-OUT]` `USAGE.md:8`. |
| OTP dialog | host-shell | `[CODE]` `USAGE.md:79-82` — `apps/host-shell/.../shared-components/otp-dialog/otp-dialog.component.ts` references it. |

## Business gotchas
- `[BRAIN-OUT]` A dialog is **page-blocking** — it is the heaviest attention surface. Using it for a passive message (use `falcon-notification` / `falcon-toast`) or a hint (use `falcon-tooltip`) over-escalates the interaction and trains operators to dismiss modals reflexively.
- `[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:64-68` **`errorMessage` is a dead prop** — the input is accepted by both wrapper and Stencil source (`[CODE]` `falcon-dialog.tsx:52`) but is never rendered in the markup. A builder who binds `[errorMessage]` expecting an inline error banner gets nothing. Do not rely on it to surface a business validation failure.
- `[CODE]` `falcon-dialog.tsx:50,203-204` **`position="side-right"` is a trap** — it visually mimics a right-anchored drawer but lacks drawer edge-radius defaults. A side panel is a drawer's job; using the dialog for it produces a visually inconsistent result. Use `<falcon-angular-drawer position="right">`.
- `[INFERRED]` The dialog destroys its body on close (`[CODE]` `falcon-dialog.tsx:186` `render()` returns `null` when `!open`). Any unsaved form state inside is lost — lift business state to the parent before opening.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-dialog.tsx` + `falcon-dialog.component.ts` and the existing 6 dossier files. Deprecation status ✅ VERIFIED against `[BRAIN-OUT]` registry note. No PRD `BR-*` rule binds this primitive directly — it is layout scaffolding.
