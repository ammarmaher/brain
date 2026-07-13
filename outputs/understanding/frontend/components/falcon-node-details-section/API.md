# falcon-node-details-section — API

> Single-render pure-Angular shared-ui component. **No Stencil Shadow/`-tw` tags, no reflected props, no `@Prop`** — those concepts are N/A here. State is Angular signals (`input()` / `contentChild()` / `computed()`).

## Selectors

- Angular component: `falcon-node-details-section` (`[CODE]` ts:30)
- Actions slot: `ng-template[falconNodeDetailsActions]` (`[CODE]` actions.directive.ts:10)
- Avatar slot: `ng-template[falconNodeDetailsAvatar]` (`[CODE]` avatar.directive.ts:15)

## Import

```ts
import {
  FalconNodeDetailsSectionComponent,
  FalconNodeDetailsActionsDirective,
  FalconNodeDetailsAvatarDirective,
} from '@falcon'; // re-exported via libs/falcon/src/shared-ui/index.ts:186
```

`[CODE]` All three symbols are exported from the component's `index.ts` (ts:7-9) and surfaced through the `@falcon` shared-ui barrel. Add the component **and** whichever slot directive(s) you project to the consuming standalone component's `imports: []`. There is no `CUSTOM_ELEMENTS_SCHEMA` requirement (no custom element — this is a plain Angular component).

## Inputs (signal inputs on `FalconNodeDetailsSectionComponent`)

`[CODE]` falcon-node-details-section.component.ts:37-45 — three signal inputs:

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `input.required<string>` | — (required) | `[CODE]` ts:38 — the display name (e.g. "Aramco", "Falcon"). Rendered in a `truncate` span with `[title]` (html:32). Drives the initials fallback + the default alt. |
| `imageUrl` | `input<string \| null>` | `null` | `[CODE]` ts:42 — when non-empty, renders an `<img>` in a 28×28 circle (html:23-25). When null/empty AND no avatar template is projected, falls back to the initials chip. |
| `imageAlt` | `input<string \| null>` | `null` | `[CODE]` ts:45 — alt text for the image; when null, `effectiveAlt()` falls back to `label()` (ts:66). |

> `[CODE]` All three are the new Angular signal-input API (`input()` / `input.required()`), NOT legacy `@Input`. There are **no** `size` / `variant` / `disabled` / `state` inputs — this is a layout strip, not a form control (see GAPS G2).

## Content-child slot bindings (internal)

`[CODE]` ts:49 / ts:57 — the component picks up two projected templates via `contentChild()`:

| Binding | Source directive | Type | Notes |
|---|---|---|---|
| `actionsTemplate` | `FalconNodeDetailsActionsDirective` | `Signal<… \| undefined>` | `[CODE]` ts:49 — picks up `<ng-template falconNodeDetailsActions>` from the caller and renders it on the RIGHT (html:35-37). When absent, the right side is empty. |
| `avatarTemplate` | `FalconNodeDetailsAvatarDirective` | `Signal<… \| undefined>` | `[CODE]` ts:57 — picks up `<ng-template falconNodeDetailsAvatar>`; when present, **replaces the entire built-in image/initials avatar** (html:20-21, highest precedence). Added Wave 22 (2026-05-16) so consumers can project the brand-aware `<app-org-node-avatar>` without the library knowing Falcon-brand specifics (ts:51-56). |

Both directives are trivial `TemplateRef` markers (`[CODE]` actions.directive.ts:12-13, avatar.directive.ts:17-18 — each is `readonly template = inject(TemplateRef<unknown>)`).

## Computed (internal, `protected`)

`[CODE]` ts:60-66:

| Computed | Returns | Logic |
|---|---|---|
| `initial` | `string` | `[CODE]` ts:60-63 — first non-space char of `label`, uppercased; `'?'` when label is empty. Used by the initials-chip fallback. |
| `effectiveAlt` | `string` | `[CODE]` ts:66 — `imageAlt() ?? label()`. Used as the `<img>` alt + the initials chip `aria-label`. |

## Outputs

**NONE.** `[CODE]` The component declares no `output()` / `@Output`. It is purely presentational — interactivity lives in the buttons the parent projects into the actions slot (those buttons own their own `(falconClick)` handlers, e.g. org-hierarchy-page-menu.component.html:168/176/187).

