*** Banned Terms ***
*** Forbidden synonyms with their canonical replacement ***

# Banned Terms

These terms must never appear in Falcon code, UI, PRDs, tests, or docs. Use the canonical replacement instead.

| Banned | Use instead | Reason |
|---|---|---|
| _no banned terms yet_ | | |

## How to add

When a synonym creep is detected:
1. Add a row above
2. Update the canonical term file's `Aliases (banned)` field
3. Run a glossary validation pass to find existing usages

## Detection

A glossary validation against any artifact must:
- Flag every banned term as `✗ Banned: <term> → <use>`
- Block merge if any banned term is found
