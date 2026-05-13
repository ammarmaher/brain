*** Per-User Folder Rules ***
*** Convention + creation policy for prd-knowledge/modules/users/<user-slug>/ ***

# Per-User PRD Folder Rules

When a PRD references a user (via the `assignee` or `owner` field) and that user has no
folder under `prd-knowledge/modules/users/`, the orchestrator creates one. The folder is a
landing zone for the per-user PRD slice that future passes will populate.

## Convention

```
brain-skills/business-skills/prd-knowledge/
  modules/
    users/
      <user-slug>/
        latest-prd.md      <- empty placeholder; populated by future per-user PRD slicer
        .gitkeep           <- ensures folder is tracked even when empty
```

### `<user-slug>` derivation

- Source field, in priority order: `assignee` → `owner` → `pm` → `requested_by`.
- Lowercase the value.
- Trim whitespace.
- Replace spaces and underscores with `-`.
- Strip every character that is not `[a-z0-9-]`.
- Collapse runs of `-` into a single `-`.
- Strip leading and trailing `-`.

Examples:

| Source field value | `<user-slug>` |
|---|---|
| `Ammar Mk` | `ammar-mk` |
| `Sarah O'Brien` | `sarah-obrien` |
| `Jose_Garcia-Lopez` | `jose-garcia-lopez` |
| `  John  Doe  ` | `john-doe` |

If the derived slug is empty after stripping, skip the user (log `USER_FOLDER_SKIPPED:
empty-slug` to the sync report).

## Creation policy

| Condition | Action |
|---|---|
| Folder exists with a non-empty `latest-prd.md` | Skip. Do not overwrite. Log `USER_FOLDER_KEPT: <slug>`. |
| Folder exists with empty `latest-prd.md` | Skip. Log `USER_FOLDER_KEPT: <slug>`. |
| Folder missing | Create folder + empty `latest-prd.md` + `.gitkeep`. Log `USER_FOLDER_CREATED: <slug>`. |
| `<slug>` empty after derivation | Skip. Log `USER_FOLDER_SKIPPED: empty-slug` (with original value). |

## `latest-prd.md` placeholder content

The placeholder is a one-line marker so a future per-user slicer can detect "first run":

```
<!-- placeholder; per-user PRD slice not yet generated -->
```

Never edit this file by hand. The per-user PRD slicer (out of scope for Phase D) will overwrite
it on its first run.

## `.gitkeep` content

Empty file. Pure marker so source control tracks the folder even when `latest-prd.md` is
gone or empty.

## Logging

Every action lands in the sync report under a `Per-user folders` section. One line per user:

```
USER_FOLDER_CREATED: ammar-mk
USER_FOLDER_KEPT: sarah-obrien
USER_FOLDER_SKIPPED: empty-slug (source: "")
```

## Hard rules

1. Never delete an existing user folder. The orchestrator only creates.
2. Never overwrite an existing `latest-prd.md` from this step. Asset overwrite is a separate
   step with its own rule (see [asset-download-rules.md](./asset-download-rules.md)).
3. Slug collisions (two source values producing the same slug) are not an error — the
   second occurrence is logged as `USER_FOLDER_KEPT`.
