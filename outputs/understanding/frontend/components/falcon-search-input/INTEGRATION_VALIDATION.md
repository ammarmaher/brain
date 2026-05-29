# falcon-search-input — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
**None — presentational only, and intentionally search-only.** The component never persists a value and never calls an endpoint. The *query it triggers* is owned by whatever module backs the list being searched:
- **Commerce** — account / service / node search.
- **Identity** — user search.
- **Charging / Provisioning** — domain-specific list search.
The component is module-agnostic; the consumer maps `falconSearch` to the right backend.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| Search term | `(falconSearch)` `@Output`, payload `{ value }` | (the list's owner) | `[CODE]` `falcon-search-input.component.ts:67,78-80` — debounced 300ms before it fires |
| Clear | `(falconSearchClear)` `@Output`, payload `{ previousValue }` | (the list's owner) | `[CODE]` `falcon-search-input.tsx:96-106` — a `falconSearch` with `''` ALSO fires alongside it |
| Loading | `[loading]` `@Input`, consumer-controlled | — | `[CODE]` `falcon-search-input.tsx:39` — the consumer sets this true/false around its own request |
| Value | `[value]` `@Input` (signal-backed setter), no CVA | — | `[CODE]` `falcon-search-input.component.ts:40-46` — bind for controlled clearing/reset |

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| — | (none) | — | The component has **no validation surface** — no `errorMessage`, no `state`, no `required`. A search term is never validated; an empty term is the valid "show all" case. |

There are no `V-*` rules for this component. It is not a form field.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherited) | none of its own | No PES key. If a whole search-capable page/list is PES-gated, the consumer hides the search bar or sets `[disabled]="true"` — the gate lives on the feature, not the component. |

## State / signal pattern
`[CODE]` `falcon-search-input.component.ts:46` — wrapper holds one `_value` signal exposed via a getter/setter `value` input; **no CVA, no NG_VALUE_ACCESSOR provider**. `[CODE]` `falcon-search-input.tsx:56-58` — Stencil keeps `internalValue` state and a `debounceTimer`; `@Watch('value')` syncs an externally-set value. `disconnectedCallback` clears the timer (no leak). The consumer's state slice owns: the query observable, the `loading` flag, the result list. Per `feedback_library_skeleton_app_api` the library never fetches.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-search-input>` (Shadow DOM) / `<falcon-search-input-tw>` (Light DOM). `[CODE]` `falcon-search-input.tsx:108-139` — it is itself a **composition**: internally renders `<falcon-input variant="search" type="search">` with `clearable` driven by whether a value exists, plus a loading span. Per architect §5.12.2 "Specialized composed input" rule.
- **Angular wrapper** — `<falcon-angular-search-input>`: tag-switcher on `useTailwind`, re-emits `falconSearch` / `falconSearchClear`. `[CODE]` `falcon-search-input.component.ts:74-76` lazy-registers the web component.
- Debounce lives in the **skeleton** (`setTimeout` in `handleFalconInput`), not the wrapper — so it applies in both render paths.

## Integration gotchas
- `[CODE]` `falcon-search-input.tsx:91-93` **Debounce is built in — never debounce again** in the consumer. Wiring `falconSearch` straight to the API call is correct; adding RxJS `debounceTime` on top doubles the delay.
- `[CODE]` `falcon-search-input.tsx:104-105` **Clear fires two events** — `falconSearchClear` and a `falconSearch({value:''})`. A consumer listening only to `falconSearch` already gets the reset; do not also reset in the `falconSearchClear` handler or you risk a double fetch.
- `[CODE]` `falcon-search-input.component.ts:38` **No CVA** — this is not a reactive-forms control. Binding it inside a `formGroup` with `formControlName` will not work; use `[value]` + `(falconSearch)`.
- `[CODE]` `falcon-search-input.tsx:82,96` Stencil `stopPropagation()`s the inner `falcon-input` events — the consumer sees only `falconSearch` / `falconSearchClear`, never the raw input events.
- `[CODE]` `falcon-search-input.tsx:77-80` `setFocus()` is a Stencil `@Method` but is **not proxied** on the Angular wrapper (`DECISION.md` G7) — there is no programmatic focus from app code today.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-search-input.tsx` + `falcon-search-input.component.ts` + `falcon-search-input.component.html`. No-CVA, built-in-debounce, double-event-on-clear ✅ VERIFIED against source. Backend-module list 🔴 INFERRED — the component names no endpoint.
