# falcon-confirm-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

## Business purpose
`[BRAIN-OUT]` The confirm-dialog is how Falcon asks a **simple, low-ceremony yes/no question with custom verbs** — "Approve / Reject", "Continue / Go back", "Activate / Deactivate". It is the small left-aligned-icon prompt that sits between the opinionated 4-variant `falcon-popup` (too prescriptive) and the fully-custom `falcon-dialog` (too low-level) `[CODE]` `OVERVIEW.md:8-10`. In business terms it commits a *binary operational decision* whose two outcomes do not map to the canonical error/delete/unsaved/save vocabulary.

`[CODE]` `falcon-confirm-dialog.tsx:1-3` — it is a "specialized composed pattern" (Architect §5.12.2) over `<falcon-dialog>`: it inherits the modal scaffolding and adds a fixed accept/reject footer. `[CODE]` `OVERVIEW.md:22` — it replaces the legacy PrimeNG `<p-confirmDialog>`.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Discard-unsaved-changes before leaving an edit | `[CODE]` `USAGE.md:105-109` (Wave 7 sweep — Add Client wizard `client-settings-step`) | The confirm-dialog is raised when the operator tries to exit a dirty Client-Settings step; the edits are abandoned only on Accept. |
| Non-canonical operational confirmations | `[BRAIN-OUT]` `DECISION.md:6-9` | Approve/Reject, Continue/Go-back, Activate/Deactivate prompts — decisions outside the 4 `falcon-popup` variants. |
| Severity must match action intent | `[CODE]` `falcon-confirm-dialog.tsx:45` (`severity` prop) | `severity` (`info`/`success`/`warning`/`danger`) is passed through to the underlying dialog to drive the accent — the business signals how grave the decision is. |

## Business constraints baked in
- `[CODE]` `falcon-confirm-dialog.tsx:85-95` — **every dismissal is a business "no".** The `handleReject` AND `handleDialogClose` paths both emit the SAME `falcon-confirm-reject` event. Backdrop click, Esc, close-X, and the Reject button are indistinguishable — the calling flow must treat all four as "operator declined". `[CODE]` `API.md:72` confirms this contract.
- `[CODE]` `falcon-confirm-dialog.tsx:39-40` — **default verbs are `OK` / `Cancel`.** Conventional and intentional `[BRAIN-OUT]` `DECISION.md:101-102` — do not change the defaults; a flow with non-default verbs passes `acceptLabel` / `rejectLabel` explicitly.
- `[CODE]` `falcon-confirm-dialog.tsx:124-139` — **the two footer buttons are fixed and not consumer-replaceable.** A flow needing a third button ("Save / Discard / Cancel") cannot use this component as-is `[CODE]` `GAPS_AND_UPGRADES.md:39-43` (P2 gap).
- `[CODE]` `falcon-confirm-dialog.tsx:79-83` — the dialog **self-closes on Accept** (`open = false` set before the event emits) — the confirmed business action runs *after* the dialog is gone.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard — Client Settings step | organization-hierarchy (admin-console) | Discard / exit-confirmation prompt for a dirty settings step `[CODE]` `USAGE.md:109` |
| Non-canonical operational confirms (recommended) | platform-wide | Approve/Reject, Continue/Go-back, Activate/Deactivate `[BRAIN-OUT]` `DECISION.md:6-9` |

`[CODE]` `OVERVIEW.md:44` + `USAGE.md:3` — the component is **under-leveraged**: exported but with only 1 production consumer as of the Wave 7 sweep. Most confirmation needs are met by `falcon-popup`'s 4 variants.

## Business gotchas
- `severity="danger"` is **expected** to make the Accept button red, but `[CODE]` `GAPS_AND_UPGRADES.md:79-81` flags the token wiring as unverified — a builder must not assume the danger tone reaches the button without checking.
- `[CODE]` `GAPS_AND_UPGRADES.md:65` — the **Reject button is rendered FIRST in DOM order**, Accept second. Keyboard Tab lands on Reject first. This may be a safety-by-default choice for destructive confirms, but it diverges from "primary action focused first" — a flow that wants Accept-first focus cannot get it today.
- The dialog has **no `loading` / async-accept state** `[CODE]` `GAPS_AND_UPGRADES.md:20-29` — a confirmed action that calls an API has no built-in spinner; the dialog vanishes and the flow must surface progress/failure itself.
- Do not use this for the 4 canonical flows `[CODE]` `USAGE.md:79` — a delete confirmation belongs in `falcon-popup` (`variant="delete"`), which carries the right copy and icon.

## Verification
🟡 CODE-DERIVED from `falcon-confirm-dialog.tsx` + dossier files. Single production consumer (Add Client `client-settings-step`) ✅ VERIFIED by Wave 7 consumer sweep (`USAGE.md:105-109`). Under-leveraged status ✅ VERIFIED (`DECISION.md:43`).
