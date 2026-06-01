---
name: falcon-tree-panel SCSS → Tailwind conversion
description: 🟢 LANDED 2026-05-18. Both falcon-tree-panel + falcon-tree-node SCSS files deleted; panel chrome, recursive rails (through-line + L-elbow), chevron rotate, sticky row-action reveal, hover-path tint, scrollbar (Firefox + WebKit), and menu popup token overrides all ported to Tailwind utilities. host-shell GREEN `dc3199c82abfa0df`/12.34s.
type: project
originSessionId: 30ffac98-f0dc-4c76-98b5-c3e8b55d8d5e
---
🟢 LANDED 2026-05-18 — `falcon-tree-panel` + nested `falcon-tree-node` fully migrated off SCSS to Tailwind utilities. host-shell GREEN `dc3199c82abfa0df`/12.34s (admin-console errors are pre-existing, unrelated to this component — applications-table + falcon-org-info-panel).

**Deleted (-2 files, ~330 lines of CSS gone):**
- `libs/falcon/.../falcon-tree-panel/falcon-tree-panel.component.scss` (105 lines)
- `libs/falcon/.../falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.scss` (231 lines)

**Edited (+0 files / 4 modified):**
- `falcon-tree-panel.component.ts` — `styleUrls` removed, scrollbar utilities (~17 classes) moved into `host: { class: ... }` as Tailwind v4 arbitrary-variant + arbitrary-property utilities, highlighted-menu-item styleClass extracted to `static readonly HIGHLIGHTED_STYLE_CLASS`.
- `falcon-tree-panel.component.html` — root row body unchanged (was already Tailwind), `<falcon-angular-menu>` rootClass changed from `.falcon-tree-panel-menu` legacy hook to 14 Tailwind arbitrary-property utilities setting `--falcon-menu-panel-*` and `--falcon-menu-item-*` CSS vars + `[&_[data-component='falcon-menu-panel']]:z-[9999]` arbitrary-variant for the z-index (Wave 22 popup-above-topbar/sidebar fix).
- `falcon-tree-node.component.ts` — `styleUrls` removed, host class expanded to `'falcon-tree-node block'`.
- `falcon-tree-node.component.html` — row chrome + rails + chevron + logos + name + row-action ALL inlined as Tailwind utilities.

**Conversion doctrine — how every SCSS pattern mapped:**

