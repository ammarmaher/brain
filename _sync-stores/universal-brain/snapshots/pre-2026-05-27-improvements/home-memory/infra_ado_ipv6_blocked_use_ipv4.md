---
name: infra-ado-ipv6-blocked-use-ipv4
description: Azure DevOps API (dev.azure.com / t2development.visualstudio.com) IPv6 path is broken on this Windows host — schannel TLS reset. Force IPv4 for all curl/HTTPS calls.
metadata: 
  node_type: memory
  type: reference
  originSessionId: d42b64d0-25f9-429d-b2e3-c1cf187fbf78
---

## Azure DevOps API — force IPv4 from this host

When calling the Azure DevOps REST API (`dev.azure.com` or `t2development.visualstudio.com`) from this Windows machine, the IPv6 path (`2603:1061:10:1::16`) fails the TLS handshake with `schannel: Connection was reset`. Likely a path-MTU / middlebox issue on the upstream IPv6 route — not something we can fix locally.

**Workaround**: force IPv4 on every request.

- `curl -4 ...` (the flag is `-4` / `--ipv4`)
- For PowerShell `Invoke-RestMethod`, prefer `curl -4` via Bash, or pin DNS lookup with `[System.Net.Dns]::GetHostAddresses($h) | ? AddressFamily -eq 'InterNetwork'` and dial that IP directly.
- For the `az` CLI: `az config set core.no_color=true` won't help — instead set the proxy/DNS to A-record only, or just install `gh`-style tooling that defaults to IPv4 happy-eyeballs.

**Why**: discovered 2026-05-21 while creating draft PRs #41960/#41961/#41962 through the Task Manager agent. First 3 API attempts failed with `curl: (35) schannel: ...Connection was reset`. Re-running with `-4` succeeded on first try, every call.

**How to apply**: any future agent (Task Manager, ammar-* services) hitting Azure DevOps from this host MUST pass `-4` to curl, or scope `Resolve-DnsName -Type A` then dial the v4 IP. Don't waste cycles debugging "transient TLS failures" — they're deterministic on v6.

PAT lives at `C:\Users\User\.azure-devops-pat` (84 bytes, no BOM, no trailing newline). Basic auth header: `Authorization: Basic $(printf ":<PAT>" | base64 -w0)`.

Related: [[project-pr-inventory-boss-review-2026-05-21]]
