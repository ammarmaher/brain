# Falcon Bundle Performance Architect Skill

## Purpose

Use this skill for Angular/Nx/Module Federation bundle size, build performance, runtime performance, lazy loading, remote chunking, dependency sharing, Tailwind output, icons, assets, and performance regression analysis.

The goal is to improve performance safely without breaking Falcon architecture.

---

## Trigger Examples

Use this skill when Ammar says:

```txt
bundle size
performance
slow load
build size
chunks
lazy loading
remoteEntry
Module Federation sharing
duplicated dependencies
assets
icons
Tailwind output
CSS size
budgets
Lighthouse
initial load
optimize Angular
```

---

## Required Analysis Before Changes

Before changing code, identify:

```txt
target app
build command
initial bundle size
lazy chunks
remoteEntry size
duplicated dependencies
shared dependency config
barrel imports
large libraries
icons usage
assets/images/fonts
Tailwind/CSS output
route-level lazy loading
Module Federation sharing impact
risk level
```

Do not guess.

Use real build/stat outputs when available.

---

## Safe Optimization Areas

Prefer safe improvements first:

```txt
route-level lazy loading
component-level lazy loading where useful
remove unused imports
avoid importing full icon libraries
avoid broad barrel imports when they pull too much
optimize assets/images/fonts
review Tailwind output
review shared dependencies in Module Federation
split heavy feature modules/routes
add or enforce Angular budgets
remove dead code only when proven unused
```

---

## Dangerous Changes Requiring Caution

Do not do these without clear reason:

```txt
changing Module Federation shared config blindly
moving many dependencies between host/remotes
deleting shared libraries
rewriting routing architecture
removing imports without checking usage
splitting everything into tiny chunks
optimizing tiny gains with high regression risk
changing public APIs of shared libs
```

---

## Output Format

Always output:

```txt
Target app:
Build command:
Current findings:
Largest bundles/chunks:
Root causes:
Safe optimization plan:
Risk level:
Files to change:
Expected impact:
Verification commands:
Before/after comparison:
Remaining risks:
```

---

## Verification

After changes, verify:

```txt
build succeeds
lint succeeds if available
host/remotes still load
routes still work
remoteEntry still resolves
no shared dependency conflict
no missing icons/assets/styles
bundle size before/after is documented
```

---

## Hard Rules

```txt
Analyze before changing.
Do not break Module Federation.
Do not optimize blindly.
Do not remove shared code without proof.
Do not over-engineer.
Do not claim improvement without before/after evidence.
```
