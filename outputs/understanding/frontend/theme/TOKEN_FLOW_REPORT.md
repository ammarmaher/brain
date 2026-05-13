*** Token flow — from SSOT primitives to rendered pixels ***
*** Verified against active source at 2026-05-13 ***

# Token flow report

A single `--falcon-input-bg` mutation has to update Shadow DOM `<falcon-input>`, Light DOM `<falcon-input-tw>`, Angular wrapper `<falcon-angular-input>`, and any plain HTML class consumer using `.falcon-input`. This document maps the full propagation chain so a build agent can predict where a token change lands.

---

## Layer diagram (top-to-bottom is load order)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 1. SSOT @theme block                                                          │
│    libs/falcon-theme/src/falcon-tailwind-tokens.css (lines 15-360)             │
│    14 token families:                                                          │
│      • color-falcon-{teal,neutral,green,red,amber,blue,...}                    │
│      • text-{4xs..display}                                                     │
│      • spacing-{0..24,sidebar,topbar,row-*}                                    │
│      • radius-{none..3xl,form,row,pill,full}                                   │
│      • shadow-falcon-{xs..xl,popover,menu,drawer,focus,...}                    │
│      • falcon-size-{control,icon,tile,stepper-circle}                          │
│      • falcon-border-width-{1,1-5,2,4}                                         │
│      • breakpoint-{sm..2xl}                                                    │
│      • ease/duration/animate                                                   │
│      • z-falcon-{dropdown..tooltip}                                            │
│      • background-image-falcon-rail-*                                          │
│      • tracking-* / leading-*                                                  │
│                                                                              │
│    Plus: @custom-variant dark, @layer order, @config bridge (empty),           │
│          @import "tailwindcss", and dark override block (lines 385-451)        │
└──────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ 2. UI-tokens barrel chain                                                    │
│    libs/falcon-ui-tokens/src/index.css                                       │
│    Layer order: primitives → semantic → themes → density → rtl → components   │
│                                                                              │
│    a) primitives/colors.css       — --falcon-color-* aliased to SSOT          │
│    b) primitives/spacing.css      — --falcon-spacing-* aliased to SSOT        │
│    c) primitives/radius.css       — --falcon-radius-* aliased to SSOT         │
│    d) primitives/shadow.css       — --falcon-shadow-* aliased to SSOT         │
│    e) primitives/typography.css   — --falcon-font-* aliased to SSOT + numeric │
│    f) primitives/motion.css       — --falcon-motion-* (motion easing/dur)     │
│                                                                              │
│    g) semantic/semantic.css       — --falcon-color-{primary,danger,success,   │
│                                       warning,surface,text,border,focus-ring} │
│                                       intent overlay on the palette           │
│                                                                              │
│    h) themes/light.css            — [data-theme='light'] explicit opt-in      │
│    i) themes/dark.css             — [data-theme='dark'], .app-dark, .dark     │
│                                     Plus per-component RGBA bypass overrides  │
│                                                                              │
│    j) density/comfortable.css     — :root, [data-density='comfortable']       │
│    k) density/compact.css         — [data-density='compact']                  │
│                                     declare --falcon-density-{component}-*    │
│                                     and resolve --falcon-{component}-height-* │
│                                                                              │
│    l) rtl/rtl.css                 — [dir='rtl'] flips shadow-drawer,         │
│                                       shadow-sticky-edge, slide distances,   │
│                                       dialog side-right enter translate      │
│                                                                              │
│    m) components/*.tokens.css × 45 — --falcon-<component>-* tokens            │
│                                       (input, button, dropdown, etc.)         │
└──────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ 3. App-level Tailwind entry                                                  │
│    apps/<app>/src/tailwind.css                                               │
│    @import SSOT + UI-tokens barrel                                            │
│    @source paths declare what the Oxide scanner crawls                        │
│    @source not declares exclusions                                            │
│    @source inline(...) safelists runtime-built classes                        │
└──────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ 4. Two render paths in parallel                                              │
│                                                                              │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐ │
│  │ A) Shadow DOM Stencil <falcon-X>    │  │ B) Light DOM <falcon-X-tw>      │ │
│  │                                     │  │                                 │ │
│  │ Stencil shadow CSS (compiled into   │  │ Stencil component renders plain │ │
│  │ <style> inside the shadow root):    │  │ HTML with Tailwind utility      │ │
│  │   .falcon-input-control-wrapper {   │  │ classes inline:                 │ │
│  │     background: var(--falcon-       │  │   class={                       │ │
│  │              input-bg);             │  │     falconInputWrapperClasses() │ │
│  │     border-color: var(--falcon-    │  │   }                              │ │
│  │              input-border-color);   │  │                                 │ │
│  │   }                                  │  │ Class string is generated by    │ │
│  │                                     │  │ libs/falcon-ui-core/src/        │ │
│  │ Token resolution: cascade reaches   │  │   tailwind/*-tailwind-classes.ts │ │
│  │ INTO the shadow root because        │  │                                 │ │
│  │ custom properties pierce shadow     │  │ Utilities reference the SAME    │ │
│  │ boundaries.                          │  │ --falcon-input-* tokens via     │ │
│  │                                     │  │ arbitrary-value syntax:         │ │
│  │ Result: same token mutation         │  │   bg-[var(--falcon-input-bg)]   │ │
│  │ updates Shadow render.              │  │   border-[length:var(...)]      │ │
│  │                                     │  │                                 │ │
│  │                                     │  │ Result: same token mutation     │ │
│  │                                     │  │ updates Light render.           │ │
│  └─────────────────────────────────────┘  └─────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ 5. Angular wrapper layer                                                     │
│    libs/falcon-ui-core/src/angular-wrapper/components/falcon-X/              │
│    falcon-X.component.ts                                                     │
│                                                                              │
│    @Input() useTailwind = true; // default Light DOM render                   │
│                                                                              │
│    Template uses Angular @if/@for:                                           │
│    @if (useTailwind) {                                                       │
│      <falcon-input-tw [class]="wrapperClass">...</falcon-input-tw>           │
│    } @else {                                                                  │
│      <falcon-input [class]="wrapperClass">...</falcon-input>                  │
│    }                                                                          │
│                                                                              │
│    Class strings come from the same `*-tailwind-classes.ts` helper.           │
│    Component implements ControlValueAccessor for Forms.                       │
│    Uses CUSTOM_ELEMENTS_SCHEMA to allow <falcon-input-tw> / <falcon-input>.   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Layer-by-layer cascade resolution

### Step 1 — SSOT primitives load first

When the app boots, Tailwind v4 processes the SSOT `@theme` block. This generates:
- Tailwind utilities (`bg-falcon-teal-500`, `text-falcon-neutral-900`, `p-4`, `rounded-md`, `shadow-falcon-md`, `gap-2`, `h-4`, etc.)
- Custom properties on `:root` for every token name (so they're addressable via `var(--color-falcon-teal-500)` from any selector).

### Step 2 — UI-tokens barrel resolves the cascade

Order of import inside `libs/falcon-ui-tokens/src/index.css` is the cascade order:

1. **Primitives** (`primitives/*.css`) — declare `--falcon-color-*`, `--falcon-spacing-*`, `--falcon-radius-*`, etc. ON `:root`. Each aliases the SSOT primitive: `--falcon-color-teal-500: var(--color-falcon-teal-500, #124c52)`. This provides a standalone-mode safety net via the hex fallback when SSOT isn't loaded.

2. **Semantic** (`semantic/semantic.css`) — adds intent tokens on `:root`: `--falcon-color-primary: var(--falcon-color-teal-600)`, `--falcon-color-danger: var(--falcon-color-red-600)`, etc.

3. **Themes** (`themes/light.css`, `themes/dark.css`) — declared in cascade order. Dark only fires when `<html class="app-dark">` or `<html class="dark">` or `[data-theme='dark']` is present. Light is implicit (the semantic block already encodes light values).

4. **Density** (`density/comfortable.css`, `density/compact.css`) — declared in cascade order. Comfortable fires on `:root` + `[data-density='comfortable']`. Compact fires on `[data-density='compact']`. Each declares `--falcon-density-X-*` density-specific tokens, AND resolves `--falcon-input-height-md: var(--falcon-density-input-height-md)`. So density CHANGES the value the per-component file reads.

5. **RTL** (`rtl/rtl.css`) — declared LAST. Fires on `[dir='rtl']`. Flips `--shadow-falcon-drawer`, `--shadow-falcon-sticky-edge`, `--falcon-toast-slide-distance`, `--falcon-dialog-side-right-enter-translate-x`.

6. **Components** (`components/*.tokens.css` × 45) — each file is a `:where(falcon-X, falcon-X-tw, falcon-angular-X, .falcon-X, [data-falcon-X])` block. Declares `--falcon-X-*` tokens. Resolves via cascade: every token reads from an SSOT primitive via `var(--ssot, hex-fallback)` — so the value comes from the SSOT (or its dark/density/RTL override), with a static hex backstop for standalone consumers.

### Step 3 — Per-instance override on consumer

A consumer page can add a host class on the wrapper element and redeclare any `--falcon-X-*` token for just that one element:

```html
<falcon-angular-input class="add-client-special-input"></falcon-angular-input>
```

```css
/* Recipe per UPGRADE_CANDIDATES UP-11 */
.add-client-special-input {
  --falcon-input-bg: #fafafa;
  --falcon-input-border-color: var(--color-falcon-teal-500);
}
```

The `:where(...)` selector in the component-token file has ZERO specificity, so the host class's redeclaration wins immediately.

### Step 4 — Both render paths consume the same tokens

**Shadow DOM** — The Stencil shadow CSS uses `var(--falcon-input-bg)`. CSS custom properties pierce the shadow boundary (this is the well-defined CSS behavior: custom properties are INHERITED, and `var()` is resolved against the consuming element's inheritance chain regardless of shadow root). So the cascade goes `:root → host element → :host (inside shadow)` and the consuming `var()` finds the value.

**Light DOM** — The Tailwind helper outputs arbitrary-value utilities like `bg-[var(--falcon-input-bg)]`. Tailwind compiles this to `.bg-\[var\(\-\-falcon-input-bg\)\] { background-color: var(--falcon-input-bg) }`. Same `var()` lookup against the same `:root` cascade.

**Result**: ONE token mutation, BOTH render paths track in lockstep. This is the parity hinge that `feedback_shadow_is_token_ssot.md` codifies.

---

## Token-flow summary table

| Layer | File | What it does | Reads | Writes (mutates) |
|---|---|---|---|---|
| **1. SSOT** | `falcon-tailwind-tokens.css` | Declares Tailwind theme tokens via `@theme` block | — | `:root` custom properties + Tailwind utilities |
| **1. SSOT dark** | `falcon-tailwind-tokens.css:385-451` | Inverts neutrals + shadows + alpha derivatives on `<html.app-dark>` | `:root` | `:where(.app-dark, .app-dark *)` |
| **2a. Primitives — colors** | `primitives/colors.css` | Aliases SSOT colors with hex fallbacks | `--color-falcon-*` (SSOT) | `--falcon-color-*` |
| **2a. Primitives — spacing** | `primitives/spacing.css` | Aliases SSOT spacing scale | `--spacing-*` (SSOT) | `--falcon-spacing-*` |
| **2a. Primitives — radius** | `primitives/radius.css` | Aliases SSOT radius scale | `--radius-*` (SSOT) | `--falcon-radius-*` |
| **2a. Primitives — shadow** | `primitives/shadow.css` | Aliases SSOT shadow scale | `--shadow-falcon-*` (SSOT) | `--falcon-shadow-*` |
| **2a. Primitives — typography** | `primitives/typography.css` | Aliases SSOT fonts; adds numeric font-size tokens | `--font-*` (SSOT) | `--falcon-font-*` + literal sizes |
| **2a. Primitives — motion** | `primitives/motion.css` | Declares motion-easing + reduced-motion overrides | — | `--falcon-motion-*` |
| **2b. Semantic** | `semantic/semantic.css` | Intent aliases on `:root` | `--falcon-color-*` (primitives) | `--falcon-color-primary/danger/success/warning/surface/text/border/focus-ring` |
| **2c. Light theme** | `themes/light.css` | Explicit `[data-theme='light']` block | semantic | overrides on `[data-theme='light']` (mostly empty since `semantic.css` is light already) |
| **2c. Dark theme** | `themes/dark.css` | Per-component RGBA bypass overrides on `.app-dark/.dark/[data-theme='dark']` | semantic | 178 lines of `--falcon-<component>-*` re-declarations |
| **2d. Density comfortable** | `density/comfortable.css` | Default density on `:root` | — | `--falcon-density-*` + resolved component sizing tokens |
| **2d. Density compact** | `density/compact.css` | Compact density on `[data-density='compact']` | — | density tokens (tighter) |
| **2e. RTL** | `rtl/rtl.css` | Flips directional tokens on `[dir='rtl']` | — | drawer shadow, sticky-edge shadow, slide distances, dialog side-right offset |
| **2f. Components × 45** | `components/<name>.tokens.css` | Per-component token contract | SSOT + primitives + semantic + density | `--falcon-<component>-*` per file |
| **3. App entry** | `apps/<app>/src/tailwind.css` | Imports SSOT + UI barrel; declares scanner paths + safelist | — | — (drives Tailwind compiler) |
| **4A. Shadow CSS** | `libs/falcon-ui-core/src/components/<name>/<name>.css` | Stencil shadow stylesheet | `--falcon-<name>-*` tokens | shadow DOM render |
| **4B. Helper TS** | `libs/falcon-ui-core/src/tailwind/<name>-tailwind-classes.ts` | Pure functions producing class strings | `--falcon-<name>-*` tokens via Tailwind arbitrary-value syntax | Light DOM render |
| **5. Angular wrapper** | `libs/falcon-ui-core/src/angular-wrapper/components/<name>/<name>.component.ts` | `useTailwind` switch; binds helpers to template | helper output | rendered Angular template |

---

## Worked example — input background changes from white to neutral-50

1. **Consumer**: `<falcon-angular-input class="my-grayed-input" />` with CSS `.my-grayed-input { --falcon-input-bg: #f5f7f8; }`.

2. **CSS cascade**: `--falcon-input-bg` is declared in `components/input.tokens.css` via `:where(...)` (zero specificity) AS `var(--color-falcon-neutral-0, #ffffff)`. The host class `.my-grayed-input` overrides it with literal `#f5f7f8`.

3. **Shadow render**: Stencil shadow CSS `falcon-input.css` reads `background: var(--falcon-input-bg)`. The `var()` resolves to `#f5f7f8` because the cascade now binds the property on `.my-grayed-input`. The shadow root inherits.

4. **Light render**: Tailwind helper returns class `bg-[var(--falcon-input-bg)]`. Compiled CSS: `.bg-\[var\(\-\-falcon-input-bg\)\] { background-color: var(--falcon-input-bg); }`. Same `var()` lookup → same `#f5f7f8`.

5. **Result**: Both renders use `#f5f7f8`. No JS, no render-path-specific override needed. Same one CSS variable did it.

---

## Variant cascades — a separate axis

Components like `<falcon-button>` have variant tokens (primary / secondary / ghost / danger / link). Variant tokens are NAMESPACED under the variant: `--falcon-button-primary-bg`, `--falcon-button-secondary-bg`, etc. The Stencil shadow CSS + Tailwind helper select which variant token to read based on the `variant` prop on the host element.

So variant is a render-time selection, not a cascade-time override. Variant tokens themselves can still be overridden per-instance:

```html
<falcon-angular-button variant="primary" class="my-special-primary">Save</falcon-angular-button>
```

```css
.my-special-primary { --falcon-button-primary-bg: #ff0000; } /* whatever */
```

---

## Where to look up which token

For any visual property, the chain is:
1. **What design property?** → SSOT family table (see `THEME_SSOT_AUDIT.md` family 1-14).
2. **Which Tailwind utility?** → check the family. Color → `bg-*`, `text-*`, `border-*`. Sizing → `h-*`, `w-*`. Spacing → `p-*`, `m-*`, `gap-*`. Radius → `rounded-*`. Shadow → `shadow-*`. Etc.
3. **Which component-token reads it?** → grep the component-token file for the SSOT var name. Each component has 1-4 inputs (per state, per variant).
4. **Which render-path needs the change?** → if a token, both paths track. If shadow CSS only, mutate `libs/falcon-ui-core/src/components/<name>/<name>.css`. If Light only, mutate `libs/falcon-ui-core/src/tailwind/<name>-tailwind-classes.ts`. These should rarely diverge — see `feedback_shadow_is_token_ssot.md`.

---

## Cross-references

- See `THEME_SSOT_AUDIT.md` for SSOT family enumeration.
- See `COMPONENT_TOKEN_FILES_AUDIT.md` for per-component file details.
- See `STYLING_RULES_CHEAT_SHEET.md` for the design-property × token + utility recipe table.
- See `DARK_MODE_AUDIT.md` for dark cascade invariants.
- See `DENSITY_AND_RTL_AUDIT.md` for density + RTL coverage.
