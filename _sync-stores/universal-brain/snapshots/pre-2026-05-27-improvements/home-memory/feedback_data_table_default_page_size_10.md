---
name: Data table default page size is 10
description: Every Falcon data table must default to a page size of 10 rows per page
type: feedback
originSessionId: 451cecd2-6836-460a-a70e-702232c4f17e
---
The default page size (`rows` / `defaultRowsPerPage` / `usersPageSize`) for any Falcon data table is **10**.

**Why:** User standing instruction (2026-05-18) — wants a consistent 10-row default across all tables, not the prior mixed 20.

**How to apply:**
- The shared `falcon-data-table` component (`libs/falcon-ui-core/.../falcon-data-table.component.ts`) already defaults `@Input() rows = 10` — keep it.
- When a consumer declares `defaultRowsPerPage` or a `usersPageSize` page-size signal, initialize it to `10`, never 20.
- When adding a new table or paginated list, do not set `[rows]` to anything but 10 unless it is a deliberate small-preview table (e.g. wizard previews using `[rows]="3"`).
