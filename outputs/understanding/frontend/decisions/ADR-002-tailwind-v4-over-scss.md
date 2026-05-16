---
type: adr
adr-id: ADR-002
title: Why Tailwind v4 instead of SCSS
status: accepted
date: 2026-05-16
deciders: [Ammar, Jakco, Brain]
supersedes: []
superseded-by: []
---

*** ADR-002 — Why Tailwind v4 (and its `@theme` SSOT) instead of SCSS ***
*** Status: accepted — high-cost reversal ***
*** Foundation: ADR-001 (PrimeNG removal) + V0.2 theme adoption ***

# ADR-002 — Why Tailwind v4 instead of SCSS

## Context

Before this decision, every Angular component in the three Falcon apps (`admin-console`, `host-shell`, `management-console`) shipped its own side-car SCSS file referenced via `styleUrls: ['./foo.component.scss']`, plus a global `theme.scss`, plus generous `::ng-deep` blocks to reach into PrimeNG's component trees. The pattern looked normal — it is what `nx g component` generates — but in practice it produced four sustained pains:

1. **Dead-code bloat.** Each component carried 20–200 lines of SCSS that the template no longer used. There was no purge step: SCSS shipped whatever the file contained, and nothing told a refactor to delete the now-orphan rules.
2. **Theming drift.** The V0.2 palette landed in May 2026 (`memory/feedback_v02_theme_adopted.md`) and was meant to be the single source of truth. But component SCSS files duplicated values — `#16a34a` here, `12px` there, `rgba(13, 63, 68, 0.18)` again — and a token swap in the theme file no longer cascaded.
3. **`::ng-deep` escape hatch.** PrimeNG components could only be re-themed by piercing Angular's view encapsulation. Once `::ng-deep` was open, the door stayed open: shared selectors leaked across components and broke encapsulation guarantees in unpredictable ways. The overnight slow audit caught 2 surviving `::ng-deep` files in `libs/falcon/shared-ui` even after the PrimeNG removal (`PATTERN-04-scss-file-to-tailwind.md` blocker registry, `falcon-multiselect`, `falcon-tree-panel`).
4. **SCSS variable vocabulary is not portable.** `$brand-teal: #124c52;` is a SCSS-compile-time symbol — it cannot be read by the React or Vue cross-framework demos (`memory/project_falcon_ui_cross_framework_demos.md`), it cannot be swapped at runtime by the Theme Studio (`memory/feedback_shadow_is_token_ssot.md`), and it cannot be referenced by a Stencil Shadow DOM component that does not run through the SCSS compiler.

The morning of 2026-05-16 the slow `audit-orchestrator.ps1` final pass quantified the debt: **44 R-FE-002 violations remained** workspace-wide (component-bound `.scss` files plus non-empty `styles:` arrays in `@Component` decorators) — see `NEW_FINDINGS_FROM_SLOW_AUDIT.md` "Structural walker — 66 new violations" table. Of those, **13 files were classified as load-bearing blockers** by Ammar Web-Platform-UI's PATTERN-04 sweep (`ACTUAL_RESULTS_AND_LEARNINGS.md` line 70+, registry at `apps/.../scratch/PATTERN-04-blockers.md`): SCSS-only syntax (`$variables`), vendor pseudo-elements (`::-webkit-scrollbar`), `::ng-deep` cross-encapsulation reach, `@keyframes`, `:host(.modifier)` selectors, and domain CSS variables (`--login-*`, `--cp-*`, `--fpf-*`) that the theme curator has not promoted yet.

## Decision

**Tailwind v4 utility classes on Angular templates only.** The `@theme` block in `libs/falcon-theme/src/falcon-tailwind-tokens.css` is the single source of truth for every reusable visual token in the workspace — **218 tokens** total across colors, typography, sizing, spacing, radii, shadows, breakpoints, motion, tracking, and z-index ladder (`TOKEN_TAXONOMY.md` §1, table).

The contract:

