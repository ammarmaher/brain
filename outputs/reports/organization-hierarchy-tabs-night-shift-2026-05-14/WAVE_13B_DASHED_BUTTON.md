# Wave 13b — `<falcon-angular-button variant="dashed">` (GAP-LIB-009)

**Date:** 2026-05-14
**Gap closed:** GAP-LIB-009 — `<falcon-angular-button>` lacks `variant="dashed"`.
**Approach:** Add `dashed` as a first-class variant in the Stencil component (Shadow + Light DOM paths), wire tokens, extend the Angular wrapper's type, and replace the Tailwind workaround in `client-settings-step` with the new variant.

## Files changed

### Library (Falcon UI Core + tokens)
1. `libs/falcon-ui-core/src/components/falcon-button/falcon-button.types.ts`
   - `FalconButtonVariant` union: appended `'dashed'`.
2. `libs/falcon-ui-tokens/src/components/button.tokens.css`
   - New `--falcon-button-dashed-{bg,text,border}{,-hover,-active,-disabled}` token tier.
   - New `--falcon-button-dashed-border-style: dashed` token (consumed by Shadow CSS).
3. `libs/falcon-ui-core/src/tailwind/button-tailwind-classes.ts`
   - Added `dashed` block to `variantMap` (utilities reading dashed tokens + `border-dashed` override).
   - Added `disabled:!text-…dashed-text-disabled` to `variantDisabledTextMap`.
4. `libs/falcon-ui-core/src/components/falcon-button/falcon-button.css`
   - New `.falcon-button-root.variant-dashed` rule set (idle / hover / active / disabled) reading the same tokens; uses `border-style: var(--falcon-button-dashed-border-style, dashed)` to override the universal `solid` default.

### Angular wrapper
5. `libs/falcon-ui-core/src/angular-wrapper/components/falcon-button/falcon-button.component.ts`
   - Local `FalconButtonVariant` literal extended with `'dashed'`. No template change needed — the wrapper already forwards `variant` via `[attr.variant]`.

### Consumer (admin-console)
6. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.ts`
   - Imported `FalconAngularButtonComponent` from `@falcon/ui-core/angular` and added it to `imports[]`.
7. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html`
   - Replaced the plain `<button class="… border-dashed border-falcon-teal-700 …">` with `<falcon-angular-button variant="dashed" size="md" …>` using `slot="icon-start"` for the plus icon and `slot="label"` for the translated label. `(falconClick)` wired to `startAddIp()`.

## i18n
No new keys. `hierarchy.settings.addIp` already exists in both `en.json` and `ar.json`.

## Build status
- `npx nx build falcon-ui-core --skip-nx-cache` → **green** (35.47 s; pre-existing prop-name warnings on unrelated components only).
- `npx nx build admin-console --skip-nx-cache` → **green** (Build hash `cca20e4a681c28da`). `falcon-ui-button-tw.31ae5d7a1c9809a4.js` chunk regenerated with the new variant code.

## Risk notes
- Token forward-only: existing variants untouched; only new `--falcon-button-dashed-*` tokens added.
- The `border-dashed` Tailwind utility lives in the variant string (appended after the base), so utility-ordering guarantees it overrides the base `border-solid`.
- Stencil bundle must ship — confirmed by re-running `nx build falcon-ui-core` before admin-console.

## Out of scope (deferred)
- Token unification plan (Noor `falcon-{family}-{shade}`) — current tokens still use the existing `--color-falcon-teal-*` aliases per token-design SSOT.
- Demos (`apps/demo/*`) not touched per standing rule.
- No commit, no push.
