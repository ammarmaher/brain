---
type: reference
library: "[[Tailwind CSS]]"
topic: cheatsheet
created: 2026-05-20
---
*** Tailwind v4 Utility Cheatsheet — quick reference for Falcon ***
*** One-page lookup; full topic notes have depth ***
*** Upstream SoT: tailwindcss.com/docs ***

# Tailwind Utility Cheatsheet

> Quick one-page lookup. Each section links to the deep-dive note for full coverage.

## Display

`block` · `inline-block` · `inline` · `hidden` · `flex` · `inline-flex` · `grid` · `inline-grid` · `contents` · `table` · `flow-root`

See [[Tailwind Layout Flex Grid]].

## Position

`static` · `relative` · `absolute` · `fixed` · `sticky` · `inset-0` · `top-*` · `right-*` · `bottom-*` · `left-*` · `z-0` … `z-50`

See [[Tailwind Layout Flex Grid]].

## Sizing

`w-full` · `w-fit` · `w-screen` · `w-dvw` · `w-1/2` · `w-<number>` · `w-3xs` … `w-7xl` · `h-full` · `h-screen` · `h-dvh` · `size-*` · `min-w-0` · `min-h-0` · `max-w-full` · `max-h-full` · `aspect-square` · `aspect-video` · `aspect-3/2`

See [[Tailwind Sizing and Responsive]].

## Spacing

`p-*` / `px-*` / `py-*` / `pt-*` / `pr-*` / `pb-*` / `pl-*` · `m-*` / `mx-*` / `my-*` / `mt-*` / `-mt-*` (negative) · `gap-*` · `gap-x-*` / `gap-y-*` · `space-x-*` / `space-y-*` (legacy)

See [[Tailwind Spacing Radius Shadow Borders]].

## Typography

`text-xs` … `text-9xl` · `text-falcon-X` (color) · `font-thin` … `font-black` · `font-sans` · `font-display` · `font-mono` · `leading-*` · `tracking-*` · `align-*` · `text-left/center/right/justify` · `truncate` · `line-clamp-*` · `whitespace-nowrap` · `break-words` / `break-all`

## Colors

`bg-falcon-X` · `text-falcon-X` · `border-falcon-X` · `ring-falcon-X` · `fill-falcon-X` · `stroke-falcon-X` · `accent-falcon-X` · `caret-falcon-X` · `divide-falcon-X` · `shadow-falcon-X` · alpha modifier `bg-falcon-X/50`

See [[Tailwind Colors and Palette]].

## Borders + radius

`border` · `border-2` · `border-t/r/b/l` · `border-x/y` · `border-solid/dashed/dotted` · `border-falcon-X` · `rounded-none` · `rounded-sm/md/lg/xl/2xl/full` · `rounded-falcon-sm/md/lg/pill`

See [[Tailwind Spacing Radius Shadow Borders]].

## Shadow + opacity + blur

`shadow-xs` … `shadow-2xl` · `shadow-falcon-card/popover/modal` · `opacity-0` … `opacity-100` · `opacity-50` · `blur-sm/md/lg/xl` · `backdrop-blur-*`

## States

`hover:*` · `focus:*` · `focus-visible:*` · `focus-within:*` · `active:*` · `disabled:*` · `enabled:*` · `checked:*` · `indeterminate:*` · `read-only:*` · `placeholder-shown:*` · `valid:*` · `invalid:*` · `user-valid:*` · `user-invalid:*` · `aria-*:*` · `data-*:*` · `has-*:*` · `not-*:*` · `group-*:*` · `peer-*:*` · `dark:*` · `motion-safe:*` · `motion-reduce:*` · `print:*`

See [[Tailwind States and Variants]].

## Responsive + container

`sm:` `md:` `lg:` `xl:` `2xl:` · `max-sm:` `max-md:` … · `min-[500px]:` · `@container` · `@sm:` `@md:` … `@7xl:` · `@container/name`

See [[Tailwind Sizing and Responsive]].

## Effects

`shadow-*` · `opacity-*` · `blur-*` · `backdrop-blur-*` · `mix-blend-*` · `bg-blend-*` · `filter` · `grayscale` · `contrast-*` · `brightness-*` · `hue-rotate-*` · `invert` · `saturate-*` · `sepia`

## Transitions + animations

`transition` · `transition-colors` · `transition-transform` · `transition-opacity` · `transition-all` · `transition-none` · `duration-150` · `duration-300` · `duration-500` · `ease-linear` · `ease-in` · `ease-out` · `ease-in-out` · `ease-fluid` · `delay-*` · `animate-spin` · `animate-pulse` · `animate-bounce` · `animate-ping`

## Cursor / pointer-events

`cursor-pointer` · `cursor-default` · `cursor-not-allowed` · `cursor-grab` · `cursor-text` · `pointer-events-none` · `pointer-events-auto` · `select-none` · `select-text`

## Misc

`overflow-hidden/auto/scroll/clip` · `overflow-x-*` / `overflow-y-*` · `truncate` · `appearance-none` · `outline-none` · `outline-falcon-X` · `resize-none/x/y` · `will-change-*` · `isolation-isolate`

## See also (deep-dive notes)

- [[Tailwind Mental Model]] · [[Tailwind Theme Variables]] · [[Tailwind Colors and Palette]] · [[Tailwind Dark Mode]] · [[Tailwind States and Variants]] · [[Tailwind Sizing and Responsive]] · [[Tailwind Layout Flex Grid]] · [[Tailwind Spacing Radius Shadow Borders]] · [[Tailwind Custom Styles and Layers]] · [[Tailwind Directives and Functions]]

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
