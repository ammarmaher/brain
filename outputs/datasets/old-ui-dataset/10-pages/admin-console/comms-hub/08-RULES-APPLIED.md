# Rules / patterns — comms-hub

## Observed (good)

1. **Standalone component** — `standalone: true` everywhere ([CODE] component line 78). No `NgModule` boilerplate.
2. **`inject()` API** for all dependencies ([CODE] lines 107-119). No constructor injection except in the legacy `HttpService` (which keeps a `@Inject(HTTP_BASE_URL)` overload).
3. **`ServiceOperationResult<T>`** wrapper everywhere — matches platform standard.
4. **Per-row backend allow-list** (`allowedActions`) — the UI defaults to deny ([CODE] component line 1072) when the backend doesn't supply the field; safe.
5. **PES gating via `resolveFlags` batch** — single async call resolves 4 flags atomically ([CODE] line 1252-1262). Avoids per-flag `await` ladders.
6. **`takeUntilDestroyed(destroyRef)`** for the do-payment subscription ([CODE] line 552). Ties RxJS subscriptions to component lifecycle without manual `destroy$.next()`.
7. **Optimistic visibility toggle with revert** ([CODE] line 644-648) — good UX pattern; reverts the in-memory flag on HTTP error.
8. **`useGateway()` `HttpContext` flag** for transport-layer base URL switching ([CODE] every service). Decouples gateway choice from each call site.
9. **Generic typed `<falcon-table>`** with `FalconTableComponent<CommChannelServiceItem>` (line 138-139). Type-safe column / row-menu definitions.
10. **Confirm-before-destructive** — payment + delete both gated by `ConfirmationService` ([CODE] 726-737, 1144-1157).

## Observed (bad — flagged by the night-shift digest)

1. **PrimeNG everywhere** — `ButtonModule`, `Select`, `InputNumber`, `DialogModule`, `SkeletonModule`, `ToastModule`, `ToggleSwitch`, `MessageService`, `ConfirmationService`, `TreeNode` (line 14-21). Memory `project_falcon_primeng_total_removal_complete` says PrimeNG is fully removed; this file is from `origin/main` so it predates the removal.
2. **`pi pi-*` PrimeIcons** in `FALCON_ACTION_REGISTRY` (`pi pi-ban`, `pi pi-credit-card`, `pi pi-pencil`, `pi pi-check`) — `libs/falcon/src/shared-ui/lib/components/falcon-table/falcon-row-action.models.ts:39, 45, 51, 57, 63`. Also `pi pi-times`, `pi pi-check`, `pi pi-pen-to-square`, `pi pi-trash` directly in the template (HTML lines 53, 61, 91, 99, 135, 146, 178, 189).
3. **SCSS file present** — `comms-hub.component.scss` is 277 lines of stylesheet using nested SCSS syntax and `&__bar`-style BEM-in-Sass. Memory `feedback_no_inline_styles_tokens_only` says zero SCSS. Also: `:host { display: block }` is correct here, but the rest of the SCSS contains hardcoded color fallbacks (`var(--color-text, rgba(255, 255, 255, 0.9))`, `var(--color-surface, #ffffff)`, `var(--color-border, #e5e7eb)`, `var(--skel-radius, 6px)`, `var(--radius-lg, 12px)`, `var(--radius-full, 9999px)`, `var(--color-surface-alt, #f9fafb)`).
4. **`*ngIf` and `*ngFor`** throughout the template (HTML lines 40, 43, 46, 113, 134, 144, 161, 176, 186, 205, 207, 245, 298, 302, 307, 316, 324, 326, 340). Memory standard is `@if` / `@for` (Angular 17+ control flow). Component is on Angular's older idiom.
5. **`@ViewChild` decorators** (lines 124, 127, 130, 133, 135, 138) — Angular 20 idiom would be `viewChild()` signals.
6. **Default change detection** — no `ChangeDetectionStrategy.OnPush`. The component uses manual `cdr.markForCheck()` and `cdr.detectChanges()` calls (lines 319, 324, 346, 359-360, 372-373, 514, 525, 537, 1186). With OnPush the calls would be required less aggressively.
7. **`as any` casts** (lines 472, 1156) — `(res.result as any)?.orderId || (res.result as any)?.OrderId` is a code smell — DTO `DoPaymentCommunicationChannelResponse` is typed as `Record<string, unknown>` so the property has to be coerced. Could be solved by typing the response.
8. **Cross-feature import** — `import { ... } from '../organization-hierarchy/...'` (lines 64-67, 70) crosses feature boundaries. Memory `feedback_strict_task_scope` doesn't forbid this, but `feedback_wiki_naming_conventions` argues such shared code belongs in `libs/falcon/sdk` or `libs/falcon/shared`.

## Patterns worth porting

- **`SimplePollService.watch({ shouldStop })` API** ([CODE] `libs/falcon/src/shared-data-access/lib/services/simple-poll.service.ts:17-51`) — clean generic polling abstraction with predicate-based stop + max duration cutoff + `takeUntil(stop$)`. Reusable for any long-running order/job status flow.
- **`AccessControlFacade.resolveFlags(map)`** — pattern for "I need N capability flags as a record at component init time". Batches the underlying `ensure(...)` call.
- **Default-deny per-row action visibility** (component line 1061-1073) — falls back to hiding the action when the backend doesn't supply `allowedActions`. Safer than the inverse default.
- **Sub-row "pending change" details template** (`detailsRowTpl`, HTML 110-202) — shows pending price-type and pending price-value as nested rows with their own edit/delete affordances. Cleaner than a separate "pending changes" modal.

## Anti-patterns to NOT port to new theme

- **Hardcoded color fallbacks in CSS variables** (`var(--color-text, rgba(255, 255, 255, 0.9))` — these defeat theme-switching when the variable is unset. New theme must guarantee variables are set at the root level.
- **Inline `<svg>` blob** (HTML 248-289) — a 42-line SVG empty-state illustration embedded in the template. Should be promoted to an SVG asset and rendered via `<falcon-svg-icon>` like elsewhere on the same page.
- **Stale dead methods** — `CommsHubService.updatePriceType` / `updatePriceValue` (lines 57-99) are never called. Drop in the rewrite.
- **Duplicate `CommChannelPriority` interface** declared in two places — in `models.ts:13-16` and `insufficient-balance-priority-dialog.component.ts:21-24`. Pick one and import.
- **`Record<string, unknown>` response types** — all 8 commerce response types are `Record<string, unknown>` aliases (`tabs-layout/components/models/models.ts:84-117`). Replace with real DTOs so consumers don't need `as any`.
- **`[key: string]: unknown` open extension** on `CommChannelServiceItem` (line 31) — used because details sub-items are stuffed in alongside the strict fields. Better: separate `CommChannelServiceItem` (the row) from `CommChannelPendingChange` (the sub-row).
- **Direct PrimeNG `<p-toast>` / `MessageService`** in this feature instead of a Falcon-wrapped toast service.
- **String-based selectors / hardcoded URLs** — `'commerce/Node/...'` literals scattered across services; new code should use a typed endpoint constants table.

## Counting

- **10 good patterns** captured.
- **8 bad patterns** flagged.
- **8 anti-patterns** to avoid in the rewrite.
