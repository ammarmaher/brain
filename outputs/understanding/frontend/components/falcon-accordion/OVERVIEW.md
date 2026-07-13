# falcon-accordion — OVERVIEW

## Component purpose
Token-driven, **config-array-driven** accordion control with two expansion modes (`single` — only one item open at a time; `multiple` — any number can be open). Items are supplied as a `FalconAccordionItem[]` array (NOT projected as child components); per-item body content is projected through **named slots `content-<value>`**. Per-item label / description / icon / disabled state. Keyboard navigation (Arrow Up/Down, Home, End). ARIA-correct `region` / `button` pairing. Dual-render (Shadow `<falcon-accordion>` + Light `<falcon-accordion-tw>`) like the rest of `libs/falcon-ui-core`.

## Business / UI use case
- FAQ sections.
- Stepped settings (progressive disclosure).
- Multi-section forms with collapsible groups (compose with `<falcon-angular-input>` etc. in panel content via the `content-<value>` slot).
- Lists of dense sections where collapse helps scanning.

## When to use it
- Long content broken into independently expandable sections.
- When `mode="multiple"` is desired (independent collapse vs. single-active).
- When keyboard navigation between section headers is important.

## When NOT to use it
- For navigation tabs — use `<falcon-angular-tabs>`.
- For tree-structured content — use `<falcon-angular-tree>`.
- For single-section disclosures — a `<falcon-angular-card>` or a custom toggle is lighter (the accordion forces the items-array + slot-naming model).

## Active / preferred / deprecated / legacy status
**ACTIVE — but UNADOPTED.** Production-grade. Replaces PrimeNG `<p-accordion>`. `[CODE]` grep 2026-06-03 → **0 consumers** in `apps/` or `libs/falcon/` (only showcase/registry/docs references). Under-leveraged primitive.

## Replaces
- PrimeNG `<p-accordion>` + `<p-accordionTab>` (Wave PR-8).

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-accordion/falcon-accordion.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-accordion/falcon-accordion.component.html` |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-accordion/falcon-accordion.component.css` (`:host { display:block; width:100% }` only — no paint) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-accordion/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-accordion/falcon-accordion.tsx` (235 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-accordion/falcon-accordion.css` (239 ln; token-only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-accordion-tw/falcon-accordion-tw.tsx` (238 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-accordion/falcon-accordion.types.ts` |
| Utils (shared by both render paths) | `libs/falcon-ui-core/src/components/falcon-accordion/falcon-accordion.utils.ts` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/accordion-tailwind-classes.ts` (consumed only by the `-tw` twin) |
| Token file | `libs/falcon-ui-tokens/src/components/accordion.tokens.css` (139 ln; `:where()`-scoped, gate-12 compliant) |
| Spec/e2e | **None** — no `*accordion*.spec.ts` / `.e2e.ts` on any layer (`[CODE]` listing 2026-06-03). |

## Selectors / tags
- Angular: `<falcon-angular-accordion>`
- Stencil Shadow: `<falcon-accordion>`
- Stencil Light: `<falcon-accordion-tw>` (default — `useTailwind=true`)

## Known consumers (grep verified 2026-06-03)
`[CODE]` `<falcon-angular-accordion` across `apps/` = **0 files**; across `libs/falcon/` = **0 files**. The only matches for `falcon-accordion` are non-render: `apps/host-shell/.../falcon-ui-showcase/showcase-data/registry.ts`, `.../gallery/showcase-variant-tile.component.ts`, `apps/host-shell/src/assets/component-docs/accordion.md`, and the two app `tailwind.css` safelist files. See `USAGE.md` Consumer Sweep.

## Related components
- `falcon-angular-tabs` — alternative for switching between mutually-exclusive sections.
- `falcon-angular-tree` — alternative for tree-structured collapse.
- `falcon-angular-card` — alternative for non-collapsible section containers.

## Ownership / responsibility
`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI Core. Token contract lives in `libs/falcon-ui-tokens`. Production-ready but unused — adoption would benefit from a few quality-of-life inputs (see GAPS_AND_UPGRADES.md).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13 sweep). Source-file table re-confirmed on disk; the `-tw` Light twin verified to EXIST (`falcon-accordion-tw/falcon-accordion-tw.tsx`, registered in `define-falcon-tw-component.ts:28`) — the prior dossier listed it but mis-stated adoption. Consumer count re-confirmed **0** (prior dossier was right; Wave-7 "1" was stale).
