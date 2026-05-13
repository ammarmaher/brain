*** Utility safelist audit ***
*** `@source inline(...)` directives in each app's tailwind.css ***
*** Verified against active source at 2026-05-13 ***

# Utility safelist audit

Tailwind v4's Oxide scanner walks the paths declared in `@source "..."` and finds utility class strings via static analysis. It MISSES:

1. Class strings built at runtime via JS concatenation (e.g., `'h-' + height` in a `*-tailwind-classes.ts` helper).
2. Class strings used in Angular `[class.X]=` bindings where the X expression is not a literal string.
3. Conditional classes built via Angular `[ngClass]="..."` where the keys are computed.

The `@source inline("...")` directive tells the scanner to ALWAYS register a class even if it isn't seen in templates. The safelist is the escape hatch.

This audit catalogs the safelist count, the categorical breakdown, and the drift between apps.

---

## Safelist counts

| APP | `@source inline()` COUNT | LINES IN tailwind.css |
|---|---|---|
| `host-shell` | **2113** | 2399 |
| `admin-console` | **2050** | 2302 |
| `management-console` | **0** | 25 |

### Why such a large safelist?

The Falcon UI dual-render system uses Tailwind class strings built by 47 helper files (`libs/falcon-ui-core/src/tailwind/*-tailwind-classes.ts`). The helpers concatenate strings programmatically: `'h-[length:var(--falcon-input-height-' + size + ')]'`. The Oxide scanner CANNOT statically detect this — it sees `'h-[length:var(--falcon-input-height-'` and `']'` as separate string fragments. So every concatenated utility must be safelisted.

For a single component (`<falcon-input>`), the safelist needs at minimum:
- `h-[length:var(--falcon-input-height-sm)]`
- `h-[length:var(--falcon-input-height-md)]`
- `h-[length:var(--falcon-input-height-lg)]`
- Same for `px`, `py`, `bg`, `border`, `border-color`, `shadow`, `text` per state (default/hover/focus/error/success/warning/disabled/readonly) and variant (form/search/grid) and appearance (default/filled/ghost).

That's ~3 × 3 × 8 × 3 × 3 = 648 classes for input alone. Multiplied across 45 components → ~2000+ safelist entries.

---

## Safelist categorical breakdown

### Common to both host-shell and admin-console

Both apps share these categories (in roughly the same line ranges):

| LINE RANGE (host-shell) | CATEGORY | COUNT |
|---|---|---|
| 36 | Sidebar chevron rotation | 1 |
| 38-40 | Studio typography micro-scale | 2 |
| 41-49 | Wave 6B sizing arbitrary-values | 9 |
| 51-95 | Input common safelist | ~45 |
| 96-300 | Dropdown trigger + panel + chevron | ~200 |
| 300-700 | Input state utilities (hover/focus/error/etc.) | ~400 |
| 700-1100 | Multi-select / combobox / checkbox utilities | ~400 |
| 1100-1500 | Tabs + tab indicator + panel | ~400 |
| 1500-1900 | Stepper + tree + tree-table + table | ~400 |
| 1900-2100 | Dialog + drawer + toast + tooltip | ~200 |
| 2100-2300 | OTP + phone-field + email-field + otp-send-dialog | ~200 |
| 2300-2399 | Studio + glass + dashboard preview | ~50 |

### Drift between host-shell and admin-console

#### Lines unique to host-shell (NOT in admin-console)

1. `@source inline("rotate-180")` (host-shell line 36) — sidebar chevron. Admin-console doesn't render the sidebar.
2. Studio Phase E live editor utilities (host-shell lines 2329-2399): `h-screen`, `min-h-0`, `overflow-hidden`, `md:grid-cols-2`, `sm:grid-cols-3`, `grid-cols-1`, `grid-cols-2`, `bg-falcon-teal-700`, `hover:bg-falcon-teal-700`, `text-falcon-teal-700`, `focus:ring-falcon-teal-500/40`, `accent-falcon-teal-500`, `hover:bg-falcon-neutral-50`, `text-falcon-neutral-600`, `bg-falcon-neutral-100`, `text-falcon-amber-700`, `bg-falcon-amber-50`, etc. The Falcon Studio (hidden but kept) safelist remains in host-shell.

