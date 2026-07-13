# falcon-popup — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The popup is Falcon's **action-required modal for the four decisions that recur on every page**: an action failed (`error`), a record is about to be destroyed (`delete`), the user is leaving with unsaved work (`unsaved`), or edits are about to go live (`save`). `[CODE]` `falcon-popup.component.ts:47-92` — each variant ships pre-decided business copy, intent colour, icon, and confirm tone. Picking a variant *is* declaring the business decision; the operator only chooses confirm or cancel.

It is among the most-reached overlays in Falcon — direct consumers are a handful (templates wizard, wallet confirm-save, showcase), but **its effective reach is platform-wide via two singleton hosts** (`FalconAngularHttpErrorDialogHostComponent` for every interceptor error; `FalconUnsavedChangesHostComponent` for every dirty-form guard).

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Discard-unsaved-changes before navigating away | `[CODE]` ts:70-80 (`unsaved` variant) + `falcon-unsaved-changes-host.component.ts:30-39` | `variant="unsaved"` fires before a wizard step / route change — "Stay on page" keeps edits, "Discard & leave" abandons them. Driven by `FalconUnsavedChangesService.confirm(...)`. |
| Destructive deletion requires explicit acknowledgement | `[CODE]` ts:59-69 (`delete` variant) | `variant="delete"` with `[name]` interpolated: `"You're about to permanently delete \"<name>\". This action cannot be undone."` |
| Publish/save commits edits to the live record | `[CODE]` ts:81-91 (`save` variant) | `variant="save"` confirms a publish; `[hintOverride]` shows a dynamic change summary. |
| Failed actions surface a retryable error, not a silent failure | `[CODE]` ts:48-58 (`error` variant) + `falcon-http-error-dialog-host.component.ts` | `variant="error"`, confirm "Try again" — the canonical surface for interceptor-caught API failures via `FalconHttpErrorDialogService`. |

## Business constraints baked in
- `[CODE]` ts:70-80 — **the `unsaved` variant's confirm button is RED** (`confirmTone: 'danger'`) even though it is the "confirm" action. Business reasoning: "Discard & leave" *destroys* unsaved work, so it is styled destructive. A builder must NOT "fix" it to a primary tone.
- `[CODE]` ts:47 — **the 4 variants are a closed set.** `VARIANTS` is `Record<FalconPopupVariant, VariantContent>`; a 5th decision type (`archive`, `restore`) cannot be added by configuration — it needs a source change. For non-canonical decisions: use `falcon-confirm-dialog`.
- `[CODE]` ts:343-345 — **empty-string overrides are treated as "no override".** `pick()` falls back to the variant default when an override `.trim()` is empty — a deliberate guard so a `TranslatePipe` returning the key transiently during i18n load does not blank the popup.
- `[CODE]` ts:63 — **`[name]` interpolation is `delete`-variant only.** The other three ignore `name`.
- `[CODE]` ts:309-311,334-335 — **visual sub-modes have a config-default chain.** `glossy`/`iconBg`/`iconColor` default to `undefined` (sentinel) → fall back to `FalconConfigurationService.popup.*`. An app sets the brand default once; a per-instance binding always wins.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Global HTTP error acknowledgement | app shell (every page) | `[CODE]` `falcon-http-error-dialog-host.component.ts` — `FalconHttpErrorDialogService.show(...)` opens an OK-only `error` popup for interceptor-caught failures. |
| Unsaved-changes guard | any dirty-form flow | `[CODE]` `falcon-unsaved-changes-host.component.ts` — `FalconUnsavedChangesService.confirm(...)` opens the `unsaved` popup; resolves an Observable on accept/reject. |
| Templates wizard discard / confirm | both consoles / templates-page | `[CODE]` `templates-wizard.component.ts` references the popup. |
| Confirm save (wallet) | admin-console / new-wallet-balance | `[CODE]` `wb-confirm-save-modal.component.ts` — confirm-before-commit (composes both dialog + popup). |

## Business gotchas
- `[CODE]` ts:408-414 — the popup does **NOT** close itself on confirm/cancel; it only emits. The owning flow must toggle `[open]`. Close `[open]` only AFTER async work completes, or the user sees the popup vanish and cannot retry on failure.
- `[CODE]` ts:101-112 — the popup now uses a native `<dialog>.showModal()` → it **confines focus + makes the page inert while open** (the prior dossier's "no focus trap, keyboard users can tab into the page underneath" is no longer accurate — the native modal handles it). It still lacks a *hand-rolled* Tab-cycle (dialog/drawer have one) but the native containment covers the business-critical case (see INTEGRATION / GAPS G-FOCUS).
- `[CODE]` ts:56,67 — the `error` and `delete` variants' default `hint` is **empty** (`''`), not placeholder copy. A real error flow should pass `[hintOverride]` with the actual correlation id / status.
- Do not render two popups simultaneously — both `showModal()` into the Top Layer; competing passive confirms are confusing.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B14). Variant business semantics + `confirmTone`-danger-for-unsaved + closed-variant-set + empty-string-override guard + delete-only `[name]` re-confirmed in the 416-line source. Host-composition (HTTP-error + unsaved-changes) ✅ CODE-VERIFIED. Drift corrected: focus reframed (native modal confines focus — not "P0 escape"); `error`/`delete` hints are EMPTY (prior "T2-409 …" fabricated); config-default chain for visual toggles. The wizard discard flows remain user-confirmed-working `[MEMORY]`.
