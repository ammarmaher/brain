---
name: Add Client Wave 7.10 — Owner Role disabled binding fix
description: Fixed Step-5 Account Owner role dropdown not actually disabled — `[attr.disabled]` (HTML attribute) replaced with `[disabled]` (property binding) so the wrapper's @Input setter fires.
type: project
originSessionId: 3a74be81-9cee-451f-a4bb-73c7d391eee1
---
🟢 LANDED 2026-05-17 (Wave 7.10). `nx build admin-console` GREEN `59f8446c4f1edbcd`/25.6s.

**Bug**: Add Client wizard Step 5 (Account Owner) — Owner Role dropdown rendered as fully interactive even though the BR-AM-19 invariant requires it to be locked to "Account Owner".

**File**: `apps/admin-console/.../add-client-wizard/client-account-owner-step/client-account-owner-step.component.html:117`

**Root cause** — `[attr.disabled]` vs `[disabled]` binding-mode trap on Stencil-backed Angular wrappers:
- Was `[attr.disabled]="''"` — HTML **attribute binding** on the `<falcon-angular-dropdown>` host element.
- Did NOT trigger the wrapper's `@Input('disabled')` **property** setter (Wave 2C, 2026-05-17, falcon-dropdown.component.ts:122-132).
- Internal `disabled()` signal stayed `false`.
- Wrapper template projects `[attr.disabled]="disabled() ? '' : null"` onto inner `<falcon-dropdown-tw>` → signal `false` → Stencil receives `disabled=null` → renders interactive.

**Fix** — `[disabled]="true"`. Property binding hits the setter → `disabled()` signal → projected `[attr.disabled]=""` on Stencil → disabled.

**Audit scope** — `grep '\[attr\.disabled\]' apps/` returned ONE match (this file). No other instances in the codebase. `<falcon-angular-button>`, `<falcon-angular-input-number>`, `<falcon-angular-dropdown>` all expose the same `@Input('disabled')` pattern and are the canonical shape going forward.

**Trap class** — for ANY Falcon Stencil-backed Angular wrapper (`<falcon-angular-*>`), **never** use `[attr.disabled]`. Always use `[disabled]="boolean"`. The wrapper's property setter is the only path that writes the internal `disabled()` signal that drives the inner Stencil element's projected attribute. Same rule applies to `readonly`, `required`, `clearable`, etc. when those props use the dual-path setter pattern.

**Trigger to recall**: `add client owner role disabled` / `falcon wrapper disabled trap` / `[attr.disabled] vs [disabled]` / `Wave 7.10`.
