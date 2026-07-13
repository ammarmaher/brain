# falcon-shared-utils — AUDIT (best-practice rubric §5)

> Scored PASS / 🟡 minor / 🟠 medium / 🔴 high-risk. Non-component area: dim **B** (Stencil) and **E** (React/Vue parity) are N/A — pure TS + Angular forms DI. **D** (a11y) applies only indirectly (error-key copy + the IP directive it backs). Every finding cross-listed in `FINDINGS/L03.md`.

## A — Angular 21 conformance

| Check | Verdict | Evidence |
|---|---|---|
| `inject()` / standalone / no NgModules | ✅ PASS | `[CODE]` Pure functions + plain DI token + `makeEnvironmentProviders` (`provide-falcon-validations.ts:17`); zero `@NgModule`. |
| EnvironmentProviders pattern | ✅ PASS | `[CODE]` `provideFalconValidations()` mirrors `provideFalconFacades` — the modern Angular provider idiom (`:14-23`). |
| Signals-aware | ✅ PASS | `[CODE]` `userNameUnique` takes a `WritableSignal<boolean>` pending flag and writes it via `untracked()` to avoid NG0600 inside caller `computed()`s (`falcon-validations.ts:547-556`) — a correct, deliberate zoneless/signal integration. `allFieldsValid`/`fieldErrorMessage` are pure, designed to be called from `computed()`. |
| `ValidatorFn`/`AsyncValidatorFn` typing | ✅ PASS | `[CODE]` All factories return the proper Angular form types; `FalconFieldRules<T>` is type-safe over the form-value shape. |
| No legacy decorators / DI anti-patterns | ✅ PASS | No constructor-injected validators; registry is a plain literal. |

## C — Falcon house rules

| Check | Verdict | Evidence |
|---|---|---|
| Terse `*** ***` banner comments | ✅ PASS | `[CODE]` `index.ts`, `ip-utils.ts`, `named-validators.ts`, `messages.ts`, `falcon-validation.token.ts`, `provide-falcon-validations.ts`, `falcon-validations.ts` all use the `*** ***` banner style consistently. (Only `theme-utils.ts`, `contact-group.mapper.ts`, `node-scope.util.ts` use JSDoc `/** */` — minor inconsistency, C1.) |
| kebab-case filenames | ✅ PASS | `ip-utils.ts` / `node-scope.util.ts` / `contact-group.mapper.ts` / `falcon-validations.ts` / `named-validators.ts`. |
| No `any` in new code | 🟡 C2 | `[CODE]` `messages.ts:42` `(e as { value?: string })` casts + `enumFn`'s `(v as unknown)` (`falcon-validations.ts:210`) are narrow, justified casts on `ValidationErrors`/`unknown`, not free `any`. Acceptable; note only. |
| DRY / generic-primitive reuse | ✅ PASS (exemplary) | `[CODE]` `maxNodeLevels`/`userLimit`/`priceValue` all delegate to `integerInRangeFn`; `passwordSecurityLevel`→`enumFn`; `lengthValidator`→`anyString`. The "reach for a primitive, don't reinvent" doctrine is enforced in comments (`named-validators.ts:75-94`) AND in the implementation. Genuinely strong. |
| Business-contract source-prefixing | ✅ PASS (gold) | `[CODE]` Every charset/length constant is annotated with the exact `Validations.xlsx` cell, valid/invalid sample, the superseded PRD rule, and the dated Wave/BUG that changed it (`falcon-validations.ts:24-111,433-545`). This IS the source-prefix discipline the sweep wants — a model for other areas. |

## D — Accessibility (indirect)

| Check | Verdict | Evidence |
|---|---|---|
| Error copy is i18n-keyed (not raw) | ✅ PASS | `[CODE]` `messages.ts` emits `hierarchy.validation.*` keys (resolved by `TranslateService`); never returns raw English for the registry path. |
| Pre-touch live errors | ✅ PASS | `[CODE]` `LIVE_ERROR_KEYS` (`messages.ts:69-87`) surfaces length/charset/format errors immediately so screen-reader/keyboard users get feedback at the first wrong char, not only on blur (`:71-74` documents the 2026-05-21 `minLength` add). |
| Legacy shim copy is raw English | 🟡 (under F) | `[CODE]` `FALCON_VALIDATION_MESSAGES` (`falcon-validators.ts:43-58`) is static English, NOT i18n — but it is deprecated and only backs `falcon-form-validate.directive.ts`. Tracked under F2. |

## F — Completeness / consistency / drift

