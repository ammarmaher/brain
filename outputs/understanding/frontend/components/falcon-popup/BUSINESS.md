# falcon-popup — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

## Business purpose
`[BRAIN-OUT]` The popup is Falcon's **action-required modal for the four decisions that recur on every page**: an action failed (`error`), a record is about to be destroyed (`delete`), the user is leaving with unsaved work (`unsaved`), or edits are about to go live (`save`). `[CODE]` `falcon-popup.component.ts:37-82` — each variant ships pre-decided business copy, intent colour, icon, and confirm tone. Picking a variant *is* declaring the business decision; the operator only chooses confirm or cancel.

It is the most-adopted overlay in the Falcon UI — `[CODE]` `USAGE.md:141-153` (Wave 7 sweep) — used by the Add User and Add Client wizards in both consoles, the org-hierarchy page menu, the applications table, and the OTP dialog.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Discard-unsaved-changes before navigating away from a wizard | `[CODE]` `falcon-popup.component.ts:60-70` (`unsaved` variant) + `USAGE.md:24-37` | `variant="unsaved"` fires before a wizard step navigation — "Stay on page" keeps the edits, "Discard & leave" abandons them. Used by both Add User and Add Client wizards. |
| Destructive deletion requires explicit acknowledgement | `[CODE]` `falcon-popup.component.ts:49-59` (`delete` variant) + `USAGE.md:5-22` | `variant="delete"` with `[name]` interpolated into the body: `"You're about to permanently delete \"<name>\". This action cannot be undone."` |
| Publish/save commits edits to the live record visible to other admins | `[CODE]` `falcon-popup.component.ts:71-81` (`save` variant) | `variant="save"` confirms a publish; `[hintOverride]` lets the flow show a dynamic change summary ("3 fields changed · 1 permission updated"). |
| Failed actions surface a retryable error, not a silent failure | `[CODE]` `falcon-popup.component.ts:38-48` (`error` variant) | `variant="error"` with confirm label "Try again" — the canonical surface for API failures via `FalconHttpErrorDialogService`. |

## Business constraints baked in
- `[CODE]` `falcon-popup.component.ts:60-69` — **the `unsaved` variant's confirm button is RED** (`confirmTone: 'danger'`) even though it is the "confirm" action. Business reasoning: "Discard & leave" *destroys* unsaved work, so it is styled destructive `[CODE]` `GAPS_AND_UPGRADES.md:112-113`. A builder must not "fix" this to a primary tone.
- `[CODE]` `falcon-popup.component.ts:37` — **the 4 variants are a closed set.** `VARIANTS` is `Record<FalconPopupVariant, VariantContent>`; a 5th decision type (`archive`, `restore`) cannot be added by configuration — it needs a source change `[CODE]` `GAPS_AND_UPGRADES.md:36-43`. For non-canonical decisions the platform rule is: use `falcon-confirm-dialog`.
- `[CODE]` `falcon-popup.component.ts:273-275` — **empty-string overrides are treated as "no override".** `pick()` falls back to the variant default when an override `.trim()` is empty. This is a deliberate guard so a `TranslatePipe` returning the key transiently during i18n load does not blank the popup `[CODE]` `:269-272`.
- `[CODE]` `falcon-popup.component.ts:53` — **`[name]` interpolation is `delete`-variant only.** The other three variants ignore `name`.
- `[CODE]` `falcon-popup.component.ts:322-339` — backdrop click and Esc both emit `cancel` — every dismissal is a business "no".

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add User wizard | organization-hierarchy (admin + management consoles) | `unsaved` discard-confirmation on step exit; `delete` confirmation `[CODE]` `USAGE.md:144,149` |
| Add Client wizard | organization-hierarchy (admin + management consoles) | `unsaved` discard-confirmation on wizard exit `[CODE]` `USAGE.md:143,148` |
| Org-hierarchy page menu | organization-hierarchy (admin-console) | `delete` confirmation for a node/row action `[CODE]` `USAGE.md:145` |
| Applications table | org-hierarchy applications tab | confirmation for an applications-table row action `[CODE]` `USAGE.md:146-147` |
| OTP dialog | host-shell shared-components | `error` retry surface inside the OTP flow `[CODE]` `USAGE.md:151` |
| Global HTTP error acknowledgement | app shell | `FalconHttpErrorDialogService` opens an OK-only `error` popup for interceptor-caught failures `[CODE]` `falcon-http-error-dialog-host.component.ts:28-47` |

## Business gotchas
- `[CODE]` `falcon-popup.component.ts:328-334` — the popup does **NOT** close itself on confirm/cancel; it only emits. The owning flow must toggle `[open]`. `[CODE]` `USAGE.md:138` — close `[open]` only AFTER async work completes, or the user sees the popup vanish and cannot retry on failure.
- `[CODE]` `falcon-popup.component.ts:108` — the popup has **no focus trap and no focus restore** `[CODE]` `GAPS_AND_UPGRADES.md:5-16` (P0 a11y gap). Keyboard users can tab into the page underneath. A flow where keyboard a11y is critical must pair it with a manual focus callback.
- `[CODE]` `USAGE.md:116` — do not render two popups simultaneously; there is no focus stack and the second steals.
- The `error` variant's default hint (`"Error code: T2-409 · No data was changed."`, `[CODE]` `falcon-popup.component.ts:45`) is placeholder copy — a real error flow should pass `[hintOverride]` with the actual correlation id / status.

## Verification
🟢 LANDED — popup is production-ready for its current 8 consumers `[CODE]` `USAGE.md:141-153` (Wave 7 sweep) and the wizard discard-confirmation flows are part of the user's confirmed-working Add User / Add Client features `[MEMORY]`. 🟡 CODE-DERIVED for the variant business semantics from `falcon-popup.component.ts`. The no-focus-trap gap is a known P0 (`GAPS_AND_UPGRADES.md:5`).
