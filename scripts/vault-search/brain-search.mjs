#!/usr/bin/env node
/***
 * Falcon Brain — unified search (brain-search)
 * Phase 2 of BRAIN-NEURAL-LINK-PLAN-2026-05-18.
 *
 * Ranked BM25 search over Brain/brain-index/index.ndjson — one query hits all
 * 7 stores at once. No model, no network. Results carry the store's source
 * prefix so answers stay Brain-protocol compliant.
 *
 * Usage:  node brain-search.mjs "<query>"
 * Env:    TOP_N=<n> (default 10)  INDEX=<path>  STORE=<id> (restrict)
 ***/
import { readFile } from 'node:fs/promises';

const INDEX = process.env.INDEX || 'C:/Falcon/Brain/brain-index/index.ndjson';
const TOP_N = Number(process.env.TOP_N || 10);
const ONLY_STORE = process.env.STORE || '';
const K1 = 1.5, B = 0.75;

const STOP = new Set(('a an the of to in on for and or is are be it this that with as at by '
  + 'from we you i not no can will has have was were').split(' '));

function tokenize(s) {
  const toks = [];
  for (const raw of (s.toLowerCase().match(/[a-z0-9][a-z0-9._-]*/g) || [])) {
    if (raw.length < 2 || STOP.has(raw)) continue;
    toks.push(raw);
    if (/[._-]/.test(raw)) {                       // identifier-aware: also index sub-parts
      for (const part of raw.split(/[._-]+/)) {
        if (part.length >= 2 && !STOP.has(part)) toks.push(part);
      }
    }
  }
  return toks;
}

const query = process.argv.slice(2).join(' ').trim();
if (!query) {
  console.error('Usage: node brain-search.mjs "<query>"   [TOP_N=n] [STORE=id]');
  process.exit(1);
}

async function main() {
  let lines;
  try {
    lines = (await readFile(INDEX, 'utf8')).split('\n').filter(Boolean);
  } catch {
    console.error(`✖ Index not found: ${INDEX}\n  Run:  node brain-index.mjs`);
    process.exit(1);
  }

  const docs = [];
  const df = new Map();
  for (const ln of lines) {
    let o; try { o = JSON.parse(ln); } catch { continue; }
    if (ONLY_STORE && o.storeId !== ONLY_STORE) continue;
    const toks = tokenize(`${o.heading} ${o.text}`);
    const tf = new Map();
    for (const t of toks) tf.set(t, (tf.get(t) || 0) + 1);
    for (const t of tf.keys()) df.set(t, (df.get(t) || 0) + 1);
    docs.push({ meta: o, tf, len: toks.length });
  }
  if (!docs.length) { console.error('✖ No documents in index.'); process.exit(1); }

  const N = docs.length;
  const avgdl = docs.reduce((s, d) => s + d.len, 0) / N;
  const qTerms = [...new Set(tokenize(query))];

  const scored = [];
  for (const d of docs) {
    let score = 0;
    for (const t of qTerms) {
      const f = d.tf.get(t);
      if (!f) continue;
      const idf = Math.log(1 + (N - df.get(t) + 0.5) / (df.get(t) + 0.5));
      score += idf * (f * (K1 + 1)) / (f + K1 * (1 - B + B * d.len / avgdl));
    }
    if (score > 0) scored.push({ score, ...d.meta });
  }
  scored.sort((a, b) => b.score - a.score);

  const results = scored.slice(0, TOP_N);
  console.log(`\nbrain-search · "${query}" · ${N} chunks searched · ${results.length} hits\n`);
  if (!results.length) { console.log('  (no matches)\n'); return; }
  for (const r of results) {
    const snip = r.text.replace(/\s+/g, ' ').slice(0, 200);
    console.log(`  ${r.score.toFixed(2)}  ${r.prefix} ${r.storeId}`);
    console.log(`        ${r.relPath}  ›  ${r.heading}`);
    console.log(`        ${snip}…\n`);
  }
}

main().catch(e => { console.error('FATAL ' + (e.stack || e.message)); process.exit(1); });
