---
name: project-voice-record-name-exists-validation-config-2026-07-01
description: "Voice-record create wizard — as-you-type name-exists probe (like add-client) + runtime validation-config, FE both apps, builds green"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5976432b-1428-415f-a958-f9c51cccf11d
---

Voice-record CREATE wizard gained (1) an as-you-type tenant-unique **name-exists** probe (mirrors the add-user/add-client username check) and (2) a runtime **validation-config** fetch replacing all hardcoded name/file limits. FE-only, BOTH apps (mgmt comms-hub + admin comm-channels-services), UNCOMMITTED on `polishing-v0.4`. Backend UNTOUCHED (source of truth); the two endpoints already exist on templates-svc branch `feat/ivr-templete @ 23a97cb` (NOT on main) — the **running** service still needs a redeploy to serve them (user DEFERRED it; FE fails-open on defaults until then).

**Backend contract (verified by direct read):** `GET templates/voice-records/name-exists?name=` → `ServiceOperationResult<{exists}>` (client-only, Falcon 403; `VoiceRecordNameCheck.Normalize`=Trim only, CASE-SENSITIVE `r.Name==normalizedName`, tenant-wide, live-only; blank→false; advisory). `GET templates/voice-records/validation-config` → `{nameMinLength:2,nameMaxLength:50,maxFileSizeMB:20,allowedExtensions:[.mp3,.wav],allowedMimeTypes:[audio/mpeg,audio/wav,audio/x-wav,audio/wave,audio/vnd.wave]}` (client-only, Falcon 403). `CompleteVoiceRecordUploadHandler.cs:51-61,92` = trim→empty 400 required→min/max 400→unique 409→STORES TRIMMED name; server uses UTF-16 `string.Length`.

**Name validation contract enforced (FE mirrors server):** string · TRIM first · MANDATORY (whitespace-only=empty) · min 2 / max 50 (was hardcoded 55 → FIXED to 50, now config-driven) · NO charset restriction (accepts anything after trim) · tenant-unique via the probe · length in **UTF-16 `.length`** (matches server + input maxlength; dropped `codePointLength` for the name).

**Files (14):** models (+`VoiceRecordValidationConfig(Wire)`+`mapVoiceRecordValidationConfig`+`DEFAULT_VOICE_VALIDATION_CONFIG`+`VoiceRecordNameExistsWire`); service (+`getValidationConfig()` shareReplay+catchError→DEFAULT, +`nameExists()` HttpParams.set no-lowercase catchError→false, +`validationConfig$` cache); `voice-record-step1.validation.ts` (`validateVoiceRecordName/Step1` take `VoiceNameLimits`, `.length`, MAX 50, +`DEFAULT_VOICE_NAME_LIMITS`); `record-details-step.component.ts/.html` (config `input`, computed `maxName()/acceptTypes()/maxSizeMB()/nameLimits()`, inline `toSignal` probe pipeline, pending spinner, `nameError` sync-wins+duplicate-live, `step1Valid` blocks Next on dup); orchestrator `create-voice-record.component.ts/.html` (fetch config in ctor→`validationConfig` signal, pass `[validationConfig]` down, commitCreate uses `cfg.nameMin/Max`+`cfg.allowedMimeTypes`); i18n en+ar (`voiceRecords.wizard.validation.nameExists` + `.step1.checkingName`). Admin fails-open (Falcon 403→catchError→defaults+no-block).

**Adversarial review (3-lens+verify workflow) found 1 real LOW bug (both apps): ~300ms stale-verdict debounce window** — FIXED: probe emits `{name,exists}` `NameCheck` pair; `nameCheckPending`=computed(sync-valid && `nameCheck().name!==nameValue()`), `nameIsDuplicate`=computed(exists && name===current) so the gate/error never trust a one-name-lagged verdict; Next stays disabled (pending) during the window instead of reusing the old verdict. This is STRICTER than the accepted add-client pattern.

**Builds:** `nx build management-console` + `admin-console` GREEN (both, post-fix). Decisions: block Next on confirmed dup + fail-open on error; admin fail-open (defaults, skip probe); no backend redeploy from me. Live E2E user-gated (needs templates-svc redeploy of 23a97cb). Related: [[project-voice-service-client-port-2026-06-30]], [[project-voice-records-admin-readonly-v1-2026-06-30]], [[feedback-backend-is-sot-do-not-author-backend-2026-07-01]].
