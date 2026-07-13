# falcon-empty-state — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Shadow | `<falcon-empty-state>` |
| Stencil Light | `<falcon-empty-state-tw>` |
| Angular wrapper | `<falcon-angular-empty-state>` |

## Import

```ts
import { FalconAngularEmptyStateComponent } from '@falcon/ui-core/angular';
import type { FalconEmptyStateSize } from '@falcon/ui-core';
```

Add `FalconAngularEmptyStateComponent` to the host's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is set on the wrapper internally. `[CODE]` NOT re-exported from `libs/falcon` shared-ui (unlike `<falcon-angular-empty-data>`).

## Inputs (Angular wrapper)

`[CODE]` falcon-empty-state.component.ts — `iconName`/`titleText`/`descriptionText` are signal-backed `@Input set` (null/undefined → `''`); `size`/`useTailwind` are plain `@Input`s.

| Input | Type | Default | Notes |
|---|---|---|---|
| `iconName` | `string \| null \| undefined` | `''` | Falcon **icon-font** glyph rendered as `<i class="falcon-icon falcon-icon-{name}">` (`[CODE]` tsx:43). NOT an inline SVG (contrast `<falcon-empty-data>`). Unknown name → empty `<i>`. |
| `titleText` | `string \| null \| undefined` | `''` | Required heading, rendered as `<h3>` (`[CODE]` tsx:46-48). |
| `descriptionText` | `string \| null \| undefined` | `''` | Optional supporting copy, rendered as `<p>` (`[CODE]` tsx:51-53). |
| `size` | `FalconEmptyStateSize` (`'sm'\|'md'\|'lg'`) | `'md'` | Drives icon size + font scale + vertical rhythm. Reflected to the host attr on the Stencil tag (`[CODE]` tsx:24 `reflect:true`). |
| `useTailwind` | `boolean` | `true` | Render-path switch: `true` → `<falcon-empty-state-tw>` (Light DOM), `false` → `<falcon-empty-state>` (Shadow). |

## Stencil props

| Prop | Type | Default | Available on | Notes |
|---|---|---|---|---|
| `ariaLabel` | `string \| undefined` | `undefined` → `titleText` | Shadow `<falcon-empty-state>` only (`[CODE]` tsx:26-28) | Overrides the accessible label. Pass `""` to make the placeholder fully presentational (`aria-label` becomes `undefined`). **NOT surfaced on the Angular wrapper** (FES-05). |
| `rootExtraClass` | `string \| undefined` | `undefined` | Light `<falcon-empty-state-tw>` only (`[CODE]` falcon-empty-state-tw.tsx:24/37) | Caller-supplied extra class appended to the root. **NOT surfaced on the Angular wrapper.** |

> `[CODE]` The Shadow variant has NO `rootExtraClass`; the Light variant has NO `ariaLabel` — a minor prop-parity gap between the two twins.

## Outputs

`[CODE]` **NONE** — purely presentational. The wrapper has no `@Output`; the action (if any) is the consumer's projected element with its own event. (Contrast `<falcon-empty-data>`, which has `(actionClick)`.)

## TypeScript types

```ts
type FalconEmptyStateSize = 'sm' | 'md' | 'lg';
```

`[CODE]` Re-exported from the wrapper (`export type { FalconEmptyStateSize }`, falcon-empty-state.component.ts:18) — matches the Stencil type.

## Reflected props (Stencil)

`[CODE]` `size` is `@Prop({ reflect: true })` on both tags → `:host([size='sm'])` / `:host([size='lg'])` CSS rules target it (`[CODE]` falcon-empty-state.css:74-92). No other reflected props.

## CVA / ngModel / Reactive Forms

**NO** — not a form control. No value, no `NG_VALUE_ACCESSOR`.

## Slots

- Stencil: one named `<slot name="action">` for the action button(s) below the description (`[CODE]` tsx:56-58; tw.tsx:47-49). The action region is `display:inline-flex` with `:empty{display:none}` so it collapses when nothing is projected.
- Angular wrapper: the template projects `<ng-content select="[slot=action]">` into BOTH render paths (`[CODE]` falcon-empty-state.component.html:11/19). Consumers pass `<falcon-angular-button slot="action">…</falcon-angular-button>`.

## Variants

- **Size:** `sm` / `md` / `lg` — scales icon font-size (`40 / 56 / 80px`), title size (`text-md / text-lg / text-xl`), description size (`text-xs / text-sm / text-md`). `[CODE]` empty-state.tokens.css:31-48.

## Accessibility

- `[CODE]` Root `<div>` has `role="img"` + `aria-label={ariaLabel ?? titleText}` (`[CODE]` tsx:31-40). The whole placeholder is announced as one labelled image; the title carries the meaning.
- `[CODE]` Pass `ariaLabel=""` → `aria-label` becomes `undefined` → fully presentational (Shadow only).
- `[CODE]` Icon container is `aria-hidden="true"` (decorative).
- `[CODE]` Title is `<h3>`, description is `<p>` (real heading semantics — contrast `<falcon-empty-data>`'s `<div>` title).
- The action slot is a positional region; the projected content's a11y is the consumer's responsibility.

## Important constraints

- `[CODE]` The action region is `<slot name="action">`; on the Light (`-tw`) path the projected element MUST carry the `slot="action"` attribute or it won't land in the region.
- `[CODE]` The wrapper host has `class="falcon-angular-empty-state block"` (`[CODE]` ts:61).
- `[CODE]` `ariaLabel` (Shadow) and `rootExtraClass` (Light) are reachable only on the raw Stencil tags, not the Angular wrapper (FES-05 + a minor `rootExtraClass` gap).
- `[CODE]` The Shadow variant re-declares the `.falcon-icon` font-face class inside its shadow root (`[CODE]` falcon-empty-state.css:9-16) because class definitions don't cross the shadow boundary.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 refresh) against falcon-empty-state.tsx (63 ln), falcon-empty-state-tw.tsx (54 ln), falcon-empty-state.component.ts (66 ln), .component.html (21 ln), .css (93 ln), .types.ts. Added: icon-font (not SVG) detail, `size` reflect, `rootExtraClass` (Light-only) prop, the `ariaLabel`/`rootExtraClass` twin-parity gap. NO Output confirmed.
