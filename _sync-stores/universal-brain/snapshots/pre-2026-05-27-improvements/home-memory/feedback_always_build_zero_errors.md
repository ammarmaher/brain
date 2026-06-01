---
name: Always build before reporting done — zero errors
description: After any non-trivial code change in the Angular workspace, run nx build (admin-console / host-shell / management-console) and fix every error before reporting "done". Never claim a feature is complete with build errors outstanding.
type: feedback
originSessionId: 299209e0-1675-4b5d-8b1b-97c368036f7e
---
After any TypeScript / template / SCSS change in the Falcon Angular workspace, the iteration is NOT complete until `nx build <app> --configuration=development` runs cleanly with **zero errors**. Warnings on unrelated, pre-existing issues are acceptable per the strict-scope rule, but every error introduced by the current change must be resolved before reporting.

**Why:** Multiple turns have shipped "applied" / "wired" reports with hidden TypeScript errors, missing imports, template type mismatches, or duplicate exports — forcing the user to copy-paste compiler output back into the chat. Build verification catches these locally before the user ever opens the app.

**How to apply:**
- After landing a feature port, validator wiring, theming pass, or any cross-component change, run `npx nx build admin-console --configuration=development` (or whichever app hosts the change).
- Capture the output, scan for `error TS`, `error NG`, `Module not found`, duplicate-export errors, missing imports.
- Fix every error. Re-run. Iterate until the build succeeds.
- Pre-existing warnings in unrelated files (the strict-scope rule says don't touch them) are fine — note them in the summary but do not fix.
- Only after a clean build do you report "done".
- The user has explicitly authorised running `nx build` for verification — it is NOT considered "running dev-serve" (which is still off limits during implementation).
