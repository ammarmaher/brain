---
type: adr
adr-id: ADR-001
title: Why Falcon library instead of PrimeNG
status: accepted
date: 2026-05-16
deciders: [Ammar Maher, Falcon Frontend Working Group]
supersedes: []
superseded-by: []
---

*** ADR-001 — Why Falcon ships its own component library instead of consuming PrimeNG ***
*** Status: accepted · Reversal severity: irreversible (PrimeNG fully removed) ***

# ADR-001 — Why Falcon library instead of PrimeNG

## Context

For most of its life the Falcon frontend consumed **PrimeNG** as its primary UI kit, plus **PrimeIcons** as the icon font, plus **`@primeuix/themes`** for the Aura preset that wired PrimeNG components into the Falcon brand colors. By early-2026 that stack was producing four compounding pains:

1. **Bundle weight.** `admin-console`'s `main.js` started the v3.1 revamp at **2,253 KB raw / 568 KB gzipped** ([MEMORY] `project_falcon_primeng_total_removal_complete.md:43-50`). PrimeNG's runtime — even with tree-shaking and lazy-loaded modules — kept a large share of that bundle live because most pages used at least one of `p-table`, `p-menu`, `p-dropdown`, `p-dialog`, or `p-multiselect`, and PrimeNG ships theme + animation + DOM-handler code together.

2. **Theming friction.** PrimeNG's design tokens did not match the Falcon design system. Getting Falcon's spacing/radius/color scales to apply consistently required `@primeuix/themes`' Aura preset plus a long chain of `::ng-deep` overrides per consumer. The handful of components that needed bespoke brand visuals (table row hover, dropdown option hover, focus halo) had to be re-skinned in every feature module.

3. **`::ng-deep` proliferation.** Because PrimeNG components own their own templates and CSS, any non-token tweak required piercing the component encapsulation. By Wave 0 the workspace contained hundreds of `::ng-deep` overrides — a non-shippable design system in itself, fragile across PrimeNG versions, and the canonical cause of regressions whenever PrimeNG was upgraded.

4. **Design-control gap.** Falcon's design vocabulary (tree-row pill, sticky-edge shadow, brand teal alpha rail, dual z-index ladder, dual font-family per-locale) does not exist in PrimeNG's vocabulary. Even after theming, PrimeNG components were *approximations* of the Falcon design — never exact. Pixel parity required template forks, which defeated the point of using a third-party library.

5. **Framework lock-in.** PrimeNG is Angular-only. The Falcon roadmap includes React and Vue consumers of the same component vocabulary (cross-framework playgrounds at `demos/angular-playground/` + planned React/Vue surfaces — see [BRAIN-OUT] `FOLDER_STRUCTURE_DEEP_DIVE.md` §1 lines 30-32 listing `falcon-ui-react`/`falcon-ui-vue` libs). PrimeNG cannot serve those consumers; we would need a parallel kit anyway.

## Decision

**Falcon ships its own component library** (`libs/falcon-ui-core/` — Stencil web components + Angular wrappers + Tailwind v4 token contract) **instead of consuming PrimeNG.** PrimeNG, PrimeIcons, and `@primeuix/themes` are physically uninstalled, blocked by ESLint, and replaced wave-by-wave with `<falcon-angular-*>` wrappers backed by Stencil Shadow + Light-DOM render paths against a Tailwind v4 `@theme` token SSOT.

## Alternatives considered

### A. Keep PrimeNG, fork its theme — **rejected**
Continue consuming PrimeNG; fork the Aura theme and maintain a Falcon-flavored variant. Rejected because:
- Forking the theme does not address the **bundle weight** (PrimeNG runtime is unchanged).
- Forking the theme does not address the **design-control gap** — PrimeNG component templates still don't expose the named parts Falcon needs (e.g. tree-row hover well, sticky-edge shadow).
- Forking the theme **does not unlock React/Vue** consumers.
- The `::ng-deep` debt remains; the maintenance surface only grows.

### B. Adopt Angular Material — **rejected**
Replace PrimeNG with `@angular/material`. Rejected because:
- Material's design vocabulary (Material Design 3) is **further** from Falcon's design vocabulary than PrimeNG was — re-theming cost would be higher, not lower.
- Material is also Angular-only — same framework-lock-in problem.
- Material's component coverage is narrower than PrimeNG's; we would still have to author bespoke components for the Falcon-specific cases (organization-hierarchy tree, insufficient-balance dialog, OTP-send-dialog, single-uploader, wizard).

