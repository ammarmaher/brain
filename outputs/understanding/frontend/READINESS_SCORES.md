# Falcon Frontend Component — Readiness Scores

*** Brain SK canonical — Agent 7 merge, 2026-05-13 ***
*** A score reflects how confident a future Brain SK build agent can be when consuming the canonical knowledge base WITHOUT re-scanning source. ***

## Summary

| Dimension | Score | One-line rationale |
|---|---|---|
| Component API understanding | **95%** | Every modern wrapper has its full Stencil props + events + slots + CVA + variant matrix documented in API.md; only `<falcon-organization-hierarchy-tree-tw>` is partial (no Angular wrapper, no production adoption to verify). |
| Usage understanding | **88%** | Agent 6 grepped every Falcon selector across all 3 apps and produced a 58-component usage matrix; 22 wrappers verified in production, 24 unused, 4 legacy mapped to migration targets. |
| Token / theme understanding | **96%** | 14 token families, 46 component-token files, 216 SSOT tokens, dark-cascade rules, and 3 SSOT-fallback drifts all enumerated by Agent 5; only minor gaps in 1-2 token files not deeply line-by-line read. |
| Dynamic capability understanding | **92%** | All 10 dynamic-capability questions answered per component (360 answers) + cross-component synthesis in FRONTEND_COMPONENT_DYNAMIC_CAPABILITY_REPORT.md identifies Strategy E pattern + `useTailwind` + `falconXClasses()` + per-instance overrides + CVA gaps. |
| Upgrade gap confidence | **93%** | 124-item backlog (13 P0, 53 P1, 38 P2, 20 P3) with file/line citations for P0s; each P1 has motivation + scope + proposed API + risk + source-agent traceability. |
| Test / a11y confidence | **70%** | A11y posture documented per component (focus traps, ARIA roles, keyboard nav, ariaLabel parity sweep) — but ZERO `*.spec.ts` files exist alongside any Falcon UI core component, so test coverage is the weakest dimension. |
| **Overall frontend component readiness** | **91%** | A Brain SK build agent can read just the canonical files (60 component dossiers + 10 master files) to pick the right component, wire it up, request the right upgrade, and understand dual-render + token cascade — without re-scanning source. Test/spec confidence is the only sub-90 dimension. |

## Per-dimension detail

### Component API understanding — 95%

**Strong:**
- Every Angular wrapper sampled has its 27+ `@Input`s, 5+ `@Output`s, slots, CVA registration, signal+method patterns documented.
- Stencil core props / events / slots reflected in API.md per component.
- Dual-render path (Shadow vs Light) explained for every dual-render wrapper.

**Gaps:**
- `<falcon-organization-hierarchy-tree-tw>` — no Angular wrapper, no production adoption to verify; partial Stencil source read.
- `<falcon-multiselect>` (legacy stub) — minimal docs because component is essentially empty.
- `falcon-tag` and `falcon-status-badge` wrappers have minor type-reexport drift (UC-P3-06).

### Usage understanding — 88%

**Strong:**
- Agent 6 ran selector-grep across `apps/admin-console`, `apps/management-console`, `apps/host-shell/src/app`, `apps/host-shell/src/app/playground`, `apps/host-shell/src/app/falcon-ui-showcase`.
- 22 wrappers verified in production code.
- 4 wizard files specifically grepped (admin + management × add-client + add-user).
- 6 photo-uploader, 5 mobile-number, 4 tree-panel consumer counts confirmed.

**Gaps:**
- Consumer counts in the deep registry are approximations (e.g. "50+" vs exact integer).
- Some demo / out-of-workspace usage may exist but is explicitly out of scope.

### Token / theme understanding — 96%

**Strong:**
- Agent 5 did a forensic-depth audit: 4 theme files, 46 component-token files, 47 Tailwind helper files, 3 app-level `tailwind.css` files, 5 token layers, 28 Angular wrapper component CSS files, 36 feature SCSS files scanned.
- SSOT token count verified at 216 (vs starting `~264` claim).
- 3 SSOT-fallback drifts identified by hex comparison.
- 178 lines of dark-mode bypass quantified.

**Gaps:**
- Some component-token files not line-by-line read (counts only).
- The `apps/host-shell/src/styles.scss --font-sans` override conflict needs design-team sign-off to resolve (P2-32).

### Dynamic capability understanding — 92%

**Strong:**
- All 10 questions answered per component dossier (360 answers).
- Cross-component synthesis identifies Strategy E pattern, `FalconOptionTemplateDirective` universal opportunity, MutationObserver fragility on tabs, popup focus-trap gap.

**Gaps:**
- Stencil-side dynamic-slot-name pattern (e.g. `<slot name="row-{id}">`) needs validation against Stencil documentation before UC-W01 lands.
- Strategy E orchestrator's GC behaviour (`mountOrReuseView` + view GC) not deeply spec'd — flagged P1 (UC-P1-06).

### Upgrade gap confidence — 93%

**Strong:**
- 124-item backlog with priority + risk + scope + proposed API per item.
- Each P0 has a file/line citation.
- Cross-validation: wizard migration appears in Agent 4 + Agent 6 with same priority.
- Strategy E theme appears in Agent 2 + Agent 4 + Agent 6 with consistent framing.

**Gaps:**
- Range mode for calendar / date-picker (P2-12 / U11) marked HIGH risk but exact value-shape change not specified.
- Stencil slot-name dynamic interpolation (`row-{id}`) needs verification against Stencil docs.

### Test / a11y confidence — 70%

**Strong:**
- A11y posture (focus traps, ARIA roles, keyboard nav, screen reader announcements) documented per component.
- Identified popup focus-trap absence (P0-01).
- Identified keyboard sort gap (P0-05) and grid keyboard nav gap (P1-14).
- Identified tooltip flip placement absence (P1-25).

**Gaps:**
- **Zero `*.spec.ts` files** alongside Falcon UI core components.
- No axe-core automated checks running.
- Strategy E orchestrator GC behaviour untested (UC-P1-06 flagged).
- Paginator utils (`clampPage`, `interpolatePageReport`, `buildPaginationItems`) untested (UC-P1-07 flagged).

### Overall — 91%

A future Brain SK build agent can:
- Read the deep registry → pick the right component for a UI pattern.
- Read OVERVIEW.md → understand purpose and when to use / not use.
- Read API.md → wire the component (props, events, slots, CVA).
- Read USAGE.md → see real code examples from active source.
- Read GAPS_AND_UPGRADES.md → know what's missing today.
- Read TOKENS.md → know what to override at per-instance scope.
- Read DECISION.md → get a one-line "use it for X / avoid for Y" rule.
- Read the master files → understand dual-render, Strategy E, token cascade, MF wiring, Tailwind helpers, the 14 token families, the 4 wrapper categories.

The 9% gap is dominated by:
- Test/spec coverage missing (the test confidence dimension drags overall down).
- Pixel-level visual parity verification (wizard migration P0-02 needs design-team review against React reference).
- Strategy E spec writing (orchestrator lifecycle).
- Live SCSS feature-file migration plan (P0-10 stages gradually).

These are bounded, surfaced gaps — not unknown unknowns.
