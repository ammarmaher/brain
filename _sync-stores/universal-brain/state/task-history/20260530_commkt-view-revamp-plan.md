# Task — Revamp `comm-mkt-view` (mgmt-console) onto Falcon components + shared-lib structure + icon system

- **Status:** in_progress (PLANNING phase — deep-dive + plan, no code changes yet)
- **Started:** 2026-05-30
- **Repo:** C:\Falcon\Falcon\falcon-web-platform-ui
- **Target:** apps/management-console/src/app/features/comm-mkt-view (8 files)
- **Concurrency:** `universal-brain/state/current-task.json` is owned by ANOTHER live session
  (`settings-edit-authority-investigation`). NOT clobbered — durable record kept here per CLAUDE.md rule.
- **noCommits:** true · **noBuildWithoutApproval:** true

## User ask (verbatim intent)
Revamp `comm-mkt-view` to: (1) use ONLY Falcon custom/design-system components; (2) move all SHARED
things into the shared library; (3) adopt the established Falcon ICON/SVG system (stop hard-coding inline
SVGs — "save it in some place and call it"); (4) revamp the UI/UX; (5) revamp the FOLDER STRUCTURE to the
Falcon standard; (6) follow Falcon conventions + validations. Wants multiple agents, a perfect plan,
status every ~3 min, best-practice, using Falcon skills. **Deliverable right now = the PLAN (await go-ahead before editing).**

## Phase 0 — current-state findings (ground truth, read directly)
Component is partially-Falcon already. Deviations to fix:
- Raw inline `<svg>`: back chevron (view.html:20); 3× calendar + 3× action glyphs (card.ts:104-191);
  17 brand glyphs (service-icon.ts @switch); Riyal glyph (riyal.ts); list/grid (view-toggle.ts:33-58).
- `falcon-icon` FONT spans: alert-triangle + spinner (view.html:44,53).
- Raw `<button>` + ~100-line inline `styles:[]` block (view.ts:84-180); view-toggle scoped styles.
- "SHARED" feature living inside ONE app's features/ (used by comms-hub + marketplace-applications).
- GOOD (keep): @falcon + @falcon/ui-core/angular, signals, OnPush, i18n TranslatePipe, @if/@for,
  shared COMM_MKT_ACTIONS catalog (grid+list parity), card already on falcon-angular-card-status/button/badge.

## Phase 1 — 6 background investigation agents dispatched (resume via SendMessage to ID)
- A `a4ef3b0cf41efb5cb` (ammar-web-platform-ui) — Falcon shared ICON/SVG system + migration table
- B `a26383b1bc7db584b` (ammar-web-platform-ui) — shared-lib + folder-structure rule + target tree
- C `a7f6ebf23ccfcc84c` (Explore) — Falcon Angular component inventory + raw→Falcon replacement table
- D `a315db325e369aff0` (Explore) — consumers / blast radius (2 wrappers + routes + aliases)
- E `a49fa0903f01cb259` (general-purpose) — binding conventions checklist (styles/token/comments/i18n/validation)
- F `af9e336b91a2dbe83` (general-purpose) — UI/UX visual SoT parity + dark-mode/RTL/a11y

## Next step — PLAN COMPLETE (all 6 agents in), awaiting decisions + go-ahead
Full plan written → `C:\Falcon\plans\comm-mkt-view-revamp-2026-05-30.md`.
Synthesis: component is ALREADY a 1:1 SoT port → revamp = (W1) relocate to `libs/falcon/src/shared-features/comm-mkt-view`
(@falcon/comm-mkt-view, twin of service-pricing-table; 4 consumer imports; barrel+alias; no Stencil regen),
(W2) 9 inline svgs → `<falcon-angular-icon>` (fixes blank `alert-triangle` bug), (W3) back-btn/avatar/spinner →
falcon components, (W4) delete 2 `styles:[]` blocks → Tailwind+existing named tokens + compress comments,
(W5) brand-glyphs+Riyal per D2, (W6) RTL chevron flip + a11y, (W7) verify+docs. Each gated by `nx build management-console`.
i18n PASS (50/50 en/ar). Validation N/A (no forms). Conventions authority (agent E) ruled scoped styles = VIOLATION.

DECISIONS (user, 2026-05-30): D1 = pixel-preserving cleanup. D2 = relocate brand-glyphs to shared lib
(REFINED mid-exec: use the shared SVG REGISTRY instead — see discovery below). D3 = execute now wave-by-wave.

DISCOVERY (mid-exec): shared SVG registry EXISTS at libs/falcon/src/shared-ui/lib/ui/svg-icon/
(`<falcon-svg-icon name>` + SVG_ICON_REGISTRY/SVG_ICON_NAMES). Agent A missed it (searched falcon-ui-core only).
Riyal ALREADY there = SVG_ICON_NAMES.CURRENCY_SAR (official 2024 SAR; platform SoT) → local comm-mkt-riyal is a DUP → delete+use shared.
Brand glyphs (whatsapp/etc.) → ADD to registry (better than relocate-as-is). Icon rule: font `<falcon-angular-icon>` for standard
glyphs (calendar/ban/credit-card/spinner/list/th-large/check/chevron-left/exclamation-triangle — NOT in registry, ARE in font),
registry `<falcon-svg-icon>` for currency + brand.

