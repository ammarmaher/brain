# 07 — Security, Language, and Comments Governance

## Security Review

Scan for:

1. hardcoded credentials
2. tokens/secrets/API keys
3. .env committed values
4. unsafe localStorage/sessionStorage token usage
5. console logs leaking data
6. unsafe innerHTML
7. bypassSecurityTrustHtml / bypassSecurityTrustUrl usage
8. direct DOM manipulation
9. unsafe JSON parsing
10. file upload validation weakness
11. missing file type checks
12. missing file size checks
13. upload preview risks
14. XSS risk
15. insecure URL building
16. direct window/document usage where risky
17. missing error handling on API calls
18. permission/PES bypass risks in UI
19. exposed debug flags
20. comments containing secrets or credentials

Safe auto-fix:

- remove unnecessary console logs
- remove commented secrets
- replace unsafe JSON parse with safe parse helper when clear
- report unsafe HTML/bypass sanitizer cases
- report file upload security gaps when unclear

Never delete or rewrite security-sensitive behavior without understanding the flow.

## Language / Naming Cleanup

Fix safe:

- unclear names
- typo names
- inconsistent names
- bad folder names if safe
- bad file names if safe
- unclear variable names
- inconsistent config names
- confusing comments
- outdated comments
- commented-out code
- wave/date/fix comments

Do not rename public APIs if risky.

## Comments Rule

Do not add normal comments.

Allowed comment format only:

```ts
/// ########[Business Need: <3 to 5 words>] --- [Scope: <area/function/dependency>] --- [Implementation: <name>] ########
```

Example:

```ts
/// ########[Business Need: Load Users Data] --- [Scope: User List Page] --- [Implementation: getUsers] ########
```

Forbidden comments:

- wave comments
- date comments
- bug fix comments
- implementation history comments
- explanation comments
- obvious comments
- commented-out code
- TODO comments unless explicitly approved
- temporary comments
- comments explaining what the code already says

If a comment contains important business meaning, convert it to the allowed format only when it marks a major logical section.
Otherwise delete it.

Do not overuse allowed comments.
Clean code should explain itself through names and structure.
