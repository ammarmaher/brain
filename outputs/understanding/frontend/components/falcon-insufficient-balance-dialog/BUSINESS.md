# falcon-insufficient-balance-dialog — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-insufficient-balance-dialog` is a **domain-specific business overlay** built on top of a generic priority-reorder primitive. Its product job: when an operator triggers a paid service action and the account's wallet cannot fully fund it across multiple wallets, the platform must let the operator **rank which communication channels (or services) get funded first** before re-attempting the payment. The dialog presents the channels as a draggable/reorderable list and emits the chosen priority order.

The exact business trigger is **insufficient wallet balance on a do-payment attempt** — specifically `[CODE]` `USAGE.md:78-79` the backend returns `OrderFailureReason.CommChannelPriorityOrderRequired` together with `WalletType.MultipleWallets`. That pair is the signal that the operator must supply a funding priority order. The dialog is the surface for that decision.

`[CODE]` `falcon-insufficient-balance-dialog.tsx:1-4` — the component is **self-contained** (it owns its backdrop, panel, warning icon, title, subtitle, priority list, info pill, footer) and **generic** at the API level: it accepts an opaque `{ id, label }[]` and emits ordered IDs. The "insufficient balance" framing is a *naming and styling* convention; the mechanism (rank a flat list, confirm) is reusable.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Multi-wallet payment requires an explicit channel priority order | `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan_2026_05_17` — do-payment failure-reason `CommChannelPriorityOrderRequired` | When the do-payment order fails with this reason + `WalletType.MultipleWallets`, the caller opens this dialog so the operator ranks channels; the order is resubmitted as `commChannelPriorityIds`. |
| "The first channel will be used automatically" | `[CODE]` `falcon-insufficient-balance-dialog.tsx:55,406-409` — `firstAutoLabel` info pill | The dialog states, as a fixed info pill, that **rank 1 is consumed first** — the operator's top choice is the channel that gets funded. This makes the ranking's consequence explicit. |
| Server is the source of truth for the seed order | `[CODE]` `falcon-insufficient-balance-dialog.tsx:97-105` `@Watch('open')` re-seeds `orderedItems` from `items` on every false→true; `[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:23` | The dialog does not persist the operator's last order locally — every open re-seeds from the caller-supplied (server-derived) order. |

## Business constraints baked in
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:73,140-152` **Reorder mutations target a local working copy (`orderedItems`), never `items`** — the caller's seed list is immutable; the operator's ranking is committed only on Proceed. Business meaning: a cancelled dialog leaves the server state untouched.
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:115-119,135-138` **Esc and backdrop dismissal are suppressed while `busy`** — once the operator presses Proceed and the payment submit is in flight, the dialog cannot be dismissed. Business meaning: the operator cannot abandon a submitting payment and lose the ability to see its outcome (`[BRAIN-OUT]` `USAGE.md:126`).
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:128-131` **Proceed is a no-op while `busy` or `loading`** — double-submit is prevented at the component level.
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:293-296` **Reorder controls are disabled while `busy`/`loading`** — and the four arrow buttons (jump-top / step-up / step-down / jump-bottom) give full keyboard parity with drag-drop (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:16`), so every position is reachable without a mouse.
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:66,159` **`allowDragDrop=false` makes the drag handle inert** (Wave 16.1) — a flow can force arrow-button-only reordering.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Do-payment for a comm channel | org-hierarchy → Comm Channels tab | `[CODE]` `USAGE.md:5` — fired from the `doPayment` row action when the order fails with `CommChannelPriorityOrderRequired`; operator ranks channels, payment is resubmitted. |
| Do-payment for a service / application | org-hierarchy → Apps & Services tab | `[CODE]` `USAGE.md:5` — same `ApplicationsTableComponent` is shared by both tabs; same priority-reorder flow. |
| Generic flat-list ranking (reuse path) | (any) | `[CODE]` `USAGE.md:92-103` + `DECISION.md:D3` — campaign recipient prioritization, route preference, anything needing flat-list ranking. The dialog is intentionally generic. |
| Showcase | host-shell falcon-ui-showcase | `[CODE]` `USAGE.md:136` — `library-section.component.ts` renders it under the new `notifications` showcase category. |

## Business gotchas
- `[BRAIN-OUT]` `DECISION.md:D2` **It does NOT compose `falcon-dialog`** — it is a deliberately self-contained 3-artefact component. The three visual toggles (`showGlossy`, `showIconColor`, `showIconBackground`) need direct control over backdrop blur and the warning-icon chip, which composing `falcon-dialog` could not give cleanly. Do not assume dialog behavior carries over.
- `[BRAIN-OUT]` `USAGE.md:127` **Do not re-sort `items` inside the dialog** — the caller owns the seed order; the dialog ranks what it is given.
- `[BRAIN-OUT]` `USAGE.md:128` **The working order is encapsulated** — there is no way to read the operator's in-progress ranking externally; subscribe to `(falconProceed)` to get the committed order.
- `[CODE]` `falcon-insufficient-balance-dialog.tsx:128-131` **Proceed always emits** the full ordered ID list — even if the operator changed nothing. The caller must treat "Proceed" as "commit this order", not "I made changes".
- `[BRAIN-OUT]` `GAPS_AND_UPGRADES.md:G4` **No focus trap yet** — the self-contained panel does not trap Tab; it relies on natural tab order. A future a11y upgrade.
- `[INFERRED]` The component name says "insufficient balance" but the API is generic — a builder reusing it for non-payment ranking should be aware the warning-icon and default labels (`'Proceed Payment'`, `'The first channel will be used automatically.'`) lean payment-flavored; override `headingText` / `confirmLabel` / `firstAutoLabel` for other domains.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-insufficient-balance-dialog.tsx` and the existing 6 dossier files. Business trigger (`CommChannelPriorityOrderRequired` + `WalletType.MultipleWallets`) ✅ VERIFIED against `[CODE]` `USAGE.md:78-79` backend wire-up sample and `[MEMORY]` `project_commchannels_apps_tabs_backend_integration_plan_2026_05_17`.
