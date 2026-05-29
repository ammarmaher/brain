*** Login — Stage 1: Get Started ***
*** 2026-05-18 ***

# Login — Stage 1: GetStarted

## Component

[CODE] `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts`:

- Selector: `app-get-started`
- Standalone
- Reactive Form (one of the few Reactive-Form features in old-UI — good sign)

## Fields

| Field | Required | Validator | DTO field |
|---|---|---|---|
| `username` | YES | required · trimmed · lowercased before send | `LoginRequest.Username` |
| `password` | YES | required (no complexity check FE; BE enforces) | `LoginRequest.Password` |

## Normalization

[CODE] `LoginService.login`:

```typescript
login(req: LoginRequest): Observable<LoginStepResponse> {
  const normalized = {
    Username: req.Username.trim().toLowerCase(),
    Password: req.Password,
  };
  return this.authApiService.login(normalized);
}
```

## Submit

```
POST /api/auth/login
Body: { Username, Password }
Response: ServiceOperationResult<LoginStepResponse>
```

`LoginStepResponse`:

```jsonc
{
  "sessionId": "<server-issued>",
  "nextStage": "EnterOtp" | "FirstLogin" | "Complete",
  "data": { /* stage-specific data */ }
}
```

## Branching

[CODE] On success:
- Save `sessionId` via `AuthFlowStateService.setSession(sessionId)`.
- Navigate per `nextStage`.

## UI shape

```
+--------------------------------------+
|         Falcon (logo)                |
|  Sign in to your account             |
|                                      |
|  Username  [_________________]       |
|  Password  [_________________]       |
|                                      |
|         [ Sign In ]                  |
|                                      |
|         Forgot password?             |
|                                      |
|  Language: [ English ▼ ]             |
+--------------------------------------+
```

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [03-STAGE_2_ENTER_OTP](03-STAGE_2_ENTER_OTP.md) · [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md)
