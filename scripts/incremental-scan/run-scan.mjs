#!/usr/bin/env node
/*** Brain SK Frontend Component Incremental Scan — Node engine ***
 *** Spawned by domains/frontend/component-knowledge/incremental-scan/SKILL.md ***
 *** Reads canonical understanding/frontend/components/ + active Falcon repo.   ***
 *** Writes metadata + run report + dated reports folder + CSV + edit-history.  ***/

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { execSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';

const FALCON_REPO       = 'C:/Falcon/Falcon/falcon-web-platform-ui';
const KNOWLEDGE_ROOT    = 'C:/Falcon/Brain Outputs/understanding/frontend';
const COMPONENTS_DIR    = `${KNOWLEDGE_ROOT}/components`;
const SCAN_STATE_DIR    = `${KNOWLEDGE_ROOT}/_scan-state`;
const REPORTS_ROOT      = 'C:/Falcon/Brain Outputs/reports/component-scans';

const REQUIRED_DOCS = ['OVERVIEW.md','API.md','USAGE.md','TOKENS.md','GAPS_AND_UPGRADES.md','DECISION.md'];

const argv = new Map(process.argv.slice(2).map((a,i,arr)=>[a.replace(/^--/,''), arr[i+1]]));
const FORCE_RESCAN = process.argv.includes('--force-rescan');

const nowIso = () => new Date().toISOString().replace('Z', (() => {
  const o = -new Date().getTimezoneOffset();
  const sign = o >= 0 ? '+' : '-';
  const hh = String(Math.floor(Math.abs(o)/60)).padStart(2,'0');
  const mm = String(Math.abs(o)%60).padStart(2,'0');
  return `${sign}${hh}:${mm}`;
})());
const runStamp = () => {
  const d = new Date();
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
};

const RUN_TS = nowIso();
const RUN_STAMP = runStamp();
const RUN_FOLDER = `${REPORTS_ROOT}/${RUN_STAMP}`;

const ensureDir = (d) => { try { mkdirSync(d, { recursive: true }); } catch {} };
ensureDir(SCAN_STATE_DIR);
ensureDir(RUN_FOLDER);

function git(args, opts = {}) {
  try {
    return execFileSync('git', ['-C', FALCON_REPO, ...args], {
      encoding: 'utf8',
      stdio: ['ignore','pipe','ignore'],
      ...opts,
    }).trim();
  } catch (e) { return null; }
}

const FALCON_BRANCH = git(['branch','--show-current']) || 'unknown';
const FALCON_HEAD   = git(['log','-1','--format=%H']) || 'unknown';
const FALCON_HEAD_SHORT = FALCON_HEAD.slice(0,8);

function md5OfFile(absPath) {
  try { return 'md5:' + createHash('md5').update(readFileSync(absPath)).digest('hex'); }
  catch { return null; }
}

function fileMtimeIso(absPath) {
  try {
    const t = statSync(absPath).mtime;
    return new Date(t.getTime() - t.getTimezoneOffset()*60_000).toISOString().replace('Z', (() => {
      const o = -t.getTimezoneOffset();
      const sign = o >= 0 ? '+' : '-';
      const hh = String(Math.floor(Math.abs(o)/60)).padStart(2,'0');
      const mm = String(Math.abs(o)%60).padStart(2,'0');
      return `${sign}${hh}:${mm}`;
    })());
  } catch { return null; }
}

function gitLogOne(relPath) {
  // Returns {author, dateIso, hash} or {author:'UNKNOWN_NOT_IN_GIT', dateIso:fsMtime, hash:null}
  try {
    const out = execFileSync('git', ['-C', FALCON_REPO, 'log', '-1', '--format=%an <%ae>%n%aI%n%H', '--', relPath], {
      encoding: 'utf8', stdio: ['ignore','pipe','ignore']
    }).trim();
    if (!out) {
      return { author: 'UNKNOWN_NOT_IN_GIT', dateIso: fileMtimeIso(`${FALCON_REPO}/${relPath}`), hash: null };
    }
    const [author, dateIso, hash] = out.split('\n');
    return { author, dateIso, hash };
  } catch {
    return { author: 'UNKNOWN_NOT_IN_GIT', dateIso: fileMtimeIso(`${FALCON_REPO}/${relPath}`), hash: null };
  }
}

/*** Probe source-file layouts. Returns categorised related-file lists. ***/
function probeSources(componentName) {
  // legacy suffix handling — for `<x>-legacy` look up `<x>` under shared-ui/lib/components
  const isLegacy = componentName.endsWith('-legacy');
  const baseName = isLegacy ? componentName.replace(/-legacy$/, '') : componentName;
  const bare = baseName.replace(/^falcon-/, '');

  const candidates = {
    relatedStencilFiles: [],
    relatedTypeFiles: [],
    relatedWrapperFiles: [],
    relatedTokenFiles: [],
    relatedTailwindHelperFiles: [],
    extraUtils: [],
  };

  if (componentName === 'shared-directives') {
    // shared directives bundle
    const dir = 'libs/falcon/src/shared-ui/lib/directives';
    if (existsSync(`${FALCON_REPO}/${dir}`)) {
      for (const f of readdirSync(`${FALCON_REPO}/${dir}`)) {
        if (f.endsWith('.ts')) candidates.relatedWrapperFiles.push(`${dir}/${f}`);
      }
    }
    return candidates;
  }

  if (componentName === 'send-credentials-popup') {
    const base = 'libs/falcon/src/shared-ui/lib/components/send-credentials-popup';
    for (const suf of ['/send-credentials-popup.component.ts','/send-credentials-popup.component.html','/send-credentials-popup.component.css','/index.ts']) {
      const rel = `${base}${suf}`;
      if (existsSync(`${FALCON_REPO}/${rel}`)) candidates.relatedWrapperFiles.push(rel);
    }
    return candidates;
  }

  if (isLegacy) {
    // legacy bespoke under shared-ui/lib/components/<base-with-prefix>
    // First try the path with the `falcon-` prefix preserved, then fall back to bare-name
    for (const probePath of [
      `libs/falcon/src/shared-ui/lib/components/${baseName}`,
      `libs/falcon/src/shared-ui/lib/components/${bare}`,
    ]) {
      if (existsSync(`${FALCON_REPO}/${probePath}`)) {
        for (const f of readdirSync(`${FALCON_REPO}/${probePath}`)) {
          const rel = `${probePath}/${f}`;
          if (f.endsWith('.ts'))   candidates.relatedWrapperFiles.push(rel);
          if (f.endsWith('.html')) candidates.relatedWrapperFiles.push(rel);
          if (f.endsWith('.css'))  candidates.relatedWrapperFiles.push(rel);
        }
        break;
      }
    }
    return candidates;
  }

  // modern: Stencil Shadow
  const shadowDir = `libs/falcon-ui-core/src/components/${componentName}`;
  for (const f of [`${componentName}.tsx`, `${componentName}.types.ts`, `${componentName}.utils.ts`, `${componentName}.css`]) {
    const rel = `${shadowDir}/${f}`;
    if (existsSync(`${FALCON_REPO}/${rel}`)) {
      if (f.endsWith('.tsx'))         candidates.relatedStencilFiles.push(rel);
      else if (f.endsWith('.types.ts')) candidates.relatedTypeFiles.push(rel);
      else if (f.endsWith('.utils.ts')) candidates.extraUtils.push(rel);
      else if (f.endsWith('.css'))    candidates.extraUtils.push(rel);
    }
  }

  // Stencil Light (tw)
  const lightDir = `libs/falcon-ui-core/src/components/${componentName}-tw`;
  const lightTsx = `${lightDir}/${componentName}-tw.tsx`;
  if (existsSync(`${FALCON_REPO}/${lightTsx}`)) candidates.relatedStencilFiles.push(lightTsx);

  // Angular wrapper (some live under variant folder names — try several)
  const wrapperCandidates = [
    `libs/falcon-ui-core/src/angular-wrapper/components/${componentName}`,
    `libs/falcon-ui-core/src/angular-wrapper/components/${componentName.replace(/-host$/,'-service')}`,
  ];
  for (const wDir of wrapperCandidates) {
    if (existsSync(`${FALCON_REPO}/${wDir}`)) {
      for (const f of readdirSync(`${FALCON_REPO}/${wDir}`)) {
        const rel = `${wDir}/${f}`;
        if (f.endsWith('.ts') || f.endsWith('.html')) candidates.relatedWrapperFiles.push(rel);
      }
      break;
    }
  }

  // Token file
  const tokenRel = `libs/falcon-ui-tokens/src/components/${bare}.tokens.css`;
  if (existsSync(`${FALCON_REPO}/${tokenRel}`)) candidates.relatedTokenFiles.push(tokenRel);

  // Tailwind class helper
  const twHelpers = [
    `libs/falcon-ui-core/src/tailwind/${componentName}.classes.ts`,
    `libs/falcon-ui-core/src/tailwind/${bare}.classes.ts`,
  ];
  for (const t of twHelpers) {
    if (existsSync(`${FALCON_REPO}/${t}`)) { candidates.relatedTailwindHelperFiles.push(t); break; }
  }

  return candidates;
}

function knowledgeFolder(componentName) {
  return `${COMPONENTS_DIR}/${componentName}`;
}

function missingKnowledgeFiles(componentName) {
  const folder = knowledgeFolder(componentName);
  if (!existsSync(folder)) return REQUIRED_DOCS.slice();
  return REQUIRED_DOCS.filter(d => !existsSync(`${folder}/${d}`));
}

/*** Build per-component scan record ***/
function scanComponent(componentName, prior /* metadata entry from prior run, or null */) {
  const probe = probeSources(componentName);
  const allSourceRel = [
    ...probe.relatedStencilFiles,
    ...probe.relatedTypeFiles,
    ...probe.relatedWrapperFiles,
    ...probe.relatedTokenFiles,
    ...probe.relatedTailwindHelperFiles,
    ...probe.extraUtils,
  ];

  const sourceFileModifiedTimes = {};
  const sourceFileChecksums = {};
  const sourceFileLastGitAuthors = {};
  const sourceFileLastGitCommitDates = {};
  let lastSourceModifiedAt = null;
  let lastEditedBy = null;
  let lastEditedAt = null;
  let lastEditedSourceFile = null;
  let lastEditedCommitHash = null;

  for (const rel of allSourceRel) {
    const abs = `${FALCON_REPO}/${rel}`;
    const mtime = fileMtimeIso(abs);
    const cksum = md5OfFile(abs);
    sourceFileModifiedTimes[rel] = mtime;
    sourceFileChecksums[rel] = cksum;
    const g = gitLogOne(rel);
    sourceFileLastGitAuthors[rel] = g.author;
    sourceFileLastGitCommitDates[rel] = g.dateIso;
    if (!lastEditedAt || (g.dateIso && g.dateIso > lastEditedAt)) {
      lastEditedAt = g.dateIso;
      lastEditedBy = g.author;
      lastEditedSourceFile = rel;
      lastEditedCommitHash = g.hash;
    }
    if (!lastSourceModifiedAt || (mtime && mtime > lastSourceModifiedAt)) lastSourceModifiedAt = mtime;
  }

  const missing = missingKnowledgeFiles(componentName);

  // Decide scan vs skip vs missing-knowledge
  let status, scanReason = null, skipReason = null, changedSinceLastScan = false, changedFilesSinceLastScan = [];

  if (!prior || !prior.lastScannedAt) {
    status = missing.length === REQUIRED_DOCS.length ? 'needs-scan' : (missing.length > 0 ? 'missing-knowledge' : 'scanned');
    scanReason = !prior ? 'no prior metadata' : 'lastScannedAt null';
  } else if (missing.length > 0) {
    status = 'missing-knowledge';
    scanReason = `missing required files: ${missing.join(', ')}`;
  } else if (FORCE_RESCAN) {
    status = 'needs-scan';
    scanReason = 'forceRescan=true';
  } else {
    // Compare checksums + mtimes
    const changed = [];
    for (const rel of allSourceRel) {
      const priorSum = prior.sourceFileChecksums?.[rel];
      const newSum = sourceFileChecksums[rel];
      if (priorSum && newSum && priorSum !== newSum) changed.push(rel);
      else if (!priorSum && newSum) changed.push(rel); // new file
    }
    if (changed.length > 0) {
      status = 'needs-scan';
      changedSinceLastScan = true;
      changedFilesSinceLastScan = changed;
      scanReason = `${changed.length} source file(s) changed since last scan`;
    } else if (lastSourceModifiedAt && prior.lastScannedAt && lastSourceModifiedAt > prior.lastScannedAt) {
      status = 'needs-scan';
      changedSinceLastScan = true;
      scanReason = 'a source file mtime is newer than lastScannedAt';
    } else {
      status = 'skipped';
      skipReason = 'no source changes since lastScannedAt; all required knowledge files present';
    }
  }

  const lastScannedAt = (status === 'skipped' && prior?.lastScannedAt) ? prior.lastScannedAt : RUN_TS;
  const lastKnowledgeUpdatedAt = (status === 'skipped' && prior?.lastKnowledgeUpdatedAt) ? prior.lastKnowledgeUpdatedAt : RUN_TS;

  // Selector — best-effort
  const selector = componentName.endsWith('-legacy') ? componentName.replace(/-legacy$/, '') :
                   componentName === 'shared-directives' ? 'directives' :
                   componentName === 'send-credentials-popup' ? 'send-credentials-popup' :
                   componentName === 'falcon-organization-hierarchy-tree-tw' ? 'falcon-organization-hierarchy-tree-tw' :
                   `falcon-angular-${componentName.replace(/^falcon-/, '')}`;

  const changeSummary = changedSinceLastScan
    ? `${changedFilesSinceLastScan.length} file(s) changed; latest edit: ${lastEditedBy} @ ${lastEditedAt}`
    : (prior?.lastScannedAt ? `no changes since ${prior.lastScannedAt}` : 'first scan');

  return {
    componentName,
    selector,
    status,
    lastScannedAt,
    lastSourceModifiedAt,
    lastKnowledgeUpdatedAt,
    lastEditedBy,
    lastEditedAt,
    lastEditedSourceFile,
    lastEditedCommitHash,
    lastEditedBranch: FALCON_BRANCH,
    changedSinceLastScan,
    changedFilesSinceLastScan,
    changeSummary,
    sourceFiles: allSourceRel,
    sourceFileModifiedTimes,
    sourceFileChecksums,
    sourceFileLastGitAuthors,
    sourceFileLastGitCommitDates,
    relatedTokenFiles: probe.relatedTokenFiles,
    relatedWrapperFiles: probe.relatedWrapperFiles,
    relatedStencilFiles: probe.relatedStencilFiles,
    relatedTypeFiles: probe.relatedTypeFiles,
    relatedTailwindHelperFiles: probe.relatedTailwindHelperFiles,
    relatedUsageFiles: prior?.relatedUsageFiles || [], // populated by deep-build agents; preserved across runs
    requiredKnowledgeFiles: REQUIRED_DOCS,
    missingKnowledgeFiles: missing,
    scanReason,
    skipReason,
    scanDurationMs: null,
    lastScanCommitHash: FALCON_HEAD,
  };
}

/*** Main ***/
const metadataPath = `${SCAN_STATE_DIR}/component-scan-metadata.json`;
let priorMetadata = { generatedAt: null, runs: [], components: {} };
if (existsSync(metadataPath)) {
  try { priorMetadata = JSON.parse(readFileSync(metadataPath, 'utf8')); } catch {}
}

const components = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

const startTs = Date.now();
const records = {};
for (const c of components) {
  const t0 = Date.now();
  const rec = scanComponent(c, priorMetadata.components?.[c] || null);
  rec.scanDurationMs = Date.now() - t0;
  records[c] = rec;
}
const elapsedMs = Date.now() - startTs;

// Aggregate
const counts = { discovered: components.length, scanned: 0, skipped: 0, needsScan: 0, failed: 0, missingKnowledge: 0 };
for (const rec of Object.values(records)) {
  if (rec.status === 'scanned') counts.scanned++;
  else if (rec.status === 'skipped') counts.skipped++;
  else if (rec.status === 'needs-scan') counts.needsScan++;
  else if (rec.status === 'failed') counts.failed++;
  else if (rec.status === 'missing-knowledge') counts.missingKnowledge++;
}

const metadataCompletenessPct = Math.round(
  100 * Object.values(records).filter(r =>
    r.lastEditedBy && r.lastEditedAt && r.sourceFiles?.length > 0
  ).length / components.length
);
const editTrackingCompletenessPct = Math.round(
  100 * Object.values(records).filter(r => r.lastEditedBy && r.lastEditedBy !== 'UNKNOWN_NOT_IN_GIT').length / components.length
);
const scanCoveragePct = Math.round(100 * (counts.scanned + counts.skipped) / components.length);
const changedPct = Math.round(100 * Object.values(records).filter(r => r.changedSinceLastScan).length / components.length);

const runRecord = {
  runStamp: RUN_STAMP,
  runAt: RUN_TS,
  durationMs: elapsedMs,
  falconBranch: FALCON_BRANCH,
  falconHead: FALCON_HEAD,
  generator: 'incremental-scan@1.0.0',
  counts,
  metadataCompletenessPct,
  editTrackingCompletenessPct,
  scanCoveragePct,
  changedPct,
};

const newMetadata = {
  generatedAt: RUN_TS,
  generator: 'incremental-scan@1.0.0',
  schemaVersion: '1.0.0',
  falconRepo: FALCON_REPO,
  knowledgeRoot: KNOWLEDGE_ROOT,
  runs: [runRecord, ...(priorMetadata.runs || [])].slice(0, 20), // keep last 20 runs
  components: records,
};

writeFileSync(metadataPath, JSON.stringify(newMetadata, null, 2), 'utf8');

/*** Reports ***/
// COMPONENT_SCAN_DATA.json (run snapshot)
writeFileSync(`${RUN_FOLDER}/COMPONENT_SCAN_DATA.json`, JSON.stringify({ run: runRecord, components: records }, null, 2), 'utf8');

// CSV
{
  const rows = ['component,status,lastScannedAt,lastSourceModifiedAt,lastEditedBy,lastEditedAt,lastEditedSourceFile,changedSinceLastScan,scanReason,skipReason,sourceFileCount,missingKnowledgeFileCount'];
  for (const c of components) {
    const r = records[c];
    const safe = (s) => s == null ? '' : String(s).replace(/"/g,'""').replace(/\r?\n/g,' ');
    rows.push([
      `"${c}"`,
      `"${r.status}"`,
      `"${safe(r.lastScannedAt)}"`,
      `"${safe(r.lastSourceModifiedAt)}"`,
      `"${safe(r.lastEditedBy)}"`,
      `"${safe(r.lastEditedAt)}"`,
      `"${safe(r.lastEditedSourceFile)}"`,
      `"${r.changedSinceLastScan}"`,
      `"${safe(r.scanReason)}"`,
      `"${safe(r.skipReason)}"`,
      r.sourceFiles.length,
      r.missingKnowledgeFiles.length,
    ].join(','));
  }
  writeFileSync(`${RUN_FOLDER}/COMPONENT_SCAN_SUMMARY.csv`, rows.join('\n'), 'utf8');
}

// COMPONENT_EDIT_HISTORY_TABLE.md
{
  let md = `# Component Edit-History Table\n\n*Run ${RUN_STAMP} · Falcon branch \`${FALCON_BRANCH}\` @ \`${FALCON_HEAD_SHORT}\`*\n\n`;
  md += `| Component | Last Editor | Last Edit (ISO) | Last Edited Source File | Last Edit Commit |\n`;
  md += `|---|---|---|---|---|\n`;
  for (const c of components) {
    const r = records[c];
    md += `| \`${c}\` | ${r.lastEditedBy || '—'} | ${r.lastEditedAt || '—'} | \`${(r.lastEditedSourceFile || '—').slice(-80)}\` | ${r.lastEditedCommitHash ? '`'+r.lastEditedCommitHash.slice(0,8)+'`' : '—'} |\n`;
  }
  writeFileSync(`${RUN_FOLDER}/COMPONENT_EDIT_HISTORY_TABLE.md`, md, 'utf8');
}

// COMPONENT_SCAN_REPORT.md
{
  const fmt = (n) => `**${n}**`;
  const isCurrent = counts.needsScan === 0 && counts.missingKnowledge === 0 && counts.failed === 0;
  const safeUseList = components.filter(c => records[c].status === 'skipped' || records[c].status === 'scanned');
  const rescanList  = components.filter(c => records[c].status === 'needs-scan');
  const missingList = components.filter(c => records[c].status === 'missing-knowledge');
  const changedList = components.filter(c => records[c].changedSinceLastScan);

  let md = '';
  md += `---\ntitle: "Falcon Component Incremental Scan Report"\nsubtitle: "Run ${RUN_STAMP}"\nauthor: "Brain SK incremental-scan engine"\ndate: "${RUN_TS}"\n---\n\n`;
  md += `# Falcon Component Incremental Scan Report\n\n*Run ID: \`${RUN_STAMP}\` · Generated ${RUN_TS}*\n\n`;
  md += `## 1. Scan summary\n\n`;
  md += `| Field | Value |\n|---|---|\n`;
  md += `| Scan started | ${RUN_TS} |\n`;
  md += `| Scan finished | ${nowIso()} |\n`;
  md += `| Duration | ${elapsedMs} ms |\n`;
  md += `| Generator | \`incremental-scan@1.0.0\` |\n`;
  md += `| Generated by | Brain SK incremental-scan engine |\n`;
  md += `| Falcon branch | \`${FALCON_BRANCH}\` |\n`;
  md += `| Falcon commit | \`${FALCON_HEAD}\` (\`${FALCON_HEAD_SHORT}\`) |\n`;
  md += `| Total components discovered | ${fmt(counts.discovered)} |\n`;
  md += `| Scanned this run | ${fmt(counts.scanned)} |\n`;
  md += `| Skipped (unchanged) | ${fmt(counts.skipped)} |\n`;
  md += `| Needs scan (changed) | ${fmt(counts.needsScan)} |\n`;
  md += `| Missing knowledge | ${fmt(counts.missingKnowledge)} |\n`;
  md += `| Failed | ${fmt(counts.failed)} |\n\n`;

  md += `## 2. Edit-tracking table\n\n`;
  md += `| Component | Status | Last Scanned | Last Source Modified | Last Editor | Last Edit Date | Changed | Reason |\n`;
  md += `|---|---|---|---|---|---|---|---|\n`;
  for (const c of components) {
    const r = records[c];
    md += `| \`${c}\` | ${r.status} | ${r.lastScannedAt || '—'} | ${r.lastSourceModifiedAt || '—'} | ${r.lastEditedBy || '—'} | ${r.lastEditedAt || '—'} | ${r.changedSinceLastScan ? 'yes' : 'no'} | ${r.scanReason || r.skipReason || '—'} |\n`;
  }
  md += `\n`;

  md += `## 3. Changed components\n\n`;
  if (changedList.length === 0) md += `*No components changed since the last scan.*\n\n`;
  else {
    md += `| Component | Changed Files | Last Editor | Last Edit | Change Summary | Action |\n|---|---|---|---|---|---|\n`;
    for (const c of changedList) {
      const r = records[c];
      md += `| \`${c}\` | ${r.changedFilesSinceLastScan.length} | ${r.lastEditedBy || '—'} | ${r.lastEditedAt || '—'} | ${r.changeSummary} | ${r.status} |\n`;
    }
    md += `\n`;
  }

  md += `## 4. Skipped components (unchanged)\n\n`;
  const skippedList = components.filter(c => records[c].status === 'skipped');
  if (skippedList.length === 0) md += `*No components skipped this run.*\n\n`;
  else {
    md += `| Component | Last Scanned | Last Source Modified | Skip Reason |\n|---|---|---|---|\n`;
    for (const c of skippedList) {
      const r = records[c];
      md += `| \`${c}\` | ${r.lastScannedAt} | ${r.lastSourceModifiedAt || '—'} | ${r.skipReason} |\n`;
    }
    md += `\n`;
  }

  md += `## 5. Missing knowledge\n\n`;
  if (missingList.length === 0) md += `*All components have all 6 required knowledge files.*\n\n`;
  else {
    md += `| Component | Missing Files | Next Action |\n|---|---|---|\n`;
    for (const c of missingList) {
      md += `| \`${c}\` | ${records[c].missingKnowledgeFiles.join(', ')} | deep-build re-scan |\n`;
    }
    md += `\n`;
  }

  md += `## 6. Component readiness statistics\n\n`;
  md += `| Statistic | Value |\n|---|---|\n`;
  md += `| Scan coverage | ${scanCoveragePct} % |\n`;
  md += `| Scanned this run | ${Math.round(100*counts.scanned/counts.discovered)} % |\n`;
  md += `| Skipped (unchanged) | ${Math.round(100*counts.skipped/counts.discovered)} % |\n`;
  md += `| Missing knowledge | ${Math.round(100*counts.missingKnowledge/counts.discovered)} % |\n`;
  md += `| Changed components | ${changedPct} % |\n`;
  md += `| Failed | ${Math.round(100*counts.failed/counts.discovered)} % |\n`;
  md += `| Metadata completeness | ${metadataCompletenessPct} % |\n`;
  md += `| Edit-tracking completeness | ${editTrackingCompletenessPct} % |\n\n`;

  md += `## 7. Charts\n\n`;
  md += `*Chart toolchain unavailable in this run; bar-chart breakdown rendered as ASCII tables below.*\n\n`;
  md += `### Scanned vs Skipped vs Needs-Scan vs Missing-Knowledge vs Failed\n\n`;
  const bar = (n, max=40) => '█'.repeat(Math.max(0, Math.round(n/counts.discovered*max)));
  md += `\`\`\`\n`;
  md += `scanned          ${String(counts.scanned).padStart(3)} ${bar(counts.scanned)}\n`;
  md += `skipped          ${String(counts.skipped).padStart(3)} ${bar(counts.skipped)}\n`;
  md += `needs-scan       ${String(counts.needsScan).padStart(3)} ${bar(counts.needsScan)}\n`;
  md += `missing-knowl.   ${String(counts.missingKnowledge).padStart(3)} ${bar(counts.missingKnowledge)}\n`;
  md += `failed           ${String(counts.failed).padStart(3)} ${bar(counts.failed)}\n`;
  md += `\`\`\`\n\n`;

  md += `## 8. Final decision\n\n`;
  md += `**Is component knowledge current?** ${isCurrent ? 'YES — every component is either scanned or skipped-unchanged, with full required knowledge.' : 'NO — see "needs-scan" and "missing-knowledge" tables above.'}\n\n`;
  md += `**Safe to use (${safeUseList.length}):** ${safeUseList.length === counts.discovered ? '*all components*' : safeUseList.map(c=>`\`${c}\``).join(', ')}\n\n`;
  md += `**Require re-scan (${rescanList.length}):** ${rescanList.length === 0 ? '*none*' : rescanList.map(c=>`\`${c}\``).join(', ')}\n\n`;
  md += `**Missing knowledge (${missingList.length}):** ${missingList.length === 0 ? '*none*' : missingList.map(c=>`\`${c}\``).join(', ')}\n\n`;
  md += `**Does this scan cover today's latest source state?** ${isCurrent ? `YES — Falcon repo HEAD \`${FALCON_HEAD_SHORT}\` on \`${FALCON_BRANCH}\` reflected in metadata.` : `NO — components flagged above need deep re-scan against HEAD \`${FALCON_HEAD_SHORT}\`.`}\n\n`;

  writeFileSync(`${RUN_FOLDER}/COMPONENT_SCAN_REPORT.md`, md, 'utf8');
}

