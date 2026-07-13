# falcon-button — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The button is how the operator *commits a decision*. Every Falcon flow ends at one: "Add Client", "Save", "Next", "Finish", "Cancel", "Delete", "Proceed Payment", "Approve", "Reject". In business terms the button is the boundary between an in-progress intent and a server-side state change — its `disabled` and `loading` states are the visible contract for "you may not commit yet" and "your commit is in flight."

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| A wizard step cannot advance until its fields are valid | `[CODE]` falcon-org-node-drawer.component.html (`[disabled]="!canSave()"`) | Add Client / Add User / Add-Edit Node Save & Next buttons bind `[disabled]` to a form-validity signal — an invalid step has no commit path. |
| A commit in flight must not be double-submitted | `[CODE]` USAGE Example 1 (`[loading]="busy()"`) | `[loading]=true` shows the spinner AND disables click (native `disabled` set when `disabled \|\| loading`, falcon-button.tsx:107) — the operator cannot fire a second create while the first is pending. |
| Destructive actions are visually distinct | `[CODE]` `variant="danger"` / `variant="outline-danger"` | Delete / Reject use red variants so an irreversible/negative business action is not mistaken for a benign one. |
| Approve / Reject toggles read as selected/unselected | `[CODE]` falcon-button.types.ts:10-17 + templates-details.component.html | Templates decision card: `primary-dark` (Approve selected) vs `outline-primary-dark` (unselected); `danger` (Reject selected) vs `outline-danger` (unselected) — the variant encodes the decision state. |
| Cancel must not look like a primary commit | `[CODE]` USAGE Example 2 (`variant="ghost"` for Cancel) | The canonical pair is ghost Cancel + primary Save — visual hierarchy maps to business consequence. |
| Icon-only actions must remain accessible | `[CODE]` falcon-button.tsx:38 a11y note | `ariaLabel` is mandatory when `iconOnly=true` — an unlabelled commit button is an accessibility-compliance failure. |

## Business constraints baked in
- `[CODE]` **`loading` AND `disabled` both block the click** — both Stencil handlers `preventDefault`+`stopPropagation`+return when `disabled || loading` (falcon-button.tsx:67-74). Business meaning: a button in flight or gated is *not committable*. A builder must NOT re-enable it to "unstick" a slow request.
- `[VAULT]` **`loading` is the correct "saving" signal — not `disabled`** (DECISION §10 + USAGE Do/Don't). Toggling both is wrong: `loading` already disables. Use `[loading]` for async work; reserve `[disabled]` for "preconditions not met."
- `[CODE]` **`type="submit"` participates in native form submit** — handle commit logic from the form's `(ngSubmit)`, not a duplicate `(falconClick)`, to avoid double-firing the business action.
- `[VAULT]` **`link` variant is for in-content text actions, not routing** — using it as a navigation control is a UX error (no right-click "open in new tab"). Real navigation is `<a [routerLink]>`.
- `[CODE]` **A slotted `<span slot="label">` overrides the `label` prop** — if both are set, the slot wins (falcon-button.tsx:147-149). A builder setting `[label]` AND projecting label content ships the wrong text.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard | org-hierarchy-page | Back / Next / Finish step navigation; final "Add Client" commit |
| Add User wizard | org-hierarchy-page | Back / Next / Finish; final "Add User" commit |
| Add / Edit Node drawer | org-hierarchy-page (hierarchy tab) | ghost Cancel + primary Save footer pair, `[loading]` on Save |
| Settings tab | org-hierarchy-page | Edit / Cancel / Save header strip; `[disabled]` gated on form validity + dirty |
| Templates decision card | templates-page | Approve / Reject toggles (Wave 9.F variant family); Create Template / Switch-perspective CTAs |
| Do-Payment / Insufficient-Balance | do-payment-priority-popup, service-pricing | Proceed / Cancel commit buttons (the order-status poll keeps `loading` true for the whole window) |
| Wallet transfer | new-wallet-balance (BOTH consoles) | Transfer / Cancel in the balance-transfer drawer |
| Tree node menu | org-hierarchy-page | kebab / icon-only action triggers paired with `<falcon-angular-menu>` |

## Business gotchas
- A `[disabled]` Save button is a **business statement** ("this step is not yet valid / not yet dirty") — do not "fix" it by removing the binding.
- The spinner is width-stable: a button does not visibly resize when `loading` flips. If a layout shifts on save, the cause is elsewhere.
- `variant="ghost"` Cancel and `variant="danger"` Delete carry business meaning — swapping them (e.g. a ghost Delete) understates an irreversible action.
- For a do-payment / order-placing button, the commit polls an order-status endpoint after click (`[MEMORY]` do-payment + realtime night-shift 2026-06-02) — the button's `loading` should stay true for the whole poll window, not just the POST.
- The 4 Wave 9.F variants are NOT decorative alternates — each maps to a specific Templates decision-card state. Reusing `primary-dark` as a generic primary elsewhere would muddy that semantic.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B17) — `loading`+`disabled` click-block + native-`disabled` re-confirmed in falcon-button.tsx:67-74,107; the 10-variant family + Wave 9.F decision-card mapping confirmed in falcon-button.types.ts:10-17. ✅ Add Client / Add User / Add-Edit Node / Settings / Templates / do-payment remain user-confirmed working features (`[MEMORY]` Wave 14/15/17 + night-shift 2026-06-02). Rule cross-references 🟡 CODE-DERIVED from the cited templates.
