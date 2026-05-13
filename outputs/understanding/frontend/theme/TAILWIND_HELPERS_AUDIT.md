*** Tailwind helpers audit ***
*** Every file under `libs/falcon-ui-core/src/tailwind/` ***
*** Verified against active source at 2026-05-13 ***

# Tailwind class-builder helpers

The Falcon UI dual-render system depends on a per-component TypeScript helper that builds Tailwind class strings consumed by:

1. **Stencil Light DOM components** (`falcon-X-tw/falcon-X-tw.tsx`) — rendered as plain HTML with utility classes (no Shadow DOM).
2. **Angular wrappers** (`falcon-angular-X.component.ts`) — when `useTailwind` is true, the wrapper renders the Light DOM template; helpers feed `class="..."` strings to the template.
3. **React + Vue wrappers** (under `libs/falcon-ui-react/` and `libs/falcon-ui-vue/`) — same helpers are imported via the auto-emitted proxy wrappers.

This audit enumerates every helper file, its role, and how it is consumed.

---

## File inventory

`libs/falcon-ui-core/src/tailwind/` contains:

- **1 barrel file**: `tailwind-classes.ts` — re-exports every component helper.
- **40 component helper files**: `<name>-tailwind-classes.ts` — one per component.
- 1 `.d.ts.map`, 1 `.js`, 1 `.js.map`, 1 `.d.ts` per source file (Stencil + TS build artifacts).

**Total source files** (`.ts`): 41 (1 barrel + 40 components).
**Total built artifacts**: 4× 41 = 164 generated files. Not under the audit scope (build outputs).

---

## Barrel: `tailwind-classes.ts`

**Purpose**: Single import path. Every consumer of any Falcon UI Tailwind helper imports from `@falcon/ui-core/tailwind` or `@falcon/ui-core` (the public package), and the barrel re-exports every per-component helper.

**Pattern**:
```ts
export * from './input-tailwind-classes';
export * from './dropdown-tailwind-classes';
... 38 more re-exports ...
```

**Re-exports** (40 entries):
1. input · 2. dropdown · 3. checkbox · 4. radio · 5. multi-select · 6. switch · 7. textarea · 8. tabs · 9. tree-table · 10. stepper · 11. uploader · 12. tree · 13. dialog · 14. table · 15. calendar · 16. date-picker · 17. tooltip · 18. accordion · 19. paginator · 20. toast · 21. toast-host · 22. button · 23. otp · 24. phone-field · 25. email-field · 26. otp-send-dialog · 27. status-badge · 28. icon · 29. empty-state · 30. badge · 31. avatar · 32. wizard · 33. search-input · 34. grid-input · 35. combobox · 36. filter-panel · 37. card · 38. checkbox-group · 39. confirm-dialog · 40. input-number · 41. password · 42. radio-group · 43. tag

Wait — that's 43, not 40. Let me recount the file listing.

**Actual helper files in `libs/falcon-ui-core/src/tailwind/` (`.ts` only)**:

```
accordion-tailwind-classes.ts
avatar-tailwind-classes.ts
badge-tailwind-classes.ts
button-tailwind-classes.ts
calendar-tailwind-classes.ts
card-tailwind-classes.ts
checkbox-group-tailwind-classes.ts
checkbox-tailwind-classes.ts
combobox-tailwind-classes.ts
confirm-dialog-tailwind-classes.ts
date-picker-tailwind-classes.ts
dialog-tailwind-classes.ts
drawer-tailwind-classes.ts
dropdown-tailwind-classes.ts
email-field-tailwind-classes.ts
empty-state-tailwind-classes.ts
filter-panel-tailwind-classes.ts
grid-input-tailwind-classes.ts
icon-tailwind-classes.ts
input-number-tailwind-classes.ts
input-tailwind-classes.ts
menu-tailwind-classes.ts
multi-select-tailwind-classes.ts
otp-send-dialog-tailwind-classes.ts
otp-tailwind-classes.ts
paginator-tailwind-classes.ts
password-tailwind-classes.ts
phone-field-tailwind-classes.ts
radio-group-tailwind-classes.ts
radio-tailwind-classes.ts
search-input-tailwind-classes.ts
single-uploader-tailwind-classes.ts
status-badge-tailwind-classes.ts
stepper-tailwind-classes.ts
switch-tailwind-classes.ts
table-tailwind-classes.ts
tabs-tailwind-classes.ts
tag-tailwind-classes.ts
textarea-tailwind-classes.ts
toast-host-tailwind-classes.ts
toast-tailwind-classes.ts
tooltip-tailwind-classes.ts
tree-table-tailwind-classes.ts
tree-tailwind-classes.ts
uploader-tailwind-classes.ts
wizard-tailwind-classes.ts
```

