# Upgrade Candidates — Architecture / Usage Backlog

Curated list of architecture and usage-level upgrades discovered during the audit. Each entry: title, motivation, scope, proposed API, risk, priority.

---

## 1. Migrate every wizard host from `<falcon-stepper>` (legacy) to `<falcon-angular-stepper>` (Stencil)

**Motivation:** Four wizards across two consoles still use the PrimeNG-shaped `<falcon-stepper>` with `FalconStepDirective` + `FalconStepperFooterDirective`. The Stencil `<falcon-angular-stepper>` is fully built and tested in the playground but has zero consumers. Migrating drops a `TemplateRef`-driven API for a declarative `[steps]` input + transcluded panels, unlocks Studio-token customisation, and centralises wizard chrome.

**Scope (files):**

- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/add-client-wizard.component.html`
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/add-user-wizard.component.html`
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html`
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html`

**Proposed API:** existing `<falcon-angular-stepper [steps]="steps" [activeIndex]="i" mode="linear" orientation="horizontal" size="md" (falcon-change)="i = $event.detail">` is sufficient. Replace the per-step `<falcon-step>` directive + footer `<ng-template>` projection with explicit step descriptor objects + a `@switch (i)` template block selecting the current step.

**Risk:** **MEDIUM.** Wizards are core revenue-generating flows. Visual parity must be reviewed pixel-by-pixel against the React reference at `admin/addclient.css:95-169`. Animation timing matters.

**Priority:** **P1.**

---

## 2. Replace `<falcon-mobile-number>` (legacy) with `<falcon-angular-phone-field>` (Stencil)

**Motivation:** Five call-sites use the bespoke Angular `<falcon-mobile-number>`. The Stencil `<falcon-angular-phone-field>` ships with shared-border layout, dial-code chooser, native `<input type=tel>`, optional verify button — already replaces `ngx-intl-tel-input` + `google-libphonenumber` (uninstalled in Wave 2 per memory).

**Scope (files):**

- `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html`
- `apps/admin-console/.../add-client-wizard/client-account-owner-step/client-account-owner-step.component.html`
- `apps/admin-console/.../add-user-wizard/user-personal-step/user-personal-step.component.html`
- `apps/management-console/.../add-client-wizard/client-account-owner-step/client-account-owner-step.component.html`
- `apps/management-console/.../add-user-wizard/user-personal-step/user-personal-step.component.html`

**Proposed API:** `<falcon-angular-phone-field [(ngModel)]="phone" [verifyLabel]="..." (falcon-verify)="onVerify($event)">`.

**Risk:** **LOW.** Phone-field has the same shape (input + verify). Reactive forms binding via CVA verified in playground.

**Priority:** **P1.**

---

## 3. Replace `<falcon-photo-uploader>` (legacy) with `<falcon-angular-single-uploader>` (Stencil)

**Motivation:** Six wizard step files use bespoke `<falcon-photo-uploader>`. The Stencil `<falcon-angular-single-uploader>` with `previewMode='thumbnail'` does the same job and has built-in delete/edit affordances + drag/drop visual feedback.

**Scope (files):**

- `apps/admin-console/.../add-user-wizard/user-personal-step/user-personal-step.component.html`
- `apps/admin-console/.../add-client-wizard/client-information-step/client-information-step.component.html`
- `apps/admin-console/.../add-client-wizard/client-account-owner-step/client-account-owner-step.component.html`
- `apps/management-console/.../add-user-wizard/user-personal-step/user-personal-step.component.html`
- `apps/management-console/.../add-client-wizard/client-information-step/client-information-step.component.html`
- `apps/management-console/.../add-client-wizard/client-account-owner-step/client-account-owner-step.component.html`

**Proposed API:** `<falcon-angular-single-uploader previewMode="thumbnail" size="md" [(file)]="avatarFile" accept="image/*" (falcon-upload)="onUpload($event)">`.

