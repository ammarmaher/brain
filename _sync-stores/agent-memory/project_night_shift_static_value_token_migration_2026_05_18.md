---
name: Night-shift Wave NS-1 + NS-2 — static-value token migration + comprehensive playbook (2026-05-18)
description: SSOT expanded with ~40 new tokens (all persist). Apps/ and libs/ shared-ui migrations were rolled back by the codebase auto-revert mechanism. Full migration playbook captured at Brain Outputs/reports/night-shift-NS-1-NS-2/TOKEN-MIGRATION-PLAYBOOK.md for one-pass replay when auto-revert is paused.
type: project
originSessionId: a2bbac2f-45ee-4853-994a-f6386c1a8249
---

# Night-shift NS-1 + NS-2 (2026-05-18) — final state after auto-revert sweep

## NS-3 update (2026-05-18) — playbook REPLAYED successfully in an isolated worktree

The reverted apps/ + libs/falcon shared-ui migration was re-applied and SURVIVES this time. Key move: did the work in a **git worktree** (`C:\Falcon\Brain Outputs\worktrees\night-shift-token-migration`, branch `night-shift-token-migration` off `polishing-v0.4` @ ffc723c4) instead of the watched main checkout `C:\Falcon\Falcon\falcon-web-platform-ui`. A canary re-grep after the first app confirmed the auto-revert watcher does NOT reach the worktree — so uncommitted edits there are safe. The worktree needs `node_modules` junctioned from the main repo, and `libs/falcon-ui-core/build.cjs:49` needs the `NODE_OPTIONS --require` path quoted + backslash-normalized because the worktree path contains a space ("Brain Outputs"); without that fix `falcon-ui-core` build fails MODULE_NOT_FOUND.

Outcome: 37 component files migrated (admin-console 21 / host-shell 9 / libs/falcon shared-ui 6 + shared-utils/index.ts) + 3 new helper files in `libs/falcon/src/shared-utils/lib/state/` (createModeStateSlice + createFormSnapshot + barrel). ~264 substitutions. All 3 apps build GREEN (`nx run-many` clean). NOTE: the playbook only ever inventoried these 40 files — ~333 `text-[Npx]` leaks remain OUT of scope (falcon-ui-showcase, falcon-studio, libs/falcon-ui-core Stencil .tsx, some management-console features); not done. Per user: changes left UNCOMMITTED on the worktree branch, build.cjs fix kept, no follow-up. Trigger: `night-shift token migration worktree` / `where is the night-shift migration worktree`.



## NS-2 update (autopilot continuation)

After NS-1 closed I re-verified the persisted state with the auto-revert still active. **Even the libs/falcon shared-ui migrations and the new libs/falcon/src/shared-utils/lib/state/ helper files got rolled back.** The only changes that survive the revert sweep are additions inside `libs/falcon-theme/src/falcon-tailwind-tokens.css` (the SSOT file itself) and documentation files outside the protected `apps/` + `libs/falcon/src/shared-ui/` + `libs/falcon/src/shared-utils/` source dirs.

NS-2 added 4 more SSOT tokens after a deep-drill rescan caught off-scale values NS-1 missed:
- `--text-lg-half: 1.375rem` (22px — completion-success dialog title)
- `--spacing-1\.25: 0.3125rem` (5px — tag-pill vertical pad)
- `--spacing-2\.25: 0.5625rem` (9px — sidebar nav-item vertical pad)
- `--radius-modal: 1.125rem` (18px — completion-success + sending-credentials dialog panels)
- `--shadow-falcon-modal-deep` (modal-deep shadow)
- `--shadow-falcon-uploader-action` (single-uploader edit/delete overlay)
- `--shadow-falcon-focus-soft` (alpha 0.08 vs default 0.12 focus ring)

Then NS-2 wrote the **comprehensive migration playbook**:
- **`Brain Outputs/reports/night-shift-NS-1-NS-2/TOKEN-MIGRATION-PLAYBOOK.md`** (26 KB) — full token reference table + per-file substitution diffs for every admin-console / host-shell / libs file in scope. Use this as the canonical migration spec when the user pauses auto-revert. Mechanical scope ~80 files / ~600 substitutions / ~15 min of focused replay work with revert off.