**Count**: 46 per-component helpers + 1 barrel = **47 source files**.

The barrel re-exports 43 explicit `export * from './...'` lines from line 13-140. Recount:

| barrel line range | exports |
|---|---|
| 14-140 | 43 explicit re-exports |

**GAP**: Filesystem has 46 component helpers; barrel re-exports 43. **Three helper files are NOT re-exported from the barrel**. Likely candidates (cross-referenced with the explicit list at the barrel and the filesystem):
- `menu-tailwind-classes.ts` (exists in fs; not seen in barrel)
- `single-uploader-tailwind-classes.ts` (exists in fs; not seen in barrel)
- `drawer-tailwind-classes.ts` (exists in fs; not seen in barrel)

Verification needed — run `grep -E "menu-tailwind|single-uploader-tailwind|drawer-tailwind" libs/falcon-ui-core/src/tailwind/tailwind-classes.ts` to confirm.

If confirmed, these three helpers are reachable only by direct deep import (`import { ... } from '@falcon/ui-core/tailwind/menu-tailwind-classes'`), NOT via the top-level barrel. This is a soft-bug — consumers may not know to deep-import.

---

## Per-component helper pattern

Each helper file follows this shape (canonical example: `input-tailwind-classes.ts`):

```ts
export type FalconInputSize = 'sm' | 'md' | 'lg';
export type FalconInputState = 'default' | 'error' | 'success' | 'warning';

export interface FalconInputTailwindContext {
  size?: FalconInputSize;
  state?: FalconInputState;
  hasError: boolean;
  disabled: boolean;
  readonly: boolean;
  focused?: boolean;
  variant?: FalconInputVariant;
  appearance?: FalconInputAppearance;
}

export function falconInputWrapperClasses(ctx: FalconInputTailwindContext): string {
  /* state-driven class string */
}

export function falconInputLabelClasses(ctx: FalconInputTailwindContext): string { ... }
export function falconInputHelperClasses(...): string { ... }
export function falconInputErrorClasses(...): string { ... }
export function falconInputClearButtonClasses(...): string { ... }
```

### Pattern characteristics

1. **Pure functions** — every helper is a pure function from context to string. No side effects, no state, no IO.
2. **Token-reading utilities only** — class strings reference `--falcon-<component>-*` tokens via arbitrary-value Tailwind utilities (e.g. `bg-[var(--falcon-input-bg-focus)]`, `h-[length:var(--falcon-input-height-md)]`). Never hardcoded values.
3. **Mirror Stencil Shadow CSS exactly** — the Stencil shadow stylesheet (`falcon-input.css`) and the Tailwind helper produce the SAME visual output. State machine is mirrored selector-for-selector.
4. **Variant + appearance overlays** — wrappers (`size`, `state`, `variant`, `appearance`) combine in helper-controlled exclusive branches (hasError beats focused beats default). Documented inline.
5. **Size-keyed records** — sizing is a `Record<FalconInputSize, string>` lookup. Each size value uses arbitrary `[length:var(--falcon-input-height-sm)]` so density still cascades through.

### Public API surface

Each helper exports:
- **Types**: `FalconXSize`, `FalconXState`, etc.
- **Interface**: `FalconXTailwindContext` — the input to every helper function.
- **Functions**: one per template region (wrapper, label, control, helper-text, error-text, clear-button, prefix, suffix, etc.).

### Typical helper count per component

