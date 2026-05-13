## Non-Destructive Output Sync Rule

Brain SK must never use destructive mirror sync for generated outputs.

Forbidden:
- robocopy /MIR
- robocopy /PURGE
- deleting destination output folders before copy
- any sync command that removes existing files from `C:\Falcon\Brain SK\outputs`

Required:
- Use additive sync only.
- Preserve existing templates, reports, registries, Obsidian indexes, and scan metadata.
- Copy new/changed files from `C:\Falcon\Brain Outputs` to `C:\Falcon\Brain SK\outputs`.
- If cleanup is needed, ask Ammar first and list exactly what will be deleted.

Recommended Windows command:
`robocopy "C:\Falcon\Brain Outputs" "C:\Falcon\Brain SK\outputs" /E /XO /XD .git node_modules dist bin obj`

Stop condition:
If a command may delete files from the destination, do not run it.

## Canonical Frontend Knowledge Path

When git-sync mirrors generated outputs from `C:\Falcon\Brain Outputs` into `C:\Falcon\Brain SK\outputs`, the canonical frontend component knowledge SUBTREE is:

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

Mirror behavior: the additive sync MAY continue to copy legacy folders for archival continuity, but new generated frontend / component-knowledge outputs MUST be produced only under `C:\Falcon\Brain Outputs\understanding\frontend`. Skills that write to `component-registry/` or `frontend-understanding/` are deprecated — rewrite their write targets to the canonical path.

## Component Scan Report Sync

Every incremental component scan run produced by `domains/frontend/component-knowledge/incremental-scan/SKILL.md` must be mirrored and committed via this exact pipeline:

1. **Additive mirror** (Windows):
   ```
   robocopy "C:\Falcon\Brain Outputs" "C:\Falcon\Brain SK\outputs" /E /XO /XD .git node_modules dist bin obj
   ```
   The mirror picks up:
   - `outputs/understanding/frontend/_scan-state/component-scan-metadata.json`
   - `outputs/understanding/frontend/_scan-state/FRONTEND_COMPONENT_SCAN_RUN.md`
   - `outputs/reports/component-scans/<YYYY-MM-DD-HHmm>/*` (all files in the dated run folder)
   - Any per-component knowledge file regenerated this run under `outputs/understanding/frontend/components/<name>/`
2. **Pre-commit secret grep** — pattern-scan the run folder for `api[_-]?key`, `sk-[a-z0-9]{20,}`, `AIza[a-z0-9]{20,}`, `bearer\s+[a-z0-9]{20,}`, `password\s*[:=]\s*"[^"]{8,}"`. Fail the run if any match.
3. **Stage specific paths only:**
   - `_obsidian/FRONTEND_INDEX.md`, `_obsidian/FALCON_COMPONENT_INDEX.md` (if modified)
   - `outputs/understanding/frontend/_scan-state/` (whole dir — small)
   - `outputs/reports/component-scans/<run-stamp>/` (whole dir — small)
   - `outputs/understanding/frontend/components/<changed-component>/` (only components actually re-scanned this run)
4. **Commit message template:**
   ```
   feat(frontend): incremental component scan <YYYY-MM-DD-HHmm>

   Scanned: N · Skipped: N · Missing-knowledge: N · Failed: N
   Falcon repo: <branch> @ <short-hash>
   ```
5. **Push** to `https://github.com/ammarmaher/brain` `main` only. Never use `--force` / `--no-verify`.

**Hard constraint:** never commit Obsidian plugin data files, `.env`, `*.key`, `*.pem`, `local.secrets.json`, `node_modules`, `dist`, `bin`, `obj`, or `.tmp`. The pre-commit secret grep is mandatory.