#### Lines unique to admin-console (NOT in host-shell)

1. **`@layer base { html, body { font-family: var(--font-display) } }`** (admin-console lines 2297-2301) — admin-console binds body font directly to `--font-display` (Poppins). LTR + RTL handled. This is a NEW rule (not safelist) — it's a CSS @layer rule inside the Tailwind entry file. This effectively does what host-shell `styles.scss` does but via a less invasive Tailwind layer. **No conflict with SSOT documented but the SSOT says `--font-sans: var(--font-sans-latin)` (Neue Haas Grotesk Display Pro). Admin-console is overriding to Poppins.**

#### Numeric drift

| METRIC | host-shell | admin-console | DIFF |
|---|---|---|---|
| Total safelist entries | 2113 | 2050 | +63 in host-shell |

Difference accounts for: rotate-180 (1) + Studio Phase E utilities (~60) + a few other host-shell-only utilities = ~63.

---

## Why each safelist is needed — categorical justification

### Token-bound arbitrary-value utilities (highest count, ~1500+)

Every component reads heights, paddings, colors, borders, shadows from `--falcon-<component>-*` tokens via arbitrary-value Tailwind syntax: `h-[length:var(--falcon-input-height-md)]`. The class string is built in the helper at runtime per props (size, state, variant). All combinations need to be safelisted.

### State-keyed utilities (~300)

Per state (default/hover/focus/error/success/warning/disabled/readonly), per component, per property (bg/border/shadow/text). Each state × component × property combination is a single Tailwind class.

### Variant-keyed utilities (~200)

Input variants (form/search/grid), button variants (primary/secondary/ghost/danger/link), tabs modes (navigation/radio-cards), tag severities (7 levels). Each variant emits a variant-specific utility.

### Standard utilities (always-on, ~100)

`flex`, `items-center`, `cursor-pointer`, `gap-1`, `gap-1.5`, `gap-2`, `text-xs`, `text-sm`, `mb-1`, `mt-1`, `relative`, `absolute`, `inset-0`, `transition-colors`, etc. Used by many components.

### Studio utilities (host-shell only, ~50)

Phase E live editor. Tied to the hidden `libs/falcon-studio/` package — Studio is mounted in host-shell only (when re-enabled).

### Falcon-specific named utilities (~80)

`bg-falcon-neutral-0`, `bg-falcon-neutral-50`, `bg-falcon-neutral-100`, `bg-falcon-red-100`, `bg-falcon-red-500`, `border-falcon-neutral-200`, `border-falcon-neutral-400`, `border-falcon-red-500`, `border-falcon-teal-500`, `text-falcon-neutral-475`, `text-falcon-neutral-500`, `text-falcon-neutral-600`, `text-falcon-neutral-700`, `text-falcon-neutral-800`, `text-falcon-neutral-900`, `text-falcon-red-500`, `text-falcon-red-700`, `hover:bg-falcon-neutral-100`, `hover:text-falcon-neutral-900`, `shadow-falcon-sm`, `shadow-falcon-md`, `shadow-falcon-lg`, etc. The frequently-referenced palette + shadow utilities.

---

## Management-console exposure

`apps/management-console/src/tailwind.css` is 25 lines, **zero safelist**. The file:

```css
@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css";
@source "./";
@source "../../../libs/falcon/src/shared-ui";
@source "../../../libs/falcon-ui-core/src/tailwind";
@source "../../../libs/falcon-ui-core/src/angular-wrapper";
@source "../../../libs/falcon-ui-core/src/components";
@source not "../../../node_modules";
@source not "../../../dist";
@source not "../../../.angular";
@source not "../../../.nx";
@source not "../../../demos";
@source not "../../../**/*.spec.ts";
@source not "../../../**/*.e2e.ts";
@source not "../../../**/*.md";
@import "../../../libs/falcon-ui-tokens/src/index.css";
```

### Why management-console works at all

The `@source "../../../libs/falcon-ui-core/src/tailwind"` directive walks the TypeScript helper files. The Oxide scanner CAN see literal string LITERALS inside `.ts` files (e.g., `'rounded-md'`, `'flex'`). What it CANNOT see is concatenated strings.

