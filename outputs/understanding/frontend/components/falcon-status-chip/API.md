# falcon-status-chip — API

> **Single-render Angular component.** No Stencil Shadow/`-tw` twin, so there are no "Stencil-only props", no reflected props, no `@Method`s, no `useTailwind` render-path switch, and no token file. Everything below is the Angular signal-input surface of one standalone component (`[CODE]` `falcon-status-chip.component.ts`).

## Selectors

- Angular: `falcon-status-chip` (`[CODE]` ts:79 `selector: 'falcon-status-chip'`, `standalone: true`).
- Stencil: **None**.

## Import

```ts
import { FalconStatusChipComponent } from '@falcon';
// types:
import type {
  FalconStatusChipStatus,
  FalconStatusChipVariant,
  FalconStatusChipSize,
} from '@falcon';
```

`[CODE]` Re-exported from the shared-ui barrel `libs/falcon/src/shared-ui/index.ts:164` (`export * from './lib/components/falcon-status-chip'`), which is itself re-exported by `@falcon`. Add `FalconStatusChipComponent` to the consuming standalone component's `imports: []`. No `CUSTOM_ELEMENTS_SCHEMA` needed (pure Angular, no custom element).

## Inputs (all signal `input()` on `FalconStatusChipComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `status` | `FalconStatusChipStatus` | **required** | `[CODE]` ts:105 `input.required<FalconStatusChipStatus>()`. Drives color + default label. One of `approved` / `pending` / `rejected` / `deleted` / `review` / `none`. |
| `variant` | `FalconStatusChipVariant` | `'filled'` | `[CODE]` ts:106. `filled` → tinted pill (bg + text + optional dot). `text` → bare italic colored text (no bg/border). |
| `showDot` | `boolean` | `true` | `[CODE]` ts:107. Renders the leading color dot. In `filled` it is a `rounded-full` span sized by `dotClasses()`; in `text` it is a fixed `w-1.5 h-1.5` (md) inline dot with `me-1`. Consumers pass `[showDot]="false"` for the checker sub-lines. |
| `size` | `FalconStatusChipSize` | `'md'` | `[CODE]` ts:108. `sm` / `md`. Drives padding + font-size (filled) and font-size + dot-size (both). **No `lg`** (unlike `<falcon-status-badge>`). |
| `labelKey` | `string \| null` | `null` | `[CODE]` ts:111. Overrides the per-status default i18n key. When `null`, falls back to `tokens().defaultLabelKey`. Passed through `\| translate` either way. |

## Outputs

**None.** `[CODE]` The component has zero `output()`s — it is a passive display chip (no click, no dismiss). (Contrast `<falcon-angular-tag>`, which has `falcon-tag-dismiss`.)

## TypeScript types

`[CODE]` Declared + exported from `falcon-status-chip.component.ts` (and re-exported by `index.ts:6-10`):

```ts
type FalconStatusChipStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'deleted'
  | 'review'
  | 'none';                         // 'none' = "---" / empty-cell placeholder (ts:13-21)

type FalconStatusChipVariant = 'filled' | 'text';
type FalconStatusChipSize = 'sm' | 'md';
```

### Internal status→token record (not public)

`[CODE]` ts:28-76 — `STATUS_TOKENS: Readonly<Record<FalconStatusChipStatus, StatusTokens>>` where `StatusTokens = { bg; text; dot; defaultLabelKey }`. The mapping (Tailwind utilities + default i18n keys):

| status | bg (filled) | text | dot | defaultLabelKey |
|---|---|---|---|---|
| `approved` | `bg-falcon-green-50` | `text-falcon-green-700` | `bg-falcon-green-500` | `templates.status.approved` |
| `pending` | `bg-falcon-amber-50` | `text-falcon-amber-700` | `bg-falcon-amber-500` | `templates.status.pending` |
| `review` | `bg-falcon-amber-50` | `text-falcon-amber-700` | `bg-falcon-amber-500` | `templates.status.inReview` |
| `rejected` | `bg-falcon-red-100` | `text-falcon-red-700` | `bg-falcon-red-500` | `templates.status.rejected` |
| `deleted` | `bg-falcon-red-100` | `text-falcon-red-700` | `bg-falcon-red-500` | `templates.status.deleted` |
| `none` | `bg-falcon-neutral-100` | `text-falcon-neutral-500` | `bg-falcon-neutral-400` | `templates.status.na` |

