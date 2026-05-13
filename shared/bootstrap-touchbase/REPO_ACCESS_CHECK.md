# Repo Access Check

## Required repositories

| Repo | Default |
|---|---|
| Brain repo | `https://github.com/ammarmaher/brain` |
| Frontend repo | Configured in `config/brain.config.json` |
| Backend repo(s) | Configured in `config/brain.config.json` |
| Gateway repo | Configured in `config/brain.config.json` |
| Wiki repo/folder | Configured in `config/brain.config.json` |
| PRD folder | Configured in `config/brain.config.json` |

## Git checks

Run for each repo:

```bash
git rev-parse --is-inside-work-tree
git branch --show-current
git status --short
git remote -v
```

## Branch rule

Default source branch is `main` unless Ammar specifies another branch.
If branch is unclear, ask one small question.
