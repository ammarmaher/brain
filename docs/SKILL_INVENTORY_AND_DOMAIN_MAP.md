# Brain SK v0.1 — Complete Skill Inventory and Domain Map
This package keeps the Brain SK v0.1 governance plus the full merged legacy skill library. Skills are not deleted; they are routed by domain so Claude does not load everything at once.
## Four execution domains
| Domain | Always loaded when relevant | Specialist skills |
|---|---|---|
| Business | PRD/business/gap/status/rules thinking | PRD intelligence, business pipeline, validation, PES |
| Frontend | Angular best practice, Tailwind-only, Falcon component-first, folder governance | HTML/React/screenshot conversion, visual parity, bundle performance |
| Backend | Backend API source of truth, controller scan, DTO dictionary, gateway map | API understanding and validation/error maps |
| Full Stack | FE/BE contract mapping, validation sync, PES sync, integration testing | Link UI with backend, end-to-end reports |
| Shared Bootstrap TouchBase | Repo/tool/Obsidian/Git health, root discovery, incremental scan | Notification, reports, Git sync |

## Always-on frontend rules
For every Angular implementation, load: Angular best-practice behavior, Tailwind-only/no CSS/no SCSS rule, Falcon component-first rule, frontend folder structure governance, component registry lookup, and visual parity when a UI source exists.

