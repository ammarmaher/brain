---
title: Build Verification Log
date: 2026-05-16
---

# Build Verification Log

All four `nx build` runs executed at the end of each fix batch. All four green. No rollbacks.

## libs/falcon-ui-core (F1)
- Command: `npx nx build falcon-ui-core --skip-nx-cache`
- Result: **GREEN**
- Duration: ~39s
- Warnings: only pre-existing Stencil `scrollHeight` reserved-prop (not introduced this run).
- Source: F1 fix log

## apps/admin-console (F2)
- Command: `npx nx build admin-console --skip-nx-cache`
- Result: **GREEN**
- Duration: 20.584s
- Output hash: `2ed3bec41a1ab6af`
- TypeScript errors: 0
- Compiler warnings: 0
- Bundle (gzipped): `main.js` 334.67 kB (under Gate-11 340 kB budget)
- Rollbacks: 0
- Source: F2 fix log

## apps/host-shell (F3)
- Command: `npx nx build host-shell --skip-nx-cache`
- Result: **GREEN**
- Duration: 15.8s
- Output hash: `d9e80f287597d3e9`
- Errors: 0 NG / 0 TS / 0 esbuild
- Warnings: only pre-existing tsconfig-scope + unused `SvgIconComponent` import (not introduced this run)
- Rollbacks: 0
- Source: F3 fix log

## apps/management-console (F4)
- Command: `npx nx build management-console --skip-nx-cache`
- Result: **GREEN**
- Duration: 17.766s
- Output hash: `9ff968da8cf6f3d3`
- Federation expose: 317 bytes (sanity check passes)
- Warnings: only 3 pre-existing environment-file unused warnings (not regressions)
- Rollbacks: 0
- Source: F4 fix log

## Summary

| Scope | Build | Duration | Hash | Rollbacks |
|---|---|---|---|---|
| libs/falcon-ui-core | GREEN | ~39s | (Stencil) | 0 |
| apps/admin-console | GREEN | 20.584s | `2ed3bec41a1ab6af` | 0 |
| apps/host-shell | GREEN | 15.8s | `d9e80f287597d3e9` | 0 |
| apps/management-console | GREEN | 17.766s | `9ff968da8cf6f3d3` | 0 |

**Verdict: 4/4 GREEN. Zero rollbacks. Working tree dirty (per standing rule — no commits/pushes).**
