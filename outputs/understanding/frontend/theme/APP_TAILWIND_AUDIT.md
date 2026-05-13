*** App-level `tailwind.css` audit ***
*** Verified against active source at 2026-05-13 ***

# App Tailwind v4 entry audit

Each Angular MF app declares its own `tailwind.css` at `apps/<app>/src/tailwind.css`. These files are the entry point Tailwind v4's Oxide scanner reads. They:

1. `@import` the shared theme SSOT (`falcon-tailwind-tokens.css`).
2. `@import` the cross-framework token barrel (`falcon-ui-tokens/src/index.css`).
3. Declare `@source "..."` paths so the scanner crawls the right templates.
4. Declare `@source not "..."` exclusions for paths that should never seed classes.
5. Declare `@source inline("...")` safelists for runtime-built class strings the scanner cannot statically detect.

This audit catalogs every entry: `@import` chain, `@source` paths, `@source not` exclusions, `@source inline()` safelists, and the dark-mode trigger class.

---

## 1. `apps/host-shell/src/tailwind.css`

**Length**: 2399 lines
**`@source inline(...)` count**: **2113**

### `@import` chain (lines 1-7)

```css
@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css";   /* SSOT */
@import "../../../libs/falcon-ui-tokens/src/index.css";                /* component-token barrel */
```

Order:
1. SSOT `@theme` block (declares all 216 design tokens + 14 keyframes).
2. UI-tokens barrel (primitives → semantic → themes → density → rtl → 46 per-component imports).

### `@source` paths (lines 9-17)

```
@source "./";                                          /* own app source */
@source "../../../libs/falcon/src/shared-ui";          /* legacy bespoke Angular components */
@source "../../../libs/falcon-ui-core/src/tailwind";   /* class-builder helpers */
@source "../../../libs/falcon-ui-core/src/angular-wrapper"; /* Angular wrappers */
@source "../../../libs/falcon-ui-core/src/components"; /* Stencil component templates */
```

**Excluded** (line 19): `libs/falcon-studio/src` (Wave 2 v3.1 hide-but-keep — Studio not scanned).

### `@source not` exclusions (lines 25-33)

```
@source not "../../../node_modules";
@source not "../../../dist";
@source not "../../../.angular";
@source not "../../../.nx";
@source not "../../../demos";
@source not "../../../**/*.spec.ts";
@source not "../../../**/*.e2e.ts";
@source not "../../../**/*.md";    /* Markdown audit reports leak orphan utilities */
```

### `@source inline()` safelists (~2113 lines)

Categorized inline comments document the safelist by purpose. Major sections (approximately by line range):

