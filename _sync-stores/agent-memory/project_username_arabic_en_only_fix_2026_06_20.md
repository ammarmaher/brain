---
name: project_username_arabic_en_only_fix_2026_06_20
description: Username field accepted Arabic on Create User/Create Client — fixed FE regex to ASCII-only (EN); backend still not enforcing EN-only
metadata: 
  node_type: memory
  type: project
  originSessionId: dd0a2350-fa02-4b19-b3f9-b8d568b477b4
---

Username (Add User Step 1 + Add Client Step 5) was accepting Arabic, violating the xlsx SoT rule **"Lang: EN only"** ([[V-username-format-xlsx-2026-05-24]]).

**Root cause (FE):** the shared username charset regex `USERNAME_OR_EMAIL_NEW` at [CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts:50` used `\p{L}\p{N}` (any Unicode letter/digit) → Arabic ا-ي and Arabic-Indic ٠-٩ passed. The comment block right above even claimed "EN only" — a latent code-vs-intent drift.

**Fix (FE-only, 2026-06-20, NO commits):** changed to ASCII-only `/^([A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|[A-Za-z0-9_.+-]+)$/`. ONE regex covers ALL entry points — `userNameValidator = r.userName()` ([CODE] `named-validators.ts:32`) is consumed by all 3 wizards: admin Add-User, admin Add-Client Step 5, mgmt Add-User (all wire `userName: [userNameValidator]`). Account/person names INTENTIONALLY stay `\p{L}\p{N}` (multilingual) — only username is EN-only. Edit-User has no username charset rule (read-only/immutable after create), so nothing to fix there. Emits existing `{ userNameCharset: true }`.

**Tests:** +5 Arabic-reject cases each in `tools/validation-tests/add-user-validations.test.ts` + `add-client-validations.test.ts`. Result: userName 30/30 + ownerUser 32/32 = 100% (all Arabic rejected). The 6 `cap bump` failures in add-client are PRE-EXISTING `nationalId` digit-cap drift, unrelated. Builds: admin-console + management-console GREEN (`nx build --skip-nx-cache`).

**Backend ALSO aligned (2026-06-20, applied):** Identity `CreateUserRequestValidator` is the SINGLE backend username gate — both Add User and Add Client Account-Owner are created via Identity's one `CreateUserEndpoint`/`CreateUserRequest` (system-gateway has only AccountHierarchy+TestingCharging; Commerce has no username validator). `UpdateUserProfileRequestValidator` only validates First/Last name → username immutable on BE too (matches xlsx). Changes (build 0 warn/0 err): (1) new pattern `FalconValues.ValidationPatterns.UsernameOrEmail = ^([A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|[A-Za-z0-9_.+-]+)$` mirroring FE; (2) username rule now `NotEmpty + MinimumLength(2) + MaximumLength(30) + Matches(UsernameOrEmail)` — DROPPED `StartsWithLetter` (xlsx removed it, Wave F) and fixed the 100→30 length drift; (3) new error key `FalconKeys.Error.UsernameUnsupportedCharacter` + EN ("Username contains unsupported characters.") / AR ("اسم المستخدم يحتوي على أحرف غير مدعومة.") resx entries (reused existing `BelowMinimumLength`/`MaxLengthExceeded`). Old `UsernameMustStartWithLetter` key+resx left in place (now unused, harmless). +17 xUnit tests `CreateUserRequestValidatorTests` GREEN (valid EN / Arabic-reject / length / empty). Full Identity suite 193/196 — 3 failures are PRE-EXISTING unrelated (ResendOtpProcessTests ×2, UserCreationRequestedConsumerTests ×1; OTP/Kafka, no validator path). FE+BE now agree on the exact accept/reject set.

**Backend PUSHED (not yet a PR object):** branch `bugfix/username-en-only-validation` off `main`, commit `dbf4be6` (6 files +96/−2), pushed to Azure DevOps `falcon-core-identity-svc`. NO PR object created — `az` CLI absent + no PAT, so a PR can't be opened programmatically from the agent env (git push works via cached Git Credential Manager). Create-PR URL handed to user: `https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-identity-svc/pullrequestcreate?sourceRef=bugfix/username-en-only-validation&targetRef=main` (user clicks + marks draft). To open PRs programmatically here in future: need a PAT (REST) or `az` CLI. FE fix still uncommitted in `falcon-web-platform-ui` (separate PR pending).

**Why:** xlsx is validation SoT; username is the one field explicitly EN-only.
**How to apply:** for any "field accepts wrong language/charset" Falcon bug, check whether the shared validator uses `\p{L}`/`\p{N}` vs the xlsx Lang column; fix the single shared regex, not per-page. Related [[project_validation_xlsx_sot_flip_wave_f_2026_05_24]].
