---
name: brain-skills-protocol
description: Mandatory pre-read protocol for Falcon brain skills (business/code/design categories) at C:\falcon\brain-skills\
type: feedback
originSessionId: 6995e870-d030-4774-9fa3-5528cf00094d
---
Before any Falcon business-analysis, PRD, module-knowledge, or test-authoring task: read the relevant Skill.md from `C:\falcon\brain-skills\business-skills\`.

**Why:** User reorganized Falcon skills into a category structure (business/code/design). Each skill is a checklist rule book, not an invokable harness skill — load via Read. Skipping the pre-read leads to vocabulary drift, broken PRD sync, untraceable tests, and module-knowledge gaps.

**How to apply:**

1. **Trigger phrases → skill mapping:**
   - `take latest from PRD` / `update PRD knowledge` → `prd-knowledge/Skill.md`
   - `generate test cases for [module]` / `generate test cases for all PRD` → `test-case-authoring/Skill.md`
   - Any domain term usage → `domain-glossary/Skill.md`
   - Any module-scoped task → `module-catalog/Skill.md`

2. **Reading order:** target skill's `Skill.md` → cross-skill dependencies → referenced resources → Wiki override check.

3. **Cross-skill flow:**
   ```
   prd-knowledge ─feeds→ module-catalog ─feeds→ test-case-authoring
                              ^
   domain-glossary ─constrains───/
   ```

4. **Sound signatures (emit on successful completion only):**
   - `prd-knowledge` — ascending resolve: `[console]::beep(660,200); [console]::beep(880,200); [console]::beep(1100,400)`
   - `domain-glossary` — 3 equal taps: `[console]::beep(1000,150); Start-Sleep -Milliseconds 80; [console]::beep(1000,150); Start-Sleep -Milliseconds 80; [console]::beep(1000,150)`
   - `module-catalog` — long-short-long: `[console]::beep(700,500); [console]::beep(700,200); [console]::beep(700,500)`
   - `test-case-authoring` — low-high-low: `[console]::beep(880,400); [console]::beep(1100,400); [console]::beep(880,400)`

5. **Hard rules:**
   - Never edit `latest-prd.md` by hand — only via `prd-knowledge` sync
   - Every term in any artifact validates against `domain-glossary`
   - Every test case traces to ≥1 PRD requirement
   - If skills/Wiki/PRD Drive are inaccessible: STOP, report, never guess
   - Never play sound on routine actions or partial output

6. **Categories scaffolded but empty:** `code-skills/`, `design-skills/` — to be populated later.

7. **Full sound table + future skills:** see `C:\falcon\brain-skills\SOUNDS.md`.
