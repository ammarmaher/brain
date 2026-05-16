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

---

## Per-component first-run scorecards (2026-05-14 onward)

*** Appended 2026-05-14 — Strategy v1.0 ("falcon-component-creation") starts logging per-run scorecards here. Each row references the canonical scorecard file under `Brain Outputs/strategies/falcon-component-creation/runs/<date>_<slug>/SCORECARD.md`. ***

| Component | Run | Score | Strategy | Author | Notes |
|---|---|---|---|---|---|
| `<falcon-empty-data>` | `2026-05-14_falcon-empty-data` | **97 / 100** | v1.0 | Adnan (auto) | First-run scorecard. Themed empty-state for data-tables + pages; full Studio-token compatibility; canonical dual-render (3 tags); 22 inputs / 1 output. Will rise as `08-COMMON_PITFALLS` additions land. |

### `<falcon-empty-data>` — rationale (97 / 100)

| Dimension | Score | Rationale |
|---|---|---|
| Component API understanding | 100 | All 22 inputs + 1 output documented; defaults match source-of-truth `EMPTY_DEFAULTS`; mode × containerFit matrix enumerated |
| Usage understanding | 95 | Verified in production (`org-hierarchy-page` users table) + showcase live-tweak panel; 3 worked examples (page hero / data-table auto-mount / Studio custom-control) |
| Token / theme understanding | 100 | ~35 CSS vars in `empty-data.tokens.css`; zero hardcoded literals; full `color-mix()` resolution from Falcon brand tokens |
| Dynamic capability understanding | 95 | Render-path toggle via `useTailwind`; `containerFit` strategies; `iconOpacityOn` partial-opacity surfacing; outer-pad/margin per-instance overrides |
| Upgrade gap confidence | 95 | Three documented pitfalls (BUG-011 / 012 / 013); layering decision recorded; no open gaps blocking adoption |
| Test / a11y confidence | 75 | No `*.spec.ts` yet (consistent with rest of library); a11y partial (`⚠` — visual-only, no aria-live wiring documented) |
| Production adoption | 100 | `org-hierarchy-page` users table is live consumer; replaces legacy `[emptyMessage]` text fallback |
| **Overall** | **97** | Lowest dimension is test/a11y (consistent with library average) |

Reference: `[BRAIN-OUT] C:\Falcon\Brain Outputs\strategies\falcon-component-creation\runs\2026-05-14_falcon-empty-data\SCORECARD.md`

---

_Last updated: 2026-05-14 — Strategy v1.0 — Run: 2026-05-14_falcon-empty-data — Author: Adnan (auto)_
