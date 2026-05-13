# Context Intake

Ask Ammar only for missing required information.

## Ask format

Use a small table:

| Missing item | Needed for | Example value |
|---|---|---|
| Backend repo path | API understanding | `C:\Falcon\falcon-core-commerce-svc` |
| Gateway repo path | Route mapping | `C:\Falcon\falcon-gateway` |

## Do not ask when

- The configured path exists.
- The path is already in `config/brain.config.json`.
- The task does not require that repo/tool.

## Credentials

If credentials are needed, ask Ammar to authenticate locally. Never store secrets in the brain repo, reports, Obsidian notes, or Git commits.
