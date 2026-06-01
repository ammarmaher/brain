---
name: Wave 7.14 — Native input consolidation (icon-as-Input)
description: Merged the Wave 7.12 two-component design (icon-box + native-input) into one component. SVG icon is passed as a simple `[iconName]` @Input from the SVG registry. No more flex wrapper in the consumer template.
type: project
originSessionId: 3a74be81-9cee-451f-a4bb-73c7d391eee1
---
🟢 LANDED 2026-05-17 (Wave 7.14). `nx build admin-console` GREEN `03b4946c3e8a5ef3`/18.7s.

**Why this was needed (operator feedback)**: Wave 7.12 over-engineered the priceValue cell — two cooperating components (`<app-falcon-icon-box>` + `<app-falcon-native-input>`) plus a `<div class="flex items-stretch h-8 rounded-md border overflow-hidden">` wrapper with conditional border-color classes living in the consumer template. Operator asked for the simplest possible "pass the SVG as an input" API.

**The simpler API — ONE input controls the whole prefix**:
```html
<app-falcon-native-input
  iconName="currency-sar"
  [iconSize]="14"
  [disabled]="row.visible !== true"
  [state]="hasError ? 'error' : 'default'"
  [min]="0" [integer]="true"
  [placeholder]="row.visible ? '0' : '----'"
  [(ngModel)]="row.priceValue" />
```

That's the entire cell. No wrapper `<div>`, no flex orchestration, no border-class permutations, no separate icon component import. Pass any registered glyph name from `SVG_ICON_NAMES` and the component handles the rest.

**What the component does internally**:
1. Renders as a flex row via `:host { display: inline-flex; align-items: stretch; height: 32px; border; border-radius; overflow:hidden }` — the host IS the input-group shell.
2. Conditionally renders a `<span class="prefix">` with `<falcon-svg-icon [name]="iconName" [size]="iconSize">` when `iconName` is set. Width auto-sizes to icon + padding. Right border divides prefix from input.
3. Renders the native `<input class="control">` filling the remaining flex space.
4. Host classes `.app-falcon-native-input-disabled` and `.app-falcon-native-input-error` drive bg + border via :host CSS rules — the prefix area + input area both react automatically through descendant selectors.
5. Icon `currentColor` inherits from `.prefix { color: var(--color-falcon-neutral-700); }` and switches to neutral-400 when disabled — the SAR glyph in the registry uses `fill: currentColor` (the `<falcon-svg-icon>` template binds `[style.fill]="computedColor"` which defaults to `'currentColor'`), so the icon color follows the prefix's text-color rule automatically.

**File delta**:
- DELETED: `client-service-row-table/components/falcon-icon-box.component.ts` — no longer needed
- EDITED: `client-service-row-table/components/falcon-native-input.component.ts` — added `[iconName]` Input, `<falcon-svg-icon>` import from `@falcon`, full input-group shell styling on `:host`, prefix area in template
- EDITED: `client-service-row-table/client-service-row-table.component.html` — priceValue cell collapsed from 25 lines (flex wrapper + icon-box + input + conditional border classes) to 10 lines (single component, single icon-name string)
- EDITED: `client-service-row-table.component.ts` — removed `FalconAngularSaudiRiyalIconComponent` import + `FalconIconBoxComponent` import from `imports[]`

**Doctrine — best practices for "icon-as-input" on Falcon controls**:
- **DO**: Use `@Input() iconName: SvgIconName | null` keyed to the central SVG registry (`libs/falcon/src/shared-ui/lib/ui/svg-icon/svg-icon.registry.ts`). Type-safe via `SvgIconName`. Tree-shakable (only requested glyphs ship). Auto-themed via `currentColor`.
- **DO**: Let the input component own the prefix-area styling. Disabled bg, error border, height, padding — all internal to the component, not the consumer template.
- **DO**: Use `<falcon-svg-icon>` for any in-app icon rendering. It's the SoT consumer of the registry.
- **DO**: Style icon color via `color` CSS on the prefix container — the `currentColor` fill on registry paths follows automatically.
- **DON'T**: Project icons via `<ng-content>` for the common case — it forces the consumer to import the icon component and write template markup. `[iconName]` is cleaner for registered glyphs.
- **DON'T**: Build separate icon-box + input components when one component can own both visual zones. Two-component design is right when consumers need to compose freely (e.g. swap the prefix for non-icon content); otherwise it's over-engineering.
- **DON'T**: Spread the shell styles (border, rounded, overflow, bg) across consumer wrapper divs. They belong on the input's `:host`.

**Verification path** for the operator:
1. Open Add Client wizard → Step 3 (Comm Channels) or Step 4 (Applications)
2. First render: every row's priceValue cell shows the SAR glyph in a gray prefix area + gray input area + "----" placeholder + cursor not-allowed
3. Toggle a row ON → cell switches to: SAR glyph in light-gray prefix, white input area, "0" placeholder, cursor text
4. Type a number → only digits accepted, value updates
5. Toggle row OFF → cell returns to all-gray, value cleared

**Triggers to recall**: `Wave 7.14` / `app-falcon-native-input iconName` / `icon-as-input doctrine` / `consolidated input prefix` / `simplify priceValue cell`.
