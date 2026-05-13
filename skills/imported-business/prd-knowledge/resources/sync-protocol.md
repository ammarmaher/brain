*** Sync Protocol — prd-knowledge ***
*** Step-by-step process for refreshing PRDs from Drive into local modules ***

# Sync Protocol

## When to run

- User says `take latest from PRD` or `update PRD knowledge`
- After a known PRD update notification
- Before any task that depends on current PRD state

## MVP — manual drop

1. **Export from Drive**
   - Open Drive folder: `https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH`
   - Right-click each module folder → `Download` (Drive returns a `.zip`)
   - Place the zip(s) in `prd-knowledge/incoming/`

2. **Process incoming**
   - For each zip in `incoming/`:
     - Unzip into a temp folder
     - Identify module slug from folder name (kebab-case)
     - Walk files, classify by extension (md, docx, xlsx, png, etc.)

3. **Normalize**
   - Convert primary PRD docs (`.docx`, `.gdoc`) to markdown → `modules/<slug>/latest-prd.md`
   - Move attachments: `.png/.jpg → assets/images/`, `.xlsx → assets/excel/`, `.docx → assets/word/`, `.drawio/.svg → assets/diagrams/`

4. **Diff**
   - Compute SHA256 of new `latest-prd.md` vs previous (from `source-map.json`)
   - If different: update file, append entry to `modules/<slug>/changelog.md`
   - If new module: create `modules/<slug>/` from scratch

5. **Update source map**
   - Write/refresh `modules/<slug>/source-map.json`:
     ```json
     {
       "drive_file_id": "1AbCDef...",
       "drive_path": "Account Management/PRD-v1.5.docx",
       "last_sync": "2026-04-30T15:00:00Z",
       "hash": "sha256-..."
     }
     ```

6. **Append to global log**
   - Add line to `prd-knowledge/UPDATES.md`:
     ```
     2026-04-30 15:00 | sync | added: charging-v2 | updated: account-mgmt, contacts, billing | unchanged: 5
     ```

7. **Notify dependents**
   - For every changed module, signal `module-catalog` to refresh `links.md` + `last-updated`

8. **Clean incoming**
   - Move processed zips to `incoming/processed/<date>/`

9. **Emit completion sound + report**
   ```
   PRD sync complete (2026-04-30 15:00)
   + Added:     1 module (charging-v2)
   ✓ Updated:   3 modules (account-mgmt v1.4→v1.5, contacts, billing)
   = Unchanged: 5 modules
   ⚠ Conflicts: 0
   Skills refreshed: prd-knowledge, module-catalog
   ```
   Then: `[console]::beep(660,200); [console]::beep(880,200); [console]::beep(1100,400)`

## Future — Drive API (graduation path)

Replace step 1 with Drive API call (`gcloud auth` + Drive `files.list` + `files.export`). Same output contract, no other changes.

## Failure modes

- **Drive inaccessible:** STOP, report missing access, do not guess
- **Zip corrupt:** skip the zip, log error, continue with others
- **Module slug ambiguous:** ask user to confirm before writing
- **Hash collision:** treat as unchanged, log a warning
