# Statistics Report — Organization Hierarchy  *(SCAFFOLD)*

> **SCAFFOLD / TEMPLATE — no numbers computed.** Every value below is
> `NEEDS_DATA`. A real run replaces these from
> `Brain Outputs/understanding/pages/organization-hierarchy/`. Do not treat this
> as a measured result.

- **Stats name:** organization-hierarchy
- **Generated:** SCAFFOLD (setup-only, 2026-05-19)
- **Source data:** `Brain Outputs/understanding/pages/organization-hierarchy/`
- **Status:** NEEDS_DATA — run `/calculate-statistics` to populate

## KPI scorecard (template)

| KPI | Value | Status | Formula source |
|---|---|---|---|
| UI/UX % | `NEEDS_DATA` | — | `UI_UX_RULES.md` |
| Validation % | `NEEDS_DATA` | — | `VALIDATION_RULES.md` |
| API readiness % | `NEEDS_DATA` | — | `API_RULES.md` / backend `ENDPOINT_REGISTRY.md` |
| Business coverage % | `NEEDS_DATA` | — | `BUSINESS_RULES.md` |
| Gap resolution % | `NEEDS_DATA` | — | `GAP_REGISTRY.md` |
| Page Understanding % | `NEEDS_DATA` | — | weighted formula below |

## Formula (to be applied)

```text
Page Understanding % = (UIUX * 0.35) + (Business * 0.25) + (Validation * 0.20) + (GapsResolved * 0.20)
```

## Scoring thresholds

```text
0-59%  = NEEDS ATTENTION    60-74% = PARTIAL    75-89% = GOOD
90-94% = STRONG             95-100% = EXCELLENT
```

## Notes

This scaffold demonstrates the output contract only. Statistical Intelligence
must never invent percentages — until a real run computes them from source data,
every KPI stays `NEEDS_DATA`.
