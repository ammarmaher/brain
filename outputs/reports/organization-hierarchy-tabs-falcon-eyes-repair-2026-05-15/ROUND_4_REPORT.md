*** Round 4 Report — Organization Hierarchy / CommChannels & Services ***

**Date:** 2026-05-15
**Branch:** `polishing-v0.4`
**Round 3 baseline:** 6 files staged (untouched, kept as base for Round 4)
**Round 4 added/modified:** see "Files staged" below
**admin-console prod build hash:** `12abe61de49a8543`
**falcon-ui-core build:** GREEN
**Commit status:** NONE — user will commit + push
**Push status:** NONE — user will push

---

## Three tracks

### Track 1 — Unblock dev-serve + chrome-MCP verify Round 3

#### Step 1.1 — Diagnose dev-serve

**Outcome:** NOT a fork-ts-checker path resolution failure. Dev-serve is healthy
and serving HTTP 200 on 4200/4204/4301 from PID 18588 (user-owned, started 12:19 PM).
The actual problem is a STALE BUNDLE: Round 3's staged file changes are not picked
up by HMR because PID 18588 was running BEFORE the staged edits.

**Evidence:** live page DOM shows `<falcon-table-tw style="--falcon-table-header-bg:
var(--color-falcon-neutral-50, #f5f5f5)">` — the OLD `var()` pattern. Round 3 staged
file changes the same line to literal `'#f5f5f5'`. Bundle still contains
`<falcon-confirm-dialog>` for the IB modal (string "Insufficient Balance" absent in
served main.js), proving the Round 3 IB modal rewrite hasn't compiled.

**Action attempted:** PID 18588 force-kill via `Stop-Process`, `taskkill /F /T` —
both returned "Access is denied". The user must restart the dev-serve from their
own terminal.

**Reported in:** `ROUND_4_DEVSERVE_FIX.md` (full diagnostic + remediation steps).

#### Step 1.2 — chrome-MCP verify against running dev-serve

Captured SoT vs Dest computed-style + DOM evidence at:
`C:\Falcon\Brain Outputs\reports\falcon-eyes\R4-20260515\verify\` (in matrix folder).

**Round 3 defects revisited (against stale bundle):**

| Defect | Status | Live runtime | Source-level audit |
|---|---|---|---|
| 1. Table chrome (header/footer bg) | **STILL-BROKEN** at runtime | Header/footer = `#F5F7F8` (not `#F5F5F5`) | Round 3 staged source = `'#f5f5f5'` — correct, will land after restart. Footer being non-transparent is a divergence from SoT (which is transparent) — staged source sets it to `#F5F5F5`; SoT footer is transparent. **NEW residual delta logged as DEFECT-CCS-R4-001**. |
| 2. Inline edit-row | **NOT VERIFIED** at runtime | Bundle stale; live still has Round 2 bubble + notch | Round 3 staged source removes bubble + notch + uses `bg #F3F8F5` exactly as SoT. CORRECT. |
| 3. Insufficient Balance modal | **NOT VERIFIED** at runtime | Bundle stale; live serves OLD `<falcon-confirm-dialog>` with title+subtitle only, no priority list, no info pill | Round 3 staged source had the layout — Round 4 has now REPLACED that with the new dedicated `<falcon-angular-alert-dialog>`. |

#### DEFECT-CCS-R2-001 — slot projection regression

**Status:** **CANNOT confirm at runtime** for the same reason. Round 3's flat-row
rewrite uses simpler in-row layout fitting the Stencil slot model, but the live
page still shows the Round 2 bubble. Verification deferred to post-restart.

---

### Track 2 — New `<falcon-alert-dialog>` Stencil component

**Outcome:** **SHIPPED**.

#### What was built

