# falcon-avatar — API

## Selectors

- Angular: `falcon-angular-avatar`
- Stencil Shadow: `<falcon-avatar>` (tag `'falcon-avatar'`, `shadow: true`)
- Stencil Light: `<falcon-avatar-tw>` (tag `'falcon-avatar-tw'`, `shadow: false`)

## Import

```ts
import {
  FalconAngularAvatarComponent,
  type FalconAvatarSize,
  type FalconAvatarShape,
  type FalconAvatarStatus,
} from '@falcon/ui-core/angular';
// or via the root barrel:
import { FalconAngularAvatarComponent } from '@falcon/ui-core';
```

Add `FalconAngularAvatarComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is already set on the wrapper internally (`[CODE]` falcon-avatar.component.ts:28) — the host component does NOT need it.

## Inputs (all on `FalconAngularAvatarComponent`)

`[CODE]` falcon-avatar.component.ts:30-53 — **8 classic `@Input()` decorators** (no signal inputs, no setters):

| Name | Type | Default | Notes |
|---|---|---|---|
| `src` | `string \| undefined` | `undefined` | Image URL — primary content. Forwarded as `[attr.src]` (or `null` when falsy). |
| `initials` | `string \| undefined` | `undefined` | Initials fallback (e.g. `"JD"`). Renders when `src` is falsy. Forwarded as `[attr.initials]`. |
| `iconName` | `string \| undefined` | `undefined` | Falcon-icon-font glyph name. Renders when BOTH `src` and `initials` are falsy. Forwarded as `[attr.icon-name]`. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Token-driven: 24 / 32 / 40 / 48 / 64 px. Reflected to host (Stencil). |
| `shape` | `'circle' \| 'square'` | `'circle'` | Border radius: 999px (circle) / 8px (square). Reflected. |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away' \| undefined` | `undefined` | Optional presence dot bottom-right. Forwarded as `[attr.status]` (or `null`). Reflected. |
| `altText` | `string \| undefined` | `undefined` | `alt` text on the `<img>` (only used in image mode). Forwarded as `[attr.alt-text]`. |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-avatar-tw>` (Light DOM). `false` → `<falcon-avatar>` (Shadow DOM). |

> `[CODE]` The wrapper template (`falcon-avatar.component.html`) binds **all inputs as `[attr.*]`** with a `|| null` falsy guard on the string inputs — so an empty/undefined `src` becomes a removed attribute, not `src=""`. `size`/`shape` are bound unconditionally (they always have a default).

### Stencil-only props (NOT exposed on the Angular wrapper but available on the raw tag)

| Prop | Type | Default | Available on |
|---|---|---|---|
| `rootExtraClass` | `string \| undefined` | `undefined` | `-tw` twin ONLY `[CODE]` falcon-avatar-tw.tsx:29 — caller-supplied extra Tailwind classes appended to the root `<div>`. The Angular wrapper does NOT surface it (GAP G6). |

> `[CODE]` The Shadow `<falcon-avatar>` has NO `rootExtraClass` and NO extra props beyond the 7 shared `@Prop`s. The two tags are otherwise **prop-identical** (`src`/`initials`/`iconName`/`size`/`shape`/`status`/`altText`).

## Outputs

**None.** `[CODE]` Avatar is passive — neither Stencil tag emits a `CustomEvent`, and the wrapper declares no `@Output`. No click, no image-load, no image-error event (the missing image-error event is GAP G1).

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-avatar/falcon-avatar.types.ts`:

```ts
export type FalconAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type FalconAvatarShape = 'circle' | 'square';
export type FalconAvatarStatus = 'online' | 'offline' | 'busy' | 'away';
```

> `[CODE]` The wrapper imports these types from the Stencil types file and re-exports them (component.ts:14-21) — **single source of truth, no re-declaration** (contrast: `falcon-status-badge` re-declares its unions — FSB-04).

## Reflected props (Stencil only)

`[CODE]` `size`, `shape`, `status` are `@Prop({ reflect: true })` on BOTH tags (falcon-avatar.tsx:28-34 / falcon-avatar-tw.tsx:23-25) so `:host([size='xl'])`, `:host([shape='square'])` CSS rules target them. `src`/`initials`/`iconName`/`altText`/`rootExtraClass` are NOT reflected. Both tags ALSO write `data-size` / `data-shape` data-attributes on the root `<div>` (used by the markup, not by CSS selectors).

## Mutable props (Stencil)

**None.** No `@Prop({ mutable: true })`, no `@Watch`. Avatar is a pure pass-through render.

## CVA / ngModel / Reactive Forms

**Not applicable.** `[CODE]` Avatar is presentational — no `ControlValueAccessor`, no `NG_VALUE_ACCESSOR` provider, no form binding. It captures no value.

