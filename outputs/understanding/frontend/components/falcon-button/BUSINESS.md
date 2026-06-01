# falcon-button — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The button is how the operator *commits a decision*. Every Falcon flow ends at one: "Add Client", "Save", "Next", "Finish", "Cancel", "Delete". In business terms the button is the boundary between an in-progress intent and a server-side state change — its `disabled` and `loading` states are the visible contract for "you may not commit yet" and "your commit is in flight."

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| A wizard step cannot advance until its fields are valid | `[CODE]` USAGE.md:22-24 + falcon-org-node-drawer.component.html:47-52 (`[disabled]="!canSave()"`) | Add Client / Add User / Add-Edit Node Save & Next buttons bind `[disabled]` to a form-validity signal — an invalid step has no commit path. |
| A commit in flight must not be double-submitted | `[CODE]` USAGE.md:51 (`[loading]="busy()"`) + `[VAULT]` API.md:98 | `[loading]=true` shows the spinner AND disables click — the operator cannot fire a second create while the first is pending. |
| Destructive actions are visually distinct | `[CODE]` `variant="danger"` (`[VAULT]` DECISION.md:55) | Delete / remove actions use `variant="danger"` (red) so an irreversible business action is not mistaken for a benign one. |
| Cancel must not look like a primary commit | `[CODE]` USAGE.md:20-21 (`variant="ghost"` for Cancel) | The canonical pair is ghost Cancel + primary Save — the visual hierarchy maps to business consequence. |
| Icon-only actions must remain accessible | `[CODE]` falcon-button.tsx a11y note + `[VAULT]` API.md:96-97 | `ariaLabel` is mandatory when `iconOnly=true` — an unlabelled commit button is an accessibility-compliance failure. |

## Business constraints baked in
- `[CODE]` **`loading` AND `disabled` both block the click** (`handleClick` emits only when the Stencil envelope carries a `nativeEvent`; the Stencil core swallows clicks when `disabled || loading`). Business meaning: a button in flight or gated is *not committable*. A builder must not re-enable it to "unstick" a slow request.
- `[VAULT]` **`loading` is the correct "saving" signal — not `disabled`** (DECISION.md §10 + USAGE Do/Don't). Toggling both is wrong: `loading` already disables. Use `[loading]` for async work; reserve `[disabled]` for "preconditions not met."
- `[CODE]` **`type="submit"` participates in the native form submit** — a submit-typed button fires `(ngSubmit)` on the parent form. Handle commit logic from `(ngSubmit)`, not a duplicate `(falconClick)`, to avoid double-firing the business action (`[VAULT]` USAGE.md:125).
- `[VAULT]` **`link` variant is for in-content text actions, not routing** — using it as a navigation control is a business/UX error (no right-click "open in new tab"). Real navigation is `<a [routerLink]>`.
- `[CODE]` **The slotted `<span slot="label">` overrides the `label` prop** — if both are set, the slot wins. A builder setting `[label]` and ALSO projecting label content will ship the wrong text.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard | organization-hierarchy | Back / Next / Finish step navigation; final "Add Client" commit |
| Add User wizard | organization-hierarchy | Back / Next / Finish; final "Add User" commit |
| Add / Edit Node drawer | organization-hierarchy (hierarchy tab) | ghost Cancel + primary Save footer pair, `[loading]` on Save |
| Settings tab | organization-hierarchy | Edit / Cancel / Save header strip; `[disabled]` gated on form validity + dirty |
| Comm Channels / Apps tabs | organization-hierarchy | row-action triggers, do-payment commit buttons |
| Tree node menu | organization-hierarchy | kebab / icon-only action triggers paired with `<falcon-angular-menu>` |

## Business gotchas
- A `[disabled]` Save button is a **business statement** ("this step is not yet valid / not yet dirty") — do not "fix" it by removing the binding.
- The spinner is width-stable: a button does not visibly resize when `loading` flips. If a layout shifts on save, the cause is elsewhere.
- `variant="ghost"` Cancel and `variant="danger"` Delete carry business meaning — swapping them (e.g. a ghost Delete) understates an irreversible action.
- For a do-payment / order-placing button, the commit polls an order-status endpoint after click (`[MEMORY]` Comm Channels do-payment) — the button's `loading` should stay true for the whole poll window, not just the POST.

## Verification
✅ VERIFIED — Add Client / Add User / Add-Edit Node / Settings tab are user-confirmed working features (`[MEMORY]` Wave 14/15/17, 2026-05-17/18) and all use this button for commit/cancel. `loading`+`disabled` click-block ✅ VERIFIED in `falcon-button.tsx` (`[VAULT]` API.md). Rule cross-references 🟡 CODE-DERIVED from cited templates.