| LINES | PURPOSE | Sample entries |
|---|---|---|
| 36 | Sidebar chevron rotation | `rotate-180` |
| 38-40 | Studio typography micro-scale | `text-2xs`, `text-3xs` |
| 41-49 | Wave 6B sizing/border-width/radius arbitrary-values | `w-[length:var(--falcon-size-icon-sm,0.875rem)]`, `border-[length:var(--falcon-border-width-1-5,1.5px)]`, `rounded-[var(--radius-2xs,0.1875rem)]` |
| 51-95 | Falcon input + dropdown common safelist | `bg-falcon-neutral-0`, `text-falcon-neutral-900`, label arbitrary-values reading from `--falcon-input-label-*` tokens, helper/error padding utilities, clear-button utilities |
| 96-300 | `<falcon-dropdown>` trigger + panel + chevron + search utilities | `h-[34px]`, `h-10`, `text-[13px]`, `transition-[border-color,box-shadow,background-color]`, `duration-150`, `ease`, `cursor-not-allowed` |
| 300-700 | Token-bound arbitrary-value classes for input states across hover/focus/error/success/warning/disabled/readonly | `bg-[var(--falcon-input-bg-hover)]`, `border-[var(--falcon-input-border-color-focus)]`, `shadow-[var(--falcon-input-shadow-focus)]` |
| 700-1100 | `<falcon-multi-select>` + `<falcon-combobox>` + `<falcon-checkbox>` chip + check-row + chip-overflow utilities | `flex`, `items-center`, `gap-[var(--falcon-multi-select-chip-gap)]`, `rounded-[var(--falcon-multi-select-chip-radius)]` |
| 1100-1500 | `<falcon-tabs>` + `<falcon-tabs-tw>` panel + tablist + indicator | `border-b-2`, `border-falcon-teal-500`, `transition-transform` |
| 1500-1900 | `<falcon-stepper>` + `<falcon-tree>` + `<falcon-tree-table>` + `<falcon-table>` | row/cell utilities, rail SVG positioning, hover-path utilities |
| 1900-2100 | `<falcon-dialog>` + `<falcon-drawer>` + `<falcon-toast>` + `<falcon-tooltip>` | overlay z-index, transform anchor, animation utilities |
| 2100-2200 | `<falcon-otp>` + `<falcon-phone-field>` + `<falcon-email-field>` + `<falcon-otp-send-dialog>` | box sizing, divider utilities, verify-button utilities |
| 2200-2399 | Studio + glass + dashboard preview utilities (preserved despite Studio being hidden) | `rounded-md`, `rounded-xl`, `font-mono`, `text-[10px]`, `text-base`, `text-2xl`, `disabled:opacity-50`, `focus:ring-2`, `transition-shadow`, `transition-all`, `lg:grid-cols-3`, `gap-3`, `gap-4`, `p-3`, `p-4`, `p-5`, `h-7`, `h-px`, `w-7`, `w-24`, `w-32`, `text-[11px]`, `inset-x-0`, `ml-auto`, `h-16`, `leading-snug`, `falcon-studio-instance-zone`, `text-left` |

### Layer order (inherited from SSOT)

Layer order declared in SSOT `falcon-tailwind-tokens.css:11`:
```
@layer theme, base, falcon-base, utilities;
```

`utilities` is LAST → utilities win over `falcon-base` and `theme`.

### Dark-mode trigger class

Defined in SSOT line 13:
```
@custom-variant dark (&:where(.app-dark, .app-dark *));
```

Activate by `<html class="app-dark">`. The `:where(...)` selector means dark variants fire on `.app-dark` AND on any descendant of `.app-dark`. The dark-mode override block (`falcon-tailwind-tokens.css:385-451`) ALSO fires when `<html class="dark">` is used (second selector in the where clause).

---

## 2. `apps/admin-console/src/tailwind.css`

**Length**: 2302 lines
**`@source inline(...)` count**: **2050**

### `@import` chain (lines 1-8)

```css
@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css";
@import "../../../libs/falcon-ui-tokens/src/index.css";
```

Identical to host-shell.

### `@source` paths (lines 10-18)

Identical to host-shell.

### `@source not` exclusions (lines 23-31)

Identical to host-shell.

### `@source inline()` safelist — diff vs host-shell

The first ~96 lines (Falcon input/dropdown common safelist) are IDENTICAL to host-shell. The remaining ~1950+ lines drift in subtle ways:

| AREA | HOST-SHELL has | ADMIN-CONSOLE has | NOTES |
|---|---|---|---|
| `rotate-180` | YES (line 36) | NO | Sidebar lives in host-shell only; admin-console doesn't render the sidebar chevron. **OK** drift. |
| Studio classes (~lines 2200-2399 in host-shell) | YES | YES (mostly identical) | Studio is hidden but the safelist preserves both. **OK** drift. |
| `transition-shadow` | YES (line 2362) | NOT VERIFIED | Need spot-diff. |
| `bg-falcon-red-100` | YES + `border-falcon-red-500` next | YES (line 72) but missing `border-falcon-red-500` follow-up | Possibly stale comment vs intent. |
| `text-falcon-red-500` / `text-falcon-red-700` | YES (lines 93-94) | YES (line 87-88, "Legacy / older spec safelist") | OK. |
| `hover:bg-falcon-neutral-100` | YES (line 95) | NOT VERIFIED in admin | Possibly missing. |

**Notable**: admin-console comment at line 86: "Legacy / older spec safelist (kept so older callers / flips don't break)." This signals admin-console safelist has had OLDER hand-edits than host-shell.

