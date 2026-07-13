# falcon-form-field — OVERVIEW

> **REFRESHED 2026-06-03 (B24 deep-dive sweep).** Major drift corrected: the prior dossier repeatedly claimed a `falcon-form-field.component.scss` file exists ("violates no-SCSS rule", G1 P1). **There is NO `.scss` and NO `.css` file** — the component is `templateUrl` HTML + inline Tailwind utilities (confirmed by Glob 2026-06-03). The no-SCSS "violation" is MOOT (already migrated). Consumer count grew 5 → ~10 (now spans BOTH consoles + templates-page).

> **Single-render Angular shared-ui component** in `libs/falcon/src/shared-ui/` — NO Stencil Shadow/`-tw` twin, NO `libs/falcon-ui-tokens` component file. It is a thin labeled-row wrapper that consumes Tailwind utilities + a couple of `var(--text-*, fallback)` theme tokens directly.

## Component purpose

Legacy bespoke Angular **labeled-field wrapper**. `[CODE]` ts:1-2 — "labeled input wrapper with required asterisk + hint + error slot." Renders a label row (with an optional red required asterisk) + a content `<ng-content>` slot for the actual control + a single message line below (error OR hint). It exists to give heterogeneous controls a uniform "label / control / message" row.

**Important:** new Falcon UI inputs (`<falcon-angular-input>`, `<falcon-angular-dropdown>`, `<falcon-angular-textarea>`, etc.) have built-in `label` / `helperText` / `errorMessage` inputs — they do NOT need to be wrapped in `<falcon-form-field>`. Wrapping a Falcon input that also sets `[label]` renders a DOUBLE label. Keep `<falcon-form-field>` only for legacy wizard rows OR mixed-control layouts with non-Falcon controls.

## Business / UI use case

- Legacy: wrapping inputs that lacked built-in label/error.
- Current: organization-hierarchy **Add Client** / **Add User** wizard steps in BOTH admin-console and management-console still wrap Falcon inputs in `<falcon-form-field>` (pre-built-in-label era). Templates-page step1 also uses it. Migration to built-in labels is ongoing.

## When to use it / when NOT to use it

**Use it for:**
- Legacy code maintenance only.
- A labeled row around a **non-Falcon** control (custom editor / third-party widget) that has no built-in label/error.

**Do NOT use it for:**
- NEW code with Falcon UI inputs — use their built-in `label` / `errorMessage` / `required` instead.
- Wrapping `<falcon-angular-input label="X">` — renders a duplicate label (G3).

## Status

**LEGACY / BESPOKE — NEEDS-DEPRECATION (long-term).** `[CODE]` ACTIVE across admin + management consoles' org-hierarchy wizards + templates-page step1. Standalone, signal `input()`s, `OnPush`, `templateUrl` HTML + inline Tailwind. **Migration candidate** — new code should use Falcon input built-in labels. (Note: the prior "migrate SCSS" blocker is GONE — the component is already Tailwind-only.)

## Replaces

- `[INFERRED]` Hand-rolled `<label>` + control + error-row markup, before Falcon inputs carried built-in labels.

## Source file paths

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.ts` (33 ln) |
| HTML | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.html` (29 ln) |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/index.ts` |
| SCSS / CSS | **None** — **CORRECTION 2026-06-03**: no `.scss`/`.css` file exists (Glob clean). Styling is `templateUrl` HTML + inline Tailwind utilities. The earlier "SCSS file exists" claim was DRIFT. |
| Token file (`libs/falcon-ui-tokens`) | **None** — single-render shared-ui component; uses Tailwind utilities + `var(--text-2,#3d3d3d)` / `var(--text-muted,#6b7280)` theme tokens directly. |
| Stencil Shadow / `-tw` twin | **None** — NOT a dual-render Stencil component. |
| Spec / tests | **None** — no `*.spec.ts` on disk. |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-form-field` |
| Stencil | None — legacy bespoke Angular component. |
| Host class | `block` (`[CODE]` ts:13 `host: { 'class': 'block' }`). |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-form-field[\s>]` across the repo = **54 occurrences / 12 files**. Two are docs/plans (`docs/_plans/W21-*.md`); the other **10 are live consumer templates**, split across BOTH consoles + templates-page:

- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/client-information-step.component.html` (15) + `client-account-owner-step.component.html` (8).
- `apps/admin-console/.../add-user-wizard/{user-personal-step (6), user-role-status-step (1), user-permissions-step (1)}.component.html`.
- `apps/management-console/.../add-user-wizard/{user-personal-step (6), user-role-status-step (1), user-permissions-step (1)}.component.html`.
- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/steps/step1-basic-info.component.html` (5 each).

> **Drift corrected:** the prior "Wave 7 = 5 consumer files (admin-console only)" is stale. The component is now used in BOTH consoles and in templates-page. See `USAGE.md` Consumer Sweep for the enumerated list.

## Related components

- New Falcon UI inputs (`<falcon-angular-input>` / `-dropdown>` / `-textarea>`) carry built-in `label`/`required`/`helperText`/`errorMessage` and **replace the need for this wrapper** in most cases.
- `<falcon-node-details-section>` / section components for whole-section headers (this is field-scoped, not section-scoped).

## Ownership / responsibility

`libs/falcon/src/shared-ui` (Falcon shared-ui, single-render Angular). Owned by the Falcon FE team. Angular-only (no React/Vue surface).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24). Source re-read in full (`falcon-form-field.component.ts` 33 ln + `.html` 29 ln + `index.ts`). **Drift corrected:** NO `.scss`/`.css` file exists (Glob clean) — the prior dossier's central "SCSS violation" claim was wrong; the component is already Tailwind-only via `templateUrl`. Consumer sweep re-run (`<falcon-form-field[\s>]` → 54 occ / 12 files; 10 live templates across BOTH consoles + templates-page, up from the stale "5 admin-only"). Legacy/deprecation status + double-label trap preserved (still accurate).
