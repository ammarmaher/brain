# Contact-Group Step-1 — Upload-on-Select + Live Progress (Option A)

**Date:** 2026-05-30 · **Branch:** polishing-v0.4 · **Status:** ✅ DONE + BUILD-GREEN (mgmt dev, hash `5b703d11304c8c6b`, `NX_EXIT=0`, "Successfully ran target build … and 6 tasks") · **NO COMMITS** · runtime-pending (see below).

## Follow-up to the re-wire (`20260530_195625_contact-group-uploader-rewire.md`)
After the best-practice re-wire shipped, the user picked **Option (a) "Full — live progress in uploader"** (AskUserQuestion). Goal: the S3 upload fires on **file-select** (not on the Next click), and the `<falcon-angular-document-uploader>`'s own water bar shows the **REAL** upload status/progress. This realigns with the React SoT (`contact-groups-flow.jsx` parses on pick).

## Change (3 files, mgmt only, no shared-lib change)
- **`services/contact-group-api.service.ts`** — exported `ContactUploadPhase` (shared phase union; orchestrator + step both consume it; orchestrator's inline union replaced).
- **`create-contact-group/create-contact-group.component.ts`** (orchestrator):
  - `onFileChange(file)` now calls `runUploadPipeline()` when a file is present (upload on select).
  - `completeUploadOnce()` no longer auto-advances to 'configure' — stays on Step 1 (user clicks Next; SoT-aligned).
  - `nextStep()` 'upload' branch just advances (no re-upload); gate uses new `currentStepAdvanceable`.
  - New computeds: `canAdvanceUpload` (= step-1 form valid AND `uploadPhase()==='done'`), `currentStepAdvanceable`, `nextDisabled`. `forwardLockedFrom` uses them. Next button `[disabled]="nextDisabled()"` + `[loading]` extended to include `'init'`.
  - Passes `[uploadPhase]`/`[uploadProgress]`/`[uploadError]` to the step.
  - Removed a PRE-EXISTING unused `RouterLink` import (NG8113, unused at HEAD — cleaned since I was in-file).
- **`steps/upload-group-details-step/`**:
  - New `@Input()`s `uploadPhase`/`uploadProgress`/`uploadError` (mirrored to sigs in ngOnChanges).
  - `(fileAdd)` now captures the full `FalconFileUploaderAddDetail` → stores `descriptorSig` (was `$event.nativeFile`).
  - `uploaderDisplayFiles` computed maps phase→`FalconFileUploaderFileStatus` + real `%`: init/uploading→`uploading`@pct, completing→`uploading`@100, done→`success`@100, error→`error`+errorMessage.
  - An `effect()` pushes that into the uploader via the wrapper's **CVA `writeValue`** (the showcase-blessed path — driving the wrapper's own value avoids the `[files]`-binding clobber).

## Why safe
- Loop-free: Stencil `files` is `@Prop({mutable:true})` with **no `@Watch`**, so `writeValue`→`[files]` prop-set does NOT re-emit `falcon-change`. `emitChange` only fires on user actions / the `setFiles` @Method (neither triggered by my CVA path).
- `[multiple]="false"` invariant + create payload + business rules untouched. No spec asserts old behavior (grep clean; no create/upload specs exist).
- The earlier "build failed (Can't resolve @falcon/studio/runtime)" was a TRANSIENT nx dep-graph flake (same code rebuilt green twice; the `| tail` pipe had masked nx's real exit code).

## Verification
**Deterministic unit tests — 17/17 PASS** (new `tests/contact-groups/`, `npx vitest run tests/contact-groups/` EXIT 0):
- `upload-group-details-step.component.spec.ts` (8) — `uploaderDisplayFiles` maps every phase→{status,progress}: init/uploading→uploading@%, completing→uploading@100, done→success@100, error→error+errorMessage+network, idle→queued@0, none→[], onFileRemove→[].
- `create-contact-group.component.spec.ts` (9) — onFileChange(file)→initUpload called once (upload-on-SELECT); onFileChange(null)→no upload; full init→PUT→complete reaches phase `done` WITHOUT auto-advancing (stays on Step 1); switching files re-inits; `nextDisabled`/`canAdvanceUpload` BLOCK while uploading, ENABLE on done+valid, BLOCK on done+invalid; nextStep upload→configure without re-init; no advance while uploading.
- Pattern: class-only construction via `TestBed.runInInjectionContext(() => new Cmp())` + `../contracts/_support` (`call`/`readSignal`/`setSignal`); api + S3 handshake stubbed with sync `of(...)`. No browser/DOM/network.

**Live browser drive — INCONCLUSIVE (env-blocked, NOT a code defect).** `ammar-qa-web` could not reach the wizard:
1. **Local login HTTP 500 for ALL creds** — and the running `apps/host-shell/src/environments/environment.ts:20-27` actually points at **localhost** backends (Identity :7777, PES :5296, gateways :7038/:7256), NOT live `*.falconhub.space` (that source comment is STALE — my earlier assumption was wrong). Local Identity is the known-broken Zitadel/FieldEncryption 500. The live `auth.falconhub.space` is up (clean 401) but REJECTS seeded `accowner` (`Admin@1234` + `Falcon@2026!` both 401) — live tenant has different seed data → no token obtainable anywhere.
2. **:4200 dev-serve has a STALE/partial `falcon-ui-core` Stencil dist** (stub components, TS2306/TS2307 overlay) — separate from my production `nx build` which rebuilt that dist clean. Fix: `nx build falcon-ui-core --skip-nx-cache`.

To enable a live drive later (for Essentials/orchestrator): fix local Identity login OR repoint env at live + provide valid live acc-owner creds, AND rebuild falcon-ui-core dist. Then re-run ammar-qa-web. The behavior was NEVER exercised live, so no PASS/FAIL there — but the 17 unit tests cover the logic deterministically. Concurrency: `current-task.json` held by a sibling (wallet-button-polish) — not clobbered.