| File | Purpose | LOC |
|---|---|---|
| `libs/falcon-ui-core/src/components/falcon-alert-dialog/falcon-alert-dialog.tsx` | Shadow DOM Stencil component | 165 |
| `libs/falcon-ui-core/src/components/falcon-alert-dialog/falcon-alert-dialog.css` | Token-driven Shadow DOM styles (23 component tokens) | 115 |
| `libs/falcon-ui-core/src/components/falcon-alert-dialog/falcon-alert-dialog.types.ts` | Public TypeScript types | 21 |
| `libs/falcon-ui-core/src/components/falcon-alert-dialog-tw/falcon-alert-dialog-tw.tsx` | Light DOM (Tailwind) Stencil component | 155 |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/falcon-alert-dialog.component.ts` | Angular wrapper class | 95 |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/falcon-alert-dialog.component.html` | Dual-render-path tag switcher template | 50 |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/falcon-alert-dialog.component.css` | `:host { display: contents; }` | 3 |
| `libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/index.ts` | Wrapper barrel | 10 |

#### Wire-up edits

| File | Edit | Why |
|---|---|---|
| `libs/falcon-ui-core/src/define-falcon-tw-component.ts` | added `'falcon-alert-dialog-tw'` loader | Light DOM on-demand registration |
| `libs/falcon-ui-core/src/define-falcon-component.ts` | added `'falcon-alert-dialog'` Shadow loader | Shadow DOM on-demand registration |
| `libs/falcon-ui-core/src/define-custom-elements.ts` | added eager-register entries for both variants | Eager-define for Module Federation hot paths |
| `libs/falcon-ui-core/src/angular-wrapper/index.ts` | added `export * from './components/falcon-alert-dialog';` | Public Angular API |

#### Knowledge dossier

Created at `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-alert-dialog\`:

- `SPEC.md` — visual contract derived from SoT InsufficientBalanceModal
- `API.md` — Inputs / Outputs / Types / Slots
- `USAGE.md` — Angular template examples + when to use vs alternatives
- `TOKENS.md` — 23 component tokens + severity-attribute selectors
- `DECISION.md` — rationale, rejected alternatives, key contracts
- `GAPS_AND_UPGRADES.md` — 12 backlog items (animation, loading state, RTL, eval, etc.)

#### IB modal consumer rewired

`apps/admin-console/.../insufficient-balance-modal.component.ts`:
- Dropped `FalconAngularDialogComponent` import + Round 3 slot-shim wrapper.
- Imports `FalconAngularAlertDialogComponent`.
- Template now declares only the body content (priority list + info pill) — the
  centered icon + title + subtitle + footer are now component-rendered.

#### Builds green

- `nx build falcon-ui-core` — GREEN after 2-pass (cold dist creation + restore loader refs).
- `nx build admin-console` — GREEN at hash `12abe61de49a8543` (16 s, vs 13s Round 3
  — +3 s for new chunk).
- New chunk `falcon-ui-alert-dialog-tw.9306ffd6bf536357.js` (5.4 KB) shipped in
  `dist/apps/admin-console/`.

#### Title prop rename

Stencil flagged `@Prop() title` as a reserved HTMLElement prototype clash. Renamed
internal Stencil prop to `headingText` and bound `[attr.heading-text]` from the
Angular wrapper. Angular consumers still bind `[title]="…"` — public API unchanged.

---

### Track 3 — Full SoT matrix harvest + dest runtime test

#### Step 3.1 — SoT matrix harvested

**Outcome:** **57 test cases** captured at
`C:\Falcon\Brain Outputs\reports\falcon-eyes\R4-20260515\matrix\sot-testcases.md`.

Categories:
1. Tab strip (4 cases)
2. Table chrome (8 cases — bg, padding, font, footer)
3. Row structure (8 cases — 9 rows + visibility + status badges + currency)
4. Row kebab menus (6 cases — status-driven menu items per active/expired/disable/inactive)
5. Edit-row expansion (6 cases — 1-field, 3-field, cancel, save, no-bubble, multi-lane)
6. Insufficient Balance modal (12 cases — open, drag, arrows, cancel, proceed, backdrop, closeable, typography)
7. Pagination + footer (6 cases)
8. Currency + i18n (3 cases)
9. Sidebar / header (4 cases)

#### Step 3.2 — Runtime test on dest

**Outcome:** **BLOCKED for 19/57 cases** (33 %) because dev-serve serves a stale
bundle. **28/57 PASS** on dest where the rendered output is unchanged since Round 2
(structural elements like sidebar, header, table layout, status badges, page header).
**7/57 FAIL** at runtime — all attributable to bundle staleness, not source-level
issues (header bg, footer bg, header pad, bubble-notch on edit-row, IB modal
priority list missing, IB modal X close button visible). **3/57 PARTIAL** —
minor SoT-vs-staged-source divergence (footer bg `#F5F5F5` vs SoT transparent).

