---
name: project-infopanel-notfound-swallow-2026-05-28
description: "B-13 swallow-to-empty-state pattern applied to mgmt-console InformationService.getInformation(); non-obvious backend contract that GET main-node-info returns null/200 (never throws), making the leak latent"
metadata: 
  node_type: memory
  type: project
  originSessionId: e13dc0ca-4636-4538-adea-93271bbb6a7a
---

Applied the B-13 swallow-to-empty-state pattern to `InformationService.getInformation()` in management-console (org-hierarchy InfoPanel), mirroring the already-shipped `settings.service.ts` fix: added private `isInformationNotFound(err)` (`status===404` OR `error.errorCodes` includes `'MainNodeNotFound'`) and on that benign case `catchError` returns `of<ServiceOperationResult<InfoViewModel>>({ isSuccessful: true, result: fromGetMainNodeInfoResponse(null) })` so the raw English backend message never reaches `InfoPanelStateSlice.firstMessage()` → `TranslateService` (which would log `[TranslateService] Translation key not found: "<raw english>"`).

**Why:** Latent cosmetic leak identical in shape to B-13. Keeps the swallow pattern consistent across the org-hierarchy services (HierarchyService.getTree/loadNodeChildren/getUsers all swallow non-success into benign values). Added NO i18n keys, changed NO backend. Verified: `nx build management-console --skip-nx-cache --configuration=development` GREEN (hash `2ced7092780e6280`), eslint clean on the touched file. NO COMMITS.

**How to apply:** Non-obvious backend contract worth remembering — `[CODE] GetMainNodeInfoHandler.cs:18-38` uses the projection `GetAsync(filter, select)` overload (`[CODE] MongoRepository.cs:36-39` → `FirstOrDefaultAsync()`), so a missing Main node returns `null`→`200 isSuccessful:true`, NOT a thrown `*NotFound`. So unlike `GetSettingsHandler.cs:131` (`?? throw NodeNotFound`), the InfoPanel GET path never actually emits a NotFound today → this swallow is purely DEFENSIVE/latent. Code chosen = `MainNodeNotFound` (`[CODE] FalconKeys.cs:83`, `[ErrorHttpStatus(404)]`, value = `nameof` → `"MainNodeNotFound"`); sibling `NodeNotFound` (`FalconKeys.cs:80`, also 404) is the one thrown on the PUT path (`UpdateMainNodeInfoHandler.cs:115`) and is covered by the `404` branch. Related: [[project_admin_to_mgmt_e2e_verified_2026_05_28]] (B-13 origin / B-12/B-13 backend gaps).
