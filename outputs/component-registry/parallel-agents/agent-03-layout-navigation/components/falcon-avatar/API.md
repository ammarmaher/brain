# falcon-avatar — API

## Angular selector
`falcon-angular-avatar`

## Stencil tags
- Shadow: `<falcon-avatar>`
- Light: `<falcon-avatar-tw>`

## Import path
```ts
import {
  FalconAngularAvatarComponent,
  type FalconAvatarSize,
  type FalconAvatarShape,
  type FalconAvatarStatus,
} from '@falcon/ui-core/angular';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `src` | `string \| undefined` | — | Image URL. Primary content. |
| `initials` | `string \| undefined` | — | Initials fallback (e.g. "JD"). Used when `src` missing. |
| `iconName` | `string \| undefined` | — | Icon name fallback (Falcon icon font). Used when `src` AND `initials` are missing. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Token-driven: 24 / 32 / 40 / 48 / 64 px. |
| `shape` | `'circle' \| 'square'` | `'circle'` | Border radius: 999px / 8px. |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away' \| undefined` | — | Optional status dot bottom-right. |
| `altText` | `string \| undefined` | — | Alt text on the image (when `src` is used). |
| `useTailwind` | `boolean` | `true` | Render-path switch. |

## Outputs
**None.** Avatar is passive.

## TypeScript types

```ts
export type FalconAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type FalconAvatarShape = 'circle' | 'square';
export type FalconAvatarStatus = 'online' | 'offline' | 'busy' | 'away';
```

## Reflected props (Stencil)
`size`, `shape`, `status`. `data-size` / `data-shape` data attributes on host.

## Stencil methods
None.

## Slots
None.

## CVA support
Not applicable.

## Signal compatibility
Wrapper uses classic `@Input()` decorators.

## Supported sizes / shapes / statuses
- **Sizes:** xs (24px) / sm (32) / md (40) / lg (48) / xl (64).
- **Shapes:** circle (default, radius 999px) / square (radius 8px).
- **Statuses:**
  - `online` → green dot (`--color-falcon-green-500`).
  - `offline` → grey (`--color-falcon-neutral-400`).
  - `busy` → red (`--color-falcon-red-500`).
  - `away` → amber (`--color-falcon-amber-500`).

## Important constraints
- **Fallback chain is strict:**
  - If `src` is truthy → render `<img>`.
  - Else if `initials` truthy → render `<span>{initials}</span>`.
  - Else if `iconName` truthy → render `<i class="falcon-icon falcon-icon-<iconName>">`.
  - Else → empty avatar (just the surface).
- **`src` doesn't auto-fall-back on load error.** If the image URL 404s, the broken-image graphic shows; the component does NOT fall back to initials. This is a P1 gap.
- **Status dot is decorative but `aria-label="Status: <status>"` is set.**

## Accessibility attributes
- Image mode: `alt="<altText>"` (or empty string if not provided).
- Initials mode: no aria-label; the visual letters are NOT announced as the user's name (gap).
- Icon mode: `aria-hidden="true"` on the icon (it's a fallback).
- Status dot: `aria-label="Status: <status>"`.

## Parts (Stencil Shadow)
| Part | Element |
|---|---|
| `root` | Outer container. |
| `image` | `<img>` element. |
| `initials` | Initials `<span>`. |
| `icon` | Icon `<i>`. |
| `status` | Status `<span>` dot. |
