---
type: phase-implementation-report
phase: Phase D — Wave 7 (Toast Top Layer) + Wave 8 (Cleanup + ESLint + Brain docs)
agent: Ammar Web-Platform-UI
date: 2026-05-21
status: code-complete + build-green + tests-green
build-status: 5/5 GREEN
test-status: 67/67 GREEN
runtime-status: not-verified (FE-blocker per [VAULT] `VERIFICATION-STATUS.md`)
verdict: GREEN with one documented halt-and-flag (Wave 8.1 — all 5 tokens have live consumers, deletion deferred)
---

# Phase D Implementation Report

Top Layer migration · Phase D · Waves 7 + 8 — FINAL PHASE of the 8-wave migration.

## Wave 7 — Toast Top Layer migration

### Files touched

1. [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts` — Sole hand-edit for Wave 7. Diff summary:
   - **Imports**: Added `FalconOverlayDirective` from `../../utilities/falcon-overlay.directive`.
   - **Decorator `imports`**: Added `FalconOverlayDirective` alongside `FalconAngularNotificationComponent`.
   - **Template**: Wrapped the `@if (active().length > 0)` predicate behind a `hasActiveToasts()` computed. Added `[falconOverlay]="'toast'"` + `[falconOpen]="true"` to the outer `<div>` so it enters the Top Layer the moment it mounts.
   - **Styles**: New scoped CSS block — `:host [popover] { inset: auto !important; margin: 0 !important; border:0; padding:0; background:transparent; … }` to neutralize UA `[popover]` defaults (`inset: 0; margin: auto` would centre + stretch the stack). The existing Tailwind `fixed top-[4.75rem] right-6` utility classes continue to anchor.
   - **Component class**: Added `hasActiveToasts = computed<boolean>(() => this.active().length > 0)`. The previous `containerClasses` + `active` references preserved verbatim. Public API unchanged.
   - **File header**: New Wave 7 (Phase D) comment block documenting the migration.

LOC delta: +50 / -1 (1 file).

### Reassert mechanism — now active

The `FalconStackingService.reassertToasts()` rAF pass — built in Phase A but dormant because no toast registered — is now active. The mechanism:

1. A toast notification arrives → service emits → `active().length > 0` → `hasActiveToasts()` flips true → `@if` mounts the outer `<div>` → `[falconOverlay]="'toast'"` directive constructs → effect runs → `popover="manual"` attribute set → `showPopover()` called → element enters Top Layer → `FalconStackingService.register(el, 'toast')` records the element.
2. A modal/drawer subsequently opens → that overlay's `[falconOverlay]` directive calls `stacking.register(el, 'modal'|'drawer')` → register's tail logic checks `kind === 'modal' || kind === 'drawer'` → schedules `requestAnimationFrame(() => this.reassertToasts())`.
3. The rAF callback fires AFTER the modal's `showModal()` has landed → `reassertToasts()` iterates every tracked toast → `hidePopover() + showPopover()` on each → each toast re-enters Top Layer at the top of the LIFO stack → toasts now paint above the modal even though the modal was promoted later.

Priority-1 rule "notifications/error toasts always topmost" satisfied.

### Public API preservation

`FalconAngularNotificationStackComponent`:
- 10 inputs preserved verbatim: `glossy`, `iconBg`, `countdownHeight`, `countdownBarBottom`, `countdownBarTop`, `countdownBarGlossy`, `borderWidth`, `leftAccent`, `rightAccent`, `radius`, `position`.
- Selector `falcon-angular-notification-stack` preserved.
- `falconNotificationStackContainerClasses()` helper export preserved verbatim — the existing 7 specs in `apps/host-shell/tests/falcon-notification-stack-position.spec.ts` keep asserting against it unchanged.
- `onDismiss` protected method signature preserved.

## Wave 8 — Cleanup

### 8.1 — Token deletion (HALT-AND-FLAG — deletion deferred)

**Pre-deletion audit found ALL 5 tokens have live consumers in non-Brain-Outputs locations.** Per the hard rule "If any reference remains, DO NOT delete — document and skip", deletion was skipped for every token. Deprecation comments were applied instead.

Token-by-token confirmation:

| Token | Live consumers | Action |
|-------|----------------|--------|
| `--falcon-dialog-z-index` (99999) | `falcon-dialog.css:24,57`, `dialog-tailwind-classes.{ts,js}:21,59` + `:13,45`, `host-shell/tailwind.css:1429,1430`, `admin-console/tailwind.css:1393,1394` | Deprecated, retained |
| `--falcon-drawer-z-index` (99999) | `falcon-drawer.css:20,64`, `drawer-tailwind-classes.{ts,js}:21,51` + `:11,34` | Deprecated, retained |
| `--falcon-overlay-z-index` (100000) | `overlay.tokens.css:38` (self), `organization-hierarchy.tokens.css:182`, `falcon-overlay.service.ts:24` (comment-only) | Deprecated, retained |
| `--falcon-toast-host-z-index` (100001) | `falcon-toast-host.css:9`, `toast-host-tailwind-classes.{ts,js}:45` + `:34`, `host-shell/tailwind.css:1363`, `admin-console/tailwind.css:1327`, plus the inline `z-[100001]` defence-in-depth class in the Wave 7 toast stack | Deprecated, retained |
| `--falcon-ib-dialog-backdrop-z` (99999) | `falcon-insufficient-balance-dialog-tw.tsx:332` (Stencil JSX), `falcon-insufficient-balance-dialog.css:18` | Deprecated, retained |

Each token now carries a multi-line `@deprecated — Wave 8 (Phase D, 2026-05-21)` JSDoc-style comment block listing every consumer + the Wave-9+ deletion plan + a pointer to `Brain Outputs/understanding/frontend/overlay-architecture/DEAD-TOKENS.md`.

The overlay.tokens.css file gained an additional global deprecation notice + an ESLint guard reminder block at the END of the file.

### 8.2 — Body-portal logic deprecation

- [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.service.ts` — Added `@deprecated` JSDoc on the class + on `getContainer()` method. File-header comment block expanded with the Wave 8 deprecation rationale and pointer to `BROWSER-FALLBACKS.md`. **Service is NOT deleted** — still used as feature-detected fallback for browsers without Popover API.
- [CODE] `libs/falcon-ui-tokens/src/components/overlay.tokens.css:60-80` — `.falcon-overlay-container` CSS gained a `@deprecated` comment block. **CSS rule is NOT deleted** — still rendered by the service for the fallback path.

### 8.3 — `popover-portal.ts` deprecation

[CODE] `libs/falcon-ui-core/src/utils/popover-portal.ts` — File header expanded with `@deprecated` block. Functions (`ensurePortaled`, `positionPopoverFixed`, etc.) NOT deleted — Stencil cores still call into them from `componentDidRender`, and they provide the JS-based positioning fallback for browsers without CSS Anchor Positioning (Firefox).

### 8.4 — ESLint rule

[CODE] `eslint.config.mjs` — New flat-config block at the top of the rules array (before the existing `no-restricted-imports` block):

```javascript
{
  files: ['**/*.ts', '**/*.tsx', '**/*.html'],
  ignores: [
    // 5 legacy token files + Tailwind class helper modules + .css fallback files
    // + Stencil IB-dialog .tsx + Wave-7 toast stack (defence-in-depth `z-[100001]`)
    // + app-level tailwind.css @source inline directives
  ],
  rules: {
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'Literal[value=/z-\\[(?:[1-9][0-9]{3,}|[1-9][0-9]{4,})\\]/]',
        message: 'Wave 8.4 — top-layer-migration: new code must use [falconOverlay] …',
      },
      {
        selector: 'TemplateLiteral[quasis.0.value.raw=/z-\\[(?:[1-9][0-9]{3,}|[1-9][0-9]{4,})\\]/]',
        message: 'Wave 8.4 — same rule for template literals.',
      },
    ],
  },
}
```

- **Severity**: `warn` (not `error`) — pragmatic choice to avoid blocking CI on grandfathered values that may surface in unexpected places; promotion to `error` is a future hardening step.
- **Pattern**: catches `z-[<N>]` where N ≥ 1000 in `.ts`, `.tsx`, `.html` files via `no-restricted-syntax` AST selectors targeting both string `Literal` and `TemplateLiteral` nodes.
- **Ignores list**: explicitly grandfathers the 5 token files, the 3 tailwind-class helper modules (`dialog/drawer/toast-host-tailwind-classes.{ts,js}`), 4 component `.css` consumer files, the Stencil IB-dialog `.tsx`, the Wave-7 toast stack component, and 3 app-level `tailwind.css` entry files.
- **Documentation crossref**: ESLint message points to `overlay.tokens.css` (for the canonical guard text) and to the new brain docs (for the canonical pattern).
- **CSS coverage**: ESLint can't lint `.css` files directly without a CSS plugin (per the existing `eslint.config.mjs` blocker note at lines 172-185). The complementary CSS-side guard lives at the END of `overlay.tokens.css` as a documentation block — reviewers must read it when authoring new overlay CSS.

### 8.5 — Brain docs created

Under `Brain Outputs/understanding/frontend/overlay-architecture/`:

1. **`ARCHITECTURE.md`** (~150 lines) — Top-layer primer for new developers. Explains the one rule, the 4 overlay kinds, the stacking service, usage examples (modal / drawer / popover / toast), browser-support floor, anti-patterns. Source-prefixed `[CODE]` pointers.
2. **`MIGRATION-NOTES.md`** (~130 lines) — Wave-by-wave changelog from Wave 0 baseline through Wave 8 cleanup, referencing the 4 phase reports + total touch surface across all 8 waves.
3. **`DEAD-TOKENS.md`** (~120 lines) — Token-by-token inventory of the 5 z-index tokens kept post-migration: each token's live consumers + Wave-9+ deletion plan.
4. **`BROWSER-FALLBACKS.md`** (~135 lines) — Feature-detection map: native API → fallback path. Lists every kept-as-fallback asset (FalconOverlayService, popover-portal.ts, .falcon-overlay-container, the z-[100001] toast defence-in-depth class) and when each fallback engages.

All 4 docs use `[CODE]`/`[BRAIN-OUT]` source prefixes per the brain protocol.

## Build matrix

| Project | Command | Result | Hash | Time |
|---------|---------|--------|------|------|
| falcon-ui-tokens | `npx nx build falcon-ui-tokens` | GREEN | 52 components / 3624 tokens | <1s |
| falcon-ui-core | `npx nx build falcon-ui-core` | GREEN | 103 components proxied | ~47s |
| host-shell | `npx nx build host-shell --skip-nx-cache` | GREEN | `cfc05f33b2ad0df1` | 19.7s |
| admin-console | `npx nx build admin-console --skip-nx-cache` | GREEN | `1fac23712b95c5ed` | 27.9s |
| management-console | `npx nx build management-console --skip-nx-cache` | GREEN | `17ca44c92f05ab83` | 27.0s |

ALL FIVE GREEN.

Pre-existing Stencil warnings unchanged from Phases A/B/C: `@Prop() title?` on `falcon-dialog.tsx:42` + `falcon-dialog-tw.tsx:48`; `@Prop() scrollHeight?` on `falcon-table.tsx:120` + `falcon-table-tw.tsx:165`. Not Phase D-introduced.

## Test matrix

| Project | Command | Suites | Tests | Result |
|---------|---------|--------|-------|--------|
| host-shell | `npx nx test host-shell` | 4 | 67 | 67/67 GREEN |

Per-suite breakdown (2.99s total):
- `tests/falcon-http-ui-routing.spec.ts` — 40 tests · GREEN (13ms)
- `tests/falcon-notification-stack-position.spec.ts` — 7 tests · GREEN (6ms) — directly exercises the Wave 7 stack (helper `falconNotificationStackContainerClasses` preserved verbatim)
- `tests/falcon-completion-success-dialog.spec.ts` — 9 tests · GREEN (278ms)
- `tests/falcon-sending-credentials-dialog.spec.ts` — 11 tests · GREEN (510ms)

The 7 notification-stack tests continue to pass because Wave 7 preserved the helper function's signature, return string, and every assertion path: `top-[4.75rem]`, `bottom-6`, `right-6`, `left-6`, `fixed`, `flex`, `flex-col`, `z-[100001]`, `pointer-events-none`, `max-w-sm`, `w-[calc(100%-3rem)]`.

## Files-touched summary (Phase D)

### Wave 7
1. [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-notification/falcon-notification-stack.component.ts`

### Wave 8
2. [CODE] `libs/falcon-ui-tokens/src/components/dialog.tokens.css` — deprecation comment.
3. [CODE] `libs/falcon-ui-tokens/src/components/drawer.tokens.css` — deprecation comment.
4. [CODE] `libs/falcon-ui-tokens/src/components/overlay.tokens.css` — deprecation comment block + ESLint guard documentation block.
5. [CODE] `libs/falcon-ui-tokens/src/components/toast.tokens.css` — deprecation comment.
6. [CODE] `libs/falcon-ui-tokens/src/components/insufficient-balance-dialog.tokens.css` — deprecation comment.
7. [CODE] `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.service.ts` — `@deprecated` JSDoc + expanded header.
8. [CODE] `libs/falcon-ui-core/src/utils/popover-portal.ts` — `@deprecated` block in header.
9. [CODE] `eslint.config.mjs` — `no-restricted-syntax` block for `z-[N≥1000]` literals.

### Brain docs
10. [BRAIN-OUT] `Brain Outputs/understanding/frontend/overlay-architecture/ARCHITECTURE.md` — new file.
11. [BRAIN-OUT] `Brain Outputs/understanding/frontend/overlay-architecture/MIGRATION-NOTES.md` — new file.
12. [BRAIN-OUT] `Brain Outputs/understanding/frontend/overlay-architecture/DEAD-TOKENS.md` — new file.
13. [BRAIN-OUT] `Brain Outputs/understanding/frontend/overlay-architecture/BROWSER-FALLBACKS.md` — new file.

Touched-file count: **13** (9 code + 4 brain docs).

## Hard limits compliance

- [x] NO commits made.
- [x] NO git operations performed.
- [x] FalconOverlayService preserved (only deprecation comment added).
- [x] popover-portal.ts preserved (only deprecation comment added).
- [x] Pre-deletion check performed per token (all 5 retain live consumers → none deleted → documented).
- [x] NO public API changes — `FalconAngularNotificationStackComponent` selector + 10 inputs preserved; helper export preserved verbatim.
- [x] Files outside Phase D scope: zero. The 9 code files + 4 brain docs are all in the explicitly enumerated Wave 7 + Wave 8 areas.

## Halt-and-flag summary

**Wave 8.1 token deletion was BLOCKED for all 5 tokens.** Each retains live consumers in non-Brain-Outputs locations. Per the hard rule "If any reference remains, DO NOT delete — document and skip", deletion was deferred to Wave 9+ and replaced by deprecation comments. Full per-token consumer inventory is in [BRAIN-OUT] `Brain Outputs/understanding/frontend/overlay-architecture/DEAD-TOKENS.md`.

Root cause: the Stencil shadow-DOM cores (`falcon-dialog.css`, `falcon-drawer.css`, `falcon-toast-host.css`, `falcon-insufficient-balance-dialog.css`, `falcon-insufficient-balance-dialog-tw.tsx`) still consume the tokens. The Phase A-D wrap-not-rewrite strategy preserved the Stencil cores; their migration is Wave 9+ scope.

Also: the `tailwind-classes.{ts,js}` helper modules in `libs/falcon-ui-core/src/tailwind/` are programmatically generated Tailwind class strings consumed by the apps' `tailwind.css` `@source inline()` directives. Deleting the tokens without deleting these helpers would break the Stencil shadow-DOM render path (the JIT would emit invalid utility classes).

## Final session summary — across all 8 waves

| Phase | Waves | Files touched | LOC delta (approx.) | Build status |
|-------|-------|---------------|---------------------|--------------|
| Wave 0 (Baseline) | n/a | 0 (read-only) | 0 | — |
| Phase A | Wave 1 + Wave 2 + Wave 3 | 13 (10 hand-edited + 3 auto) | +650 / -250 | 5/5 GREEN, 67/67 tests GREEN |
| Phase B | Wave 4 + Wave 5 | 12 (all hand-edited; 1 new) | +290 / -10 | 5/5 GREEN, 67/67 tests GREEN |
| Phase C | Wave 6 | 10 | +860 / -6 | 5/5 GREEN, 67/67 tests GREEN |
| Phase D | Wave 7 + Wave 8 | 13 (9 code + 4 brain docs) | +50 / -1 (Wave 7) + ~+200 / -0 (Wave 8 deprecation comments) + ~+540 (brain docs) | 5/5 GREEN, 67/67 tests GREEN |

**Total ~48 code files touched across 4 phases + 4 brain docs created. Zero public API changes. Zero breaking changes.**

## Verdict

**GREEN — Phase D code-complete. 5/5 builds GREEN. 67/67 host-shell specs GREEN. Wave 7 toast Top Layer migration complete with reassert-on-modal/drawer path now active. Wave 8 cleanup applied via deprecation pattern (all 5 z-index tokens retained per hard rule because each retains live consumers; deletion deferred to Wave 9+). ESLint rule wired with grandfathering for current consumers. 4 brain docs created under `Brain Outputs/understanding/frontend/overlay-architecture/`.**

**The 8-wave Top Layer migration is complete.** Falcon now renders every Falcon-owned overlay (modal · drawer · popover · tooltip · toast) in the browser's native Top Layer, with feature-detected fallback to the legacy body-portal + z-index ladder for below-floor browsers. Toasts retain priority-1 topmost positioning via the FalconStackingService's reassert-on-modal/drawer-register rAF pass.

Runtime verification of the toast-reassert path against an actual modal/drawer cohabitation remains pending — gated on the FE blocker per [VAULT] `VERIFICATION-STATUS.md`.
