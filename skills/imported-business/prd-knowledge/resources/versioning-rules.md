*** Versioning Rules — prd-knowledge ***
*** How PRD versions are tracked, diffed, and recorded ***

# Versioning Rules

## Version sources

A module's PRD version is determined in this priority:
1. **`v<number>` selection rule** (PRIMARY — migrated from OLD claude-falcon-skills, preserved verbatim below)
2. Filename pattern `PRD-v<X.Y>.docx`
3. Explicit `Version: X.Y` line in PRD body
4. Drive file modified date (fallback — version recorded as `mtime-YYYYMMDD`)

## `v<number>` selection rule (canonical)

When duplicate PRD files exist for the same module, always use the latest version:

- Detect the number immediately after the literal character `v` in the file name
- The latest file is the one with the **HIGHEST numeric value**
- Compare as numbers, NOT as text

### Examples

| File | Version | Rank |
|------|---------|------|
| `Account Management PRD v1.docx`  | 1  | older |
| `Account Management PRD v2.docx`  | 2  | newer than v1 |
| `Account Management PRD v10.docx` | 10 | newer than v2 |

**`v10` is newer than `v2`.** Text comparison would say otherwise — do not use text comparison.

### Detection

- Regex: `v(\d+)` (case-insensitive) on the file name
- If multiple matches in the file name, use the last one before the file extension
- If the number has a decimal (`v1.2`), compare as a real number

### No version found

- If the file name has no `v<number>` marker, mark version as `unknown`
- If exactly one unknown-version PRD exists AND no versioned duplicate exists, use it and mark version as `unknown`
- If multiple unknown-version PRDs exist, **STOP and ask** which one should be treated as latest

### Multiple candidates with same highest version

- If two PRDs have the same highest version, prefer the one with the most recent Drive modification date
- If dates are also equal, **STOP and ask**

### Ignored duplicates

- All older versioned duplicates must be listed under `ignoredDuplicatePrds` in `source-map.json` and mentioned in `latest-prd.md`
- Never delete anything from Drive
- When a new version is added to Drive, the previously-selected PRD moves to `ignoredDuplicatePrds` automatically on re-sync

## Hashing

Every `latest-prd.md` has a SHA256 hash stored in `modules/<slug>/source-map.json`. Hash is computed from normalized markdown (after sync, before diff).

## Diff detection

On sync:
- Compute new hash
- Compare with stored hash
- If different: treat as `updated`
- If module folder did not exist: treat as `added`

## Changelog format

`modules/<slug>/changelog.md` is append-only. Each entry:

```markdown
## YYYY-MM-DD HH:MM — v<old> → v<new>
- Hash: sha256-<short>
- Source: Drive file ID `<id>`
- Change summary: <one-line summary if extractable>
```

## source-map.json shape

```json
{
  "drive_file_id": "1AbCDef...",
  "drive_path": "Account Management/PRD-v1.5.docx",
  "version": "1.5",
  "last_sync": "2026-04-30T15:00:00Z",
  "hash": "sha256-abcdef...",
  "previous_hash": "sha256-123456..."
}
```

## Conflicts

A "conflict" means the local `latest-prd.md` was edited by hand (its hash no longer matches `source-map.json:previous_hash`).

On conflict:
- Do NOT overwrite
- Report in sync output as `⚠ Conflicts: 1 (<slug>)`
- Save Drive version to `modules/<slug>/conflict.md` for manual review
- Continue with other modules
