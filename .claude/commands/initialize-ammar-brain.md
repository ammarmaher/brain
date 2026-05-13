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

## Canonical Frontend Knowledge Path

The Falcon Component Registry Agent and any other frontend / component-knowledge agent MUST write into the canonical tree:

**Canonical frontend component knowledge path** (read + write):

```text
C:\Falcon\Brain Outputs\understanding\frontend
```

**Component folders** (read + write):

```text
C:\Falcon\Brain Outputs\understanding\frontend\components\<component-name>
```

**Legacy / import / mirror — do NOT use as active source:**

- `C:\Falcon\Brain Outputs\component-registry`
- `C:\Falcon\Brain Outputs\frontend-understanding`
- `C:\Falcon\Brain SK\outputs\component-registry`
- `C:\Falcon\Brain SK\outputs\frontend-understanding`

The relative `outputs/understanding/frontend/` path quoted above resolves to the same canonical absolute path when Brain SK mirrors generated outputs from `Brain Outputs`. Config keys: `outputs.frontendUnderstanding` and `outputs.frontendComponents` in `config/brain.config.json`.
