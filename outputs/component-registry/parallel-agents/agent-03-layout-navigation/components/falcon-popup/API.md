# falcon-popup — API

## Angular selector
`falcon-angular-popup`

## Stencil tags
None. This is an Angular-only component (Light DOM via standard Angular `template`).

## Import path
```ts
import {
  FalconAngularPopupComponent,
  type FalconPopupVariant,
} from '@falcon/ui-core/angular';
```

## Inputs

All inputs use Angular's signal-input syntax (`input<T>()`):

| Name | Type | Default | Notes |
|---|---|---|---|
| `open` | `input<boolean>(false)` | `false` | Controls visibility. |
| `variant` | `input<FalconPopupVariant>('error')` | `'error'` | One of `error` / `delete` / `unsaved` / `save`. |
| `name` | `input<string>('')` | `''` | Interpolated into the body string for `delete` variant (`"You're about to permanently delete <name>"`). |
| `iconBg` | `input<boolean>(true)` | `true` | When true, icon gets a chip background tint. |
| `iconColor` | `input<boolean>(true)` | `true` | When true, icon uses intent-coloured stroke; when false, neutral. |
| `glossy` | `input<boolean>(true)` | `true` | When true, panel + backdrop get a backdrop-blur + saturate gloss effect. |
| `titleOverride` | `input<string \| null>(null)` | `null` | Override variant's default title. Empty string treated as "no override". |
| `bodyOverride` | `input<string \| null>(null)` | `null` | Override body string. |
| `hintOverride` | `input<string \| null>(null)` | `null` | Override hint (small grey line below body). |
| `confirmLabelOverride` | `input<string \| null>(null)` | `null` | Override confirm button label. |
| `cancelLabelOverride` | `input<string \| null>(null)` | `null` | Override cancel button label. |

## Outputs

| Name | Payload |
|---|---|
| `confirm` | `void` |
| `cancel` | `void` |

Both are `output<void>()` (signal-based).

## TypeScript types

```ts
export type FalconPopupVariant = 'error' | 'delete' | 'unsaved' | 'save';

// Internal — not exported:
type IconKey = 'git-pull-closed' | 'trash' | 'info-circle' | 'git-pull-create';
interface VariantContent {
  intent: 'danger' | 'warning' | 'success' | 'primary';
  icon: IconKey;
  title: string;
  body: (name: string) => string;
  hint: string;
  cancelLabel: string;
  confirmLabel: string;
  confirmTone: 'danger' | 'primary' | 'success';
}
```

The `VARIANTS` const maps each `FalconPopupVariant` to a `VariantContent`:

| Variant | Intent | Icon | Default confirm | Default cancel | Confirm tone |
|---|---|---|---|---|---|
| `error` | danger | git-pull-closed | "Try again" | "Cancel" | danger |
| `delete` | danger | trash | "Delete" | "Cancel" | danger |
| `unsaved` | warning | info-circle | "Discard & leave" | "Stay on page" | danger |
| `save` | success | git-pull-create | "Publish" | "Cancel" | primary |

## Variant default copy (verbatim from source)

| Variant | Default title | Default body |
|---|---|---|
| `error` | "Something went wrong" | "We couldn't complete that action. Please check your connection and try again — if the issue persists, contact your administrator." |
| `delete` | "Delete this record?" | `You're about to permanently delete "<name>" / "this record". This action cannot be undone and any linked data will lose access immediately.` |
| `unsaved` | "You have unsaved changes" | "You've edited fields on this page that haven't been saved yet. Leaving now will discard your changes." |
| `save` | "Publish your changes?" | "Your edits will be applied to the live record and visible to other admins immediately." |

Each variant also has a default `hint` line — overridable via `hintOverride`.

## Reflected props
None (Angular-only — no Stencil reflection).

## Methods
None public.

## Slots
**None.** Popup is fully controlled via inputs + variant config. Custom content not supported.

## CVA support
Not applicable.

## Signal compatibility
The component is fully signal-driven — inputs use `input()`, outputs use `output()`. Internal state uses `computed()` for `resolvedTitle`, `resolvedBody`, `hint`, `resolvedConfirmLabel`, `resolvedCancelLabel`, `iconChipClasses`, `confirmFalconVariant`.

## Supported variants / states
- 4 variants (above).
- 2 visual sub-modes via `iconBg` (background chip on / off).
- 2 visual sub-modes via `iconColor` (intent-coloured / neutral icon stroke).
- 2 visual sub-modes via `glossy` (gloss + blur backdrop / flat).

## Important constraints
- **Escape key fires `cancel` event** — via `@HostListener('document:keydown.escape')`.
- **Backdrop click fires `cancel`** — only when the target is the outer backdrop (event target === currentTarget).
- **Inner article click is stopped** — `(click)="$event.stopPropagation()"` on the `<article>` prevents the backdrop click from firing when clicking inside.
- **No focus trap** — unlike `falcon-angular-dialog` / `-drawer`, popup does NOT capture focus. This is a P0 a11y gap.
- **No focus restore** — same.
- **Empty-string overrides are treated as "no override"** — `pick(override, fallback)` checks `override.trim().length > 0`. Useful for `[titleOverride]="key | translate"` when the translate pipe transiently returns the key during init.

## Accessibility attributes
- Outer backdrop: `role="presentation"`.
- Inner article: `role="dialog"`, `aria-modal="true"`, `aria-label="<resolvedTitle>"`.
- Close × button: `aria-label="Close"`.
- No `aria-describedby` linkage between body / hint and the dialog.
- No focus trap (P0 gap).

## Parts
None — Angular template, not Stencil.
