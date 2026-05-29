# brain-gitnexus (Tier 3 — MCP code knowledge graph)

GitNexus is an **MCP-native** engine that parses a Git codebase into a knowledge graph
(symbols + call graph + Leiden communities) and exposes it to **Claude Code / Cursor**,
giving structural awareness of the *actual Falcon source code* — a complement to the
**doc**-brain in `falcon-wiki/200-Graph/`.

## Status: ⛔ BLOCKED + ⚠️ install method UNVERIFIED

Unlike Cognee/Graphiti, I have **not** verified GitNexus's exact install command (npm vs
pip vs binary) against its repo. Do not assume the steps below are exact until confirmed.

| Requirement | State |
|---|---|
| Runtime (Node and/or Python) | Node ✅ present / Python ❌ absent — depends on GitNexus's packaging |
| Exact install command | ⚠️ **verify from the repo first** (see Sources) |
| Claude Code MCP support | ✅ this environment is MCP-capable |

## Integration path (once installed)
GitNexus runs as an **MCP server**. Register it in Claude Code's MCP config (e.g. a
`.mcp.json` at the project root) so Claude Code can query the code graph:

```jsonc
{
  "mcpServers": {
    "gitnexus": {
      "command": "<command-from-gitnexus-repo>",
      "args": ["--repo", "C:\\Falcon\\Falcon\\falcon-web-platform-ui"]
    }
  }
}
```

Point `--repo` at the Falcon FE workspace (or a backend service) you want structurally indexed.

## To make it green
1. Open the GitNexus repo and read its README for the real install + MCP command.
2. Install per that README (it runs locally; no code leaves the machine).
3. Add the MCP server block above with the verified command.
4. Restart Claude Code; ask e.g. "what calls `applyPartialRowPatch`?" to confirm the graph answers.

## Sources to verify install
- MarkTechPost coverage (2026-04-24): "GitNexus — MCP-native knowledge graph engine for Claude Code/Cursor"
- Search GitHub for the canonical `gitnexus` repo and follow its README.
