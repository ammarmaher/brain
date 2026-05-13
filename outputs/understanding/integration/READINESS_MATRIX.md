*** READINESS_MATRIX — per-axis integration readiness (2026-05-13) ***

> Scores 0–100% with one-line justification and the file(s) that drove the score.
> Decision threshold: ≥ 80% per axis is "green", 60–79% "amber", < 60% "red".

| Axis | Score | Justification | Evidence |
|---|---:|---|---|
| Backend service inventory complete | **95%** | 9/9 services documented with SERVICE_OVERVIEW.md, conventions captured, communication topology drawn. 5% withheld because Templates not exposed through gateways (discovery limitation, not data gap). | `understanding/backend/BACKEND_SERVICE_MAP.md`; per-service `<svc>/SERVICE_OVERVIEW.md` |
| Backend endpoint contracts documented | **90%** | ~125 endpoints across 7 service-level ENDPOINT_REGISTRY.md files. 3 controller deep drill-downs (Commerce NodeController, Charging WalletController, Provisioning ServicesController). Remaining ~9 controllers + ~6 Endpoint groups have summary-level docs only. | `backend/commerce/ENDPOINT_REGISTRY.md` (110 lines), `backend/identity/ENDPOINT_REGISTRY.md` (64), `backend/charging/...` (59), `backend/provisioning/...` (36), `backend/access/...` (53), `backend/contact-group/...` (54), `backend/templates/...` (39) |
| Backend DTO catalogue complete | **80%** | Every service has DTO_DICTIONARY.md. Drill-downs go DTO-by-DTO. Cross-service DTO reuse (none — each service ships its own) flagged but not centrally indexed yet. | `backend/<svc>/DTO_DICTIONARY.md` × 9 |
| Gateway routes documented | **95%** | YARP route tables + custom aggregations + cluster destinations + dev URLs + frontend URL cheat-sheet present. Production-time `Address` placeholder is empty (per-env config); flagged but not a doc gap. | `backend/GATEWAY_ROUTE_MAP.md` |
| Auth (Zitadel JWT) consistency across services | **80%** | All 9 services + both gateways use `Microsoft.AspNetCore.Authentication.JwtBearer` against the same Zitadel config shape. `ValidateAudience` drifts between services (Commerce/gateways = false; Charging = true). | `wiki/ARCHITECTURE_RULES.md` §4.5; `wiki/ARCHITECTURE_CONFLICTS.md` §4.5 |
| `ServiceOperationResult<T>` uniformity | **45%** | Every endpoint returns the wrapper, but five distinct shapes ship per service (Commerce 4-field record, Identity/Templates/ContactGroup 3-field record, Charging/Provisioning struct). Cross-service client code already has a private wrapper class to absorb the diff. | `wiki/ARCHITECTURE_CONFLICTS.md` §4.1; `falcon-core-commerce-svc/src/Falcon.Commerce.Infrastructure/External/Services/IdentityService.cs:97-103` |
| `MultiLanguageName(En, Ar)` uniformity | **50%** | Present in Commerce/Charging/Provisioning Domain; absent from Identity/Templates/ContactGroup. Each present copy is identical (good), but the platform-wide rule is unenforced. UNVERIFIED whether missing services actually need it. | `wiki/ARCHITECTURE_RULES.md` §4.3 |
| `FalconException` / `FalconError` uniformity | **55%** | Every service has its own copy. Shapes diverge slightly (Identity's `FalconError` is a primary-constructor sealed class; others are plain classes). No shared NuGet. | `wiki/ARCHITECTURE_CONFLICTS.md` §4.4 |
| Frontend Falcon Component Registry complete | **90%** | 58 rows covering 47 Stencil pairs + 49 Angular wrappers + 7 legacy bespoke Angular components + 46 token CSS files. 3 deep dossiers (input / dropdown / table). Missing-capability flags explicit (multi-select on dropdown, range on calendar, etc.). | `frontend/FALCON_COMPONENT_REGISTRY.md` |
| Tailwind tokens centralised | **85%** | SSOT at `libs/falcon-theme/src/falcon-tailwind-tokens.css` (~486 lines, ~264 tokens), per-component tokens under `libs/falcon-ui-tokens/src/components/` (46 files). 12 gate scripts enforce naming + hardcoded-value + component-token-scope. Token unification migration plan is open ("~700-edit migration" in memory). | `frontend/TAILWIND_TOKEN_MAP.md`; memory `project_token_unification_plan.md` |
| Zoneless / signals adoption | **75%** | All 3 apps register `provideZonelessChangeDetection()`. `zone.js` removed from polyfills and not shared via MF. **Pending: zoneless smoke-test on every flow** (memory `project_falcon_revamp_v3_1_night_shift_results.md`). | `frontend/ANGULAR_AND_TAILWIND_RULES.md` §3 |
| Module Federation host/remote wiring | **90%** | Host loads admin + management via `loadRemoteModule()` reading a runtime manifest; `REMOTE_MANIFEST_PROVIDER` abstraction lets the host swap to an API-backed provider. Share rules verified (Falcon eager singletons, animations local, zone.js not shared). | `frontend/FRONTEND_WORKSPACE_MAP.md`; `frontend/FRONTEND_STRUCTURE_REPORT.md` |
| Frontend → Identity-Service-only auth (no direct Zitadel) | **100%** | Grep verified across `apps/` + `libs/` — no outbound Zitadel calls; the only mentions are TypeScript types + a JWT-decoding session provider. All login/OTP/forgot/refresh flows go through `auth/*` on the Identity Gateway. | `frontend/ANGULAR_AND_TAILWIND_RULES.md` §4; `apps/host-shell/src/app/core/auth/auth-api.service.ts` |
| PRD coverage | **0%** | PRD folder absent at `C:\Falcon\PRD`. Recorded as WARN by bootstrap, not BLOCKED. | `discovery/startup-readiness-report.md` row "PRD folder" |
| Architecture wiki coverage | **15%** | Canonical `C:\Falcon\falcon-wiki` is MISSING; Phase 1 wrote a code-extracted fallback (`ARCHITECTURE_RULES.md`) with 12 `UNVERIFIED — wiki needed` items. The fallback is good enough to ship Phase 2, not good enough to govern long-term. | `wiki/WIKI_FALLBACK_NOTE.md`; `wiki/ARCHITECTURE_RULES.md` §10 |
| Security hygiene (no plaintext secrets in committed configs) | **35%** | HIGH-severity: `T2.PES.API/config/appsettings.qc.json:13` carries `Server=<public-IP>;User Id=sa;Password=P@ssw0rd;`. HIGH: Anthropic API key on disk at `Brain SK\Obsidian Vault\…\copilot\data.json` (rejected by GitHub push protection, never pushed remote, still on local disk). MED: Mongo dev creds in non-Development `appsettings.json` for Templates + Access. | `falcon-core-access-svc/src/T2.PES.API/config/appsettings.qc.json:13` (verified); `falcon-core-templates-svc/src/Falcon.Templates.Api/appsettings.json:41` (verified); `reports/bootstrap-touchbase/2026-05-13-bootstrap-completion.md` |

## Overall readiness

```
(95+90+80+95+80+45+50+55+90+85+75+90+100+0+15+35) / 16 = 880 / 16 ≈ 68%
```

**Overall: 68% — AMBER.**

Reading: Phase-1 inventories are nearly complete (≥ 80% on 10 of 16 axes), but PRD + wiki sources are essentially absent (0% + 15%) and the contract uniformity row (`ServiceOperationResult<T>`, `MultiLanguageName`, `FalconException`) drags the average down. Security hygiene's 35% is dragged by one HIGH finding (hardcoded `sa`). Three of the four lowest scores (PRD, wiki, security hygiene) are quick wins if a human acts:

- Restore the Obsidian wiki vault → unblocks the architect rule-book + auto-promotes ~12 UNVERIFIED items.
- Provide the PRD folder path → unblocks Business pipeline.
- Rotate SQL `sa` credential + Anthropic API key → flips security row to ≥ 70%.

After those three actions the Overall readiness moves to roughly **76% (AMBER-leaning-GREEN)** with no code changes.
