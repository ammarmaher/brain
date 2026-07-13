# falcon-input-number — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.

## Owning backend module(s)
**Presentational** — the component owns no data. The number it captures is persisted by the flow's owner:
- **Commerce** — account quota, client numeric settings, service pricing values (`commerce/setting`, `commerce/Node/{nodeId}` pricing endpoints).
- **None for ad-hoc quantity pickers** — those drive client-side state only.

## Backend wiring
| Endpoint | Method | Backend module | DTO (req / resp) | Gateway | Notes |
|---|---|---|---|---|---|
| `commerce/setting` | `GET` / `PUT` | Commerce | settings DTO (quota numeric field) | System Gateway | `[MEMORY]` Wave 14 Settings tab — quota field bound via input-number. |
| Add Client create | `POST` | Commerce | wizard payload (numeric settings) | System Gateway | input-number value rides in via CVA into the wizard payload. |
| `commerce/Node/{nodeId}` price-value mutations | `POST` | Commerce | `SetPriceValue` request | System Gateway | `[MEMORY]` price-type/price-value writes are `FalconOnly`. |

> `[INFERRED]` The component emits `falcon-input-number-change` → CVA → form value. It never calls an endpoint itself.

## Validation rules (V-*)
| V-rule | Field | Trigger | Error code / message |
|---|---|---|---|
| Required-field | quota, threshold, price | submit / blur empty | field-level "required" → `errorMessage` (note: GAP G5 — wrapper lacks a `state` input parity, error must be surfaced via `errorMessage` only — `[CODE]` confirms `state` IS present at falcon-input-number.component.ts:80) |
| Min / max clamp | any bounded field | **blur** (not keystroke) | value silently clamped to `[min]`/`[max]`; no error raised (`[VAULT]` GAP G1) |
| Integer enforcement | `integer=true` fields | every keystroke / paste | fractional part silently truncated via `Math.trunc` — no error |
| Numeric range (real) | quota, price | submit | `Validators.min` / `Validators.max` on the Reactive `FormControl<number\|null>` — the authoritative guard |

> `[CODE]` correction to `[VAULT]` GAP G5 (re-scoped 2026-06-03): the wrapper **does** declare `@Input() state: FalconInputNumberState` (ts:80), BUT it is only honored in the **Tailwind** path. The `-tw` twin forwards `state` to its inner `<falcon-input-tw>` (tw.tsx:46/306); the **Shadow** `<falcon-input-number>` has no `state` prop and drops it. So `state`+`errorMessage` paint the error ring only when `useTailwind=true` (the default). See `GAPS_AND_UPGRADES.md` G5 + the NEW G5b (Shadow lacks the numeric keystroke filter).

## PES keys gating this component
| PES key | Action | Effect when denied |
|---|---|---|
| (inherits parent field's PES) | edit the numeric field | parent step binds `[disabled]="true"` |
| `[MEMORY]` `FalconAccess.adminConsole.accountQuota.edit()` | edit account quota on Settings tab | input-number rendered `[disabled]` when denied |
| `[MEMORY]` `FalconAccess.adminConsole.services.editPriceValue` | edit a service price value | price input-number disabled for non-Falcon users |

The component has no PES key of its own — it inherits the gate of the **field**.

## State / signal pattern
`[CODE]` falcon-input-number.component.ts (2026-05-17 tag-switcher refactor):
- Internal `value = signal<number | null>(null)`, `disabled = signal<boolean>(false)`.
- `[disabled]` accepts a property binding via the `disabledFromInput` setter (Wave 7.7 parity), boolean OR string-truthy.
- `writeValue` runs `coerce()` then the defensive `componentOnReady().then(push)` to re-push the value into the live Stencil element after hydration (mirrors `falcon-input` — fixes cell-remount races).
- `coerce()` strips non-`[\d.\-]` chars then `Number()`, returns `null` for non-finite; truncates if `integer`.
- The Stencil component (`<falcon-input-number>` / `<falcon-input-number-tw>`) owns ALL format/parse/clamp/step logic — the wrapper is a thin tag-switcher (`[CODE]` lines 1-15 header comment).

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-input-number>` (Shadow) / `<falcon-input-number-tw>` (Light DOM). Owns `Intl.NumberFormat` formatting, parsing, clamp, step, numeric keystroke/paste/beforeinput filtering. Pure presentational.
- **Angular wrapper** — `<falcon-angular-input-number>`: `ControlValueAccessor`, `coerce()`, tag-switch via `useTailwind`, registers tags via `defineFalconTwComponent('falcon-input-number')`.
- Per `feedback_library_skeleton_app_api`, the wrapper fetches no data — the parent state slice does.
- Note: a 2026-05-17 refactor changed this from a *composition* wrapper (which rendered `<falcon-angular-input>` + 2× `<falcon-angular-button>`) to a tag-switcher. The OVERVIEW.md still describes the old composition model — the live source is the tag-switcher.

## Integration gotchas
- `[CODE]` **`coerce()` regex `[^\d.\-]` strips locale separators** — for Arabic / grouped-number input, the Stencil component's `Intl`-based `parse()` (via `formatToParts`) is the real parser; `coerce()` is a coarse CVA-side fallback. Changing the regex risks breaking locale inputs (`[VAULT]` DECISION §10).
- `[CODE]` **Bind to `FormControl<number | null>`** — never `<string>`. CVA emits `number | null`.
- `[VAULT]` **Clamp fires on blur only** — an Enter-submit without blur can carry an unclamped value (GAP G1). Trigger `blur()` programmatically on submit, or rely on Reactive validators.
- `[INFERRED]` **`Intl.NumberFormat` is instantiated per format/parse call** — heavy lists should memoise (`[VAULT]` GAP performance note).
- `[INFERRED]` **camelCase wire** — numeric settings ride camelCase JSON to Commerce (platform default).
- `[CODE]` **Never bind both `[value]` and `[(ngModel)]`** — same race trap as `<falcon-angular-input>`.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B01) — wrapper (160 ln) + BOTH Stencil `.tsx` (216 / 359 ln) re-read this pass. `state`-input presence confirmed AND the Shadow-drop + Shadow-numeric-filter-absence parity gaps newly documented (G5/G5b). `coerce()`/`componentOnReady` push/tag-switcher all re-confirmed in source. Backend wiring + PES gates 🟡 cross-referenced from `[MEMORY]` Wave 14; endpoint DTO names not re-read from backend source.
