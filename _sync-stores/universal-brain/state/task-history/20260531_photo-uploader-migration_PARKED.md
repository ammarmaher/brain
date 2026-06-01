# PARKED — photo-uploader-to-falcon-uploader-migration-2026-05-31

**✅ COMPLETE 2026-05-31 (W0–W5).** All 8 consumers migrated; oversize rejection + min-1.5s water-fill added; BOTH legacy components (`falcon-photo-uploader` + multi-file `falcon-uploader`/`-tw`) DELETED full-stack; 4 builds green (falcon-ui-core + admin + management + host-shell). NO commits. Runtime VISUAL smoke still recommended (no browser in-session; base64 proven by tests). Memory: `project_photo_uploader_to_image_uploader_migration_2026_05_31.md`.

**AUTHORITATIVE state + smoke checklist + remaining steps → `C:\Falcon\plans\photo-uploader-migration\STATUS.md`.**
Full plan: `plans/photo-uploader-migration/IMPLEMENTATION-PLAN.md` (v2) + `ANALYSIS-AND-PLAN.md`.

## One-line status
All 8 `falcon-photo-uploader` consumers migrated to `<falcon-angular-image-uploader>` (card/edit contexts) + verbatim static markup (Org-Panel read-only 84px ring; User-Details 96px hero, both view+edit). 3 apps build-green (admin/mgmt/falcon-ui-core, `--skip-nx-cache` exit 0). Base64 backend payload PROVEN byte-identical (`picture-file.util.spec` 20/20 + `wire-builders.spec` 3 picture assertions). Decoration flags suppressed (`showBanner/showStatusBadge/showSuccessRing/showWaves=false`) for parity. Shared helper `libs/falcon/src/shared-ui/lib/utils/picture-file.util.ts`.

## Decisions (LOCKED)
1. Read-only/avatar gap = **Option A** (no visual change: read-only = static markup; image-uploader for edit). **User-Details edit = exact 96px hero (static + helper, NO uploader dep).**
2. `falcon-uploader` deletion = **FULL stack** (Angular wrapper + Stencil + `-tw` + Studio showcase examples + barrels + docs).

## Resume = AFTER user's manual visual smoke passes
- **W4:** delete legacy `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/**` + barrel `shared-ui/index.ts:8`; zero-ref search.
- **W5:** delete `falcon-uploader` FULL stack (wrapper + Stencil `falcon-uploader` + `falcon-uploader-tw` + types/utils/css + `libs/falcon-studio/.../overlay-feedback-examples.ts` 6 usages + `gallery-defaults.ts:395` + `angular-wrapper/index.ts:32` + `libs/falcon/src/shared-ui/index.ts:113` + docs/safelists); rebuild all 3 + zero-ref search.

## Runtime verification status
Live browser verification UNAVAILABLE this session (Claude-in-Chrome ext not connected + host-shell `environment.ts`→localhost where Identity 500s). Base64 proven by tests; visual parity pending the user's manual smoke. To auto-verify later: connect Chrome ext + repoint `environment.ts` at `*.falconhub.space`, then drive Add Client (POST capture) + screenshots.

## Pre-existing unrelated (do NOT attribute to this work)
`wire-builders.spec.ts` 3 `priceType` failures = stale test (expects Yearly→4; code correctly maps Yearly→2).
