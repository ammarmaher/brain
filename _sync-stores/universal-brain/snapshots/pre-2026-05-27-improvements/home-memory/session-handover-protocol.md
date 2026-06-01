---
name: Session Handover Protocol
description: Protocol for agents to backup context when session fills up, enabling seamless handover to next agent or session
type: feedback
---

# Session Handover Protocol

When a session is getting long or an agent needs to hand over work to another agent, follow this protocol to preserve context.

## When to Create a Backup

1. **Session is getting long** — You've been working for a while and context may be compressed
2. **Task is incomplete** — You need to stop but work isn't done
3. **Cross-agent handover** — One Ammar agent finished its part, another needs to continue
4. **Complex multi-step task** — Save progress checkpoints

## How to Create a Backup

Write a backup file to:
```
C:\Users\Pc5\.claude\projects\C--falcon\memory\backups\{date}-{agent}-{topic}.md
```

### Backup File Format
```markdown
---
name: Session Backup - {topic}
description: {what was being worked on}
type: project
agent: {agent name, e.g. ammar-core-commerce}
date: {YYYY-MM-DD}
status: {completed | in-progress | blocked}
---

# Session Backup: {topic}

## What Was Done
- [List of completed actions with file paths]

## What Remains (if in-progress)
- [List of remaining tasks with specific details]

## Key Decisions Made
- [Important architectural or implementation decisions]

## Files Changed
- `path/to/file.cs` — description of change
- `path/to/file2.cs` — description of change

## Context for Next Agent
- [Any context the next agent needs to continue]
- [Gotchas, blockers, or things to watch out for]
```

## How to Resume from a Backup

1. **Check for recent backups:**
   ```
   Glob pattern: C:/Users/Pc5/.claude/projects/C--falcon/memory/backups/*.md
   ```
2. **Read the most recent relevant backup**
3. **Continue from "What Remains" section**
4. **Update or archive the backup when done**

## How to Update Active Session Log

After creating a backup, update `active-session-log.md` with:
- Which agent was working
- What was accomplished
- What needs to happen next
- Reference to the backup file

## Backup Retention
- Keep last 10 backups per agent
- Archive older backups to `backups/archive/` if needed
- Delete backups older than 30 days unless marked as important
