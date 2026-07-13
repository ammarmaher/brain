# falcon-language — AUDIT (best-practice rubric §5)

> Rubric scored PASS / 🟡 minor / 🟠 medium / 🔴 high-risk. Non-component area: dim **B** (Stencil dual-render) and **E** (React/Vue parity) are N/A — this is plain Angular DI + a JSON asset. **D** (accessibility) is largely N/A (no rendered UI of its own). Every finding cross-listed in `FINDINGS/L03.md`.

## A — Angular 21 conformance

| Check | Verdict | Evidence |
|---|---|---|
| Standalone / no NgModules | ✅ PASS | `[CODE]` Service is `providedIn: 'root'`; pipe is standalone-by-default (no `@NgModule` declares it); initializer is a plain provider object. No NgModule anywhere in the area. |
| `inject()` over constructor params | ✅ PASS | `[CODE]` `translate.service.ts:15-17` (`http`/`languageFacade`/`destroyRef` via `inject()`); `translate.pipe.ts:19-20` (`translateService`/`cdr` via `inject()`). |
| Proper teardown | ✅ PASS | `[CODE]` service language$ subscription uses `takeUntilDestroyed(this.destroyRef)` (`:51`); pipe `ngOnDestroy()` unsubscribes its `get()` subscription (`:58-62`). |
| Zoneless-safe | ✅ PASS | `[CODE]` Reactive via `BehaviorSubject` + `toSignal` + impure-pipe `markForCheck()`. No `setTimeout`-driven view mutation; the `waitForTranslations` poll only resolves a promise, not view state. Host app runs `provideZonelessChangeDetection()` (`host-shell/app.config.ts:92`) and this area works under it. |
| Signals for reactive state | ✅ PASS | `[CODE]` `translations: Signal<TranslationObject>` exposed (`:32-34`) — the documented MF-timing fix. |
| `APP_INITIALIZER` modernization | 🟡 A1 | `[CODE]` `translate.initializer.ts:1,11-16` uses the legacy `APP_INITIALIZER` multi-provider; Angular 21 prefers `provideAppInitializer(() => inject(TranslateService).waitForTranslations())`. The legacy token still works (host-shell uses BOTH styles, `app.config.ts:1,99,118`), so this is a style/consistency nit, not a bug. `risk-class: safe-local`. |

## C — Falcon house rules

| Check | Verdict | Evidence |
|---|---|---|
| Terse `*** ***` banner comments | 🟡 C1 | `[CODE]` This area uses **JSDoc `/** */`** block comments (`translate.service.ts:25-31`, pipe `:5-13`), NOT the Falcon `*** ***` banner style seen in shared-utils. Pre-dates the banner convention (older code). Harmless. `safe-local`. |
| kebab-case filenames | ✅ PASS | `translate.service.ts` / `translate.pipe.ts` / `translate.initializer.ts`. |
| No raw literals leaking to UI | ✅ PASS (by design) | The whole point of the layer; service returns the raw key only as a last-resort fallback. |
| `console.*` discipline | 🟡 C2 | `[CODE]` 3 `console.error`/`console.warn` calls (`:93,173,221`). Reasonable for an i18n loader (load failures + missing keys are dev signals), and the missing-key warn is gated behind `isInitialLoadComplete` to avoid boot spam. Consider a logger abstraction long-term. `safe-local`. |
| DRY | 🟡 C3 | `[CODE]` `loadTranslations()` (`:78-109`) and `loadTranslationsSync()` (`:115-151`) are ~90% duplicated (cache-check → http.get → catchError-fallback → tap-cache). The "sync" variant differs only in the `catchError` fallback guard. Could collapse to one method with a flag. `safe-local`. |

## D — Accessibility

| Check | Verdict | Evidence |
|---|---|---|
| Renders no UI of its own | ✅ N/A | The pipe outputs a plain string into whatever element the consumer placed it in; a11y is the consumer's concern. |
| RTL / direction | 🟠 F2 (see F) | This layer does NOT set `dir`/`lang` — an a11y-adjacent concern, tracked under F2. |

## F — Completeness / consistency / drift

