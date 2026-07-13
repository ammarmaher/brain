*** Task history — Dashboard main-parity Tailwind scrape (host-shell) ***

# 2026-06-08 — Scrape origin/main dashboard -> faithful zero-CSS Tailwind parity

- taskId: dashboard-main-parity-tailwind-scrape-2026-06-08
- status: COMPLETED (build-verified). FE-only. NO commits. Branch polishing-v0.4 (working tree).
- repo: C:\Falcon\Falcon\falcon-web-platform-ui

## Goal
Scrape the origin/main host-shell dashboard (the visual Source of Truth) and make our
polishing-v0.4 dashboard a FAITHFUL, rules-compliant, Tailwind-ONLY reproduction — no
component CSS, Falcon tokens, follow the FE structure standard.

## Key discovery
Our dashboard was ALREADY a structural Tailwind port of main (same skeleton+loaded,
4 stat cards, revenue bar-chart, service-status, recent-activity; already @if/@for +
extracted models + falcon-icon). The genuine gaps:
1. GEOMETRY built against the SCSS *fallback* radii, NOT main's REAL theme values:
   card 12->16px (radius-lg), icon tile 10->12px (radius-md), chart bar 6->8px (radius-sm).
2. SKELETON SHIMMER broken: dashboard.component.scss referenced var(--skel-base/-wave/
   -duration/-radius) with NO fallback; those vars are undefined in the current libs
   (died with the old platform theme).
3. A component .scss still existed (violates Tailwind-only).
4. Dead getStatusClass().

Main's TRUE values are recoverable from git: origin/main:libs/falcon/src/theme/styles/
tokens/ (01-palettes.css raw values + 02-semantics.css chain + 04-spacing/05-radius/
06-shadow). Main used a GENERIC slate/emerald/amber palette; the current app has
rebranded to falcon-* tokens — so ~10 of main's colors have no exact falcon token.

## Decisions (user, AskUserQuestion x3)
- A = Faithful lean port (keep raw-div + Tailwind, mirror main geometry; do NOT rebuild on
      falcon-angular-* components).
- B = true zero-CSS (relocate shimmer to the Tailwind layer; delete component .scss).
- C = Falcon brand tokens for color (nearest token, app-consistent, NO token-lib edit,
      document the main<->token deltas).

## Edits (4 files)
- apps/host-shell/src/app/features/dashboard/dashboard.component.html — REWRITTEN:
  rounded-xl->rounded-2xl x8 (cards=16px), rounded-[10px]->rounded-xl x4 (icons=12px),
  chart-bar rounded-t-md->rounded-t-lg (8px), skel chart-bar rounded-t->rounded-t-md (6px),
  skel/skel-bar->falcon-skel x17, text-skeletons +rounded-md (main 6px default).
  Colors UNCHANGED (falcon tokens). Breakpoints UNCHANGED (mobile-first min-[]).
- apps/host-shell/src/app/features/dashboard/dashboard.component.ts — removed styleUrls +
  dead getStatusClass(). greeting/userName getters kept (parity w/ main; both unused).
- apps/host-shell/src/tailwind.css — +@utility falcon-skel + @keyframes falcon-skel-shimmer
  (gradient endpoints = var(--color-falcon-neutral-100)/-0, no hardcoded hex). App-scoped;
  no shared falcon-theme edit; no tokens.ts regen needed.
- DELETED apps/host-shell/src/app/features/dashboard/dashboard.component.scss.

## Gate / verification
- nx build host-shell --skip-nx-cache = SUCCESS (exit 0, hash 412bcaf9922ff706, ~19s,
  "Successfully ran target build for project host-shell and 6 tasks").
- Bundle-verified in dist/apps/host-shell/styles.css: falcon-skel x7 (utility+keyframe
  wired), rounded-2xl x1, rounded-t-lg x1. Dashboard feature confirmed zero-CSS
  (no styleUrls/getStatusClass/.scss).
- Per rule §8 (no browser verification during implementation), live visual diff is a
  SEPARATE optional user-gated step — not run.

## Documented color deltas (decision C — intentional, app-brand consistency)
- accent: falcon-teal-700 #0d3f44 (kept) vs main primary teal-600 #104c54 (exact token exists)
- success text falcon-green-500 #16a34a vs main emerald #10b981; soft green-100 #dfece6 vs mint #d1fae5
- warning text falcon-amber-500 #f59e0b (EXACT); soft amber-50 #ffeccb vs pale-yellow #fef3c7
- danger text falcon-red-500 #dc2626 vs #ef4444; soft red-100 #fde2e4 vs #fee2e2
- neutrals: surface #fff exact; border/muted/title near-exact

## Reusable lessons
- "saves/looks ported but drifts": a Tailwind port built against SCSS var() FALLBACKS
  silently diverges from the REAL theme token values — always resolve the actual theme chain.
- Zero-CSS shimmer pattern: app tailwind.css `@utility name { ... }` + `@keyframes` with
  token-var gradient endpoints; Tailwind v4 accepts it, emits when scanned via @source.
- Main color ground-truth lives at origin/main:libs/falcon/src/theme/styles/tokens/.