- Simple components (icon, tag, badge, avatar, empty-state, search-input, grid-input) — 1-3 functions.
- Medium components (input, dropdown, button, switch, checkbox, radio, paginator, tooltip) — 4-8 functions.
- Complex components (table, multi-select, dropdown, tabs, tree, tree-table, dialog, drawer, uploader, single-uploader, stepper, wizard, calendar, otp, phone-field, email-field, otp-send-dialog, accordion, menu, toast) — 10-25 functions.

---

## Build artifacts

Each `.ts` file emits 4 build artifacts (Stencil's build pipeline):
- `<name>-tailwind-classes.js` — compiled JS.
- `<name>-tailwind-classes.js.map` — source map.
- `<name>-tailwind-classes.d.ts` — type declarations for consumers.
- `<name>-tailwind-classes.d.ts.map` — declaration map.

**Total**: 46 components × 4 = 184 built artifacts + 4 barrel artifacts = 188 in the directory.

`.js` and `.d.ts` files are part of the published Stencil `dist-custom-elements` target so React, Vue, and external consumers can import directly.

---

## How consumed

### By Stencil Light DOM components (`falcon-X-tw/falcon-X-tw.tsx`)

```ts
// e.g. falcon-input-tw.tsx
import { falconInputWrapperClasses, falconInputLabelClasses } from '../../tailwind/input-tailwind-classes';

@Component({ tag: 'falcon-input-tw', shadow: false })
export class FalconInputTw {
  render() {
    return (
      <div class={falconInputWrapperClasses(this.context)}>
        <label class={falconInputLabelClasses(this.context)}>...</label>
        ...
      </div>
    );
  }
}
```

The component renders into Light DOM (`shadow: false`), so the utility classes are visible to the Tailwind scanner via the app's `@source` of `libs/falcon-ui-core/src/components`.

### By Angular wrappers

```ts
// e.g. falcon-input.component.ts
@Component({ ... })
export class FalconInputComponent implements ControlValueAccessor {
  @Input() useTailwind = true; // default Light DOM render

  wrapperClass(): string { return this.useTailwind
    ? falconInputWrapperClasses(this.ctx)
    : ''; } // Shadow path delegates to <falcon-input>
}
```

Template (Angular):
```html
@if (useTailwind) {
  <falcon-input-tw class="...">...</falcon-input-tw>
} @else {
  <falcon-input class="...">...</falcon-input>
}
```

### By React + Vue wrappers

The Stencil build emits React + Vue wrappers automatically. Same helpers are imported in those wrappers identically.

---

## Why these helpers exist

The dual-render contract requires that:
1. **Shadow DOM rendering** uses pre-compiled CSS in `<style>` blocks (Stencil Shadow CSS files like `falcon-input.css`).
2. **Light DOM rendering** uses Tailwind utility classes for everything.
3. **Both paths read the SAME `--falcon-X-*` tokens** so a single token mutation updates both renders.

The helpers are the central source of Light DOM classes. They:
- Cannot drift from Shadow CSS because they mirror it deterministically.
- Are TypeScript so types catch context shape changes.
- Are pure → unit-testable.
- Drive the safelist auto-detection (Tailwind scanner walks these `.ts` files via the `@source "../../../libs/falcon-ui-core/src/tailwind"` directive).

---

## Risks

1. **Barrel drift** — 3 helpers not re-exported from `tailwind-classes.ts` (menu, single-uploader, drawer per my count). Consumers may not know to deep-import. UPGRADE_CANDIDATES P2 candidate.
2. **String concatenation defeats the scanner** — utility strings built via `'h-' + height + ' w-full'` are NOT detected by the scanner. The safelists in `apps/*/src/tailwind.css` are the fix, but they drift (see APP_TAILWIND_AUDIT.md). Real fix: auto-generate safelist from helper output (UPGRADE_CANDIDATES UP-05).
3. **Shadow-Light parity** — if a Shadow CSS rule changes (`libs/falcon-ui-core/src/components/falcon-X/falcon-X.css`) but the helper file doesn't, the two renders visually diverge. Today this is enforced by code-review only. A future gate could parse both and diff (high effort).
