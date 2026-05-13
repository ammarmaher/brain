# Copy/Paste Guide - Brain SK Root Discovery + Obsidian Auto-Link

## 1. Copy brain folder

Copy the full package to your brain repo working copy, preferably:

```text
C:\Falcon\brain
```

or clone/update:

```text
git clone https://github.com/ammarmaher/brain C:\Falcon\brain
```

## 2. Project root

Your full Falcon project root is:

```text
C:\Falcon\Falcon
```

This contains frontend/backend/gateway/project files. TouchBase will discover the internal paths automatically.

## 3. Copy Claude command files

Copy:

```text
.claude\commands\bootstrap-touchbase.md
.claude\commands\initialize-ammar-brain.md
```

to your active Claude project:

```text
C:\Falcon\Falcon\.claude\commands\
```

## 4. Copy CLAUDE append text

Open:

```text
docs\CLAUDE_APPEND_BRAIN_SK.md
```

Paste it into your project root:

```text
C:\Falcon\Falcon\CLAUDE.md
```

## 5. Obsidian

Open the brain repo folder as an Obsidian vault:

```text
C:\Falcon\brain
```

Brain SK will update `_obsidian/` index notes automatically.

## 6. First command to run in Claude

```text
Initialize Brain SK. Run Shared Bootstrap TouchBase from C:\Falcon\Falcon, auto-detect frontend/backend/gateway/PRD/wiki, generate understanding files, link Obsidian indexes, and auto-sync brain artifacts to GitHub.
```

## 7. If authorization/API key is needed

Claude should ask only for the missing required key/access. Provide it at runtime or configure it locally. Do not commit real secrets.
