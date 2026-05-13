# Initialize Brain SK

Initialize Brain SK with Shared Bootstrap TouchBase and Parallel Discovery.

Use project root:

```text
C:\Falcon\Falcon
```

Do not ask separately for frontend/backend/gateway paths first. Discover them from the project root.

Run:

1. Shared Bootstrap TouchBase health check.
2. Project root discovery.
3. Obsidian auto-link check.
4. Authorization/API key check only if required.
5. Parallel discovery agents:
   - PRD / Business Analysis Agent
   - Backend / API Understanding Agent
   - Falcon Component Registry Agent
   - Architecture Wiki Agent
   - Integration / Impact Agent
6. Generate understanding output folders and reports.
7. Auto-commit and auto-push brain artifacts to `https://github.com/ammarmaher/brain`.

Required visible outputs:

```text
outputs/discovery/
outputs/understanding/business/
outputs/understanding/backend/
outputs/understanding/frontend/
outputs/understanding/wiki/
_obsidian/
```
