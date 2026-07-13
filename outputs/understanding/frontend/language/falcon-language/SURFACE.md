# falcon-language — SURFACE (public API / exports)

> Full export inventory of `@falcon/language` (re-exported through `@falcon`). Source-prefixed signatures + one-line purpose. Barrel: `libs/falcon/src/language/index.ts`.

## Barrel exports (`index.ts`)

`[CODE]` `libs/falcon/src/language/index.ts`:
- `export * from './lib/services/translate.service'` → `TranslateService` (class) + `TranslationKey`, `TranslationObject` (types; also explicitly re-exported as `export type`).
- `export * from './lib/pipes/translate.pipe'` → `TranslatePipe`.
- `export * from './lib/translate.initializer'` → `translateInitializer` (fn) + `translateInitializerProvider` (const).

**Total public surface: 1 service, 1 pipe, 1 provider const, 1 factory fn, 2 types.**

## Types

| Type | Definition | Purpose |
|---|---|---|
| `TranslationKey` | `[CODE]` `= string` (`translate.service.ts:8`) | Semantic alias for a dot-notation key. |
| `TranslationObject` | `[CODE]` `= Record<string, unknown>` (`translate.service.ts:9`) | A loaded bundle (nested object of namespaces → strings). |

## `TranslateService` (root singleton)

`[CODE]` `@Injectable({ providedIn: 'root' })` (`translate.service.ts:11-14`). Injects `HttpClient`, `FALCON_LANGUAGE` (as `FalconLanguageFacade`), `DestroyRef` via `inject()`.

### Public members

| Member | Signature | Purpose | Source |
|---|---|---|---|
| `translations` | `readonly Signal<TranslationObject>` | Reactive snapshot of the active bundle; lets `computed()` option arrays re-evaluate when bundles load late (MF embed timing). `toSignal(currentTranslations$, { initialValue: {} })`. | `:32-34` |
| `waitForTranslations()` | `(): Promise<void>` | Resolves when initial load completes; resolves anyway after a **5000 ms** timeout (logs a warn). Polls a `setInterval(50ms)`. Consumed by the `APP_INITIALIZER`. | `:156-177` |
| `translate(key, params?)` | `(key: TranslationKey, params?: Record<string, string \| number>): string` | **Synchronous** lookup. Nested dot-path → en-fallback → warn+raw-key. Interpolates `{{param}}` if `params`. Returns `''` for empty key. | `:191-232` |
| `get(key, params?)` | `(key: TranslationKey, params?: Record<string, string \| number>): Observable<string>` | **Reactive** lookup over `currentTranslations$`; re-emits on language change. Same en-fallback. (Used by the pipe.) | `:237-254` |
| `getCurrentLanguage()` | `(): string` | Normalized active language code (`'en'`/`'ar'`). | `:298-300` |
| `has(key)` | `(key: TranslationKey): boolean` | True iff key resolves to a string in the CURRENT bundle (no en-fallback). | `:305-309` |
| `getTranslations()` | `(): TranslationObject` | Shallow copy of the active bundle. | `:314-316` |
| `reload()` | `(): void` | Drops the current-language cache entry + reloads it. | `:321-325` |

### Private members (not exported, documented for completeness)

`[CODE]` `translationsCache: Map<string, TranslationObject>` (`:20`) · `currentTranslations$: BehaviorSubject<TranslationObject>` (`:23`) · `isInitialLoadComplete: boolean` (`:37`) · `supportedLanguages = ['en','ar']` (`:40`) · `defaultLanguage = 'en'` (`:41`) · `translationsPath = '/assets/i18n'` (`:43`) · `normalizeLanguage()` (`:65`) · `loadTranslations()` (async, `:78`) · `loadTranslationsSync()` (`:115`) · `getDefaultLanguageFallback()` (`:260`) · `getNestedValue()` (`:276`) · `interpolate()` (`:289`).

### Construction side-effects

`[CODE]` `constructor()` (`:45-60`): if `(languageFacade as …).language$` exists → subscribe (`takeUntilDestroyed`) and `loadTranslations(normalize(lang))` on each emit; then unconditionally `loadTranslationsSync(normalize(getLanguage()))` for the initial table. So injecting the service eagerly kicks off the HTTP fetch.

## `TranslatePipe`

`[CODE]` `@Pipe({ name: 'translate', pure: false })` implements `PipeTransform, OnDestroy` (`translate.pipe.ts:14-18`). Injects `TranslateService` + `ChangeDetectorRef`.

| Member | Signature | Purpose | Source |
|---|---|---|---|
| `transform(key, params?)` | `(key: string, params?: Record<string, string \| number>): string` | Subscribes to `translateService.get(key, params)` (re-subscribes only when key/params change), caches `lastValue`, `markForCheck()` on emit. Falls back to synchronous `translate()` until the first emit lands. Returns `''` for empty key. | `:26-56` |
| `ngOnDestroy()` | `(): void` | Unsubscribes the inner `get()` subscription. | `:58-62` |

**Impure pipe** (`pure: false`) so it re-evaluates on every CD pass — necessary to react to language changes; cost is mitigated by the internal `lastKey`/`lastParams` memo (`:33`) which only re-subscribes on actual key/param change.

## `translateInitializer` + `translateInitializerProvider`

`[CODE]` `translate.initializer.ts`:

| Symbol | Signature | Purpose | Source |
|---|---|---|---|
| `translateInitializer` | `(translateService: TranslateService) => () => Promise<void>` | Factory returning the initializer fn; the inner fn returns `translateService.waitForTranslations()`. | `:4-9` |
| `translateInitializerProvider` | `{ provide: APP_INITIALIZER, useFactory: translateInitializer, multi: true, deps: [TranslateService] }` | Drop-in multi-provider for app `providers[]`. Blocks bootstrap until the initial bundle resolves (or 5 s timeout). | `:11-16` |

> Note: uses the legacy `APP_INITIALIZER` token, NOT the Angular-21 `provideAppInitializer()` helper. `[CODE]` `host-shell/app.config.ts:1` imports `provideAppInitializer` for the ThemeService and still spreads `translateInitializerProvider` (the classic token) at `:118` — both coexist. (AUDIT A1: modernization opportunity.)

## DI contract consumed (not owned here)

| Symbol | Where | Purpose |
|---|---|---|
| `FALCON_LANGUAGE` | `[CODE]` `libs/sdk/src/tokens/falcon-facades.tokens.ts:28-30` | `InjectionToken<FalconLanguageFacade>` the service resolves. |
| `FalconLanguageFacade` | `[CODE]` `libs/sdk/src/types/falcon-facades.interfaces.ts:18-20` | `{ getLanguage(): string }` — the only contractual method. `language$` is an undocumented optional the service probes for. |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L03). Every signature lifted directly from source with line numbers; barrel re-exports confirmed; `APP_INITIALIZER` vs `provideAppInitializer` coexistence confirmed against host-shell app.config.
