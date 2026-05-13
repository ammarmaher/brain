# falcon-accordion — OVERVIEW

## Component purpose
Token-driven accordion control with two expansion modes (`single` — only one item open at a time; `multiple` — any number can be open). Per-item label / description / icon / disabled state. Keyboard navigation (Arrow Up/Down, Home, End). ARIA-correct `region`/`button` pairing.

## Business / UI use case
- FAQ sections.
- Stepped settings (progressive disclosure).
- Multi-section forms with collapsible groups (compose with `<falcon-angular-input>` etc. in panel content).
- Lists of dense sections where collapse helps scanning.

## When to use it
- Long content broken into independently expandable sections.
- When `mode="multiple"` is desired (independent collapse vs. single-active).
- When keyboard navigation between section headers is important.

## When NOT to use it
- For navigation tabs — use `<falcon-angular-tabs>`.
- For tree-structured content — use `<falcon-angular-tree>`.
- For single-section disclosures — use a `<details>` element or build a custom toggle.

## Active / preferred / deprecated / legacy status
**ACTIVE.** Production-grade. Replaces PrimeNG `<p-accordion>`.

## Replaces
- PrimeNG `<p-accordion>` + `<p-accordionTab>` (Wave PR-8).

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-accordion/falcon-accordion.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-accordion/falcon-accordion.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-accordion/falcon-accordion.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-accordion/falcon-accordion.types.ts` |
| Stencil Shadow utils | `libs/falcon-ui-core/src/components/falcon-accordion/falcon-accordion.utils.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-accordion-tw/falcon-accordion-tw.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/accordion.tokens.css` |

## Selectors / tags
- Angular: `<falcon-angular-accordion>`
- Stencil Shadow: `<falcon-accordion>`
- Stencil Light: `<falcon-accordion-tw>`

## Known consumers
**Zero matches in `apps/`.** Component is exported but not adopted in production. Under-leveraged primitive.

## Related components
- `falcon-angular-tabs` — alternative for switching between sections.
- `falcon-angular-tree` — alternative for tree-structured collapse.
- `falcon-angular-card` — alternative for non-collapsible section containers.

## Ownership / responsibility
Owned by Falcon UI Core. Production-ready but unused — adoption would benefit from a few quality-of-life inputs (see GAPS).
