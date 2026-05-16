---
ruleId: R-FE-003
ruleName: No inline styles, ever
severity: must
violationCount: 27
estimatedEffort: small
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Angular templates and component classes must not use `style="..."`, `[style]="..."`, `[ngStyle]="..."`, `[style.<prop>]="..."`, or programmatic style mutation (`nativeElement.style.*`, `Renderer2.setStyle`) — all styling flows through Tailwind utility classes or token-backed theme declarations.

## 2. What we found (counts + top 5 offender files)

Live grep on `C:\Falcon\Falcon\falcon-web-platform-ui` (excluding spec.ts + node_modules):

| Detector pattern | Hits | Files |
|---|---|---|
| `style="..."` inline attribute | 22 | 4 |
| `[style.<prop>]="..."` | 3 | 2 |
| `[style]="..."` / `[ngStyle]="..."` | 0 | 0 |
| `.nativeElement.style.` / `Renderer2.*setStyle` | 2 | 2 |

Total: **27 violations across 7 files**.

Top 5 offender files (by hit count):

1. `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` — 11 inline-style hits
2. `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` — 9 inline-style hits
3. `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html` — 2 `[style.<prop>]` bindings
4. `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/.../falcon-org-chart.component.html` — 1 `[style.<prop>]`
5. `libs/falcon/src/shared-ui/lib/ui/icon/icon.component.ts` + `apps/admin-console/.../skeleton/org-hierarchy-skeleton.component.ts` — `.nativeElement.style.*` mutations

Per-app distribution:
- admin-console: 21 of 27 (the org-hierarchy-page family, mostly otp-dialog + falcon-table-edit-row + org-chart)
- host-shell: 3 (sidebar + topbar)
- management-console: 0
- libs: 3 (icon + photo-uploader nativeElement.style.* + send-credentials-popup inline-style hits)

## 3. Why this matters (the architectural cost of leaving it)

Inline styles bypass the theming layer and silently override Tailwind's design tokens. Every one of the 22 `style="..."` hits is also a likely R-FE-004 violation (raw hex / px values), which compounds the cost — fix one, fix both. The 11 hits in `otp-dialog.component.html` are particularly visible because OTP is on every Add Client / Add User flow.

The 2 `nativeElement.style.*` mutations are the most fragile category: they bypass change detection, run after Angular's view init, and break under zoneless (which the platform just adopted in v3.1 per `project_falcon_revamp_v3_1_night_shift_results`). Leaving them in means the next "verify zoneless works on every flow" sweep finds them as runtime bugs.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Read each of the 7 offender files.** Build a per-file inventory of every inline-style declaration: `style="property: value"` and `[style.property]="expression"`.

- **Step 2 — Map each declaration to Tailwind class or token.**
  - Static `style="color: #1e293b"` → `class="text-falcon-slate-900"` (after promoting the color if not in canonical theme).
  - Dynamic `[style.color]="user.color"` → either `[ngClass]` map onto a discrete set of token classes, OR expose a CSS custom property on a parent and reference it from the theme (`--falcon-user-accent`).
  - Programmatic `.nativeElement.style.height = '...px'` → Tailwind class binding, OR if truly dynamic, CSS custom property bound via Renderer2 to a `--falcon-*` variable.

- **Step 3 — Convert the 11 hits in `otp-dialog.component.html` first.** It's the largest offender and the OTP component sits on critical flows. Read each hit, decide the Tailwind equivalent, replace. Validate by mounting the OTP dialog in playground or via the wizard.

- **Step 4 — Convert `falcon-table-edit-row.component.html` (9 hits).** Likely cell-level inline widths/colors. Most should become `col-span-*` or token-backed Tailwind utilities.

- **Step 5 — Convert sidebar/topbar `[style.<prop>]` bindings.** These typically encode dynamic theme values; check if they can become `[ngClass]` or theme-token CSS variables.

- **Step 6 — Convert `.nativeElement.style.*` mutations.**
  - `libs/falcon/src/shared-ui/lib/ui/icon/icon.component.ts` — likely sets icon size. Replace with `@Input` size + `[ngClass]` or `[style.--icon-size]` writing a CSS variable read by the icon's own utility class.
  - `apps/admin-console/.../org-hierarchy-skeleton.component.ts` — skeleton placeholder sizing. Should be Tailwind utility + `@HostBinding` or template-bound class.

- **Step 7 — Re-run detector.** All five patterns should return 0 in apps + libs (except whatever is grandfathered via `EXEMPTIONS.md`).

- **Step 8 — Build verification.** `nx build admin-console`, `nx build host-shell`, `nx build falcon-ui-core` — all exit 0.

## 5. Estimated effort + complexity rationale

**small** — Only 7 files. The two big ones (`otp-dialog`, `falcon-table-edit-row`) account for 20 of 27 hits, and most of those are static `style="..."` that map 1:1 to Tailwind utilities once you know the value. The dynamic `[style.<prop>]` bindings and `nativeElement.style.*` cases are 5 hits total and need design-judgment; budget extra time for those. Realistic: 2–3 hours.

## 6. Rollback hint (how to undo if the fix is wrong)

`git diff` on the 7 files; if a specific dialog or row looks wrong, `git checkout HEAD -- <file>.html` reverts that single template. The `nativeElement.style.*` removals carry slightly more risk — restore the `.ts` with the same checkout command and the legacy mutation returns intact.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  rg -n -g '!*.spec.ts' 'style="[^"]+"' apps libs
  rg -n -g '!*.spec.ts' '\[style\]="|\[ngStyle\]="|\[style\.' apps libs
  rg -n --type ts -g '!*.spec.ts' '\.nativeElement\.style\.|Renderer2.*setStyle' apps libs
  UV_THREADPOOL_SIZE=128 npx nx build admin-console --configuration=development
  ```
- expected output:
  - All three `rg` calls: zero matches (or only inside `libs/falcon-ui-core/**`)
  - `nx build admin-console`: exit code 0

## 8. Risk flags (anything that could break)

- **OTP dialog is on a critical-path flow** (Add Client + Add User wizards). Test the full Add User wizard end-to-end after changes — a broken OTP screen blocks every onboarding.
- **`.nativeElement.style.*` mutations may be there for a reason** (e.g. dynamic resize-observer hooks). Don't blindly delete; understand the data flow first.
- **CSS custom property bound on a parent** is the right escape hatch for genuinely dynamic per-row colors — but document the GAP in `Brain Outputs/70-Gaps/`.
- **Tailwind purge** runs on template strings only — if you write Tailwind classes inside a TypeScript file, ensure they appear in `safelist` or in a `class="..."` template binding, or they get purged out of production.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-004** — every static `style="color: #..."` is also a raw-value violation; one fix closes both
- **R-FE-001** — same theming-bypass concern, structural sibling
- **R-FE-002** — the SCSS purge produces template churn; inline styles are the second-most-likely hiding place
- **R-NOOR-002** — admin-console hits triggering this rule almost certainly trigger Noor theme-promotion too
- **R-NOOR-003** — any `style="font-size:..."` violates the Noor typography scale separately
