# Falcon Form-Validation — AUDIT (best-practice rubric §5)

> Read-only audit at the **architecture / system** level (the per-file code-quality of the registry + shim is L03's scope; per-directive quality is B23's). Score PASS / 🟡 / 🟠 / 🔴, source-prefixed. **Fixed NOTHING** (SPEC §0). Findings rows also in `plans/library-deep-dive/FINDINGS/L05.md`.
> Rubric: A=Angular21 · B=Stencil (N/A) · C=Falcon house rules · D=Accessibility · E=Cross-framework (N/A) · F=Completeness/consistency/drift. **Architecture dimension folded into A+F.**

## A — Angular 21 / DI architecture

- ✅ Clean DI-token design: `FALCON_VALIDATIONS` mirrors the `FALCON_AUTH/FALCON_THEME` facade pattern ([CODE] `falcon-validation.token.ts:2`); `provideFalconValidations()` is `EnvironmentProviders` via `makeEnvironmentProviders` ([CODE] `provide-falcon-validations.ts:17`). Overridable per-app.
- ✅ Pure-function validators (no Angular deps beyond `@angular/forms` types) → zoneless-safe, trivially testable. Async validators use rxjs `timer/switchMap/finalize` correctly ([CODE] `falcon-validations.ts:462-577`).
- ✅ **Signal-aware async validator** — `userNameUnique` writes its `pendingSignal` via `untracked()` to avoid NG0600 inside caller `computed()`s ([CODE] `falcon-validations.ts:547-556`); a genuinely correct zoneless integration (L03 marked this PASS/exemplary).
- ✅ `FalconFieldRules<T>` generic gives type-safe per-field key suggestions ([CODE] `falcon-validation.token.ts:11-13`).
- 🟡 **A1 — MF singleton fragility of `FALCON_VALIDATIONS`.** `provideFalconValidations()` is wired in admin + mgmt app.config but NOT host-shell ([CODE] Grep — 2 hits, both remotes). Because validators are mostly consumed via the **named aliases** (which bind to `defaultFalconValidationsRegistry` at module load, NOT via DI), the token is effectively used by few consumers — so a missing host-shell provider rarely bites. But any component that does `inject(FALCON_VALIDATIONS)` while rendered in a host-shell context (e.g. an embedded `@falcon` feature) would throw NullInjectorError. Document the wiring requirement. `risk-class: safe-local` (doc) / `HIGH-RISK-QUEUE` if a host-shell consumer is added.
- 🟡 **A2 — `translate.pipe` is `pure: false`.** ([CODE] `translate.pipe.ts:16`.) Necessary for language reactivity, but an impure pipe runs every CD cycle; with zoneless + signals a `computed`-based resolver would be cheaper. L03 owns the pipe; flagged here as it's on the validation render hot-path (every error message). `risk-class: safe-local`.

## C — Falcon house rules / SoT discipline

- ✅ **`Validations.xlsx`-SoT source-prefixing is the GOLD standard** ([CODE] `falcon-validations.ts:24-111,433-545`): each charset/length constant cites the exact xlsx cell + valid/invalid sample + superseded PRD rule + dated Wave/BUG. L03 called this the model for the whole sweep's source-prefix doctrine.
- ✅ **DRY via generic primitives**: `maxNodeLevels`/`userLimit`→`integerInRangeFn`, `priceValue`→`integerInRangeFn`, `passwordSecurityLevel`→`enumFn`, `lengthValidator`→`anyString` ([CODE] :641-689). "Reach for a primitive" is enforced in comment + code.
- ✅ Error copy is i18n-keyed via `messages.ts` — never raw strings (the namespace `hierarchy.validation.*`); en/ar in `libs/falcon/i18n`.
- 🟠 **C1 — the deprecated shim is a SECOND, divergent validation source on the public API.** ([CODE] `falcon-validators.ts:1-190` — 8 `@deprecated v1.2.0` symbols still re-exported via `@falcon`.) Its `phoneNumberValidator` is lenient non-E.164 (vs registry strict `E164`), its messages are raw English (vs i18n). New code CAN still import it. This is L03's F2 (HIGH-RISK-QUEUE: public-API removal + migrate `falcon-form-validate.directive.ts` + behavior change) — re-stated here because it's an ARCHITECTURE wart: two layers claim to validate the same fields differently. `risk-class: HIGH-RISK-QUEUE`.
- 🟠 **C2 — THREE parallel encodings of the same business rule.** The Account/Person/Username charset+length contract exists in (1) the registry `falcon-validations.ts` (SoT), (2) the deprecated shim `falcon-validators.ts` (legacy, divergent), and (3) `shared-features/user-details/validations/validations.ts` (a deliberate pure-fn copy, parity-tested — L05 F1). Plus per-step `validations/validations.ts` files compose them. The registry is authoritative, but the rule is physically duplicated in ≥3 files. Managed (parity tests guard #1↔#3), but a consolidation target. `risk-class: HIGH-RISK-QUEUE` (cross-layer validation-behavior consolidation).

## D — Accessibility (of the validation UX)

- ✅ **Pre-touch live errors** via `LIVE_ERROR_KEYS` ([CODE] `messages.ts:69-93`) — length/charset/format/IP/email/phone errors surface at the first wrong character, not gated behind blur. Strong a11y feedback (L03 marked PASS).
- ✅ Error keys carry params (`{min,actual}` etc.) so messages are specific, not generic.
- 🟡 **D1 — the form-validate directive's injected error markup is a `<small class="falcon-error">`, not `role="alert"`.** ([BRAIN-OUT] `shared-directives/API.md:10-11`, B23.) The legacy `FalconFormValidateDirective` injects errors via DOM insertion without an ARIA live region; screen-reader announcement of a freshly-appearing error is unconfirmed. (The modern path is the `falcon-ui-core` CVA control's own `errorMessage`/`aria-invalid`, which IS accessible — see falcon-input D.) Since the directive is nearly dead (Layer-1 dormant), low impact. `risk-class: safe-local`.