For most Falcon UI components, the helper functions use literal strings for STATIC parts of the class and arbitrary-value strings for DYNAMIC parts. So:

```ts
const base = 'flex items-center rounded-md transition-colors';  // STATIC - scanner sees
const dynamic = `h-[length:var(--falcon-input-height-${size})]`; // DYNAMIC - scanner misses
```

The scanner picks up `'flex'`, `'items-center'`, `'rounded-md'`, `'transition-colors'`. It MISSES the height utility because the template literal interpolation is not statically resolvable.

### Risk

If any management-console template uses:
- An Angular `[class.X]=` binding where `X` is a dynamic key.
- A `[ngClass]="..."` with computed keys.
- A class string built via JS concatenation in a component method that returns a string.

The Tailwind scanner WILL miss those utilities. Bundle will be smaller. Rendering will be visually wrong (class won't apply because the utility wasn't generated).

This is a latent landmine. host-shell and admin-console catch it with their massive safelists. management-console is exposed.

---

## Risk of over-safelisting

The safelist files are 2000+ lines of class registrations. Each registered class adds ONE line of CSS to the compiled stylesheet (the utility's rule). At 2113 classes × ~50 bytes/class avg = ~100 KB extra CSS in host-shell's compiled bundle.

This is a real cost. Many classes are TWO or THREE state combinations that are NEVER rendered together in practice (e.g., `disabled:focus:bg-[var(--falcon-input-bg-disabled)]` — a focused-disabled state doesn't exist). The safelist is preventative, not curated.

### Cost-benefit

- **Benefit**: Bulletproof — no silent class drops.
- **Cost**: ~100 KB extra CSS per app × 3 apps = ~300 KB total. Likely 30-50 KB compressed. Manageable but not free.

---

## Recommendations

### UP-05 — Auto-generate safelist from helper output (P1)

A node script that:
1. Walks `libs/falcon-ui-core/src/tailwind/*.ts`.
2. Extracts every string literal that matches a Tailwind utility pattern (regex: classes, arbitrary-values, etc.).
3. Dedupes.
4. Emits a single shared safelist partial: `apps/<app>/src/tailwind.safelist.css`.
5. Per-app `tailwind.css` `@import`s the partial.

Result:
- Drift eliminated (one source of truth).
- Management-console gets the safelist automatically.
- New utilities in helpers auto-propagate to safelist without manual sync.

### UP-13 — Bring management-console safelist to parity (P2)

Immediate fix: copy admin-console's safelist into management-console's tailwind.css. Adds ~100 KB CSS but eliminates the silent-drop risk. Stopgap until UP-05 lands.

### Document the safelist owner

Add a top-of-file comment in each tailwind.css describing:
- The categorical breakdown.
- The auto-generation process (when UP-05 lands).
- The intent: this file is NOT hand-edited daily; modify the helpers and re-run the generator.

---

## Detected anomalies

1. **admin-console `@layer base { html, body { font-family: var(--font-display) } }`** (lines 2297-2301) — admin-console BINDS the body font to Poppins via a `@layer base` rule. host-shell uses a separate `styles.scss` override for the same purpose. Three different fonts (`--font-sans` from SSOT, `--font-display` from admin-console, Poppins explicit from host-shell SCSS) compete. See UPGRADE_CANDIDATES UP-10 — brand-font reconcile.
2. **No management-console font override** — management-console relies on the SSOT default (`--font-sans` → `--font-sans-latin` → Neue Haas Grotesk Display Pro). So management-console renders in a DIFFERENT font from host-shell and admin-console. **Three fonts across three apps.** Major visual inconsistency. UP-10 + UP-13.

---

## Cross-references

- See `APP_TAILWIND_AUDIT.md` for full app entry inventory.
- See `TAILWIND_HELPERS_AUDIT.md` for the helper-generated class strings that drive the safelist.
- See `STATIC_STYLE_RISKS.md` for the host-shell brand-font violation.
- See `UPGRADE_CANDIDATES.md` UP-05, UP-10, UP-13.
