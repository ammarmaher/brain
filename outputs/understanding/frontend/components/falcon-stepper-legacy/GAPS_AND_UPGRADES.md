# falcon-stepper-legacy — GAPS & UPGRADES

> 🔴 **DEPRECATED / DELETED.** The "gap" is resolved by deletion. Component removed 2026-05-17 (`[CODE]` libs/falcon/src/shared-ui/index.ts:11-13). There is nothing left to upgrade.

## The one gap that mattered — RESOLVED by deletion

### ✅ G1 (was P0) Selector collision + duplicate-stepper debt
- **Was:** the bespoke `<falcon-stepper>` selector string collided with the Falcon-UI-core `<falcon-stepper>` Stencil tag, and maintaining two steppers (one Angular-bespoke + SCSS, one dual-render Stencil) was DRY/house-rule debt.
- **RESOLVED:** the bespoke component + its `*.component.scss` + its `<falcon-step>`/`[falconStepperFooter]` directives were DELETED 2026-05-17 once consumers reached zero, leaving the namespaced `<falcon-angular-stepper>` as the single source. No collision, no SCSS, no duplication.

## Wave findings — deletion/promotion flags

- **DELETION FLAG (executed):** this unit is DELETED. The dossier is retained as a tombstone + redirect ONLY. A future brain-cleanup pass MAY collapse this 9-file dossier into a single tombstone note, but per the sweep contract it is kept in place with a clear DEPRECATED status and a redirect pointer to `falcon-stepper/`.
- **No code action required** — this pass is READ-ONLY and the deletion already happened in the codebase (2026-05-17).

## Upgrade path

➡️ N/A for this unit. All capability + the upgrade backlog now live on the replacement — see **`falcon-stepper/GAPS_AND_UPGRADES.md`** (G2 dot slot, G3 label slot, G6 inline error, dark-mode tokens, `labelPosition` default alignment, vertical `aria-orientation`).

## Verification
🔴 RECONCILED-AS-DELETED 2026-06-03 (B21). The sole P0 (collision + duplication) is closed by the 2026-05-17 deletion. DELETION flag = already executed in code. Redirect → `falcon-stepper/GAPS_AND_UPGRADES.md`.
