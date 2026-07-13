# falcon-switch — OVERVIEW

## Component purpose

On/off toggle following the **dual-render Stencil pattern** (Shadow `<falcon-switch>` + Light `<falcon-switch-tw>` + Angular CVA wrapper `<falcon-angular-switch>`). Built atop a real native `<input type="checkbox">` with `role="switch"` + `aria-checked`. Carries **three coexisting visual variants** selected by the `variant` prop: `dot-knob` (default — 38×22 track, sliding 16px knob), `hidden-input` (32×18 compact track, 14px knob), and `channel-pill` (44×22 bordered pill, 12px dot, 100px radius).

## Business / UI use case

- A *standing configuration choice* (a setting that stays in effect) rather than a one-time form answer.
- `[CODE]` Service-pricing-table row visibility toggle (`libs/falcon/.../service-pricing-table.component.html:52` + host-shell `service-pricing.component.ts`) — gated `[disabled]="row.visibility && !row.canHide"` (the G-25 origin).
- `[CODE]` Add-Client wizard application-step + comm-channels-step per-row enable toggles (`client-applications-step.component.html:37`, `client-comm-channels-step.component.html:37`).
- `[CODE]` Contact-groups share dialog + share-group-step (`share-dialog.component.html:39`, `share-group-step.component.html:29`).

## When to use it / when NOT to use it

**Use it for:** any boolean control where a switch metaphor (visual live on/off) is preferred to a checkbox — feature flags, row enable/disable, standing preferences.

**Do NOT use it for:**
- Form-time acceptance ("I agree") → `<falcon-angular-checkbox>` (semantics + visuals match).
- A mutually-exclusive named choice → `<falcon-angular-radio>` / radio-group.
- A choice between two *named things* (Monthly/Yearly) → radio/dropdown (the `channel-pill` labels describe a *state*, not options).
- A tri-state / "unknown" value → switch is strictly boolean.

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-inputSwitch>`. Not deprecated.

## Replaces

- Legacy PrimeNG `<p-inputSwitch>` / `<p-toggleSwitch>`.
- Native `<input type="checkbox">` styled as a toggle.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-switch/falcon-switch.component.ts` (135 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-switch/falcon-switch.component.html` (51 ln — pure tag-switcher) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-switch/falcon-switch.component.css` (10 ln — `:host{display:inline-block}`) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-switch/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-switch/falcon-switch.tsx` (248 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-switch/falcon-switch.css` (278 ln) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-switch-tw/falcon-switch-tw.tsx` (249 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-switch/falcon-switch.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-switch/falcon-switch.utils.ts` (`buildTrackClasses`, `buildKnobClasses`, `isFieldInError`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/switch-tailwind-classes.ts` (cross-framework SSOT for the `-tw` path) |
| Component token file | `libs/falcon-ui-tokens/src/components/switch.tokens.css` (215 ln) |
| Stencil readme | `libs/falcon-ui-core/src/components/falcon-switch/readme.md` (auto-generated) |
| Spec/tests | **None for the Angular wrapper or `-tw` twin** (see GAPS). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-switch` |
| Stencil Shadow tag | `<falcon-switch>` |
| Stencil Light tag | `<falcon-switch-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-switch[\s>]` render sites: **4 `.html` files in `apps/`** + **1** TS template-string (host-shell service-pricing) + **1** in `libs/falcon`:

- `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html:52` (row visibility toggle; `size="sm"`, `[checkedInput]`, `(valueChange)`).
- `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts` (TS template).
- `apps/admin-console/.../add-client-wizard/client-applications-step/client-applications-step.component.html:37`.
- `apps/admin-console/.../add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.html:37`.
- `apps/management-console/.../contact-groups/share-dialog/share-dialog.component.html:39`.
- `apps/management-console/.../contact-groups/create-contact-group/steps/share-group-step/share-group-step.component.html:29`.

Plus showcase demos in `host-shell/.../falcon-ui-showcase/library-section/*` (empty-data-section, library-section, uploader-section).

> `[CODE]` CORRECTION vs prior Wave-7 list: `playground.page.html` is gone; the `applications-table` + `client-service-row-table` paths from the prior dossier were not found at those exact paths this pass (the add-client app/comm-channels STEP files are the live service-toggle consumers). service-pricing-table (libs/falcon) is the canonical row-toggle consumer (the G-25 `disabled` origin).

## Related components

- Siblings (same surface family): `<falcon-angular-checkbox>`, `<falcon-angular-radio>`.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Token contract in `libs/falcon-ui-tokens`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06 sweep). Source-file table + line counts re-confirmed; variant geometry confirmed from switch.tokens.css; consumer list re-grepped (4 `.html` + service-pricing TS + service-pricing-table in libs/falcon); stale playground/applications-table consumers corrected.
