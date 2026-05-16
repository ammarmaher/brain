# Rules / patterns — wallet-balance-management

## Observed (good)

1. **Standalone components throughout** ([CODE] `wallet-balance-management.component.ts:65 standalone: true`; `balance-transfer.component.ts:34 standalone: true`).
2. **OnPush change detection** on the container ([CODE] `wallet-balance-management.component.ts:80 ChangeDetectionStrategy.OnPush`) with explicit `cdr.markForCheck()` / `cdr.detectChanges()` calls in async paths.
3. **`inject()` function** used for all DI ([CODE] `wallet-balance-management.component.ts:88-95`, `balance-transfer.component.ts:55-56`) — no constructor parameter injection.
4. **`takeUntilDestroyed(this.destroyRef)`** for RxJS lifetime management ([CODE] `wallet-balance-management.component.ts:592, :504, :614`).
5. **PES enforced in three layers**:
   - Route entry (`adminConsoleGuard`)
   - Component init (`primeAccess()`)
   - Per-button / per-region template gates
   plus the server-driven `canSave` flag from the response.
6. **`ServiceOperationResult<T>` envelope** correctly handled — code checks `response.isSuccessful`, surfaces `response.errorMessages` / `response.errors` ([CODE] `wallet-balance-management.component.ts:456, :515, :869`). This matches the platform standard.
7. **Strong typing on response shape** — `IWalletDataResponse` is exhaustive (account info + channels + summary + tree + canSave).
8. **Numeric enums for backend parity** — `Currency`, `WalletBalanceType`, `WalletType`, `NodeType` all use `= 1, = 2, …` mapping documented against C# names ([CODE] `wallet-balance.models.ts:14-50`). Avoids string-to-enum drift.
9. **Translation keys centralized** — `WALLET_BALANCE_TRANSLATION_KEYS` ([CODE] `wallet-balance.models.ts:59-77`) with lookup helpers, instead of string literals strewn across templates.
10. **CSS variable theme tokens** — SCSS uses `var(--color-primary, …)`, `var(--surface-card, …)` etc. with sane fallbacks ([CODE] `wallet-balance-management.component.scss:4-12`). Themable.

## Observed (bad — would be flagged by the night-shift digest)

1. **SCSS files (`.scss`) instead of Tailwind utility classes**. Per project rules (`feedback_falcon_custom_library_mandatory`, `angular-tailwind-skill`, `project_brain_skills_primeng_purge`): **Tailwind utilities only — no SCSS, no component CSS**. Two SCSS files here total **1,616 lines** of hand-rolled BEM-ish `wb-*` and `bt-*` classes. ❌
2. **PrimeNG dependencies pervasive**. The codebase is on a "PrimeNG total removal" track ([MEMORY] `project_falcon_primeng_total_removal_complete`), yet this feature imports:
   - `primeng/api` (TreeNode, MessageService) — drawer + toast core
   - `primeng/toast` (`<p-toast>`)
   - `primeng/autocomplete`, `primeng/select`, `primeng/inputtext`, `primeng/inputnumber`, `primeng/textarea`
   And uses `pi pi-*` PrimeIcons throughout (`pi-wallet`, `pi-building`, `pi-circle`, `pi-send`, `pi-spinner`, `pi-chevron-right/down`, `pi-inbox`, `pi-exclamation-triangle`, `pi-lock`). ❌