| Finding | Verdict | Evidence | Recommendation | Risk |
|---|---|---|---|---|
| **F1 — en/ar leaf-count drift** | 🟠 | `[CODE]` measured 2026-06-03: `en.json` = **2065** leaf strings, `ar.json` = **2063** → 2 keys present in EN but missing in AR (or vice-versa). The silent en-fallback (`getDefaultLanguageFallback`) MASKS this: an Arabic user hits English text with no error. | Add a build-time key-parity check (en∆ar) to CI; reconcile the 2 missing AR keys. **DO NOT edit bundles this pass** (read-only). | `HIGH-RISK-QUEUE` (i18n content change + needs CI gate; affects user-facing copy in production locale) |
| **F2 — no RTL/`dir`/`lang` writer in this area** | 🟠 | `[CODE]` grep of `libs/falcon/src/language` shows zero `dir`/`document.dir`/`<html lang>` mutation; service only reads `getLanguage()`. Arabic is a supported language but text-direction flip is not owned here. | Confirm where `dir="rtl"` is applied (theme/layout/host facade) and document the seam; if nowhere, that is a real RTL gap. | `HIGH-RISK-QUEUE` (cross-cutting layout/RTL behavior; out-of-scope to fix in language area) |
| **F3 — zero tests** | 🟠 | `[CODE]` no `*.spec.ts` for the service, pipe, or initializer (Glob of the area returns only `.ts` source + `.json`). The nested-key resolver, en-fallback, interpolation, normalize, and the 5 s timeout are all untested. | Add `translate.service.spec.ts` (nested lookup, missing-key fallback chain, interpolation, normalizeLanguage, cache hit) + `translate.pipe.spec.ts` (re-subscribe on key change, teardown). | `safe-local` (additive test files) |
| **F4 — `waitForTranslations` poll + magic timeout** | 🟡 | `[CODE]` `:163-175` uses a `setInterval(50)` + `setTimeout(5000)` poll instead of completing off the `BehaviorSubject`. Functional, but a `firstValueFrom(currentTranslations$.pipe(filter(t => Object.keys(t).length>0)))` with `timeout(5000)` would be cleaner and cancellable. | Optional refactor; behavior is correct today. | `safe-local` |
| **F5 — `loadTranslationsSync` is not actually sync** | 🟡 | `[CODE]` method name + comment say "synchronous" but the body is an async `http.get(...).subscribe()` (`:115-151`). Misleading name; the only "sync" aspect is firing the load immediately at construction. | Rename to `loadInitialTranslations()` for honesty. | `safe-local` |
| **F6 — optional `language$` is contract-implicit** | 🟡 | `[CODE]` `:48` casts the facade to `FalconLanguageFacade & { language$?: Observable<string> }`; the SDK interface (`falcon-facades.interfaces.ts:18-20`) declares ONLY `getLanguage()`. So language-CHANGE reactivity silently depends on an undocumented host extension. Host provides it (`HostLanguageFacade.language$`), but a different host impl could omit it → language never flips at runtime without a reload. | Add `language$?: Observable<string>` to `FalconLanguageFacade` to make the reactive contract explicit. | `HIGH-RISK-QUEUE` (SDK public-interface change; affects host-remote contract) |
| Barrel completeness | ✅ PASS | `[CODE]` `index.ts` re-exports all 3 modules + the 2 types; `@falcon` re-exports the area (`libs/falcon/src/index.ts:27`). |

## Rubric summary

| Dim | Score |
|---|---|
| A — Angular 21 | ✅ PASS (1 🟡 modernization: A1) |
| B — Stencil dual-render | ✅ N/A |
| C — Falcon house rules | ✅ PASS (3 🟡: C1 JSDoc-not-banner, C2 console, C3 dup-loader) |
| D — Accessibility | ✅ N/A (RTL tracked under F2) |
| E — Cross-framework parity | ✅ N/A |
| F — Completeness/drift | 🟠 MEDIUM — F1 (en/ar drift) · F2 (no RTL writer) · F6 (implicit `language$`) are the substantive ones; F3 (no tests) additive |

**Area verdict: 🟡 GOOD with 🟠 medium gaps.** The runtime mechanism is solid (cache, en-fallback, signal-for-late-load, boot-blocking initializer, clean teardown). The medium gaps are governance/contract issues (bundle parity, RTL seam, implicit `language$`), not correctness bugs in the resolver.

**HIGH-RISK-QUEUE items from this area: 3** — F1 (i18n content/CI), F2 (RTL seam), F6 (SDK interface change).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L03). Rubric applied line-by-line; en/ar leaf delta measured on disk; absence of specs + RTL writer + explicit `language$` confirmed by Glob/Grep. No source edited.
