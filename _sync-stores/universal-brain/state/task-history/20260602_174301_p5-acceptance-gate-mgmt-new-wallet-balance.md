# P5 Acceptance Gate — management-console new-wallet-balance (2026-06-02)

Verdict: pass=FALSE. blocker = rendered static design values in kept-custom BMW roundel artwork.

## Gate results
1. Stop-serve: stopped `nx build admin-console --skip-nx-cache` (PID 134368) + run-executor child (133632); no nx serve/MF dev-server was up. End: all build/serve/test/executor node procs DOWN.
2. Builds: `nx build host-shell` EXIT 0; `nx build management-console` EXIT 0 (hash aa1fd5b4d871be14). Ran serial (RAM 7.64GB free).
3. Tests: `nx test management-console` EXIT 0 — 19 files / 448 tests pass, 0 fail/skip. All named specs PRESENT + green: adapter(51), transfer-rules(49), service(23), contract(15), error-contract(19), standards(27)+standards-client-view(37)+standards-drawer(16), load-wiring(26)+transfer-wiring(16) [integration-logic], validations(18).
4. Static-value grep NOT clean. Seed 13/14px paddings CLEAN. Two rendered templates token-only (only `[style.gridTemplateColumns]`x3 + calc() rail hairlines + var() token refs). RENDERED violations in BMW artwork: wb-icons.component.ts:187 (border-radius:50%;background:#000;padding:2px), :188 (conic-gradient #ffffff/#1c69d4), :189 (color:white;letter-spacing:0.5px;top:1px). Data-only (never rendered, `tone` consumed by 0 binding): seed.ts:15-19 + wallet.adapter.ts:73-79 channel tints. All are the feature's DOCUMENTED artwork/seed exemptions (standards.spec.ts isArtworkExempt + asserts #1c69d4 present), but gate-4 allows only [style.gridTemplateColumns] + approved promoted tokens.

## BMW artwork reachability
wb-client-view.component.html:30 binds <app-wb-brand-logo [brand]="selectedNode()?.brand">; seed.ts:128 root brand:'bmw' → @else if(brand()==='bmw') artwork branch renders on the seed/offline path. Live-API path uses accountInfo.accountImage → tokenized circular <img> branch.

## proposedTokens (NEEDS_APPROVAL — upstream libs/falcon-ui-tokens, NOT auto-applied)
--color-falcon-bmw-roundel(#1c69d4), --color-falcon-bmw-ring(#000), --color-falcon-bmw-face(#ffffff), --color-falcon-bmw-text(white) + radius-full/spacing-0.5/letter-spacing for the roundel chrome. Admin twin already uses --falcon-wallet-logo-bmw-* (brain W2Repair3).

## No commits. No live test. Servers DOWN.
