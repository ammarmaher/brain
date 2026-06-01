*** Login — Section: Flow state ***
*** AuthFlowStateService · 2026-05-18 ***

# Login — Flow State

> Multi-stage flow requires cross-screen state. [CODE] `AuthFlowStateService` (`apps/host-shell/src/app/features/auth/services/auth-flow-state.service.ts`) backs this with sessionStorage.

## State shape

```typescript
interface AuthFlowState {
  sessionId?: string;
  username?: string;
  pendingStage?: 'GetStarted' | 'EnterOtp' | 'FirstLogin' | 'Complete';
  phoneNumberMasked?: string;  // for OTP display
  emailMasked?: string;
}
```

## Persistence

Stored in `sessionStorage` under key `falcon-auth-flow`. Persists across page refresh + browser tab navigation within session.

## Cleared when

- `handleLoginSuccess` clears it (login complete).
- User clicks "Back to login" — manual clear.
- Tab closes (sessionStorage native).

## Why sessionStorage not localStorage

Security: sessionId should not persist across browser sessions. localStorage would survive close-and-reopen.

## Guards consume this

- `otpGuard`: if `sessionId` missing or `pendingStage !== 'EnterOtp'` → redirect /login.
- `changePasswordGuard`: if `sessionId` missing or `pendingStage !== 'FirstLogin'` → redirect /login.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [01-PERMISSIONS](01-PERMISSIONS.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
