# Contact Group Step-1 uploader — INVISIBLE → fixed (2026-05-31) ✅ COMPLETE

**Repo/branch:** C:/Falcon/Falcon/falcon-web-platform-ui · polishing-v0.4 · **NO COMMITS**
**Verify:** `nx build management-console --configuration=development --skip-nx-cache` REAL `BUILD_EXIT_CODE=0`; `falcon-ui-document-uploader-tw.js` (16.57 kB) chunk emitted; no contact-group warnings. Visual confirmation = user hard-refresh (running app).

## Symptom (user visual smoke)
Create Contact Group Step 1 showed Group Name + "Contact file is required" + "Download sample template" but the `<falcon-angular-document-uploader>` widget was BLANK (no dropzone).

## Root cause [CODE]
`falcon-angular-document-uploader` wrapper (`libs/falcon-ui-core/src/angular-wrapper/components/falcon-document-uploader/`) has TWO render paths:
- `useTailwind=true` (default) → `<falcon-document-uploader-tw>` (light DOM), rendered ONLY after `ngOnInit` → `defineFalconTwComponent('falcon-document-uploader')` self-registers it + flips the `definedTw` gate.
- `useTailwind=false` → shadow `<falcon-document-uploader>`, rendered IMMEDIATELY with NO registration step.

The shadow variant is NEVER registered in the console apps (only the host-shell showcase wires both). So `useTailwind=false` → inert unknown element → renders blank/zero-height.

## Why ours hit it
Step-1 was the ONLY consumer in all 3 apps with `[useTailwind]="false"` (a prior session "KEPT the shadow-DOM path" — a mistake). Every other uploader (org-info-panel admin+mgmt, templates wizards, add-client steps, settings-tab, host-shell) uses `[useTailwind]="true"`. `define-falcon-tw-component.ts:45` registers the `-tw` loader for `falcon-document-uploader` (dist emitted; the comment even warns the loader is load-bearing for the contact-group upload).

## Fix (1 file, template-only)
`apps/management-console/.../create-contact-group/steps/upload-group-details-step/upload-group-details-step.component.html`: `[useTailwind]="false"` → `"true"` + corrected the stale "shadow-DOM render path" comment. No .ts/service/test change needed (class logic + CVA writeValue feed both paths identically).

## REUSABLE RULE
For Falcon `falcon-angular-{document,image,...}-uploader` in any console app, ALWAYS `[useTailwind]="true"` (the self-registering `-tw` light-DOM variant). `useTailwind=false` (shadow) renders BLANK because the wrapper never registers the shadow element outside the showcase.

## Latent (flagged, NOT fixed)
The wrapper silently renders blank on the unregistered shadow path; a dev-warning/guard belongs in `libs/falcon-ui-core` — deferred (shared-lib + the parked photo-uploader task is active there).
