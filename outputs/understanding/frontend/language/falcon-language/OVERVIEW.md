# falcon-language — OVERVIEW

> Non-component area dossier (SWEEP-SPEC §7 lighter 5-file set). This is the `@falcon/language` i18n layer — a runtime JSON-bundle translation service + pipe + `APP_INITIALIZER` preloader. It is NOT a Stencil/Angular UI component, so the 9-file component shape does not apply; mirror falcon-input tone, not its B-rubric.

## Area purpose

The Falcon **runtime i18n layer**. Loads per-language translation JSON bundles (`en.json` / `ar.json`) from `/assets/i18n` over HTTP at runtime, exposes dot-notation key lookup with `{{param}}` interpolation, and re-evaluates on language change. Three public symbols:

- `[CODE]` **`TranslateService`** (`libs/falcon/src/language/lib/services/translate.service.ts`) — `providedIn: 'root'` singleton; loads/caches bundles, resolves keys, exposes a reactive `translations` signal + observable `get()` + synchronous `translate()`.
- `[CODE]` **`TranslatePipe`** (`libs/falcon/src/language/lib/pipes/translate.pipe.ts`) — `name: 'translate'`, `pure: false`; the template-side `{{ 'key' | translate }}` surface.
- `[CODE]` **`translateInitializerProvider`** (`libs/falcon/src/language/lib/translate.initializer.ts`) — `APP_INITIALIZER` multi-provider that blocks app bootstrap until the initial bundle loads (or a 5 s timeout fires).

## Business / UI use case

- Every user-visible string in admin-console, management-console, host-shell, and the shared `libs/falcon` features resolves through `| translate` against these bundles. `[CODE]` Grep `| translate` = **1314 occurrences across 122 files** (excl. `dist/`) on 2026-06-03.
- Bilingual product (English + Arabic). `[CODE]` `translate.service.ts:40` `supportedLanguages = ['en', 'ar']`; `:41` `defaultLanguage = 'en'`.
- Bundles carry the full app vocabulary: `[CODE]` 41 top-level namespaces each (auth `login`/`changePassword`, `hierarchy`/`hierarchy.validation`, `templates`, `walletBalance`/`newWalletBalance`/`walletMgmt`, `contactGroups`, `enum`, `common`, `button`, `errors`, `paymentStatus`, `datepicker`, `topbar`/`sidebar`, …). `en.json` = 2065 leaf strings / 104 645 bytes; `ar.json` = 2063 leaf strings / 132 407 bytes (counts measured 2026-06-03; the 2-string delta is a real parity gap — see AUDIT F1).

## When to use it / when NOT to use it

**Use it for:**
- Any literal string rendered to the user in a template → `{{ 'namespace.key' | translate }}`.
- Programmatic strings in component/service TS (toast text, computed option labels) → `inject(TranslateService).translate('key', params)`.
- Reactive label arrays that must re-render when the language flips or when the bundle finishes loading late (MF remote-embed timing) → read the `translations` signal inside a `computed()`.
- Mapping a backend `FalconKeys.Error` code to a localized message → resolve `keyForBackendCode(code)` from `@falcon` shared-utils `messages.ts`, then `translate(...)` it (see INTEGRATION in shared-utils AUDIT).

