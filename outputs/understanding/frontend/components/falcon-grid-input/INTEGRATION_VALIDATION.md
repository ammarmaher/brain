# falcon-grid-input — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None — presentational only.** The component edits one transient `string` and emits commit/cancel/navigate intents. The persisted cell behind it is owned by whatever module backs the table:
- **Commerce** — service / account / node grids (price-type, price-value, names).
- **Charging / Provisioning** — quota and domain-specific grids.
The grid-input itself is module-agnostic; the host table/cell directive routes `falconGridCommit` to the right write endpoint.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| Commit (Enter / Tab / blur) | `(falconGridCommit)` `@Output`, payload `{ value }` | (the grid's owner) | `[CODE]` `falcon-grid-input.component.ts:59,73-75` — the consumer maps this to one cell-write call |
| Cancel (Escape) | `(falconGridCancel)` `@Output`, `void` | — | `[CODE]` `falcon-grid-input.tsx:105-112` — value already reverted to `originalValue` locally; no backend call |
| Navigate (Tab) | `(falconGridNavigate)` `@Output`, `{ direction: 'next'\|'previous' }` | — | `[CODE]` `falcon-grid-input.tsx:114-122` — host table moves focus to the adjacent cell |
| Value / originalValue | `[value]` / `[originalValue]` `@Input`s, no CVA | — | `[CODE]` `falcon-grid-input.component.ts:38-50` — `value` is signal-backed; `originalValue` plain |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | the cell | — | The component has **no validation surface** — no `errorMessage`, no `state`, no error tokens consumed today (`grid-input.tokens.css` defines an error/dirty token set but the component does not bind them). |
| `[INFERRED]` Cell-value validity | numeric / bounded cells | after `falconGridCommit` | the **consumer** validates the committed string and, on failure, must surface the error on the row — the component cannot show it (`DECISION.md` G2). |

There are no `V-*` rules wired into the component. Validation is entirely the host grid's responsibility, applied after commit.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherited) | none of its own | No PES key. A read-only-by-permission cell is gated by the host table: it either does not enter edit mode, or renders the grid-input with `[disabled]="true"`. The PES decision lives on the column/feature. |

## State / signal pattern
`[CODE]` `falcon-grid-input.component.ts:44` — wrapper holds one `_value` signal behind a getter/setter `value` input; **no CVA**. `[CODE]` `falcon-grid-input.tsx:53,59` — Stencil keeps `internalValue` state plus a `committed` boolean flag: this flag is the de-dup guard so a key-commit (Enter/Tab) followed by the resulting blur does not fire `falconGridCommit` twice. The host table/cell directive owns: which cell is in edit mode, focus management across cells, and the actual write. Per `feedback_library_skeleton_app_api` the library never fetches.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-grid-input>` (Shadow DOM) / `<falcon-grid-input-tw>` (Light DOM). `[CODE]` `falcon-grid-input.tsx:129-147` — itself a **composition**: internally renders `<falcon-input variant="grid" size="sm" clearable={false}>`, with all key handling on the `<Host onKeyDown>`. Per architect §5.12.2 "Specialized composed input" rule.
- **Angular wrapper** — `<falcon-angular-grid-input>`: tag-switcher on `useTailwind`, re-emits the three events. `[CODE]` `falcon-grid-input.component.ts:69-71` lazy-registers the web component.
- The keyboard contract lives in the **skeleton** so it works in both render paths.

## Integration gotchas
- `[CODE]` `falcon-grid-input.tsx:59,90-93,101` **The `committed` flag prevents double-commit** — a consumer must trust that Enter then the natural blur yields exactly one `falconGridCommit`. Do not also commit manually in a blur handler on the host.
- `[CODE]` `falcon-grid-input.component.ts:36` **No CVA** — not a reactive-forms control. Bind `[value]` + `(falconGridCommit)`; `formControlName` will not bind.
- `[CODE]` `falcon-grid-input.tsx:114-117` **Tab is hijacked** — the component `preventDefault()`s Tab and turns it into `falconGridNavigate`. Native tab order does NOT apply; the host table must implement cell-to-cell focus from the navigate event, or focus is lost.
- `[CODE]` `falcon-grid-input.tsx:88` **Blur commits** — a click elsewhere saves; only Escape abandons. Consumers expecting "click-away cancels" will silently persist edits.
- `[CODE]` `falcon-grid-input.tsx:66-69` Auto-focus runs in `componentDidLoad` only when `autoFocus && !disabled` — a disabled cell never steals focus.
- `[CODE]` `falcon-grid-input.tsx:77-80` `setFocus()` is a Stencil `@Method` but **not proxied** on the wrapper (`DECISION.md` G3).

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-grid-input.tsx` + `falcon-grid-input.component.ts`. Double-commit guard, Tab-hijack, blur-commits, no-CVA, no-error-state ✅ VERIFIED against source. Backend-module list 🔴 INFERRED — the component names no endpoint.
