---
name: PR review silent by default
description: PR reviews must never post to the PR; silent review is the default, always ask first
type: feedback
originSessionId: 672a7f5f-279e-40a9-b376-86795518823a
---
PR reviews (via the Brain SK PR Review Governance Skill) run in **Silent Review**
mode by default: produce the report set locally only, post **nothing** to the
pull request — no PR comments, no inline comments, no attachments, no status
updates. Before any PR write, ask: "Do you want findings added as PR comments or
the report attached to the PR? (default: No)" and proceed only on an explicit yes.

Also standing: every PR review always generates `PR_REVIEW_REPORT.html` (mandatory,
self-contained), and every finding must carry code evidence — real offending lines
with `file:line` + what is wrong + a concrete suggested fix.

**Why:** Ammar wants PR review as a private advisory tool, not something that
touches the teammate-facing PR. He stated this explicitly on 2026-05-19.

**How to apply:** Default to silent review. Never call the Azure DevOps / GitHub
PR comment or attachment APIs unless Ammar explicitly says yes in the same request.
Skill + rule live in `C:\Falcon\Brain SK\skills\pr-review-governance\SKILL.md` and
`Brain SK\CLAUDE.md`.
