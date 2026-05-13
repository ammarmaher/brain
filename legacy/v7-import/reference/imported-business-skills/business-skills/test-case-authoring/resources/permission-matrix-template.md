*** Permission Matrix Template — test-case-authoring ***
*** Roles × Actions grid for every module ***

# Permission Matrix Template

## Shape

Each module's `test-plan.md` includes a permission matrix:

| Role \ Action | Create | Read | Update | Delete | Approve | Export |
|---|---|---|---|---|---|---|
| Tenant Admin | ✅ TC-XX-010 | ✅ TC-XX-011 | ✅ TC-XX-012 | ✅ TC-XX-013 | ✅ TC-XX-014 | ✅ TC-XX-015 |
| Tenant User  | ❌ TC-XX-020 | ✅ TC-XX-021 | ❌ TC-XX-022 | ❌ TC-XX-023 | ❌ TC-XX-024 | ✅ TC-XX-025 |
| Falcon Admin | ✅ TC-XX-030 | ✅ TC-XX-031 | ✅ TC-XX-032 | ✅ TC-XX-033 | ✅ TC-XX-034 | ✅ TC-XX-035 |
| Anonymous    | ❌ TC-XX-040 | ❌ TC-XX-041 | ❌ TC-XX-042 | ❌ TC-XX-043 | ❌ TC-XX-044 | ❌ TC-XX-045 |

Legend:
- `✅` = role allowed, link to positive test
- `❌` = role denied, link to negative test
- `—` = action not applicable to role
- Every cell with ✅ or ❌ must have a TC ID

## Generation rules

1. Roles come from the Falcon permission model (Wiki: `Permissions-&-Authorization-Module`)
2. Actions come from the module's PRD (CRUD + module-specific verbs)
3. Every cell with a TC ID has a corresponding `@permission` Gherkin scenario
4. Negative tests assert: HTTP 403, no data leak, no state change, error message in correct language

## Anti-patterns

- ❌ Inline permission checks in unrelated scenarios — keep them in the matrix
- ❌ Skipping anonymous role — always test the unauthenticated case
- ❌ Stub roles only — must use real Zitadel role assignments
