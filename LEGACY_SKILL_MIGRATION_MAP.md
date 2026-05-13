# Legacy Skill Migration Map

This file keeps v7 skills visible inside Brain SK v0.1. No old skill is intentionally deleted; old skills are either promoted into v8 routing, kept as legacy callable skills, or archived under `legacy/v7-import/` for reference.

## Routing principle

| Source | Use |
|---|---|
| `skills/` v8 skills | Primary route for new tasks |
| `skills/legacy-v7/` | Existing Falcon frontend/Angular/RAGE/performance/sound/business skills |
| `skills/brand/` | ChatGPT / Claude / Gemini role-specific skills |
| `skills/imported-business/` | Imported PRD/business/test skills |
| `legacy/v7-import/` | Full v7 reference content, except old generated archive data |

## Discovered skill files

| # | Skill | Path |
|---:|---|---|
| 1 | Falcon Genius Brain v7 | `legacy/v7-import/Skill.md` |
| 2 | brain | `legacy/v7-import/Skill.original.md` |
| 3 | Falcon Brain Genius v4 | `legacy/v7-import/Skill.v4.backup.md` |
| 4 | Falcon Genius Brain v5 | `legacy/v7-import/Skill.v5.backup.md` |
| 5 | Brand Skill: ChatGPT Strategic Commander | `legacy/v7-import/brand-skills/chatgpt-strategic-commander/SKILL.md` |
| 6 | Brand Skill: Claude Tactical Engineer | `legacy/v7-import/brand-skills/claude-tactical-engineer/SKILL.md` |
| 7 | Brand Skill: Gemini Verification Officer | `legacy/v7-import/brand-skills/gemini-verification-officer/SKILL.md` |
| 8 | business-pipeline | `legacy/v7-import/reference/imported-business-skills/business-skills/business-pipeline/Skill.md` |
| 9 | domain-glossary | `legacy/v7-import/reference/imported-business-skills/business-skills/domain-glossary/Skill.md` |
| 10 | module-catalog | `legacy/v7-import/reference/imported-business-skills/business-skills/module-catalog/Skill.md` |
| 11 | prd-knowledge | `legacy/v7-import/reference/imported-business-skills/business-skills/prd-knowledge/Skill.md` |
| 12 | test-case-authoring | `legacy/v7-import/reference/imported-business-skills/business-skills/test-case-authoring/Skill.md` |
| 13 | Skill: AI Deep Tri-Mindset Orchestrator | `legacy/v7-import/skills/00-master-orchestrator/SKILL.md` |
| 14 | Skill: ChatGPT / Codex Business Analyst, Planner, Prompt Polisher, and Business Test Author | `legacy/v7-import/skills/10-chatgpt-codex-business-analyst/SKILL.md` |
| 15 | Skill: Claude Implementation Engineer for Enterprise Angular/Nx/PrimeNG | `legacy/v7-import/skills/20-claude-implementation-engineer/SKILL.md` |
| 16 | Skill: Gemini Visual, Chart, Dashboard, and QA Validator | `legacy/v7-import/skills/30-gemini-visual-chart-qa/SKILL.md` |
| 17 | Skill: Business Knowledge Pipeline | `legacy/v7-import/skills/40-business-knowledge-pipeline/SKILL.md` |
| 18 | Skill: Sound Announcer and Text-to-Speech Completion Signatures | `legacy/v7-import/skills/50-sound-announcer/SKILL.md` |
| 19 | Falcon Project Abstraction Understanding Skill | `legacy/v7-import/skills/60-falcon-project-abstraction-understanding/SKILL.md` |
| 20 | Falcon React-to-Angular Screen Composer — RAGE MODE | `legacy/v7-import/skills/61-falcon-react-to-angular-rage-mode/SKILL.md` |
| 21 | Rage HTML to Falcon Angular Skill | `legacy/v7-import/skills/62-rage-html-to-falcon-angular/SKILL.md` |
| 22 | Skill: PRD Intelligence and Gap Engine | `legacy/v7-import/skills/63-prd-intelligence-and-gap-engine/SKILL.md` |
| 23 | Skill: Business Rule Validation Enforcement Engine | `legacy/v7-import/skills/64-business-rule-validation-enforcement-engine/SKILL.md` |
| 24 | Falcon PES Architecture Enforcement Skill | `legacy/v7-import/skills/65-falcon-pes-architecture-enforcement/SKILL.md` |
| 25 | Retest / Restructure / Redraw Enforcement Skill | `legacy/v7-import/skills/66-retest-restructure-redraw-enforcement/SKILL.md` |
| 26 | Falcon Bundle Performance Architect Skill | `legacy/v7-import/skills/67-falcon-bundle-performance-architect/SKILL.md` |
| 27 | backend-api-understanding | `skills/backend-api-understanding/SKILL.md` |
| 28 | Brand Skill: ChatGPT Strategic Commander | `skills/brand/chatgpt-strategic-commander/SKILL.md` |
| 29 | Brand Skill: Claude Tactical Engineer | `skills/brand/claude-tactical-engineer/SKILL.md` |
| 30 | Brand Skill: Gemini Verification Officer | `skills/brand/gemini-verification-officer/SKILL.md` |
| 31 | business-understanding | `skills/business-understanding/SKILL.md` |
| 32 | component-capability-upgrade | `skills/component-capability-upgrade/SKILL.md` |
| 33 | html-to-angular | `skills/html-to-angular/SKILL.md` |
| 34 | business-pipeline | `skills/imported-business/business-pipeline/Skill.md` |
| 35 | domain-glossary | `skills/imported-business/domain-glossary/Skill.md` |
| 36 | module-catalog | `skills/imported-business/module-catalog/Skill.md` |
| 37 | prd-knowledge | `skills/imported-business/prd-knowledge/Skill.md` |
| 38 | test-case-authoring | `skills/imported-business/test-case-authoring/Skill.md` |
| 39 | initial-bootstrap-discovery | `skills/initial-bootstrap-discovery/SKILL.md` |
| 40 | Skill: AI Deep Tri-Mindset Orchestrator | `skills/legacy-v7/00-master-orchestrator/SKILL.md` |
| 41 | Skill: ChatGPT / Codex Business Analyst, Planner, Prompt Polisher, and Business Test Author | `skills/legacy-v7/10-chatgpt-codex-business-analyst/SKILL.md` |
| 42 | Skill: Claude Implementation Engineer for Enterprise Angular/Nx/PrimeNG | `skills/legacy-v7/20-claude-implementation-engineer/SKILL.md` |
| 43 | Skill: Gemini Visual, Chart, Dashboard, and QA Validator | `skills/legacy-v7/30-gemini-visual-chart-qa/SKILL.md` |
| 44 | Skill: Business Knowledge Pipeline | `skills/legacy-v7/40-business-knowledge-pipeline/SKILL.md` |
| 45 | Skill: Sound Announcer and Text-to-Speech Completion Signatures | `skills/legacy-v7/50-sound-announcer/SKILL.md` |
| 46 | Falcon Project Abstraction Understanding Skill | `skills/legacy-v7/60-falcon-project-abstraction-understanding/SKILL.md` |
| 47 | Falcon React-to-Angular Screen Composer — RAGE MODE | `skills/legacy-v7/61-falcon-react-to-angular-rage-mode/SKILL.md` |
| 48 | Rage HTML to Falcon Angular Skill | `skills/legacy-v7/62-rage-html-to-falcon-angular/SKILL.md` |
| 49 | Skill: PRD Intelligence and Gap Engine | `skills/legacy-v7/63-prd-intelligence-and-gap-engine/SKILL.md` |
| 50 | Skill: Business Rule Validation Enforcement Engine | `skills/legacy-v7/64-business-rule-validation-enforcement-engine/SKILL.md` |
| 51 | Falcon PES Architecture Enforcement Skill | `skills/legacy-v7/65-falcon-pes-architecture-enforcement/SKILL.md` |
| 52 | Retest / Restructure / Redraw Enforcement Skill | `skills/legacy-v7/66-retest-restructure-redraw-enforcement/SKILL.md` |
| 53 | Falcon Bundle Performance Architect Skill | `skills/legacy-v7/67-falcon-bundle-performance-architect/SKILL.md` |
| 54 | pes-permission-analysis | `skills/pes-permission-analysis/SKILL.md` |
| 55 | react-to-angular | `skills/react-to-angular/SKILL.md` |
| 56 | screenshot-to-angular | `skills/screenshot-to-angular/SKILL.md` |
| 57 | task-report-generator | `skills/task-report-generator/SKILL.md` |
| 58 | testing-qa | `skills/testing-qa/SKILL.md` |
| 59 | validation-rules | `skills/validation-rules/SKILL.md` |
