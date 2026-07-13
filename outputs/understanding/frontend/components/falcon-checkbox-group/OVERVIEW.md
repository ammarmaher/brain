# falcon-checkbox-group — OVERVIEW

## Component purpose

Thin Angular layout + multi-binding wrapper that renders `<falcon-angular-checkbox>` instances in an `@for` and manages a `selectedValues` array, toggling individual entries when the user clicks any child. **The Angular component composes Angular children directly — it does NOT render a Stencil group tag** (a Stencil `<falcon-checkbox-group(-tw)>` pair exists, but only React/Vue/showcase use it; see the divergence note below). `[CODE]` falcon-checkbox-group.component.ts:31 (`imports: [FalconAngularCheckboxComponent]`), html:20-31 (Angular `@for` of children).

## Business / UI use case

- Permission / role lists with checkbox-per-row.
- Filter panels with toggle-list checkboxes.
- "Choose multiple from a known list" scenarios where chip-based multi-select is too heavy.

## When to use it / when NOT to use it

**Use it for:**
- Multi-value boolean selection rendered as inline / stacked checkboxes (not in a dropdown panel).
- Always-visible option lists ≤ ~12 entries.

**Do NOT use it for:**
- Long lists requiring filter / search → `<falcon-angular-multi-select>`.
- Mutually exclusive choice → `<falcon-angular-radio-group>`.
- Single boolean → `<falcon-angular-checkbox>`.

## Status

**ACTIVE / PREFERRED.** Pure Angular wrapper composing many `<falcon-angular-checkbox>` instances. No Stencil-shadow equivalent exists (intentional — the group is layout logic, not a visual primitive).

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-checkbox-group/falcon-checkbox-group.component.ts` |
| Angular HTML | `.../falcon-checkbox-group.component.html` |
| Tokens | `libs/falcon-ui-tokens/src/components/checkbox-group.tokens.css` |

| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-checkbox-group/falcon-checkbox-group.tsx` (NOT used by the Angular wrapper) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-checkbox-group/falcon-checkbox-group.css` (holds the `.falcon-checkbox-group-*` layout rules — scoped to that Shadow DOM only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-checkbox-group-tw/falcon-checkbox-group-tw.tsx` (NOT used by the Angular wrapper) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/checkbox-group-tailwind-classes.ts` (13 lines — just an orientation flex helper) |

> **Stencil-pair divergence (verified 2026-06-03):** the Angular wrapper renders `<falcon-angular-checkbox>` children directly and does NOT render the Stencil group. The self-contained Stencil `<falcon-checkbox-group(-tw)>` is a *different* implementation: it parses a JSON-string `selectedValues`, renders **raw native `<input type=checkbox>`** rows (NOT `<falcon-checkbox>`), and emits `falcon-checkbox-group-change`. It exists for React/Vue/Studio-gallery parity. The wrapper still calls `defineFalconTwComponent('falcon-checkbox-group')` in `ngOnInit` (ts:117-119) — a harmless registration of a tag it never renders (GAP G9).

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-checkbox-group` |
| Stencil Shadow | `<falcon-checkbox-group>` |
| Stencil Light | `<falcon-checkbox-group-tw>` |

## Known consumers (grep verified 2026-06-03)

- **0 real app consumers.** `[CODE]` grep `<falcon-angular-checkbox-group` across `apps/` returned no matches; the only references are `libs/falcon-studio/src/lib/registry/gallery-defaults.ts` (Studio gallery showcase) + the component's own barrel/source. Permission selectors / settings / filters are the *design intent* (`[BRAIN-OUT]`), but no production page wires it yet — real grouped-checkbox use today is hand-rolled (e.g. the wallet allocation table loops `<falcon-angular-checkbox>` directly rather than using this group).

## Related components

- Composes `<falcon-angular-checkbox>` (via the `checkedInput` CVA-bypass + `(valueChange)`).
- Alternative: `<falcon-angular-multi-select>` for dropdown-style multi (chips + panel).
- Self-contained Stencil twin: `<falcon-checkbox-group(-tw)>` (React/Vue/Studio only — not the Angular path).

## Ownership / responsibility

`libs/falcon-ui-core`. The Angular wrapper is the Angular code path; React + Vue use the Stencil twin (auto-generated: `libs/falcon-ui-react/src/components.ts:351`, `libs/falcon-ui-vue/src/index.ts:264`).

## Verification
🟢 code-verified against `falcon-checkbox-group.component.{ts,html}` + the Stencil tags (read 2026-06-03). Consumer count corrected 1→0 (grep-verified — showcase-only). Stencil-pair divergence (Angular composes children; Stencil twin uses raw `<input>` + JSON `selectedValues`) 🟢 confirmed.