| Finding | Verdict | Evidence | Recommendation | Risk |
|---|---|---|---|---|
| **F1 — zero tests in the lib** | 🟠 | `[CODE]` No `*.spec.ts` under `shared-utils/` (Glob returns only source). The registry is the platform's validation business contract (charsets, length bands, async-unique, hierarchy depth, IPv6 parser) — all untested at the lib level. Feature specs (`add-client-state-signals.spec.ts`, etc.) exercise it indirectly but don't pin the regex/contract. | Add `falcon-validations.spec.ts` (per-validator truth tables incl. xlsx valid/invalid samples), `ip-utils.spec.ts` (the hand-rolled IPv6 shape checker — highest bug-surface), `messages.spec.ts` (key map + LIVE gate), `node-scope.util.spec.ts`. | `safe-local` (additive tests) |
| **F2 — legacy shim still shipped + barrel-exported** | 🟠 | `[CODE]` `falcon-validators.ts` is `@deprecated v1.2.0` "delete in v2.0.0" yet 8 symbols are still re-exported from the barrel (`index.ts:17-26`) and reachable as `@falcon` public API. New code can still import `startWithLetterMax30Validator` / `phoneNumberValidator` (lenient, non-E.164) and silently diverge from the registry. Its `FALCON_VALIDATION_MESSAGES` is raw English (un-i18n'd). | Confirm `falcon-form-validate.directive.ts` is the ONLY live consumer (grep), migrate it to the registry, then delete the shim (the v2.0.0 plan). Until then, an ESLint `no-restricted-imports` on the legacy symbols would prevent new drift. | `HIGH-RISK-QUEUE` (public-API removal + directive migration + behavior change) |
| **F3 — two IPv6 validators with different rules** | 🟠 | `[CODE]` `ip-utils.ts` `isValidIpv6` (`:73-107`, a careful hand-rolled parser with zone-id + IPv4-mapped tail + bracket rejection) vs `falcon-validations.ts` `IPV6_CORE`/`CIDR_OR_IP` (`:64-81`, a separate regex). The registry's `allowedIpList()` uses ITS OWN regex, NOT `ip-utils`. So the directive (input-time) and the validator (form-time) can disagree on edge cases (e.g. `::1` loopback, `%zone`, mapped tails). | Make `allowedIpList()` delegate to `ip-utils.isValidIp(ip, 'unknown')` so input-time and submit-time agree on one IPv6 truth. | `HIGH-RISK-QUEUE` (validation behavior change on a security-adjacent field — IP allowlist) |
| **F4 — `node-scope.util` couples to a magic string** | 🟡 | `[CODE]` Guards compare against `FALCON_ROOT_NODE.id` (the literal `'FALCON_ROOT_NODE'`, per the comment `:9`). Correct + imported from shared-types (not duplicated), but a magic-id contract: if the backend ever issued a real node with that id, the guard would wrongly drop it. | Keep; the value is owned in one place (shared-types `globals`). Note only. | `safe-local` |
| **F5 — `maxNodeLevelsValidator(_hardCap?)` dead param** | 🟡 | `[CODE]` `named-validators.ts:135-136` accepts `_hardCap` for call-site back-compat but ignores it (registry no longer caps). Harmless but misleading; callers may think they're setting a cap. | Drop the param at the next breaking pass + update callers. | `safe-local` |
| **F6 — barrel name-collision is fragile** | 🟡 | `[CODE]` `index.ts:7-26` relies on declaration ORDER (validations FIRST) to make the new `emailValidator` const win over the legacy `emailValidator` fn, plus a hand-maintained explicit-omit list. A future re-order or `export *` of the shim would silently re-shadow it. | The comment is good; deleting the shim (F2) removes the hazard entirely. | `safe-local` |
| **F7 — `getCssVariable` always reads `documentElement`** | 🟡 | `[CODE]` `theme-utils.ts:8` only ever reads `:root`-scoped vars; component-scoped (`:where(falcon-x)`) tokens are unreachable. Fine for theme/palette tokens (which ARE on `:root`), but a footgun if someone expects a component token. | Note in usage; optionally accept an element arg. | `safe-local` |
| **F8 — `numberInRangeFn` coerces strings via `Number()`** | 🟡 | `[CODE]` `falcon-validations.ts:198` `Number(v)` turns `''`-already-handled but e.g. `'12abc'`→NaN→`notNumber` (correct) and `' 12 '`→12 (lenient). Intentional (handles string-typed inputs) but differs from `integerInRangeFn` which uses strict `nval` (number-only). Slight asymmetry. | Document the intended input type per primitive. | `safe-local` |
| Barrel/`@falcon` completeness | ✅ PASS | `[CODE]` sub-barrel `validations/index.ts` re-exports all 5 validation modules; area barrel re-exports utils + validations + curated shim; `@falcon` re-exports the area (`libs/falcon/src/index.ts:59`). |

## Rubric summary

| Dim | Score |
|---|---|
| A — Angular 21 | ✅ PASS (signal/`untracked` integration is exemplary) |
| B — Stencil dual-render | ✅ N/A |
| C — Falcon house rules | ✅ PASS (DRY + xlsx source-prefixing are gold-standard; 1 🟡 C1 JSDoc inconsistency, C2 narrow casts) |
| D — Accessibility | ✅ PASS (i18n-keyed errors + pre-touch live gate) |
| E — Cross-framework parity | ✅ N/A |
| F — Completeness/drift | 🟠 MEDIUM — F2 (deprecated shim still public), F3 (two divergent IPv6 validators) are the substantive risks; F1 (no tests) additive; F4–F8 minor |

**Area verdict: 🟡 GOOD — registry is a model of DRY + business-contract documentation; the medium risks are (a) a still-exported deprecated shim that lets new code diverge, and (b) two IPv6 truths that can disagree on a security-adjacent field.**

**HIGH-RISK-QUEUE items from this area: 2** — F2 (shim removal/migration) + F3 (unify IPv6 validation).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L03). Rubric applied line-by-line across all 12 files; the dual-IPv6 divergence, deprecated-shim export surface, dead `_hardCap`, and barrel-collision fragility all traced to specific lines; absence of lib specs confirmed by Glob. No source edited.
