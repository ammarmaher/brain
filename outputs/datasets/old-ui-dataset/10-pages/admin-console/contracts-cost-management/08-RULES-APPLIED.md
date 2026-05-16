# Rules / patterns — contracts-cost-management

## Observed (good)
1. **Standalone components throughout** — every component declares `standalone: true`. No NgModules.
2. **`ChangeDetectionStrategy.OnPush` everywhere** — explicit on every `@Component` decorator. Combined with `markForCheck()` / `detectChanges()` discipline at HTTP completion boundaries.
3. **`takeUntilDestroyed(this.destroyRef)` for subscription cleanup** — every observable subscribes inside this operator. No memory-leak risk and no manual `Subject<void> destroy$`.
4. **`@if` / `@else if` block flow** (Angular 17+ control flow) — used in the container template (`*.html` lines 7-110). No `*ngIf` in this file.
5. **Single `ContractsApiService` per feature** — clean separation: all HTTP + payload-shaping live in one file. Components consume typed `Observable<DomainType>` only.
6. **`ServiceOperationResult<T>` enforced via `unwrap()` helper** — single error surface (`error.message`) per call. Consistent with Falcon platform standard.
7. **`useGateway()` HTTP context** — gateway resolution lives in the interceptor; service code declares intent without hardcoding URLs.
8. **Locale + RTL awareness** — `Intl.DateTimeFormat` + `Intl.NumberFormat` driven by `document.documentElement.dir === 'rtl' ? 'ar' : 'en-US'`. Flex direction reversed via `[ngClass]="isRtl ? 'md:flex-row-reverse' : 'md:flex-row'"`.
9. **Comment-driven explanations** on subtle correctness points (date local-only serialization, voice-channel priority filtering, OnPush change-detection edge cases). Authoring quality is high.
10. **Type definitions co-located in `contracts.models.ts`** (605 lines) — pure-function helpers (`createEmptyRateMatrix`, `flattenRateMatrixToRates`, `syncRateMatrixIntoRates`) are exported alongside types. No service coupling.
11. **Form is plain object, validation is plain getter** — no Reactive Forms ceremony. Simple to reason about for a 4-step wizard.

## Observed (bad — would be flagged by the night-shift digest)
1. **`@Input()` + `@Output()` decorators throughout** — should be `input()` / `output()` under Angular v20+ idioms. (Wizard line 60-66, Edit line 57-61, etc.)
2. **`ChangeDetectorRef.markForCheck()` / `detectChanges()` called manually** in OnPush handlers — symptom of not using signals. ~10 occurrences in container + wizard.
3. **`@ViewChild(ContractsEditContractComponent)` + `editContractComponent?.submit()` external invocation** — couples container template to a child internal method. `(saved)` output is the right pattern; calling `.submit()` from parent is a code smell.
4. **In-place array mutation via `splice(0, len, ...)`** in `ContractsContractDetailsSectionComponent.persistCurrentMatrix()` (line 96) — mutates parent input. OnPush works by reference; this is a hidden two-way binding that bypasses the contract.
5. **No Reactive Forms** — validation logic re-implemented in component getters (~25 predicates). Hand-rolled validators are harder to test and don't compose. **(Note: not strictly "bad" — just inconsistent with rest of Falcon UI.)**
6. **Local `<app-contracts-data-table>` instead of `<falcon-table>`** — table re-implementation with hand-rolled paginator, click-row, kebab menu. Reuses none of the falcon-ui-core table polish or features.
7. **Local `<app-contracts-accounts-panel>` instead of `<falcon-organization-hierarchy-tree>`** — `comms-hub` and `marketplace-applications` use the latter; this feature ships a parallel single-level wrapper. Code duplication for tree-rendering.
8. **Local `<app-primary-button>` / `<app-secondary-button>` with inline Tailwind utility classes** — bypasses falcon-ui-core `<falcon-button>`. Color tokens (`!bg-falcon-teal-900`, `!border-falcon-neutral-200`) hardcoded in component templates.
9. **`!important` Tailwind utilities** all over component HTML — `!h-12`, `!w-full`, `!rounded-sm`, `!border`, `!bg-falcon-neutral-0`, etc. Symptom of style cascade conflicts with downstream styles. Suggests CSS architecture has not been finalized.
10. **`document.documentElement.dir` direct reads** — should be a shared `DirectionalityService` / `IsRtlDirective`. Same idiom duplicated 4× across the feature.
11. **No PES guards** on the route + no `AccessControlFacade` use inside the feature — only the parent `adminConsoleGuard` for entry. See [[05-PES]].

## Patterns worth porting
- **The `contracts.models.ts` file structure** — types + catalog constants + pure functions all co-located. Clear separation of `Form*` (UI working state) vs `Api*` (wire format) vs `Contract*Row` (domain) types.
- **`ContractsApiService` as a single facade** — every HTTP call + every payload mapping in one place. Easy to swap to mocks for tests.
- **Status mapping helpers** (`normalizeContractStatus`, `canEditContractStatus`, `hasRestrictedContractCommercialFields`) — type-narrowed transitions in 3-line functions. Clean.
- **`unwrap()` + `getErrorMessage()` pair** — single error-handling pipeline.
- **Comment style on tricky correctness points** — every non-obvious correctness decision has 1-3 lines of inline rationale.

## Anti-patterns to NOT port to new theme
- **Hand-rolled paginated table** — port to the falcon-ui-core `<falcon-table>` or `<falcon-data-table>` skeleton.
- **Hand-rolled primary/secondary buttons** — port to `<falcon-button>` + variants.
- **Hand-rolled tree panel** — port to `<falcon-organization-hierarchy-tree>` (already used by sibling pages).
- **`@Input`/`@Output` decorators** — use signal-based `input()`/`output()`.
- **Manual `markForCheck()` boilerplate** — replace with signal-based state.
- **`!important` Tailwind utilities** — should not be needed if the layout system is correctly tokenized. The hard `!` prefix is a code smell about token shadowing inside Falcon UI Core or PrimeNG residue.
- **External child invocation via `@ViewChild + .submit()`** — replace with action stream / output event.
- **Inline SVG in template (line 73-75 of container)** — port to `<falcon-svg-icon name="plus" [size]="14" />`.

## Note on PrimeNG residue
File still imports `import { TreeNode } from 'primeng/api';` at line 11 of the container, and uses it as the structural type for tree-panel selection events. [INFERRED] Even though PrimeNG is being removed across the app (see memory `project_falcon_primeng_total_removal_complete`), `TreeNode` is still a leaked type from the old tree implementation. Replacement: Falcon-owned tree-node type in the new theme.

## Architecture compliance against `Brain Outputs` / wiki rules
- ✅ Clean architecture: model→service→component dependency direction.
- ✅ Single `ServiceOperationResult<T>` envelope.
- ✅ JWT Bearer via interceptor (not feature concern).
- ⚠️ Multi-language: only en+ar (locale switch), no `MultiLanguageName(En, Ar)` shape on any DTO. All labels via i18n keys. [INFERRED] This is correct for a labeling concern but means **no DB-side multi-language values** on contract entities (contractName is a single string).
- ⚠️ Tailwind utilities only, no SCSS — ✅ for this feature (no `.scss` files in `contracts-cost-management/`).
- ⚠️ No falcon-ui-core consumption beyond `FalconCalendarComponent`, `DynamicStepperComponent`, `FalconIconComponent`, `TranslatePipe`. Significant non-reuse opportunity.

## Total patterns observed: 11 good, 11 bad (anti-patterns), 5 worth porting.