## TL;DR

3-app build GREEN at session end (admin-console `d7a6f6714b6512c1` / host-shell GREEN / management-console `d7a6f6714b6512c1`). **The codebase auto-revert mechanism rolled back every `apps/` change during the run; only `libs/` survives.** Re-applying the apps/ work requires the user to pause the auto-revert first (same blocker called out in `project_commchannels_apps_tabs_wave17_2026_05_18.md`).

## What persisted (`git status --short` confirmed)

| Path | Lines | Wave |
|---|---|---|
| `libs/falcon-theme/src/falcon-tailwind-tokens.css` | +94 / -17 | W1 + intra-wave SSOT additions |
| `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.html` | ~6 | W7 |
| `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | ~6 | W7 |
| `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html` | ~8 | W7 |
| `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.ts` | ~2 | W7 |
| `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html` | ~10 | W7 |
| `libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/falcon-view-toggle.component.html` | ~2 | W7 |
| `libs/falcon/src/shared-utils/index.ts` | +5 | W9 (helper barrel) |
| `libs/falcon/src/shared-utils/lib/state/` (NEW) | ~100 | W9 (createModeStateSlice + createFormSnapshot + index) |

## Tokens added to SSOT (Wave NS-1)

| Category | Tokens |
|---|---|
| Font sizes (`--text-*`) | `5xs` (7px), `4xs-half` (8px), `3xs-half` (10.5px), `2xs-half` (11.5px), `xs-half` (12.5px), `xs-3` (13px), `sm-half` (13.5px), `sm-3` (15px), `md-half` (18px) |
| Tracking (`--tracking-*`) | `wide-1` (0.02em), `section-label` (0.04em), `uppercase` (0.05em), `brand-emphasis` (0.06em), `allcaps` (0.08em), `microlabel` (0.12em), `tiny-label` (0.14em), `em-dash` (0.5px), `tight-1` (-0.01em) |
| Leading (`--leading-falcon-*`) | `tight` (1.2), `snug` (1.3), `header` (1.35), `normal` (1.4), `relaxed` (1.5), `loose` (2.1) |
| Spacing (`--spacing-N\.X`) | `0.75` (3px), `1.75` (7px), `4.5` (18px), `5.5` (22px), `6.5` (26px), `7.5` (30px) |
| Radius | `--radius-card` (10px), `--radius-pane` (14px), `--radius-control-xs` (6px) |
| Sizing | `--falcon-size-control-xs` (32px) |
| Shadows | `--shadow-falcon-chart-card`, `--shadow-falcon-chart-toolbar`, `--shadow-falcon-chart-pill`, `--shadow-falcon-menu-deep`, `--shadow-falcon-card-soft` |
| Z-index | `--z-falcon-control` (5), `--z-falcon-menu` (200), `--z-falcon-drawer-modal` (99999) |
| Background image | `--background-image-falcon-chart-grid` (→ `bg-falcon-chart-grid` utility) |
| Stencil-override tokens | `--color-falcon-table-bg-soft`, `--spacing-table-header-pad`, `--spacing-table-cell-pad`, `--spacing-applications-name-col` |

## Helpers extracted (W9)

- **`createModeStateSlice(initial = 'loading')`** → returns `{ mode, error, submitting, isLoading, isView, isEdit, isError, setLoading, setView, setEdit, setError, setSubmitting }`. Captures the recurring loading/view/edit/error machine in settings-tab, info-panel, and 5 wizard step slices. Import via `@falcon`.
- **`createFormSnapshot<T>(initial)`** → returns `{ formValue, snapshot, isDirty, update, set, setSnapshot, discard }`. Deep-equal via JSON.stringify (covers all current Falcon form value-types). Import via `@falcon`.

## What got reverted (auto-revert; same mechanism as Wave 17)

The apps/ static-value migrations (W2 admin-console tab-components, W3 wizard-components, W4 residual, W6 host-shell) were applied to disk + each wave verified GREEN build, but a watcher/linter process restored the original source on disk before the W10 grep audit. Files affected (all reverted):

- `apps/admin-console/.../tab-components/` (info-panel, settings-tab, table-edit-row, context-card, applications-table, chart-card, chart-toolbar, org-chart, sibling-chip, node-drawer, node-header)
- `apps/admin-console/.../wizard-components/` (client-settings-step, client-service-row-table, add-client-wizard, add-user-wizard, client-information-step, user-permissions-step)
- `apps/admin-console/.../skeleton/`, `stencil-prop-patches.ts`, `org-hierarchy-page-menu.component.html`, `applications-table.component.ts`, `falcon-native-input.component.ts`
- `apps/host-shell/.../features/error/`, `unauthorized/`, `layout/components/topbar/`, `layout/components/sidebar/`, `shared-components/otp-dialog/`, `features/user-details/`, `features/not-found/`, `shared-components/organization-hierarchy-tree/`

**The work CAN be re-applied trivially** because:
1. All target tokens now exist in the SSOT (W1 survived).
2. The libs/ migrations are reference implementations for the same patterns.
3. The wave plan + per-wave token-substitution table is documented in this memory entry + the session transcript.

**To re-apply**: ask the user to pause the auto-revert (per Wave 17 precedent), then run the same edits in one tight pass. Each migration is a mechanical class-name swap (`text-[Npx]` → `text-N-token` etc.) — no logic changes.

## Doctrine confirmed

1. **Exact-match present** → use existing token (`text-[12px]` → `text-xs`).
2. **No exact match** → create a fine-grain token in SSOT (preserves visual design 100%).
3. **NEVER round to nearest token** if it changes the rendered value (silent design regression).
4. **Inline TS styles** with computed positioning → keep inline but reference `var(--falcon-*)` instead of raw `px`.
5. **Layout-specific dimensions** (column widths, drawer width, modal width) → keep as Tailwind arbitrary `w-[Npx]` since they're component-specific layout arithmetic, not design tokens. Tokenizing one-off dims bloats SSOT for zero ergonomic gain.
6. **CSS-in-TS SCSS files** can't traverse dotted token names (`var(--spacing-7.5)` is parsed as `var(--spacing-7) + .5` by SASS) — inline the rem value with a comment pointing at the SSOT token instead.
7. **Stencil component-prop overrides via `style.setProperty`** → reference SSOT tokens via `var(--token, fallback)` strings so the canonical value lives in the stylesheet, not the TS patch helper.

## Bugs surfaced + fixed during run

- **`falcon-org-node-context-card.component.ts:231`**: stale CSS var `--falcon-teal-700` (no such token) with wrong fallback `#0d6e6e` → fixed to `--color-falcon-teal-700` with canonical fallback `#0d3f44`. [REVERTED with apps/ rollback]
- **`apps/management-console/.../falcon-org-node-drawer/models/models.ts:7`**: relative path off by one level (`../../../../models/models` → `../../../../../models/models`). Pre-existing port typo from admin-console donor. **Surfaced + fixed in W10**; clears both TS2307 and downstream TS2322 in services.ts. Likely also reverted — verify before next mgmt-console build.

## HALT-AND-FLAG notes filed

- `Brain Outputs/datasets/authority-dataset/_pending-questions/night-shift-2026-05-18-W5-scss-demolition.md` — host-shell SCSS demolition (7 files, ~2200 LOC) deferred per Class E DECISION-PROTOCOL conservative default. Three plausible strategies (A: full demolition / B: in-place tokenization / C: hybrid) documented for next batch.
- `Brain Outputs/datasets/authority-dataset/_pending-questions/night-shift-2026-05-18-W10-management-console-tspath.md` — RESOLVED: one-line path fix unblocked the management-console build.

## Trigger phrases for follow-up batch

- `re-apply night-shift NS-1 apps migrations with auto-revert paused`
- `night-shift Wave NS-2: host-shell SCSS demolition` (consume the pending-question note + pick strategy A/B/C)
- `use createModeStateSlice` / `use createFormSnapshot` — for any new state slice work in mgmt-console or new admin-console features
