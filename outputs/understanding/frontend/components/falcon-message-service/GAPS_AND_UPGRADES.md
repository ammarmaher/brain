# falcon-message-service — GAPS AND UPGRADES

> **This file holds the B18 AUDIT findings for this unit in prose.** Findings rows also recorded in `plans/library-deep-dive/FINDINGS/B18.md`. **We fix NOTHING this pass.**

## Dossier-vs-code drift (the headline finding)

### DRIFT-SUPERSESSION — the old `falcon-message-host` dossier is stale (🟠)

`[CODE]` `falcon-message-service.ts:1-23` — the OLD dossier (`understanding/frontend/components/falcon-message-host/`) describes a `BehaviorSubject<FalconMessage[]>`-owning queue that the host subscribes to and renders as a toast stack. **Phase 5 (2026-05-24) replaced that:** `add()` routes through `FalconMessageOrchestratorService.show()`, `messages$` always emits `[]`, `remove()`→`dismissByCorrelationId`, `clear()`→`clearAll`. This new `falcon-message-service` dossier is the live successor. **The old `falcon-message-host` dossier is flagged for formal deprecation by the B23 reconcile cluster** (not edited here per the READ-ONLY constraint).

## Missing capabilities (active source verified)

### G-DEAD-HOST — `<falcon-angular-message-host>` is a no-op still mounted (🟠, HIGH-RISK-QUEUE)

`[CODE]` `falcon-message-host.component.ts:40-48` subscribes `service.messages$` (always `[]`) → `messages()` never populates → renders ZERO toasts. Still imported + mounted in `apps/host-shell/src/app/app.ts:6,26,38`. The live toast renderer is `FalconToastAdapterComponent` (also in app.ts), bound to `orchestrator.activeToast()`. The shim's own JSDoc says the mount "can be removed in a later sweep — leaving it as a no-op keeps the diff focused" (`falcon-message-service.ts:21-23`).

**Why HIGH-RISK-QUEUE:** removing a mounted shell component + its barrel export is a public-API/contract change (other apps may import it). Do it only when no PrimeNG-shaped caller depends on the *host* (the *service* stays).

**Recommended (deferred):** delete `FalconAngularMessageHostComponent` + its template + the `app.ts` mount + the barrel export; keep `FalconMessageService` (the shim) and its dead `messages$` slot can then also go.

### G-DROP — `life` / `closable` / `icon` silently ignored (🟡, safe-local)

`[CODE]` `falcon-message-service.ts:38-46` — these PrimeNG fields are accepted by the `FalconMessage` type but DROPPED (orchestrator owns timing/dismiss/icon). `templates-list.component.ts:388` passes `life:4000` etc. that have no effect. **A `life:0` sticky-toast caller gets the platform auto-dismiss instead** — a behavior change vs PrimeNG.

**Recommended:** either (a) strip `life`/`closable`/`icon` from `FalconMessage` (breaking, gate behind major), or (b) emit a one-time dev `console.warn` when they are set, or (c) map `life` → a `dedupeKey`-less per-message override if the orchestrator ever supports it.

### G-DUP-TYPE — two exported `FalconMessage` interfaces (🟡, safe-local)

`[CODE]` `falcon-message-service.ts:32-47` (PrimeNG shape) and `falcon-message-orchestrator.types.ts:38-82` (orchestrator shape) both export `FalconMessage` from `falcon-ui-core`. The barrel re-exports the orchestrator one as `FalconOrchestratorMessage` (`angular-wrapper/index.ts:89-97`) to dodge the collision, self-noting "Phase 5 deprecates the shim; at that point the aliases can collapse back to the spec names."

**Recommended:** collapse the alias once the shim is deleted (tracked under G-DEAD-HOST).

### G-STALE-CLAIM — "ZERO live callers" JSDoc is no longer true (🟡, safe-local)

`[CODE]` `falcon-message-service.ts:8-9` asserts "a repo-wide grep at the time of this commit shows ZERO live callers of `.add()`". `templates-list.component.ts` (admin + mgmt) call `.add()` in 12 sites. True at the Phase-5 commit; templates-list retained/adopted it after. (Comment-only drift; no functional impact.)

