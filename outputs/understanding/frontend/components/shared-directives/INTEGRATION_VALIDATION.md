# Shared directives — Integration & Validation Layer

> Layer 3 of 3. UI layer → `OVERVIEW.md` etc. Business layer → `BUSINESS.md`.
> `shared-directives` is a directive bundle, not a visual component. This file describes **where the directives bind** — the DOM elements they attach to, the Angular forms machinery they hook, and the one directive that touches the network.

## Owning backend module(s)
**None — except `FalconCheckExistsDirective`, indirectly.** `[CODE]` 11 of the 12 directives are pure client-side (sync validators, masks, DOM mutators) — no HTTP, no backend module.
`[CODE]` `falcon-check-exists.directive.ts:41` — `FalconCheckExistsDirective` is the **only** directive that reaches a backend, and it does so **indirectly**: the consumer injects a service method `(value: string) => Observable<boolean>` via the `[falconCheckExistsApi]` input. `[INFERRED]` That method typically calls **Commerce** (account-name / finance-id existence) or **Identity** (username existence) through the appropriate gateway. The directive itself is module-agnostic — it calls whatever observable it is handed.

## Backend wiring
| Directive | Endpoint | Mechanism | Backend module | Notes |
|---|---|---|---|---|
| `FalconCheckExistsDirective` | consumer-supplied | `[falconCheckExistsApi]: (value)=>Observable<boolean>` | Commerce / Identity (consumer's choice) | The directive never names an endpoint — the consumer's service method does. |
| all other 11 | — | — | none | pure client-side. |

## Where the directives bind
`[CODE]` directive `selector`s — the DOM/form attachment points:
| Directive | Selector | Binds to |
|---|---|---|
| `FalconFormValidateDirective` | `form[falconFormValidate]` | a `<form>` element only; takes `NgForm` as required input. |
| `FalconColumnNameDirective` | `input[falconColumnName]` | an `<input>` element only. |
| `FalconStartWithLetterDirective` | `[falconStartWithLetter]` | any control element with `ngModel`/`formControl`. |
| `FalconStartWithLetterMax30Directive` | `[falconStartWithLetterMax30]` | same. |
| `FalconLettersDigitsMaxDirective` | `[falconLettersDigitsMax]` | same. |
| `FalconUsernameFormatDirective` | `[falconUsernameFormat]` | same. |
| `FalconPhoneNumberDirective` | `[falconPhoneNumber]` | same. |
| `FalconPhoneMaskDirective` | `[falconPhoneMask]` | a text/`tel` input — CVA + validator. |
| `FalconIpAddressDirective` | `[falconIpAddress]` | a text input — CVA + validator. |
| `FalconCheckExistsDirective` | `[falconCheckExists]` | any control — async validator. |
| `FalconEffectiveDateDirective` | `[falconEffectiveDate]` | any control — no-op validator. |
| `FalconTruncateDirective` | `[falconTruncate]` | any text-bearing element. |

## How they hook the Angular forms machinery (the integration contract)
`[CODE]` directive `providers`:
| Provider token | Directives | Effect |
|---|---|---|
| `NG_VALIDATORS` | `FalconStartWithLetter*`, `FalconLettersDigitsMax`, `FalconUsernameFormat`, `FalconPhoneNumber`, `FalconPhoneMask`, `FalconIpAddress`, `FalconEffectiveDate` | sync validation — runs on every value change, contributes to `control.errors`. |
| `NG_ASYNC_VALIDATORS` | `FalconCheckExistsDirective` | async validation — `control.status` goes `PENDING` while the debounced API is in flight. |
| `NG_VALUE_ACCESSOR` | `FalconPhoneMaskDirective`, `FalconIpAddressDirective` | these mutate the input value (mask / sanitize) — they ARE the CVA, so they own `writeValue`/`onChange`. |

`[INFERRED]` Integration consequence: `NG_VALIDATORS` directives compose freely (stack many on one input); but only **one** `NG_VALUE_ACCESSOR` may exist per control — `FalconPhoneMask` and `FalconIpAddress` cannot both be on the same input, and neither can coexist with another CVA directive on that element.

## Validation rules (V-*)
| Directive | Error key emitted | Trigger |
|---|---|---|
| `FalconCheckExistsDirective` | `{ falconCheckExists: { message } }` | API returns `exists===true`. |
| `FalconStartWithLetterDirective` | validator's key (`startWithLetter`) | value does not start with a letter. |
| `FalconLettersDigitsMaxDirective` | validator's key | non-alphanumeric or over max length. |
| `FalconUsernameFormatDirective` | validator's key | username format violated. |
| `FalconPhoneNumberDirective` / `FalconPhoneMaskDirective` | `phoneNumber` / min-max digit error | bad format / digit count outside 7–15. |
| `FalconIpAddressDirective` | IP-validity error | not a valid IPv4/IPv6 for the locked mode. |
| `FalconEffectiveDateDirective` | **none** | `[CODE]` `:34-37` always returns `null`. |
`[CODE]` `GAPS_AND_UPGRADES.md` #11 — error keys are **fixed**; no `errorKey` input to rename them.

## PES keys gating these directives
**None.** `[INFERRED]` Directives are field-level mechanics; PES gating happens at the field/section level (the parent renders the host input `[disabled]`), and a disabled control does not run validators.

## State / signal pattern
`[CODE]` `falcon-check-exists.directive.ts:58-68` — `FalconCheckExists` holds a persistent `Subject` (`value$`), a per-value `Map` cache, and a single `pending` resolver. The debounced pipeline (`debounceTime` → `distinctUntilChanged` → `switchMap` → `tap`) is built once (`ensurePipeline`) and torn down with `takeUntilDestroyed(this.destroyRef)`.
`[CODE]` `falcon-ip-address.directive.ts:49-53` — `FalconIpAddress` exposes a `mode$` observable (`Subject<IpMode>`) so the host component can react to IPv4/IPv6 mode detection.
`[CODE]` `falcon-form-validate.directive.ts:21-33` — `FalconFormValidate` holds `Map`s of error elements, required-label keys, status subscriptions, and an insertion-point cache; uses a `MutationObserver` to re-scan dynamically added controls.
`[INFERRED]` These directives predate the signal-input convention — they use classic `@Input()` + RxJS, not `input<T>()`.

## Skeleton ↔ app-wrapper layering
`[INFERRED]` Directives have **no skeleton/wrapper split** — they are not Stencil. Each is a single standalone Angular directive in `libs/falcon/src/shared-ui/`. The "library vs app" split here is: the *directive* (shared, generic mechanics) vs the *consumer-supplied input* — most notably `FalconCheckExists`'s `[falconCheckExistsApi]`, where the app injects the actual service call. Per `feedback_library_skeleton_app_api`, the directive stays service-free; the app supplies the network function.

## Integration gotchas
- `[CODE]` `falcon-form-validate.directive.ts` + `GAPS_AND_UPGRADES.md` #1 **`FalconFormValidate` still targets PrimeNG selectors** (`.p-dropdown`, `.p-inputnumber`, `.p-calendar`, …) — these match **nothing** after Wave PR-8 removed PrimeNG. Error rendering on those (now-Falcon) inputs may silently not fire.
- `[CODE]` `GAPS_AND_UPGRADES.md` #6 **`FalconFormValidate` reads a raw `errorMessage` HTML attribute** (`element.getAttribute('errorMessage')`) — not an Angular `@Input()`. Consumers must set it as a plain attribute; this is undocumented.
- `[CODE]` `GAPS_AND_UPGRADES.md` #2 **`FalconFormValidate` writes inline styles** (`style.color`, `style.fontSize`, …) — violates `feedback_no_inline_styles_tokens_only`. Causes `!important` battles.
- `[INFERRED]` **One CVA per control** — `FalconPhoneMask` and `FalconIpAddress` (both `NG_VALUE_ACCESSOR`) cannot share an input.
- `[CODE]` `falcon-check-exists.directive.ts:90` **`FalconCheckExists` without `[falconCheckExistsApi]` silently no-ops** — `validate()` returns `null` if the API is unset.
- `[CODE]` `falcon-form-validate.directive.ts:41-55` `FalconFormValidate` wires listeners in `ngAfterViewInit` (not `ngOnInit`) — it needs the rendered form. Binding it on a non-`<form>` element does nothing (the selector restricts, but the contract is form-specific).
- `[CODE]` `falcon-check-exists.directive.ts:62` cache is **per-instance** — re-mounting re-checks confirmed values (`GAPS_AND_UPGRADES.md` #7).

## Verification
🟡 CODE-DERIVED from the 12 directive source files (`falcon-check-exists`, `falcon-form-validate`, `falcon-ip-address`, `falcon-effective-date` read in full; others via `OVERVIEW.md`/`API.md`). Provider tokens + selectors ✅ VERIFIED in source. The PrimeNG-selector dead-code + inline-style violations ✅ VERIFIED via `GAPS_AND_UPGRADES.md` cross-referenced to `falcon-form-validate.directive.ts`.
