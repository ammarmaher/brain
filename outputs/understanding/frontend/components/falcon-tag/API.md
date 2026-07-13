# falcon-tag — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Shadow | `<falcon-tag>` (tag `'falcon-tag'`, `shadow: true`) |
| Stencil Light | `<falcon-tag-tw>` (tag `'falcon-tag-tw'`, `shadow: false`) |
| Angular wrapper | `<falcon-angular-tag>` |

## Import

```ts
import { FalconAngularTagComponent } from '@falcon/ui-core';
import type { FalconTagSeverity, FalconTagSize } from '@falcon/ui-core';
```

`[CODE]` `CUSTOM_ELEMENTS_SCHEMA` set on the wrapper internally (falcon-tag.component.ts:35) — host does NOT need it.

## Inputs (Angular wrapper)

`[CODE]` falcon-tag.component.ts:38-53 — **7 wrapper inputs**:

| Input | Type | Default | Notes |
|---|---|---|---|
| `value` | `string \| null \| undefined` | `''` | `[CODE]` ts:38-42 — signal-backed (`_value`); coerces null → `''`. Display label. |
| `severity` | `FalconTagSeverity` | `'secondary'` | `[CODE]` ts:44 — plain input. 7 values. |
| `size` | `FalconTagSize` | `'md'` | `[CODE]` ts:45 — sm / md / lg. |
| `icon` | `string \| undefined` | `undefined` | `[CODE]` ts:46 — leading icon class fragment (rendered as `falcon-icon falcon-icon-{icon}`). |
| `rounded` | `boolean` | `true` | `[CODE]` ts:48 — pill (true) vs square (false). |
| `dismissible` | `boolean` | `false` | `[CODE]` ts:50 — renders the ✕ button. |
| `useTailwind` | `boolean` | `true` | `[CODE]` ts:53 — render-path switch (`true` → `<falcon-tag-tw>`, `false` → `<falcon-tag>`). |

> `[CODE]` falcon-tag.component.html:11/23 — the `rounded` attr is forwarded as `[attr.rounded]="rounded ? '' : 'false'"` (NOT `null` when false — the literal string `'false'` is what the Shadow CSS `:host([rounded='false'])` targets). `dismissible` is `[attr.dismissible]="dismissible ? '' : null"`.

## Outputs (Angular wrapper)

`[CODE]` falcon-tag.component.ts:56 / html:14/25:

| Output | Type | When |
|---|---|---|
| `falconDismiss` | `EventEmitter<string>` | `[CODE]` ts:56,76-79 — ✕ clicked. The wrapper binds the Stencil `(falcon-tag-dismiss)` event and re-emits `event.detail.value` (falling back to the current `_value()`). |

## Stencil events

- `[CODE]` falcon-tag.tsx:44-45 / falcon-tag-tw.tsx:32-33 — `falcon-tag-dismiss` (`@Event({ eventName: 'falcon-tag-dismiss', bubbles: true, composed: true })`), payload `FalconTagDismissDetail { value: string }`. Emitted by `handleDismiss` (which calls `e.stopPropagation()`).

## TypeScript types

`[CODE]` falcon-tag.types.ts:2-15:

```ts
type FalconTagSeverity =
  | 'success' | 'info' | 'warning' | 'warn'   // 'warn' = legacy alias for 'warning'
  | 'danger' | 'secondary' | 'contrast';
type FalconTagSize = 'sm' | 'md' | 'lg';
interface FalconTagDismissDetail { value: string; }
```

(`[CODE]` The wrapper re-declares `FalconTagSeverity` / `FalconTagSize` (falcon-tag.component.ts:19-28) identical to the types file — a minor SSOT smell, same family as status-badge FSB-04, but not separately flagged.)

## Reflected props (Stencil)

`severity`, `size`, `rounded` are `@Prop({ reflect: true })` so `:host([severity='success'])` / `:host([rounded='false'])` / `:host([size='sm'])` CSS rules target them. `icon`, `value`, `dismissible` are non-reflected.

## Slots / `ng-content`

`[CODE]` falcon-tag.component.html:15/26 — the wrapper projects `<ng-content>` in **both** render paths. The Stencil tags render `<slot>{this.value}</slot>` (falcon-tag.tsx:69 / falcon-tag-tw.tsx:50), so **projected content overrides the `[value]` prop**. A consumer can project `<i>` + text instead of passing `[value]`.

- No `ng-template` inputs.

## Variants

- **Severity:** 7 values — `success` / `info` / `warning` / `warn` (legacy alias) / `danger` / `secondary` (neutral default) / `contrast` (dark inverse). `[CODE]` falcon-tag.css:50-70 / tag-tailwind-classes.ts:36-46.
- **Size:** sm / md / lg.
- **Shape:** `rounded=true` (pill, radius 999px) / `rounded=false` (square, `--falcon-tag-radius-square: 4px`).
- **Dismissible:** opt-in ✕ button.

## CVA

NO — not a form control.

## Accessibility

- `[CODE]` falcon-tag.tsx:76 / falcon-tag-tw.tsx:56 — dismiss `<button type="button" aria-label="Remove">`. **`aria-label` is hardcoded English** (i18n gap FT-02).
- `[CODE]` falcon-tag.tsx:63 / falcon-tag-tw.tsx:47 — leading icon `<i>` is `aria-hidden="true"`.
- `[CODE]` data-severity + data-size attributes on the root for token cascading.

## Important constraints / dead code

- `[CODE]` **The wrapper's `classes` computed (falcon-tag.component.ts:61-99) + `_sizeClasses()` + `_severityClasses()` helpers are DEAD CODE** — they generate concrete `bg-falcon-{x}-{n} text-falcon-{x}-{n}` strings but are **never referenced** in `falcon-tag.component.html` (the template delegates entirely to the Stencil `-tw`/Shadow tags). Wave 9.E carry-over. FT-01 recommends removal. Do NOT extend it.
- `[CODE]` **The `-tw`/wrapper path hardcodes palette utilities, NOT tokens** — `tag-tailwind-classes.ts:36-46` returns `bg-falcon-green-50 text-falcon-green-700` etc. (and the wrapper's dead `_severityClasses()` mirrors them). This means `tag.tokens.css`'s per-severity tokens are **NOT consumed by the default (Tailwind) render path** — only the Shadow path's CSS reads `--falcon-tag-*` (see TOKENS.md).

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-tag.component.ts (101 ln), .component.html (29 ln), falcon-tag.tsx (87 ln), falcon-tag-tw.tsx (67 ln), .types.ts, tag-tailwind-classes.ts. Confirmed: 7 wrapper inputs, 1 output (`falconDismiss` ← `falcon-tag-dismiss`), `<ng-content>` overrides `[value]`, `rounded` attr serialises to `''`/`'false'`, dead `classes` computed (FT-01), `-tw` hardcodes palette (token-parity gap), `aria-label="Remove"` hardcoded (FT-02).
