---
name: project-adduser-step3-permgroup-optional-2026-06-06
description: "Add User wizard Step 3 \"Permission group\" made OPTIONAL (was mandatory), both consoles, via the 3-layer validation architecture"
metadata: 
  node_type: memory
  type: project
  originSessionId: 04cf6feb-8d7a-4c1d-8066-5cc981c8f838
---

Add User wizard **Step 3** (`user-permissions-step`) — the **"Permission group"** field (`permGroup`, label `hierarchy.addUser.assignedPermissionGroup`) was **mandatory**; made **OPTIONAL** on 2026-06-06 (claude), in BOTH admin-console + management-console (byte-identical step slices). Repo `C:\Falcon\Falcon\falcon-web-platform-ui`, branch polishing-v0.4. NO COMMITS.

**Brain check first (user asked to load brain):** making it optional is CONSISTENT with the spec, NOT a conflict. [BRAIN-SK] PRD-02 `latest-prd.md` create-user Tab 3 never tags Permission Group `mandatory` (every truly-required field IS tagged); [BRAIN-OUT] `06-validation-by-feature/MATRIX.md` has NO permGroup V-rule (it is "referential — V-rule n/a"); [BRAIN-OUT] BR-UM-42 only requires "one group per user" + BR-UM-40 says it is editable after create (so satisfiable later). The ONLY "required" source is the implementation playbook `understanding/pages/organization-hierarchy/flows/Add User.md:111` ✅ + the `validations.ts` doc-comment citing the legacy `Validation.xlsx` sheet "Add User - Step 3 Perms" ("required dropdown") — both authoring assumptions, not sourced rules. Flagged xlsx for next resync.

**Zero wire-contract risk:** `buildCreateUserWireRequest` (models.ts) ALREADY hardcodes `permissionGroupId: ''` regardless of the picked value (permission groups not yet PES-backed; old UI sent '' always) — so the FE selection was already discarded on the wire. Dropping the required gate changes nothing the backend sees.

**The 3-layer validation architecture (the "same architecture way" the user required):**
1. **Declarative rule table** via DI token `USER_PERMISSIONS_VALIDATIONS` in `user-permissions-step/validations/validations.ts` — was `{ permGroup: [permissionGroupValidator] }` (the `@falcon` "required-only" primitive). **FIX: removed the permGroup entry → `{}`** (mirrors checkerWhatsApp/checkerVoice which carry no rule) + dropped the now-unused `permissionGroupValidator` import + rewrote the doc-comment to OPTIONAL with a "restore X to re-impose" note. `FalconFieldRules<T>` = `{ readonly [K in keyof T]?: ... }` so an empty table is valid TS.
2. **Component** `user-permissions-step.component.ts` `isFormValid` had a hard short-circuit `if (!v.permGroup?.trim()) return false;`. **FIX: removed it** → `isFormValid = computed(() => allFieldsValid(this.value(), this.rules))`.
3. **Template** `user-permissions-step.component.html` `<falcon-form-field [required]="true">`. **FIX: `[required]="false"`** (drops the red asterisk).

Why these three: `[CODE] libs/falcon/.../falcon-validations.ts:844` `allFieldsValid` does `if (!fns?.length) continue;` → a field with no rule is skipped → step valid when permGroup empty; `:867` `fieldErrorMessage` returns null with no rule → no error UI. The wizard gates Finish on `step3Valid` (`isCurrentStepValid`→`onNext`→`onFinish`, step 3 = last of 3) so once isFormValid is always true the user can Finish with permGroup empty. Kept `permGroupError`/`touched`/`onBlur`/`revealErrors` plumbing intact (dormant now, returns null) — `revealErrors` is required by the `WizardStepHost` interface and preserves the generic mechanism for a one-line re-impose.

**Verification:** `nx build admin-console --configuration=development` EXIT 0 (Hash `af7bb915dff448b8`) + `nx build management-console --configuration=development` EXIT 0 (mgmt "unused file" tsconfig warnings are PRE-EXISTING, unrelated). No spec asserts the old required behavior (the permGroup/step3Valid grep hits are wallet-balance User fixtures + the contracts wizard's own `step3Valid`, not Add User). ⚠️ Live pixel/click verify (asterisk gone + Next/Finish enabled with empty group) PENDING user login — full MF dev stack + multi-step wizard auth is blocked by the credential policy (assistant can't type passwords); admin/mgmt are MF remotes so user may need `npm start` restart / hard-refresh for rebuilt dist.

6 files: `apps/{admin-console,management-console}/src/app/features/org-hierarchy-page/components/wizard-components/add-user-wizard/user-permissions-step/{validations/validations.ts, user-permissions-step.component.ts, user-permissions-step.component.html}`.

Related [[reference_fe_structure_standard_angular21_2026_06_02]] · [[project_datepicker_required_star_red_2026_06_06]] · [[reference_static_remote_rebuild_after_app_edit_2026_06_04]].
