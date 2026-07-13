---
name: project_contracts_list_left_right_padding_admin_parity_2026_06_21
description: "Contracts & Cost list needed L/R padding; mgmt-console already SoT-correct, admin-console was flush — restructured admin to content-body(px-6=24px)+inner table-panel to match SoT + mgmt."
metadata: 
  node_type: memory
  type: project
  originSessionId: d8d35dda-3253-4441-81da-5624ca278d4d
---

Contracts & Cost Management **list** needed left/right padding to match the Source-of-truth theme
(`C:\Falcon\Source_of_truth_theme\latest\T2 Falcon Admin.html`, served at http://localhost:5500).

[CODE] SoT structure (`admin/contracts.jsx` + `admin/styles.css`/`admin/contracts.css`):
`.content-panel` (outer card, radius 14px) → `.content-body { padding: 20px 24px 24px }` (**the 24px L/R
breathing room**) → `.node-header` + an **inner bordered `.table-panel`** (radius 12px) holding
`.table-head-bar` ("Contracts" title, `padding:14px 18px`) + the `.users-table`.

Findings (2026-06-21, claude):
- **Management console** `apps/management-console/.../contracts-cost-management.component.html` was **ALREADY
  SoT-correct** (WAVE M2): `main` → `div.flex flex-col gap-5 px-6 pt-5 pb-6` (content-body, 24px sides) →
  `falcon-node-details-section [withPadding]="false"` + inner `div.rounded-xl border` table-panel. NO change.
- **Admin console** `apps/admin-console/.../contracts-cost-management.component.html` was **WRONG** — the
  "Contracts" title bar + `falcon-angular-data-table` sat flush inside the single outer `<main>` card with
  only the 14px cell inset (the red-X screenshot state). FIXED: restructured the `@else { ... }` LIST block to
  mirror SoT + mgmt: added the content-body wrapper `flex flex-col gap-5 px-6 pt-5 pb-6 flex-1 min-h-0`, set
  node-details `[withPadding]="false"`, wrapped the title bar + data-table in an inner `rounded-xl border
  border-falcon-neutral-200 overflow-hidden shrink-0` table-panel, dropped the banners' `mx-5 mb-3` (now
  flush children spaced by `gap-5`). data-table cell templates + token classes UNCHANGED.

Token map (Tailwind → SoT px): `px-6`=24px (sides), `pt-5`=20px (top), `pb-6`=24px (bottom),
`rounded-[14px]`=content-panel 14px, `rounded-xl`=table-panel 12px, `px-4.5 py-3.5`=table-head-bar 18/14px.
Admin keeps `flex-1 min-h-0` (Falcon full-view fills column height, per SoT screenshot 1) vs mgmt content-hug.
`withPadding` is a real input (default true) on `falcon-node-details-section.component.ts:52`.

Both consoles now share an identical list shell. Pure FE template change (1 file). NO commits/push.
GATE: `npx nx build admin-console --skip-nx-cache` **GREEN** (exit 0, "Successfully ran target build");
only pre-existing unrelated warnings (button-card NG8102 + bundle-budget). Live-UI visual confirmation
user-gated (no admin-console dev-server config — it's a host-shell MF remote; reaching the list needs
login + org-tree client selection).