3. **`*ngIf` and `*ngFor` instead of `@if`/`@for` block syntax** — 30+ instances across both HTML files ([CODE] `wallet-balance-management.component.html` lines 33, 104, 156, 197, 217, 218, 220, 244, 265, 286, 306, 325, 330, 333, 334, 340, 347, 375, 388, 405, 425, 438, 439; `balance-transfer.component.html` lines 17, 28, 65, 74, 85, 88, 97, 124, 133, 136, 143, 152, 159, 182, 186, 196, 205). ❌
4. **`*ngTemplateOutlet`** for tree-row recursion ([CODE] `wallet-balance-management.component.html:341, :440`). Pre-v17 idiom; consider `<ng-content>` projection or signal-based components. ❌
5. **`[ngClass]` usage** ([CODE] `balance-transfer.component.html:178`). ❌
6. **`@Input()` / `@Output()` decorators** ([CODE] `balance-transfer.component.ts:62-69`) — would be `input()` / `output()` signal functions under Angular v20+ idioms. ❌
7. **`EventEmitter`** ([CODE] `balance-transfer.component.ts:67-69`) — replaced by `output()` in modern Angular. ❌
8. **Implements `OnInit, OnChanges`** with `ngOnInit`, `ngOnChanges(SimpleChanges)` ([CODE] `balance-transfer.component.ts:113-124`) — `effect()` + signal inputs preferred. ❌
9. **`BehaviorSubject` everywhere instead of signals** — `isLoading$`, `isSaving$`, `selectedCurrency$`, `selectedDistribution$`, `selectedStructure$` ([CODE] `wallet-balance-management.component.ts:101-115`) all used with the `async` pipe in template ([CODE] `:175, :183-186, :306, :325`). ❌
10. **Template-driven forms with no validators**. Neither `FormBuilder` nor `Validators` is imported. All "validation" is computed in custom `get isFormValid` getter ([CODE] `balance-transfer.component.ts:134-167`). No errors are surfaced to a `FormControl.errors` map; the form is just disabled. ❌
11. **Inline 119-line SVG markup** in the empty-state ([CODE] `wallet-balance-management.component.html:107-148`). Should be a `<falcon-svg-icon>` / `<falcon-illustration>`. ❌
12. **Inline SCSS variable layer on top of CSS variables** — `$wb-bg`, `$wb-card-bg` etc. ([CODE] `wallet-balance-management.component.scss:4-20`). Tailwind tokens preferred. ❌
13. **`Zone.js` change detection** retained — [CODE] `app.config.ts:29 provideZoneChangeDetection({ eventCoalescing: true })`. Memory note `project_falcon_revamp_v3_1_night_shift_results` documents the platform-wide migration to zoneless — but admin-console here is still zoned. ❌
14. **PrimeNG `Aura` indirectly** — `createFalconPrimeNGConfig()` from `@falcon` + `providePrimeNG()` ([CODE] `app.config.ts:32`). ❌ (per total-removal track)
15. **Cell-edit UI is half-built** — table inputs all `[disabled]="true"` ([CODE] `wallet-balance-management.component.html:393, :411`), and the save endpoint omits `changes` from the payload ([CODE] `wallet-balance.models.ts:217` `// changes: IBalanceChange[];` commented out). The `IBalanceChange` type, `onInputBlur` handler, `setCellValue` / `getCellValue`, draft/snapshot maps, and `hasUnsavedChanges` getter all exist but aren't wired up end-to-end. Dead code. ⚠️
16. **Inconsistent endpoint prefix casing** — `api/commerce/accounts/...` vs `commerce/setting/wallets` vs `charging/wallet/transfer` vs `commerce/Node` ([CODE] `wallet-balance.service.ts:18,46,64`; `org-hierarchy.api.service.ts:34`). Either align all to `api/<service>/...` or all to `<service>/...`. ❌
17. **`getOperationErrorMessage()` fallback uses `errorCodes`** ([CODE] `wallet-balance-management.component.ts:867-874`) — that field is read but never declared in the `IWalletDataResponse` / `ITransferResponse` types. Suggests `ServiceOperationResult` carries undocumented `errorCodes` array. ⚠️ Quirky.
18. **`@falcon` barrel re-export** at top of files imports >10 symbols ([CODE] `wallet-balance-management.component.ts:9-23`). Acceptable but creates tight coupling to the giant `@falcon` package — bundle-size flag.
19. **No spec/test file in the feature folder** — Glob `**/*.spec.*` returns zero hits in this feature. ❌
20. **Commit msg "Fixed the integer-only display"** ([CODE] commit `849e7da4`) reverses integer-only ('1.0-0') BACK to 3 fractional digits ('1.3-3':'en-US'). The brief mentioned this commit as evidence of integer-only handling; **the page DOES NOT use integer-only**, it explicitly DROPPED integer-only in favor of 3-decimal display. Important when porting: precision is **3 fractional digits** (e.g. `1,234.567 SAR`). ⚠️

## Patterns worth porting

1. **`AccessControlFacade.resolveFlags({…})` + `Object.assign(this, …)`** ([CODE] `wallet-balance-management.component.ts:876-884`) — clean, single-call resolution of N permissions onto N component flags. Reuse as-is.
2. **Snapshot/Draft map pattern** for cell-level dirty tracking ([CODE] `wallet-balance-management.component.ts:158-159` + `hasUnsavedChanges` getter `:208-213`). Solid foundation for table-edit UIs once cell-edit is actually enabled.
3. **`combineLatest([...filters$]).pipe(skip(1), distinctUntilChanged(...))` + auto-reload** for filter-driven views ([CODE] `:590-596`). Reusable pattern for filter-bar pages.
4. **Per-row PES gating** — `[disabled]="!isCellEditable(node.data) || !canTransferWallet"` ([CODE] `:428`). Combines server intent (`isCellEditable`) with PBAC (`canTransferWallet`) in one expression.
5. **Tree-row recursion via `ng-template`** + `*ngTemplateOutlet` is still a perfectly valid pattern for recursive trees in Angular 17+. Port the structure, swap `*ngFor`/`*ngIf` to `@for`/`@if`.
6. **`isDescriptionRequired()` helper as pure function** ([CODE] `transfer.models.ts:197-214`) — pulled out of the component, easy to unit-test. Apply the same factoring to all 7 transfer rules.
7. **Numeric enums with explicit `=1, =2`** matching backend C# names — keeps wire format stable across the boundary.
8. **`IWalletDataResponse` aggregation pattern** — one call returns account + channels + summary + tree + canSave. Less chatty than 5 separate calls. Worth keeping when the new UI rebuilds: the aggregation endpoint already exists on System Gateway.

## Anti-patterns to NOT port to the new theme

1. SCSS files of any kind — Tailwind utility classes only.
2. Any `primeng/*` import — replace with `<falcon-*>` (autocomplete, select, input-number, textarea, drawer all have or need Falcon equivalents).
3. `pi pi-*` PrimeIcons class strings — replace with `<falcon-svg-icon>` / `<falcon-icon>`.
4. `ngClass`, `*ngIf`, `*ngFor` — use `@if`, `@for`, class binding.
5. `@Input`/`@Output`/`EventEmitter` — use `input()`/`output()` signal-based API.
6. `BehaviorSubject` for component-local state — use signals.
7. Inline SVGs > 20 lines — extract to a Falcon illustration component.
8. Cell-edit dead code (`onInputBlur`, `IBalanceChange`, `setCellValue`) — either wire it up properly or remove it; do not port half-built scaffolding.
9. PrimeNG `MessageService` toast — use the platform toast service from `@falcon`.

## Summary of patterns observed
- **3 patterns followed correctly** that match modern Angular + Falcon platform standards (PES gating, ServiceOperationResult envelope, OnPush + DestroyRef)
- **9 anti-patterns** that block the page from passing the night-shift digest as-is (SCSS, PrimeNG, *ngIf/*ngFor, decorators, EventEmitter, OnInit, BehaviorSubject vs signals, template-driven forms with no validators, inline SVG)
- **2 quirky behaviors** that need cleanup decisions (dead cell-edit scaffolding, endpoint prefix inconsistency)
