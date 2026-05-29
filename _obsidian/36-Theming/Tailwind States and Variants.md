---
type: reference
library: "[[Tailwind CSS]]"
topic: state-variants
docs-source: https://tailwindcss.com/docs/hover-focus-and-other-states
created: 2026-05-20
---
*** Tailwind v4 States — full 60-variant catalog ***
*** Hover / focus / group / peer / has / not / aria / data — stackable ***
*** Upstream SoT: tailwindcss.com/docs/hover-focus-and-other-states ***

# Tailwind States and Variants

> v4 has ~60 built-in variants for pseudo-classes, pseudo-elements, attribute selectors, media queries, and parent/sibling relationships. They stack: `dark:md:hover:focus-visible:bg-fuchsia-600` is valid. **The deepest single topic in Tailwind.** Falcon under-uses `focus-visible:` and `dark:` companions — see scorecard.

## Pseudo-class variants

| Variant | CSS selector | Use for |
|---|---|---|
| `hover:` | `&:hover` (wrapped in `@media (hover: hover)`) | Mouse hover only |
| `focus:` | `&:focus` | Any focus |
| `focus-visible:` | `&:focus-visible` | **Keyboard-only focus (preferred for rings)** |
| `focus-within:` | `&:focus-within` | Any descendant focused |
| `active:` | `&:active` | Mouse-down |
| `visited:` | `&:visited` | Visited links |
| `disabled:` / `enabled:` | `&:disabled` / `&:enabled` | Form-control state |
| `checked:` / `indeterminate:` | Checkbox/radio | |
| `required:` / `optional:` | Form validity hints | |
| `valid:` / `invalid:` | Constraint validation | |
| `user-valid:` / `user-invalid:` | Only after user interaction | |
| `placeholder-shown:` | Empty input | |
| `autofill:` / `read-only:` | Form states | |
| `open:` | `&:is([open], :popover-open, :open)` | Details/dialog/popover |
| `inert:` | `&:is([inert], [inert] *)` | Non-interactive subtree |
| `first:` / `last:` / `only:` | First/last/only child | List rows |
| `odd:` / `even:` | nth-child(odd/even) | Zebra striping |
| `nth-3:` / `nth-[2n+1]:` | Arbitrary position | |
| `empty:` | `&:empty` | No children |

## `:has()` modifier

```html
<label class="has-checked:bg-indigo-50">
  <input type="radio" /> Google Pay
</label>

<div class="has-[img]:p-4">…</div>
```

## `:not()` modifier

```html
<button class="bg-indigo-600 hover:not-focus:bg-indigo-700">…</button>
<div class="not-supports-[display:grid]:flex">…</div>
```

## Pseudo-element variants

| Variant | Pseudo-element |
|---|---|
| `before:` / `after:` | Auto-adds `content: ''` |
| `placeholder:` | `::placeholder` |
| `selection:` | `::selection` |
| `first-line:` / `first-letter:` | Typography |
| `marker:` | List bullets |
| `file:` | `::file-selector-button` |
| `backdrop:` | Dialog/popover backdrop |

## Group variants (parent → child)

```html
<a class="group">
  <svg class="stroke-sky-500 group-hover:stroke-white" />
  <h3 class="text-gray-900 group-hover:text-white">Title</h3>
</a>
```

**Named groups** (nested):

```html
<li class="group/item">
  <a class="group/edit group-hover/item:visible">
    <span class="group-hover/edit:text-gray-700">Call</span>
  </a>
</li>
```

## Peer variants (sibling → element)

```html
<input type="email" class="peer" required />
<p class="invisible peer-invalid:visible">Invalid email</p>
```

Named peers:

```html
<input id="draft" class="peer/draft" type="radio" checked />
<div class="hidden peer-checked/draft:block">Drafts visible</div>
```

## ARIA variants

| Variant | Selector |
|---|---|
| `aria-busy:` | `[aria-busy="true"]` |
| `aria-checked:` | `[aria-checked="true"]` |
| `aria-disabled:` | `[aria-disabled="true"]` |
| `aria-expanded:` | `[aria-expanded="true"]` |
| `aria-selected:` | `[aria-selected="true"]` |
| `aria-[sort=ascending]:` | Arbitrary ARIA |

## Data attribute variants

```html
<!-- Existence -->
<div data-active class="data-active:border-purple-500">…</div>

<!-- Value -->
<div data-size="large" class="data-[size=large]:p-8">…</div>

<!-- Custom shortcut -->
<style>@custom-variant data-checked (&[data-ui~="checked"]);</style>
```

## Media-feature variants

| Variant | Media query |
|---|---|
| `dark:` | `prefers-color-scheme: dark` (or class via `@custom-variant`) |
| `motion-safe:` / `motion-reduce:` | `prefers-reduced-motion` |
| `contrast-more:` / `contrast-less:` | `prefers-contrast` |
| `forced-colors:` | High-contrast OS mode |
| `pointer-fine:` / `pointer-coarse:` | Pointing device |
| `portrait:` / `landscape:` | Orientation |
| `print:` | Print media |
| `supports-[display:grid]:` | `@supports (...)` |

## Responsive (mobile-first)

| Variant | Min width |
|---|---|
| (none) | 0 — all sizes |
| `sm:` | 40rem (640px) |
| `md:` | 48rem (768px) |
| `lg:` | 64rem (1024px) |
| `xl:` | 80rem (1280px) |
| `2xl:` | 96rem (1536px) |
| `max-sm:` | < 40rem |
| `min-[500px]:` | Arbitrary |
| `md:max-xl:` | Range |

## Container queries

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">…</div>
</div>
```

## Variant stacking

```html
<button class="dark:md:hover:focus-visible:bg-fuchsia-600">…</button>
```

## Direct-children / descendants

```html
<ul class="*:rounded-full *:px-2"><li>A</li></ul>
<ul class="**:data-avatar:rounded-full"><img data-avatar /></ul>
```

## Gold-standard interactive combo

```html
<button class="
  bg-falcon-X 
  hover:bg-falcon-X-hover 
  focus-visible:[box-shadow:var(--shadow-falcon-focus)] 
  focus-visible:outline-none
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
  dark:bg-falcon-X-dark dark:hover:bg-falcon-X-hover-dark
">…</button>
```

## Falcon gap

| Pattern | Status |
|---|---|
| `hover:` | ✅ Used widely |
| `focus-visible:` | ❌ **Missing** in sidebar, tree-panel, most interactive surfaces |
| `dark:` | ⚠️ Inconsistent — falcon-view-toggle uses it; sidebar does not |
| `active:` | ❌ Rarely used |
| `disabled:` | ✅ Used in form controls |
| `group/X` named | ✅ Good — tree-panel uses |
| `aria-X:` | ❌ Uses `[attr.aria-X]` Angular bindings instead |
| Custom variants | Only `dark` — could add `tenant`, `mood` |

## See also

- [[Tailwind CSS]] · [[Tailwind Dark Mode]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs: [STYLING_RULES_CHEAT_SHEET](../../Brain%20Outputs/understanding/frontend/theme/STYLING_RULES_CHEAT_SHEET.md)

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
