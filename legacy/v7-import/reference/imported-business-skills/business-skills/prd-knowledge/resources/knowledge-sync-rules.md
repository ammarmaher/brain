*** Knowledge Sync Rules — prd-knowledge ***
*** Migrated verbatim from OLD claude-falcon-skills — full Drive sync procedure ***

# Knowledge Sync Rules

## Sync triggers

User commands that trigger a PRD knowledge sync:

- `take latest from PRD`
- `update PRD knowledge`

Both do the same thing: only knowledge synchronization.

## Sync procedure

1. Open the Drive PRD source folder:
   https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH
2. Scan the Drive root for module folders AND standalone documents.
3. For each module folder:
   - List every file.
   - Apply [`versioning-rules.md`](./versioning-rules.md) to pick the latest PRD.
   - Inventory attachments per [`attachment-rules.md`](./attachment-rules.md).
4. For each module, create or update the local folder under `modules/<slug>/`.
5. Write/update:
   - `README.md` — module name, Drive folder, latest PRD, version, last sync date, file counts, status.
   - `latest-prd.md` — selected PRD details and structured summary.
   - `understanding.md` — Claude's digested interpretation (see [module-catalog/resources/module-understanding-rules.md](../../module-catalog/resources/module-understanding-rules.md)).
   - `attachments.md` — inventory of non-selected useful files.
   - `source-map.json` — structured metadata.
6. **Download every original Drive file into `modules/<slug>/assets/` and OVERWRITE existing copies.** On every `take latest from PRD` / `update PRD knowledge`:
   - Ensure the 5 subfolders exist; create if missing: `assets/word/`, `assets/excel/`, `assets/images/`, `assets/diagrams/`, `assets/other/`.
   - Download the ORIGINAL file from Drive (or the best export for Google-native types) into the matching subfolder.
   - Routing by mime type:
     - Google Doc / `.docx` / `.doc` → `assets/word/` (export Google Docs as `.docx` — mime `application/vnd.openxmlformats-officedocument.wordprocessingml.document`).
     - Google Sheet / `.xlsx` / `.xls` / `.csv` → `assets/excel/` (export Google Sheets as `.xlsx`).
     - `.png` / `.jpg` / `.jpeg` / `.gif` / `.webp` → `assets/images/`.
     - Google Drawing / `.svg` / standalone diagram → `assets/diagrams/` (export Google Drawings as `.png` AND `.pdf`).
     - Anything else → `assets/other/`.
   - **ALWAYS overwrite** existing files inside `assets/` — do not version, do not rename, do not skip because the file exists.
   - This applies to ALL files: the selected latest PRD, supporting documents, older duplicates, spreadsheets, images, drawings.
   - Keep the Drive file's original name; sanitize only filesystem-illegal characters (`<>:"/\|?*` → `_`).
   - After each download, record the `localAssetPath` on that file's entry in `source-map.json`.
   - If a download fails (access denied, quota, network) → log in `source-map.json` under `unreadableFiles` with reason; do NOT delete any existing local copy on failure.
7. Do NOT touch `test-cases.md` during sync — tests regenerate only on explicit command.

## Standalone root documents

- Create `modules/root-documents/` with the standard structure.
- If a document clearly belongs to a module, map it there instead and record the reason in `source-map.json`.

## Re-sync behavior

- Keep the local folder slug stable across re-syncs.
- When a newer PRD version is detected, move the previously-selected PRD into `ignoredDuplicatePrds` automatically.
- Preserve unanswered clarifying questions in `understanding.md` across syncs.
- Do not overwrite `test-cases.md` on sync — tests only change on explicit command.

## Restrictions during sync

- Do not edit Angular application files.
- Do not edit backend application files.
- Do not install packages.
- Do not run migrations.
- Do not refactor source code.
- Do not change Nx workspace structure.
- Do not change Module Federation config.
- Do not change PrimeNG / Tailwind setup.

Only knowledge files inside `prd-knowledge/modules/**`, `module-catalog/modules/**`, and these skills' docs may be updated.

## Access failure

If the Drive folder or any module folder is not accessible:

- STOP.
- Report missing access, name the folder that failed.
- Do not guess or fabricate content.
- Ask the user to grant access or paste the relevant content.

## Completion report

After a successful sync, report:

- number of modules synced
- for each module: Drive folder name, local slug, selected PRD version, number of ignored duplicates, number of attachments, unreadable file count
- any modules that failed to sync (with reason)
- any unanswered clarifying questions raised during sync
