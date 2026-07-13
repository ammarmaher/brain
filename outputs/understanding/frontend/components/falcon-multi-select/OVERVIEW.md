# falcon-multi-select — OVERVIEW

## Component purpose

Multi-value selector built on the **dual-render Stencil pattern** (Shadow DOM `<falcon-multi-select>` + Light DOM `<falcon-multi-select-tw>` + Angular CVA wrapper `<falcon-angular-multi-select>`). The selection face renders inline chips, a searchable listbox panel, a tri-state "Select all" row, a "+N more" overflow pill, and a clear-all affordance. The Angular wrapper additionally carries a **second, display-only render mode** (`displayMode="chip-list"`) that draws a chip strip + "+N" button opening a WAI-ARIA dialog popover — `[CODE]` falcon-multi-select.component.html:12-97. It is the multi sibling of `<falcon-angular-dropdown>` (single-select).

## Business / UI use case

- **Templates "Shared with" cell + detail** — the ONLY live app consumers, and both use `displayMode="chip-list"` (display-only, never the picker) — `[CODE]` admin/mgmt templates-list.component.html:310-318, templates-details.component.html:120-126.
- Permission picker (multiple permissions per role) — `[BRAIN-OUT]` design intent; showcase-only today.
- Tag / multi-category / multi-region selection in filter panels — `[BRAIN-OUT]` design intent; showcase-only today.
- Any UI requiring multi-value selection from a closed, in-memory list of options.

## When to use it / when NOT to use it

**Use it for:**
- A display-only chip strip with a "+N more" overflow popover (today's dominant real use) → `displayMode="chip-list"`.
- Any multi-value picker where the option list is known up-front and fits in memory → default `displayMode="default"`.

**Do NOT use it for:**
- Single-select → `<falcon-angular-dropdown>`.
- Free-text-plus-options combo → `<falcon-angular-combobox>`.
- Hierarchical / tree-shaped multi-select → `<falcon-angular-tree>` / `<falcon-angular-tree-table>`.
- A simple list of independent checkboxes bound to an array → `<falcon-angular-checkbox-group>`.
- Very large catalogues (≫ ~200 options) — no virtualization (GAP G4).

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-multiSelect>`. Legacy `<falcon-multiselect>` (`libs/falcon/src/shared-ui/lib/components/falcon-multiselect/`) is deprecated — migrate to this. `[CODE]` the selection mode is feature-complete (search / tri-state select-all / chips / clear) but currently exercised in production only via the chip-list display mode.

## Replaces

- Legacy PrimeNG `<p-multiSelect>`.
- Legacy `<falcon-multiselect>` shared-ui component.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.html` |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-multi-select/falcon-multi-select.component.css` (block + width passthrough only) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-multi-select/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-multi-select/falcon-multi-select.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-multi-select/falcon-multi-select.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-multi-select-tw/falcon-multi-select-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-multi-select/falcon-multi-select.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-multi-select/falcon-multi-select.utils.ts` (shared by BOTH Stencil tags) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/multi-select-tailwind-classes.ts` (cross-framework SSOT) |
| Component token file | `libs/falcon-ui-tokens/src/components/multi-select.tokens.css` (~329 lines) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-multi-select` |
| Stencil Shadow tag | `<falcon-multi-select>` |
| Stencil Light tag | `<falcon-multi-select-tw>` |

## Known consumers (grep verified 2026-06-03)

Real app consumers — **4 files, all `displayMode="chip-list"`:**
- `apps/admin-console/src/app/features/templates-page/components/templates-list.component.html:310` — "Shared with" data-table cell (chip-list, `maxChipsVisible=1`, `popoverTitle`).
- `apps/admin-console/src/app/features/templates-page/components/templates-details/templates-details.component.html:120` — detail "Shared with" (chip-list, `readonly`, per-instance `[--falcon-multi-select-chip-row-gap:8px]` token override).
- `apps/management-console/src/app/features/templates-page/components/templates-list.component.html:315` — mgmt mirror.
- `apps/management-console/src/app/features/templates-page/components/templates-details/templates-details.component.html:120` — mgmt mirror.

Non-consumers / references:
- `apps/management-console/.../share-group-step.component.html` — comment-only reference; FLAG B-CG-2 explicitly says this step was re-skinned but NOT migrated to multi-select (`[CODE]` share-group-step.component.html:4).
- `libs/falcon-studio/src/lib/registry/gallery-defaults.ts` — Studio gallery showcase entry.
- `libs/falcon/src/shared-ui/lib/components/falcon-multiselect/*` — the LEGACY component (deprecated), not a consumer of this one.

## Related components

- Sibling specialist: `<falcon-angular-dropdown>` (single-select; shares the option shape + portal pattern + push-options race-guard).
- Composes a panel similar to `<falcon-angular-dropdown>` internally (same `popover-portal.ts` utilities).
- Legacy peer: `<falcon-multiselect>` (deprecated shared-ui).
- For independent boolean toggles use `<falcon-angular-checkbox-group>` instead.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Token contract lives in `libs/falcon-ui-tokens`. React + Vue twins auto-generated from the Stencil tags (`libs/falcon-ui-react/src/components.ts`, `libs/falcon-ui-vue/src/index.ts`).

## Verification
🟢 code-verified against `falcon-multi-select.component.{ts,html}` + `falcon-multi-select.tsx` + `falcon-multi-select-tw.tsx` (read 2026-06-03). Consumer list 🟢 grep-verified 2026-06-03 — corrected from the stale "3 (playground + legacy)" to the real 4 chip-list consumers.
