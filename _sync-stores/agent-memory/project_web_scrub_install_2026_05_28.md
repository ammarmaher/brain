---
name: web-scrub-install-2026-05-28
description: Web-Scrub isolated scraping/UI-extraction tool installed under Brain SK/tools/web-scrub with Playwright + ts-morph + Crawlee. All three smoke tests PASS at runtime. Falcon Angular workspace untouched per isolation rule. Skill + 3 reports written.
metadata: 
  node_type: memory
  type: project
  originSessionId: ec388185-676b-461f-8e96-12da072b241b
---

Web-Scrub stack installed and verified 2026-05-28.

**Why:** User asked for scrape/scrub/deep-dive workflow. The Brain SK isolated-tool rule ([BRAIN-SK] `CLAUDE.md` — "Isolated tool folders … never added to the Falcon Angular workspace") forbade installing into `falcon-web-platform-ui`. New isolated tool created at `C:\Falcon\Brain SK\tools\web-scrub\` mirroring the `falcon-eyes` pattern.

**How to apply:** When the user says scrape/scrub/inspect/deep-dive/react-map, run from `C:\Falcon\Brain SK\tools\web-scrub`: `npm run scrape -- --url <url>` | `npm run deep-dive -- --url <url> --selector <css>` | `npm run react-map -- --component <Name>`. Default React project = `C:\Falcon\Source_of_truth_theme`. Outputs under `Brain Outputs/reports/web-scrub/<stamp>_<slug>/`. Hand off to react-to-angular / falcon-eyes / visual-source-of-truth / falcon-component-creation for downstream work — web-scrub stops at evidence.

**Stack:** Playwright 1.60.0 (live truth + screenshots + computed styles + states), ts-morph 24 (React source truth), Crawlee 3.13+ (optional multi-page), tsx 4 + TypeScript 5.6.

**Runtime verification:** All 3 smokes PASS — Playwright launches chromium + reads innerText, ts-morph parses sample.tsx + extracts Hello/HelloProps/useState, Crawlee crawls local http server (1/1 succeeded). Crawlee rejects `data:` URLs — smoke uses a local Node http server instead.

**Isolation proof:** `falcon-web-platform-ui/package.json` mtime 2026-05-19 (untouched); `package-lock.json` mtime 2026-05-21 (untouched); grep for playwright/ts-morph/crawlee in Angular package.json returns 0. 323 packages + 162 MB confined to `tools/web-scrub/node_modules/`.

**Risks logged:** 13 moderate `file-type` advisories (GHSA-5v7r-6r5c-r473, CWE-835, CVSS 5.3) — transitive via Crawlee, not exploitable in our use (we don't parse ASF files). Documented; no action.

**Gaps reported (not fixed):**
- G-1: Master Index has no routing row for scrape/deep-dive triggers — recommended addition, did not modify the high-traffic scanned file
- G-2: falcon-eyes README missing "See also" cross-ref to web-scrub — polish task

**Compatibility:** 9 sibling skills audited ([[react-to-angular]], [[html-to-angular]], [[screenshot-to-angular]], [[falcon-eyes]], page-learning, falcon-component-creation, [[visual-source-of-truth-analysis]], angular-developer) — zero conflicts. web-scrub slots as the *evidence-capture* layer upstream of conversion skills.

**Files:** `Brain SK/tools/web-scrub/{package.json,tsconfig.json,web-scrub.config.json,README.md,src/scrape-url.ts,src/deep-dive-component.ts,src/react-map.ts,src/smoke/{playwright,ts-morph,crawlee}-smoke.ts}` + `Brain SK/skills/web-scrub/SKILL.md` + `Brain Outputs/reports/web-scrub-setup-2026-05-28/{01-installation-verification,02-skill-compatibility,03-scraping-readiness}.md`.

**No commits made.** Working tree dirty awaiting explicit user "commit" / "push" instruction per Falcon hard-rule.
