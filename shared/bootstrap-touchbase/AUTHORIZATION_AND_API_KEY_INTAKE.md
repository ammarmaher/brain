# Authorization and API Key Intake

TouchBase should automate everything it can, but if a required authorization token/API key is missing, it must ask Ammar clearly.

## Rule

Ask only for authorization that is required for the current task.
Do not ask for every possible credential during bootstrap.

## Examples

| Need | Ask Ammar? | Example message |
|---|---:|---|
| GitHub push fails because auth is missing | Yes | `GitHub authorization is missing. Please authenticate Git or provide the required token in your local environment.` |
| Backend repo is private and cannot be pulled | Yes | `Backend repo access is missing. Please provide access or local path.` |
| Obsidian not installed | No blocking ask | Warn and continue with Git Markdown. |
| Report generator needs a tool missing | Ask only if report is required now | `PDF generation tool is missing. Should I continue with Markdown report only?` |

## Secret safety

Do not write tokens, passwords, API keys, or credentials into committed files.
Use local environment variables, local untracked config, or interactive input.

Recommended local-only file:

```text
config/local.secrets.json
```

This file must be ignored by Git.

## Automation behavior

When authorization is already available, continue automatically.
When authorization is missing, ask Ammar one clear question and explain exactly what is needed.
