# Commit Message Template (Phase J)

> The push-approval script renders this template when the user answers `yes`. The output is written to `Brain\state\<task-id>\proposed-commit-message.txt`. The user copies it and runs `git commit -F <path>`. The template never contains a push command.

## Format (Conventional Commits)

```
<type>(<scope>): <subject>

<body-summary>

Files changed:
- <path-1>
- <path-2>
- ...

# Tests authored by Claude:
# - <claude-test-1>
# - <claude-test-2>

# Tests authored by ChatGPT:
# - <chatgpt-scenario-1>
# - <chatgpt-scenario-2>

# Tests authored by Gemini:
# - <gemini-qa-finding-1>
# - <gemini-qa-finding-2>

Co-authored-by: ChatGPT (mindset) <noreply@openai.com>
Co-authored-by: Gemini (mindset) <noreply@google.com>
```

## Field rules

| Token | Source in `task-state.json` | Fallback |
|---|---|---|
| `<type>` | derived from `title` first word: `fix`/`feat`/`refactor`/`test`/`docs`/`chore` | `chore` |
| `<scope>` | `taskId` lowercased (kebab-case acceptable) | `brain` |
| `<subject>` | `title` (≤72 chars after trimming) | `update` |
| `<body-summary>` | first non-empty entry of `notes[]`, trimmed to 200 chars | omitted |
| Files-changed list | `artifacts.codeChanges[]` | section omitted if empty |
| Claude tests | bullets read from `artifacts.qaReportPath` (Claude-authored block) OR notes tagged `claude-test:` | section omitted if empty |
| ChatGPT tests | bullets read from `artifacts.scenariosPath` | section omitted if empty |
| Gemini tests | bullets read from `artifacts.qaReportPath` (Gemini block) | section omitted if empty |
| `Co-authored-by:` lines | one per mindset that authored at least one bullet above | omitted if no contribution |

## Rendering rules

1. The three test-comment blocks are emitted as `#`-prefixed lines so they survive `git commit -F` as part of the body — git keeps them visible in `git log`, but they are also clearly separable for downstream tooling.
2. Each block header is always exactly:
   - `# Tests authored by Claude:`
   - `# Tests authored by ChatGPT:`
   - `# Tests authored by Gemini:`
3. If a mindset contributed zero items the header is omitted (no empty headers).
4. Lines are wrapped at 100 columns. The subject line is hard-capped at 72 characters.
5. No emojis anywhere. No trailing whitespace.
6. The file ends with a single trailing newline.
7. The template never includes `git push`, `gh pr create`, or any execution instruction.

## Example output (illustrative, not literal)

```
feat(115329): contact-group permission resolver

Adds policy-based access control over Contact Group reads/writes per the
Permissions module wiki. Wires Identity claims to the Commerce permission
guard. No public API change.

Files changed:
- libs/core/src/permissions/contact-group.guard.ts
- apps/admin-ui/src/app/contact-group/contact-group.routes.ts

# Tests authored by Claude:
# - guard returns DENY when claim "contact-group:read" missing
# - guard returns ALLOW when caller is tenant owner

# Tests authored by ChatGPT:
# - scenario: cross-tenant read attempt is rejected with 403
# - scenario: shared-with-me group is readable by recipient

# Tests authored by Gemini:
# - QA: race between role grant and immediate read returns stale claim once

Co-authored-by: ChatGPT (mindset) <noreply@openai.com>
Co-authored-by: Gemini (mindset) <noreply@google.com>
```