### G-STALE-BANNER — host TS/HTML banners describe live rendering (🟡, safe-local)

`[CODE]` `falcon-message-host.component.ts:1-3` + `.html:1-3` still say "renders one `<falcon-angular-toast>` per active message … Drop-in for [legacy p-toast]" with no note that it is now inert. Misleads a reader.

## Missing accessibility features

- N/A for the dead host (it renders nothing). The live a11y lives in the orchestrator's notification card / modal adapter (per-intent `role` + `aria-live`).

## Missing tests

- `[CODE]` listing 2026-06-03 → **no `.spec.ts` for the shim service or the host.** The successor IS well-tested (`apps/host-shell/tests/falcon-message-orchestrator.spec.ts`, 30+ tests covering all 10 acceptance criteria + dedupe + pending-toast promotion + auto-dismiss + strict-category).
- **G-TEST (P3 if shim survives):** add a shim spec asserting `add()` → `orchestrator.show()` mapping (severity→category, summary→title, detail→message, id→correlationId), `addAll`→`add`, `remove`→`dismissByCorrelationId`, `clear`→`clearAll`, and `messages$` stays `[]`.

## Missing Tailwind / token parity

N/A — no token contract (TOKENS.md). Visual policy lives in `falcon-defaults.json.notification`.

## Performance risks

- The dead `BehaviorSubject` + the host's `signal([])` + `takeUntilDestroyed` subscription are near-zero cost but pure dead-weight. Removing the host (G-DEAD-HOST) reclaims a trivial amount of bundle + one subscription.

## Visual / interaction risks

- None from this unit (renders nothing). The orchestrator's latest-wins + 3s-dedupe actually *reduce* the old "viewport flood" risk the prior dossier flagged (its P1 `maxStack`/`dedup` gaps are now SOLVED by the orchestrator).

## Old-dossier gaps now resolved by Phase 5

The prior `falcon-message-host` dossier listed P1 gaps that the orchestrator migration closed:
- **`maxStack` cap** → orchestrator shows only one toast per channel (`showOnlyOneMessage`). RESOLVED.
- **Dedup by key** → orchestrator 3s `dedupeKey` window. RESOLVED.
- **Action-required beats toast** → orchestrator modal/toast priority routing. RESOLVED.
- **"Migration adapter from `FalconMessageService` to a modern renderer"** — the prior dossier literally recommended this; Phase 5 delivered it (routing to the orchestrator). RESOLVED.

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G-DEAD-HOST | Delete the no-op `<falcon-angular-message-host>` + app.ts mount | P2 | HIGH-RISK-QUEUE |
| G-DUP-TYPE | Collapse `FalconOrchestratorMessage` alias after shim removal | P3 | safe-local |
| G-DROP | Strip/warn on ignored `life`/`closable`/`icon` | P3 | safe-local |
| G-TEST | Shim mapping spec (only if shim survives) | P3 | safe-local |
| G-STALE-CLAIM / G-STALE-BANNER | Fix stale comments | P3 | safe-local |

## Fix-shared-vs-per-page

All findings belong in the **shared library** (`falcon-ui-core`). There is no per-page work — the shim is a single chokepoint.

## Deep-Dive Sweep Findings (2026-06-03 — B18)

**Consumer count: 2 app files / 12 `.add()` occurrences + 1 no-op mount + 1 redundant provider.** ([CODE] grep `FalconMessageService` / `falcon-angular-message-host`.)

- **SUPERSESSION confirmed** — service is a Phase-5 orchestrator shim; host is a no-op. Old `falcon-message-host` dossier flagged for B23 deprecation.
- **Deletion/promotion flag:** `<falcon-angular-message-host>` → **promote G-DEAD-HOST to the removal queue** (HIGH-RISK-QUEUE; do not auto-delete). The `FalconMessageService` shim stays ACTIVE.
- All other findings are `safe-local` (doc/comment/type-hygiene). See FINDINGS/B18.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18) against all source layers + the orchestrator successor. Old-dossier gaps re-checked against `message-priorities.json` + orchestrator routing (4 prior P1 gaps RESOLVED). Deletion flag (G-DEAD-HOST) raised, not actioned.
