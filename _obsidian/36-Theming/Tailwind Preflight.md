---
type: reference
library: "[[Tailwind CSS]]"
topic: preflight
docs-source: https://tailwindcss.com/docs/preflight
created: 2026-05-20
---
*** Tailwind v4 Preflight — base reset (modern-normalize derived) ***
*** Auto-injected via @layer base — Falcon inherits the default chain ***
*** Upstream SoT: tailwindcss.com/docs/preflight ***

# Tailwind Preflight

> Preflight is Tailwind's base reset — smooths over cross-browser inconsistencies. Auto-injected via `@layer base` when you write `@import "tailwindcss"`.

## What gets reset

### All elements

```css
*, ::after, ::before, ::backdrop, ::file-selector-button {
  box-sizing: border-box;
  border: 0 solid;       /* zero-width default border */
  margin: 0;
  padding: 0;
}
```

### Headings (wiped)

```css
h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
}
```

You add styles back via utilities (`text-3xl font-bold`) or `@layer base`.

### Lists (no markers)

```css
ol, ul, menu {
  list-style: none;
}
```

### Images (block-level, constrained)

```css
img, svg, video, canvas, audio, iframe, embed, object {
  display: block;
  vertical-align: middle;
}

img, video {
  max-width: 100%;
  height: auto;
}
```

### Hidden attribute (force display:none)

```css
[hidden]:where(:not([hidden="until-found"])) {
  display: none !important;
}
```

## Disabling Preflight

Selective import (skip preflight.css):

```css
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
/* preflight.css NOT imported */
```

## Extending Preflight

```css
@layer base {
  h1 { font-size: var(--text-2xl); }
  a { color: var(--color-blue-600); text-decoration: underline; }
}
```

## Third-party library workaround

```css
@layer base {
  .google-map * {
    border-style: none;   /* re-enable browser defaults inside Google Maps */
  }
}
```

## Accessibility — unstyled lists

Unstyled `<ul>` is NOT announced by VoiceOver. If semantically a list:

```html
<ul role="list" class="space-y-2">…</ul>
```

## Falcon

Falcon doesn't disable Preflight. [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:11`:

```css
@layer theme, base, falcon-base, utilities;
```

Custom `falcon-base` layer sits between `base` and `utilities` for Falcon-specific resets (e.g., font-family defaults).

## See also

- [[Tailwind CSS]] · [[Tailwind Custom Styles and Layers]] · [[Tailwind Utility-First Philosophy]]

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
