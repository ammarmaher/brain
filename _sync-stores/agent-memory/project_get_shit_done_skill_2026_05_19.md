---
name: Get Shit Done review skill
description: get-shit-done skill — generic evidence-based 8-senior review board + Approved Learning & Obsidian Memory Loop; review and learning trigger phrases route to it via Brain routing.
type: project
originSessionId: 09115ee0-09d3-461b-a01a-96a7c6dfd63a
---
🟢 BUILD + EXTENDED 2026-05-19. The **get-shit-done** skill lives at `C:\Falcon\.claude\skills\get-shit-done\` — a generic, feature-agnostic, evidence-based review engine.

**Review engine:** convenes an 8-senior review board (Senior Architect, Frontend, Backend, Full-Stack, Business Architect, Business Analyst, Business Tester, Business Security Reviewer), builds a shared cited-evidence base, and emits five synchronized files under `reports/<review-name>/`: `review-dashboard.html` (8 tabs), `review-summary.md`, `findings.json` (canonical), `action-plan.md`, `evidence-index.md`. Review-only by default; implements fixes only on explicit instruction; stops with `REVIEW_OUTPUT_INCOMPLETE` if core outputs disagree or are missing. Never claims runtime verification without cited build/API/browser evidence.

**Approved Learning & Obsidian Memory Loop (added 2026-05-19):** every run also learns. It writes ten Obsidian-readable files under `reports/<review-name>/obsidian/` (obsidian-index, memory-update-candidates, lessons-learned, agent-improvement-notes, reusable-pattern-candidates, architecture-decision-candidates, business-rule-candidates, security-rule-candidates, open-risks, follow-up-actions), answers 10 Agent Improvement questions, updates `brain/obsidian/indexes/GSD Review Index.md`, and appends a scored review section to `brain/obsidian/Obsidian Knowledge Scale.md` (10 knowledge areas, 0-100, anti-inflation rules — runtime-not-verified caps Evidence Quality ≤80, etc.). Learning is **controlled**: findings are immediate evidence, but lessons/patterns/architecture-decisions/business-rules/security-rules/agent-improvements are saved only as CANDIDATES. Permanent memory changes ONLY via **Approved Learning Mode** (triggers: "memorize this", "update agent memory", "save learning", "apply learning", "approve this lesson", "approve pattern", "save to Obsidian", "update Obsidian memory") after explicit approval. Git Markdown is canonical SoT; Obsidian is the navigation layer; mismatch → `SOURCE_OF_TRUTH_CONFLICT` (not auto-resolved). Missing Obsidian outputs → `OBSIDIAN_MEMORY_OUTPUT_INCOMPLETE`. Never saves secrets/credentials/passwords/tokens.

**Skill files:** `SKILL.md`, `references/senior-board.md`, `references/security-review.md`, `references/output-contract.md`, `references/learning-loop.md`, `assets/review-dashboard-template.html`, `assets/obsidian-templates.md`.

**Mandates:** Senior Frontend always runs the Falcon token/design-system checklist (Falcon Tailwind tokens, design tokens, no inline styles, no hardcoded colors/spacing/radius/shadow, no unjustified arbitrary Tailwind values, no page-local hacks where a shared component should be upgraded). Senior Business Security runs an authorized, non-weaponized adversarial review (missing authz, FE-only security, IDOR, cross-tenant, priv-esc, replay/double-charge, missing idempotency, insecure SignalR joins, event spoofing, data leakage, wallet/payment abuse, tenant isolation) — code-review/local/staging only.

**Brain routing wired into 3 files:** `.claude/CLAUDE.md`, `.claude/commands/CLAUDE.md`, `.claude/commands/genius-brain.md` — review triggers ("Get shit done", "GSD", "Audit"/"Audit more"/"Deep audit", "Review everything", "Make sure everything is correct", "Weekly review", "Senior review", "Wave checkpoint", "PR review") and Approved Learning Mode triggers all route to the skill.

**Why:** one standard, repeatable, evidence-based review process AND a controlled learning loop — observations never silently become permanent rules.

**How to apply:** on any review/audit/PR-review trigger, invoke the get-shit-done skill before continuing — do not hand-roll a review. Keep it review-only unless explicitly told to implement fixes. Promote a learning candidate to permanent memory only in Approved Learning Mode after explicit approval.