## TypeScript types

`[CODE]` No exported type aliases. Inputs are primitive (`string` / `string | null`). The two directives export only their class + the injected `template: TemplateRef<unknown>`.

## Reflected props / mutable props

**N/A** — no Stencil layer, so no `@Prop({reflect})` and no mutable props. Signal inputs are one-way (parent → component).

## CVA / ngModel / Reactive Forms

**N/A — this is not a form control.** It implements no `ControlValueAccessor`, provides no `NG_VALUE_ACCESSOR`, and captures no value. Do not attempt `[(ngModel)]` / `formControlName`.

## Signal compatibility

`[CODE]` **Fully signal-based.** Inputs are `input()` / `input.required()`; slots are `contentChild()` signals; derived values are `computed()`. `OnPush` change detection (ts:33), zoneless-safe. No `*ngIf`/`*ngFor` — the template uses `@if`/`@else if` (html:20-31).

## Methods

**NONE** — no public methods. The component is declarative.

## Slots / template inputs

`[CODE]` Two **structural-directive-marked `<ng-template>` slots** plus the avatar fallback chain:

1. **Avatar (left), 3-tier precedence** (html:20-31):
   - `<ng-template falconNodeDetailsAvatar>` projected → renders it verbatim (replaces built-in avatar entirely).
   - else `imageUrl` set → `<img>` in a 28×28 (`w-7 h-7`) `bg-falcon-neutral-0` bordered circle.
   - else → initials chip: a 36×36 (`w-9 h-9`) `bg-falcon-teal-700` circle, white bold text, `[attr.aria-label]="effectiveAlt()"`.
2. **Actions (right)** (html:34-38): `<ng-template falconNodeDetailsActions>` projected → rendered in a `flex items-center gap-2 flex-wrap` container; empty when absent.

> `[CODE]` Note a size mismatch in the avatar branches: the `<img>` circle is `w-7 h-7` (28px) but the initials-chip circle is `w-9 h-9` (36px) — see GAPS G3.

## Supported sizes / states / variants / appearances

**NONE** — single fixed presentation. No `size`/`variant`/`appearance`/`state` axis (GAP G2). Geometry is fixed Tailwind utilities: header padding `px-5 pt-5 pb-5`, gap `gap-4`, label `text-sm font-semibold text-falcon-neutral-925` (html:11/32).

## Constraints

- `[CODE]` `label` is **required** (`input.required`) — omitting it is a compile-time error.
- `[CODE]` Projecting BOTH `imageUrl` and a `falconNodeDetailsAvatar` template → the template wins (avatar precedence, html:20). The `imageUrl` is silently ignored.
- `[CODE]` The component renders no border by default on the strip beyond a background; an earlier `border-b border-falcon-neutral-150` mentioned in the comment (html:7-10) is **NOT present in the live `<header>` class** (html:11 has only `bg-falcon-neutral-0`) — stale comment, see GAPS G4.
- `[CODE]` No dark-mode variants on the strip (`bg-falcon-neutral-0` light surface only) — see GAPS G5.

## Accessibility

- `[CODE]` html:27-28 — the **initials-chip** avatar carries `[attr.aria-label]="effectiveAlt()"` (good — names the decorative chip).
- `[CODE]` html:24 — the `<img>` avatar has `[alt]="effectiveAlt()"` (good).
- `[CODE]` html:32 — the label span uses `truncate` + `[title]="label()"` so the full name shows on hover; the `title` is the only AT affordance for the truncated text (A1 — `title` is a weak label).
- `[CODE]` html:11 — the strip is a semantic `<header>` element but is **unnamed** (no `aria-label` / `aria-labelledby`) — A2.
- `[CODE]` The actions slot contains caller-projected `<falcon-angular-button>`s which own their own a11y; the strip imposes none.
- **N/A:** no focusable interactive elements owned by the component itself (no clear button, no toggle) — so no focus-ring/keyboard concerns at the component boundary.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26) against falcon-node-details-section.component.ts (67 ln) + .html (39 ln) + both directives. 3 signal inputs, 2 `contentChild()` slots, 2 `computed`, 0 outputs, no CVA, no Stencil layer. Avatar 3-tier precedence + the `w-7`/`w-9` size mismatch + the stale `border-b` comment confirmed in live source.