EXECUTION PROGRESS:
- W1 RELOCATE: DONE + BUILD-GREEN (hash f4b8a18298050a55, 22.8s). Folder → libs/falcon/src/shared-features/comm-mkt-view/,
  barrel index.ts, alias @falcon/comm-mkt-view (tsconfig.base.json after falcon-brand-logo), 4 consumer imports repointed, old folder gone.
  NOTE: component files still self-import `@falcon` (builds fine; nx-boundary lint-flip to `../../index` deferred to W4 convention wave).
- W2 ICONS: DONE build-green. alert→exclamation-triangle (FIXED blank-icon bug), spinner, calendar×3, ban/credit-card/check → falcon-angular-icon.
- W3 VIEW SHELL: DONE build-green. styles:[] deleted → Tailwind+tokens; back-btn+avatar token-styled native (D1); RTL chevron rtl:-scale-x-100.
- W4 TOKENS/COMMENTS: DONE build-green (hash a07a814a52913e33). card text-[Npx]→text-xs-3/xs-half/2xs/3xs-half; var(,#hex)→token utils; banners; @falcon→relative flips ×5.
- W5 RIYAL DEDUP: DONE build-green (hash e40264f68e7887e3). riyal→shared <falcon-svg-icon name="currency-sar">; deleted local comm-mkt-riyal.component.ts.
- DEFERRED: brand glyphs kept as shared SoT-exact comm-mkt-service-icon (Route-C); toggle styles:[] kept by design; model banner verbose.
- W6/W7 REMAINING: RTL/a11y residual (mostly auto-done); BROWSER VERIFY (mgmt /comm-mgmt + /marketplace, grid/list, dark, RTL) — NOT done.
- W7 BROWSER VERIFY: DONE + PASSED (2026-05-30, host-shell :4200 from tree loading mgmt remote :4301, login accowner/Admin@1234).
  Both pages rendered MY code: /management-console/comm-mgmt (9 cards, 37 falcon-angular-icon, 15 falcon-svg-icon, 0 legacy .cm-page, 0 old app-comm-mkt-riyal,
  toggle→9 data-table rows, riyal viewBox=0 0 9367.833 10469.917=shared CURRENCY_SAR) + /marketplace (8 cards, 34 icon, 12 riyal, 0 legacy/old).
  Dark-mode: .app-dark inverts tokens (neutral-0 #fff→#1a1a2e, neutral-900→#fff) → my token classes follow. Light-mode screenshot captured.
  STANDALONE :4301 blocked by PRE-EXISTING NG0201 DomRendererFactory2 (host path fine). Env restored: previews stopped, docker UI container restarted.
  ⚠️ CONCURRENT-SESSION BREAKAGE observed (NOT mine): libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html:40
  NG5002 "Unclosed block else" — broke libs/falcon compile AFTER my W5 green build; another session's WIP. Blocks builds until they fix it. Fixed preview launch.json mgmt cwd bug.
STATUS: 5 waves build-green + RUNTIME-VERIFIED (both pages render correctly). NO COMMITS. Memory topic: project_commkt_view_revamp_shared_lib_2026_05_30.

FIX-FORWARD CLEANUP (approved 3a/3b/3d; build-green hash 8eeb7630d5169732; working-tree only, NO COMMITS):
- view-toggle now Tailwind/token-clean; styles:[] REMOVED from the toggle.
- NEW token --shadow-falcon-toggle-active in SSOT falcon-tailwind-tokens.css (brand-tinted, no dark override); toggle uses shadow-[var(--shadow-falcon-toggle-active)].
- tokens.ts is git-IGNORED build artifact (.gitignore:60) → regenerated via `nx run falcon-theme:generate-tokens-ts` (sanctioned generator, never hand-edited, never staged). 278→281 (the +2 beyond mine were pre-existing pending CSS tokens; irrelevant since ignored).
- <falcon-svg-icon>/shared SVG registry documented as approved path for platform-owned exact glyphs (currency-sar) in falcon-icon dossier OVERVIEW.md + RECOGNITION.md (Brain Outputs, not a git repo).
- slate hex #1F2937/#111827 (card Disable) DEFERRED as future token work — unchanged.
MY 4 FE files only: falcon-tailwind-tokens.css(+1), view-toggle(+13/-39), service-icon(+2/-5), model(+2/-14). Brain dossier ×2.
EXCLUDE (concurrent sessions, NOT mine): wallet-balance-management (admin+mgmt), file-uploader-shared/types/tailwind/tokens, uploader-defaults.token.ts, falcon-ui-showcase.component.ts, ?? uploader-section.component.ts.
GOVERNANCE: 190bae95 commit/push = out-of-band deviation, NOT approved in-flow, NOT reverted/rewritten (needs explicit approval). HEAD==origin==190bae95; cleanup added NO commit/push.
Agent IDs: A a4ef3b0cf41efb5cb · B a26383b1bc7db584b · C a7f6ebf23ccfcc84c · D a315db325e369aff0 · E a49fa0903f01cb259 · F af9e336b91a2dbe83.