### C. Adopt Material Web Components — **rejected**
Adopt Google's Material Web Components (framework-agnostic web components from `@material/web`). Rejected because:
- Solves framework-lock-in but **not** the design-control gap — Material's design vocabulary is wrong for Falcon.
- Token surface is fixed to Material's design tokens; cannot express Falcon's brand teal scale, dual font-family per-locale, alpha rail backgrounds, or 47-component-scoped token namespaces ([BRAIN-OUT] `TOKEN_TAXONOMY.md` §11, 47 per-component token files).
- Coverage gap is even worse than Angular Material — we would still author the Falcon-specific components and end up maintaining a library anyway.

### D. Thin wrapper over PrimeNG — **rejected**
Author `<falcon-*>` Angular components that internally render `<p-table>`, `<p-dropdown>`, etc., normalizing the API surface. Rejected because:
- **Still pays the full PrimeNG bundle cost.** Wrapping does not reduce the runtime; it adds a layer.
- Forces every Falcon component to be **at least as constrained as PrimeNG**'s component API. The "tree-row sticky-edge shadow" use case still has no native PrimeNG primitive.
- Defers the framework-lock-in problem rather than solving it.
- Indistinguishable maintenance burden from authoring our own components, with strictly more surface area (PrimeNG version drift + Falcon API drift, instead of just one).

### E. Author the Falcon library (chosen)
Three artefacts per component — Stencil Shadow (`<falcon-X>`) + Stencil Light/TW (`<falcon-X-tw>`) + Angular wrapper (`<falcon-angular-X>`) — plus one token contract (`libs/falcon-ui-tokens/src/components/X.tokens.css`). See [BRAIN-OUT] `01-CANONICAL_PATTERN.md` §1-§3 for the canonical doctrine.

## Consequences

### Positive

- **Bundle cut nearly in half on admin-console.** `main.js` went from **2,253 KB raw / 568 KB gzipped** (Wave 0 baseline) to **1,210 KB raw / 335 KB gzipped** at the end of PR-8 ([MEMORY] `project_falcon_primeng_total_removal_complete.md:43-50`). 7 npm packages physically uninstalled: `primeng@21.1.6`, `@primeuix/themes@2.0.3`, `primeicons@7.0.0`, plus 4 transitives (`@primeuix/motion`, `@primeuix/styled`, `@primeuix/styles`, `@primeuix/utils`) ([MEMORY] `project_falcon_primeng_total_removal_complete.md:19-24`).

- **Pixel-exact design control.** Every visual value flows through the canonical `@theme` block in `libs/falcon-theme/src/falcon-tailwind-tokens.css` (218 tokens — [BRAIN-OUT] `TOKEN_TAXONOMY.md` §1) plus 47 per-component token files in `libs/falcon-ui-tokens/src/components/` ([BRAIN-OUT] `TOKEN_TAXONOMY.md` §11). Tokens reach Shadow DOM via `var(--falcon-X-*)` AND Tailwind utilities via the v4 `@theme` auto-promotion — one declaration powers both render paths.

- **Framework portability.** Stencil's `dist-custom-elements` output target + `reactOutputTarget` + Vue proxy script emit React and Vue wrappers automatically ([BRAIN-OUT] `01-CANONICAL_PATTERN.md` §3 contract C5). `libs/falcon-ui-react/` and `libs/falcon-ui-vue/` exist as first-class libs ([BRAIN-OUT] `FOLDER_STRUCTURE_DEEP_DIVE.md` §1 lines 30-32). New components are React/Vue-consumable with zero extra work.

- **End of `::ng-deep`.** Falcon component visuals are entirely token-driven. The Tailwind variant inherits utilities from the host app's Tailwind layer; the Shadow variant scopes its CSS via `:where(falcon-X, falcon-X-tw, falcon-angular-X, .falcon-X, [data-falcon-X])` selectors ([BRAIN-OUT] `01-CANONICAL_PATTERN.md` §3 contract C7). No component template needs to be pierced.

