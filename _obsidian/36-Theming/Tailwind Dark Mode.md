---
type: reference
library: "[[Tailwind CSS]]"
topic: dark-mode
docs-source: https://tailwindcss.com/docs/dark-mode
created: 2026-05-20
---
*** Tailwind v4 Dark Mode — @custom-variant dark recipe ***
*** Falcon's dark mode is textbook + FOUC mitigation — 97% aligned ***
*** Upstream SoT: tailwindcss.com/docs/dark-mode · Falcon SoT: DARK_MODE_AUDIT.md ***

# Tailwind Dark Mode

> v4 dark mode is opt-in via `@custom-variant dark (...)`. Three official strategies: media-query (default), `.dark` class, or `[data-theme=dark]` attribute. Falcon uses the class strategy with triple-selector and FOUC mitigation — strongest topic in the alignment scorecard.

## Default — no setup

`dark:` variant uses `prefers-color-scheme: dark` automatically:

```html
<div class="bg-white dark:bg-black">…</div>
```

## Class strategy (manual toggle)

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

```html
<html class="dark">
  <body><div class="bg-white dark:bg-black">…</div></body>
</html>
```

## Data-attribute strategy

```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

```html
<html data-theme="dark">…</html>
```

## Three-state pattern (light / dark / system)

Official JS recipe:

```javascript
// On page load — inline in <head> to avoid FOUC
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);

// User chooses light
localStorage.theme = "light";
// User chooses dark
localStorage.theme = "dark";
// User chooses "follow OS"
localStorage.removeItem("theme");
```

## Theming tokens for dark mode

Re-declare vars under the dark selector:

```css
@theme {
  --color-bg: white;
  --color-text: black;
}

:where(.dark, .dark *) {
  --color-bg: black;
  --color-text: white;
}
```

OR use `@variant dark`:

```css
:root {
  /* light defaults */
}

@variant dark {
  :root {
    --color-bg: black;
  }
}
```

## Falcon implementation

[CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:13`:

```css
@custom-variant dark (&:where(.app-dark, .app-dark *));
```

Uses `.app-dark` (custom class) instead of `.dark` to avoid collision with consumer apps.

[CODE] `falcon-tailwind-tokens.css:505-592` re-declares neutral ramp + selected aliases under the dark cascade:

```css
:where(.app-dark, .app-dark *),
:where(.dark, .dark *) {
  --color-falcon-neutral-0:   #1a1a2e;
  --color-falcon-neutral-30:  #1e2741;
  --color-falcon-neutral-900: #ffffff;
  /* … 25 more remapped values … */
}
```

**Triple-selector** for `.app-dark`, `.dark`, `[data-theme=dark]` — works in any consumer ecosystem.

### ThemeService

[CODE] `apps/host-shell/falcon-facades/theme.facade.ts`:

- APP_INITIALIZER wired so theme applies BEFORE component tree renders
- Signal-based API: `currentTheme()`, `preference()`, `setTheme()`, `toggle()`
- localStorage key `falcon-theme`
- System detection + `change` event listener
- SSR-safe via `isPlatformBrowser()` guards
- Sets BOTH `<html class="app-dark">` AND `<html data-theme="dark|light">`

### FOUC mitigation (3 layers)

1. Inline `<script>` in `<head>` of each `index.html`
2. `provideAppInitializer(() => inject(ThemeService))` during bootstrap
3. Legacy `HostThemeFacade` writes same attributes (defensive)

**Score: 97% — Falcon is ahead of the docs.**

## See also

- [[Tailwind CSS]] · [[Tailwind Theme Variables]] · [[Tailwind States and Variants]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs: [DARK_MODE_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/DARK_MODE_AUDIT.md)

## Tags

#type/reference #layer/frontend #layer/design

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
