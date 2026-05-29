# falcon-radio-group — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**Presentational** — the component owns no data. Its *option set* is business reference data and its *selected value* is persisted by the flow's owner:
- **Commerce** — tenant settings (`commerce/setting`): password security level, account policy levels.
- **Identity** — where a role / status one-of-N choice is part of user lifecycle.
- The option list is usually a small fixed enum, defined in `[CODE]` shared-types, not fetched.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `commerce/setting` | `GET` / `PUT` | Commerce | settings DTO (security-level enum field) | System Gateway | `[MEMORY]` Wave 14 Settings tab — radio-group value rides in the settings payload. |
| Add Client create | `POST` | Commerce | wizard payload (policy enum field) | System Gateway | radio-group value flows in via CVA into the wizard payload signal. |

> `[CODE]` The component emits `selectedValueChange` and drives CVA `onChange` — it never calls an endpoint. The parent state slice does.

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
| (inherits parent field's PES) | edit the choice | parent step binds `[disabled]="true"` → `cvaDisabled` / wrapper `disabled` |
| `[MEMORY]` `FalconAccess.adminConsole.rootPasswordSecurityLevel.edit()` / `accountPasswordSecurityLevel.edit()` | edit security level on Settings tab | radio-group rendered `[disabled]` when the section's PES denies edit |
| per-option entitlement | select a specific tier/level | `option.disabled=true` locks an individual option without disabling the group |

The component has no PES key of its own — it inherits the gate of the **field**, and per-option `disabled` carries finer-grained entitlement.

## State / signal pattern
`[CODE]` falcon-radio-group.component.ts:
- Internal `selected = signal<string|number|boolean|null>(null)` and `cvaDisabled = signal<boolean>(false)`.
- `selectedValue` is a two-way input/output pair: the setter writes `selected`, the getter reads it, `selectedValueChange` mirrors it.
- CVA: `writeValue` sets `selected` (coercing `undefined → null`); `setDisabledState` writes `cvaDisabled`.
- `handleSelect` is the single mutation point — guards `!checked` and same-value, then writes the signal, fires `onChange`, emits `selectedValueChange`, and calls `onTouched`.
- `name` auto-generates as `falcon-radio-group-${++__groupSeq}` (module-level counter) for native radio exclusivity.
- The wrapper renders `<falcon-angular-radio>` children — it is a *composition* wrapper, not a tag-switcher (`imports: [FalconAngularRadioComponent]`).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-radio-group>` (Shadow) / `<falcon-radio-group-tw>` (Light DOM) exist, but the **Angular composition path is the active one** — the wrapper loops `<falcon-angular-radio>` instances itself rather than rendering the Stencil group tag (`[VAULT]` API.md:6, OVERVIEW.md:51).
- **Angular wrapper** — `<falcon-angular-radio-group>`: `ControlValueAccessor`, composes child `<falcon-angular-radio>` components, registers Stencil tags via `defineFalconTwComponent('falcon-radio-group')` in `ngOnInit`.
- Per `feedback_library_skeleton_app_api`, the wrapper fetches no data — the option list is supplied by the parent.

## Integration gotchas
- `[CODE]` **The error input is `errorText`, not `errorMessage`** — divergent from `<falcon-angular-input>` (which uses `errorMessage`). Binding `[errorMessage]` on a radio-group is a silent no-op (`[VAULT]` GAP G2).
- `[CODE]` **`===` equality** — bind option `value`s and the model with the same primitive type, or the group renders unchecked. The most common bug: a backend enum that arrives as a string vs numeric option values.
- `[CODE]` **Do not hand-loop `<falcon-angular-radio>`** — use the group wrapper; manual loops lose the shared `name` exclusivity and the CVA contract (`[VAULT]` USAGE Do/Don't).
- `[CODE]` **Do not mix CVA writes with the `[selectedValue]` setter** — pick one write path (`[VAULT]` USAGE.md:77).
- `[INFERRED]` **camelCase wire** — the selected enum value rides camelCase JSON to Commerce (platform default).

## Verification
🟡 CODE-DERIVED from `falcon-radio-group.component.ts` + `[VAULT]` dossiers. `errorText`-not-`errorMessage` ✅ VERIFIED in source. `===` equality + 3-source disable ✅ VERIFIED. Backend wiring + PES gates 🟡 cross-referenced from `[MEMORY]` Wave 14; endpoint DTO field names not re-read from backend source.
