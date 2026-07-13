# falcon-page-skeleton — API

> Single-render pure-Angular shared-ui component. **No Stencil tags, no reflected/mutable props, no CVA** — those are N/A. State is two boolean signal inputs + a derived `visible` `computed`. The template is an inline string on the decorator.

## Selectors

- Angular component: `falcon-page-skeleton` (`[CODE]` ts:73)

## Import

```ts
import { FalconPageSkeletonComponent } from '@falcon'; // re-exported via libs/falcon/src/shared-ui/index.ts:190
```

`[CODE]` Exported from the component's `index.ts` (ts:2) and surfaced through the `@falcon` shared-ui barrel. Add `FalconPageSkeletonComponent` to the consuming standalone component's `imports: []`. No `CUSTOM_ELEMENTS_SCHEMA` needed (plain Angular component).

## Inputs (signal inputs on `FalconPageSkeletonComponent`)

`[CODE]` falcon-page-skeleton.component.ts:177-178 — two boolean signal inputs:

| Name | Type | Default | Notes |
|---|---|---|---|
| `forceVisible` | `input<boolean>` | `false` | `[CODE]` ts:177 — force the skeleton to render regardless of `loading`. The Templates consumer passes `[forceVisible]="true"` and gates rendering itself with an outer `@if (showSkeleton())` (templates-list.component.html:8-10). |
| `loading` | `input<boolean>` | `false` | `[CODE]` ts:178 — render the skeleton while a fetch is in flight (the "self-gating" mode). |

## Visibility logic (computed)

`[CODE]` ts:179:

| Computed | Returns | Logic |
|---|---|---|
| `visible` | `boolean` | `forceVisible() \|\| loading()` — the whole template is wrapped in `@if (visible())` (ts:78). When both are false the component renders **nothing**. |

> `[CODE]` Two equivalent usage modes: (a) **self-gating** — bind `[loading]="isLoading()"` and let the component show/hide itself; (b) **parent-gating** — wrap the element in your own `@if` and pass `[forceVisible]="true"` (the Templates pattern). Both reach the same `visible()`.

## Internal data (template-driven, not inputs)

`[CODE]` The skeleton's shape is hardcoded via module-level constants exposed as `protected readonly` fields — **not configurable inputs** (GAP G2):

| Field | Source const | Shape |
|---|---|---|
| `treeRows` | `TREE_ROWS` (ts:37-50) | 12 tree-row specs (`indent` 0/1/2, width fraction, optional `selected`) |
| `tableRows` | `TABLE_ROWS` (ts:52-62) | 9 table-row specs (`selected`, `tone`, 6 column widths) |
| `tabsWidths` | `TABS_WIDTHS` (ts:64) | 4 tab-strip placeholder widths |

Plus two `protected` lookup helpers:

| Method | Source const | Returns |
|---|---|---|
| `indentStyle(level: 0\|1\|2)` | `INDENT_STYLE` (ts:66-70) | `''` / `'margin-left: 24px'` / `'margin-left: 48px'` — an inline `style` string applied via `[style]` (ts:94) |
| `pillBg(tone: Tone)` | `PILL_BG` (ts:30-35) | a raw-palette pill bg class (`bg-emerald-100` / `bg-amber-100` / `bg-rose-100` / `bg-slate-200`) applied via `[class]` (ts:155) |

## TypeScript types (module-local, not exported)

`[CODE]` ts:16-28 — internal types backing the constants:

```ts
type Tone = 'success' | 'warning' | 'danger' | 'muted';
interface TreeRowSpec  { readonly indent: 0 | 1 | 2; readonly width: string; readonly selected?: boolean; }
interface TableRowSpec { readonly selected: boolean; readonly tone: Tone;
                         readonly widths: readonly [string, string, string, string, string, string]; }
```

> `[CODE]` None of these are exported from the barrel — they are private to the component (index.ts re-exports only the component class, ts:2).

## Outputs

**NONE.** `[CODE]` No `output()` / `@Output`. The skeleton is display-only; it emits nothing.

## Reflected props / mutable props

**N/A** — no Stencil layer.

## CVA / ngModel / Reactive Forms

**N/A — not a form control.** No `ControlValueAccessor`, no value.

## Signal compatibility

`[CODE]` **Fully signal-based.** `forceVisible`/`loading` are `input()`; `visible` is `computed()`; `OnPush` (ts:75); zoneless-safe. Iteration uses `@for (… track $index)` (ts:90/108/143) — no `*ngFor`. The single conditional is `@if (visible())` + `@if (row.indent > 0)` (ts:78/95) — no `*ngIf`.

## Methods

`[CODE]` Two `protected` template helpers (`indentStyle`, `pillBg`) — not public API. No public methods.

## Host binding

`[CODE]` ts:76 — `host: { class: 'block w-full h-full' }`. The component fills its container; consumers typically place it inside an absolutely-positioned overlay (templates-list.component.html:9).

## Slots / template inputs

**NONE.** `[CODE]` No `<ng-content>`, no `<ng-template>` inputs. The skeleton is fully self-contained and non-projectable (GAP G2 — you cannot reshape or extend it).

## Supported sizes / states / variants / appearances

**NONE.** Single fixed layout (the org-hierarchy/Templates workspace shape). The only "state" is visible vs not (`visible()`).

## Constraints

- `[CODE]` The layout is **fixed and non-parameterized** — 12 tree rows, 9 table rows, 4 tabs, a `lg:grid-cols-5` split (ts:79). You cannot change row counts/widths/tabs without editing the component (GAP G2).
- `[CODE]` Below the `lg` breakpoint the left tree pane is **hidden** (`hidden lg:flex`, ts:80) — on small screens only the right "main" card shows.
- `[CODE]` Two inline `style` usages: `style="height: calc(95vh - 40px)"` on the aside (ts:82) and the `indentStyle()` margin (ts:94) — see TOKENS static-style risks.
- `[CODE]` Pervasive **raw Tailwind palette** classes (`bg-emerald-100`, `bg-slate-300/70`, `bg-rose-100`, `border-slate-200`, etc.) instead of `--falcon-*` tokens — a deliberate parity copy of the Hierarchy skeleton (ts:8) but a house-rule deviation (GAP G3).

## Accessibility

- `[CODE]` **No ARIA at all** — no `role="status"`/`aria-busy`/`aria-live`/`aria-hidden`. The skeleton is a pile of decorative `<div>`/`<span>` blocks. A screen-reader user gets no "loading" announcement from the component itself (GAP A1). Consumers partially mitigate by overlaying with `pointer-events-none` (templates-list.component.html:9) but that does not announce loading state.
- **N/A:** no focusable elements, no keyboard interaction (purely decorative).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26) against falcon-page-skeleton.component.ts (192 ln). 2 signal inputs (`forceVisible`/`loading`), 1 `computed` (`visible`), 0 outputs, no CVA, no Stencil layer, no slots. Fixed hardcoded layout (12 tree / 9 table / 4 tab specs), raw-palette utilities, 2 inline `style` usages, zero ARIA — all confirmed in live source.
