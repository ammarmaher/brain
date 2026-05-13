*** Brain Outputs — PRD understanding ***

# Falcon PRD understanding

This folder holds the **brain's generated analysis** of the Falcon PRDs. It is *output*, not source — the canonical PRDs themselves live elsewhere (see Sources below).

## Canonical source

- **Drive folder (authoritative):** `https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH`
- **Local synced mirror (already populated by the `prd-knowledge` skill):** `C:\Falcon\Brain SK\skills\imported-business\prd-knowledge\modules\`

The Drive folder is the source of truth. The local mirror is refreshed via the `take latest from PRD` / `update PRD knowledge` commands of the `prd-knowledge` skill (see `Brain SK\skills\imported-business\prd-knowledge\Skill.md`).

## Why this folder exists

Brain SK does **not** edit the synced PRD mirror — that folder is owned by the `prd-knowledge` skill. Any analysis the brain runs on top of the PRDs lands here, under `outputs/prd/`, so that:

1. The PRD source mirror stays a 1:1 reflection of Drive.
2. Brain analysis is separately attributable and re-generatable.
3. PRD evolution and brain analysis evolve on independent schedules.

## Layout

```
prd/
  README.md             ← this file
  PRD_INDEX.md          ← module-by-module table with status, last sync, key facts
  modules/
    01-account-management/
      OVERVIEW.md       ← purpose, actors, key screens, key actions
      BUSINESS_RULES.md ← extracted rules (with source citation back to latest-prd.md)
      ENTITIES.md       ← domain entities + relationships
      WORKFLOWS.md      ← key user/system workflows
      QUESTIONS.md      ← open questions from the PRD that need follow-up
      GAPS.md           ← gaps between PRD and current implementation (cross-refs backend understanding)
    02-user-management/
      …
    03-contract-packaging-charging-billing-management/
      …
    04-contact-group-management/
      …
    05-templates/
      …
    root-documents/
      …
```

Each module under `modules/<slug>/` mirrors the slugs the `prd-knowledge` skill already uses, so the two folders pair 1:1.

## Hard rules

- Never edit the `prd-knowledge` mirror (`Brain SK\skills\imported-business\prd-knowledge\modules\`) from here. That is owned by the sync skill.
- Every business rule / entity / workflow captured here MUST cite the source line from the corresponding `latest-prd.md` so a future reader can verify against Drive.
- If the Drive folder is unavailable and the local mirror is stale by more than 14 days, the brain must report `STALE — re-sync required` rather than generating analysis from old PRDs.

## Status as of 2026-05-13

- Drive URL canonicalized in `config/brain.config.json` as `paths.prdDriveUrl`.
- Local mirror present at `Brain SK\skills\imported-business\prd-knowledge\modules\` with 6 module folders synced through 2026-04-24 (verified).
- First-pass PRD understanding agent dispatched in this same Brain SK pass — see per-module files alongside this README.
