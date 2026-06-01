*** BR-registry.base — README ***
*** Companion doc for `BR-registry.base` · Obsidian Bases registry · 2026-05-27 ***

# BR-registry.base — README

## What this base does

`BR-registry.base` is an Obsidian **Bases** registry (Obsidian v1.7+ core feature) over the per-module `BUSINESS_RULES.md` files inside `prd/modules/<module>/`.

Unlike `V-rules.base`, `E-entities.base`, and `Q-tickets.base`, this base does **not** index individual rules — the BR-* rules live as headings/sections inside each `BUSINESS_RULES.md` file, not as separate notes. Indexing every BR section as its own file would require splitting the PRD layout, which the PRD authoring workflow is not ready for.

So this base is a lightweight **file-level** registry: which modules currently have a `BUSINESS_RULES.md`, when each was last edited, and how big each file is. It's the on-ramp for the deeper per-rule registry that will land in a later phase.

It filters on file name `BUSINESS_RULES` + extension `md` + path prefix `prd/modules/` and surfaces one view:

| View | Kind | What it shows |
|---|---|---|
| **BR files** | Table | Every `BUSINESS_RULES.md` under `prd/modules/`, sorted by `file.mtime` DESC (most recently edited first) |

Columns surfaced:

- `file.name` — always `BUSINESS_RULES` (clickable to open the file)
- `module` — frontmatter property if the file declares one; otherwise blank. Manual fallback below.
- `file.mtime` — built-in file modification time
- `file.size` — built-in file size in bytes

## How to derive `module` from the folder

Each `BUSINESS_RULES.md` lives one level deep under `prd/modules/<module-folder>/`. The module name **is** the parent folder name (`01-account-management`, `02-user-management`, etc.).

The current Bases formula support is still evolving, so this base leaves `module` as a plain frontmatter slot. Two options to populate it:

1. **Preferred (no code):** add `module: <folder-name>` to the YAML frontmatter of each `BUSINESS_RULES.md`. The column then fills automatically.
2. **If Bases supports computed columns in your build:** edit `BR-registry.base` and replace the `module:` block in `properties:` with:
   ```yaml
   module:
     displayName: Module
     formula: file.folder.name
   ```
   Save and reopen the base.

Ammar should pick whichever path is least disruptive. Until then the `module` column may show empty cells — that's expected, not a bug.

## How to open it in Obsidian

1. Make sure you're on Obsidian v1.7+ (Bases is core, no plugin needed).
2. Open the vault that contains the PRD tree (or open `C:\Falcon\Brain Outputs\prd\modules\` as a vault for a focused view).
3. Click `BR-registry.base`.
4. The **BR files** table lists every `BUSINESS_RULES.md` found, newest edit at the top.
5. Click any row to open the file — the BR-* rules live inside under section headings.

## Tuning

- If Obsidian reports the `file.path.startsWith(...)` predicate as unknown, remove that filter line and the base will still work (it'll just include `BUSINESS_RULES.md` from anywhere in the vault, which is fine if the only ones in scope already live under `prd/modules/`).
- File-level columns (`file.mtime`, `file.size`) are built-in Bases properties and should always render.

## Companion files

- Source files: `prd/modules/*/BUSINESS_RULES.md` (6 files as of 2026-05-27)
- Related registries:
  - `..\..\Brain SK\_obsidian\30-Validation\V-rules.base` — V-rules (per-rule, per-file)
  - `..\..\Brain SK\_obsidian\40-API\E-entities.base` — E-* entity reconciliations
  - `..\datasets\authority-dataset\_pending-questions\Q-tickets.base` — question tickets

## Future evolution (Phase 6.5 follow-up)

When the PRD workflow can tolerate splitting BR-* rules out of `BUSINESS_RULES.md` into one-file-per-rule (e.g. `BR-AM-03.md`, `BR-UM-11.md`), replace this base with a `BR-rules.base` that mirrors `V-rules.base`'s shape — same columns (`id`, `module`, `feature`, `status`, `verification`, `last-verified`) and same three views (`All`, `Live`, `Superseded`). The file-level base then retires.