1. **No component-level SCSS, ever.** `R-FE-002` bans `.scss`, `.sass`, `.less` files anywhere under `apps/` or `libs/` outside two exempt paths (`libs/falcon-ui-core/**` and `libs/falcon-theme/**`).
2. **No `styleUrls` / `styles` arrays.** `@Component({ styleUrls: [...] })` and `@Component({ styles: [...] })` are forbidden — both are SCSS by another name (`R-FE-002` AST/regex pass).
3. **No inline styles.** No `style="..."`, no `[style]`, no `[ngStyle]`, no `Renderer2.setStyle`, no `nativeElement.style.*` (`R-FE-003`, five-pattern regex).
4. **Tailwind utility classes on templates only.** Each utility expands to `var(--token-name)` via Tailwind v4's mechanical namespace promotion: `--color-*` → `bg-*`/`text-*`/`border-*`/`ring-*`/`outline-*`, `--spacing-*` → `p-*`/`m-*`/`gap-*`/`w-*`/`h-*`/`inset-*`, `--text-*` → font-size+line-height pair, `--radius-*` → `rounded-*`, `--shadow-*` → `shadow-*`, etc. (`TOKEN_TAXONOMY.md` §2).
5. **Per-component scoped tokens** live in companion `*.tokens.css` files at `libs/falcon-ui-tokens/src/components/<name>.tokens.css` (47 files) and are imported into the canonical theme. The Stencil Shadow variant and the Tailwind Light variant of each Falcon UI Core component read **the same** `--falcon-<name>-*` chain (`memory/feedback_shadow_is_token_ssot.md`).

The mechanism is Tailwind v4's native CSS-first config — *not* a PostCSS plugin, *not* an `@config`-driven theme map. The single `@config "../../../tailwind.config.js"` import at `falcon-tailwind-tokens.css:8` is a v3→v4 bridge that re-enables `important: true` so utilities outrank legacy `::ng-deep` overrides; it does not define tokens.

## Alternatives considered

| Option | Verdict | Why rejected |
|---|---|---|
| **Keep SCSS, formalize the variable vocabulary** (`$brand-teal`, `$space-md`, etc., enforced by a lint rule) | rejected | Does not solve the deeper problems. `::ng-deep` is still required to re-theme third-party components. SCSS `$vars` are compile-time symbols invisible to Stencil Shadow DOM, the React/Vue demos, and the runtime Theme Studio. Drift discipline returns to "code review caught it" — the same posture that produced the 44 R-FE-002 violations in the first place. |
| **Adopt CSS Modules** (per-component scoped class names, opt-in import) | rejected | Angular's component-style encapsulation already provides exactly this isolation via emulated Shadow DOM and the `_ngcontent-*` attribute selectors. CSS Modules layered on top is duplication — and it still leaves the SCSS-vs-token problem unsolved at the value layer. |
| **Adopt styled-components / Emotion** (CSS-in-JS) | rejected | Runtime cost (parser + style-injection on every render) directly conflicts with the post-PrimeNG bundle wins documented in `memory/project_falcon_revamp_v3_1_night_shift_results.md` (admin-console −33% raw / −42% gz; host-shell −55% raw / −56% gz). Tight framework lock-in: a styled-components stylesheet cannot be consumed by the Stencil Shadow DOM render path or by the cross-framework React/Vue demos without a parallel implementation. |
| **Tailwind v3 with `@config { theme: { extend: { ... } } }`** | rejected | The `@config`-driven theme map duplicates the same CSS custom properties twice (once in the JS config, once for Stencil to consume) and makes runtime token swaps brittle. The `@theme` block in v4 is plain CSS and dual-consumable — see ADR-007 for that decision in detail. |
| **No styling layer — raw CSS files only, no preprocessor** | rejected | Solves the SCSS problem but provides no token-to-utility mechanical bridge. Engineers would still hand-roll class names against hand-rolled custom properties, with no purge step and no shared vocabulary. |

## Consequences

### Positive

