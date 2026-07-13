---
name: project-error-dialog-host-subtitle-fix-2026-06-06
description: "Error popup (FalconAngularErrorDialogHostComponent) now shows backend response errorMessages via [subtitle] — the projected <ul> default-slot never rendered through nested shadow:false dialog slots"
metadata: 
  node_type: memory
  type: project
  originSessionId: 016a0540-51cc-4c74-bdf5-35eaad27a08f
---

**FE bug FIXED 2026-06-06 (claude):** Editing Falcon (admin) settings → HTTP 404 `{ errorCodes:["NodeNotFound"], errorMessages:["Account or organization details are not found"] }` showed a popup with only the generic title "Not found (HTTP 404)" + count "1 error" — the actual backend message was missing. User: "make sure the error message value always shows at the bottom of the popup."

**Root cause:** `FalconAngularErrorDialogHostComponent` (SHARED `libs/falcon/src/shared-ui/lib/components/falcon-error-dialog-host/`) rendered the messages as a projected `<ul><li>` into `<falcon-angular-alert-dialog>`'s DEFAULT slot. That content does NOT render through the dialog's double-nested `shadow:false` slot chain (Angular `<ng-content>` → `falcon-alert-dialog-tw` default `<slot>` → `falcon-dialog-tw` default `<slot/>`; neither Stencil dialog sets `scoped:true`). The `[title]`/`[subtitle]` props + named header/footer slots render fine (emitted directly by the Stencil template) — only the consumer DEFAULT slot silently vanishes. Confirmed by precedent: sibling `confirm-dialog-host` passes its body via `[subtitle]`, never the default slot.

**Fix (feature-level, NO Stencil change, NO web-component dist rebuild):** `subtitleText` computed now returns the joined backend message(s) (`this.errorMessages().filter(Boolean).join(' · ')`) when present, falling back to the legacy count line (`hierarchy.error.countOne/countOther`) only when there's no message. Removed the non-rendering `<ul>` from the host template (now self-closing, like confirm-dialog-host) to avoid any double-render. The count "1 error" is displaced by the actual message (count was low-value). ONE shared edit fixes BOTH consoles (host mounted once in `host-shell/app.ts`); covers every `openError()` caller (org-hierarchy settings-tab + falcon-org-info-panel, admin + mgmt).

**Why the message always reaches the dialog (trace):** PUT 404 → service `catchError` → `httpFailure(err)` → `extractServerError` reads `body.errorMessages[0]` → local SOR `{ errors:[{code:'network',message:"Account...",httpStatusCode:404}], errorMessages:["Account..."] }` → slice `next:` → `inferStatus`=404 + `collectErrorMessages`=["Account..."] → `openError({ httpStatus:404, errorMessages:["Account..."] })`. Array was ALWAYS non-empty; only the render was broken (count showed = length 1, but the `<li>` never appeared).

**LESSON (reusable):** `<falcon-angular-alert-dialog>` default-slot (body) content does NOT reliably render through the nested shadow:false dialog slots — use `[title]`/`[subtitle]` for text you must show. To render a true body region reliably you'd need a Stencil change (add a body prop or `scoped:true`) = higher risk.

**Verified:** `nx build admin-console|management-console|host-shell --configuration=development` ALL EXIT 0; admin tests 713 pass incl. NEW `apps/admin-console/tests/error-dialog-host.spec.ts` (4 tests, runInInjectionContext pattern); `nx lint falcon` GREEN. ⚠️ `nx lint admin-console` shows 1 PRE-EXISTING UNRELATED error (`contracts-add-wizard/contract-information-step/contract-information-step.component.html:87` label-has-associated-control — concurrent contracts reskin, last commit "Adding Edit contract (75%)", NOT my file). NO COMMITS. ⚠️ live login pixel-verify pending (credential policy). Files: `falcon-error-dialog-host.component.ts` + `.component.html` + new spec. Related [[reference_fe_structure_standard_angular21_2026_06_02]] · [[project_wallet_drawer_amount_overbalance_disappear_rootcause_2026_06_06]] (same shadow:false slot-fragility family).
