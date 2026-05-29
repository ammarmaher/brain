---
type: reference
library: "[[Tailwind CSS]]"
topic: philosophy
docs-source: https://tailwindcss.com/docs/styling-with-utility-classes
created: 2026-05-20
---
*** Tailwind v4 Utility-First Philosophy — why utilities + managing duplication ***
*** Library-author rule: expose component props, not external classes ***
*** Upstream SoT: tailwindcss.com/docs/styling-with-utility-classes ***

# Tailwind Utility-First Philosophy

## Why utilities (4 rationales per docs)

1. **Get things done faster** — no naming, no selector decisions, no file-switching
2. **Changes feel safer** — adding/removing a class affects only that element
3. **Maintaining old projects is easier** — find the element, change classes; no orphan CSS
4. **Code is more portable** — structure and styling co-located

## Managing duplication

### Multi-cursor editing (one file)

> "You'd be surprised at how often this ends up being the best solution. If you can quickly edit all of the duplicated class lists simultaneously, there's no benefit to introducing any additional abstraction."

### Loops (iterating data)

```jsx
{#each contributors as user}
  <img class="inline-block h-12 w-12 rounded-full ring-2 ring-white" src={user.avatarUrl} />
{/each}
```

### Components / template partials (cross-file reuse)

```jsx
export function VacationCard({ img, title, pricing, url }) {
  return (
    <div>
      <img className="rounded-lg" src={img} />
      <a href={url} className="hover:underline">{title}</a>
      <div className="mt-2 text-sm text-gray-600">{pricing}</div>
    </div>
  );
}
```

## When to extract a component class

ONLY when:
- You CAN'T extract a template partial (e.g., styling Markdown HTML output)
- The pattern reaches across so many files that a partial would be too granular

Then use `@layer components`:

```css
@layer components {
  .btn-primary {
    border-radius: calc(infinity * 1px);
    background-color: var(--color-violet-500);
    padding-inline: --spacing(5);
    color: var(--color-white);
    box-shadow: var(--shadow-md);
    &:hover { @media (hover: hover) { background-color: var(--color-violet-700); } }
  }
}
```

Docs caveat:
> "For anything more complicated than a single HTML element, we highly recommend using template partials so the styles and structure can be encapsulated in one place."

## Library-author rule

Per docs §"Styling with utility classes":

> "Using component-based libraries like React or Vue, this often means **exposing specific props for styling customizations instead of letting consumers add extra classes from outside of a component**, since those styles will often conflict."

### Translation for Falcon UI Core

| Pattern | Verdict |
|---|---|
| `<falcon-button variant="primary" size="lg">` (props) | ✅ Recommended |
| `<falcon-button class="bg-red-500 px-8">` (external classes) | ❌ Anti-pattern |
| `<falcon-button [style.--falcon-button-bg]="'red'">` (CSS var) | ✅ Token contract |

**Falcon already does this right** — components expose `variant` / `size` / `severity` props + CSS-var slots via per-component `.tokens.css` contracts.

## See also

- [[Tailwind CSS]] · [[Tailwind Custom Styles and Layers]] · [[Tailwind Multi-Framework Strategy]] · [[Falcon Angular Wrapper Pattern]]

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