## Signal compatibility

`[CODE]` falcon-avatar.component.ts — the wrapper uses **classic `@Input()` decorators**, NOT signal inputs and NOT signal-backed setters (contrast: `falcon-icon` / `falcon-card-status` wrappers use signal-backed setters). `OnPush` change detection enforced (component.ts:27). Binding an `@Input()` to a signal in the parent works as normal.

## Methods (Stencil only)

**None.** No `@Method()` on either tag. There is no `setFocus()` / `clear()` analog.

## Slots / template inputs

**None.** `[CODE]` Neither Stencil tag declares a `<slot>` (falcon-avatar.tsx / falcon-avatar-tw.tsx) and the wrapper has no `ng-template` inputs. Content is fully prop-driven (`src`/`initials`/`iconName`). There is NO per-instance content projection.

## Render fallback chain (the core behavior)

`[CODE]` falcon-avatar.tsx:40-42 (mirrored verbatim in falcon-avatar-tw.tsx:32-34):

```ts
const showImage = !!this.src;
const showInitials = !showImage && !!this.initials;
const showIcon = !showImage && !showInitials && !!this.iconName;
```

- `src` truthy → `<img class="falcon-avatar-image" alt={altText ?? ''}>`.
- else `initials` truthy → `<span class="falcon-avatar-initials">{initials}</span>`.
- else `iconName` truthy → `<i class="falcon-icon falcon-icon-{iconName}" aria-hidden="true">`.
- else → empty surface (just the tinted disc).

This is a **render-time** (compile-time truthiness) chain — NOT a runtime image-load-error swap (GAP G1).

## Supported sizes / shapes / statuses

- **Sizes:** `xs` (24px) / `sm` (32) / `md` (40, default) / `lg` (48) / `xl` (64). Initials font-size scales per size (10/12/16/20/26 px).
- **Shapes:** `circle` (default, radius 999px) / `square` (radius 8px).
- **Statuses:** `online` → green (`--falcon-avatar-status-online`) · `offline` → grey (`-offline`) · `busy` → red (`-busy`) · `away` → amber (`-away`). The dot has a white ring (`--falcon-avatar-status-ring-*`).

## Constraints

- `[CODE]` The fallback chain is **render-time only** — a 404'd `src` shows the broken-image graphic; it does NOT fall back to initials (GAP G1).
- `[CODE]` Pass `undefined`, never `""`, for `src` — the wrapper's `[attr.src]="src || null"` removes the attr for `""`, so the Stencil `!!this.src` correctly falls through; but a raw-tag consumer binding `src=""` directly would render `<img src="">`.
- `[CODE]` `rootExtraClass` is `-tw`-only and NOT surfaced by the wrapper — extra root classes in Angular must go via the host `class=` (which lands on `<falcon-angular-avatar>`, not the inner root `<div>`). Restyle via tokens instead.
- `[CODE]` `useTailwind=false` (Shadow path) only honors the documented `--falcon-avatar-*` CSS-var tokens through the boundary; no Tailwind utilities cascade in.

## Accessibility

- **Image mode:** `alt="{altText}"` (or empty string `''` when `altText` is not provided — `[CODE]` falcon-avatar.tsx:52). An empty alt makes the image silent to screen readers — set `altText` for user/account avatars.
- **Initials mode:** `[CODE]` plain `<span>{initials}</span>` with **NO `aria-label`** — a screen reader announces the letters ("J D"), NOT the person's name (GAP G3).
- **Icon mode:** `aria-hidden="true"` on the `<i>` (it is a decorative fallback).
- **Status dot:** `[CODE]` `aria-label="Status: {status}"` on the dot `<span>` (falcon-avatar.tsx:72 / falcon-avatar-tw.tsx:67).
- **Root:** the root `<div>` has NO `role` — fine for a decorative avatar, but there is no clickable / `role="button"` mode (GAP G5).

## Parts (Stencil Shadow only)

`[CODE]` falcon-avatar.tsx — `part="root"` (outer `<div>`), `part="image"`, `part="initials"`, `part="icon"`, `part="status"`. **The `-tw` twin exposes NO `part`s** (Light DOM uses classes, not Shadow parts) — a Shadow-vs-`-tw` divergence (GAP G7).

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-avatar.component.ts (60 ln), falcon-avatar.component.html (24 ln), falcon-avatar.tsx (79 ln), falcon-avatar-tw.tsx (74 ln), falcon-avatar.types.ts. 8 wrapper `@Input`s, 0 `@Output`s, 0 `@Method`s, 0 slots; reflected `size`/`shape`/`status`; render-time 3-tier fallback. New gaps surfaced: `rootExtraClass` not on wrapper (G6); `-tw` lacks Shadow `part`s (G7).
