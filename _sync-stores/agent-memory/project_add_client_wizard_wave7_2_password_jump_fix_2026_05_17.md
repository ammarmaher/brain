---
name: Add Client wizard Wave 7.2 password-jump fix
description: Fixed "wizard skips through all steps to Step 5 on open" regression caused by Wave 4.2 ↔ Wave 6.1 collision. Removed `currentStep.set(5)` from the generatedPassword effect.
type: project
originSessionId: 5e50e62a-ea70-4b24-8f40-e472b0122d46
---
# Add Client Wizard — Wave 7.2 Password-Jump Fix (2026-05-17)

🟢 **LANDED 2026-05-17.** `nx build admin-console` GREEN `dbaff9fade057bff` / 21.01s.

## Symptom

User reported: "When I add a client, it goes to all the steps to the last step and stops." Wizard auto-jumps from Step 1 to Step 5 ~500ms after open, without user clicking Next.

## Root cause — Wave 4.2 ↔ Wave 6.1 collision

[CODE] `add-client-wizard.component.ts:260-265` (before fix):
```typescript
effect(() => {
  const pwd = this.generatedPassword();
  if (!pwd) return;
  this.state5.value.update((cur) => ({ ...cur, ownerPwd: pwd }));
  this.currentStep.set(5);   // ← the bug
});
```

- **Wave 4.2 (2026-05-17)** added `currentStep.set(5)` so the operator would land on Step 5 when the password arrived via post-submit response. Made sense at the time: password ONLY came from successful submit.
- **Wave 6.1 (Agent H, same day)** added EAGER `generatePassword()` to the wizard-open `forkJoin`. The signal `lastGeneratedPassword` now fires ~500ms after wizard mount via the eager prefetch, NOT only at post-submit.
- The wizard's effect fires on every `lastGeneratedPassword` emission → `currentStep.set(5)` jumps from 1 to 5 while operator is still on Step 1.

## Fix

Removed `this.currentStep.set(5)` line. The password copy into `state5.value.ownerPwd` is preserved.

**Why removing the jump is safe in both paths:**
- **Post-submit path:** operator is ALREADY on Step 5 when they click Create (the Sending Credentials dialog + Completion Success dialog cover Step 5 until wizard auto-closes 10s later). They never see Step 5 again. The `set(5)` was a no-op.
- **Eager-prefetch path:** operator should remain on Step 1 (where they just opened the wizard). Removing the jump fixes the regression.

## Build verification

🟢 `nx build admin-console` GREEN — `dbaff9fade057bff` / 21.015s. Runtime verification blocked per VERIFICATION-STATUS.md (40+ workspace Stencil errors prevent dev server).

## Files touched

- `apps/admin-console/.../add-client-wizard/add-client-wizard.component.ts` (1 effect: removed `currentStep.set(5)` + added Wave 7.2 header explaining the regression)

## Trigger to revisit

- "Add Client wizard jumps to last step on open" → loads this memory
- Any future change to the `generatedPassword` effect or the eager `forkJoin.password` stream
