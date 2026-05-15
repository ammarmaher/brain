---
type: hub
purpose: rulebook-index
created: 2026-05-16
canonical-source: C:\Falcon\Brain Outputs\understanding\rules\
---

*** Falcon Rulebook — vault index ***
*** SoT: Brain Outputs/understanding/rules/ ***
*** Used by: night-shift code-audit detector engine ***

# 🛡 Falcon Rulebook — Index

> The canonical, machine-readable rulebook for **clean code + architectural roles** across the Falcon platform. Source-of-truth files live at `C:\Falcon\Brain Outputs\understanding\rules\`. This note is the graph + Dataview view over them.
>
> Every Ammar / Adnan / night-shift agent reads this index to know which rules apply, which detectors exist, and which exemptions are active.

## What's in the rulebook

| Category | Folder | Scope | Rule count |
|---|---|---|---|
| 🟦 Frontend (universal) | `frontend/` | All 3 frontend apps + libs | 14 (incl. anchor R-FE-003) |
| 🟪 Frontend — Admin Console (Noor) | `frontend-admin-console/` | `apps/admin-console/**` only | 8 (incl. anchor R-NOOR-005) |
| 🟩 Backend (.NET) | `backend/` | All 4 .NET 10 services | 8 (incl. anchor R-BE-002) |
| 🟧 Cross-cutting | `cross-cutting/` | All projects (operational, security, governance) | 9 (incl. anchor R-XC-006) |
| ⚙ Detectors | `detectors/` | Regex / structural / AST / semantic-LLM implementations | _populated in Session 2_ |
| 🛡 Exemptions | `exemptions/EXEMPTIONS.md` | Per-rule justified exemptions | 1 file (5 entries) |
| 📥 Proposed | `proposed/` | Rules suggested by night shift / Ammar, awaiting promotion | 0 |

**Total active rules: ~39.**

## Rule ID legend

| Prefix | Meaning | Color |
|---|---|---|
| `R-FE-*` | Frontend (universal) | 🟦 Blue |
| `R-NOOR-*` | Frontend Admin Console (Noor scope) | 🟪 Purple |
| `R-BE-*` | Backend (.NET services) | 🟩 Green |
| `R-XC-*` | Cross-cutting (operational/security/governance) | 🟧 Orange |

## Anchor rules (read these first)

Each category has one "anchor" rule that demonstrates the canonical format:

- 🟦 **[R-FE-003 — No inline styles, ever](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-003-no-inline-styles.md)** — regex detector, 5 patterns
- 🟪 **[R-NOOR-005 — Palette over intent](../../../Brain%20Outputs/understanding/rules/frontend-admin-console/R-NOOR-005-palette-over-intent.md)** — regex + semantic detector
- 🟩 **[R-BE-002 — App service can't call app service](../../../Brain%20Outputs/understanding/rules/backend/R-BE-002-no-app-service-to-app-service.md)** — Roslyn AST detector
- 🟧 **[R-XC-006 — Never push without permission](../../../Brain%20Outputs/understanding/rules/cross-cutting/R-XC-006-never-push-without-permission.md)** — semantic-llm + git reflog

## Full rule listing

### 🟦 Frontend (universal)

| Rule | Topic | Severity | Detector |
|---|---|---|---|
| [R-FE-001](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-001-tailwind-utilities-only.md) | Tailwind utilities only | must | regex |
| [R-FE-002](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-002-no-scss-no-component-css.md) | No SCSS, no component CSS, no `styles:` array | must | structural |
| [R-FE-003](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-003-no-inline-styles.md) | No inline styles, ever | must | regex |
| [R-FE-004](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-004-tokens-only.md) | Tokens only — no hardcoded hex / px | must | regex |
| [R-FE-005](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-005-falcon-library-first.md) | Falcon library FIRST | must | regex |
| [R-FE-006](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-006-customization-order.md) | Customization order enforcement | must | semantic-llm |
| [R-FE-007](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-007-library-skeleton-app-wrapper.md) | Library skeleton + app wrapper pattern | must | ast |
| [R-FE-008](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-008-grid-first.md) | Grid first; flexbox for inline only | should | semantic-llm |
| [R-FE-009](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-009-folder-structure-pattern.md) | Folder structure: one file per type-folder | must | structural |
| [R-FE-010](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-010-comment-style.md) | Comment style: terse banner format | should | semantic-llm |
| [R-FE-011](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-011-clean-code-dry-minimal.md) | Clean code, DRY, minimal | must | semantic-llm |
| [R-FE-012](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-012-build-must-be-green.md) | Build must be green | must | structural |
| [R-FE-013](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-013-discard-old-ui.md) | Exclude deprecated UI directories | must | structural |
| [R-FE-014](../../../Brain%20Outputs/understanding/rules/frontend/R-FE-014-canonical-workspace-only.md) | Canonical workspace only | must | structural |

### 🟪 Frontend — Admin Console (Noor scope)

| Rule | Topic | Severity | Detector |
|---|---|---|---|
| [R-NOOR-001](../../../Brain%20Outputs/understanding/rules/frontend-admin-console/R-NOOR-001-layout-ownership.md) | Layout ownership (host-shell / page / component) | must | structural |
| [R-NOOR-002](../../../Brain%20Outputs/understanding/rules/frontend-admin-console/R-NOOR-002-theme-promotion.md) | Theme promotion to canonical theme file | must | semantic-llm |
| [R-NOOR-003](../../../Brain%20Outputs/understanding/rules/frontend-admin-console/R-NOOR-003-typography-scale.md) | Typography scale only | must | regex |
| [R-NOOR-004](../../../Brain%20Outputs/understanding/rules/frontend-admin-console/R-NOOR-004-font-ownership.md) | Fonts loaded once in index.html | must | structural |
| [R-NOOR-005](../../../Brain%20Outputs/understanding/rules/frontend-admin-console/R-NOOR-005-palette-over-intent.md) | Color naming: palette over intent | must | regex |
| [R-NOOR-006](../../../Brain%20Outputs/understanding/rules/frontend-admin-console/R-NOOR-006-component-reuse.md) | Component reuse (Falcon library FIRST) | must | semantic-llm |
| [R-NOOR-007](../../../Brain%20Outputs/understanding/rules/frontend-admin-console/R-NOOR-007-i18n-rtl.md) | i18n + RTL logical properties | must | regex |
| [R-NOOR-008](../../../Brain%20Outputs/understanding/rules/frontend-admin-console/R-NOOR-008-global-selector-hygiene.md) | Global selector hygiene | must | regex |

### 🟩 Backend (.NET services)

| Rule | Topic | Severity | Detector |
|---|---|---|---|
| [R-BE-001](../../../Brain%20Outputs/understanding/rules/backend/R-BE-001-clean-architecture-layers.md) | Clean Architecture layer dependencies | must | ast |
| [R-BE-002](../../../Brain%20Outputs/understanding/rules/backend/R-BE-002-no-app-service-to-app-service.md) | App service must not call app service | must | ast |
| [R-BE-003](../../../Brain%20Outputs/understanding/rules/backend/R-BE-003-internal-services-no-gateway.md) | Internal services use gRPC/Kafka, never gateways | must | structural |
| [R-BE-004](../../../Brain%20Outputs/understanding/rules/backend/R-BE-004-service-operation-result.md) | ServiceOperationResult&lt;T&gt; everywhere | must | ast |
| [R-BE-005](../../../Brain%20Outputs/understanding/rules/backend/R-BE-005-multi-language-name.md) | MultiLanguageName(En, Ar) for user text | must | regex |
| [R-BE-006](../../../Brain%20Outputs/understanding/rules/backend/R-BE-006-falcon-exception.md) | FalconException + FalconError codes only | must | regex |
| [R-BE-007](../../../Brain%20Outputs/understanding/rules/backend/R-BE-007-no-hardcoded-secrets.md) | No hardcoded secrets in code | must | regex |
| [R-BE-008](../../../Brain%20Outputs/understanding/rules/backend/R-BE-008-zitadel-jwt-auth.md) | Zitadel JWT Bearer on all controllers | must | ast |

### 🟧 Cross-cutting (operational, security, governance)

| Rule | Topic | Severity | Detector |
|---|---|---|---|
| [R-XC-001](../../../Brain%20Outputs/understanding/rules/cross-cutting/R-XC-001-identity-owns-user-lifecycle.md) | Identity service owns user lifecycle | must | structural |
| [R-XC-002](../../../Brain%20Outputs/understanding/rules/cross-cutting/R-XC-002-frontend-never-calls-zitadel.md) | Frontend never calls Zitadel directly | must | structural |
| [R-XC-003](../../../Brain%20Outputs/understanding/rules/cross-cutting/R-XC-003-strict-task-scope.md) | Strict task scope | must | semantic-llm |
| [R-XC-004](../../../Brain%20Outputs/understanding/rules/cross-cutting/R-XC-004-build-must-be-green.md) | Build must be green | must | manual |
| [R-XC-005](../../../Brain%20Outputs/understanding/rules/cross-cutting/R-XC-005-never-commit-without-permission.md) | Never commit without permission | must | semantic-llm |
| [R-XC-006](../../../Brain%20Outputs/understanding/rules/cross-cutting/R-XC-006-never-push-without-permission.md) | Never push without permission | must | semantic-llm |
| [R-XC-007](../../../Brain%20Outputs/understanding/rules/cross-cutting/R-XC-007-self-explore.md) | Self-explore — never ask which path | must | semantic-llm |
| [R-XC-008](../../../Brain%20Outputs/understanding/rules/cross-cutting/R-XC-008-trunk-based-development.md) | Trunk-based development | must | structural |
| [R-XC-009](../../../Brain%20Outputs/understanding/rules/cross-cutting/R-XC-009-orchestrator-failure-modes.md) | Orchestrator failure-mode discipline | must | semantic-llm |

## Severity ladder

| Severity | Meaning | Night-shift action |
|---|---|---|
| `must` | Hardened, no exceptions outside the exemption registry | High-severity violation row in morning briefing |
| `should` | Strong guidance | Medium-severity row; suggestion only |
| `nice` | Style preference | Logged but never blocks |
| `deprecated` | Retired; detector still runs for archaeology | FYI row only |

## Detector types

| Type | What it does | Implementation |
|---|---|---|
| `regex` | Literal-pattern textual sweep | `Select-String -Pattern <regex> -Path <scope>` |
| `structural` | Folder / file / naming checks | File-tree walker + path glob |
| `ast` | Code-shape rules via syntax tree | TypeScript Compiler API or Roslyn |
| `semantic-llm` | Nuanced judgment via tri-mindset Brain | LLM verdict template |
| `manual` | No detector; depends on out-of-band evidence | Logged for human triage |

## How a violation becomes a morning briefing row

```
1. Night shift runs detector for rule R.
2. Match found in file F at line L → emit violation {ruleId, file, line, snippet, severity, autoFix?}.
3. Triage: deduped, grouped by file + by rule.
4. If autoFix.available + riskLevel=low → generate patch under proposed-fixes/<patch>.diff
5. Morning briefing renders the row with [✅ Apply] [❌ Reject] buttons.
6. On approval → patch applied, violation closed, exemption considered for similar future code.
```

## Related

- Canonical source folder: `C:\Falcon\Brain Outputs\understanding\rules\`
- Format template: `RULE_TEMPLATE.md` in that folder
- Exemption registry: `exemptions/EXEMPTIONS.md`
- Night-shift jobs (coming in Session 3): `C:\Falcon\Brain\jobs\code-audit-*.md`
- Detector implementations (coming in Session 2): `detectors/` folder

## Hubs

- [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[🟢 Start Here]]

## Tags

#type/hub #type/architecture-rules #rulebook #night-shift
