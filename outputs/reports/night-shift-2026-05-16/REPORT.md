---
title: Night Shift — Full Front-End Audit (Master Report)
date: 2026-05-16
orchestrator: Adnan / Jakco
mode: autonomous (auto-pilot)
status: complete
builds-green: 4 / 4
rollbacks: 0
fix-operations: 158
audit-findings: ~1450
deferred-gaps: 6
vault-notes-written: 11
memory-updates: 2
---

# Night Shift — Full Front-End Audit (2026-05-16)

> **TL;DR** — Workspace-wide front-end audit + safe-fix run. 5 parallel senior-architect agents audited `libs/falcon-ui-core` + `apps/{admin-console,host-shell,management-console}` + cross-cutting workspace concerns against a 3,485-var canonical token registry and a 38-rule digest synthesised from every governing front-end rule document. **All 4 `nx build` runs finished GREEN. Zero rollbacks. Working tree dirty (no commits, no pushes per standing rule).** Six larger refactors documented as gap notes in the Obsidian vault for follow-up waves.

---

## 1. Mission

The user requested an autonomous "night shift mode" that walks all front-end code, applies every Falcon rule we have, verifies that every token referenced actually exists (no phantom tokens), removes hardcoded z-index hacks in favour of the canonical ladder, finds and fixes bugs at a safe-tier level, and writes new knowledge back into Obsidian for each folder.

**Scope locked:**
- IN: `libs/falcon-ui-core` (Stencil skeletons + Angular wrappers), `libs/falcon` barrel, `libs/falcon-theme`, `libs/falcon-ui-tokens`, `apps/admin-console`, `apps/host-shell`, `apps/management-console`.
- OUT: `libs/falcon-ui-react`, `libs/falcon-ui-vue`, `libs/falcon-ui-showcase-data`, `libs/falcon-studio`, `libs/sdk`, demos, generated `dist/`, `WebstormProjects\falcon-web-platform-ui` (forbidden duplicate per memory).

---

## 2. Method

