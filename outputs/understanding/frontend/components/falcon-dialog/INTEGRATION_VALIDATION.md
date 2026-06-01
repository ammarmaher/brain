# falcon-dialog — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md` etc. Business → `BUSINESS.md`.

## Owning backend module(s)
**None.** `[CODE]` `falcon-dialog.tsx` — the component performs no HTTP calls, holds no service injection, and binds to no DTO. It is a pure presentational overlay. Any backend coupling belongs to the *content* a consumer projects into the slots, not to the dialog.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | Dialog is presentational. The slotted body/footer carry whatever wiring the consuming flow needs. |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | — | — | The dialog declares no validation. Form validation lives in the projected body content. |

The dialog's only "validation-like" behavior is the dismissal-guard logic: `[CODE]` `falcon-dialog.tsx:122-140` — `dismissible` + `closeOnBackdrop` + `closeOnEsc` together gate whether a close path fires. This is interaction gating, not data validation.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| — | — | The dialog has no PES key. It inherits the gate of whatever flow opens it — if the parent step is PES-denied it simply never calls `show()` / never sets `[open]="true"`. |

## State / signal pattern
- `[CODE]` `falcon-dialog.component.ts:38-53` The Angular wrapper uses **classic `@Input()` decorators** (not signal inputs) — `open`, `title`, `size`, `severity`, `position`, etc.
- `[CODE]` `falcon-dialog.component.ts:68-73` `handleClose()` writes `this.open = false` and emits `openChange.emit(false)` — this is the two-way `[(open)]` sugar. The wrapper mutates its own `open` field on close so Angular's two-way binding stays consistent.
- `[CODE]` `falcon-dialog.tsx:41,79-83` Inside Stencil, `open` is `@Prop({ mutable: true, reflect: true })` with an `@Watch` that runs `afterOpenSideEffects` / `afterCloseSideEffects` on transition — focus capture on open, focus restore on close.
- `[INFERRED]` There is no error pipeline interaction — a dialog showing a server error must receive that error as already-resolved text in its projected body (the `errorMessage` prop is dead, see `BUSINESS.md`).

## Skeleton ↔ app-wrapper layering
Two layers, both inside the library — there is **no app-level wrapper** for this primitive:
1. **Stencil skeleton** — `[CODE]` `falcon-dialog.tsx` `<falcon-dialog>` (Shadow DOM, `shadow: true`) and its Light-DOM twin `<falcon-dialog-tw>`. Pure presentational; owns focus trap, backdrop, slots.
2. **Angular wrapper** — `[CODE]` `falcon-dialog.component.ts` `<falcon-angular-dialog>`. Bridges `@Input`/`@Output`, registers the Stencil tag on demand via `defineFalconTwComponent('falcon-dialog')` in `ngOnInit`, re-emits CustomEvents as Angular `EventEmitter`s.

Per `feedback_library_skeleton_app_api`: any service injection / data fetching belongs to the **consuming feature component**, never inside this library primitive. The dialog's composed siblings (`falcon-angular-confirm-dialog`) follow the same rule.

### Overlay / z-index tier ladder
`[CODE]` `dialog.tokens.css` exposes `--falcon-dialog-z`; `[BRAIN-OUT]` `TOKENS.md:64`. The Falcon overlay tier ordering, low → high:
- `falcon-tooltip` (`--falcon-tooltip-z`) — lightest, transient hint, sits above page content.
- `falcon-drawer` (`--falcon-drawer-z`) — edge-anchored sheet.
- `falcon-dialog` (`--falcon-dialog-z`) — centered modal; sits at/above drawer tier.
- `falcon-insufficient-balance-dialog` (`--falcon-ib-dialog-backdrop-z: 1000`, `[CODE]` `insufficient-balance-dialog.tokens.css`) and `falcon-sending-credentials-dialog` (`z-[var(--falcon-dialog-z-index)]` = 1200, `[CODE]` `falcon-sending-credentials-dialog.component.html:8`) — domain dialogs pinned to the modal tier.
- `[INFERRED]` Stacking two modal-tier overlays at once breaks the focus trap (each runs its own `document` keydown listener) — `[BRAIN-OUT]` `USAGE.md:56` explicitly warns against rendering multiple dialogs simultaneously.

## Integration gotchas
- `[CODE]` `falcon-dialog.tsx:129` The Esc handler is `@Listen('keydown', { target: 'document' })` — a **global** listener active whenever the dialog is open. Two open dialogs both listen; Esc resolves ambiguously.
- `[CODE]` `falcon-dialog.tsx:186` `render()` returns `null` when closed — the body DOM (and any signal state inside it) is destroyed on close and rebuilt on next open. Consumers must hoist state to the parent.
- `[BRAIN-OUT]` `GAPS_AND_UPGRADES.md` `falconConfirm` / `falconCancel` events are wired through the wrapper (`[CODE]` `falcon-dialog.component.ts:75-83`) but **no built-in button emits them** — they only fire if a consumer manually calls `emit()`. Subscribing to them without an emitter is dead code.
- `[CODE]` `falcon-dialog.tsx:54` `closeAriaLabel` exists on the Stencil source but the Angular wrapper does **not** expose it — the close × button label is stuck as the English `'Close'` for i18n.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-dialog.tsx` + `falcon-dialog.component.ts` + `dialog.tokens.css` references. No backend module, no `V-*` rules, no PES key — confirmed presentational. Z-index ladder cross-checked against `[CODE]` the IB-dialog and sending-credentials-dialog sources.
