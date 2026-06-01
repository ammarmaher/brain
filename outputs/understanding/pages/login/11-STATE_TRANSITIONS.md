*** Login — State transitions ***
*** 2026-05-18 ***

# Login — State Transitions

## LoginStepResponse FSM (server-driven)

```
GetStarted ──────► EnterOtp ──────► Complete
                       │
                       ├──► FirstLogin ──► Complete
                       │
                       └──► (wrong OTP × 3) → user Locked
GetStarted ──► (wrong creds × 3) → user Locked
```

## User status transitions driven by login

[PRD] BR-UM-22 + BR-UM-25 + BR-UM-27:

| From | To | Trigger |
|---|---|---|
| Pending | Active | Successful first-login + change password |
| Active | Locked | 3 wrong login attempts |
| Active | Locked | 3 wrong OTP attempts in login flow |
| Locked | (still Locked) | Subsequent login attempts blocked |

## Cross-stage transitions

```
Stage 1 (GetStarted)
  ├─ next=EnterOtp → Stage 2
  ├─ next=FirstLogin → Stage 3 (skip OTP? OPEN per BR-UM-22 wording)
  └─ next=Complete → handleLoginSuccess

Stage 2 (EnterOtp)
  ├─ next=Complete → handleLoginSuccess
  └─ next=FirstLogin → Stage 3

Stage 3 (FirstLogin / ChangePassword)
  └─ next=Complete → handleLoginSuccess
```

## handleLoginSuccess

[CODE] `AuthService.handleLoginSuccess(tokens)`:
1. Store JWT pair (accessToken + refreshToken).
2. Extract session info from token.
3. Fetch user's org node.
4. Schedule auto-logout (30-min idle per BR-UM-29).
5. Clear AuthFlowStateService.
6. Navigate to previously-saved redirect URL.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [06-SECTION_FLOW_STATE](06-SECTION_FLOW_STATE.md) · [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
