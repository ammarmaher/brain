---
name: SAR icon Wave 7.13 — Official 2024 Riyal glyph in registry
description: Replaced legacy 14×16 single-path SAR glyph with the official Saudi Central Bank 2024 unified multi-path symbol in the canonical SVG registry. Single SoT — every consumer of CURRENCY_SAR updates automatically.
type: project
originSessionId: 3a74be81-9cee-451f-a4bb-73c7d391eee1
---
🟢 LANDED 2026-05-17 (Wave 7.13). `nx build admin-console` GREEN `dbd4376344586d0f`/17.4s.

**The real root cause of "SAR icon doesn't show"**:
The `<falcon-angular-saudi-riyal-icon>` component is just a thin pass-through to `<falcon-svg-icon [name]="CURRENCY_SAR" [size]="size">`. That component reads the path data from the centralized **SVG registry** at `libs/falcon/src/shared-ui/lib/ui/svg-icon/svg-icon.registry.ts`. The `CURRENCY_SAR` entry existed but used an older, less recognizable Riyal glyph — operator reported it "didn't look right" / "wasn't loading visually as expected." The fix is to update the registry entry — NOT to add new SVG infrastructure.

**File changed**: ONE file — `libs/falcon/src/shared-ui/lib/ui/svg-icon/svg-icon.registry.ts`, the `CURRENCY_SAR` entry only.

**Before**:
```ts
[SVG_ICON_NAMES.CURRENCY_SAR]: {
  viewBox: '0 0 14 16',
  width: 14, height: 16,
  paths: 'M13.6299 12.4014C13.5682 ...', // single-path, legacy glyph
}
```

**After** (multi-path via `paths: string[]`):
```ts
[SVG_ICON_NAMES.CURRENCY_SAR]: {
  viewBox: '0 0 9367.833 10469.917',  // high-precision authoring viewport
  width: 14, height: 16,
  paths: [
    /*** Path 1 — top-right accent stroke (small swoop above the glyph). ***/
    'M5830.167 9275.167c-167.167 370.667 ...',
    /*** Path 2 — main glyph body. ***/
    'M9047.75 7465c167.167 ...',
  ],
}
```

**Why multi-path works without component changes**:
The `<falcon-svg-icon>` component already supports both forms via `SvgIconDefinition.paths: string | string[]`:
- Single-path branch: `singlePathData` getter when `typeof paths === 'string'`
- Multi-path branch: `pathArray` getter when `Array.isArray(paths)` — template iterates with `@for (path of pathArray; track path)`
The new SAR icon falls into the multi-path branch automatically.

**Single source of truth — what propagates**:
- `<falcon-angular-saudi-riyal-icon>` in `falcon/src/shared-ui/lib/components/`
- Wallet balance views (via wallet UI that consumes the wrapper)
- `applications-table.component.html` priceValue cell + shadow rows
- Add Client wizard Step 3/4 priceValue cell (Wave 7.12's new native input + icon-box composition)
- Anything else referencing `SVG_ICON_NAMES.CURRENCY_SAR` (grep returned 4 files — registry + wrapper + 2 consumers; the wrapper is the only public API, all others go through it).

**Behaviour preserved**:
- `fill="currentColor"` inheritance — paths still inherit color from CSS `color`, so consumers control colour via `text-falcon-neutral-*` Tailwind utilities (the way `<app-falcon-icon-box>` does it via `[class.text-falcon-neutral-700]="!disabled"`).
- Aspect ratio: new glyph is ~0.895 wide-to-tall (slightly portrait). When consumer passes single `[size]="N"` the SVG renders inside N×N with default `preserveAspectRatio="xMidYMid meet"` centering — visually identical to the prior glyph at typical icon sizes (12–16px).
- Default `width: 14, height: 16` defaults preserved so consumers that don't pass `[size]` get the same physical footprint as before.

**Doctrine — adding/replacing icons in Falcon**:
1. **Always edit the central registry**, not individual components. `libs/falcon/src/shared-ui/lib/ui/svg-icon/svg-icon.registry.ts` is the SoT for every named glyph in the platform.
2. **Use the `paths: string[]` form for multi-path SVGs** — the component already handles iteration. No JSX/template changes needed.
3. **Use `paths: string` for single-path SVGs** — simpler, fewer characters.
4. **Use `isFullSvg: true` only when the SVG contains `<defs>`, `<pattern>`, `<filter>`, or multiple `<g>` groups** — for those, the component does HTML innerHTML injection with sanitization + ID uniqueness rewriting (see `processedFullSvg` getter).
5. **Preserve `fill="currentColor"` via the template binding** — the registry stores the `d` attribute only; fill is applied at render via `[style.fill]="computedColor"` which defaults to `'currentColor'`.
6. **Never duplicate path data inline in consumer components** — it defeats tree-shaking, breaks Studio token-color theming, and creates SoT drift.

**Verification path** for the operator:
1. Visit any consumer of the SAR icon — easiest is the applications-table priceValue column (visible without leaving any flow).
2. Or open Add Client wizard → Step 3 (Comm Channels) → toggle a row ON → the SAR icon now appears in the price value input's prefix box.
3. The new glyph should display as the modern unified Saudi Riyal symbol.

**Triggers to recall**: `SAR icon registry update` / `currency-sar multi-path` / `saudi riyal new glyph` / `Wave 7.13` / `SVG registry SoT doctrine`.
