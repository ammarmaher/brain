---
type: reference
library: "[[Tailwind CSS]]"
topic: installation
docs-source: https://tailwindcss.com/docs/installation
created: 2026-05-20
---
*** Tailwind v4 Installation — Vite + Angular setup recipes ***
*** Falcon uses both: Vite for libs/playgrounds, PostCSS for Angular apps ***
*** Upstream SoT: tailwindcss.com docs · Falcon SoT: libs/falcon-theme/src/falcon-tailwind-tokens.css ***

# Tailwind Installation and Setup

> v4 ships as a single `@import "tailwindcss"` in CSS. Vite + Angular use different plugin packages, but both eliminate v3's JS config. Falcon uses both paths.

## Vite path (Tailwind's canonical setup)

```bash
npm install tailwindcss @tailwindcss/vite
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

```css
/* src/style.css */
@import "tailwindcss";
```

## Angular path (PostCSS plugin)

```bash
npm install tailwindcss @tailwindcss/postcss postcss --force
```

```json
// .postcssrc.json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

```css
/* src/styles.css */
@import "tailwindcss";
```

## v3 → v4 deltas

| v3 | v4 |
|---|---|
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` |
| `tailwind.config.js` `theme.extend.colors` | `@theme { --color-* : … }` |
| `darkMode: 'class'` | `@custom-variant dark (&:where(.dark, .dark *));` |
| `content: [...]` | `@source "./src"` + auto-detect |
| `safelist: [...]` | `@source inline("…")` |

## Falcon's actual setup

[CODE] `apps/host-shell/src/tailwind.css`:

```css
@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css";
@import "../../../libs/falcon-ui-tokens/src/index.css";
@source "./";
@source "../../../libs/falcon/src/shared-ui";
@source "../../../libs/falcon-ui-core/src/tailwind";
@source not "../../../node_modules";
@source not "../../../**/*.spec.ts";
```

[CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css`:

```css
@import "tailwindcss";
@config "../../../tailwind.config.js";   /* legacy bridge — config is empty */
@layer theme, base, falcon-base, utilities;
@custom-variant dark (&:where(.app-dark, .app-dark *));
```

**Smell:** `@config` points at `module.exports = {}` — keep as harmless compat. Can be removed.

## See also

- [[Tailwind CSS]] · [[Tailwind Theme Variables]] · [[Tailwind Source Detection]]
- Brain Outputs: [APP_TAILWIND_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/APP_TAILWIND_AUDIT.md)

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
