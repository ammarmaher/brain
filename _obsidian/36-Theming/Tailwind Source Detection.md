---
type: reference
library: "[[Tailwind CSS]]"
topic: source-detection
docs-source: https://tailwindcss.com/docs/detecting-classes-in-source-files
created: 2026-05-20
---
*** Tailwind v4 Source Detection — static-string rule + @source mechanics ***
*** Falcon has ~100 inline safelists — smell of runtime class construction ***
*** Upstream SoT: tailwindcss.com/docs/detecting-classes-in-source-files ***

# Tailwind Source Detection

> Tailwind scans your source files as plain text and only generates utilities for class names that appear LITERALLY as complete strings. It cannot understand string concatenation or template interpolation. `@source inline()` is the safelist escape hatch.

## The fundamental rule

> "Since Tailwind scans your source files as plain text, it has no way of understanding string concatenation or interpolation in the programming language you're using."

**Class names must exist as complete static strings.**

## ❌ Won't work

```jsx
function Button({ color }) {
  return <button className={`bg-${color}-600`}>…</button>;
}
```

```html
<div class="text-{{ error ? 'red' : 'green' }}-600"></div>
```

## ✅ Works

```jsx
const colorVariants = {
  blue: "bg-blue-600 hover:bg-blue-500",
  red:  "bg-red-500 hover:bg-red-400",
};
return <button className={colorVariants[color]}>…</button>;
```

```html
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```

## `@source` directive

```css
@import "tailwindcss" source("../src");           /* set base path */
@source "../node_modules/@acme/ui-lib";           /* add external lib */
@source not "../src/legacy";                       /* exclude */
@import "tailwindcss" source(none);               /* disable auto-detect */
@source "../admin";
@source "../shared";
```

## `@source inline()` — safelist

```css
@source inline("underline");                      /* single class */
@source inline("{hover:,focus:,}underline");      /* with variants */
@source inline("bg-red-{50,{100..900..100},950}"); /* with ranges */
@source not inline("bg-red-500");                  /* force-NOT generate */
```

## Angular `[class.X]` binding

Both class names appear as plain text in the source — Tailwind detects:

```html
<div [class.bg-red-500]="hasError" [class.bg-green-500]="!hasError">…</div>
```

Pitfall — dynamic suffix:

```typescript
// ❌ Tailwind sees `bg-` but not the resolved color
[class.bg-${color}-500]="hasError"

// ✅ Use object form with static keys
{ 'bg-red-500': hasError, 'bg-green-500': !hasError }
```

## TypeScript class-builders

Falcon's `sidebar.component.ts:171`:

```typescript
protected navItemClass(active: boolean): string {
  const state = active
    ? 'active bg-falcon-teal-900 text-white'        // ← literals detected
    : 'bg-transparent text-white/[0.82] hover:bg-white/[0.06]';
  return `${base} ${state}`;
}
```

Tailwind scans `.ts` files as plain text and finds `bg-falcon-teal-900` as a static substring. **Works.**

## Falcon's setup

[CODE] `apps/host-shell/src/tailwind.css:9-33`:

```css
@source "./";
@source "../../../libs/falcon/src/shared-ui";
@source "../../../libs/falcon-ui-core/src/tailwind";
@source not "../../../node_modules";
@source not "../../../**/*.spec.ts";
@source not "../../../**/*.md";
```

## Falcon's safelist smell

Lines [34-120+] hold ~100 `@source inline("…")` entries — many built around CSS variables:

```css
@source inline("bg-[length:var(--falcon-size-icon-sm,0.875rem)]");
@source inline("text-[color:var(--falcon-input-label-color)]");
```

**Cost:** 100+ entries to maintain; each new component contract adds 4-8 safelist lines.

**Fix:** convert var-based arbitrary safelists to `@utility` declarations. See [[Tailwind Custom Styles and Layers]].

## See also

- [[Tailwind CSS]] · [[Tailwind Custom Styles and Layers]] · [[Tailwind Directives and Functions]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs: [UTILITY_SAFELIST_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/UTILITY_SAFELIST_AUDIT.md)

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
