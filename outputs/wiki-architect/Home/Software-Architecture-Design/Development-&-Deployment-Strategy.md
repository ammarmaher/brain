# Development & Deployment Strategy

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Development-&-Deployment-Strategy.md`
**Length:** 348 lines · **Headings:** 60
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

The **canonical Trunk-Based Development (TBD) charter** for Falcon. Defines the only legal branch model, the PR rules, the release process (tag-based from `main`), feature flags for incomplete work, and the developer workflow. Audience: Development (FE/BE), DevOps, Operations.

## Key rules / decisions

### Branching strategy (`Development-&-Deployment-Strategy.md:23-66`)

**Core principles:**

- **`main` is the only long-lived branch** (`…md:25-26, 47-50`).
- **Short-lived branches** (target lifespan **hours to 1-2 days**) — `feat/add-login-ui`, `fix/payment-timeout`, `chore/refactor-auth-service` (`…md:52-57`).
- **Continuous integration** — all changes integrated frequently into `main`.
- **Always Releasable** — `main` must always be deployable.
- **Release by Tag** — production releases from **tags on `main`**.
- **Feature Flags for Incomplete Work** — no long-lived feature branches; gate unfinished features.

**Forbidden** (`…md:63-66`):
- Long-lived feature branches.
- Development branches (e.g. `develop`).
- Permanent release branches.

### Pull request rules (`…md:70-88`)

- Small, focused changes; clear description; linked to task.
- **Mandatory checks:** build pass, tests pass, linting/static-checks pass.
- **At least 1 approval** required.
- **No direct commits to `main`.**
- Merge strategy: squash or merge commit (team preference).

### CI/CD pipeline (`…md:92-103`)

- **On PR:** build validation, unit tests, static analysis.
- **On merge to `main`:** automatic deployment to **Dev environment**; optional staging deploy.

### Release process (`…md:105-115`)

1. Identify a stable commit on `main`.
2. Validate in staging (if applicable).
3. Create version tag: `vX.Y.Z` (e.g. `v1.4.2`).
4. Trigger production deployment from the tag.

**Key rule:** "Production is deployed from a tag on `main`, not from a separate branch" (`…md:113-114`).

### Environment strategy (`…md:117-130`)

- **Dev:** auto-deployed from `main`.
- **Staging:** optional but recommended; mirrors prod; final validation.
- **Production:** deployed from version tags only.

### Feature flags (`…md:133-235`)

Mandatory mechanism for shipping incomplete work to `main`. Four flag types:

1. **Global Toggle** — enable/disable for all users.
2. **Tenant-Based Flag** (recommended for SaaS) — `{ "tenantId": "tenant-123", "features": { … } }`.
3. **User-Based Flag** — internal testing.
4. **Environment-Based Flag** — Dev/Staging enabled, Production disabled.

Backend reference example (`…md:146-155`) uses `_featureManager.IsEnabled("NewPricingEngine")` — implies **Microsoft.FeatureManagement** (`.AspNetCore.FeatureManagement`).

### Schema / API evolution (`…md:286-352`)

- **API Contract First** between FE and BE — agree on shape, FE mocks while BE implements.
- **Backward-compatible API changes** preferred (add fields, deprecate gradually).
- **Database changes** follow **Expand → Migrate → Contract** pattern.

### Anti-patterns (`…md:453-461`)

- Long-lived feature branches.
- Delayed integration.
- Releasing from branches other than `main`.
- Large PRs.
- Blocking FE work on BE merge.
- Manual / non-reproducible deployments.

### Summary table (`…md:464-473`)

| Area | Approach |
|---|---|
| Main branch | Single source of truth |
| Feature work | Short-lived branches |
| Integration | Continuous (daily or faster) |
| Releases | Tags on `main` |
| Environments | Dev → Staging → Production |
| Incomplete work | Feature flags |
| Frontend sync | Contract-first + mocks |

## Diagrams / images referenced

- None (text-only doc).

## Cross-references

- Branch naming overrides the older `Design-Patterns-&-Guidelines.md:200-206` (`feature/`, `bugfix/`, `hotfix/`, `release/` — superseded; this doc uses `feat/`, `fix/`, `chore/`).
- Connects to `Azure-statuses-(US,-Bugs,-Tasks).md` for the task-state pipeline that drives PR merges.

## Implications for code

**Verifiable code-side facts (per fallback §7.1):**
- 10 of 11 Falcon repos are on `main` ✓ (rule upheld).
- `falcon-web-platform-ui` is on `polishing-v0.4` ✗ — **VIOLATES** rule §3 ("no long-lived feature branches"). This was the UNVERIFIED item in the fallback; **the wiki resolves it: this is a violation, not an exception.** The "polishing" naming pattern is not in the allow list (`feat/`, `fix/`, `chore/` only).
- Feature-flag infrastructure: no `Microsoft.FeatureManagement` package reference found in any service csproj at last scan. **Missing dependency for the mandated mechanism.**
- Production tags: no obvious `vX.Y.Z` tags on the repos at last inspection. Verify with `git tag` per service before claiming compliance.

**Migration items:**
- Bring `falcon-web-platform-ui` back to `main` (squash polishing waves into tagged releases or short-lived branches per wave).
- Wire up `Microsoft.FeatureManagement` (or equivalent) in every service to honour §8.
- Document the tag-release process per service in each repo's `README.md` or `docs/`.
