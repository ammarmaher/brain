# Git Auto-Sync Governance

## Default brain repo

```text
https://github.com/ammarmaher/brain
```

## Brain artifacts auto-sync

After every bootstrap, scan, analysis, report generation, registry update, skill update, Obsidian note update, protocol update, or scan metadata update:

1. Run `git status` in the brain repo.
2. Exclude unsafe files.
3. Stage valid brain artifacts.
4. Commit with a clear message.
5. Push to the configured brain branch.
6. Record branch and commit hash in report metadata.

Do not ask Ammar before normal brain artifact commits.

## Implementation code auto-sync

After normal implementation work passes quality gates:

1. Run build/lint/test/visual checks as required.
2. Exclude unsafe files.
3. Commit valid implementation changes.
4. Push according to configured branch strategy.
5. Record branch, commit hash, quality gates, and excluded files in the task report.

Do not ask Ammar before normal implementation commits unless there is a Git conflict, unclear branch, blocked quality gate, or risky direct production/main push not explicitly configured.

## Non-negotiable exclusions

Never commit or push:
- secrets
- credentials
- passwords
- access tokens
- refresh tokens
- private keys
- certificates
- `.env` files
- production connection strings
- local-only sensitive config
- `node_modules`
- `dist`
- temporary debug files

If detected, exclude and report.
