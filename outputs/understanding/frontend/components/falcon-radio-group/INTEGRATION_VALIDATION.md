# falcon-radio-group — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**Presentational** — the component owns no data. Its *option set* is supplied by the parent and its *selected value* is persisted by the flow's owner:
- **Commerce** — wallet settings (the live wallet-balance pickers feed a Commerce wallet-settings payload: balance distribution + wallet structure).
- `[INFERRED]` Commerce / Identity — any other one-of-N enum field (settings, wizard policy). Not grep-confirmed in the current tree beyond wallet-balance.
- The option list is a small array built by the parent component, not fetched by the group.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `commerce/setting/wallets` (wallet config) | `POST` | Commerce | wallet-settings payload (distribution + structure enums) | System Gateway (admin) | `[CODE]` wallet-balance-management — the two radio-group values ride in the wallet-settings save. |
| `[INFERRED]` other one-of-N enum fields | `GET`/`PUT`/`POST` | Commerce / Identity | flow payload | per flow | radio-group value flows in via CVA into the parent's payload signal. |

> `[CODE]` The component emits `(selectedValueChange)` and drives CVA `onChange` — it never calls an endpoint. The parent state slice does.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-field | the group | submit with `null` selected | surfaced via `[errorText]` (note: input is `errorText`, NOT `errorMessage` — `[CODE]` falcon-radio-group.component.ts:62; `[VAULT]` GAP G2 wants an `errorMessage` alias) |
| Single-value invariant | the group | always | structural — `handleSelect` cannot set more than one value |
| Type-match | option `value` ↔ bound model | render time | no error — a type mismatch silently renders nothing checked (`===` comparison, `[CODE]` line 100) |
| Range (real) | the group | submit | `Validators.required` on the Reactive `FormControl` — the authoritative guard |

> `[CODE]` The component performs no validation itself — it only renders `errorText` when the parent supplies it. The error paragraph carries `role="alert"` per `[VAULT]` API.md:68.

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherits parent field's PES) | edit the choice | parent binds `[disabled]="true"` → wrapper `disabled` (the wallet pickers bind `[disabled]="settingsDisabled() \|\| dataLoading()"`) |
| per-option entitlement | select a specific option | `option.disabled=true` locks an individual option without disabling the group |

The component has no PES key of its own — it inherits the gate of the **field**, and per-option `disabled` carries finer-grained entitlement. (`[INFERRED]` Specific PES keys like `rootPasswordSecurityLevel.edit()` were cited in the prior dossier but are not tied to a grep-confirmed radio-group consumer in the current tree.)

## State / signal pattern
`[CODE]` falcon-radio-group.component.ts:
- Internal `selected = signal<string|number|boolean|null>(null)` (ts:75) and `cvaDisabled = signal<boolean>(false)` (ts:76).
- **`selectedValue` is a one-way input + a separate `(selectedValueChange)` output — NOT a two-way `model()`** (ts:51-56,71). The setter writes `selected`; the getter reads it; the output is emitted by `handleSelect`. (CORRECTION vs prior dossier, which called it a "two-way input/output pair".)
- CVA: `writeValue` sets `selected` (coercing `undefined → null`, ts:86-88); `setDisabledState` writes `cvaDisabled` (ts:95-97).
- `handleSelect` is the single mutation point — guards `!checked` and same-value, then writes the signal, fires `onChange`, emits `selectedValueChange`, and calls `onTouched` (ts:107-114).
- `name` auto-generates as `falcon-radio-group-${++__groupSeq}` (module-level counter, ts:30/68) for native radio exclusivity, forwarded to every child (html:31).

## Skeleton ↔ app-wrapper layering
- **THE DIVERGENCE:** `<falcon-radio-group>` (Shadow) / `<falcon-radio-group-tw>` (Light DOM) exist in the lib but are **orphaned** — the Angular wrapper does NOT render either. It **composes** `<falcon-angular-radio>` children inside a plain `<div role="radiogroup">` (`imports: [FalconAngularRadioComponent]`, html:6-46). It is a *composition* wrapper, not a tag-switcher.
- **Side effect:** the wrapper still calls `defineFalconTwComponent('falcon-radio-group')` in `ngOnInit` (ts:82-84), registering an element it never instantiates — harmless but dead.
- **Consequence (GAPS G2):** the wrapper's plain `<div>` class names have no Light-DOM stylesheet (the Shadow CSS only styles the orphaned element), so the live consumer hand-supplies layout via arbitrary-variant Tailwind.
- Per `feedback_library_skeleton_app_api`, the wrapper fetches no data — the option list is supplied by the parent.

## Integration gotchas
- `[CODE]` **The error input is `errorText`, not `errorMessage`** — divergent from `<falcon-angular-input>` (which uses `errorMessage`). Binding `[errorMessage]` on a radio-group is a silent no-op (`[VAULT]` GAP G2).
- `[CODE]` **`===` equality** — bind option `value`s and the model with the same primitive type, or the group renders unchecked. The most common bug: a backend enum that arrives as a string vs numeric option values.
- `[CODE]` **Do not hand-loop `<falcon-angular-radio>`** — use the group wrapper; manual loops lose the shared `name` exclusivity and the CVA contract (`[VAULT]` USAGE Do/Don't).
- `[CODE]` **Do not mix CVA writes with the `[selectedValue]` setter** — pick one write path.
- `[CODE]` **Keyboard nav is delegated to native same-`name` grouping** — there is NO roving-tabindex and no group-level keydown handler (the Angular composition relies on the browser grouping same-`name` `<input type="radio">`s). Works for native inputs but is undocumented and unverified at runtime (FINDINGS/B06 HIGH-RISK item 3).
- `[CODE]` **Supply layout `class`** — the group does not style its own wrapper classes on the Light path (GAPS G2).
- `[INFERRED]` **camelCase wire** — the selected enum value rides camelCase JSON to Commerce (platform default).

## Verification
🟢 RE-VERIFIED 2026-06-03 (B06). `selectedValue` is one-way input + output (CORRECTED from "two-way pair"); the orphaned-Stencil-group divergence + the missing Light-DOM CSS + the delegated (non-roving) keyboard model all confirmed in source. `errorText`-not-`errorMessage`, `===` equality, 3-source disable ✅ VERIFIED. Backend wiring re-grounded to the wallet consumer; other endpoint mappings 🔴 INFERRED.
