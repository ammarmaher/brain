# Palettes — Color Tokens

All chart colors MUST resolve through one of these palette tokens. No hex literals inside charts.

## `falcon-default`

Generic Falcon brand primaries for neutral comparisons.

| Slot | Token | Hex | Notes |
|---|---|---|---|
| 1 | `falcon.blue-500`    | `#1F6FEB` | Primary |
| 2 | `falcon.teal-500`    | `#0FB5A1` | Secondary |
| 3 | `falcon.amber-500`   | `#F59E0B` | Tertiary |
| 4 | `falcon.violet-500`  | `#7C3AED` | Quaternary |
| 5 | `falcon.rose-500`    | `#E11D48` | Accent |
| 6 | `falcon.slate-500`   | `#64748B` | Neutral |
| 7 | `falcon.lime-500`    | `#84CC16` | Positive |

## `severity`

For gap severity charts. Pair with shape/label for color-blind safety.

| Severity | Token | Hex | Pair-shape |
|---|---|---|---|
| HIGH   | `severity.high`   | `#DC2626` (red-600)     | filled triangle |
| MEDIUM | `severity.medium` | `#F59E0B` (amber-500)   | filled square |
| LOW    | `severity.low`    | `#10B981` (emerald-500) | filled circle |
| INFO   | `severity.info`   | `#0EA5E9` (sky-500)     | hollow circle |

## `readiness`

For readiness percentage charts. Steps map to %.

| Range | Token | Hex |
|---|---|---|
| 0–24%   | `readiness.red`     | `#EF4444` |
| 25–49%  | `readiness.amber`   | `#F59E0B` |
| 50–74%  | `readiness.lime`    | `#84CC16` |
| 75–89%  | `readiness.green`   | `#22C55E` |
| 90–100% | `readiness.emerald` | `#059669` |

## `neutral`

For monochrome PDF prints.

| Slot | Token | Hex |
|---|---|---|
| 1 | `neutral.900` | `#111827` |
| 2 | `neutral.700` | `#374151` |
| 3 | `neutral.500` | `#6B7280` |
| 4 | `neutral.300` | `#D1D5DB` |
| 5 | `neutral.100` | `#F3F4F6` |

## `confidence`

For confidence matrix backgrounds. 4-step blue ramp.

| Step | Token | Hex |
|---|---|---|
| 1 | `confidence.50`  | `#EFF6FF` |
| 2 | `confidence.200` | `#BFDBFE` |
| 3 | `confidence.400` | `#60A5FA` |
| 4 | `confidence.600` | `#2563EB` |

## Accessibility rules

- All foreground/background pairs MUST reach WCAG AA contrast on rendered output.
- Severity colors MUST be paired with a shape OR icon OR text label.
- Never encode meaning in color alone.
