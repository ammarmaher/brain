# falcon-button — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**None — fully presentational.** The button owns no data and implements no `ControlValueAccessor`. It is a stateless trigger. The *action* a button fires reaches whichever backend the flow targets:
- **Commerce** — Add Client / Add Node / settings save / service mutations / Templates create.
- **Identity** — Add User commit.
- **Charging** — do-payment / wallet-transfer commits triggered from the do-payment-priority popup + new-wallet-balance drawer.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| (varies — the flow's commit endpoint) | `POST` / `PUT` | Commerce / Identity / Charging | the flow's payload DTO | System / Core Gateway | The button only emits `falconClick`; the parent handler calls the endpoint. |
| `[MEMORY]` order finalize + status | `POST` doPayment + `GET` getOrderStatus (poll) + SignalR `OrderFinalized` | Charging / Commerce / realtime | order-status DTO | Charging / Core Gateway | do-payment Proceed button keeps `[loading]` true across the whole socket-or-poll window (night-shift 2026-06-02). |

> `[CODE]` The button never calls an endpoint. `handleClick` unwraps the Stencil `{ nativeEvent }` envelope and emits `falconClick: EventEmitter<MouseEvent>` (falcon-button.component.ts:69-74) — the consumer's handler does the integration work.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| n/a — buttons are not form controls | — | — | the button itself raises no validation error |
| Submit-gate | parent form validity | `[disabled]` bound to `!form.valid` / `!canSave()` | no message — the button is simply non-committable until the form is valid |
| A11y contract | `iconOnly` + no label | dev/review time | `ariaLabel` required — an unlabelled icon-only button has no accessible name (GAP G4 proposes a dev-mode warning) |

> The button surfaces validation *outcomes* (via `[disabled]`) but performs no validation. The HTTP error pipeline (`[MEMORY]` 400 → top-right toast, 5xx → popup) reacts to the *handler's* request, not the button.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherits the action's PES) | trigger the commit | parent component resolves PES and binds `[disabled]="true"` (or omits the button) |
| `[MEMORY]` `FalconAccess.adminConsole.*.edit()` | Edit / Save buttons on Settings / Info panels | Save button hidden or `[disabled]` when the section's PES denies edit |
| `[MEMORY]` `availableActions[]` (FSM-computed) | Comm Channels / Apps / Templates row-action buttons | each row's action buttons render only for actions present in `availableActions[]` |

The button has no PES key of its own — it inherits the gate of the **action** it triggers.

## State / signal pattern
`[CODE]` falcon-button.component.ts:
- No internal value/disabled signals — `disabled`, `loading`, `variant`, etc. are plain `@Input()`s. `OnPush` change detection (:27).
- `iconOnly` uses `transform: booleanAttribute` (:38) so `iconOnly` / `iconOnly=""` / `[iconOnly]="true"` all coerce correctly.
- `fullWidth` is mirrored onto the host via the computed `@HostBinding('class.falcon-angular-button--full-width')` getter (:58-61) so the wrapper CSS can flip the host (and inner element) to `block; width:100%` — necessary because the Stencil base `w-[var(--falcon-button-full-width)]` resolves against an inline-flex parent otherwise.
- Registers the Stencil tags via `defineFalconTwComponent('falcon-button')` in `ngOnInit` (idempotent).
- `handleClick` filters: emits `falconClick` only when the CustomEvent detail carries a `nativeEvent` — Stencil suppresses that envelope when `disabled || loading`, so the wrapper never emits a gated click.
- Consumers wire `[disabled]` / `[loading]` to their state-slice signals (`canSave()`, `busy()`, `formValid()`).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-button>` (Shadow, `shadow:true`, exposes `part="root|spinner|content|icon-start|label|icon-end"`) / `<falcon-button-tw>` (Light DOM). Owns spinner SVG, icon-only auto-detect (`host.querySelector('[slot="icon-start"]')`), `aria-busy`/`aria-disabled`/native-`disabled`. Both expose `setFocus()` + `clickProgrammatic()` `@Method`s.
- **Angular wrapper** — `<falcon-angular-button>`: thin tag-switcher via `useTailwind`, unwraps `falcon-click` → `falconClick`. Does NOT proxy `setFocus()` / `clickProgrammatic()` (GAP G3).
- **Class SSOT** — `buildRootClasses()` (falcon-button.utils.ts, Shadow `Record<string,boolean>`) and `falconButtonRootClasses()` (button-tailwind-classes.ts, Light joined string) BOTH take the same `RootClassInput`/`FalconButtonTailwindContext` shape and read the same `--falcon-button-*` tokens — so the two render paths are token-identical (the only structural divergence is empty-icon-wrapper rendering, GAP G7).
- Per `feedback_library_skeleton_app_api`, the wrapper holds no business logic — the handler in the consuming component does.

## Integration gotchas
- `[CODE]` **10 variants, not 5** — `FalconButtonVariant` now includes `dashed`, `outline`, `primary-dark`, `outline-primary-dark`, `outline-danger` (falcon-button.types.ts:3-17 + the wrapper's inline copy :18). Any older "5 variants" note is stale.
- `[CODE]` **Bind `[valueAttr]`, never `[value]`** — `value` clashes with Angular's native value binding on the host element.
- `[CODE]` **`setFocus()` / `clickProgrammatic()` are not proxied** — they live on the Stencil element only; reach via `@ViewChild` + `nativeElement` (GAP G3).
- `[VAULT]` **`type="submit"` double-fires** — both `(ngSubmit)` and `(falconClick)` fire on a submit-typed button. Handle from `(ngSubmit)` only.
- **No `href` passthrough** — the element is always `<button>`, never `<a>` (GAP G9). Routing buttons must be `<a [routerLink]>`.
- `[CODE]` **`rootClass` only reaches the Tailwind path** — Shadow tag lacks `rootExtraClass` (GAP G1). In Shadow mode it is dropped silently.
- `[CODE]` **Tailwind color/padding utilities on the host do nothing** — the Light-DOM template emits its own classes; the Shadow path can't see host classes at all. Override via `--falcon-button-*` tokens on a host class.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B17) — `handleClick` envelope filter, `booleanAttribute` coercion, `@HostBinding` full-width flip, and the dual-render class-SSOT (`buildRootClasses` ⇄ `falconButtonRootClasses` same input shape) all re-confirmed in live source. **10-variant union ✅ VERIFIED** (corrects the older "5/6 variants"). Backend wiring + PES gates 🟡 cross-referenced from `[MEMORY]` Wave 14/15/17 + night-shift 2026-06-02. `loading`/`disabled` click-suppression ✅ VERIFIED.
