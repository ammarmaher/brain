# Install Falcon Brain Genius v6

## What changed

v6 keeps all v5 skills and adds:

```txt
SKILL_REGISTRY.md
orchestration/SMART_SKILL_CHAINING_V6.md
compact genius-brain command file
improved natural-language intent routing
stronger React/HTML/PRD/PES/validation/component-composition mapping
```

The compact command file is 198 lines.

---

## Best-Practice Install

### 1. Backup current brain

Backup your current folder first.

### 2. Extract ZIP

Extract:

```txt
Falcon_Brain_Genius_v6.zip
```

Recommended location:

```txt
C:\falcon\brain-skills\Falcon_Brain_Genius_v6\
```

or project-local fallback:

```txt
C:\falcon\falcon-web-platform-ui\Falcon_Brain_Genius_v6\
```

### 3. Install command file

Copy:

```txt
genius-brain.v6-compact-intent-router.md
```

to:

```txt
C:\falcon\falcon-web-platform-ui\.claude\commands\genius-brain.md
```

### 4. Use it

In Claude Terminal:

```txt
/genius-brain
```

or say:

```txt
use genius brain
```

---

## Required files

Confirm these exist:

```txt
Falcon_Brain_Genius_v6/Skill.md
Falcon_Brain_Genius_v6/SKILL_REGISTRY.md
Falcon_Brain_Genius_v6/orchestration/SMART_SKILL_CHAINING_V6.md
Falcon_Brain_Genius_v6/MANIFEST.md
Falcon_Brain_Genius_v6/skills/
```

---

## PES note

PES is still intentionally not defined by acronym.

Add the official Falcon Wiki PES definition here when available:

```txt
architecture/FALCON_PES_ARCHITECTURE_OFFICIAL.md
```

Then tell Claude:

```txt
Use the official PES definition and replace placeholder assumptions.
```