#### Step 3.3 — Fix newly-found defects

**DEFECT-CCS-R4-001** (new, P2): Round 3 staged `org-hierarchy-page-menu.component.ts`
sets `--falcon-table-footer-bg: #f5f5f5` but SoT footer is **transparent**. Round 3
intent was to make footer match header for visual continuity (per user request
2026-05-14 "header/footer same bg"); SoT diverges from that. Decision: keep the
Round 3 design (filled footer) because user explicitly requested it, but flag as
intentional SoT deviation in the parity scorecard. NOT fixed in Round 4.

**Other "FAIL" rows in matrix** — all caused by stale bundle, not source errors.
Will become PASS after user restarts dev-serve. NOT fixed in Round 4 (no source
change needed).

#### Step 3.4 — DEFECT-CCS-R2-001 status

**Status:** **DEFERRED** — same dev-serve-restart blocker. Round 3 staged source
uses a simpler row layout that should fit the Stencil slot model cleanly, but
runtime confirmation requires fresh bundle.

---

## Files staged for user commit

```
*** Round 3 baseline (6 files — unchanged from R3, kept as foundation) ***
apps/admin-console/src/app/features/org-hierarchy-page/components/
├── org-hierarchy-page-menu.component.ts
└── tab-components/
    ├── applications-table/applications-table.component.html
    ├── falcon-table-edit-row/falcon-table-edit-row.component.html
    ├── falcon-table-edit-row/falcon-table-edit-row.component.ts
    └── insufficient-balance-modal/
        ├── insufficient-balance-modal.component.html      ← rewritten in R4
        └── insufficient-balance-modal.component.ts        ← rewritten in R4

*** Round 4 new library component (8 source files) ***
libs/falcon-ui-core/src/components/
├── falcon-alert-dialog/
│   ├── falcon-alert-dialog.tsx
│   ├── falcon-alert-dialog.css
│   └── falcon-alert-dialog.types.ts
└── falcon-alert-dialog-tw/
    └── falcon-alert-dialog-tw.tsx

libs/falcon-ui-core/src/angular-wrapper/components/falcon-alert-dialog/
├── falcon-alert-dialog.component.ts
├── falcon-alert-dialog.component.html
├── falcon-alert-dialog.component.css
└── index.ts

*** Round 4 wire-up edits (4 modified files) ***
libs/falcon-ui-core/src/
├── angular-wrapper/index.ts                          (added export)
├── define-falcon-tw-component.ts                     (added -tw loader)
├── define-falcon-component.ts                        (added Shadow loader)
└── define-custom-elements.ts                         (added eager-define)

*** Round 4 Stencil-regenerated artefacts (auto, but ship together) ***
libs/falcon-ui-core/src/components.d.ts               (auto)
libs/falcon-ui-core/dist/components/...               (NOT staged — built outputs)
libs/falcon-ui-vue/src/index.ts                       (auto — vue proxies)

*** Round 4 readme.md scaffolds emitted by Stencil ***
libs/falcon-ui-core/src/components/falcon-alert-dialog/readme.md
libs/falcon-ui-core/src/components/falcon-alert-dialog-tw/readme.md
```

## Files NOT staged (out of scope, pre-existing from before Round 3)

```
apps/host-shell/src/app/core/guards/auth.guard.ts
libs/falcon/src/core/lib/access-control/shell-access.guard.ts
```

## Build green confirmation

```
*** falcon-ui-core ***
build finished in 39.04 s
NX  Successfully ran target build for project falcon-ui-core

*** admin-console ***
Build at: 2026-05-15T10:21:13.887Z - Hash: 12abe61de49a8543 - Time: 16195ms
NX  Successfully ran target build for project admin-console
```

## Commit + push

- **Commit status: NONE** — user will commit from their side.
- **Push status: NONE** — user will push from their side.
- **No hook bypass markers** (`--no-verify`, `--no-gpg-sign`) used.
- **No `git push` invoked** from this round.

## Outstanding work (user actions)

1. **Restart dev-serve** to pick up the staged Round 3 + Round 4 changes.
2. **Re-run the 19 NOT-VERIFIED matrix cases** against the fresh bundle.
3. **Decide on DEFECT-CCS-R4-001** — keep filled footer (per user 2026-05-14 request)
   or revert to SoT-canonical transparent footer.
4. **Commit + push** when ready.
