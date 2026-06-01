---
name: project_brain_sk_stats_charts_skills_2026_05_19
description: Brain SK gained Statistical Intelligence + Executive Insight Reports skills with mandatory chart provenance
metadata: 
  node_type: memory
  type: project
  originSessionId: 0cfdf99c-f609-4845-bbb9-99f296b93f60
---

🟢 2026-05-19. Brain SK (`C:\Falcon\Brain SK`) now ships two shared-domain
reporting skills — committed + pushed as `f78e359` on `github.com/ammarmaher/brain`.

- **Statistical Intelligence** — `skills/statistical-intelligence/SKILL.md`, slash `/calculate-statistics`. KPIs / percentages / scores / risk / trends. Output `Brain Outputs/reports/statistics/<name>-<YYYY-MM-DD-HHmm>/`.
- **Executive Insight Reports** — `skills/executive-insight-reports/SKILL.md`, slash `/create-executive-report`. Chart-heavy boss reports. MUST call Statistical Intelligence first for any numbers. Output `Brain Outputs/reports/executive-insights/<name>-<YYYY-MM-DD-HHmm>/`.
- New 5th Brain SK domain: `domains/shared/` — domain entries are short pointers to the canonical `skills/` (convention matches `domains/fullstack/pr-review/`).
- Isolated tool folders `tools/statistics/` + `tools/insight-reports/` — dependency PLANS only, not npm-installed.
- **Chart Provenance & Generation Trace (MANDATORY)**: every run/report writes `REPORT_GENERATION_TRACE.md` + `CHART_PROVENANCE.md`; report templates at `skills/executive-insight-reports/templates/`.
- Routing wired in `CLAUDE.md`, `shared/SKILL_ROUTING_MANIFEST.md`, `domains/README.md`, `shared/obsidian-auto-link/OBSIDIAN_AUTO_LINK_PROTOCOL.md`, Obsidian `STATISTICS_INDEX.md` + `EXECUTIVE_REPORTS_INDEX.md`.
- Verification report: `Brain Outputs/reports/stats-charts-skill-verification-2026-05-19/STATS_CHARTS_SKILL_VERIFICATION.md`.
