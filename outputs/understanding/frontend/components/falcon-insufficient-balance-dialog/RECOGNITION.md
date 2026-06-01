# falcon-insufficient-balance-dialog — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-insufficient-balance-dialog>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-insufficient-balance-dialog.tsx:362-435` — a **centered modal over a glossy (blurred + saturated) backdrop** with a distinctive anatomy:
- A **large warning triangle icon** at the top, in a circular tinted chip (red by default).
- A **bold title** and a muted **subtitle** beneath it.
- A **list card** containing a **vertically ranked list of pill rows** — each row shows a **rank number** (1, 2, 3…), a **6-dot drag grip**, a **label**, and **four reorder buttons** (jump-to-top, step-up, step-down, jump-to-bottom — chevron icons). Rows can be **dragged** by the grip to reorder; an **insertion line** shows the drop position.
- A **teal info pill** below the list ("The first channel will be used automatically.").
- A footer with a **Cancel** button and a **Proceed Payment** primary button.
Optional inline **error banner** (red) appears in the body when `errorMessage` is set.

Distinguishing it: it is a **ranked/reorderable list inside a modal** — the drag grips, rank numbers, and per-row up/down controls are the giveaway. It is not a generic confirm dialog and not a plain list.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` + a hand-rolled list using `react-beautiful-dnd` / `dnd-kit` reorderable rows | no single MUI component — it is a Dialog composed with a sortable list |
| PrimeNG | `<p-dialog>` + `<p-orderList>` (or `<p-pickList>`) | closest 1:1 — PrimeNG's `<p-orderList>` is a reorderable list; wrap it in a dialog |
| Ant Design | `<Modal>` + `<List>` with drag-sortable items (`react-sortable-hoc`) | composed pattern |
| Bootstrap | `.modal` + a SortableJS list | composed pattern |
| shadcn / Radix | `<Dialog>` + `dnd-kit` `<SortableContext>` | composed pattern |
| plain HTML | hand-rolled modal + HTML5 drag-drop list | replace with this — Falcon already wraps native drag-drop + keyboard arrows |

**Recognition cue:** if a design shows a **modal containing a drag-to-reorder ranked list with a confirm button**, especially framed around payment / funding / priority, this is the component. There is no generic "ordered-list dialog" sibling in Falcon — this *is* it (and it doubles as the generic one).

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a modal with a drag-reorderable ranked list + Proceed/Cancel | `<falcon-angular-insufficient-balance-dialog>` | dialog |
| an insufficient-wallet-balance / channel-priority prompt | `<falcon-angular-insufficient-balance-dialog>` | popup |
| a generic flat-list ranking task (reuse path) | `<falcon-angular-insufficient-balance-dialog>` (override the labels) | a hand-rolled dialog |
| a binary yes/no decision with no list | `<falcon-angular-popup>` / `<falcon-angular-confirm-dialog>` | this |
| a centered modal with a bespoke (non-list) body | `<falcon-angular-dialog>` | this |
| a "send credentials" confirmation | `<falcon-angular-sending-credentials-dialog>` | this |
| just an editable list inline on a page (no modal) | a data-table / order-list component | this |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs (data)** — `[items]` (`{ id, label }[]` — caller supplies pre-translated labels, pre-sorted to the seed order), `[open]`, `[loading]` (skeleton rows), `[busy]` (submit-in-flight), `[errorMessage]` (pre-translated banner; pass `undefined` not `null`).
2. **Inputs (labels)** — `[headingText]`, `[subtitle]`, `[confirmLabel]`, `[cancelLabel]`, `[dragLabel]`, `[firstAutoLabel]`, `[moveUpLabel]` / `[moveDownLabel]` / `[moveToTopLabel]` / `[moveToBottomLabel]` — all pre-translated. **Override these for non-payment reuse** — the defaults are payment-flavored.
3. **Variants (visual toggles)** — `[showGlossy]`, `[showIconColor]`, `[showIconBackground]` (reflected props), `[allowDragDrop]` (false → arrow-buttons-only), `[fit]` (`'normal'` / `'full'`). `[closeOnBackdrop]` / `[closeOnEsc]` gate dismissal.
4. **No slots** — `[CODE]` `falcon-insufficient-balance-dialog.tsx` the body is fully controlled; you cannot project custom rows (intentional — `[BRAIN-OUT]` `DECISION.md` rejected a body slot to keep drag handlers correct).
5. **Token override** — restyle row dimensions (`--falcon-ib-dialog-row-height`, `-row-min-width`, `-row-radius`, etc.), icon color, footer button colors via `insufficient-balance-dialog.tokens.css` vars — globally or per-instance via inline `style`.
6. **Outputs** — handle `(falconProceed)` (`{ orderedIds }` — the committed ranking) and `(falconCancel)` (`{ reason }`).
7. **App orchestrator** — for the real payment flow, do not wire the dialog directly; reuse / mirror the host-shell `do-payment-priority-popup` orchestrator which owns the Commerce do-payment + poll logic.

## Anti-patterns
- `[BRAIN-OUT]` `USAGE.md:126` Flipping `[open]=false` mid-submit — the operator loses the ability to retry on server failure (dismissal is already suppressed while `busy`; do not fight it).
- `[BRAIN-OUT]` `USAGE.md:127` Re-sorting `items` inside the caller after passing them — the caller owns the seed; the dialog ranks what it is given.
- `[BRAIN-OUT]` `USAGE.md:128` Trying to read the in-progress working order externally — it is encapsulated; subscribe to `(falconProceed)`.
- `[BRAIN-OUT]` `USAGE.md:130` Using it for a binary yes/no decision — use `<falcon-angular-popup>`.
- `[INFERRED]` Reusing it for a non-payment domain without overriding `headingText` / `confirmLabel` / `firstAutoLabel` — the defaults say "Proceed Payment" / "channel", which is wrong for, e.g., campaign recipients.
- `[INFERRED]` Assuming it composes `falcon-dialog` — it is self-contained; dialog props/behavior do not apply.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-insufficient-balance-dialog.tsx` render structure + `insufficient-balance-dialog.tokens.css` references + `[BRAIN-OUT]` existing dossiers. Cross-library mapping is `[INFERRED]` — no single-component analogue exists in the named libraries; the pattern is "dialog + sortable list" everywhere.
