# Install Instructions for Claude

## Option A — Give Claude the ZIP

Upload this ZIP to Claude and say:

```text
Load this AI Deep Tri-Mindset Skill Bundle.
Always start from skills/00-master-orchestrator/SKILL.md.
Use the workflow files and gates before implementing any task.
When the task is visual or chart-based, create a Gemini prompt first.
When the task is business-heavy, create ChatGPT/Codex business tests first.
When the task is code-related, generate a Claude implementation plan and then implement only after gates pass.
```

## Option B — Install as Claude skills

Copy each folder under `skills/` into your Claude skills directory.

Recommended layout:

```text
.claude/
  skills/
    00-master-orchestrator/
      SKILL.md
    10-chatgpt-codex-business-analyst/
      SKILL.md
    20-claude-implementation-engineer/
      SKILL.md
    30-gemini-visual-chart-qa/
      SKILL.md
    40-business-knowledge-pipeline/
      SKILL.md
    50-sound-announcer/
      SKILL.md
```

Also keep these folders near the skills:

```text
protocols/
templates/
workflows/
checklists/
reference/
```

## Activation phrase

Use one of these:

```text
Run the tri-mindset orchestrator for this task.
Use the deep AI skill bundle.
Use ChatGPT/Codex mindset, Claude mindset, and Gemini mindset correctly.
```

## Required behavior after installation

Claude must always:

1. Identify which model mindset is needed.
2. Load the correct role contract.
3. Apply gates before action.
4. Produce the correct handoff prompt.
5. Respect Angular/Nx/PrimeNG rules for front-end implementation.
6. Preserve business rules and module boundaries.