## F — Completeness / consistency / drift

- ✅ Barrels complete: `validations/index.ts` re-exports all 5 sub-files; `shared-utils/index.ts` re-exports to `@falcon` with the validations barrel FIRST so the registry `emailValidator` const wins over the shim's legacy fn (L03's deliberate ordering note — fragile but correct).
- ✅ Backend-error crosswalk (`BACKEND_ERROR_KEY`, ~30 codes) keeps server + client messages aligned ([CODE] `messages.ts:111-149`).
- 🟠 **F1 — Layer 1 (directives) is architecturally superseded but not retired.** 7 of the 8 validation directives have 0 live app consumers (B23 Grep); the wizards moved to Layer-2 registry validators bound on Reactive-Forms controls. The directives still compile + export, and `FalconFormValidateDirective` still pulls in the deprecated shim. So the "input-time directive layer" is dead weight that keeps the deprecated shim alive. Consolidation: retire the dormant directives + migrate the form-validate directive off the shim (→ then delete the shim). `risk-class: HIGH-RISK-QUEUE` (dead-code removal must first sweep `falcon-studio*` + future features — B23's queued item).
- 🟡 **F2 — no lib-level spec for the registry/messages** at `shared-utils/` (L03 F3); the business contract (charsets/bands/IPv6/hierarchy/async-unique) is exercised only indirectly by the 3 `tools/validation-tests/*` parity suites + feature specs. The xlsx truth-tables deserve a direct `falcon-validations.spec.ts`. `risk-class: safe-local`.
- 🟡 **F3 — `maxNodeLevelsValidator` carries a dead `_hardCap?` param** ([CODE] `named-validators.ts:135-136`) for call-site back-compat but ignores it (L03 F4). Misleading signature. `risk-class: safe-local`.
- 🟡 **F4 — dual IPv6 validators** (L03 F-IPv6, restated as a SYSTEM risk): the registry's `allowedIpList()` uses `CIDR_OR_IP`/`IPV6_CORE` regex ([CODE] `falcon-validations.ts:64-81`) while the `FalconIpAddressDirective` (Layer 1) uses `ip-utils.isValidIp` — so input-time (directive) and submit-time (registry validator) can DISAGREE on `::1`/`%zone`/IPv4-mapped tails on the security-adjacent IP allowlist. `risk-class: HIGH-RISK-QUEUE` (validation-behavior change on a security surface — L03 owns the fix).

## Audit summary

| Dim | Verdict | Notes |
|---|---|---|
| A — Angular 21 / DI | **🟡 GOOD** | exemplary `untracked`/pure-fn/token design; A1 MF-provider gap, A2 impure pipe |
| B — Stencil | **N/A** | — |
| C — Falcon house rules / SoT | **🟠 MEDIUM** | xlsx source-prefixing + DRY are GOLD; C1 deprecated shim divergence, C2 triple rule-encoding |
| D — Accessibility | **🟡 GOOD** | pre-touch live errors PASS; D1 legacy directive lacks `role="alert"` |
| E — Cross-framework | **N/A** | Angular `@angular/forms` validators (no React/Vue twin) |
| F — Completeness/drift | **🟠 MEDIUM** | F1 Layer-1 superseded-not-retired, F4 dual-IPv6, F2 no lib spec, F3 dead param |

**Overall: 🟡 GOOD architecture with 🟠 mediums on consistency (C+F).** The Layer-2 registry + Layer-3 messages are genuinely best-in-class (xlsx-SoT prefixing, DRY primitives, signal-correct async, backend crosswalk, pre-touch a11y). The mediums are all **layering debt**: an obsolete Layer-1 directive tier propping up a deprecated shim, the same rule encoded in 3 places, and a dual-IPv6 disagreement between layers. None is a 🔴 — the live spine is sound.

**HIGH-RISK-QUEUE items (4):** C1 (deprecated shim removal + migrate form-validate directive — L03 F2), C2 (collapse the triple Account/Person/Username rule encoding — coordinate L05-F1 parity test), F1 (retire the 7 dormant directives after a `falcon-studio*`/future-feature sweep — B23 queued), F4 (unify the dual IPv6 validators on the security-adjacent IP allowlist — L03 F-IPv6).

## Verification
🟢 code-verified 2026-06-03 (L05) — system-level findings grounded in the registry/messages/token/provider/shim files read this pass + the `app.config` Grep (provider wiring) + the B23/L03 dossiers for the directive-dormancy + shim/IPv6 facts (those internal findings cross-referenced, not re-derived). Findings mirrored to `plans/library-deep-dive/FINDINGS/L05.md`. No source edited.
