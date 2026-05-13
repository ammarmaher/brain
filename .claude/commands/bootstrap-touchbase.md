# Bootstrap TouchBase

Run Brain SK Shared Bootstrap TouchBase using root discovery.

Default project root:

```text
C:\Falcon\Falcon
```

Required behavior:

1. Start discovery from `C:\Falcon\Falcon`.
2. Auto-detect frontend, backend, gateway, PRD, and architecture wiki paths.
3. Generate visible understanding files under `outputs/discovery/`.
4. Generate/update Obsidian index notes under `_obsidian/`.
5. Ask Ammar only for missing required paths or authorization/API keys.
6. Do not scan legacy/archive folders as active source truth.
7. Continue with available areas if a non-required area is missing.
8. Auto-sync brain artifacts to `https://github.com/ammarmaher/brain` after safe files are generated.

Minimum outputs:

```text
outputs/discovery/discovered-path-map.md
outputs/discovery/discovered-path-map.json
outputs/discovery/startup-readiness-report.md
outputs/discovery/scan-metadata.json
_obsidian/BRAIN_SK_HOME.md
```

If authorization is required, ask one clear question and wait for Ammar.

## Canonical Frontend Knowledge Path

When discovery detects the frontend workspace and any subsequent agent writes component-knowledge artifacts, the canonical write target is:

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

Config keys: `outputs.frontendUnderstanding` and `outputs.frontendComponents` in `../../config/brain.config.json`.