**Do NOT use it for:**
- Angular's built-in `$localize` / `@angular/localize` i18n (this is a bespoke runtime alternative; the two do not interoperate).
- Pluralization / ICU message format — `[CODE]` `interpolate()` only does flat `{{name}}` substitution (`translate.service.ts:289-293`); there is no `{count, plural, …}` support.
- Date / number / currency formatting — use Angular `DatePipe`/`DecimalPipe`/`CurrencyPipe` or the `falcon-calendar` locale layer. (`datepicker.*` keys here are only the picker's button/label copy.)
- Direction (RTL) — this layer does NOT set `dir="rtl"` or `<html lang>`; see "RTL / locale switching" below.

## Status

**ACTIVE / IN USE / SOLE i18n MECHANISM.** No deprecation markers in any of the three files. Bespoke (not `@ngx-translate/core`, not `@angular/localize`) — confirmed: `[CODE]` zero `ngx-translate` import anywhere in source; the service hand-rolls cache + nested-key + interpolation.

## Replaces

- `[INFERRED]` A prior `@ngx-translate`-style approach is plausible given the identical `| translate` ergonomics, but no evidence remains in-tree; do NOT assert it. The `messages.ts` header `[CODE]` notes the validation-message catalog was "Moved 2026-05-16 from apps/admin-console/.../validation-messages.ts" — i.e. i18n keys were consolidated INTO this bundle from feature-local files.

## Source file paths

| Layer | Path |
|---|---|
| Service | `libs/falcon/src/language/lib/services/translate.service.ts` (327 lines) |
| Pipe | `libs/falcon/src/language/lib/pipes/translate.pipe.ts` (64 lines) |
| Initializer | `libs/falcon/src/language/lib/translate.initializer.ts` (17 lines) |
| Area barrel | `libs/falcon/src/language/index.ts` |
| English bundle | `libs/falcon/src/language/i18n/en.json` (41 namespaces / 2065 leaves / 104 645 B) |
| Arabic bundle | `libs/falcon/src/language/i18n/ar.json` (41 namespaces / 2063 leaves / 132 407 B) |
| `@falcon` re-export | `libs/falcon/src/index.ts:27` (`export * from './language'`) |
| Consumed facade contract | `libs/sdk/src/types/falcon-facades.interfaces.ts:18-20` (`FalconLanguageFacade.getLanguage()`) |
| Facade token | `libs/sdk/src/tokens/falcon-facades.tokens.ts:28-30` (`FALCON_LANGUAGE`) |
| Host facade impl | `apps/host-shell/falcon-facades/host-language.facade.ts` (`HostLanguageFacade`, adds writer + `language$`) |
| Spec/tests | **NONE** — no `*.spec.ts` for service, pipe, or initializer (AUDIT F3). |

## Selectors / tokens

| Layer | Symbol |
|---|---|
| Pipe name | `translate` (`{{ key \| translate }}` / `{{ key \| translate: params }}`) |
| Service injection | `inject(TranslateService)` (root singleton) |
| Initializer provider | `translateInitializerProvider` (spread into app `providers`) |
| DI dependency | `FALCON_LANGUAGE` token → host `FalconLanguageFacade` |

## Known consumers (grep verified 2026-06-03)

- `[CODE]` `| translate` (pipe) = **1314 occurrences / 122 files** (excl. `dist/`). Heaviest: templates-page wizard steps (admin + mgmt), org-hierarchy info-panel (40 each side), contracts-cost-management, contact-groups, new-wallet-balance, auth flows (login/get-started/change-password/forgot-password/enter-otp), and shared `libs/falcon` features (user-details-page:61, comm-mkt-view, service-pricing-table).
- `[CODE]` `TranslateService` (programmatic) imported in **122 files** total (overlaps pipe usages; includes `.ts` injectors like `add-user-wizard.component.ts`, `templates-page-state.service.ts`, `node-drawer-state.signals.ts`, and `libs/falcon/src/shared-utils/lib/validations/messages.ts` for the error-key catalog).
- `[CODE]` `translateInitializerProvider` wired in all 3 app configs: `host-shell/app.config.ts:118`, `admin-console/app.config.ts:50`, `management-console/app.config.ts:46`.

See `USAGE.md` Consumer Sweep for the enumerated list.

## RTL / locale switching (how language actually flips)

- `[CODE]` The service is a **read-only consumer** of `FALCON_LANGUAGE`. It reacts to a host-provided `language$` observable if one exists (`translate.service.ts:48-55`), else only reads `getLanguage()` once at construction (`:58-59`).
- `[CODE]` The host owns the writer: `HostLanguageFacade` (`host-language.facade.ts`) persists `localStorage['lang']`, seeds the `BehaviorSubject`, exposes `language$`, and the host-only `setLanguage(lang)` pushes the change. The SDK interface `FalconLanguageFacade` itself declares ONLY `getLanguage()` (`falcon-facades.interfaces.ts:18-20`) — `language$` is an OPTIONAL extension the service probes for defensively.
- `[CODE]` `normalizeLanguage()` (`translate.service.ts:65-73`) takes the first 2 chars lowercased ("en Host" → "en") and falls back to `'en'` for any unsupported code.
- `[INFERRED / GAP]` **No `dir`/`<html lang>` writer lives in this layer.** Setting `dir="rtl"` for Arabic is NOT this area's responsibility; it must happen elsewhere (theme/layout). This dossier does not assert where — flagged as AUDIT F2 (RTL direction toggle out of scope here). Per `[MEMORY]` the platform supports RTL/Arabic, but the mechanism is not in `libs/falcon/src/language`.

## Missing-key behavior (verified)

`[CODE]` `translate()` resolution order (`translate.service.ts:191-232`):
1. Nested dot-path lookup in the active bundle (`getNestedValue`, `:276-283`).
2. If missing/non-string → **fall back to the English bundle** for the same key (`getDefaultLanguageFallback`, `:260-270`) — only if not already on `en` and the `en` bundle is cached.
3. If still missing → `console.warn('[TranslateService] Translation key not found: "<key>"')` **only once initial load is complete** (avoids boot spam), then **return the raw key string** as last resort (`:220-223`).
- `has(key)` (`:305-309`) returns whether a key resolves to a string in the CURRENT bundle (no en-fallback).
- Empty key → returns `''` (`:192`).

## Related areas

- `@falcon/sdk` facades (`FALCON_LANGUAGE` token + `FalconLanguageFacade`) — the host-remote bridge this service reads from.
- `@falcon` shared-utils `messages.ts` — produces `hierarchy.validation.*` message keys that this layer then resolves; the two are designed to compose (validator emits key → `translate(key)` renders copy). Both bundles confirmed to carry `hierarchy.validation` (43 keys) + `validation` (14 keys) namespaces on 2026-06-03.
- `falcon-calendar` / `datepicker.*` bundle keys — picker UI copy.

## Ownership / responsibility

`libs/falcon` (the unified shared library, `@falcon`). The service + pipe + initializer ship in `@falcon`; the bundles ship as build-copied assets to `/assets/i18n`. Host apps own the language WRITER (facade).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L03 sweep). All three source files read in full; bundle structure measured on disk (41 namespaces, 2065/2063 leaves); consumer counts grep'd; `FALCON_LANGUAGE`/`HostLanguageFacade` wiring confirmed; en/ar leaf-count delta + absent RTL writer + absent specs flagged as new-area findings.
