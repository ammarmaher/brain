---
name: project_fe_library_npm_audit_3plans_2026_07_06
description: "Read-only FE audit of falcon-web-platform-ui for npm-library readiness/security/rule-compliance — 3 scored plans + HTML report, all 2026-05-29 regressions confirmed fixed"
metadata: 
  node_type: memory
  type: project
  originSessionId: 40dd8f5b-d742-4886-83ee-cebc7fabacfa
---

🟢 REPORT DELIVERED 2026-07-06 (read-only audit; no source changed). User asked Fable to learn the FE rules, audit all FE code for a "perfect npm-shareable library," and produce 3 scored plans + an HTML enhancement report.

**Deliverables (both in `C:\Falcon\reports\fe-library-npm-audit-2026-07-06\`):**
1. `FE-LIBRARY-ENHANCEMENT-PLAN.html` — the audit + 3 scored plans + rule book + evidence (self-contained, print/PDF-ready).
2. `EXECUTION-PLAYBOOK.html` — task-level execution version: same 3 plans → 18 waves → 48 tasks (each with exact file / change / done-when / effort) + 5 pre-start decisions D-1..D-5 (recommended defaults: D-1 private Azure feed, D-2 ng-packagr now, D-3 keep localStorage+CSP, D-4 confirm BE revoke endpoint, D-5 delete dead legacy screens) + Sprint A/B/C checklist + per-plan Definition of Done. Both validated in-browser (0 console errors). Serve via launch.json config `fe-audit-report` (python http.server :5199) — a new entry I added to `C:\Falcon\.claude\launch.json`.

**Method:** 4 parallel read-only auditors (rule-book corpus / npm publishability 17 checks / security 18 checks / rule compliance 12 rules). Every finding `file:line`-cited. Scores = checklist pass-rates (PASS 1 / PARTIAL .5 / FAIL 0).

**The 3 plans + scores:**
- Plan 1 "Ship it" — npm-library readiness **65% (11/17)** → 95%. Blockers: `private:true`+no-license on core/tokens/theme/vue; `./angular`/`./tailwind` exports point at `src` excluded by `files:[dist,loader]`; unpublished `@falcon/studio/runtime` dep in 10 wrapper files; `libs/falcon` has NO package.json (fused w/ 15 HttpClient services); no publish pipeline (only `changeset:publish-dry`, `.npmrc` no registry); vue target drift; no Angular peerDeps; ~2.6% spec coverage.
- Plan 2 "Lock it down" — security **50% (9/18)** → 90%. CRITICAL S10: zero security headers (no CSP in nginx.conf/docker/nginx-spa.conf). Stored-XSS S2: `innerHTML={ext.render(row)}` in `falcon-table-tw.tsx:840`/`falcon-table.tsx:378` fed unescaped user data (LIBRARY fix). localStorage tokens; interceptor no origin allowlist; npm audit = 38 advisories (1 crit/10 high incl direct @angular).
- Plan 3 "Clean house" — rule compliance **46% (5.5/12)** → 85%. Systemic: 501 raw-hex/98 files, 224 native controls/72 files, 10 tables default 20/25 not 10, HttpClient in `libs/falcon` (6 files), ~1,796 wave-comment lines/587 files. Gates are diff-scoped so this debt is grandfathered/invisible to CI.

**Blended overall: 54% (25.5/47).**

**FE rule book:** 55 standing rules / 12 themes; **13 machine-enforced** by `tools/gates/gate-01..13`, 42 convention-only. SoT: `[BRAIN-OUT] understanding/frontend/ANGULAR_AND_TAILWIND_RULES.md`, `TOKEN_TAXONOMY.md`, `strategies/falcon-component-creation/01-CANONICAL_PATTERN.md`.

**Freshness win — all 2026-05-29 regressions now FIXED:** circular dep (falcon↔ui-core-angular, was 80 sites → 0), 6 token files `:root`→`:where()`, `tsconfig.base.json:7` `node`→`bundler`, 8 missing i18n keys, zoneless CD subscribe bugs, `falconDataTableCell field=` misuse. Security findings (F1 visual-test bypass, F2 cleartext pwd, F5 no-revoke) mostly STILL PRESENT; F6 fail-open PES fixed in mgmt-console only, admin still fail-open (`add-user-wizard.component.ts:322-339`).

Recommended sequencing = Sprint A (all small: P2 headers+XSS+cleartext+fail-closed, P1 licenses) → B (packaging) → C (split libs/falcon = P1·W4=P3·W4, gate promotion, publish). Related: [[feedback_api_code_stays_in_host_app]], [[feedback_falcon_custom_library_mandatory]].