Six waves, all artifacts persisted at `C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\`.

### Wave 1 — Upstream inputs (parallel, read-only)
- **Token Registry Builder** — parsed 60+ token CSS files and Tailwind v4 `@theme` blocks. Output: 3 artifacts.
  - `02-token-registry.json` — machine-readable, every declaration with file:line:scope.
  - `02-token-registry.md` — human-readable, families grouped, z-index ladder + dark-theme cascade documented.
  - `02-token-registry-quick-grep.txt` — **3,485 unique CSS var names + 2,251 Tailwind class prefixes**, one per line, for grep-based reality checks downstream.
- **Rules Digest Compiler** — read every governing rule doc + memory feedback. Output: `01-rules-digest.md` with **38 deduplicated rules across 3 severity tiers (6 P0 / 15 P1 / 17 P2)**.

### Wave 2 — Senior-Architect audits (5 parallel agents, read-only)
| Agent | Scope | Files | P0 | P1 | P2 |
|---|---|---|---:|---:|---:|
| A1 | `libs/falcon-ui-core` | 486 | 91 (114 sites) | 996 | 7 |
| A2 | `apps/admin-console` | 88 | 19 | 47 | 30 |
| A3 | `apps/host-shell` | 172 | ~30 sites / 6 classes | ~230 sites / 23 classes | ~100 sites / 26 classes |
| A4 | `apps/management-console` | 11 | 1 | 0 | 3 |
| A5 | cross-cutting workspace-wide | n/a | — | — | 152 total findings |

Audit reports in `04-audits/*.md`. Every finding carries `file:line` + quote evidence.

### Wave 3 — Aggregation & fix tiering
Master plan written to `05-fixes/00-AGGREGATION-AND-FIX-PLAN.md`. Five fix tiers (T0 critical safety / T1 token reality / T2 z-index canonicalisation / T3 cleanliness / T5 Obsidian write-back). T4 holds large refactors deferred to follow-up waves with documented gap notes.

### Wave 4 — Fix batches (4 parallel agents, non-overlapping scopes)
Each fix agent: read brief → apply listed fixes (Read before Edit) → run `nx build <scope> --skip-nx-cache` → roll back on red → write fix log.

### Wave 5 — Build verification
All 4 builds confirmed GREEN inside the respective fix-agent runs. Consolidated log at `06-build-verify/build-log.md`.

### Wave 6 — Obsidian write-back
11 vault notes (~8,468 words) written by the W1 agent following Templater conventions, source-prefix rule, and Dataview-friendly frontmatter. 2 memory files updated (1 new, 1 stale-flag added).

---

## 3. Fixes applied (158 operations)

### Tier 0 — Critical safety
| Fix | File | Before | After | Status |
|---|---|---|---|---|
| F1.1 | `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx:308` | `z-[1000]` (below drawer/toast tier) | `z-falcon-modal` (canonical 1050) | applied |
| F1.2 | `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css:144` | `--falcon-org-hierarchy-ctx-menu-z-index: 9999` (magic) | `var(--falcon-overlay-z-index)` (1400, canonical top) | applied |
| F1.3 | `libs/falcon-ui-core/.../falcon-form-validate.directive.ts:45` | stale "PrimeNG" comment | rewritten to "Falcon shadow/native inputs" | applied |
| F2.2 | `apps/admin-console/.../components/falcon-status/` | dead folder | deleted (zero workspace importers confirmed) | applied |
| F3.1 | `apps/host-shell/src/app/remote-route.service.ts` | dead duplicate (canonical at `app/core/services/`) | deleted | applied |
| F3.1 | `apps/host-shell/src/app/remote-config.ts` | dead duplicate | deleted | applied |
| F4.1 | `apps/management-console/src/bootstrap.ts:28-32` | unconditional `(ev: any) => console.log('ROUTER EVENT →', ev)` firehose | deleted + orphan `Router`/`ApplicationRef` imports removed | applied |

### Tier 1 — Token reality
| Fix | File | Before | After |
|---|---|---|---|
| F2.1 (×3) | `apps/admin-console/.../falcon-org-chart.component.html` | `var(--falcon-neutral-150 / -400 / --falcon-teal-700)` | `var(--color-falcon-*)` family (registry-verified) |
| F2.7 (flag-only) | `user-details-page.component.html`, `falcon-org-info-panel.component.html` | `bg-falcon-warning-*`, `text-falcon-success-*`, `text-falcon-danger-*`, `text-falcon-red-600` (phantom) | TODO comment added; preserved pending Noor palette mapping → `GAP-NS06` |

### Tier 2 — z-index canonicalization (covered by F1.1, F1.2 above)
11 local stacking-context sites in `libs/falcon-ui-core` (single-digit z-index inside positioned subtrees of multi-select / stepper / table / tree-table / tree / organization-hierarchy / insufficient-balance-dialog) annotated with terse `// local stacking context — not in global z-falcon-* ladder` comments rather than rewritten — they are not global ladder participants.

### Tier 3 — Cleanliness
| Fix | Scope | Count |
|---|---|---:|
| F1.6 | `libs/falcon-ui-core` + `libs/falcon` — redundant `standalone: true,` removal | 95 lines / 88 files |
| F2.4 | `apps/admin-console` — same | 28 lines |
| F3.2 | `apps/host-shell` (non-auth only) — same | 51 lines (24 real decorators + 27 in `skeletons.ts`) |
| F4.2/F4.3 | `apps/management-console` — same | 1 line |
| F2.5 | `apps/admin-console` — physical→logical Tailwind for RTL | 13 edits / 8 files (`pl-→ps-`, `pr-→pe-`, `ml-→ms-`, `mr-→me-`, `text-left→text-start`, `text-right→text-end`, `left-→start-`, `right-→end-`, `border-l→border-s`, `origin-top-left→origin-top-start`) |
| F2.6 / F4.1 | console.log residue removed | 8 sites total |

**Total fix operations across all batches: 158.**

---

## 4. Builds — all green, zero rollbacks

| Scope | Result | Duration | Hash | Rollbacks |
|---|---|---|---|---:|
| `libs/falcon-ui-core` | **GREEN** | ~39s | (Stencil) | 0 |
| `apps/admin-console` | **GREEN** | 20.584s | `2ed3bec41a1ab6af` (main.js 334.67 kB gz, under Gate-11 340 kB budget) | 0 |
| `apps/host-shell` | **GREEN** | 15.8s | `d9e80f287597d3e9` | 0 |
| `apps/management-console` | **GREEN** | 17.766s | `9ff968da8cf6f3d3` | 0 |

Only pre-existing warnings remain (Stencil `scrollHeight` reserved-prop, unused `SvgIconComponent` import, environment unused). No new warnings introduced.

---

## 5. Deferred to follow-up waves (documented as gap notes)

These were intentionally NOT fixed tonight because they're too risky for parallel batches or require UX consultation. Each has a vault gap note for tracking.

| Gap | Severity | Scope | Note |
|---|---|---|---|
| `[[70-Gaps/GAP-NS01-Input-Output-Codemod]]` | medium | 871 sites in `libs/falcon-ui-core` | `@Input/@Output` decorator → `input()/output()` function-form codemod. Mechanical but high-volume; needs staged ts-morph pass per component family. |
| `[[70-Gaps/GAP-NS02-SCSS-styleUrls-Purge]]` | high | 40 sites workspace-wide | 8 lib `.scss` + 13 app `.scss` + 17 `styleUrls: [` arrays + 2 standalone `styleUrl` + 2 `project.json` `inlineStyleLanguage: "scss"` settings. Deletion needs `project.json` edits in lockstep — too risky parallel. |
| `[[70-Gaps/GAP-NS03-Host-Shell-Auth-Rebuild]]` | high | `apps/host-shell/src/app/features/auth/` | 5 SCSS files (~1,720 lines) + **163 phantom `--login-*` tokens** + raw `<input>`/`<button>` bypassing Falcon library. Multi-day rebuild estimate (3-5 days). |
| `[[70-Gaps/GAP-NS04-OTP-Dialog-Rebuild]]` | medium | `apps/admin-console/.../otp-dialog.component.html` | Inline `<style>` block + 9 inline `style="..."` attrs + 12 hardcoded font-sizes. Single-PR rebuild on Tailwind utilities + canonical typography tokens. |
| `[[70-Gaps/GAP-NS05-Library-First-Refactors]]` | medium | admin-console + host-shell | 11 raw `<input>` + 1 hand-rolled toggle + hand-rolled topbar menu → Falcon equivalents (`<falcon-input>`, `<falcon-switch>`, `<falcon-menu>`). Each requires UX sign-off. |
| `[[70-Gaps/GAP-NS06-Phantom-Semantic-Tokens]]` | high | workspace-wide | `bg-falcon-warning-100/200`, `text-falcon-success-700`, `text-falcon-danger-600`, `--falcon-status-danger/success` — none in registry. UX decides: extend Noor palette with warning/success/danger intents OR remap usages to existing palette names. |

---

## 6. Obsidian vault write-back

All vault writes at `C:\Falcon\falcon-wiki\`. Templater placeholders rendered to final form.

| Note | Folder | Purpose |
|---|---|---|
| `Night-Shift-2026-05-16.md` | `00-MOCs/` | Master MOC linking all night-shift outputs |
| `falcon-ui-core-Night-Shift-2026-05-16.md` | `35-Libraries/` | Lib audit summary + applied fixes + open issues |
| `admin-console-Night-Shift-2026-05-16.md` | `20-Pages/` | App audit summary |
| `host-shell-Night-Shift-2026-05-16.md` | `20-Pages/` | App audit summary (shared-components canonical reference + auth regression carve-out) |
| `management-console-Night-Shift-2026-05-16.md` | `20-Pages/` | App audit summary + disk-mismatch correction note |
| `GAP-NS01..06` | `70-Gaps/` | 6 gap notes (above) |

Every note follows the vault convention: valid YAML frontmatter, source-prefix rule on every fact, `[[...]]` cross-links, Dataview-friendly tags.

---

## 7. Memory updates

| File | Action |
|---|---|
| `project_night_shift_2026_05_16.md` | **CREATED** — full Night Shift record + trigger phrase + learnings |
| `MEMORY.md` index | Top-of-Platform-Knowledge entry added pointing to the new memory |
| `project_org_hierarchy_html_conversion.md` | **⚠️ DISK MISMATCH WARNING** added at top — memory claimed 91 files in `apps/management-console/.../organization-hierarchy-page` but 2026-05-16 disk verification found that path EMPTY (0 files). The actual org-hierarchy work is in `apps/admin-console/src/app/features/org-hierarchy-page/`. Existing content preserved; warning header instructs future sessions to verify disk before resuming any wave. |

---

## 8. Notable observations from the audit

- **PrimeNG purge holds.** Cross-cutting CC2 found exactly 1 stale comment, zero functional violations. The 2026-05-10 total removal program is intact.
- **Host-Shell shared-components layer is exemplary.** `<app-organization-hierarchy-tree>` and `do-payment-priority-popup` are the canonical references for the library-skeleton + app-wrapper pattern (memory `feedback_library_skeleton_app_api`). Modern signals, OnPush, `input()`/`output()`, no constructor injection.
- **Auth feature in host-shell is a regression.** 5 SCSS files, 163 phantom `--login-*` tokens, raw `<input>`/`<button>` bypassing the Falcon library. Documented as `GAP-NS03`. Untouched this run by exclusion — touching it would have created multi-fix dependencies in a single parallel batch.
- **The `--z-falcon-*` Tailwind ladder is already correct in the token registry** (1000-1070 in 10-step increments for dropdown/fixed/modal/overlay/popover/sticky/tooltip). The component-level `--falcon-overlay-z-index: 1400` sits above the modal tier as the absolute portal top. **The cleanup was about migrating individual component hits onto the existing ladder, not redesigning the ladder.**
- **Tailwind v4 logical-property utilities work** in this workspace — `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `text-start`, `text-end`, `border-s`, `origin-top-start` all resolved cleanly under admin-console build.
- **JSX comment syntax trap surfaced.** In `*-tw.tsx` files, `//` comments BETWEEN JSX attributes inside a JSX element are NOT valid syntax — must use `/* */` or `{/* */}`. Captured in the new memory.

---

## 9. Standing rules — honored

- ✅ No commits made.
- ✅ No pushes made.
- ✅ Working tree dirty across all 4 scopes (per standing rule).
- ✅ Builds green per app — never shipped red.
- ✅ Tokens-only enforced — every substitution registry-verified.
- ✅ Falcon library first — flag-only on library-first GAPs (deferred to GAP-NS05).
- ✅ No PrimeNG / PrimeIcons / SCSS / component CSS introduced.
- ✅ Forbidden paths untouched (no edits in `WebstormProjects\falcon-web-platform-ui`, demos, deferred org-hierarchy chrome subareas, host-shell auth folder).

---

## 10. How to resume

**To run another Night Shift cycle (audit only or audit + fixes):** open a new Claude session at `C:\Falcon` and paste:
```
continue Night Shift fix wave
```
or for a focused gap follow-up:
```
work GAP-NS01 — Input/Output codemod
```
```
work GAP-NS02 — SCSS purge wave
```
```
work GAP-NS03 — Host-Shell auth rebuild
```

The session should:
1. Read `C:\Users\User\.claude\projects\C--Falcon\memory\project_night_shift_2026_05_16.md`
2. Read `C:\Falcon\falcon-wiki\00-MOCs\Night-Shift-2026-05-16.md`
3. Read the relevant gap note in `70-Gaps/`
4. Re-use the token registry + rules digest as upstream inputs (still valid for the next 1-2 weeks; regenerate if tokens change materially)
5. Stop and ask the user before any commit / push

---

## 11. Output tree

```
C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\
├── 00-PLAN.md
├── 01-rules-digest.md            (38 rules)
├── 02-token-registry.json        (2.8 MB)
├── 02-token-registry.md          (93 KB)
├── 02-token-registry-quick-grep.txt   (169 KB · 3,485 vars + 2,251 classes)
├── 04-audits/
│   ├── libs-falcon-ui-core.md
│   ├── apps-admin-console.md
│   ├── apps-host-shell.md
│   ├── apps-management-console.md
│   └── cross-cutting.md
├── 05-fixes/
│   ├── 00-AGGREGATION-AND-FIX-PLAN.md
│   ├── F1-libs-falcon-ui-core.md
│   ├── F2-apps-admin-console.md
│   ├── F3-apps-host-shell.md
│   └── F4-apps-management-console.md
├── 06-build-verify/
│   └── build-log.md
├── 07-obsidian-writebacks/       (folder reserved for future write-back ledgers)
└── REPORT.md  ← this file
```

```
C:\Falcon\falcon-wiki\
├── 00-MOCs/Night-Shift-2026-05-16.md
├── 20-Pages/
│   ├── admin-console-Night-Shift-2026-05-16.md
│   ├── host-shell-Night-Shift-2026-05-16.md
│   └── management-console-Night-Shift-2026-05-16.md
├── 35-Libraries/falcon-ui-core-Night-Shift-2026-05-16.md
└── 70-Gaps/
    ├── GAP-NS01-Input-Output-Codemod.md
    ├── GAP-NS02-SCSS-styleUrls-Purge.md
    ├── GAP-NS03-Host-Shell-Auth-Rebuild.md
    ├── GAP-NS04-OTP-Dialog-Rebuild.md
    ├── GAP-NS05-Library-First-Refactors.md
    └── GAP-NS06-Phantom-Semantic-Tokens.md
```

---

**Night Shift verdict: ✅ complete. 4 / 4 builds green. 0 rollbacks. 158 fixes applied. 6 gaps documented. Vault enriched. Memory aligned with disk reality.**