- **ESLint-enforced one-way door.** The `no-restricted-imports` flat-block at `eslint.config.mjs:111-119` errors on `primeng`, `primeng/*`, `primeicons`, `primeicons/*`. Live-fire confirmed: 3 of 3 disallowed imports error ([MEMORY] `project_falcon_primeng_total_removal_complete.md:14-17`). The ladder of granular per-submodule blocks (`primeng/inputtext`, `primeng/table`, etc., at lines 76-104 of `eslint.config.mjs`) preserves the migration audit trail.

### Negative

- **Maintenance ownership.** Falcon now owns **50 distinct components** in `libs/falcon-ui-core/src/components/` (verified 2026-05-16), each authored as a paired Shadow + Tailwind variant (99 folders total). Every component carries 3 artefacts + 1 token file = 4 files minimum, plus an Angular wrapper. **Total maintained surface: ~250+ files in `libs/falcon-ui-core/`**, plus 47 component token files in `libs/falcon-ui-tokens/`, plus the canonical theme. This is a non-trivial standing engineering cost — Falcon is now a UI-library maintainer, not just a consumer.

- **Slower to ship new component categories.** Authoring a new component class (date-range-picker, color-picker, tree-grid) from scratch is multi-week. PrimeNG would have given us those for free. The trade-off: every new component lands aligned with the Falcon design vocabulary on day one, but day one comes later than it would have with a vendor library.

- **Three render paths to keep in sync.** Every component has Shadow + Light/TW + Angular wrapper. A bug or new prop must be replicated across all three (and tested in all three) — the canonical pattern at [BRAIN-OUT] `01-CANONICAL_PATTERN.md` §2 enforces this but the human cost remains.

- **Reinvention of solved problems.** Accessibility primitives (focus trap, scroll lock, ARIA listbox), DOM portaling, virtual scrolling, and keyboard navigation are non-trivial. PrimeNG had vetted implementations of all of these; Falcon now authors and maintains its own. The dual z-index ladder bug ([MEMORY] `project_zindex_calendar_portal_root_cause_fix.md` 2026-05-16) is the canonical example: a class of regression that wouldn't have existed if we stayed on a vendor library.

- **Tooling debt.** Storybook-equivalent gallery, visual regression baseline, a11y baseline must all be authored in-workspace (see `tools/visual-regression/` and `tools/gates/gate-09-a11y-baseline.mjs` for the current state).

### Trade-offs accepted

- We trade **breadth of vendor coverage** for **depth of design control**. Falcon ships fewer total components than PrimeNG offered, but every one matches the design system exactly.
- We trade **vendor-maintained accessibility** for **bespoke accessibility** that we own and can refine per-component. Verified WCAG conformance is a known standing program, not a free vendor inheritance.
- We trade **fast time-to-first-render of a new component** for **fast time-to-correct-design**. The first version of a new Falcon component takes longer to ship than `import { Component } from 'primeng/component'`, but it lands at the Falcon-correct visual and behavioral spec.
- We accept a **multi-month migration cost** (the 8-wave PR-1 through PR-8 program — [MEMORY] `project_falcon_primeng_total_removal_complete.md:25-35`) in exchange for an **irreversible bundle and design win.**

## Verification

This decision is verified live in the codebase as of 2026-05-16:

| Claim | Verification | Source |
|---|---|---|
| 0 `from 'primeng'` imports anywhere in `libs/` or `apps/` | `Grep "from ['\"]primeng" libs/**/*.ts apps/**/*.ts` → 0 matches | live grep, 2026-05-16 |
| 0 `from 'primeicons'` imports anywhere | `Grep "from ['\"]primeicons"` → 0 matches | live grep, 2026-05-16 |
| 0 `primeng` / `@primeuix/*` / `primeicons` entries in `package.json` | `Grep '"primeng"\|"@primeuix\|"primeicons"' package.json` → 0 matches | [CODE] `package.json` (lines 69-94 dependencies, 95-151 devDependencies) |
| 50 distinct Falcon Stencil components (99 folders incl. `-tw` variants) | `ls libs/falcon-ui-core/src/components/` → 99 entries; deduped by base name → 50 | live `ls`, 2026-05-16 |
| 47 per-component token files | `ls libs/falcon-ui-tokens/src/components/*.tokens.css` → 47 files | [BRAIN-OUT] `TOKEN_TAXONOMY.md` §11 |
| 218 tokens in canonical `@theme` block | `awk '/@theme \{/,/^\}/' falcon-tailwind-tokens.css \| grep -cE '^\s+--[a-z]'` → 218 | [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:15-367`; [CODE] `libs/falcon-theme/src/tokens.ts:4` (`Tokens: 218`) |
| ESLint `no-restricted-imports` blocks `primeng`, `primeng/*`, `primeicons`, `primeicons/*` | Live-fire test: 3 of 3 disallowed imports error | [MEMORY] `project_falcon_primeng_total_removal_complete.md:14-17`; [CODE] `eslint.config.mjs:107-128` |
| 122 `pi pi-*` icon classes replaced with vendored Falcon icon font | New: `libs/falcon-theme/src/styles/falcon-icons.css` + `falcon-icons.woff2`; 34 source files mass-renamed | [MEMORY] `project_falcon_primeng_total_removal_complete.md:37-41` |
| All 3 apps prod-build GREEN after removal | `nx build admin-console host-shell management-console --configuration=production` → all exit 0 | [MEMORY] `project_falcon_primeng_total_removal_complete.md:17` |
| admin-console bundle delta | 2,253 KB → 1,210 KB raw / 568 KB → 335 KB gz | [MEMORY] `project_falcon_primeng_total_removal_complete.md:43-50` |

Surviving textual references to `primeng` in the workspace (~46 files containing the substring) are intentional: migration-guard ESLint comments, type-rename audit notes (`FalconMenuItem` replaces `MenuItem from 'primeng/api'`), historical wave reports under `libs/falcon-ui-core/*.md`, and i18n strings. **Zero of these are actual imports** — confirmed by the targeted `from 'primeng'` grep above.

The brain skills tree has been independently purged of prescriptive PrimeNG guidance ([MEMORY] `project_brain_skills_primeng_purge.md`, 2026-05-11) so future sessions cannot regress the decision via stale skill content. The Tailwind-only stack rule is the standing replacement.

## Related

### Sibling ADRs

- [[ADR-002]] — Why Tailwind v4 instead of SCSS (the styling foundation that enabled the dual-render path)
- [[ADR-004]] — Why Stencil for shadow components (the cross-framework primitive)
- [[ADR-005]] — Why dual-render path (Shadow + Tailwind) (the render-path doctrine that lets one component serve both eager-style and utility-class consumers)
- [[ADR-007]] — Why Tailwind v4 `@theme` over `@config` (the token mechanism this ADR depends on)

### Rules

- `R-FE-001` — Tailwind utilities only (no SCSS, no `::ng-deep`, no component CSS outside Stencil Shadow `.css`) — the rule this ADR's stack enforces in templates
- `R-NOOR-*` — Noor Instructions rule book (Falcon Admin Console UI hygiene), automatically loaded via PreToolUse hook on every `*.html` / `*.ts` edit

### Source-of-truth references

- [BRAIN-OUT] `Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` — the three-artefacts doctrine
- [BRAIN-OUT] `Brain Outputs/understanding/frontend/architecture/TOKEN_TAXONOMY.md` — 218-token catalog + 47 component-scoped token files
- [BRAIN-OUT] `Brain SK/outputs/understanding/frontend/architecture/FOLDER_STRUCTURE_DEEP_DIVE.md` — `libs/falcon-ui-core/` structure
- [CODE] `eslint.config.mjs` — the `no-restricted-imports` flat-block that prevents reintroduction
- [CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css` — the canonical Tailwind v4 `@theme` SSOT
- [CODE] `libs/falcon-ui-core/src/components/` — the 50 component definitions

### Memory citations

- [MEMORY] `project_falcon_primeng_total_removal_complete.md` (2026-05-10) — the 8-wave program record, verification log, bundle deltas
- [MEMORY] `project_brain_skills_primeng_purge.md` (2026-05-11) — parallel brain-skills cleanup so guidance matches code
- [MEMORY] `feedback_falcon_custom_library_mandatory.md` (2026-05-15) — the standing rule that every UI task consults Falcon library first
- [MEMORY] `feedback_library_skeleton_app_api.md` (2026-05-15) — the library-skeleton-vs-app-API two-layer doctrine that the Falcon library doctrine depends on
- [MEMORY] `project_zindex_calendar_portal_root_cause_fix.md` (2026-05-16) — example of a regression class that materialised because we own the overlay layer ourselves

## Tags

#type/adr #frontend #design-system #falcon-ui-core #primeng-removed #bundle-win #tier-3