1. **Token spacing** (`var(--spacing-row-h)`, `--spacing-rail`, etc.) → Tailwind v4 auto-generates `min-h-row-h`, `w-rail`, `gap-row-gap`, `py-row-pad-y`, `px-row-pad-x` directly from `--spacing-*` namespace tokens in `falcon-tailwind-tokens.css`.
2. **Token colors** (`var(--color-falcon-teal-100)`, etc.) → `bg-falcon-teal-100`, `text-falcon-teal-700`, `border-falcon-mint-200` standard Tailwind utility names.
3. **Token durations** (`var(--duration-falcon-base)`) → `duration-falcon-base`, `duration-falcon-fast`.
4. **Token shadows** (`--shadow-falcon-sticky-edge`) → `shadow-falcon-sticky-edge`.
5. **Token background-image** (`var(--background-image-falcon-rail-default)`) → `bg-falcon-rail-default`, `bg-falcon-rail-on-path` (Tailwind v4 auto-generates from `--background-image-*` namespace).
6. **Pseudo-elements** (`::before`, `::after` on `.tree-rail.elbow`) → Tailwind `before:`/`after:` variants with `before:content-['']`, `before:absolute`, `before:left-[calc(50%-0.5px)]`, etc. Conditional color (on-path teal-700 vs default teal-alpha-18) driven by `[class.before:bg-falcon-teal-700]="isOnHoverPath()"` class bindings.
7. **RTL logical** (`:host-context([dir='rtl']) .tree-rail.elbow::after { left: auto; right: 50% }`) → ELIMINATED. Replaced with Tailwind logical `start-1/2 end-0` utilities which auto-flip without an explicit RTL rule. Chevron RTL rotate uses `[class.rtl:rotate-180]="!isExpanded()"` modifier-binding.
8. **Parent-state child styling** (`.client-row:hover .row-action { opacity: 1 }`) → Tailwind `group/row` named-group on `.client-row` + `group-hover/row:opacity-100` on `.row-action`. Selected state uses direct class binding `[class.opacity-100]="isMenuOpen() || isSelected()"` since it's bound on the same component.
9. **Legacy semantic vars used with fallback** (`var(--text-muted, #6b7280)`, `var(--text, #1a1a1a)`) → KEPT as arbitrary values `text-[var(--text-muted,#6b7280)]` / `text-[var(--text,#1a1a1a)]` to preserve exact dark-mode behavior (matches the falcon-photo-uploader + falcon-form-field precedent — these legacy vars aren't actually defined but the fallback IS load-bearing).
10. **Stencil popup token overrides** (`.falcon-tree-panel-menu { --falcon-menu-panel-min-width: 150px; ... }`) → MOVED to Tailwind arbitrary-property utilities on the menu's `rootClass` string. Since `<falcon-angular-menu rootClass="...">` applies the class to the popup panel (Light DOM with `useTailwind=true`), each utility's CSS variable declaration cascades into the popup's internal `bg-[var(--falcon-menu-*)]` utilities. Reference precedent: management-console/comms-hub uses `rootClass="border-falcon-error-200 bg-falcon-error-50"` for `<falcon-angular-card>`.
11. **Highlighted-item styleClass** (`'fph-menu-item-highlighted'`) → Tailwind arbitrary-property utilities overriding `--falcon-menu-item-bg`/`--falcon-menu-item-color`/`--falcon-menu-item-bg-hover`/`--falcon-menu-item-color-hover`/`--falcon-menu-item-icon-color` AT THE ITEM LEVEL. CSS custom property cascade (closer-to-element wins) means the highlighted item's vars beat the panel-level rootClass vars without any specificity tricks. The menu's existing `bg-[var(--falcon-menu-item-bg)]` utilities pick up the closer values automatically.
12. **Webkit scrollbar pseudo-elements** (`.falcon-tree-panel ::-webkit-scrollbar { width: 6px }`) → Tailwind v4 arbitrary-variant `[&_::-webkit-scrollbar]:w-1.5` + similar for `-track`, `-thumb`, `-button`. The `_` between `&` and `::` denotes descendant combinator. Hover-revealed thumb via chained `hover:[&_::-webkit-scrollbar-thumb]:bg-[rgba(13,63,68,0.35)]`. Increment buttons killed with `[&::-webkit-scrollbar-button]:!hidden` (`!` for !important to beat user-agent CSS).
13. **Firefox scrollbar** (`scrollbar-width: thin; scrollbar-color: transparent transparent`) → Tailwind arbitrary properties `[scrollbar-width:thin]` and `[scrollbar-color:transparent_transparent]` on the host (the underscore is Tailwind v4's space-substitute inside arbitrary values).

**Critical preservation — class hooks kept:**
The semantic class names `.client-row`, `.client-name`, `.client-logo`, `.client-children`, `.chevron`, `.chevron-spacer`, `.row-action`, `.tree-rail`, `.is-selected`, `.on-path`, `.child-node-row`, `.through`, `.elbow`, `.rail-last`, `.is-expanded`, `.menu-open`, `.falcon-tree`, `.falcon-tree-panel` are RETAINED on elements (alongside Tailwind utilities). Reasons:
- `.falcon-tree`, `.client-row`, `.row-action`, `.chevron`, `.chevron-spacer` are queried by the parent panel's `scrollIfChevronOverlapsAction` + `scrollIfChevronOverlapsRowAction` overlap-detection logic.
- `.falcon-tree-panel` is the host class anchor for all scrollbar arbitrary-variants.
- `.is-selected`/`.on-path`/`.child-node-row` are kept as external-consumer SCSS hooks (per the inline comment "kept as a hook for any consumer SCSS").

**Component-creation doctrine confirmed (Wave NEW for shared-ui legacy):**
- Tailwind utilities + class hooks coexist. The hooks are semantic markers for querySelector-driven logic + external CSS opt-in; the utilities own all visual styling. Never delete a hook unless you've grep-confirmed zero querySelector consumers.
- `<falcon-angular-menu rootClass>` is the canonical attach point for popup-rendered DOM styling. Pass Tailwind utilities (space-separated) into rootClass, NOT a single semantic class name + a separate CSS rule. The popup is Light DOM with `useTailwind=true`, so utilities flow through.
- For Stencil components that read CSS variables internally (menu items reading `--falcon-menu-item-bg`), the cleanest override is to set those vars via Tailwind arbitrary-property utilities at the level you want the override to apply (host = global, styleClass = per-item). Cascade-closest-wins handles the priority.
- Tailwind v4 arbitrary-variant `[&_::pseudo]` syntax is the right tool for scrollbar pseudo-element styling. Use `[&::pseudo]` for the element itself, `[&_::pseudo]` for ALL descendants, `[&_*::pseudo]` for all descendants (universal). Host-class is the natural anchor since it covers every scrollable inside.

**Tokens consumed (all pre-existing in `falcon-tailwind-tokens.css`):**
- Colors: `falcon-teal-50/100/700`, `falcon-teal-alpha-18`, `falcon-neutral-0/50/150/200/600/900`, `falcon-mint-100/200`.
- Spacing: `spacing-rail` (18px), `spacing-row-h` (36px), `spacing-row-gap` (6px), `spacing-row-pad-y` (6px), `spacing-row-pad-x` (10px), `spacing-px` (1px), `spacing-1/3` (4/12px).
- Durations: `duration-falcon-fast` (0.12s), `duration-falcon-base` (0.15s).
- Radii: `radius-xs` (4px), `radius-sm` (8px), `radius-2xs` (3px via arbitrary `rounded-[3px]`).
- Shadows: `shadow-falcon-sticky-edge`, `shadow-falcon-menu`.
- Background-image: `background-image-falcon-rail-default`, `background-image-falcon-rail-on-path`.
- Letter-spacing: `tracking-label` (0.01em — already used).

**Trap caught + documented:**
- Tailwind's source-scanner reads `host: { class: '...' }` string literals from .ts files — use a single literal string (not `[...].join(' ')`) for reliable scanning. The array-join pattern compiles, but Tailwind may miss class names embedded in expression-evaluated strings.
- `[class.before:bg-falcon-teal-700]="condition"` Angular binding writes `before:bg-falcon-teal-700` literally into the class attribute. Tailwind sees this literal in source and generates the utility correctly. Works for any pseudo-element + state combination.
- Tailwind v4 arbitrary value spaces: use `_` (underscore) as the space substitute inside `[...]`. E.g. `[scrollbar-color:transparent_transparent]`, `hover:[&_::-webkit-scrollbar-thumb]:bg-[rgba(13,63,68,0.35)]`.

**Trigger phrases:** `falcon-tree-panel tailwind conversion` / `tree-panel SCSS removal` / `tree-rail tailwind` / `webkit scrollbar tailwind arbitrary variant`.