> `[CODE]` `pending` and `review` are visually identical (same amber triple); they differ only in `defaultLabelKey`. The const-record shape is deliberate — "future status additions are a one-line append rather than a switch-statement edit" (ts:26-27).

## Reflected props (Stencil only)

**N/A** — no Stencil layer.

## Mutable props (Stencil)

**N/A** — no Stencil layer.

## CVA / ngModel / Reactive Forms

**No.** `[CODE]` This is a display-only component — it implements no `ControlValueAccessor`, has no `value`, and binds no form control. It renders the `status` it is handed.

## Signal compatibility

`[CODE]` Fully signals-first. All five inputs are `input()` signals; `tokens` / `filledClasses` / `textClasses` / `dotClasses` are `computed()` (`protected readonly`). `OnPush` change detection. Zoneless-safe.

## Methods

**None.** No public methods; no Stencil `@Method`s to proxy.

## Slots / template inputs

**None.** `[CODE]` The label text is prop-driven (`labelKey` / `status` → `defaultLabelKey` → `\| translate`); there is no `<ng-content>` slot and no `ng-template` input. The chip renders exactly one `<span>` (plus an optional inner dot `<span>`).

## Supported sizes / states / variants / appearances

- **Sizes:** `sm`, `md` (no `lg`).
  - `[CODE]` filled `sm` → `py-0.5 px-2.5 text-2xs`; filled `md` → `py-1 px-3 text-xs` (ts:116).
  - `[CODE]` text `sm` → `text-3xs`; text `md` → `text-2xs` (ts:126).
  - `[CODE]` dot `sm` → `w-1 h-1`; dot `md` → `w-1.5 h-1.5` (ts:131).
- **States (status):** `approved` / `pending` / `rejected` / `deleted` / `review` / `none` — color only; not a validation state.
- **Variants:** `filled` (pill) / `text` (italic).
- **Appearances:** none beyond the two variants.

## Constraints

- `[CODE]` ts:84-101 — the template branches on `variant()`: `filled` renders `<span [class]="filledClasses()">` (+ optional `<span [class]="dotClasses()">` dot); `text` renders `<span class="italic whitespace-nowrap" [class]="textClasses()">` (+ optional fixed-size inline dot).
- `[CODE]` In the `text` variant the dot is **hardcoded** `w-1.5 h-1.5 ... me-1` (ts:97) regardless of `size` — `dotClasses()` (which honors `size`) is only used in the `filled` branch. Minor inconsistency (G4).
- `[CODE]` `status` is **required** — there is no safe default; a missing `[status]` is a template error. Map unknown/empty domain values to `'none'` upstream.
- `[CODE]` Color is **fully determined by `status`** via `STATUS_TOKENS`; there is no per-instance color override input and no token file to override. To recolor, you must change the record (shared change) — a per-page color tweak is not supported (G2).
- `[CODE]` Labels are **i18n keys**, not literal text — `labelKey` / `defaultLabelKey` feed `\| translate`. Passing already-translated text ships a missing-translation artifact.

## Accessibility

- `[CODE]` **No `role`, `aria-label`, or `title`** on the chip — it is a plain `<span>` whose text content IS the status word. A screen reader reads the translated label as text. Acceptable for a textual status, but there is no explicit status semantics (e.g. `role="status"`) and the color carries redundant meaning only when the label is present (G-A11Y-1).
- `[CODE]` The leading dot is a decorative `<span>` with **no `aria-hidden`** (ts:88,97) — harmless (empty span, no text) but not explicitly marked decorative (A2).
- `[CODE]` Host is `inline-flex` (`host: { class: 'inline-flex' }`, ts:83) so the chip sits inline with surrounding text/cells.
- Color contrast: the `*-700` text on `*-50`/`*-100` tint backgrounds is the Falcon-standard high-contrast status pairing (same family pairing as `<falcon-status-badge>`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24) against `falcon-status-chip.component.ts` (134 ln, read in full). All 5 inputs, the `STATUS_TOKENS` table, the two-variant template branch, sizes (`sm`/`md`, no `lg`), and the zero-output / no-CVA / no-slot / no-method facts confirmed in source. i18n key strings 🟡 CODE-DERIVED from the record literals (JSON not re-read). a11y observations 🟢 from the inline template markup.
