# Install Falcon Brain Genius v5

## What this package contains

This package upgrades the Falcon Brain without removing older skills.

It adds:

- corrected PES architecture handling
- PES enforcement skill
- Retest / Restructure / Redraw enforcement skill
- smart skill chaining v5
- PRD → business rules → PES → validation → implementation → tests flow
- generated artifact folder governance
- templates for PES, validation, and RRR reports

---

## Best-Practice Installation

### Option A — Clean replacement, recommended

Use this when you want the latest complete brain.

1. Backup your current brain folder.
2. Extract `Falcon_Brain_Genius_v5.zip`.
3. Replace the old brain folder with `Falcon_Brain_Genius_v5`.
4. Open Claude custom skill/project instructions.
5. Point Claude to the new main file:

```txt
Falcon_Brain_Genius_v5/Skill.md
```

6. Keep all subfolders with it:

```txt
skills/
protocols/
architecture/
orchestration/
templates/
Brain Generated/
```

7. In Claude, add this boot instruction:

```txt
Before any Falcon task, read Skill.md first. Then route to the correct skill chain from orchestration/SMART_SKILL_CHAINING_V5.md. Never ignore existing skills. Never redefine PES without reading the Falcon Wiki/code definition.
```

---

### Option B — Merge into existing brain

Use this if you already customized your brain manually.

1. Backup your current brain.
2. Copy these folders/files from v5 into your current brain:

```txt
skills/65-falcon-pes-architecture-enforcement/
skills/66-retest-restructure-redraw-enforcement/
protocols/PES_ENFORCEMENT_PROTOCOL.md
protocols/RETEST_RESTRUCTURE_REDRAW_PROTOCOL.md
orchestration/SMART_SKILL_CHAINING_V5.md
templates/PES_MATRIX_TEMPLATE.md
templates/BUSINESS_VALIDATION_MATRIX_TEMPLATE.md
templates/RETEST_RESTRUCTURE_REDRAW_REPORT_TEMPLATE.md
architecture/FALCON_PES_ARCHITECTURE_PLACEHOLDER.md
Brain Generated/11-pes-matrices/
Brain Generated/12-validation-matrices/
Brain Generated/13-gap-analysis/
Brain Generated/14-retest-restructure-redraw/
Brain Generated/15-skill-routing-audits/
```

3. Merge the new `Skill.md` sections into your current `Skill.md`.
4. Keep your old `Skill.md` as backup.

---

## Required Next Step for PES

PES is currently a placeholder because the exact Falcon Wiki definition was not included.

To make it perfect:

1. Export or paste the Falcon Wiki PES page.
2. Add it to:

```txt
architecture/FALCON_PES_ARCHITECTURE_OFFICIAL.md
```

3. Update:

```txt
architecture/FALCON_PES_ARCHITECTURE_PLACEHOLDER.md
skills/65-falcon-pes-architecture-enforcement/SKILL.md
protocols/PES_ENFORCEMENT_PROTOCOL.md
```

4. Tell Claude:

```txt
Use the official PES definition from architecture/FALCON_PES_ARCHITECTURE_OFFICIAL.md. Replace the placeholder working interpretation and enforce the official behavior everywhere.
```

---

## Recommended Claude Opening Prompt

Use this after installing:

```txt
You are using Falcon Brain Genius v5.

First read Skill.md.
Then read orchestration/SMART_SKILL_CHAINING_V5.md.
Before implementing anything, choose the correct skill chain.

For React/screenshot/HTML conversion, use RAGE MODE and Retest/Restructure/Redraw.
For PRDs, extract requirements, gaps, business rules, PES matrix, validation matrix, frontend/backend traceability, sprint tasks, and tests.
For PES, do not invent the acronym. Use the Falcon Wiki/code definition if available. If missing, ask targeted questions or document safe assumptions.
Never lose older skills. Never over-engineer. Never duplicate Falcon components.
```

---

## Installation Verification Checklist

After installing, confirm these exist:

```txt
Skill.md
MANIFEST.md
skills/65-falcon-pes-architecture-enforcement/SKILL.md
skills/66-retest-restructure-redraw-enforcement/SKILL.md
protocols/PES_ENFORCEMENT_PROTOCOL.md
protocols/RETEST_RESTRUCTURE_REDRAW_PROTOCOL.md
orchestration/SMART_SKILL_CHAINING_V5.md
templates/PES_MATRIX_TEMPLATE.md
templates/BUSINESS_VALIDATION_MATRIX_TEMPLATE.md
templates/RETEST_RESTRUCTURE_REDRAW_REPORT_TEMPLATE.md
```

If all exist, v5 is installed correctly.
