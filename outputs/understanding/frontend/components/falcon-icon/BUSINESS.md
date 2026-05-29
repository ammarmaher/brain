# falcon-icon — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[CODE]` falcon-icon.tsx:1-4 — falcon-icon is a **thin, presentational wrapper around the vendored Falcon icon font**. In product terms it is the platform's *single, standardised way to render a glyph* — so that "delete", "edit", "warning", "chevron" look and size identically everywhere, with a correct accessibility posture. It carries **no business logic** and **no `BR-*` rule**.

`[INFERRED]` Its business value is *design-system consistency*: an icon is a tiny piece of visual vocabulary, and the component exists so that vocabulary is centralised — not re-picked per consumer.

## The central icon-font registry contract
`[CODE]` falcon-icon.tsx:14-16,34-35 — falcon-icon is the **consumer of a central registry**: it renders `<i class="falcon-icon falcon-icon-{name}">`, and the `{name}` must resolve to a glyph defined in the vendored font CSS. The registry is a single global stylesheet:
- `[CODE]` `libs/falcon-theme/src/styles/falcon-icons.css` — the registry file. Verified present: **386 lines, ~322 `falcon-icon-*` class declarations.**
- `[CODE]` `libs/falcon-theme/src/assets/fonts/falcon-icons/` — the font asset. Verified present.

**The contract:** an icon name is *only* valid if `.falcon-icon-{name}` exists in `falcon-icons.css`. There is no TypeScript union, no runtime check — `[CODE]` falcon-icon.tsx:34-40 renders the class unconditionally. An unknown name produces an **empty `<i>`** (`[BRAIN-OUT]` GAPS_AND_UPGRADES.md notes this). Adding a new icon is a *registry change* — the font asset + `falcon-icons.css` must be regenerated; it is **not** a per-component change.

`[CODE-DERIVED CORRECTION]` `[BRAIN-OUT]` OVERVIEW.md:23 + API.md:59 state "**122 icons** migrated from PrimeIcons". The live `falcon-icons.css` carries **~322 icon-class declarations** — substantially more than 122. The "122" figure is stale (it likely reflects the PrimeIcons-migration subset, not the full current font). For any "is icon X available?" question, **read `falcon-icons.css` directly** — it is the live registry; the dossier count is not. *(Old dossier files left unedited per task rule; correction recorded here.)*

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| (none direct) | — | Icon is presentational — it renders a glyph, it enforces nothing. |
| `[INFERRED]` Design-system icon consistency | `[CODE]` falcon-icon.tsx:2-3 | Source comment: the component exists "so consumers stop writing raw `<i class="falcon-icon falcon-icon-X">`" — i.e. it *is* the consistency rule made into a component. |

## Business constraints baked in
- `[CODE]` falcon-icon.tsx:21-23 — **`decorative` defaults to `true`** → the icon gets `aria-hidden="true"` and no role. Business meaning: *most* icons (inside buttons, menus, tabs) are decoration — the surrounding control already carries the label. Setting `decorative=false` is a deliberate statement that *this icon is the only thing conveying the meaning* and therefore needs a `label`.
- `[CODE]` falcon-icon.tsx:28-31 — **`decorative=false` requires `label`** for the icon to be announced (`role="img"` + `aria-label`). If `decorative=false` is set without a `label`, `[CODE]` :30 leaves `aria-label` `undefined` — a meaningful icon silently un-announced.
- `[CODE]` falcon-icon.tsx:15 — **`name` is required** (`@Prop() name!: string`). No name → empty `<i>`.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[CODE]` `apps/host-shell/src/app/layout/layout.component.html` | host-shell layout | `[BRAIN-OUT]` OVERVIEW.md:47 — direct `<falcon-angular-icon>` use. |
| `[INFERRED]` Inside every Falcon control | platform-wide | buttons, menus, accordions, tabs, badges, empty-states, form-field hints — all carry icons. Note: most still use the **raw `<i class="falcon-icon …">` class**, not this wrapper. |
| `[INFERRED]` Avatar / empty-state fallback glyph | org-hierarchy, list pages | `falcon-avatar` and `falcon-empty-state` compose an icon as their fallback / illustration. |

`[BRAIN-OUT]` GAPS_AND_UPGRADES.md:5-15 (P0) — **the icon FONT is everywhere; the `<falcon-angular-icon>` WRAPPER is barely adopted.** Most consumers write the bare `<i class="falcon-icon falcon-icon-X">` directly, bypassing the size + a11y standardisation. Migrating to the wrapper is a design-system-enforcement task.

## Business gotchas
- `[CODE]` falcon-icon.tsx:34-35 — an icon name is **not validated**. A typo or a not-yet-vendored glyph renders an empty `<i>` — silent. Treat a missing icon as a *registry / typo* issue, never a backend gap.
- `[INFERRED]` Icon *meaning* is a product decision the component cannot police — using `falcon-icon-trash` for an "archive" action is a semantic mismatch the component will happily render. The registry standardises *appearance*, not *correct usage*.
- `[CODE]` falcon-icon.tsx — colour inherits from the parent (`currentColor`); the icon has no `color` input (`[BRAIN-OUT]` GAPS_AND_UPGRADES.md:35-39 — a shorthand is a proposed gap). To colour an icon, colour the parent.

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-icon.tsx + falcon-icon.component.ts + falcon-icons.css (registry verified: ~322 declarations). No `BR-*` rule binds this presentational primitive. The "122 icons" figure is a ✅ VERIFIED stale-count correction (live registry has ~322) — recorded here, old 6 files unedited.