**Risk:** **LOW.** Visual parity verified in playground.

**Priority:** **P1.**

---

## 4. Sweep arbitrary Tailwind hex/px to Falcon tokens — extend `gate-08` to apps templates

**Motivation:** 50+ Tailwind arbitrary-value class instances (`bg-[#f5f6f7]`, `border-[#eef0f2]`, `rounded-[14px]`) in feature templates contradict the tokens-only rule. Worst offender: `admin-console/.../organization-hierarchy-page-menu.component.html`. The current `gate-08-hardcoded-value-lint.mjs` only scans `libs/falcon-ui-tokens/src/**/*.css` + `libs/falcon-ui-core/src/**/*.css` — apps are not covered.

**Scope:** All `apps/**/*.html` + Tailwind class strings inside `apps/**/*.ts` `[ngClass]` bindings.

**Proposed approach:**

1. New gate `gate-13-arbitrary-tailwind-lint.mjs` — fail on `\bbg-\[#`, `\btext-\[#`, `\bborder-\[#`, `\brounded-\[\d`, `\b[whp][txybrl]?-\[\d+px`, `\bgap-\[\d+px` in HTML + TS template strings.
2. Forward-only (scope to git diff in CI; local prints existing).
3. Migration sprint to swap hardcoded hex → `bg-falcon-neutral-75`, `border-falcon-neutral-150`, etc.

**Risk:** **MEDIUM.** Some pixel-perfect React-ref ports might require new token entries.

**Priority:** **P1.**

---

## 5. Delete dead-code sibling files

**Motivation:** Two `remote-route.service.ts` files exist; only `core/services/remote-route.service.ts` is active. Same for `remote-config.ts`. Confuses readers.

**Scope:**

- Delete `apps/host-shell/src/app/remote-route.service.ts` (older sibling — uses `BehaviorSubject` pattern without Wave-8 manifestProvider).
- Delete `apps/host-shell/src/app/remote-config.ts` (sibling).

**Risk:** **LOW.** `bootstrap.ts` imports the active one at `core/services/`.

**Priority:** **P2.**

---

## 6. Rename `PrimeNGThemeService` → `ThemeRtlSyncService`

**Motivation:** Memory + verified in `app.config.ts:29,58`. The class name is legacy from before Wave PR-8. Its current job is theme + RTL `<html>` class sync. Misleading name will confuse future readers.

**Scope:** `apps/host-shell/src/app/core/services/prime-ng-theme.service.ts` rename + all import sites.

**Risk:** **LOW.** Pure rename. ~3 import sites.

**Priority:** **P2.**

---

## 7. Bake `label` + `required` + `error` into every Falcon input wrapper — retire `<falcon-form-field>` legacy

**Motivation:** `<falcon-form-field>` is the heaviest legacy bespoke at 131 call sites across 11 files. It wraps an input + label + required mark + error slot. Every Falcon Angular input wrapper has its own `[label]`, `[helperText]`, `[errorMessage]` inputs — but the wrappers are wrapped INSIDE `<falcon-form-field>` for visual layout. Modernise by making the wrapper layout the host responsibility.

**Scope:** All Falcon Angular form-control wrappers (input, dropdown, multi-select, textarea, checkbox-group, radio-group, otp, phone-field, email-field, date-picker, single-uploader, etc.).

**Proposed API:** Inputs already accept `[label]` + `[helperText]` + `[errorMessage]` + `[required]`. Lift the visual layout from `<falcon-form-field>` into a shared `<falcon-field-shell>` or just standardise the wrapper template so each input renders its own labelled scaffold.

**Risk:** **HIGH.** 131 call sites is the largest surface area. Requires careful migration to preserve spacing + alignment. Could be a multi-wave effort.

**Priority:** **P2.**

---

## 8. Add `panelHeader` / `panelFooter` slots to `<falcon-angular-tabs>`

