# Installation Steps - Brain SK Root Discovery Pack

## Goal

Make Brain SK automatically discover your full Falcon project from:

```text
C:\Falcon\Falcon
```

It must generate visible understanding files and link them into Obsidian automatically.

## Steps

1. Extract this ZIP.
2. Copy or merge the contents into your Brain SK repo.
3. Make sure the brain repo points to:

```text
https://github.com/ammarmaher/brain
```

4. Open the brain repo folder in Obsidian as a vault.
5. Copy `.claude/commands/*.md` into your active Falcon project `.claude/commands` folder.
6. Merge `docs/CLAUDE_APPEND_BRAIN_SK.md` into your Falcon project `CLAUDE.md`.
7. Run Claude command:

```text
Initialize Brain SK. Run Shared Bootstrap TouchBase from C:\Falcon\Falcon.
```

## Expected generated files

After the first run you should see:

```text
outputs/discovery/discovered-path-map.md
outputs/discovery/discovered-path-map.json
outputs/discovery/startup-readiness-report.md
outputs/discovery/scan-metadata.json
_obsidian/BRAIN_SK_HOME.md
```

## Authorization

If GitHub, backend, API, or tool authorization is required, Claude should ask Ammar only for the missing required authorization. Everything else should be automatic.
