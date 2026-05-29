---
type: agent-findings
agent: Module 02 deep-dive
date: 2026-05-18
---

# Module 02 (User Management) — Raw Agent Findings

## 1. Module inventory

- Total: 50 BR-UM-* (BR-UM-01..50)
- CONFIRMED: 44 (BR-UM-01..44)
- OPEN: 6 (BR-UM-45..50)
- INFERRED: 0

### 6 OPEN BR rules
- BR-UM-45 — Active→Locked via manual change: whether system notifies user is silent
- BR-UM-46 — Deleted→Active restore: whether original password still works OR re-sent credentials is silent
- BR-UM-47 — Idle 30-min logout: client-side vs server-side enforcement is silent
- BR-UM-48 — Profile picture format/size limits are silent
- BR-UM-49 — "Contact administrator" alert: whether it surfaces hierarchy-pulled manager contact info is silent
- BR-UM-50 — Whether changing password invalidates sessions on other devices is silent in PRD

### 3 E-* reviewed
- E-user — 9 fields, touches BR-UM-01..05, 10..20, 36..41
- E-session — 10 fields, touches BR-UM-22, 23, 24, 29, 35, 50
- E-otp-challenge — 11 fields, touches BR-UM-21, 22, 23, 26, 27, 28, 31, 32, 36

### Missing E-* entities referenced by BR-UM
- E-user-status-history (BR-UM-08 audit)
- E-login-attempt (BR-UM-25 lockout)
- E-permission-group (BR-UM-40, 42)
- E-permission (BR-UM-44)
- E-password-policy (cross-module bridge to AccountSettings)
- E-app-setting / E-otp-app-setting (BR-UM-28)

### V-rules binding BR-UM
- V-user-first-last-name-letters-only → BR-UM-11
- V-username-format-uniqueness-immutable → BR-UM-12, 19, 37
- V-login-lockout-3-wrong-attempts → BR-UM-25, 26, 27, 32
- V-password-complexity-per-security-level → BR-UM-15, 20, 22, 34, 37
- V-password-security-level-enum → bridges BR-AM-09 → BR-UM-15/22/34
- V-normal-user-limit-enforcement → BR-UM-07, 09, 17, 38

## 2. Business gaps (12 items — see REPORT.html Module 02 section for full details)

## 3. Cross-module references

| BR-UM rule | Cross to | Module |
|---|---|---|
| BR-UM-07, 09, 17, 38 | account.normalUserLimit | 01 |
| BR-UM-15, 22, 34 | account.passwordSecurityLevel | 01 |
| BR-UM-24 | account.allowedIps | 01 |
| BR-UM-43 | Permission list - Jawad | PES |
| BR-UM-40, 42, 44 | PermissionGroup, Permission | PES |
| BR-UM-49 | "Contact administrator" | Hierarchy + Notifications |
| BR-UM-31 | OTP delivery | Notifications |
| BR-UM-18 | Credential delivery | Notifications |

Gap: NO direct BR-UM cross-references to modules 03, 04, 05.

## 4. New V-rules + entities (17 V-rules + 7 entities — full in REPORT.html)

## 5. 15 yes/no questions (full in REPORT.html)

## 6. 12 GAP-BIZ-UM-* candidates (full in REPORT.html)