- **Zero `::ng-deep` in app code.** The escape hatch closes because there is no third-party component tree to pierce — Falcon UI Core owns its own primitives via Shadow DOM (ADR-004), and the rest of the app is plain HTML wearing Tailwind utility classes that already cascade correctly.
- **Theme portability across framework demos.** The `@theme` block is plain CSS. Stencil Shadow DOM components read `var(--color-falcon-teal-700)` directly; the React playground at port 5173 and the Vue playground at port 5174 consume the same import (`memory/project_falcon_ui_cross_framework_demos.md`). A future Theme Studio can mutate one token and see every render path update simultaneously (`memory/feedback_shadow_is_token_ssot.md`).
- **Fewer files per component.** Most Angular components now ship as `<name>.component.ts` + `<name>.component.html` — the SCSS sidecar is gone. Saturday's PATTERN-04 sweep deleted 5 files outright (`MORNING_EXECUTION_LOG.md` Item 4; `ACTUAL_RESULTS_AND_LEARNINGS.md` table).
- **Tailwind purge keeps bundles small.** The post-revamp bundles (`memory/project_falcon_revamp_v3_1_night_shift_results.md`) cite host-shell at **2.82 MB raw / 0.59 MB gz** — down from 6.30 MB / 1.34 MB at Wave 0. Tailwind's content-aware purge is part of what makes that number reproducible: utilities used nowhere don't ship.
- **One vocabulary, one grep.** 218 tokens in one file means every reviewable design value has exactly one search target. The pre-finish grep gate (`memory/feedback_no_inline_styles_tokens_only.md`) enforces this across 4 skill files.

### Negative

- **Some load-bearing CSS cannot migrate.** The PATTERN-04 sweep deliberately preserved 13 files because their styling cannot be expressed as Tailwind utilities without a theme-curator pass first. Five blocker categories:
  - **SCSS `$variables`** (7 files — host-shell auth flow, dashboard) — SCSS-only compile-time syntax. Theme curator must promote to CSS custom properties first.
  - **`::-webkit-scrollbar` pseudo-elements** (2 files — layout, falcon-tree-panel) — Tailwind has no variant for vendor pseudo-elements.
  - **`::ng-deep` deep selectors** (2 files — falcon-multiselect, falcon-tree-panel) — utility classes cannot pierce component encapsulation; the components themselves need to expose styling slots.
  - **`@keyframes` animations** (3 files — enter-otp, falcon-tree-node, falcon-stepper) — no utility class can define a keyframe rule. Keyframes must move to the canonical theme as named animations, then `animate-*` utility classes consume them.
  - **`:host(.modifier)` selectors** (1 file — falcon-photo-uploader drag-over) — host modifiers cannot live on the template; the component class itself needs a different orchestration pattern.
  - **`--login-*` / `--cp-*` / `--fpf-*` domain CSS vars** (4 files — auth flow) — defined per-feature, theme curator must promote into the canonical scale or accept them as feature-local exemptions.

- **Tailwind v4 is young.** The `@theme` directive shipped in v4.0 (early 2025) and the ecosystem (linters, editor plugins, language servers) is still catching up. The Falcon workspace pays this cost in occasional rough edges around editor IntelliSense and PostCSS integration (`memory/project_brain_skills_primeng_purge.md`).
- **Utility-class density on templates.** A complex layout line can be 8–12 utility classes long. Tailwind's `@apply` is forbidden (`memory/feedback_no_inline_styles_tokens_only.md` pre-finish grep includes `@apply`), so the templates carry the full vocabulary. Readability is a tradeoff accepted.

### Trade-offs accepted

- **Engineering discipline must enforce token-only.** Tailwind v4 will happily accept `bg-[#fff]` arbitrary values without complaint — the pre-finish grep gate (R-FE-004) is what catches them. The rule lives outside the compiler; the gate is the enforcement.
- **The 13 load-bearing blockers are not "violations to silence" — they are "decisions to make later."** They sit in `apps/.../scratch/PATTERN-04-blockers.md` as a theme-curator backlog (D-2026-05-16-08 in the Decisions Queue), not as exemptions in `EXEMPTIONS.md`.
- **A reversal would cost weeks.** Re-introducing SCSS would mean: re-deriving all 218 tokens as `$variables`, rewriting every utility-class template back into selectors, restoring per-component sidecar files, accepting the return of `::ng-deep`, and breaking the Stencil Shadow DOM contract (ADR-004) and the cross-framework demo wiring (ADR-005). Hence the "high-cost reversal" classification in `README.md`.

## Verification

The decision is in active enforcement and the audit signal is live:

