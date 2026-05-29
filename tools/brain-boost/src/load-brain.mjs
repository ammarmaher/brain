/*
 * load-brain.mjs — load the full Falcon knowledge graph the SAME way query.js does
 * (nodes.json + nodes-wave-002 + wave-deltas/*.json), so this tool sees all ~533 nodes.
 * Read-only. Enriches each node with purpose/when_to_consult/trust overlays for richer embeddings.
 */
import fs from 'node:fs';
import path from 'node:path';

const GRAPH = 'C:\\Falcon\\falcon-wiki\\200-Graph\\graph';

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

export function loadGraph() {
  const nodes = new Map();
  const edges = [];
  const addNode = (n) => {
    if (!n || !n.id) return;
    if (nodes.has(n.id)) return; // first-wins, like query.js
    nodes.set(n.id, { id: n.id, type: n.type || n['graph-type'], name: n.name || n.id, ...n });
  };
  const addEdge = (e) => { if (e && e.from && e.to) edges.push({ type: e.type || 'RELATED_TO', ...e }); };

  // Wave 1 baseline (consolidated)
  const w1 = readJson(path.join(GRAPH, 'nodes.json'));
  (w1?.nodes || []).forEach(addNode);
  const w1e = readJson(path.join(GRAPH, 'edges.json'));
  (w1e?.edges || []).forEach(addEdge);

  // Wave 2 supplementary
  const w2 = readJson(path.join(GRAPH, 'nodes-wave-002.json'));
  (Array.isArray(w2) ? w2 : w2?.nodes || []).forEach(addNode);
  const w2e = readJson(path.join(GRAPH, 'edges-wave-002.json'));
  (Array.isArray(w2e) ? w2e : w2e?.edges || []).forEach(addEdge);

  // Wave deltas — glob all *.json
  const deltaDir = path.join(GRAPH, 'wave-deltas');
  if (fs.existsSync(deltaDir)) {
    for (const f of fs.readdirSync(deltaDir).filter(x => x.endsWith('.json')).sort()) {
      const w = readJson(path.join(deltaDir, f));
      if (!w) continue;
      (w['nodes-added'] || []).forEach(addNode);
      (w.edges || []).forEach(addEdge);
      (w['xlsx-validation-rules'] || []).forEach(v => addNode({
        id: v.id, type: 'ValidationRule', name: v.field || v.id, sot: v.sot || 'xlsx',
        field: v.field, error: v.error, allowed: v.allowed, required: v.required, length: v.length
      }));
      (w.conflicts || []).forEach(c => addNode({ id: c.id, type: 'Conflict', name: c.id, winner: c.winner, rule: c.rule }));
      (w['kafka-events'] || []).forEach(e => addNode({ id: e.id, type: 'KafkaEvent', name: e.id, topic: e.topic, trigger: e.trigger }));
      (w['e-entities-reconciled'] || []).forEach(e => addNode({ id: e.id, type: 'DTO', name: e.id, service: e.service }));
      (w['pes-keys'] || []).forEach(p => addNode({ id: p.id, type: 'PESRule', name: p.id, namespace: p.namespace, purpose: p.purpose }));
      (w.roles || []).forEach(r => addNode({ id: r.id, type: 'Role', name: r.id }));
      (w.adrs || []).forEach(a => addNode({ id: a.id, type: 'ArchitectureRule', name: a.title || a.id, adr_status: a.status }));
      (w['br-high-leverage'] || []).forEach(b => addNode({ id: b.id, type: 'BusinessRule', name: b.id, rule: b.rule }));
    }
  }

  // Overlays (purpose + trust) for richer text + metadata
  const purpose = readJson(path.join(GRAPH, 'purpose-overlay.json'))?.by_node || {};
  const trust = readJson(path.join(GRAPH, 'trust-overlay.json'))?.by_node || {};
  for (const [id, n] of nodes) {
    if (purpose[id]) { n.purpose = purpose[id].purpose; n.when_to_consult = purpose[id].when_to_consult; }
    if (trust[id]) n.trust = trust[id].tier;
  }

  return { nodes: [...nodes.values()], edges };
}

/** Build the text blob that gets embedded for a node. */
export function nodeText(n) {
  const parts = [
    n.type ? `${n.type}:` : '',
    n.name && n.name !== n.id ? n.name : '',
    n.id,
    n.purpose || '',
    n.when_to_consult || '',
    n.rule || '',
    n.namespace || '',
    n.field || '',
    n.error || '',
    Array.isArray(n.evidence) && n.evidence.length ? `evidence ${n.evidence[0]}` : ''
  ];
  return parts.filter(Boolean).join('  ').replace(/\s+/g, ' ').trim();
}