### Dark-mode trigger class

Same as host-shell (inherited from SSOT).

---

## 3. `apps/management-console/src/tailwind.css`

**Length**: 25 lines
**`@source inline(...)` count**: **0**

### Full file content

```css
/*** Management Console — Tailwind v4 entry. SSOT lives in libs/falcon-theme/src/falcon-tailwind-tokens.css (alias @falcon/theme). ***/
/*** This file only declares @source paths so Tailwind scans the right templates. ***/

@import "../../../libs/falcon-theme/src/falcon-tailwind-tokens.css";

@source "./";
@source "../../../libs/falcon/src/shared-ui";
/*** Pull in the Falcon UI cross-framework Tailwind helpers + Stencil component templates ***/
/*** so utilities emitted by `*-tailwind-classes.ts` are generated for management-console too. ***/
@source "../../../libs/falcon-ui-core/src/tailwind";
@source "../../../libs/falcon-ui-core/src/angular-wrapper";
@source "../../../libs/falcon-ui-core/src/components";

/*** Excludes — never seed classes from these paths. ***/
@source not "../../../node_modules";
@source not "../../../dist";
@source not "../../../.angular";
@source not "../../../.nx";
@source not "../../../demos";
@source not "../../../**/*.spec.ts";
@source not "../../../**/*.e2e.ts";
@source not "../../../**/*.md";

/*** Falcon UI cross-framework tokens — drives <falcon-input> et al. ***/
@import "../../../libs/falcon-ui-tokens/src/index.css";
```

### Differences vs host-shell / admin-console

1. **NO safelist** — `@source inline()` count is zero. Zero hand-curated runtime class registrations.
2. **`@import "../../../libs/falcon-ui-tokens/src/index.css"` is at the END** (line 25), not after the SSOT. Both apps put it at line 7-8 (right after SSOT). Order matters because `index.css` declares semantic tokens that reference SSOT primitives; doing the import LATE means tokens-layer is bound LAST. Likely benign because Tailwind v4 reads `@theme` before any CSS executes anyway, but it is an inconsistency.
3. **No exclusion for `libs/falcon-studio/src`** — but that's because there's no `@source` line that would have included it anyway. host-shell + admin-console don't have it either.

**RISK**: If any management-console template uses an Angular `[class.X]` binding (which the Tailwind scanner cannot statically detect because the class name is JS-built at runtime), the utility may silently drop from the bundle. The Tailwind scanner walks template files but cannot evaluate Angular binding string concatenations. host-shell and admin-console catch these with their giant safelists. Management-console is exposed.

---

## Cross-app comparison

| ASPECT | host-shell | admin-console | management-console |
|---|---|---|---|
| Lines | 2399 | 2302 | 25 |
| `@source inline()` | 2113 | 2050 | 0 |
| SSOT import order | First | First | First |
| UI-tokens barrel order | Second (line 7) | Second (line 8) | LAST (line 25) |
| Excludes | 8 | 8 | 8 |
| `@source` paths | 5 | 5 | 5 |
| Sidebar chevron safelist | `rotate-180` | (none) | (none) |

---

## Layer order across all three

All three apps inherit:
```
@layer theme, base, falcon-base, utilities;
```
from the SSOT (`falcon-tailwind-tokens.css:11`). No app overrides this.

`utilities` last = utilities beat falcon-base + theme. Standard v4 pattern.

---

## Dark-mode trigger class

All three apps inherit:
```
@custom-variant dark (&:where(.app-dark, .app-dark *));
```
from the SSOT (line 13). And the dark-override block fires under either `.app-dark` OR `.dark` (per the `:where(.app-dark, .app-dark *), :where(.dark, .dark *)` selector at lines 385-386).

Toggling: `<html class="app-dark">` (canonical) or `<html class="dark">` (Tailwind v3 carry-over compat).

---

## Recommendations

See `UPGRADE_CANDIDATES.md`:
- **UP-05** — auto-generate safelist from helper files. Eliminates the drift between host-shell + admin-console and the zero-safelist gap in management-console.
- **UP-13** — bring management-console safelist to parity. Latent landmine.