- **35 R-FE-002 violations remain** (down from 44 caught by the morning's slow audit). The PATTERN-04 sweep landed 9 — five SCSS files deleted outright, four `styles:` arrays emptied — see `ACTUAL_RESULTS_AND_LEARNINGS.md` per-rule delta table. Of the surviving 35, 13 are the documented blockers above; the remainder are scheduled for the theme-curator pass.
- **218 `@theme` tokens** drive every utility class in the workspace. The auto-generated `libs/falcon-theme/src/tokens.ts` header confirms the count (`TOKEN_TAXONOMY.md:43` "TOTAL declared 218"). Every token is dual-consumable: Tailwind utility class on templates + `var(--token)` from Stencil Shadow DOM CSS.
- **PATTERN-04 playbook proven.** The pattern at `patterns/PATTERN-04-scss-file-to-tailwind.md` describes the canonical SCSS→Tailwind translation. The morning sweep applied it successfully to 5 files (topbar, sidebar, not-found, falcon-form-field, falcon-mobile-number — all 3 apps green build at every step). The "high risk" files flagged in the pattern (layout, sidebar, topbar) were migrated with no regressions.
- **Pre-finish grep gate enforces "no SCSS, no inline" across 4 skill files** (`memory/feedback_no_inline_styles_tokens_only.md` "How to apply" list). The gate searches for: `style=`, `[style]`, `[ngStyle]`, `#[0-9a-f]{3,8}`, `rgb(`, `rgba(`, `hsl(`, Tailwind arbitrary values with literals, Tailwind default palette names, `!important`, `::ng-deep`, `@apply`, `@media prefers-color-scheme`, and hardcoded border/radius/shadow.
- **Detector strategy is structural + regex** (`R-FE-002` rule frontmatter). Phase 1: file-existence sweep across `apps/**/*.{scss,sass,less}` and `libs/**/*.{scss,sass,less}` minus exempt paths. Phase 2: AST/regex pass over every `*.ts` file with an `@Component` decorator, capturing non-empty `styleUrls` and `styles`.
- **Bundle deltas attributable in part to this decision** (`memory/project_falcon_revamp_v3_1_night_shift_results.md`): admin-console −33% raw / −42% gz, host-shell −55% / −56%, management-console −33% / −42%. The combined effect of PrimeNG removal (ADR-001) + Tailwind purge + zoneless change detection.
- **The canonical SSOT file exists and is readable.** `C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon-theme\src\falcon-tailwind-tokens.css` opens with `@import "tailwindcss"`, then `@config "../../../tailwind.config.js"` (the v3→v4 bridge for `important: true`), then `@theme { ... }` containing every token.

## Related

- [[ADR-001]] — Why Falcon library instead of PrimeNG (this ADR is its structural sibling: PrimeNG removal opened the door for utility-first; SCSS removal walks through it)
- [[ADR-005]] — Why dual-render path (Shadow + Tailwind) — depends on a framework-portable styling layer, which is what this ADR delivers
- [[ADR-007]] — Why Tailwind v4 `@theme` over `@config` — the deeper mechanism decision underneath this ADR
- [[R-FE-001]] — Tailwind utilities only on Angular templates
- [[R-FE-002]] — No SCSS, no component CSS, no `styles` array
- [[R-FE-003]] — No inline styles, ever
- [[R-FE-004]] — Tokens only — no raw hex/rgb/px/border/radius/shadow values
- `memory/feedback_no_inline_styles_tokens_only.md` — hardened 2026-05-05
- `memory/feedback_v02_theme_adopted.md` — V0.2 theme adopted as Falcon SSOT
- `memory/feedback_shadow_is_token_ssot.md` — Stencil Shadow + `*.tokens.css` are the SSOT, Tailwind variant mirrors
- `memory/project_falcon_revamp_v3_1_night_shift_results.md` — bundle deltas
- `Brain Outputs/understanding/frontend/architecture/TOKEN_TAXONOMY.md` — 218-token catalog
- `Brain Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/NEW_FINDINGS_FROM_SLOW_AUDIT.md` — 44 R-FE-002 violations
- `Brain Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/ACTUAL_RESULTS_AND_LEARNINGS.md` — PATTERN-04 sweep result (5 files migrated, 13 blockers documented)
- `Brain Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/patterns/PATTERN-04-scss-file-to-tailwind.md` — the migration playbook
- `libs/falcon-theme/src/falcon-tailwind-tokens.css` — the SSOT file itself

## Tags

#type/adr #frontend #theme #tailwind #scss-removal #status/accepted
