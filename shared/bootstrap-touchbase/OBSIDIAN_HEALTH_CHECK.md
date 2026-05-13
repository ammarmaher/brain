# Obsidian Health Check

Obsidian is a human-readable interface over the same Git Markdown brain files. It is not the runtime source of truth.

## Check

| Item | Expected |
|---|---|
| Vault path exists | Yes, if configured |
| Vault points to brain folder or mirror | Yes |
| Recent Markdown files visible | Yes |
| Attachments/images readable | Yes |
| Graph/backlinks optional | Optional |

## Failure rule

If Obsidian is missing or stale:

1. Warn Ammar.
2. Continue from Git Markdown if safe.
3. Record issue in health report.
4. Do not block unless task depends on wiki/images only available in Obsidian.