**Motivation:** Tabs need action buttons left/right of the header in real-world use (memory: tabs-actions-demo exists as a showcase pattern). Currently consumers hand-roll chrome around the tabs.

**Scope:** `libs/falcon-ui-core/src/components/falcon-tabs/falcon-tabs.tsx` + `falcon-tabs-tw.tsx` + Angular wrapper at `falcon-tabs.component.{ts,html}`.

**Proposed API:**

```html
<falcon-angular-tabs [options]="tabs" [value]="active" (falcon-change)="active = $event.detail">
  <div slot="panelHeader" class="flex gap-2">
    <falcon-angular-button label="Add" (falcon-click)="onAdd()" />
    <falcon-angular-button label="Refresh" variant="ghost" (falcon-click)="onRefresh()" />
  </div>
  <div slot="panelFooter" class="...">...</div>
</falcon-angular-tabs>
```

**Risk:** **LOW.** Additive — existing consumers unaffected.

**Priority:** **P2.**

---

## 9. Expose per-option template on `<falcon-angular-dropdown>`

**Motivation:** Wave 4 TODO comment in `user-role-status-step.component.ts` requests custom option rendering (flag/icon next to language name, severity colour next to status). Currently Dropdown only accepts plain `FalconDropdownOption[]` with no template hook.

**Scope:** `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.{ts,html}` + Stencil `<falcon-dropdown>` + `<falcon-dropdown-tw>`.

**Proposed API:**

```html
<falcon-angular-dropdown [options]="langs" [(ngModel)]="lang">
  <ng-template #optionTemplate let-opt>
    <span class="flex items-center gap-2">
      <img [src]="'/flags/' + opt.code + '.svg'" class="size-4" />
      {{ opt.label }}
    </span>
  </ng-template>
</falcon-angular-dropdown>
```

Borrow the `FalconDataTableCellDirective` pattern: collect `TemplateRef` via `@ContentChildren`, project into Stencil slot.

**Risk:** **MEDIUM.** Requires both Angular wrapper change + Stencil component slot support.

**Priority:** **P2.**

---

## 10. Add slot-friendly variant to `<falcon-angular-popup>` so `send-credentials-popup` can retire dialog dependency

**Motivation:** `<send-credentials-popup>` is the last legacy consumer of `<falcon-angular-dialog>` (the deprecated dialog). The blocker is that `<falcon-angular-popup>` doesn't have a slot-friendly variant for embedding a custom form.

**Scope:** `libs/falcon-ui-core/src/components/falcon-popup/falcon-popup.tsx` + Angular wrapper.

**Proposed API:** Add a `variant: 'slot'` (or `variant: 'form'`) that exposes named `<slot name="title">`, `<slot name="default">`, `<slot name="footer">` instead of the predefined error/delete/unsaved/save text. Consumer renders the form inside the popup body.

**Risk:** **LOW.** Additive.

**Priority:** **P2.**

---

## 11. Promote `<falcon-tree-panel>` legacy to a paired Shadow+Light Stencil component

**Motivation:** `<falcon-tree-panel>` is bespoke Angular, used by 4 org-hierarchy menu files. Promoting to Stencil unlocks the Studio token customisation, React/Vue wrappers, and removes Angular-only coupling.

**Scope:** `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/` → new `libs/falcon-ui-core/src/components/falcon-tree-panel/` + `falcon-tree-panel-tw/` + `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree-panel/`.

**Risk:** **MEDIUM.** Tree-panel composes per-row + root 3-dot menus. Migration requires recursive node template support.

**Priority:** **P2.**

---

## 12. Promote `<falcon-organization-hierarchy-tree-tw>` to paired Shadow+Light

**Motivation:** Currently Light DOM only. The rest of the Falcon UI library is dual-render. Inconsistency hurts.

**Scope:** Add `falcon-organization-hierarchy-tree/` Stencil folder with `shadow: true`.

