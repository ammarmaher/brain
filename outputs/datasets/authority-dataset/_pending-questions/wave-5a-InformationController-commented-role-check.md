---
type: pending-question
wave: 5a
controller: InformationController
fork-id: F-004
status: OPEN
date: 2026-05-18
module: account-mgmt
feature: role-gate
verification: unverified
last-verified: 2026-05-18
tags: ["#status/open", "#module/account-mgmt", "#verification/unverified", "#layer/be"]
up: "[[Q-tickets-MOC]]"
parent: "[[Q-tickets-MOC]]"
tracked-as-task: true
priority: p1
due: 
blocked-on: [security-decision]
---

# Pending Question — InformationController commented-out role gate

> **Wave**: 5a (Commerce Controller deep-dive)
> **Controller**: `InformationController`
> **Action**: `PUT /api/Information`
> **Topic**: dead authorization check
> **Classification**: F-004 (intent drift) + F-021 (PES gap)
> **Raised by**: Ammar Core-Commerce
> **Date raised**: 2026-05-18

## Why halted

[CODE] `UpdateMainNodeInfoHandler.cs:32-33`:

```csharp
//if (_currentUser.Roles?.Contains(eUserRoles.NodeAdmin) == true || _currentUser.Roles?.Contains(eUserRoles.NormalUser) == true)
//    throw new FalconException(FalconKeys.Error.UnauthorizedUserToPerformThisAction);
```

The check is **commented out** in source. As-written, `NodeAdmin` and `NormalUser` are blocked from `PUT /api/Information`. As-deployed, any authenticated user can hit the endpoint.

The only remaining role-aware check inside the handler ([CODE] `UpdateMainNodeInfoHandler.cs:35-46, 72-75`) is a Falcon-vs-Client branch that controls **which fields** get persisted (Falcon: full edit including `AccountName` + `FinanceId`; Client: those fields silently dropped). There is no role-level "you cannot edit this resource at all" gate.

## Sources

- [CODE] `Falcon.Commerce.Application/Services/Handlers/UpdateMainNodeInfoHandler.cs:32-33`
- [BRAIN-OUT] `Brain Outputs/understanding/backend/commerce/controllers/InformationController/OVERVIEW.md` Finding #5
- [BRAIN-OUT] `Brain Outputs/understanding/backend/commerce/controllers/InformationController/VALIDATIONS.md`

## Plausible answers

### Answer A — Restore the check (intent was correct, was disabled for migration)
- Uncomment + retest
- `NodeAdmin` and `NormalUser` blocked from editing main-node info
- AccountOwner (or Falcon admin) is the only role that can edit
- PRD V-rule: V-AccountInfo-edit-role-gate (does not currently exist — author it)

### Answer B — Intentional removal (any role can edit)
- Document as intentional
- The Falcon-vs-Client field-level branching is the only restriction
- Frontend hides the edit button for `NodeAdmin` / `NormalUser` via PES, not backend
- Backend remains permissive — defense-in-depth gap if frontend / PES misconfigures

### Answer C — Replace with PES check (modern pattern)
- Backend reads `_currentUser.PES.adminConsole.accountInfo.edit` flag
- If `false` → throw `UnauthorizedUserToPerformThisAction`
- Aligns with platform-wide PES authorization pattern
- Requires PES key to exist (verify or author)

## Recommended question for the team

> "`UpdateMainNodeInfoHandler` has a commented-out role check (`NodeAdmin` / `NormalUser` blocked). Was this an intentional removal or a regression? Currently any authenticated user can submit a PUT to /api/Information; only AccountName + FinanceId are Falcon-gated. Should the role check be restored, replaced with a PES check, or documented as intentionally permissive?"

## Blast radius

| Area | Impact |
|---|---|
| Web Platform UIs | UIs hide the Edit button via PES; functional impact low |
| Security | **Backend permissiveness gap** — direct API call from a JWT with `NodeAdmin` or `NormalUser` role can update account info. Falcon-only fields are dropped, but the rest IS written. |
| PRD authoring | New V-rule needed (V-AccountInfo-role-gate) |

## Halt-and-flag classification

**F-004** — drift from intended authorization model.
**F-021** — PES key gap (no `adminConsole.accountInfo.edit` rule that we can confirm).

## Recommended interim action

Do not change. Flag to team and PRD authors. New V-rule + PES key should be authored before code change.

## Tasks-plugin tracking

- [ ] [[wave-5a-InformationController-commented-role-check]] Pending Question — InformationController commented-out role gate 🔼 #blocked-on/security-decision
