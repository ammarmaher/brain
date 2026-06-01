---
name: Pixel-perfect test-fix-test loop until parity
description: For Falcon Angular conversions of React reference UIs, never declare a wave/feature done without iterating capture→diff→fix→re-capture until visual parity is reached. Always show evidence to user before sign-off.
type: feedback
originSessionId: b982c0c3-cf5a-4eb3-9882-55f78c5949d9
---
When converting a React source-of-truth UI (like the Falcon V-1 admin reference at `C:\Falcon\Source of truth theme\Falcon V-1`) into the Falcon Angular admin-console, the rule is:

**Never stop at "looks roughly right". Iterate capture → diff → fix → re-capture until the Angular surface is pixel-typical (≤2px tolerance per region) of the React reference.**

**Why:** User explicitly said on 2026-05-10 night-task kickoff for the Organization Hierarchy module: *"Don't go out or don't finish without you saying to me that is typically at is. Don't miss test, and it's not not fixed. Fix it and test it again and over and over and over and over to make sure that is exactly the same."*

**How to apply:**
- At the end of every wave, run the visual-diff harness (Playwright + pixelmatch) against the React reference URL.
- If `defects.json` shows any region above tolerance for the surfaces touched in this wave, the wave is NOT done. Fix the gap, re-capture, re-diff. Repeat without limit.
- Before declaring a wave done to the user, present the diff evidence (PNG pairs + defect JSON summary).
- Tailwind utility-first only — no SCSS classes, no PrimeNG, no external UI kit. Color/font/radius/shadow come from Falcon tokens via the angular-wrapper components in `[useTailwind]="true"` mode.
- The standing "no dev-serve during implementation" rule is overridden for visual verification on this kind of pixel-perfect conversion task — but use built artifacts served statically rather than `nx serve` watch mode.
