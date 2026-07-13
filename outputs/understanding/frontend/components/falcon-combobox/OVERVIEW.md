# falcon-combobox — OVERVIEW

> Sweep-refreshed 2026-06-03 (B04). Verified against live source; corrected the debounce, methods, and panel-portaling facts vs the prior dossier.

## Component purpose

Free-text-plus-suggestions combobox (WAI-ARIA combobox pattern). Users type free text (if `allowFreeText`) or pick from filtered suggestions. Distinguished from `<falcon-angular-dropdown>` (closed list, no free text) and `<falcon-angular-multi-select>` (multi-value). Same dual-render Stencil pattern (Shadow `<falcon-combobox>` + Light-DOM `<falcon-combobox-tw>` + Angular CVA wrapper `<falcon-angular-combobox>`).

`[CODE]` Wrapper class: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-combobox/falcon-combobox.component.ts:60` (`FalconAngularComboboxComponent`).

## Business / UI use case

- "Choose or create" patterns (e.g. a tag picker that supports new-tag entry via `allowFreeText`).
- Search-and-pick fields where the canonical list is large but the user may know an exact value.
- Address / company / contact pickers that fall back to free-text when no match.

> `[CODE]` Note: as of 2026-06-03 the combobox has **ZERO real app consumers** (grep below) — these are intended use-cases, not observed ones.

## When to use it / when NOT to use it

**Use it for:**
- Free-text combo with autocomplete suggestions.
- "Pick or type-new" workflows (recreate the legacy `creatable: true` pattern).

**Do NOT use it for:**
- Pure single-select from a closed list → `<falcon-angular-dropdown>`.
- Multi-select → `<falcon-angular-multi-select>`.
- Plain search → `<falcon-angular-search-input>`.
- Any form field that needs an inline error/helper/required marker today → the combobox wrapper does NOT render helper/error/required (GAP G1/G2/G4); use a different control or wrap in `<falcon-form-field>`.

## Status

**ACTIVE (library) / UNADOPTED (apps).** `[CODE]` Wave 9.H added the Stencil pair + Angular wrapper. Newer than dropdown/multi-select. **0 real consumers** (grep 2026-06-03) — showcase/playground-only.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-combobox/falcon-combobox.component.ts` (271 lines) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-combobox/falcon-combobox.component.html` (47 lines — tag-switcher) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-combobox/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-combobox/falcon-combobox.tsx` (322 lines) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-combobox/falcon-combobox.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-combobox-tw/falcon-combobox-tw.tsx` (300 lines) |
| Types | `libs/falcon-ui-core/src/components/falcon-combobox/falcon-combobox.types.ts` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/combobox-tailwind-classes.ts` (141 lines) |
| Component token file | `libs/falcon-ui-tokens/src/components/combobox.tokens.css` (152 lines) |

> `[CODE]` There is **no `falcon-combobox.component.css`** (the wrapper sets no `styleUrl`), **no `falcon-combobox.utils.ts`**, and **no `-tw` CSS file** (the `-tw` Stencil component has no `styleUrl`) — Glob 2026-06-03. No `*.spec.ts` located.

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-combobox` |
| Stencil Shadow tag | `<falcon-combobox>` (`shadow:true`) |
| Stencil Light tag | `<falcon-combobox-tw>` (`shadow:false`) |

## Known consumers (grep-verified 2026-06-03)

`[CODE]` `Grep "falcon-angular-combobox"` across the repo returned **4 files**, ALL library-internal:
- `libs/falcon-ui-core/.../falcon-combobox/falcon-combobox.component.ts` (the wrapper itself)
- `libs/falcon-ui-core/.../falcon-combobox/index.ts` (barrel)
- `libs/falcon-ui-core/SPEC-LOCK.md` (spec doc)
- `libs/falcon-ui-tokens/src/components/combobox.tokens.css` (token comment)

→ **0 app consumers.** No `apps/` file uses `<falcon-angular-combobox>` or the bare `<falcon-combobox(-tw)>` tags.

## Related components

- Siblings: `<falcon-angular-dropdown>` (closed list), `<falcon-angular-multi-select>` (multi), `<falcon-angular-search-input>` (pure search).
- Composes a single text input + a body-of-suggestions panel internally (no sub-component reuse of the dropdown panel).

## Ownership

`libs/falcon-ui-core` (cross-framework).

## Verification
🟢 code-verified against `falcon-combobox.component.{ts,html}` + `falcon-combobox.tsx` + `falcon-combobox-tw.tsx` + `combobox.tokens.css` + `combobox-tailwind-classes.ts` (read 2026-06-03). Consumer count 🟢 grep-verified 2026-06-03 (0 app consumers).
