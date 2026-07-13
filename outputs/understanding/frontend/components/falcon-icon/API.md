# falcon-icon — API

## Selectors

- Angular: `falcon-angular-icon`
- Stencil Shadow: `<falcon-icon>` (tag `'falcon-icon'`, `shadow: true`)
- Stencil Light: `<falcon-icon-tw>` (tag `'falcon-icon-tw'`, `shadow: false`)

## Import

```ts
import {
  FalconAngularIconComponent,
  type FalconIconSize,
} from '@falcon/ui-core/angular';
// or via the root barrel:
import { FalconAngularIconComponent } from '@falcon/ui-core';
```

Add `FalconAngularIconComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is already set on the wrapper internally (`[CODE]` falcon-icon.component.ts:29).

## Inputs (all on `FalconAngularIconComponent`)

`[CODE]` falcon-icon.component.ts:31-57 — **5 inputs**; `name` and `label` are **signal-backed `@Input() set`/`get` pairs** (the value is written into a `signal<string>('')`, `null`/`undefined` coerce to `''`); `size`/`decorative`/`useTailwind` are plain `@Input()`s:

| Name | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | `''` (effectively REQUIRED) | Icon glyph name → `.falcon-icon-{name}` class. Signal-backed setter; `null`/`undefined` → `''` (empty `<i>`). Pass WITHOUT the `falcon-icon-` prefix. Forwarded as `[attr.name]`. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Drives `--falcon-icon-size-{size}` token (xs=12 / sm=14 / md=16 / lg=20 / xl=24 px). Reflected to host. |
| `decorative` | `boolean` | `true` | `true` → `aria-hidden="true"`, no role. `false` → `role="img"` + `aria-label={label}` (REQUIRES `label`). Forwarded as `[attr.decorative]="decorative ? '' : null"`. Reflected. |
| `label` | `string \| null \| undefined` | `''` | Accessible label when `decorative=false`. Signal-backed setter. Forwarded as `[attr.label]`. |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-icon-tw>` (Light DOM, default). `false` → `<falcon-icon>` (Shadow DOM). |

> `[CODE]` falcon-icon.component.html — the wrapper binds inputs as `[attr.*]` with falsy guards: `[attr.name]="_name() || null"`, `[attr.decorative]="decorative ? '' : null"` (presence-attr — empty string when true, removed when false), `[attr.label]="_label() || null"`. `size` is bound unconditionally.

### Stencil-only props (NOT on the Angular wrapper)

| Prop | Type | Default | Available on |
|---|---|---|---|
| `rootExtraClass` | `string \| undefined` | `undefined` | `-tw` twin ONLY `[CODE]` falcon-icon-tw.tsx:20 — extra Tailwind classes appended to the inner glyph `<i>`. The wrapper does NOT surface it. |

> `[CODE]` The Shadow `<falcon-icon>` has NO `rootExtraClass`. The two tags are otherwise **prop-identical** (`name`/`size`/`decorative`/`label`) — full dual-render parity.

## Outputs

**None.** `[CODE]` Icon is purely visual — no `CustomEvent` from either tag, no `@Output` on the wrapper.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-icon/falcon-icon.types.ts`:

```ts
export type FalconIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

> `[CODE]` The wrapper imports `FalconIconSize` from the types file and re-exports it (component.ts:20-22) — single source of truth.
> There is **no `FalconIconName` union** — `name` is a free `string`. A TypeScript icon-name union (auto-generated from the 314-glyph font) is a documented GAP (compile-time validation). For now the only check is runtime registry-resolution (unknown name → empty `<i>`).

## Reflected props (Stencil only)

`[CODE]` `size` and `decorative` are `@Prop({ reflect: true })` on BOTH tags (falcon-icon.tsx:19/23 / falcon-icon-tw.tsx:15/16) so `:host([size='xl'])` CSS targets them; both also write `data-size` on the `<Host>`. `name` and `label` are NOT reflected.

## Mutable props (Stencil)

**None.** No `@Prop({ mutable: true })`, no `@Watch`.

## CVA / ngModel / Reactive Forms

**Not applicable** — icon captures no value (no CVA).

## Signal compatibility

`[CODE]` falcon-icon.component.ts:33-54 — the wrapper uses **signal-backed `@Input()` setters** for `name` and `label` (each `set` writes `signal<string>('')`, the getter reads it; `null`/`undefined` coerce to `''`). `OnPush` enforced (component.ts:28). This is the modern setter pattern (contrast: `falcon-avatar` uses plain `@Input()`s).

## Methods (Stencil only)

**None.** No `@Method()` on either tag.

## Slots / template inputs

**None.** `[CODE]` Neither Stencil tag declares a `<slot>` — the glyph has no projectable content. No `ng-template` inputs.

## Supported sizes

- `xs` 12px · `sm` 14px · `md` 16px (default) · `lg` 20px · `xl` 24px. Each maps to `--falcon-icon-size-{size}` (which aliases `--falcon-icon-{size}`).

## Available icon names

`[CODE]` **314 glyphs** declared in `libs/falcon-theme/src/styles/falcon-icons.css` (codepoints `\e900`–`\ea39`). See OVERVIEW.md for the full grouped list. Naming follows the original PrimeIcons set (e.g. `pencil`, `trash`, `cog`, `user`, `check`, `times`, `chevron-down`, `arrow-right`, `wallet`, `credit-card`, `building`, `calendar`, …) — minus the `pi pi-` prefix, plus the `falcon-icon-` prefix supplied by the component. **(Corrected from the prior "122 icons" — that was the original migration subset.)**

## Constraints

- `[CODE]` **`name` is effectively required** — without it the rendered `<i>` shows nothing (`name` defaults to `''`).
- `[CODE]` **`decorative=true` is the default** — explicit `aria-hidden`. Most icons inside buttons/menus/tabs are decorative (the surrounding control carries the label).
- `[CODE]` **`decorative=false` REQUIRES `label`** — `[CODE]` falcon-icon.tsx:26/30 leave `aria-label` `undefined` if `label` is empty → a meaningful icon is silently un-announced.
- `[CODE]` **Color inherits from the parent** — `--falcon-icon-color: currentColor`. To color an icon, set color on the parent (`text-falcon-*`). There is no `color` input (GAP).
- `[CODE]` **No animation** — no `spin`/`pulse` props; consumers add Tailwind `animate-spin` on the host (or use the font's own `.falcon-icon-spin` class) (GAP).
- `[CODE]` Unknown `name` → empty `<i>` (no runtime validation, no console warning).

## Accessibility

- **Decorative mode (default):** `aria-hidden="true"`, no `role`.
- **Meaningful mode (`decorative=false` + `label`):** `role="img"` + `aria-label="{label}"`.
- `[CODE]` falcon-icon.tsx:28-31 — the `aria-hidden`/`aria-label`/`role` logic is identical on the `-tw` twin (falcon-icon-tw.tsx:24-26) — a11y parity across render paths.

## Parts (Stencil Shadow only)

`[CODE]` falcon-icon.tsx:38 — `part="glyph"` (the `<i>`). The `-tw` twin exposes no `part` (Light DOM).

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-icon.component.ts (66 ln), falcon-icon.component.html (21 ln), falcon-icon.tsx (44 ln), falcon-icon-tw.tsx (39 ln), falcon-icon.types.ts, falcon-icons.css. 5 wrapper inputs (`name`/`label` signal-backed setters), 0 outputs, 0 methods, 0 slots; reflected `size`/`decorative`; a11y parity across paths. Name set = **314 glyphs** (corrected from "122").
