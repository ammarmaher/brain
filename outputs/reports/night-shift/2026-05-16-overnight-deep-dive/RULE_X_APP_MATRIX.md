---
type: rule-x-app-matrix
generatedAt: 2026-05-16T03:44:53.0173643+03:00
---

# 🗺 Rule × App Violation Matrix

> At-a-glance: which apps need attention on which rules. Empty cell = zero violations.

| Rule \\ App | admin-console | host-shell | falcon | falcon-studio | falcon-theme | **Total** |
|---|---|---|---|---|---|---|
| `R-FE-001` | | **18** | **11** | **9** | | **38** |
| `R-FE-003` | **24** | **4** | **2** | **90** | | **120** |
| `R-FE-004` | **174** | **485** | **55** | **1309** | **248** | **2271** |
| `R-FE-005` | **32** | **79** | | | | **111** |
| `R-NOOR-003` | **148** | | | | | **148** |
| `R-NOOR-005` | **24** | | | | | **24** |
| `R-NOOR-007` | **20** | | | | | **20** |
| `R-NOOR-008` | **2** | | | | | **2** |
| **App Total** | **424** | **586** | **68** | **1408** | **248** | **2734** |

## Reading the matrix

- **High-value cell** = high count in a real-signal rule × app combo (e.g. R-FE-005 in admin-console)
- **Suspicious zeros** = if you expected violations and see none, double-check the rule's scope.paths
- **Tall column** = an app with widespread violations across many rules (admin-console)
- **Tall row** = a rule that affects many apps (R-FE-004 — but mostly false-positive)

## Strategy from the matrix

1. Pick the worst CELL (not the worst rule, not the worst app — the worst intersection)
2. Fix that intersection first — it's a focused refactor with measurable result
3. Move down the rule column, then move across the app row
4. Re-run after each pass to see the matrix evolve

