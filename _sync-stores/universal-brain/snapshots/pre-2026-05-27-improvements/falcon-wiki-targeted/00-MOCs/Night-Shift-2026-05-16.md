---
type: moc
status: complete
date: 2026-05-16
orchestrator: Adnan / Jakco
scope: full-front-end-audit-and-fix
fixes-applied: 158
builds-green: 4/4
findings-total: 1450
audits: 5
fix-batches: 4
rollbacks: 0
tags: [moc, night-shift, audit, status/complete, scope/full-stack]
---

# Night Shift — Full Front-End Audit (2026-05-16)

> [!tldr]
> [BRAIN-OUT] Workspace-wide front-end audit + fix run. 5 senior-architect audits ran in parallel against `libs/falcon-ui-core` + 3 apps + cross-cutting. **All 4 builds finished GREEN. Zero rollbacks.** Token-reality, z-index hacks, dead code, redundant `standalone: true`, RTL physical→logical Tailwind classes — all addressed at safe-fix tier. Six larger refactors documented as gap notes for scoped follow-up waves.

## Reports (read in this order)

1. [BRAIN-OUT] Plan — `C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\00-PLAN.md`
2. [BRAIN-OUT] Rules digest — `01-rules-digest.md` (38 rules · 6 P0 / 15 P1 / 17 P2)
3. [BRAIN-OUT] Token registry — `02-token-registry.md` (3,485 vars · 2,251 Tailwind class prefixes)
4. [BRAIN-OUT] Aggregation + fix plan — `05-fixes/00-AGGREGATION-AND-FIX-PLAN.md`
5. [BRAIN-OUT] Audit reports — `04-audits/{libs-falcon-ui-core,apps-admin-console,apps-host-shell,apps-management-console,cross-cutting}.md`
6. [BRAIN-OUT] Fix logs — `05-fixes/F{1..4}-*.md`

## Per-scope summary notes

- [[35-Libraries/falcon-ui-core-Night-Shift-2026-05-16]] — library audit + F1 fix log
- [[20-Pages/admin-console-Night-Shift-2026-05-16]] — admin-console audit + F2 fix log
- [[20-Pages/host-shell-Night-Shift-2026-05-16]] — host-shell audit + F3 fix log
- [[20-Pages/management-console-Night-Shift-2026-05-16]] — management-console audit + F4 fix log

## Open gaps from this run

- [[70-Gaps/GAP-NS01-Input-Output-Codemod]] — 871 `@Input/@Output` decorators → `input()/output()` function form (libs/falcon-ui-core)
- [[70-Gaps/GAP-NS02-SCSS-styleUrls-Purge]] — 21 SCSS files + 17 `styleUrls: [` arrays + 2 non-shim `styleUrl` declarations
- [[70-Gaps/GAP-NS03-Host-Shell-Auth-Rebuild]] — 5 SCSS files (1,720+ lines), 163 phantom `--login-*` tokens, raw `<input>`/`<button>` bypassing Falcon library
- [[70-Gaps/GAP-NS04-OTP-Dialog-Rebuild]] — single-file rebuild for `apps/admin-console/.../verify/otp-dialog.component.html`
- [[70-Gaps/GAP-NS05-Library-First-Refactors]] — 11 raw `<input>` + 1 hand-rolled toggle + hand-rolled topbar menu need Falcon equivalents
- [[70-Gaps/GAP-NS06-Phantom-Semantic-Tokens]] — `bg-falcon-warning-*`, `bg-falcon-success-*`, `text-falcon-danger-*` etc. resolve to nothing

## Headline numbers

- [BRAIN-OUT] Files in scope (lib + 3 apps): ~757 (libs/falcon-ui-core 486 · admin-console 88 · host-shell 172 · management-console 11)
- [BRAIN-OUT] Total findings across 5 audits: ~1,450 (P0 + P1 + P2)
- [BRAIN-OUT] Fixes applied tonight: 158 individual fix operations across 14 fix groups (F1: 14 groups · F2: 7 · F3: 4 · F4: 3)
- [BRAIN-OUT] Builds green: 4/4 (`falcon-ui-core`, `admin-console`, `host-shell`, `management-console`)
- [BRAIN-OUT] Rollbacks: 0
- [BRAIN-OUT] Memory misalignments corrected: 1 — `project_org_hierarchy_html_conversion` claimed 91 files in `apps/management-console/.../organization-hierarchy-page`; disk reality is 11 files total in management-console, active work lives in `apps/admin-console`

## Tier 0 critical-safety fixes that landed

- [CODE] `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/...tsx:308` — `z-[1000]` → `z-falcon-modal` (canonical 1050 tier)
- [CODE] `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css:144` — magic `9999` → `var(--falcon-overlay-z-index)` (1400)
- [CODE] `apps/host-shell/src/app/remote-route.service.ts` + `remote-config.ts` — dead duplicates deleted
- [CODE] `apps/admin-console/src/.../falcon-status/` — Wave 19 dead component folder deleted
- [CODE] `apps/management-console/src/bootstrap.ts:28-32` — router event firehose + `: any` removed

## Standing rules upheld

- [MEMORY] `feedback_no_commit_no_push_strict_2026_05_02` — zero commits, zero pushes
- [MEMORY] `feedback_build_must_be_green` — every fix batch verified GREEN before next batch
- [MEMORY] `feedback_strict_task_scope` — no out-of-scope edits; excluded files retained pre-fix mtime+size
- [MEMORY] `feedback_no_inline_styles_tokens_only` — tokens-only enforced where touched; SCSS purge deferred as GAP

## Cross-references

- [VAULT] Vault root: `C:\Falcon\falcon-wiki\`
- [BRAIN-OUT] Reports root: `C:\Falcon\Brain Outputs\reports\night-shift-2026-05-16\`
- [CODE] Workspace: `C:\Falcon\Falcon\falcon-web-platform-ui\`
