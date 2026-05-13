*** Attachment Rules — prd-knowledge ***
*** How non-markdown PRD assets are classified and stored ***

# Attachment Rules

## Classification

| Extension | Destination |
|---|---|
| `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp` | `assets/images/` |
| `.svg` | `assets/images/` (vector) |
| `.xlsx`, `.xls`, `.csv` | `assets/excel/` |
| `.docx`, `.doc` (non-PRD) | `assets/word/` |
| `.drawio`, `.vsdx` | `assets/diagrams/` |
| `.pdf` | `assets/word/` |
| anything else | `assets/other/` |

## Naming

- Preserve original filename if safe (no spaces, ASCII)
- Otherwise: kebab-case the name, preserve extension
  - `Account Flow Diagram.drawio` → `account-flow-diagram.drawio`

## Linking from `latest-prd.md`

Use relative paths:
```markdown
![Flow](./assets/diagrams/account-flow-diagram.svg)
[Tariff sheet](./assets/excel/tariffs-2026.xlsx)
```

## Deduplication

If two modules reference the same asset, each module gets its own copy. No shared asset folder. Keeps modules self-contained.

## Size cap

Assets > 5MB: skip with warning, log in sync output. PRDs should not need binaries that large.

## Allowed binary types only

Reject `.exe`, `.dll`, `.bat`, `.ps1`, `.zip` (other than top-level incoming export). Log + skip.

---

## Migrated from OLD: full attachment-handling rules

### What counts as an attachment

Anything inside a Drive module folder that is NOT the selected latest PRD:
- other Word files (older PRDs OR supporting docs)
- Excel files
- images, screenshots, diagrams
- PDFs, text files, other documents

### Word files

- Older PRD versions → listed as `ignoredDuplicatePrds` in `source-map.json` and mentioned in `latest-prd.md`
- Supporting Word docs (non-PRD) → summarized in `attachments.md` with key points

### Excel files

Inspect for:
- permission / role matrices
- validation rules
- workflow state tables
- test data
- feature / flag toggles
- field-to-screen mappings

In `attachments.md`, per Excel file list:
- file name
- useful sheet names
- a short description of each useful sheet's structure
- rows/columns that matter for understanding

### Images / screenshots / diagrams

- Use them to improve understanding of screens, flows, and UI
- Summarize visible information (screen names, buttons, fields, flow arrows) in `attachments.md`
- Link each image's stored path in `source-map.json`
- Store copies under `assets/images/` or `assets/diagrams/` as appropriate

### Unreadable files

- List under "Unreadable files" section in `attachments.md`
- List in `source-map.json` under `unreadableFiles` with `{ fileName, reason }`
- Do NOT invent their content
- Flag to the user so they can export to a readable format

### Used-for-understanding flag

Each attachment entry records:
- whether it influenced `understanding.md` (`used_for_understanding: yes/no`)
- what key information was extracted
- any notes (e.g. "truncated", "partially readable", "older than PRD", "contradicts PRD section X")

### Storage layout (5 required subfolders per module)

```
modules/<slug>/assets/
  images/      -- screenshots, photos, image attachments
  excel/       -- original Excel files and Google Sheets exported as .xlsx
  word/        -- original Word files and Google Docs exported as .docx
  diagrams/    -- Google Drawings (exported as .png + .pdf) and standalone diagram files
  other/       -- anything that does not fit the above
```

### Download & OVERWRITE rule (every sync — non-negotiable)

Every `take latest from PRD` / `update PRD knowledge` MUST:

1. Ensure the 5 subfolders exist under each `modules/<slug>/assets/`; create any that are missing
2. Download the ORIGINAL file from Drive (or the best-quality export for Google-native types) into the matching subfolder
3. **Always OVERWRITE** the existing local copy — no versioning, no renaming, no "skip if exists"
4. Apply to every Drive file in the module: the selected latest PRD, supporting documents, older duplicates, spreadsheets, images, Drawings — **no file-size exception**
5. Keep the Drive file's original name; sanitize only filesystem-illegal characters (`<>:"/\|?*` → `_`)
6. Record each `localAssetPath` on that file's entry in `source-map.json` alongside the Drive link / ID
7. On download failure, record under `unreadableFiles` with reason; do NOT delete any existing local copy on failure

### Export choices for Google-native types

- **Google Doc** → `.docx` (mime `application/vnd.openxmlformats-officedocument.wordprocessingml.document`) into `assets/word/`
- **Google Sheet** → `.xlsx` (mime `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`) into `assets/excel/`
- **Google Drawing** → `.png` AND `.pdf` into `assets/diagrams/`
- **Google Slides** → `.pdf` into `assets/other/` (fallback)
