# falcon-badge — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Shadow | `<falcon-badge>` |
| Stencil Light | `<falcon-badge-tw>` |
| Angular wrapper | `<falcon-angular-badge>` |

## Inputs (Angular wrapper)

| Input | Type | Default | Notes |
|---|---|---|---|
| `variant` | `FalconBadgeVariant` | `'neutral'` | One of 6 semantic variants |
| `appearance` | `FalconBadgeAppearance` | `'subtle'` | `solid` / `subtle` / `outline` |
| `size` | `FalconBadgeSize` | `'md'` | sm / md / lg |
| `dot` | `boolean` | `false` | Leading variant-tinted dot |
| `iconName` | `string \| undefined` | — | Leading icon name (`.falcon-icon-{name}`) |
| `useTailwind` | `boolean` | `true` | |

## Stencil props (Shadow vs Light divergence — verified 2026-06-03)

The two Stencil tags are **NOT a clean 1:1** — each has one prop the other lacks:

| Prop | `<falcon-badge>` (Shadow) | `<falcon-badge-tw>` (Light) | Notes |
|---|---|---|---|
| `variant` / `appearance` / `size` / `dot` | ✅ `@Prop({reflect:true})` | ✅ `@Prop({reflect:true})` | parity OK |
| `iconName` | ✅ `@Prop()` (not reflected) | ✅ `@Prop()` (not reflected) | parity OK |
| `ariaLabel` | ✅ `@Prop()` (`[CODE]` falcon-badge.tsx:37) — sets `aria-label` on the root span for dot-only badges | ❌ **ABSENT** (`[CODE]` falcon-badge-tw.tsx:19-27 has no `ariaLabel`) | **Parity gap — see FB-01 (expanded).** The default render path (`useTailwind=true` → `-tw`) cannot set `aria-label` even via the raw tag. |
| `rootExtraClass` | ❌ ABSENT | ✅ `@Prop()` (`[CODE]` falcon-badge-tw.tsx:27) — caller-supplied class appended to the root | `-tw`-only escape hatch; not on Shadow, not surfaced on the Angular wrapper. |

> Consequence: **`ariaLabel` is reachable ONLY on the Shadow `<falcon-badge>` tag** — neither the Angular wrapper NOR the default `-tw` twin exposes it. A dot-only accessible badge requires `useTailwind=false` + the raw Shadow tag (or `<falcon-angular-badge [useTailwind]="false">` … which still can't set `ariaLabel` because the wrapper doesn't forward it). This makes FB-01 broader than "wrapper lacks the input": the **default render path has no a11y-label path at all.**

## Outputs

NONE — presentational. No `@Event` on either Stencil tag; no `@Output` on the wrapper.

## TypeScript types

```ts
type FalconBadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type FalconBadgeAppearance = 'solid' | 'subtle' | 'outline';
type FalconBadgeSize = 'sm' | 'md' | 'lg';
```

## Variant × appearance × size matrix

- **6 variants:** neutral / primary (teal) / success (green) / warning (amber) / danger (red) / info (blue)
- **3 appearances:** solid (filled, white fg) / subtle (tinted bg, dark fg) / outline (border, no fill)
- **3 sizes:** sm / md / lg

`6 × 3 × 3 = 54 visual combinations.` All token-driven.

## Slots

- Stencil: default slot for label content.
- Angular wrapper: YES — the wrapper template includes `<ng-content></ng-content>` inside both `<falcon-badge-tw>` and `<falcon-badge>` render paths (verified in `falcon-badge.component.html`). So `<falcon-angular-badge>3</falcon-angular-badge>` works.

## CVA

NO — not a form control.

## Accessibility

- The **Shadow** tag sets `aria-label` from the `ariaLabel` prop for dot-only badges (`[CODE]` falcon-badge.tsx:48). The **`-tw`** tag and the **Angular wrapper** do NOT — so the default render path cannot label a dot-only badge (FB-01, expanded above).
- `data-variant`, `data-appearance`, `data-size` attributes on the host span for token cascading + selector targeting (BOTH tags — `[CODE]` falcon-badge.tsx:45-47 / falcon-badge-tw.tsx:42-44).
- The leading dot + leading icon are `aria-hidden="true"` on both paths (decorative).
- No focus/keyboard surface — the badge is non-interactive (no outputs, no role beyond the optional `aria-label`).

## Token-naming note (verified 2026-06-03)

The `solid` appearance does **not** have dedicated `--falcon-badge-{variant}-solid-bg` tokens — `variantSolidClasses()` reuses the **dot** token family for the solid background (`[CODE]` badge-tailwind-classes.ts:35-48 → `--falcon-badge-primary-dot-bg` etc.), and `falconBadgeDotClasses()` reads the same tokens (`[CODE]` :114-127). So "solid badge background" and "leading-dot colour" are the SAME token per variant. Overriding `--falcon-badge-primary-dot-bg` to retint a dot ALSO retints every solid primary badge. Minor token-naming smell — see GAPS (safe-local).

## Verification
🟢 code-verified — every prop, the Shadow↔`-tw` divergence (`ariaLabel` / `rootExtraClass`), the `<ng-content>` projection, and the solid-uses-dot-token aliasing are confirmed against the live `.tsx` / `.html` / `badge-tailwind-classes.ts` on 2026-06-03 (REFRESH). NOT runtime-verified.
