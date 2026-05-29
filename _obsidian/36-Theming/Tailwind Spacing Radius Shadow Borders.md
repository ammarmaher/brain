---
type: reference
library: "[[Tailwind CSS]]"
topic: spacing-radius-shadow-borders
created: 2026-05-20
---
*** Tailwind v4 Spacing / Radius / Shadow / Borders — the visual-rhythm token families ***
*** Falcon-tokenized: avoid arbitrary values; consume semantic tokens ***
*** Upstream SoT: tailwindcss.com/docs (spacing, border-radius, box-shadow, border-color) ***

# Tailwind Spacing, Radius, Shadow, Borders

> The four visual-rhythm token families. Each one has a Tailwind primitive utility set + a Falcon semantic token layer. **Templates consume the Falcon semantic tokens via Tailwind utilities — never hardcode pixel values.**

## Spacing

Spacing drives margin / padding / gap / numeric width-height utilities. Tailwind v4 collapses these into a single `--spacing` variable.

```css
@theme {
  --spacing: 0.25rem;   /* base unit — 1 spacing step */
}
```

`p-4` resolves to `padding: calc(var(--spacing) * 4);` → `1rem` at default base.

### Utilities

| Family | Examples |
|---|---|
| Padding | `p-4`, `px-6`, `py-2`, `pt-1`, `pr-3`, `pb-2`, `pl-4` |
| Margin | `m-4`, `mx-auto`, `my-2`, `mt-1`, `-mt-2` (negative) |
| Gap | `gap-4`, `gap-x-2`, `gap-y-1` |
| Space-between (legacy) | `space-x-4`, `space-y-2` |

### Falcon doctrine — define spacing through tokens

Per [[Falcon Tailwind Theme]], Falcon must define spacing rules through semantic tokens, not raw `p-*` repetition:

| Surface | Semantic spacing slot |
|---|---|
| Page padding | `--falcon-spacing-page` |
| Card padding | `--falcon-spacing-card` |
| Table cell padding | `--falcon-table-cell-padding-x` / `-y` |
| Button padding | `--falcon-button-padding-x` / `-y` |
| Input padding | `--falcon-input-padding-x` / `-y` |
| Modal padding | `--falcon-modal-padding` |

Templates compose: `class="px-falcon-card py-falcon-card"` (if the slot generates a utility) OR consume via component-token chain.

## Radius

### Tailwind primitives

| Utility | Value |
|---|---|
| `rounded-none` | 0 |
| `rounded-xs` | 0.125rem |
| `rounded-sm` | 0.25rem |
| `rounded-md` | 0.375rem |
| `rounded-lg` | 0.5rem |
| `rounded-xl` | 0.75rem |
| `rounded-2xl` | 1rem |
| `rounded-3xl` | 1.5rem |
| `rounded-full` | 9999px |
| `rounded-(--my-radius)` | CSS var shorthand |

### Falcon semantic radius tokens

```css
@theme {
  --radius-falcon-sm: 0.25rem;
  --radius-falcon-md: 0.5rem;
  --radius-falcon-lg: 0.75rem;
  --radius-falcon-pill: 9999px;
}
```

Auto-generates: `rounded-falcon-sm`, `rounded-falcon-md`, `rounded-falcon-lg`, `rounded-falcon-pill`.

**Rule:** avoid `rounded-[13px]`. If a needed radius doesn't exist, document a token gap and add to `@theme`.

## Shadow

### Tailwind primitives

| Utility | Use |
|---|---|
| `shadow-xs` / `shadow-sm` / `shadow-md` / `shadow-lg` / `shadow-xl` / `shadow-2xl` | Increasing elevation |
| `shadow-inner` | Inset |
| `shadow-none` | Remove |
| `shadow-(--my-shadow)` | CSS var shorthand |

### Falcon semantic shadow tokens

```css
@theme {
  --shadow-falcon-xs:       0 1px 2px rgba(13, 63, 68, 0.04);
  --shadow-falcon-sm:       0 1px 3px rgba(13, 63, 68, 0.08);
  --shadow-falcon-card:     0 2px 8px rgba(13, 63, 68, 0.10);
  --shadow-falcon-popover:  0 8px 24px rgba(13, 63, 68, 0.16);
  --shadow-falcon-modal:    0 20px 50px rgba(13, 63, 68, 0.20);
  --shadow-falcon-focus:    0 0 0 3px rgba(105, 142, 146, 0.22);
}
```

Auto-generates: `shadow-falcon-card`, `shadow-falcon-popover`, etc.

### Falcon rule on shadow application

> **Do NOT add shadows to every button.** Shadows belong to containers, cards, popovers, modals. Buttons use color + border + focus ring for elevation — not box-shadow.

| Element | Shadow? |
|---|---|
| Page card | ✅ `shadow-falcon-card` |
| Popover / dropdown | ✅ `shadow-falcon-popover` |
| Modal / dialog | ✅ `shadow-falcon-modal` |
| Button | ❌ No (uses border + focus ring) |
| Input | ❌ No (uses border + focus ring) |
| Sticky toolbar | ⚠️ Sometimes (use `shadow-falcon-sm` when needed for separation) |
| Focus ring | ✅ `shadow-falcon-focus` (consumed via `focus-visible:[box-shadow:var(--shadow-falcon-focus)]`) |

## Borders

### Tailwind primitives

| Utility | Effect |
|---|---|
| `border` | 1px solid current color |
| `border-2` / `border-4` / `border-8` | Thicker |
| `border-0` | None |
| `border-t` / `-r` / `-b` / `-l` | Single side |
| `border-x` / `border-y` | Axis |
| `border-solid` / `border-dashed` / `border-dotted` / `border-none` | Style |
| `border-falcon-X` | Color (from @theme) |
| `border-(--my-color)` | CSS var shorthand |

### Falcon semantic border-color tokens (per state)

For inputs especially, border state is critical:

| State | Token slot |
|---|---|
| default | `--falcon-input-border-default` |
| hover | `--falcon-input-border-hover` |
| focus | `--falcon-input-border-focus` |
| error | `--falcon-input-border-error` |
| disabled | `--falcon-input-border-disabled` |

Templates:

```html
<input class="border border-falcon-input-default 
              hover:border-falcon-input-hover 
              focus-visible:border-falcon-input-focus 
              aria-invalid:border-falcon-input-error 
              disabled:border-falcon-input-disabled" />
```

## See also

- [[Tailwind CSS]] · [[Tailwind Theme Variables]] · [[Tailwind Sizing and Responsive]] · [[Falcon Tailwind Theme]] · [[Falcon Design Tokens]] · [[Falcon Component Theme Contract]]
- Brain Outputs: [TOKEN_FLOW_REPORT](../../Brain%20Outputs/understanding/frontend/theme/TOKEN_FLOW_REPORT.md) · [STYLING_RULES_CHEAT_SHEET](../../Brain%20Outputs/understanding/frontend/theme/STYLING_RULES_CHEAT_SHEET.md)

## Tags

#type/reference #layer/frontend #layer/design

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
