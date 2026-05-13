# Gap and Question Protocol

## Purpose

The brain must detect missing information, but it must not block progress with unnecessary questions.

## Gap Types

### Blocking Gap
Cannot safely implement without an answer.

Examples:

- Target app is unknown and the same feature exists in multiple apps.
- Backend contract is missing and cannot be inferred.
- User asked for deletion/removal but scope is unclear.
- Payment/security/permission behavior is ambiguous.

### Important Gap
Can continue with a safe assumption, but must document it.

Examples:

- Exact color token is unknown but nearest Falcon token exists.
- Screenshot has a small unknown interaction.
- API endpoint is not confirmed but similar service exists.

### Minor Gap
Continue silently.

Examples:

- Small copy text can be inferred.
- Minor spacing can be matched with existing Tailwind scale.

## Question Format

Ask only blocking questions.

```txt
I can continue, but these are blocking gaps:
1. [specific question]
2. [specific question]

If you do not answer, I will assume:
1. [safe assumption]
2. [safe assumption]
```

## Best-Effort Rule

If the task can continue safely, continue and document assumptions.

Do not ask generic questions.

Do not ask for information already present in the repo, PRD, screenshot, or uploaded files.

