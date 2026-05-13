*** PRD Source Rules — prd-knowledge ***
*** Migrated verbatim from OLD claude-falcon-skills/business-prd-skill — preserves the working Drive-source contract ***

# PRD Source Rules

## Primary source

Google Drive folder:

https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH

This is the authoritative source for all Falcon business PRDs, test data, and supporting documents.

## Access

- If the Drive folder or a module folder is not accessible, STOP and report missing access.
- Name the folder that failed.
- Do NOT guess PRD content.
- Do NOT generate fake module understanding.
- Do NOT generate fake test cases.

## Scope

- The Drive root may contain module folders AND standalone documents.
- Always scan INSIDE each module folder — duplicates and assets live there.
- Standalone root documents are treated as general documentation and mapped to `modules/root-documents/` unless they clearly belong to a specific module.

## Do not

- Do not treat older duplicate PRDs as active source.
- Do not invent file contents for unreadable files.
- Do not edit application code while syncing PRD knowledge.
- Do not install packages, run migrations, or refactor code during a sync.

## Trust chain

1. The selected latest PRD (highest `v<number>`) is the primary source.
2. Supporting attachments marked "used for understanding" are secondary.
3. Everything else is inventory, not source.
