# falcon-language — DECISION

## Brain SK final recommendation

**STATUS: READY / KEEP / SOLE i18n MECHANISM.** Use `@falcon` `TranslateService` + the `translate` pipe for every user-visible string. Do not introduce a second i18n library (`@ngx-translate`, `@angular/localize`) — that would fork the vocabulary and the runtime cache.

## Use this area for

- All template strings → `{{ 'namespace.key' | translate }}` (+ `: { param }` for `{{param}}` interpolation).
- All programmatic user-facing strings in TS → `inject(TranslateService).translate('key', params)`.
- Reactive label arrays that must survive late bundle load / language flip → read `i18n.translations()` inside a `computed()`.
- Backend `FalconKeys.Error` → localized copy → `translate(keyForBackendCode(code))` (composes with `@falcon` shared-utils `messages.ts`).

## Avoid this area for

- Pluralization / ICU / gender selection → unsupported (`interpolate()` is flat `{{name}}` only). Pre-compute the variant key in TS and translate that.
- Date / number / currency formatting → Angular pipes or the calendar locale layer.
- Text-direction (RTL) → NOT this layer (set `dir`/`lang` in theme/layout — see AUDIT F2).
- Reading raw JSON bundles directly → always go through the service.

## Preferred usage path

**Template pipe `| translate`** is the default (1314 uses). Reach for the **service** (`translate()`/`translations()`) only when the string is built in TS or must drive a `computed()`. Use `get()` (observable) rarely — the pipe already wraps it; manual `get()` subscriptions need manual teardown.

## Required upgrades before wider use

None block usage today. Prioritized improvements (all from AUDIT):
1. **F1 — en/ar key-parity CI gate** (medium): the silent en-fallback hides 2 missing AR keys; production Arabic users see English. Add a build check. *HIGH-RISK-QUEUE — touches i18n content + CI.*
2. **F6 — declare `language$?` on `FalconLanguageFacade`** (medium): make the language-change contract explicit instead of a defensive cast. *HIGH-RISK-QUEUE — SDK interface change.*
3. **F2 — document/own the RTL `dir` seam** (medium): confirm where Arabic flips direction. *HIGH-RISK-QUEUE — cross-cutting.*
4. **F3 — add specs** (safe-local, additive).
5. **A1 — migrate to `provideAppInitializer()`**, **C3/F5 — collapse the two loaders + rename** (safe-local polish).

## Relationship to other areas

- **Consumes** `@falcon/sdk` `FALCON_LANGUAGE` + `FalconLanguageFacade` (host owns the writer via `HostLanguageFacade`).
- **Composes with** `@falcon` shared-utils `messages.ts` (validator/backend error keys → `hierarchy.validation.*` → translated copy).
- **Siblings** in `@falcon`: theme (dark mode), shared-ui components (all consume `| translate`).

## Exact rule for future implementation tasks

1. **New user-visible string?** Add the key to BOTH `en.json` and `ar.json` (never EN-only), then `{{ 'key' | translate }}`.
2. **String in TS?** `inject(TranslateService).translate('key', params)`.
3. **Option/label arrays?** Build them in a `computed()` that reads `i18n.translations()`.
4. **Params?** Flat `{{name}}` only — no plural/ICU.
5. **Backend error?** `translate(keyForBackendCode(code))`.
6. **Never** add a second i18n library; **never** read bundle JSON directly; **never** expect this layer to set `dir="rtl"`.

---

## Dynamic capability assessment (10-axis)

### 1. What is static today?
- `[CODE]` `supportedLanguages = ['en','ar']`, `defaultLanguage = 'en'`, `translationsPath = '/assets/i18n'` are hardcoded constants (`translate.service.ts:40-43`). Adding a 3rd language requires a code edit, not config.
- The 5000 ms `waitForTranslations` timeout (`:175`) is a hardcoded literal.
- The `{{param}}` interpolation regex `:290` is fixed (no custom delimiter).

### 2. What is dynamic through inputs/API?
- Active language is fully dynamic via the host `FalconLanguageFacade` (`getLanguage()` + optional `language$`); flipping it re-loads + re-emits to every pipe.
- `translate(key, params)` / `get(key, params)` are runtime-parameterized.
- `reload()` lets a consumer force a re-fetch (e.g. after a hot bundle swap).

### 3. What is dynamic through slots / templates?
- N/A — not a component. The "template surface" is the `| translate` pipe in consumer HTML.

### 4. What is dynamic through token/theme overrides?
- N/A — no CSS tokens. (RTL/theme is a separate layer.)

### 5. What is dynamic through Tailwind classes?
- N/A.

### 6. What is missing to make it reusable across pages?
- Nothing for reuse — it is already global (`providedIn:'root'`, 122 consumers). The missing pieces are governance (key-parity, RTL seam, explicit `language$`), not reusability.

### 7. What capability should be shared (not page-hacked)?
- Already maximally shared. Do NOT let any page read the JSON or hand-roll its own lookup — funnel everything through this service.

### 8. What flags/options would make it better?
- A `supportedLanguages` / `defaultLanguage` / `translationsPath` provider config (so a 3rd locale or a different asset path is wiring, not a code edit).
- A `missingKeyHandler` hook (throw / log / return key) instead of the hardcoded warn+key.
- ICU/plural support (or a thin `translatePlural()` helper).

### 9. What is the safest upgrade path?
1. **Phase A (zero risk):** add specs (F3); migrate to `provideAppInitializer` (A1); collapse the two loaders + rename (C3/F5).
2. **Phase B (additive provider):** introduce `provideFalconLanguage({ supported, default, path, missingKeyHandler })` mirroring `provideFalconValidations`; keep current hardcoded defaults as fallback.
3. **Phase C (contract):** add `language$?` to `FalconLanguageFacade` (F6).
4. **Phase D (governance):** en/ar parity CI gate (F1) + document the RTL `dir` seam (F2).
All additive — no consumer break.

### 10. What is risky to change because pages depend on it?
- The pipe NAME `translate` — 1314 templates key off it; renaming breaks every consumer.
- The en-fallback behavior — silently masks missing keys; "fixing" it to throw would surface 2+ live gaps as runtime errors in Arabic. Pair any change with F1's reconciliation first.
- The raw-key-as-last-resort return — some consumers may visually depend on seeing the key during dev; changing it to `''` could blank UI unexpectedly.
- The `providedIn:'root'` singleton + eager constructor fetch — anything assuming a single shared cache across the MF apps relies on this.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L03). Recommendation = KEEP/READY. Hardcoded constants, dynamic seams, and the 4 prioritized upgrades all traced to source lines in AUDIT.md. No source edited.