// FRONTEND_COMPONENT_SCAN_RUN.md (persistent append-style)
{
  const persistentPath = `${SCAN_STATE_DIR}/FRONTEND_COMPONENT_SCAN_RUN.md`;
  let existing = '';
  if (existsSync(persistentPath)) existing = readFileSync(persistentPath, 'utf8');
  const entry = `## Run ${RUN_STAMP}\n\n` +
    `- Started: ${RUN_TS}\n` +
    `- Falcon: \`${FALCON_BRANCH}\` @ \`${FALCON_HEAD_SHORT}\`\n` +
    `- Discovered: ${counts.discovered} · Scanned: ${counts.scanned} · Skipped: ${counts.skipped} · Needs-scan: ${counts.needsScan} · Missing-knowledge: ${counts.missingKnowledge} · Failed: ${counts.failed}\n` +
    `- Scan coverage: ${scanCoveragePct} % · Metadata completeness: ${metadataCompletenessPct} % · Edit tracking: ${editTrackingCompletenessPct} %\n` +
    `- Run folder: \`outputs/reports/component-scans/${RUN_STAMP}/\`\n\n`;
  const header = `*** Frontend Component Scan Run log ***\n*** Maintained by domains/frontend/component-knowledge/incremental-scan/SKILL.md ***\n\n# Frontend Component Scan Runs\n\n`;
  const body = existing.startsWith('***') ? existing.replace(header, '') : existing;
  writeFileSync(persistentPath, header + entry + body, 'utf8');
}

// Console output for orchestrator
console.log(JSON.stringify({
  runStamp: RUN_STAMP,
  runAt: RUN_TS,
  falconBranch: FALCON_BRANCH,
  falconHead: FALCON_HEAD,
  counts,
  scanCoveragePct,
  metadataCompletenessPct,
  editTrackingCompletenessPct,
  runFolder: RUN_FOLDER,
  metadataPath,
  durationMs: elapsedMs,
}, null, 2));