**Risk:** **LOW-MEDIUM.** Need to ensure all visuals read from `--falcon-organization-hierarchy-*` tokens which already exist in `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css`.

**Priority:** **P3.**

---

## 13. Add `provideAnimationsAsync()` to `management-console/app.config.ts`

**Motivation:** Host-shell + admin-console register it. management-console does NOT. If any future mgmt feature wants animations, it will fail silently.

**Scope:** `apps/management-console/src/app/app.config.ts:5,27` — add the import + provider entry.

**Risk:** **LOW.**

**Priority:** **P3.**

---

## 14. Re-enable `adminConsoleGuard` in `apps/admin-console/src/app/app.routes.ts:7`

**Motivation:** Currently commented out. Defence-in-depth — the host-shell already gates via `shellAccessMatchGuard`, but a dedicated admin-console guard prevents bypass via direct-route loading in standalone-dev mode.

**Scope:** Uncomment the import + the `canActivate: [adminConsoleGuard]` line.

**Risk:** **LOW-MEDIUM.** Need to verify the guard logic handles standalone-dev mode (mock facades) without blocking legitimate dev work. If it requires real session data, add a `?visual-test=1`-style bypass.

**Priority:** **P3.**

---

## 15. Add `<falcon-angular-icon>` adoption across host-shell chrome

**Motivation:** Topbar + sidebar render inline SVG glyphs (~50 SVG elements per file). Replacing with `<falcon-angular-icon name="search">` would normalise icon sizing/colouring via tokens.

**Scope:** `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` + `sidebar/sidebar.component.html`.

**Risk:** **LOW.** Visual diff possible — review carefully.

**Priority:** **P3.**

---

## 16. Migrate host-shell from Karma to Vitest

**Memory note** `project_falcon_revamp_next_steps_plan.md` Tier 2: host-shell still has `karma.conf.js`. admin + management already on Vitest. Standardise.

**Scope:** Add `vitest.config.ts` + `test-setup.ts` for host-shell. Remove `karma.conf.js`. Update `apps/host-shell/project.json`.

**Risk:** **LOW.** Test suite is small — host-shell tests are mostly utility unit tests.

**Priority:** **P3.**

---

## 17. Adopt `<falcon-angular-menu>` for per-row 3-dot actions in `<falcon-tree-panel>`

**Motivation:** `<falcon-angular-menu>` is brand-new in Revamp v3.1 (Memory) and has zero consumers. Tree-panel's per-row + root 3-dot menus are hand-rolled with dropdown panels. Migrating standardises menu chrome.

**Scope:** `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html` + the four org-hierarchy menu consumers.

**Risk:** **MEDIUM.** Tree-panel has tricky positioning logic — Stencil menu uses computed placement.

**Priority:** **P3.**

---

## 18. Adopt `<falcon-angular-confirm-dialog>` for feature delete confirmations

**Motivation:** The layout-level `<falcon-angular-confirm-dialog>` placeholder is `[open]="false"` — unused. Feature components hand-roll confirm dialogs or use `<falcon-angular-popup>` variant='delete'.

**Scope:** Document the global-confirm pattern. Identify 1-2 wizards where it could be wired (e.g. "discard wizard changes?" before unmount).

**Risk:** **LOW.**

**Priority:** **P3.**

---

## Priority recap

| Priority | Count | Title fragments |
|---|---|---|
| **P1** | 4 | Migrate stepper / phone-field / single-uploader / arbitrary-Tailwind cleanup |
| **P2** | 7 | Delete dead-code, rename PrimeNGThemeService, retire form-field, tabs slots, dropdown option template, popup slot variant, promote tree-panel |
| **P3** | 7 | Promote org-hierarchy-tree, animationsAsync mgmt, re-enable adminConsoleGuard, falcon-angular-icon adoption, Karma→Vitest, falcon-angular-menu adoption, confirm-dialog adoption |
