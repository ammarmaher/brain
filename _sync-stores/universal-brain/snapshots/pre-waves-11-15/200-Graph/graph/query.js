#!/usr/bin/env node
/**
 * Falcon Brain Query Layer (BQL)
 *
 * Self-contained Node.js script. No npm deps. Read-only.
 * Loads Wave 1 baseline + all per-wave delta files, normalizes into a unified
 * graph (Map<id, node> + edges array), then answers CLI queries.
 *
 * Usage:
 *   node query.js --stats                              Graph summary
 *   node query.js --type <NodeType>                    All nodes of a type
 *   node query.js --id <node-id>                       One node by id (with edges)
 *   node query.js --filter <key>=<value> [...]         Filter by any property (AND)
 *   node query.js --from <id> --hops <N>               BFS walk N hops out from id
 *   node query.js --gaps                               All Gap nodes
 *   node query.js --conflicts                          All Conflict nodes
 *   node query.js --orphans                            Nodes with zero edges
 *   node query.js --xlsx-vrules                        ValidationRule nodes with sot:xlsx
 *   node query.js --replaces-chain                     All REPLACES edges (xlsx → PRD lineage)
 *   node query.js --module <id>                        Everything IN_MODULE
 *   node query.js --service <id>                       Everything BELONGS_TO_SERVICE
 *   node query.js --validation-for <page-id>           V-rules applying to a page
 *   node query.js --context <topic>                    Context bundle for /brain-context skill
 *   node query.js --search <text>                      Substring search across id + name + evidence
 *
 * Output:
 *   --json        Raw JSON (default for piping)
 *   --table       Text table for terminal
 *   --markdown    Markdown for embedding
 *   --compact     One node per line
 *
 * Examples:
 *   node query.js --xlsx-vrules --markdown
 *   node query.js --validation-for page:organization-hierarchy --table
 *   node query.js --context "Add Client" --markdown
 *   node query.js --from comp:falcon-button --hops 2 --json
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const FALCON_WIKI_GRAPH = ROOT;

// ============================================================================
// Loader — normalize all data files into unified graph
// ============================================================================

const graph = {
  nodes: new Map(),
  edges: [],
  meta: {
    sources_loaded: [],
    generated_at: new Date().toISOString()
  }
};

function safeReadJson(p) {
  try {
    const s = fs.readFileSync(p, 'utf8');
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

function addNode(n, source) {
  if (!n || !n.id) return;
  // graph-id / id duality
  const id = n.id || n['graph-id'];
  if (!id) return;
  // type / graph-type duality
  const type = n.type || n['graph-type'];
  const existing = graph.nodes.get(id);
  if (existing) {
    // Merge: prefer first-discovered; collect evidence
    if (n.evidence && !existing.evidence) existing.evidence = n.evidence;
    if (type && !existing.type) existing.type = type;
    return;
  }
  graph.nodes.set(id, {
    id,
    type,
    name: n.name || id,
    evidence: n.evidence || n['evidence-source'] || [],
    sot: n.sot || null,
    'discovered-in-wave': n['discovered-in-wave'] || 0,
    'parent-moc': n['parent-moc'] || null,
    'in-module': n['in-module'] || n.in_module || null,
    service: n.service || null,
    status: n.status || null,
    _raw_source: source,
    ...n
  });
}

function addEdge(e, source) {
  if (!e || !e.from || !e.to) return;
  graph.edges.push({
    from: e.from,
    to: e.to,
    type: e.type || 'RELATED_TO',
    'evidence-strength': e['evidence-strength'] || 'unspecified',
    evidence: e.evidence || [],
    'discovered-in-wave': e['discovered-in-wave'] || 0,
    notes: e.notes || null,
    _raw_source: source
  });
}

// Wave 1 baseline
const w1nodes = safeReadJson(path.join(FALCON_WIKI_GRAPH, 'nodes.json'));
if (w1nodes && w1nodes.nodes) {
  w1nodes.nodes.forEach(n => addNode(n, 'wave-1:nodes.json'));
  graph.meta.sources_loaded.push('wave-1:nodes.json');
}

const w1edges = safeReadJson(path.join(FALCON_WIKI_GRAPH, 'edges.json'));
if (w1edges && w1edges.edges) {
  w1edges.edges.forEach(e => addEdge(e, 'wave-1:edges.json'));
  graph.meta.sources_loaded.push('wave-1:edges.json');
}

// Wave 2 delta (canonical)
const w2 = safeReadJson(path.join(FALCON_WIKI_GRAPH, 'wave-deltas', 'wave-002.json'));
if (w2 && w2['nodes-added']) {
  w2['nodes-added'].forEach(n => addNode(n, 'wave-2:wave-002.json'));
  graph.meta.sources_loaded.push('wave-2:wave-002.json');
}

// Wave 2 supplementary (parallel session)
const w2nodes = safeReadJson(path.join(FALCON_WIKI_GRAPH, 'nodes-wave-002.json'));
if (w2nodes) {
  const list = Array.isArray(w2nodes) ? w2nodes : (w2nodes.nodes || []);
  list.forEach(n => addNode(n, 'wave-2-supp:nodes-wave-002.json'));
  if (list.length) graph.meta.sources_loaded.push('wave-2-supp:nodes-wave-002.json');
}

const w2edges = safeReadJson(path.join(FALCON_WIKI_GRAPH, 'edges-wave-002.json'));
if (w2edges) {
  const list = Array.isArray(w2edges) ? w2edges : (w2edges.edges || []);
  list.forEach(e => addEdge(e, 'wave-2-supp:edges-wave-002.json'));
  if (list.length) graph.meta.sources_loaded.push('wave-2-supp:edges-wave-002.json');
}

// Wave 3+4 delta — has multiple sub-arrays to synthesize
const w34 = safeReadJson(path.join(FALCON_WIKI_GRAPH, 'wave-deltas', 'wave-003-and-004.json'));
if (w34) {
  // xlsx validation rules → ValidationRule nodes
  if (w34['xlsx-validation-rules']) {
    w34['xlsx-validation-rules'].forEach(v => {
      addNode({
        id: v.id,
        type: 'ValidationRule',
        name: v.field || v.id,
        sot: v.sot || 'xlsx',
        sheet: v.sheet,
        required: v.required,
        length: v.length,
        unique: v.unique,
        allowed: v.allowed,
        valid: v.valid,
        invalid: v.invalid,
        error: v.error,
        'business-rules': v.br,
        evidence: [`Source_of_truth_theme/.xlsx-parse/dump-SOT/${v.sheet || ''}.tsv`],
        'discovered-in-wave': 3
      }, 'wave-3:xlsx-validation-rules');
    });
  }
  // Conflicts → Conflict nodes
  if (w34.conflicts) {
    w34.conflicts.forEach(c => {
      addNode({
        id: c.id,
        type: 'Conflict',
        name: c.id,
        between: c.between,
        winner: c.winner,
        rule: c.rule,
        evidence: ['wave-3 conflict detection'],
        'discovered-in-wave': 3
      }, 'wave-3:conflicts');
      // Edge: winner REPLACES loser (where applicable)
      if (Array.isArray(c.between) && c.winner) {
        const loser = c.between.find(x => x !== c.winner);
        if (loser) {
          addEdge({
            from: c.winner,
            to: loser,
            type: 'REPLACES',
            'evidence-strength': 'confirmed',
            evidence: [c.rule || 'wave-3 conflict resolution'],
            'discovered-in-wave': 3
          }, 'wave-3:conflicts');
        }
      }
    });
  }
  // Page → Component edges
  if (w34['page-component-edges-by-page']) {
    Object.entries(w34['page-component-edges-by-page']).forEach(([pageId, comps]) => {
      comps.forEach(c => {
        addEdge({
          from: pageId,
          to: `comp:${c.replace(/-NEW$/, '')}`,
          type: 'USES_COMPONENT',
          'evidence-strength': 'confirmed',
          evidence: [`page dossier 09-COMPONENTS.md`],
          'discovered-in-wave': 3,
          notes: c.endsWith('-NEW') ? 'proposed new component' : null
        }, 'wave-3:page-component-edges');
      });
    });
  }
  // Kafka events
  if (w34['kafka-events']) {
    w34['kafka-events'].forEach(e => {
      addNode({
        id: e.id,
        type: 'KafkaEvent',
        name: e.id,
        producer: e.producer,
        consumers: e.consumers,
        topic: e.topic,
        trigger: e.trigger,
        evidence: [`Brain SK/_obsidian/47-Events/`],
        'discovered-in-wave': 4
      }, 'wave-4:kafka-events');
      if (e.producer) {
        addEdge({
          from: `svc:${e.producer}`,
          to: e.id,
          type: 'PRODUCES_EVENT',
          'evidence-strength': 'confirmed',
          'discovered-in-wave': 4
        }, 'wave-4:kafka-events');
      }
      if (Array.isArray(e.consumers)) {
        e.consumers.forEach(c => {
          addEdge({
            from: `svc:${c}`,
            to: e.id,
            type: 'CONSUMES_EVENT',
            'evidence-strength': 'confirmed',
            'discovered-in-wave': 4
          }, 'wave-4:kafka-events');
        });
      }
    });
  }
  // E-entities
  if (w34['e-entities-reconciled']) {
    w34['e-entities-reconciled'].forEach(e => {
      addNode({
        id: e.id,
        type: 'DTO',
        name: e.id,
        prd: e.prd,
        service: e.service,
        'drift-count': e.drift,
        status: e.status || 'code-verified',
        evidence: [`Brain SK/_obsidian/40-API/E-${e.id.replace(/^dto:/, '')}.md`],
        'discovered-in-wave': 4
      }, 'wave-4:e-entities');
    });
  }
  graph.meta.sources_loaded.push('wave-3-and-4:wave-003-and-004.json');
}

// Wave 5 delta — PES + roles + ADRs + BR
const w5 = safeReadJson(path.join(FALCON_WIKI_GRAPH, 'wave-deltas', 'wave-005.json'));
if (w5) {
  if (w5['pes-keys']) {
    w5['pes-keys'].forEach(p => {
      addNode({
        id: p.id,
        type: 'PESRule',
        name: p.id,
        namespace: p.namespace,
        purpose: p.purpose,
        evidence: ['Brain Outputs/datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md'],
        'discovered-in-wave': 5
      }, 'wave-5:pes-keys');
    });
  }
  if (w5.roles) {
    w5.roles.forEach(r => {
      addNode({
        id: r.id,
        type: 'Role',
        name: r.id,
        'code-line': r['code-line'],
        'edit-reach': r['edit-reach'],
        evidence: [r['code-line']],
        'discovered-in-wave': 5
      }, 'wave-5:roles');
    });
  }
  if (w5.adrs) {
    w5.adrs.forEach(a => {
      addNode({
        id: a.id,
        type: 'ArchitectureRule',
        subtype: 'ADR',
        name: a.title,
        adr_status: a.status,
        reversal_cost: a.reversal,
        evidence: ['Brain SK/_obsidian/35-Architecture/decisions/'],
        'discovered-in-wave': 5
      }, 'wave-5:adrs');
    });
  }
  if (w5['br-high-leverage']) {
    w5['br-high-leverage'].forEach(b => {
      addNode({
        id: b.id,
        type: 'BusinessRule',
        name: b.id,
        rule: b.rule,
        'high-leverage': true,
        evidence: ['Brain Outputs/prd/modules/<module>/BUSINESS_RULES.md'],
        'discovered-in-wave': 5
      }, 'wave-5:br-high-leverage');
    });
  }
  graph.meta.sources_loaded.push('wave-5:wave-005.json');
}

// ============================================================================
// Query primitives
// ============================================================================

function allNodes() {
  return Array.from(graph.nodes.values());
}

function byType(t) {
  return allNodes().filter(n => n.type === t);
}

function byId(id) {
  return graph.nodes.get(id) || null;
}

function edgesFrom(id) {
  return graph.edges.filter(e => e.from === id);
}

function edgesTo(id) {
  return graph.edges.filter(e => e.to === id);
}

function neighbors(id) {
  const set = new Set();
  edgesFrom(id).forEach(e => set.add(e.to));
  edgesTo(id).forEach(e => set.add(e.from));
  return Array.from(set);
}

function bfs(startId, hops) {
  const visited = new Set([startId]);
  const result = { nodes: [byId(startId)], edges: [] };
  let frontier = [startId];
  for (let h = 0; h < hops; h++) {
    const next = new Set();
    frontier.forEach(id => {
      const out = edgesFrom(id);
      const inn = edgesTo(id);
      [...out, ...inn].forEach(e => {
        result.edges.push(e);
        const other = e.from === id ? e.to : e.from;
        if (!visited.has(other)) {
          visited.add(other);
          const n = byId(other);
          if (n) result.nodes.push(n);
          next.add(other);
        }
      });
    });
    frontier = Array.from(next);
    if (frontier.length === 0) break;
  }
  return result;
}

function search(text) {
  const t = text.toLowerCase();
  return allNodes().filter(n => {
    if (n.id.toLowerCase().includes(t)) return true;
    if (n.name && n.name.toLowerCase().includes(t)) return true;
    if (n.evidence && n.evidence.some(e => String(e).toLowerCase().includes(t))) return true;
    if (n.purpose && n.purpose.toLowerCase().includes(t)) return true;
    return false;
  });
}

function orphans() {
  const referenced = new Set();
  graph.edges.forEach(e => { referenced.add(e.from); referenced.add(e.to); });
  return allNodes().filter(n => !referenced.has(n.id));
}

function gaps() {
  return byType('Gap');
}

function conflicts() {
  return byType('Conflict');
}

function xlsxVRules() {
  return byType('ValidationRule').filter(n => n.sot === 'xlsx');
}

function replacesChain() {
  return graph.edges.filter(e => e.type === 'REPLACES');
}

function validationForPage(pageId) {
  // V-rules either directly linked or referenced in xlsx-validation-rules with applies-to-page
  const direct = graph.edges
    .filter(e => e.from === pageId && e.type === 'HAS_VALIDATION')
    .map(e => byId(e.to))
    .filter(Boolean);
  const indirect = byType('ValidationRule').filter(n => {
    if (n['applies-to-page'] && n['applies-to-page'].includes(pageId)) return true;
    if (n.sheet && pageId.includes(n.sheet.toLowerCase().replace(/_/g, '-').replace(/-step[-_]?\d+$/, ''))) return true;
    return false;
  });
  // De-dup
  const seen = new Set();
  return [...direct, ...indirect].filter(n => {
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });
}

function byModule(mod) {
  return graph.edges
    .filter(e => e.type === 'IN_MODULE' && e.to === mod)
    .map(e => byId(e.from))
    .filter(Boolean);
}

function byService(svc) {
  return graph.edges
    .filter(e => (e.type === 'BELONGS_TO_SERVICE' || e.type === 'PRODUCES_EVENT' || e.type === 'CONSUMES_EVENT') && (e.to === svc || e.from === svc))
    .map(e => (e.to === svc ? byId(e.from) : byId(e.to)))
    .filter(Boolean);
}

function buildContext(topic) {
  // Smart context bundle for /brain-context skill
  // 1. Substring search for matching nodes
  // 2. Pull their 1-hop neighborhood
  // 3. Pull related Gap + Conflict nodes that mention the topic
  // 4. Pull related V-rules + BR rules
  // 5. Score + rank
  const t = topic.toLowerCase();
  const matched = search(topic);
  const bundle = {
    topic,
    primary_nodes: matched.slice(0, 15),
    related_gaps: gaps().filter(g => {
      const blob = JSON.stringify(g).toLowerCase();
      return blob.includes(t);
    }),
    related_conflicts: conflicts().filter(c => {
      const blob = JSON.stringify(c).toLowerCase();
      return blob.includes(t);
    }),
    related_vrules: byType('ValidationRule').filter(v => {
      const blob = JSON.stringify(v).toLowerCase();
      return blob.includes(t);
    }).slice(0, 20),
    related_brs: byType('BusinessRule').filter(b => {
      const blob = JSON.stringify(b).toLowerCase();
      return blob.includes(t);
    }).slice(0, 20),
    related_pes: byType('PESRule').filter(p => {
      const blob = JSON.stringify(p).toLowerCase();
      return blob.includes(t);
    }).slice(0, 15),
    neighborhood_summary: {}
  };
  // For top-3 matched nodes, pull 1-hop neighborhood
  bundle.primary_nodes.slice(0, 3).forEach(n => {
    bundle.neighborhood_summary[n.id] = {
      outgoing: edgesFrom(n.id).slice(0, 10).map(e => ({ to: e.to, type: e.type })),
      incoming: edgesTo(n.id).slice(0, 10).map(e => ({ from: e.from, type: e.type }))
    };
  });
  return bundle;
}

function statsSummary() {
  const byTypeCounts = {};
  allNodes().forEach(n => {
    byTypeCounts[n.type || 'unknown'] = (byTypeCounts[n.type || 'unknown'] || 0) + 1;
  });
  const edgeTypeCounts = {};
  graph.edges.forEach(e => {
    edgeTypeCounts[e.type || 'unknown'] = (edgeTypeCounts[e.type || 'unknown'] || 0) + 1;
  });
  return {
    sources_loaded: graph.meta.sources_loaded,
    total_nodes: graph.nodes.size,
    total_edges: graph.edges.length,
    node_types: byTypeCounts,
    edge_types: edgeTypeCounts,
    orphans: orphans().length,
    gaps: gaps().length,
    conflicts: conflicts().length,
    xlsx_vrules: xlsxVRules().length,
    replaces_edges: replacesChain().length
  };
}

// ============================================================================
// Output formatters
// ============================================================================

function formatJSON(data) {
  return JSON.stringify(data, null, 2);
}

function formatTable(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) return '(no results)';
  const cols = ['id', 'type', 'name', 'sot', 'discovered-in-wave'];
  const widths = cols.map(c => Math.max(c.length, ...nodes.map(n => String(n[c] || '').length)));
  const head = '| ' + cols.map((c, i) => c.padEnd(widths[i])).join(' | ') + ' |';
  const sep = '|' + widths.map(w => '-'.repeat(w + 2)).join('|') + '|';
  const rows = nodes.map(n => '| ' + cols.map((c, i) => String(n[c] || '').padEnd(widths[i])).join(' | ') + ' |');
  return [head, sep, ...rows].join('\n');
}

function formatMarkdown(data, label) {
  if (Array.isArray(data)) {
    if (data.length === 0) return `## ${label || 'Results'}\n\n_(no results)_`;
    let md = `## ${label || 'Results'} (${data.length})\n\n`;
    md += '| id | type | name | sot | wave |\n|---|---|---|---|---:|\n';
    data.forEach(n => {
      md += `| \`${n.id}\` | ${n.type || ''} | ${n.name || ''} | ${n.sot || ''} | ${n['discovered-in-wave'] || ''} |\n`;
    });
    return md;
  }
  return '```json\n' + JSON.stringify(data, null, 2) + '\n```';
}

function formatCompact(nodes) {
  if (!Array.isArray(nodes)) return JSON.stringify(nodes);
  return nodes.map(n => `${n.id}\t${n.type || ''}\t${n.name || ''}`).join('\n');
}

function formatContextBundle(b) {
  let md = `# Brain Context: "${b.topic}"\n\n`;
  md += `_Generated by BQL ${new Date().toISOString()}_\n\n`;
  md += `**Primary matches:** ${b.primary_nodes.length} · `;
  md += `**Related V-rules:** ${b.related_vrules.length} · `;
  md += `**Related BRs:** ${b.related_brs.length} · `;
  md += `**Related PES:** ${b.related_pes.length} · `;
  md += `**Open gaps:** ${b.related_gaps.length} · `;
  md += `**Conflicts:** ${b.related_conflicts.length}\n\n`;

  if (b.primary_nodes.length) {
    md += `## Primary matches\n\n`;
    b.primary_nodes.forEach(n => {
      md += `- **${n.id}** (${n.type})${n.name && n.name !== n.id ? ' — ' + n.name : ''}\n`;
      if (n.evidence && n.evidence.length) md += `  - evidence: ${n.evidence[0]}\n`;
    });
    md += '\n';
  }

  if (b.related_vrules.length) {
    md += `## Related ValidationRules (xlsx SoT wins)\n\n`;
    b.related_vrules.forEach(v => {
      md += `- **${v.id}** — ${v.name || ''}`;
      if (v.sot) md += ` _[sot:${v.sot}]_`;
      if (v.required) md += ` _required:${v.required}_`;
      if (v.length) md += ` _len:${v.length}_`;
      md += '\n';
    });
    md += '\n';
  }

  if (b.related_brs.length) {
    md += `## Related BusinessRules\n\n`;
    b.related_brs.forEach(r => {
      md += `- **${r.id}** — ${r.rule || r.name}\n`;
    });
    md += '\n';
  }

  if (b.related_pes.length) {
    md += `## Related PESRules (permissions)\n\n`;
    b.related_pes.forEach(p => {
      md += `- **${p.id}** — ${p.purpose || ''} _[${p.namespace}]_\n`;
    });
    md += '\n';
  }

  if (b.related_gaps.length) {
    md += `## Open Gaps (potential blockers)\n\n`;
    b.related_gaps.forEach(g => {
      md += `- **${g.id}** — ${g.name || ''}\n`;
    });
    md += '\n';
  }

  if (b.related_conflicts.length) {
    md += `## Conflicts (PRD ↔ xlsx ↔ code disagreements)\n\n`;
    b.related_conflicts.forEach(c => {
      md += `- **${c.id}** — winner: ${c.winner || '?'} _[${c.rule || ''}]_\n`;
    });
    md += '\n';
  }

  if (Object.keys(b.neighborhood_summary).length) {
    md += `## 1-hop neighborhood (top 3 matches)\n\n`;
    Object.entries(b.neighborhood_summary).forEach(([id, nb]) => {
      md += `### ${id}\n\n`;
      if (nb.outgoing.length) {
        md += `**Outgoing:**\n`;
        nb.outgoing.forEach(e => { md += `- \`${e.type}\` → ${e.to}\n`; });
      }
      if (nb.incoming.length) {
        md += `\n**Incoming:**\n`;
        nb.incoming.forEach(e => { md += `- ${e.from} \`${e.type}\` →\n`; });
      }
      md += '\n';
    });
  }

  md += `---\n_Source-prefix discipline: [BRAIN-OUT] graph/nodes.json + edges.json + wave-deltas/_\n`;
  return md;
}

// ============================================================================
// CLI
// ============================================================================

function parseArgs(argv) {
  const a = { _: [], flags: {} };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const key = t.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        a.flags[key] = true;
      } else {
        a.flags[key] = next;
        i++;
      }
    } else {
      a._.push(t);
    }
  }
  return a;
}

const args = parseArgs(process.argv);

const outputFormat = args.flags.json ? 'json'
  : args.flags.table ? 'table'
  : args.flags.markdown ? 'markdown'
  : args.flags.compact ? 'compact'
  : 'json';

function emit(data, label) {
  if (outputFormat === 'json') console.log(formatJSON(data));
  else if (outputFormat === 'table') console.log(Array.isArray(data) ? formatTable(data) : JSON.stringify(data, null, 2));
  else if (outputFormat === 'markdown') console.log(formatMarkdown(data, label));
  else if (outputFormat === 'compact') console.log(formatCompact(data));
}

if (args.flags.stats) {
  console.log(formatJSON(statsSummary()));
} else if (args.flags.id) {
  const n = byId(args.flags.id);
  const result = n ? { node: n, edges_from: edgesFrom(n.id), edges_to: edgesTo(n.id) } : null;
  console.log(formatJSON(result));
} else if (args.flags.type) {
  emit(byType(args.flags.type), args.flags.type);
} else if (args.flags.from && args.flags.hops) {
  console.log(formatJSON(bfs(args.flags.from, parseInt(args.flags.hops, 10))));
} else if (args.flags.gaps) {
  emit(gaps(), 'Gap nodes');
} else if (args.flags.conflicts) {
  emit(conflicts(), 'Conflict nodes');
} else if (args.flags.orphans) {
  emit(orphans(), 'Orphan nodes');
} else if (args.flags['xlsx-vrules']) {
  emit(xlsxVRules(), 'xlsx-SoT ValidationRules');
} else if (args.flags['replaces-chain']) {
  console.log(formatJSON(replacesChain()));
} else if (args.flags.module) {
  emit(byModule(args.flags.module), `IN_MODULE ${args.flags.module}`);
} else if (args.flags.service) {
  emit(byService(args.flags.service), `service ${args.flags.service}`);
} else if (args.flags['validation-for']) {
  emit(validationForPage(args.flags['validation-for']), `Validation for ${args.flags['validation-for']}`);
} else if (args.flags.context) {
  if (outputFormat === 'markdown' || outputFormat === 'json' && !args.flags.json) {
    console.log(formatContextBundle(buildContext(args.flags.context)));
  } else if (outputFormat === 'json') {
    console.log(formatJSON(buildContext(args.flags.context)));
  } else {
    console.log(formatContextBundle(buildContext(args.flags.context)));
  }
} else if (args.flags.search) {
  emit(search(args.flags.search), `Search "${args.flags.search}"`);
} else if (args.flags.filter) {
  // Single or repeated --filter key=value
  const filters = Array.isArray(args.flags.filter) ? args.flags.filter : [args.flags.filter];
  let nodes = allNodes();
  filters.forEach(f => {
    const [k, v] = String(f).split('=');
    if (k && v !== undefined) {
      nodes = nodes.filter(n => String(n[k]) === v || (Array.isArray(n[k]) && n[k].includes(v)));
    }
  });
  emit(nodes, `filter ${filters.join(' & ')}`);
} else {
  console.log(`Falcon Brain Query Layer (BQL)

Usage:
  node query.js --stats
  node query.js --type <NodeType>
  node query.js --id <node-id>
  node query.js --filter <key>=<value>
  node query.js --from <id> --hops <N>
  node query.js --gaps | --conflicts | --orphans
  node query.js --xlsx-vrules | --replaces-chain
  node query.js --module <id> | --service <id>
  node query.js --validation-for <page-id>
  node query.js --context <topic>
  node query.js --search <text>

Output flags:
  --json (default) | --table | --markdown | --compact

Examples:
  node query.js --xlsx-vrules --markdown
  node query.js --context "Add Client" --markdown
  node query.js --from comp:falcon-button --hops 2
  node query.js --validation-for page:organization-hierarchy --markdown
`);
}
