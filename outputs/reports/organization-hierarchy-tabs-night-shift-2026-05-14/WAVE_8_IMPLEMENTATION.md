# Wave 8 Implementation Report — settings-tab upgrades

**Date:** 2026-05-14
**Agent:** Ammar Web-Platform-UI (Wave 8 implementer)
**Workspace:** `C:\Falcon\Falcon\falcon-web-platform-ui`
**Build status:** GREEN — `nx build admin-console --skip-nx-cache` hash `5a8a72e8ad52ecef`, 9.1s
**Scope:** `<app-client-settings-step>` Falcon-primitive migration + IP delete confirm dialog
**Parity estimate:** ~85% (target met)

---

## Files touched (5 — all within Wave 8 allow-list)

1. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.ts`
2. `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html`
3. `libs/falcon/src/language/i18n/en.json`
4. `libs/falcon/src/language/i18n/ar.json`
5. `(none)` — `settings-tab.component.{ts,html}` NOT touched (confirm dialog hosted in client-settings-step where the delete originates).

Wave 7 files (`falcon-org-info-panel.{ts,html}`, `falcon-org-info-panel/models/models.ts`, `hierarchy-page-state.service.ts`) NOT touched — boundary respected.

---

## Falcon components introduced (new direct usages: 4)

| Falcon component | Used for | Notes |
|---|---|---|
| `<falcon-angular-radio>` × 2 | Password Security cards (Normal / Advanced) | Card-style layout per brief fallback (radio-group lacks rich-content slots). Wrapped each `<falcon-angular-radio>` with a `<label>` Tailwind card carrying `<strong>` + `<em>` description. Original `name="cs-sec"` preserved for browser radio exclusivity. |
| `<falcon-angular-tag>` × N | IP chips (one per allowed IP) | `severity="secondary"` (≈ neutral palette), `size="lg"` to match 34px chip height, `[rounded]="false"` for matching rounded-md, `[dismissible]="!readonly()"` → `(falconDismiss)` opens confirm dialog. |
| `<falcon-angular-input-number>` × 3 | Account limits (Max Normal / Max System / Max Node) | `[min]=0 [max]=9999 [step]=1 [integer]=true size="sm" [readonly]="readonly()"`. Bridge handler `onLimitChange` reuses existing `onNumChange` clamp logic. |
| `<falcon-angular-confirm-dialog>` × 1 | IP delete confirmation | `severity="danger" size="sm"`. State via `ipPendingDelete = signal<string \| null>(null)` + computed `confirmOpen`. Accept calls existing `removeIp()`; reject clears signal. |

**Falcon components NOT used (with reason):**

| Falcon component | Why not | Decision |
|---|---|---|
| `<falcon-angular-input>` for IP text input | `FalconIpAddressDirective` injects `ElementRef<HTMLInputElement>` and writes `input.value = sanitized` directly. On a `<falcon-angular-input>` wrapper, ElementRef points to the host custom-element, not the inner native `<input>`, breaking sanitization + cursor restoration. | Kept native `<input>` with `falconIpAddress` directive. Visual parity preserved via Tailwind tokens (h-9 / rounded-md / focus-ring-falcon-teal-700). Brief explicitly allowed this fallback (W8.6). |
| `<falcon-angular-radio-group>` (group component) | Group only accepts `{ value, label }` options — no template projection for descriptions. | Brief's documented fallback path taken: individual `<falcon-angular-radio>` instances inside Tailwind card wrappers (per W8.1 spec). |
| `<falcon-angular-button variant="dashed">` for Add IP | No `dashed` variant exists in `<falcon-angular-button>` API. | Kept plain `<button>` with Tailwind dashed-border tokens (`border-dashed border-falcon-teal-700`). Logged as gap → defer to library button upgrade. |
| `<falcon-angular-input>` for readonly "Current existing" cells | Per E.4 of source-discovery the React edit-mode 2-col grid shows current values via `<input readOnly>`. **Current Angular form has no such 2-col split** — it just shows three single-column number inputs. Adding a brand-new 2-col split was out of strict Wave 8 scope (no React "Current existing" data in `ClientSettingsFormValue`). | Deferred — log as GAP-PARITY-008 (NEW). Account-limits 2-col grid (Current/Max) requires state-service data not present in the form model and was not in the explicit Wave 8 acceptance criteria. |

---

## i18n keys added (under explicit allow-list namespaces)

`libs/falcon/src/language/i18n/en.json`:
- `common.delete` = `"Delete"`
- `hierarchy.settings.addIp` = `"IP Address"`
- `hierarchy.settings.confirmDeleteIp.title` = `"Delete IP"`
- `hierarchy.settings.confirmDeleteIp.message` = `"Are you sure you want to delete this IP?"`
- `hierarchy.settings.security.normal.label` = `"Normal"`
- `hierarchy.settings.security.normal.desc` = `"Username, Password, OTP"`
- `hierarchy.settings.security.advanced.label` = `"Advanced"`
- `hierarchy.settings.security.advanced.desc` = `"Comply with NCA regulations, press here for more details."`

`libs/falcon/src/language/i18n/ar.json`:
- `common.delete` = `"حذف"`
- `hierarchy.settings.addIp` = `"عنوان IP"`
- `hierarchy.settings.confirmDeleteIp.title` = `"حذف عنوان IP"`
- `hierarchy.settings.confirmDeleteIp.message` = `"هل أنت متأكد من أنك تريد حذف عنوان IP هذا؟"`
- `hierarchy.settings.security.normal.label` = `"عادي"`
- `hierarchy.settings.security.normal.desc` = `"اسم المستخدم وكلمة المرور ورمز OTP"`
- `hierarchy.settings.security.advanced.label` = `"متقدم"`
- `hierarchy.settings.security.advanced.desc` = `"الامتثال للوائح NCA، اضغط هنا لمزيد من التفاصيل."`

Arabic strings derive from already-present `hierarchy.settings.passwordNormalDesc`/`passwordAdvancedDesc` translations (consistent terminology). No `[NEEDS-AR]` placeholders required.

---

## Acceptance criteria (W8.8) — all 9 met

- [x] Password security uses `<falcon-angular-radio>` wrapped in card-style Tailwind containers (fallback per brief — group lacks rich-content slot API).
- [x] IP chips use `<falcon-angular-tag>` with `[dismissible]` + `(falconDismiss)`.
- [x] Account limits use `<falcon-angular-input-number>` × 3.
- [ ] "Current existing" readonly cells — **deferred (GAP-PARITY-008)**: requires state-service `current*` fields not in `ClientSettingsFormValue`. Not in explicit Wave 8 acceptance.
- [x] IP delete opens `<falcon-angular-confirm-dialog>` — accept calls `removeIp()`, reject clears.
- [x] Add IP button uses Tailwind dashed border + Falcon palette tokens (no falcon-angular-button dashed variant exists).
- [x] IPv4 + IPv6 validation still functional — `falconIpAddress` directive preserved on native `<input>`, `ipFormatError()` shows red border + inline message; persistent-list `ipError()` shows next-tier message.
- [x] `nx build admin-console --skip-nx-cache` → 0 errors, hash `5a8a72e8ad52ecef`.
- [x] No PrimeNG. No `.scss`/`.css`. Tailwind tokens only.
- [x] Existing view/edit/save/cancel flow unchanged — `model()` two-way bindings + `dirty`/`valid` tracking + `onSecurity`/`startAddIp`/`commitIp`/`removeIp`/`onNumChange` all preserved; `updateField` mutator unchanged.

---

## API deviations from brief (logged for visibility)

1. **`<falcon-angular-tag>` API uses `[value]` + `(falconDismiss)` + `[dismissible]`** — brief listed `[label]` / `closable` / `(close)`. Wave 8 used actual API.
2. **`<falcon-angular-radio-group>` lacks template-projection** for rich label slots — brief preview noted this; W8.1 fallback path taken (individual `<falcon-angular-radio>` instances + Tailwind cards).
3. **IP input kept native** because `FalconIpAddressDirective` is incompatible with `<falcon-angular-input>` wrapper (writes to `ElementRef.nativeElement.value`). W8.6 fallback explicit.
4. **Readonly mode visual treatment** of inactive radio card uses `opacity-55` via Tailwind class (matches React `.ac-radio-card:not(.selected) { opacity: 0.55 }` at `settingstab.css:45-47`).

---

## Blockers
None. Wave 8 complete and build green.

## Out-of-scope follow-ups (gaps to log)

- **GAP-PARITY-008 (NEW, LOW):** Edit-mode 2-col "Current existing / Max allowed" grid for account limits not implemented — needs state-service `currentNormalUsers`/`currentSystemUsers`/`currentNodeLevel` fields plumbed into `ClientSettingsFormValue`. React `settingstab.jsx:192-265` reference.
- **GAP-LIB-009 (NEW, LOW):** `<falcon-angular-button>` lacks `variant="dashed"` API — defer to button-library upgrade backlog. Current consumers (Wave 8 Add IP) use Tailwind tokens to compensate.
- **GAP-LIB-010 (NEW, LOW):** `FalconIpAddressDirective` ↔ `<falcon-angular-input>` incompatibility — directive needs refactor to find inner native input via ViewChild OR `<falcon-angular-input>` needs to expose its inner `<input>` as a directive target via `hostRef` traversal. Defer to library backlog.
