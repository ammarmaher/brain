---
name: Add Client Wave 7.12 — Native priceValue input components
description: Replaced fragile 2-layer Stencil `<falcon-angular-input-number iconLeft>` in Step 3/4 priceValue cell with two purpose-built plain-Angular components — eliminates Stencil shadow:false slot re-projection class of bugs entirely.
type: project
originSessionId: 3a74be81-9cee-451f-a4bb-73c7d391eee1
---
🟢 LANDED 2026-05-17 (Wave 7.12). `nx build admin-console` GREEN `cc14f6df8420a9e7`/19.5s.

**Bugs (compound)** — Add Client Step 3 (Comm Channels) + Step 4 (Applications) priceValue cell:
1. The entire `<falcon-angular-input-number>` would intermittently disappear inside data-table rows.
2. SAR icon would sometimes render, sometimes not — flaky.
3. The visual disabled state didn't paint as expected — rows with `visible:false` looked enabled on first init (no gray bg).

**Root cause** — `<falcon-angular-input-number>` is a 2-layer Stencil shadow:false stack: `<falcon-input-number-tw>` composes `<falcon-input-tw>`. Slot projection of `<span slot="icon-left">` traverses 3 boundaries (Angular `<ng-content>` → outer Stencil slot re-projection → inner Stencil `<slot name="icon-left">`). Stencil's shadow:false slot polyfill is unreliable for re-projection AND fragile under `<ng-template falconDataTableCell>` + OnPush + cell re-instantiation on tab navigation. The reconciler drops the inner `<input>` while splicing the missing slot child.

**Fix — replaced with two new plain-Angular components** (no Stencil dependency at all):

1. **`<app-falcon-icon-box>`** at `apps/admin-console/.../add-client-wizard/client-service-row-table/components/falcon-icon-box.component.ts`:
   - Pure Angular template — single `<span>` with `<ng-content>` for the icon
   - `[disabled]` Input drives background + text color via `[class.*]` bindings
   - Default: `bg-falcon-neutral-50` + `text-falcon-neutral-700`
   - Disabled: `bg-falcon-neutral-100` + `text-falcon-neutral-400` + `cursor-not-allowed`
   - Configurable `paddingInline` + `minWidth` inputs

2. **`<app-falcon-native-input>`** at `apps/admin-console/.../add-client-wizard/client-service-row-table/components/falcon-native-input.component.ts`:
   - Native HTML `<input type="text">` — no Stencil, no slot polyfill
   - Full ControlValueAccessor — works with `[ngModel]`, `formControlName`
   - `[disabled]` setter writes a `signal<boolean>` that drives template classes + host class
   - Default bg: `#fff` (white). Disabled bg: `var(--color-falcon-neutral-100, #f3f4f6)` via `:host(.app-falcon-native-input-disabled)` rule — VISIBLE gray background per operator UX request
   - Built-in numeric keystroke filter (port of falcon-input-number-tw's `handleNumericKeydown` + `handleNumericPaste` to bound Angular event listeners)
   - `[integer]` flips inputMode hint from `'decimal'` → `'numeric'` for mobile keyboards
   - `[state]='error'` exposes host class `app-falcon-native-input-error` (consumer can add border styling on parent wrapper)

**Composition in the cell** (`client-service-row-table.component.html` priceValue ng-template):
```html
<div class="flex items-stretch h-8 rounded-md border overflow-hidden"
     [class.border-falcon-red-500]="showPriceValueError(row3)"
     [class.border-falcon-neutral-200]="!showPriceValueError(row3) && row3.visible === true"
     [class.border-falcon-neutral-150]="row3.visible !== true && !showPriceValueError(row3)">
  <app-falcon-icon-box [disabled]="row3.visible !== true" paddingInline="8px" minWidth="30px">
    <falcon-angular-saudi-riyal-icon [size]="14" />
  </app-falcon-icon-box>
  <app-falcon-native-input
    class="flex-1 min-w-0 border-s"
    [disabled]="row3.visible !== true"
    [state]="showPriceValueError(row3) ? 'error' : 'default'"
    [min]="0" [integer]="true"
    [placeholder]="row3.visible === true ? '0' : '----'"
    [ngModel]="row3.priceValue"
    (ngModelChange)="setPriceValue(row3.id, $event)" />
</div>
```

The wrapper `<div class="flex items-stretch h-8 rounded-md border overflow-hidden">` owns the joined border + rounded corners. The icon-box sits on the left at 30px min-width with the SAR glyph. The native input takes the remaining width via `flex-1 min-w-0`. The `border-s` on the input adds the visible vertical divider between the two zones.

When `row.visible === false`:
- Icon-box paints `bg-falcon-neutral-100` (visibly gray)
- Native input paints `bg-falcon-neutral-100` (visibly gray via :host class)
- Native input's text + placeholder color shifts to `falcon-neutral-400` (muted)
- Native `<input disabled>` blocks all interaction
- `cursor: not-allowed` on both zones

When error state triggered (`showPriceValueError(row) === true`):
- Wrapper border becomes `border-falcon-red-500`
- Inline `*Required` error message renders below

**Why this is the durable fix**:
- Native HTML `<input>` element — no Stencil shadow:false race, no slot polyfill, no componentDidLoad timing
- Disabled is a native HTML attribute on a native element — the browser handles it
- Background color is a Tailwind class — deterministic
- CVA via standard Angular forms — bulletproof through cell remount + OnPush
- The icon-box's `<ng-content>` is Angular's own content projection — works flawlessly across re-instantiation

**File delta**:
- NEW: `client-service-row-table/components/falcon-icon-box.component.ts` (60 lines)
- NEW: `client-service-row-table/components/falcon-native-input.component.ts` (225 lines)
- EDIT: `client-service-row-table/client-service-row-table.component.ts` — swapped `FalconAngularInputNumberComponent` import for the two new components in `imports[]`
- EDIT: `client-service-row-table/client-service-row-table.component.html` — priceValue ng-template now composes the two new components

**Doctrine — when to reach for plain Angular over Stencil wrappers**:
- Inside `<ng-template>` cell hosts that re-instantiate on tab navigation
- When the use case requires JUST a native input + simple styling (no token-heavy chrome)
- When the visual disabled state needs explicit background color control
- When slot re-projection across 2+ Stencil shadow:false layers is in the path
- Stencil wrappers are STILL the right call for: top-level forms with rich token chrome, components shared cross-framework (React/Vue demos), composite controls (dropdowns, date pickers, multi-selects)

**Verification path** for the operator (run from their dev env):
1. `docker compose up -d` (essentials stack)
2. `nx serve host-shell` (4200) + `nx serve admin-console` (4204)
3. Login as `sys-admin@test-tenant-001` / `Pass123!`
4. Open org-hierarchy → click Falcon root → "Add Client"
5. Navigate to Step 3 (Comm Channels) — observe all rows render with toggle OFF + visibly gray priceValue cell + SAR icon present
6. Toggle a row ON — priceValue cell switches to white bg + input becomes interactive
7. Type a number — only digits accepted (paste non-numeric → cleaned)
8. Toggle row OFF again — cell returns to gray + value cleared

**Triggers to recall**: `falcon priceValue cell` / `SAR input new components` / `app-falcon-icon-box` / `app-falcon-native-input` / `Wave 7.12` / `replace falcon-angular-input-number with native`.