## Skill inventory
| Skill file | Domain | Status | Description/heading |
|---|---|---|---|
| `domains/backend/SKILL.md` | Backend | Active Specialist | Backend Domain |
| `domains/business/SKILL.md` | Business | Active Specialist | Business Domain |
| `domains/frontend/SKILL.md` | Frontend | Active Specialist | Frontend Domain |
| `domains/fullstack/SKILL.md` | Shared / Legacy | Active Specialist | Full Stack Domain |
| `legacy/v7-import/Skill.md` | Shared / Legacy | Active Specialist | Falcon Genius Brain v7 |
| `legacy/v7-import/brand-skills/chatgpt-strategic-commander/SKILL.md` | Shared | Shared Model Routing | Brand Skill: ChatGPT Strategic Commander |
| `legacy/v7-import/brand-skills/claude-tactical-engineer/SKILL.md` | Shared | Shared Model Routing | Brand Skill: Claude Tactical Engineer |
| `legacy/v7-import/brand-skills/gemini-verification-officer/SKILL.md` | Shared | Shared Model Routing | Brand Skill: Gemini Verification Officer |
| `legacy/v7-import/reference/imported-business-skills/business-skills/business-pipeline/Skill.md` | Business | Active Business Imported Skill | business-pipeline |
| `legacy/v7-import/reference/imported-business-skills/business-skills/domain-glossary/Skill.md` | Business | Active Business Imported Skill | domain-glossary |
| `legacy/v7-import/reference/imported-business-skills/business-skills/module-catalog/Skill.md` | Business | Active Business Imported Skill | module-catalog |
| `legacy/v7-import/reference/imported-business-skills/business-skills/prd-knowledge/Skill.md` | Business | Active Business Imported Skill | prd-knowledge |
| `legacy/v7-import/reference/imported-business-skills/business-skills/test-case-authoring/Skill.md` | Business | Active Business Imported Skill | test-case-authoring |
| `legacy/v7-import/skills/00-master-orchestrator/SKILL.md` | Shared | Active Specialist | Skill: AI Deep Tri-Mindset Orchestrator |
| `legacy/v7-import/skills/10-chatgpt-codex-business-analyst/SKILL.md` | Business | Active Specialist | Skill: ChatGPT / Codex Business Analyst, Planner, Prompt Polisher, and Business Test Author |
| `legacy/v7-import/skills/20-claude-implementation-engineer/SKILL.md` | Shared / Legacy | Active Specialist | Skill: Claude Implementation Engineer for Enterprise Angular/Nx/PrimeNG |
| `legacy/v7-import/skills/30-gemini-visual-chart-qa/SKILL.md` | Frontend | Active Specialist | Skill: Gemini Visual, Chart, Dashboard, and QA Validator |
| `legacy/v7-import/skills/40-business-knowledge-pipeline/SKILL.md` | Business | Active Specialist | Skill: Business Knowledge Pipeline |
| `legacy/v7-import/skills/50-sound-announcer/SKILL.md` | Shared | Active Specialist | Skill: Sound Announcer and Text-to-Speech Completion Signatures |
| `legacy/v7-import/skills/60-falcon-project-abstraction-understanding/SKILL.md` | Shared / Legacy | Active Specialist | Falcon Project Abstraction Understanding Skill |
| `legacy/v7-import/skills/61-falcon-react-to-angular-rage-mode/SKILL.md` | Frontend | Active Specialist | Falcon React-to-Angular Screen Composer — RAGE MODE |
| `legacy/v7-import/skills/62-rage-html-to-falcon-angular/SKILL.md` | Frontend | Active Specialist | Rage HTML to Falcon Angular Skill |
| `legacy/v7-import/skills/63-prd-intelligence-and-gap-engine/SKILL.md` | Business | Active Specialist | Skill: PRD Intelligence and Gap Engine |
| `legacy/v7-import/skills/64-business-rule-validation-enforcement-engine/SKILL.md` | Business | Active Specialist | Skill: Business Rule Validation Enforcement Engine |
| `legacy/v7-import/skills/65-falcon-pes-architecture-enforcement/SKILL.md` | Full Stack / Shared | Active Specialist | Falcon PES Architecture Enforcement Skill |
| `legacy/v7-import/skills/66-retest-restructure-redraw-enforcement/SKILL.md` | Shared / Legacy | Active Specialist | Retest / Restructure / Redraw Enforcement Skill |
| `legacy/v7-import/skills/67-falcon-bundle-performance-architect/SKILL.md` | Frontend | Active Specialist | Falcon Bundle Performance Architect Skill |
| `skills/backend-api-understanding/SKILL.md` | Backend | Active Specialist | backend-api-understanding |
| `skills/bootstrap-health-check/SKILL.md` | Shared | Shared Bootstrap TouchBase | Bootstrap Health Check Skill |
| `skills/brand/chatgpt-strategic-commander/SKILL.md` | Shared | Shared Model Routing | Brand Skill: ChatGPT Strategic Commander |
| `skills/brand/claude-tactical-engineer/SKILL.md` | Shared | Shared Model Routing | Brand Skill: Claude Tactical Engineer |
| `skills/brand/gemini-verification-officer/SKILL.md` | Shared | Shared Model Routing | Brand Skill: Gemini Verification Officer |
| `skills/business-understanding/SKILL.md` | Business | Active Specialist | business-understanding |
| `skills/component-capability-upgrade/SKILL.md` | Frontend | Active Specialist | component-capability-upgrade |
| `skills/frontend-master-router/SKILL.md` | Frontend | Active Specialist | Frontend Master Router Skill |
| `skills/html-to-angular/SKILL.md` | Frontend | Active Specialist | html-to-angular |
| `skills/imported-business/business-pipeline/Skill.md` | Business | Active Business Imported Skill | business-pipeline |
| `skills/imported-business/domain-glossary/Skill.md` | Business | Active Business Imported Skill | domain-glossary |
| `skills/imported-business/module-catalog/Skill.md` | Business | Active Business Imported Skill | module-catalog |
| `skills/imported-business/prd-knowledge/Skill.md` | Business | Active Business Imported Skill | prd-knowledge |
| `skills/imported-business/test-case-authoring/Skill.md` | Business | Active Business Imported Skill | test-case-authoring |
| `skills/initial-bootstrap-discovery/SKILL.md` | Shared | Shared Bootstrap TouchBase | initial-bootstrap-discovery |
| `skills/legacy-v7/00-master-orchestrator/SKILL.md` | Shared | Legacy Specialist (available; loaded when routed) | Skill: AI Deep Tri-Mindset Orchestrator |
| `skills/legacy-v7/10-chatgpt-codex-business-analyst/SKILL.md` | Business | Legacy Specialist (available; loaded when routed) | Skill: ChatGPT / Codex Business Analyst, Planner, Prompt Polisher, and Business Test Author |
| `skills/legacy-v7/20-claude-implementation-engineer/SKILL.md` | Shared / Legacy | Legacy Specialist (available; loaded when routed) | Skill: Claude Implementation Engineer for Enterprise Angular/Nx/PrimeNG |
| `skills/legacy-v7/30-gemini-visual-chart-qa/SKILL.md` | Frontend | Legacy Specialist (available; loaded when routed) | Skill: Gemini Visual, Chart, Dashboard, and QA Validator |
| `skills/legacy-v7/40-business-knowledge-pipeline/SKILL.md` | Business | Legacy Specialist (available; loaded when routed) | Skill: Business Knowledge Pipeline |
| `skills/legacy-v7/50-sound-announcer/SKILL.md` | Shared | Legacy Specialist (available; loaded when routed) | Skill: Sound Announcer and Text-to-Speech Completion Signatures |
| `skills/legacy-v7/60-falcon-project-abstraction-understanding/SKILL.md` | Shared / Legacy | Legacy Specialist (available; loaded when routed) | Falcon Project Abstraction Understanding Skill |
| `skills/legacy-v7/61-falcon-react-to-angular-rage-mode/SKILL.md` | Frontend | Legacy Specialist (available; loaded when routed) | Falcon React-to-Angular Screen Composer — RAGE MODE |
| `skills/legacy-v7/62-rage-html-to-falcon-angular/SKILL.md` | Frontend | Legacy Specialist (available; loaded when routed) | Rage HTML to Falcon Angular Skill |
| `skills/legacy-v7/63-prd-intelligence-and-gap-engine/SKILL.md` | Business | Legacy Specialist (available; loaded when routed) | Skill: PRD Intelligence and Gap Engine |
| `skills/legacy-v7/64-business-rule-validation-enforcement-engine/SKILL.md` | Business | Legacy Specialist (available; loaded when routed) | Skill: Business Rule Validation Enforcement Engine |
| `skills/legacy-v7/65-falcon-pes-architecture-enforcement/SKILL.md` | Full Stack / Shared | Legacy Specialist (available; loaded when routed) | Falcon PES Architecture Enforcement Skill |
| `skills/legacy-v7/66-retest-restructure-redraw-enforcement/SKILL.md` | Shared / Legacy | Legacy Specialist (available; loaded when routed) | Retest / Restructure / Redraw Enforcement Skill |
| `skills/legacy-v7/67-falcon-bundle-performance-architect/SKILL.md` | Frontend | Legacy Specialist (available; loaded when routed) | Falcon Bundle Performance Architect Skill |
| `skills/pes-permission-analysis/SKILL.md` | Full Stack / Shared | Active Specialist | pes-permission-analysis |
| `skills/react-to-angular/SKILL.md` | Frontend | Active Specialist | react-to-angular |
| `skills/screenshot-to-angular/SKILL.md` | Frontend | Active Specialist | screenshot-to-angular |
| `skills/task-report-generator/SKILL.md` | Shared | Active Specialist | task-report-generator |
| `skills/testing-qa/SKILL.md` | Full Stack / Shared | Active Specialist | testing-qa |
| `skills/validation-rules/SKILL.md` | Full Stack / Shared | Active Specialist | validation-rules |
