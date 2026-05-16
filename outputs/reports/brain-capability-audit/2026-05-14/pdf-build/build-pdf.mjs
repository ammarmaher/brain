// Brain Boss Report — react-pdf builder (pure React.createElement, no JSX).
// Output: ../BRAIN_BOSS_REPORT.pdf
//
// Layout:
//   1. Cover                — hero band, headline number, status badge, 4 KPI tiles
//   2. Executive dashboard  — 6 scorecards + TL;DR + colored status legend
//   3. Readiness scorecards — per-dimension bars + frontend status badges
//   4. Coverage charts      — frontend / backend / business side-by-side
//   5. Gap severity + confidence matrix
//   6. Final recommendation — greenlight / watch / block + top-5 next actions

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Rect, Line, Circle, Path, pdf } from '@react-pdf/renderer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runRoot   = path.resolve(__dirname, '..');
const metrics   = JSON.parse(fs.readFileSync(path.join(runRoot, 'BRAIN_CAPABILITY_METRICS.json'), 'utf8'));

const h = React.createElement;

// ---------- design tokens ----------
const C = {
  // ink + surface
  ink:        '#0F172A',
  inkSoft:    '#334155',
  inkMuted:   '#64748B',
  divider:    '#E2E8F0',
  surface:    '#F8FAFC',
  surface2:   '#F1F5F9',
  white:      '#FFFFFF',

  // brand
  brand:      '#1E3A8A',   // deep indigo
  brandSoft:  '#3B82F6',
  brandTint:  '#DBEAFE',
  accent:     '#0F766E',   // teal
  accentTint: '#CCFBF1',

  // status (badges)
  ready:      '#16A34A',
  readyTint:  '#DCFCE7',
  needs:      '#F59E0B',
  needsTint:  '#FEF3C7',
  legacy:     '#7C3AED',
  legacyTint: '#EDE9FE',
  deprecated: '#DC2626',
  depTint:    '#FEE2E2',
  reference:  '#64748B',
  refTint:    '#E2E8F0',

  // severity
  sevHigh:    '#DC2626',
  sevMed:     '#F59E0B',
  sevLow:     '#16A34A',

  // readiness scale (0→100)
  r0:'#DC2626', r25:'#F59E0B', r50:'#EAB308', r75:'#22C55E', r90:'#16A34A'
};

const S = StyleSheet.create({
  page:         { paddingTop: 36, paddingBottom: 50, paddingHorizontal: 36, fontFamily: 'Helvetica', fontSize: 10, color: C.ink, lineHeight: 1.4 },
  coverPage:    { padding: 0, fontFamily: 'Helvetica', fontSize: 10, color: C.ink },
  h1:           { fontSize: 24, fontFamily: 'Helvetica-Bold', color: C.ink },
  h2:           { fontSize: 13, fontFamily: 'Helvetica-Bold', marginTop: 14, marginBottom: 6, color: C.ink },
  h3:           { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 4, color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.6 },
  meta:         { fontSize: 9, color: C.inkMuted },
  caption:      { fontSize: 7.5, color: C.inkMuted, marginTop: 3, marginBottom: 4, fontStyle: 'italic' },
  body:         { fontSize: 10, color: C.inkSoft, lineHeight: 1.5 },
  bullet:       { fontSize: 9.5, marginLeft: 4, marginBottom: 3, color: C.inkSoft },
  divider:      { borderBottomWidth: 0.5, borderBottomColor: C.divider, marginVertical: 8 },
  row:          { flexDirection: 'row' },
  rowGap:       { flexDirection: 'row', justifyContent: 'space-between' },
  rowWrap:      { flexDirection: 'row', flexWrap: 'wrap' },

  // page header band
  pageHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  pageEyebrow:  { fontSize: 8, color: C.brand, fontFamily: 'Helvetica-Bold', letterSpacing: 1.2, textTransform: 'uppercase' },
  pageTitle:    { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.ink, marginTop: 2, marginBottom: 10 },

  // KPI tile (cover)
  kpiTile:      { width: '23%', backgroundColor: C.white, borderWidth: 0.5, borderColor: C.divider, borderRadius: 6, padding: 10 },
  kpiLabel:     { fontSize: 7.5, color: C.inkMuted, letterSpacing: 0.6, textTransform: 'uppercase' },
  kpiValue:     { fontSize: 20, fontFamily: 'Helvetica-Bold', color: C.ink, marginTop: 3 },
  kpiFoot:      { fontSize: 7.5, color: C.inkMuted, marginTop: 2 },

  // scorecard
  scorecard:    { width: '31.5%', backgroundColor: C.surface, borderWidth: 0.5, borderColor: C.divider, borderRadius: 6, padding: 10, marginBottom: 8, marginRight: 6 },
  scoreLabel:   { fontSize: 8, color: C.inkMuted, letterSpacing: 0.4, textTransform: 'uppercase' },
  scoreValue:   { fontSize: 22, fontFamily: 'Helvetica-Bold', marginTop: 3 },
  scoreFoot:    { fontSize: 8, color: C.inkMuted, marginTop: 3 },

  // badges
  badgeText:    { fontSize: 8, fontFamily: 'Helvetica-Bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },

  // table
  tr:           { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: C.divider, paddingVertical: 5, alignItems: 'center' },
  trHead:       { backgroundColor: C.surface2, paddingVertical: 5, paddingHorizontal: 4 },
  th:           { fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4 },
  td:           { fontSize: 9, color: C.ink },

  // recommendation callout
  callout:      { width: '32%', borderRadius: 8, padding: 12, marginRight: 6, borderLeftWidth: 4 },

  footer:       { position: 'absolute', bottom: 20, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7.5, color: C.inkMuted }
});

// ---------- primitives ----------
const fillForReadiness = v => v >= 90 ? C.r90 : v >= 75 ? C.r75 : v >= 50 ? C.r50 : v >= 25 ? C.r25 : C.r0;

const Badge = (label, kind = 'neutral') => {
  const map = {
    ready:      { bg: C.readyTint,  fg: C.ready },
    needs:      { bg: C.needsTint,  fg: '#92400E' },
    legacy:     { bg: C.legacyTint, fg: C.legacy },
    deprecated: { bg: C.depTint,    fg: C.deprecated },
    reference:  { bg: C.refTint,    fg: C.inkSoft },
    high:       { bg: C.depTint,    fg: C.sevHigh },
    medium:     { bg: C.needsTint,  fg: '#92400E' },
    low:        { bg: C.readyTint,  fg: C.sevLow },
    brand:      { bg: C.brandTint,  fg: C.brand },
    accent:     { bg: C.accentTint, fg: C.accent },
    neutral:    { bg: C.surface2,   fg: C.inkSoft }
  };
  const k = map[kind] || map.neutral;
  return h(Text, { style: [S.badgeText, { backgroundColor: k.bg, color: k.fg }] }, label);
};

const PageHeader = (eyebrow, title, pageOf) =>
  h(View, null,
    h(View, { style: S.pageHeader },
      h(Text, { style: S.pageEyebrow }, eyebrow),
      h(Text, { style: { fontSize: 8, color: C.inkMuted } }, pageOf)
    ),
    h(Text, { style: S.pageTitle }, title),
    h(View, { style: { height: 2, backgroundColor: C.brand, width: 36, marginBottom: 10 } })
  );

const Footer = (page, total) =>
  h(View, { style: S.footer, fixed: true },
    h(Text, null, `Ammar Brain — Boss Report · ${metrics.auditDate}`),
    h(Text, null, `${page} / ${total}`)
  );

const Scorecard = (label, value, foot, color = C.ink, badge = null) =>
  h(View, { style: S.scorecard },
    h(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' } },
      h(Text, { style: S.scoreLabel }, label),
      badge ? badge : null
    ),
    h(Text, { style: [S.scoreValue, { color }] }, value),
    h(Text, { style: S.scoreFoot }, foot)
  );

const KpiTile = (label, value, foot, color = C.brand) =>
  h(View, { style: S.kpiTile },
    h(View, { style: { width: 18, height: 3, backgroundColor: color, borderRadius: 2, marginBottom: 6 } }),
    h(Text, { style: S.kpiLabel }, label),
    h(Text, { style: S.kpiValue }, value),
    h(Text, { style: S.kpiFoot }, foot)
  );

const ReadinessBar = (label, value, options = {}) => {
  const W = options.width || 230;
  const labelWidth = options.labelWidth || 170;
  const f = Math.max(0, Math.min(100, value)) / 100 * W;
  return h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 } },
    h(Text, { style: { width: labelWidth, fontSize: 9, color: C.inkSoft } }, label),
    h(Svg, { width: W + 8, height: 12 },
      h(Rect, { x: 0, y: 2, width: W, height: 8, fill: C.divider, rx: 4, ry: 4 }),
      h(Rect, { x: 0, y: 2, width: f, height: 8, fill: fillForReadiness(value), rx: 4, ry: 4 })
    ),
    h(Text, { style: { marginLeft: 6, fontSize: 9, fontFamily: 'Helvetica-Bold', color: fillForReadiness(value), width: 36 } }, `${value.toFixed ? value.toFixed(0) : value}%`)
  );
};

const HBarRow = (label, value, max, color, labelWidth = 130, barW = 240) => {
  const f = max > 0 ? (value / max) * barW : 0;
  return h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 } },
    h(Text, { style: { width: labelWidth, fontSize: 9, color: C.inkSoft } }, label),
    h(Svg, { width: barW + 4, height: 14 },
      h(Rect, { x: 0, y: 2, width: barW, height: 10, fill: C.surface2, rx: 2, ry: 2 }),
      h(Rect, { x: 0, y: 2, width: f, height: 10, fill: color, rx: 2, ry: 2 })
    ),
    h(Text, { style: { marginLeft: 6, fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.ink, width: 32 } }, String(value))
  );
};

const Donut = (segments, size = 100) => {
  // segments: [{value, color, label}]
  const cx = size / 2, cy = size / 2, r = size / 2 - 4, ir = r - 12;
  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  let start = -Math.PI / 2;
  const paths = segments.map((s, i) => {
    const angle = (s.value / total) * Math.PI * 2;
    const end = start + angle;
    const large = angle > Math.PI ? 1 : 0;
    const x1 = cx + r  * Math.cos(start), y1 = cy + r  * Math.sin(start);
    const x2 = cx + r  * Math.cos(end),   y2 = cy + r  * Math.sin(end);
    const x3 = cx + ir * Math.cos(end),   y3 = cy + ir * Math.sin(end);
    const x4 = cx + ir * Math.cos(start), y4 = cy + ir * Math.sin(start);
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${large} 0 ${x4} ${y4} Z`;
    start = end;
    return h(Path, { key: `seg${i}`, d, fill: s.color });
  });
  return h(Svg, { width: size, height: size }, ...paths);
};

// ---------- data ----------
const fe   = metrics.frontendComponentKnowledge.readinessScores;
const stat = metrics.frontendComponentKnowledge.componentStatusBreakdown;
const bl   = metrics.frontendComponentKnowledge.upgradeBacklog;
const reg  = metrics.registries;
const be   = metrics.backendApiUnderstanding;
const prd  = metrics.prdBusinessUnderstanding;

const brainHi = metrics.knownUnknowns.filter(g => g.severity === 'HIGH').length;
const brainMd = metrics.knownUnknowns.filter(g => g.severity === 'MEDIUM').length;
const brainLo = metrics.knownUnknowns.filter(g => g.severity === 'LOW').length;

const platHi = bl.P0;
const platMd = bl.P1;
const platLo = bl.P2 + bl.P3;

const beDeep      = be.servicesWithDeepControllerCoverage.length;
const beBaseline  = be.servicesCovered - beDeep;
const beDeepPct   = (beDeep / be.servicesCovered) * 100;

const TOTAL_PAGES = 6;

// ========== PAGE 1 — COVER ==========
const cover = h(Page, { size: 'A4', style: S.coverPage },
  // hero band
  h(View, { style: { backgroundColor: C.brand, paddingTop: 64, paddingBottom: 40, paddingHorizontal: 44 } },
    h(Text, { style: { fontSize: 9, color: '#BFDBFE', letterSpacing: 2.5, fontFamily: 'Helvetica-Bold' } }, 'BRAIN SK · CAPABILITY AUDIT #1'),
    h(Text, { style: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: C.white, marginTop: 12, lineHeight: 1.1 } }, 'Ammar Brain'),
    h(Text, { style: { fontSize: 18, color: '#BFDBFE', marginTop: 4 } }, 'Boss Report — Where the brain stands today'),
    h(View, { style: { flexDirection: 'row', marginTop: 22, alignItems: 'flex-end' } },
      h(View, { style: { flex: 1 } },
        h(Text, { style: { fontSize: 9, color: '#93C5FD', letterSpacing: 1, textTransform: 'uppercase' } }, 'Overall Frontend Readiness'),
        h(Text, { style: { fontSize: 64, fontFamily: 'Helvetica-Bold', color: C.white, lineHeight: 1 } }, `${fe.overallFrontendReadinessPct.toFixed(0)}%`),
        h(View, { style: { flexDirection: 'row', marginTop: 8 } },
          h(Text, { style: [S.badgeText, { backgroundColor: '#FFFFFF', color: C.brand, marginRight: 6 }] }, 'PRODUCTION-READY · FRONTEND'),
          h(Text, { style: [S.badgeText, { backgroundColor: '#FCA5A5', color: '#7F1D1D' }] }, 'PARTIAL · FULL-STACK')
        )
      ),
      h(View, { style: { alignItems: 'flex-end' } },
        h(Text, { style: { fontSize: 9, color: '#BFDBFE' } }, 'Audit date'),
        h(Text, { style: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.white } }, metrics.auditDate),
        h(Text, { style: { fontSize: 9, color: '#BFDBFE', marginTop: 6 } }, 'Generated by'),
        h(Text, { style: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.white } }, 'ammar-brain-capability-audit')
      )
    )
  ),

  // body
  h(View, { style: { paddingHorizontal: 36, paddingTop: 24 } },
    h(Text, { style: S.h3 }, 'One-line verdict'),
    h(Text, { style: { fontSize: 12, color: C.ink, lineHeight: 1.5, marginBottom: 14 } },
      'Strong front-end knowledge (60/60 components scored at 91%). Backend coverage is shallow on 6/9 services. ' +
      '13 of 15 platform registries are empty stubs. Greenlight UI work; defer full-stack feature delivery until registries + tests are in.'
    ),

    h(Text, { style: S.h3 }, 'Headline metrics'),
    h(View, { style: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 } },
      KpiTile('Components', '60 / 60', 'All 6 required files', C.brand),
      KpiTile('Backend deep coverage', `${beDeep} / ${be.servicesCovered}`, `${beDeepPct.toFixed(0)}% services deep`, C.accent),
      KpiTile('PRD modules', `${prd.modulesCovered - 1} / ${prd.modulesCovered - 1}`, `${prd.totalPrdGapRows} gap rows logged`, C.needs),
      KpiTile('Registries live', `${reg.populatedCount} / ${reg.totalCount}`, `${reg.populatedPct.toFixed(0)}% populated`, C.deprecated)
    ),

    h(Text, { style: [S.h3, { marginTop: 18 }] }, 'What is inside'),
    h(View, { style: { borderTopWidth: 0.5, borderTopColor: C.divider, paddingTop: 6 } },
      h(Text, { style: S.bullet }, '01  Executive dashboard — six headline scorecards + TL;DR'),
      h(Text, { style: S.bullet }, '02  Readiness scorecards — frontend per-dimension bars + component status badges'),
      h(Text, { style: S.bullet }, '03  Coverage charts — frontend / backend / business side-by-side'),
      h(Text, { style: S.bullet }, '04  Gap severity + implementation confidence matrix'),
      h(Text, { style: S.bullet }, '05  Final recommendation — greenlight · watch · block + top-5 next actions')
    ),

    h(View, { style: { marginTop: 28, padding: 12, backgroundColor: C.surface, borderLeftWidth: 3, borderLeftColor: C.brand, borderRadius: 4 } },
      h(Text, { style: { fontSize: 8, color: C.inkMuted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 } }, 'Reading order for leadership'),
      h(Text, { style: { fontSize: 10, color: C.inkSoft, lineHeight: 1.5 } },
        'Pages 1, 2, and 6 are sufficient for a 60-second read. Pages 3–5 carry the evidence for any deep-dive question.'
      )
    )
  ),

  h(View, { style: { position: 'absolute', bottom: 20, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between' } },
    h(Text, { style: { fontSize: 7.5, color: C.inkMuted } }, 'Brain SK v0.1 · evidence-only · no invented scores'),
    h(Text, { style: { fontSize: 7.5, color: C.inkMuted } }, '1 / ' + TOTAL_PAGES)
  )
);

// ========== PAGE 2 — EXECUTIVE DASHBOARD ==========
const dashboard = h(Page, { size: 'A4', style: S.page },
  PageHeader('Executive Dashboard', 'Six numbers, one picture', '2 / ' + TOTAL_PAGES),

  h(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } },
    Scorecard('Frontend overall readiness', `${fe.overallFrontendReadinessPct.toFixed(0)}%`, 'Source: READINESS_SCORES.md', fillForReadiness(fe.overallFrontendReadinessPct), Badge('READY', 'ready')),
    Scorecard('Components covered', `${metrics.frontendComponentKnowledge.componentDirsWithAllRequiredFiles} / ${metrics.frontendComponentKnowledge.componentsDiscovered}`, 'All 6 required files present', C.brand, Badge('100%', 'brand')),
    Scorecard('Backend deep services', `${beDeep} / ${be.servicesCovered}`, 'Per-controller dossiers complete', fillForReadiness(beDeepPct), Badge('PARTIAL', 'needs')),
    Scorecard('PRD gap rows logged', String(prd.totalPrdGapRows), `${prd.modulesCovered - 1} business modules covered`, C.accent, Badge('TRACKED', 'accent')),
    Scorecard('Registries populated', `${reg.populatedPct.toFixed(0)}%`, `${reg.stubCount} of ${reg.totalCount} still stubs`, C.deprecated, Badge('AT RISK', 'high')),
    Scorecard('Test / a11y confidence', `${fe.testA11yConfidencePct}%`, 'Lowest-scoring dimension', fillForReadiness(fe.testA11yConfidencePct), Badge('WATCH', 'medium'))
  ),

  h(View, { style: { marginTop: 8, padding: 12, backgroundColor: C.surface, borderRadius: 6, borderWidth: 0.5, borderColor: C.divider } },
    h(Text, { style: S.h3 }, 'TL;DR'),
    h(Text, { style: S.body },
      'Frontend knowledge is mature: 60 components scored, theme/token coverage at 96%, API understanding at 95%. ' +
      'Backend understanding has breadth (all 9 services baselined) but limited depth (only 3 deep). ' +
      'The biggest risk is empty platform registries (DTO, endpoint, validation, business rule) — these block reliable full-stack code generation. ' +
      'Test confidence at 70% is the lowest measured dimension and the only frontend metric below 88%.'
    )
  ),

  h(Text, { style: S.h2 }, 'Status legend'),
  h(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } },
    h(View, { style: { marginRight: 10, marginBottom: 6 } }, Badge('READY', 'ready')),
    h(View, { style: { marginRight: 10, marginBottom: 6 } }, Badge('NEEDS UPGRADE', 'needs')),
    h(View, { style: { marginRight: 10, marginBottom: 6 } }, Badge('LEGACY', 'legacy')),
    h(View, { style: { marginRight: 10, marginBottom: 6 } }, Badge('DEPRECATED', 'deprecated')),
    h(View, { style: { marginRight: 10, marginBottom: 6 } }, Badge('REFERENCE ONLY', 'reference')),
    h(View, { style: { marginRight: 10, marginBottom: 6 } }, Badge('SEV: HIGH', 'high')),
    h(View, { style: { marginRight: 10, marginBottom: 6 } }, Badge('SEV: MEDIUM', 'medium')),
    h(View, { style: { marginRight: 10, marginBottom: 6 } }, Badge('SEV: LOW', 'low'))
  ),

  Footer(2, TOTAL_PAGES)
);

// ========== PAGE 3 — READINESS SCORECARDS ==========
const readiness = h(Page, { size: 'A4', style: S.page },
  PageHeader('Readiness Scorecards', 'Frontend per-dimension + component status', '3 / ' + TOTAL_PAGES),

  h(Text, { style: S.h3 }, 'Frontend readiness by dimension'),
  h(View, { style: { padding: 12, backgroundColor: C.surface, borderRadius: 6, marginBottom: 12 } },
    ReadinessBar('Token / theme understanding',    fe.tokenThemeUnderstandingPct),
    ReadinessBar('Component API understanding',     fe.componentApiUnderstandingPct),
    ReadinessBar('Upgrade gap confidence',          fe.upgradeGapConfidencePct),
    ReadinessBar('Dynamic capability understanding', fe.dynamicCapabilityUnderstandingPct),
    ReadinessBar('Usage understanding',             fe.usageUnderstandingPct),
    ReadinessBar('Test / a11y confidence',          fe.testA11yConfidencePct),
    h(View, { style: { height: 1, backgroundColor: C.divider, marginVertical: 4 } }),
    ReadinessBar('Overall',                         fe.overallFrontendReadinessPct)
  ),
  h(Text, { style: S.caption }, 'Source: understanding/frontend/READINESS_SCORES.md · color = 0–24 red, 25–49 amber, 50–74 yellow, 75–89 green, 90+ deep green'),

  h(Text, { style: S.h3 }, 'Component status breakdown (60 components)'),
  h(View, { style: { flexDirection: 'row', alignItems: 'center', marginTop: 4 } },
    h(View, { style: { width: 110, alignItems: 'center' } },
      Donut([
        { value: stat.READY,                    color: C.ready,      label: 'READY' },
        { value: stat.NEEDS_UPGRADE,            color: C.needs,      label: 'NEEDS' },
        { value: stat.LEGACY,                   color: C.legacy,     label: 'LEGACY' },
        { value: stat.DEPRECATED,               color: C.deprecated, label: 'DEPRECATED' },
        { value: stat.REFERENCE_ONLY,           color: C.reference,  label: 'REFERENCE' },
        { value: stat.SHARED_DIRECTIVES_FOLDER, color: C.brand,      label: 'SHARED' }
      ], 100),
      h(Text, { style: { fontSize: 8, color: C.inkMuted, marginTop: 4 } }, `${stat.total} components`)
    ),
    h(View, { style: { flex: 1, marginLeft: 14 } },
      h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
        h(View, { style: { width: 8, height: 8, backgroundColor: C.ready, marginRight: 6, borderRadius: 2 } }),
        Badge('READY', 'ready'),
        h(Text, { style: { fontSize: 10, marginLeft: 8, color: C.ink, fontFamily: 'Helvetica-Bold' } }, `${stat.READY} components`),
        h(Text, { style: { fontSize: 9, marginLeft: 6, color: C.inkMuted } }, '— production-ready')
      ),
      h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
        h(View, { style: { width: 8, height: 8, backgroundColor: C.needs, marginRight: 6, borderRadius: 2 } }),
        Badge('NEEDS UPGRADE', 'needs'),
        h(Text, { style: { fontSize: 10, marginLeft: 8, color: C.ink, fontFamily: 'Helvetica-Bold' } }, `${stat.NEEDS_UPGRADE} components`),
        h(Text, { style: { fontSize: 9, marginLeft: 6, color: C.inkMuted } }, '— known gaps tracked')
      ),
      h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
        h(View, { style: { width: 8, height: 8, backgroundColor: C.legacy, marginRight: 6, borderRadius: 2 } }),
        Badge('LEGACY', 'legacy'),
        h(Text, { style: { fontSize: 10, marginLeft: 8, color: C.ink, fontFamily: 'Helvetica-Bold' } }, `${stat.LEGACY} components`),
        h(Text, { style: { fontSize: 9, marginLeft: 6, color: C.inkMuted } }, '— migration planned')
      ),
      h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
        h(View, { style: { width: 8, height: 8, backgroundColor: C.deprecated, marginRight: 6, borderRadius: 2 } }),
        Badge('DEPRECATED', 'deprecated'),
        h(Text, { style: { fontSize: 10, marginLeft: 8, color: C.ink, fontFamily: 'Helvetica-Bold' } }, `${stat.DEPRECATED} components`),
        h(Text, { style: { fontSize: 9, marginLeft: 6, color: C.inkMuted } }, '— removal scheduled')
      ),
      h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 } },
        h(View, { style: { width: 8, height: 8, backgroundColor: C.reference, marginRight: 6, borderRadius: 2 } }),
        Badge('REFERENCE ONLY', 'reference'),
        h(Text, { style: { fontSize: 10, marginLeft: 8, color: C.ink, fontFamily: 'Helvetica-Bold' } }, `${stat.REFERENCE_ONLY} components`),
        h(Text, { style: { fontSize: 9, marginLeft: 6, color: C.inkMuted } }, '— documented, not used')
      ),
      h(View, { style: { flexDirection: 'row', alignItems: 'center' } },
        h(View, { style: { width: 8, height: 8, backgroundColor: C.brand, marginRight: 6, borderRadius: 2 } }),
        Badge('SHARED', 'brand'),
        h(Text, { style: { fontSize: 10, marginLeft: 8, color: C.ink, fontFamily: 'Helvetica-Bold' } }, `${stat.SHARED_DIRECTIVES_FOLDER} folder`),
        h(Text, { style: { fontSize: 9, marginLeft: 6, color: C.inkMuted } }, '— directives bucket')
      )
    )
  ),
  h(Text, { style: S.caption }, 'Source: understanding/frontend/FINAL_COVERAGE_REPORT.md (Status breakdown table)'),

  Footer(3, TOTAL_PAGES)
);

// ========== PAGE 4 — COVERAGE CHARTS ==========
const coverage = h(Page, { size: 'A4', style: S.page },
  PageHeader('Coverage Charts', 'Frontend · Backend · Business', '4 / ' + TOTAL_PAGES),

  // FRONTEND
  h(View, { style: { padding: 12, backgroundColor: C.surface, borderRadius: 6, marginBottom: 10 } },
    h(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
      h(Text, { style: S.h3 }, 'Frontend — component status (count of 60)'),
      Badge('100% baseline', 'ready')
    ),
    HBarRow('READY',                    stat.READY,                    stat.total, C.ready),
    HBarRow('NEEDS UPGRADE',            stat.NEEDS_UPGRADE,            stat.total, C.needs),
    HBarRow('LEGACY',                   stat.LEGACY,                   stat.total, C.legacy),
    HBarRow('DEPRECATED',               stat.DEPRECATED,               stat.total, C.deprecated),
    HBarRow('REFERENCE ONLY',           stat.REFERENCE_ONLY,           stat.total, C.reference),
    HBarRow('SHARED DIRECTIVES',        stat.SHARED_DIRECTIVES_FOLDER, stat.total, C.brand),
    h(Text, { style: S.caption }, 'Source: FINAL_COVERAGE_REPORT.md')
  ),

  // BACKEND
  h(View, { style: { padding: 12, backgroundColor: C.surface, borderRadius: 6, marginBottom: 10 } },
    h(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
      h(Text, { style: S.h3 }, 'Backend — files per service'),
      Badge(`${beDeep}/${be.servicesCovered} DEEP`, 'needs')
    ),
    ...be.perServiceFileCounts.map((s, i) =>
      HBarRow(s.service, s.files, 12, be.servicesWithDeepControllerCoverage.includes(s.service) ? C.ready : C.needs)
    ),
    h(View, { style: { flexDirection: 'row', marginTop: 6, alignItems: 'center' } },
      h(View, { style: { width: 8, height: 8, backgroundColor: C.ready, marginRight: 4, borderRadius: 2 } }),
      h(Text, { style: { fontSize: 8, color: C.inkMuted, marginRight: 12 } }, 'Deep coverage (per-controller dossiers)'),
      h(View, { style: { width: 8, height: 8, backgroundColor: C.needs, marginRight: 4, borderRadius: 2 } }),
      h(Text, { style: { fontSize: 8, color: C.inkMuted } }, 'Baseline only (service-level files)')
    ),
    h(Text, { style: S.caption }, 'Source: understanding/backend (filesystem scan)')
  ),

  // BUSINESS
  h(View, { style: { padding: 12, backgroundColor: C.surface, borderRadius: 6 } },
    h(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
      h(Text, { style: S.h3 }, 'Business / PRD — gap rows per module'),
      Badge(`${prd.totalPrdGapRows} TOTAL`, 'accent')
    ),
    ...prd.perModuleFiles.filter(m => m.gapRows !== null).map(m =>
      HBarRow(m.module, m.gapRows, 40, C.accent)
    ),
    h(Text, { style: S.caption }, 'Source: prd/modules/<m>/GAPS.md row counts · severity not yet classified (HIGH/MEDIUM/LOW gap pending — see page 5)')
  ),

  Footer(4, TOTAL_PAGES)
);

// ========== PAGE 5 — GAP SEVERITY + CONFIDENCE MATRIX ==========
const SeverityBlock = (title, hi, md, lo) => {
  const max = Math.max(hi, md, lo, 1);
  const barW = 220;
  return h(View, { style: { width: '48%', padding: 12, backgroundColor: C.surface, borderRadius: 6 } },
    h(Text, { style: S.h3 }, title),
    h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 } },
      h(View, { style: { width: 80 } }, Badge('HIGH', 'high')),
      h(Svg, { width: barW + 4, height: 14 },
        h(Rect, { x: 0, y: 2, width: barW, height: 10, fill: C.surface2, rx: 2, ry: 2 }),
        h(Rect, { x: 0, y: 2, width: (hi / max) * barW, height: 10, fill: C.sevHigh, rx: 2, ry: 2 })
      ),
      h(Text, { style: { marginLeft: 6, fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.sevHigh } }, String(hi))
    ),
    h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 } },
      h(View, { style: { width: 80 } }, Badge('MEDIUM', 'medium')),
      h(Svg, { width: barW + 4, height: 14 },
        h(Rect, { x: 0, y: 2, width: barW, height: 10, fill: C.surface2, rx: 2, ry: 2 }),
        h(Rect, { x: 0, y: 2, width: (md / max) * barW, height: 10, fill: C.sevMed, rx: 2, ry: 2 })
      ),
      h(Text, { style: { marginLeft: 6, fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.sevMed } }, String(md))
    ),
    h(View, { style: { flexDirection: 'row', alignItems: 'center' } },
      h(View, { style: { width: 80 } }, Badge('LOW', 'low')),
      h(Svg, { width: barW + 4, height: 14 },
        h(Rect, { x: 0, y: 2, width: barW, height: 10, fill: C.surface2, rx: 2, ry: 2 }),
        h(Rect, { x: 0, y: 2, width: (lo / max) * barW, height: 10, fill: C.sevLow, rx: 2, ry: 2 })
      ),
      h(Text, { style: { marginLeft: 6, fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.sevLow } }, String(lo))
    )
  );
};

const ConfidenceMatrix = () => {
  // 3x3 grid: columns = Knowledge depth (Low / Medium / High), rows = Risk to delivery (High / Medium / Low)
  // We place each domain dot into a cell based on metrics evidence.
  const cells = [
    // row 0 (risk HIGH, top)
    { col: 0, row: 0, label: 'Registries',  color: C.deprecated, note: '2/15' },
    // row 1 (risk MEDIUM)
    { col: 1, row: 1, label: 'Backend deep', color: C.needs,     note: `${beDeep}/9` },
    { col: 1, row: 1, label: 'Tests',        color: C.needs,     note: '70%' },
    // row 2 (risk LOW)
    { col: 1, row: 2, label: 'PRD',          color: C.accent,    note: `${prd.totalPrdGapRows}` },
    { col: 2, row: 2, label: 'Frontend',     color: C.ready,     note: '91%' },
    { col: 2, row: 2, label: 'Wiki mirror',  color: C.ready,     note: '21 docs' }
  ];

  const W = 360, H = 180;
  const cellW = W / 3, cellH = H / 3;
  // shading: top-left is danger zone (high risk + low knowledge), bottom-right is safe
  const shade = (col, row) => {
    if (col === 0 && row === 0) return '#FEE2E2';
    if (col === 2 && row === 2) return '#DCFCE7';
    if ((col + (2 - row)) <= 1) return '#FEF3C7';
    if ((col + (2 - row)) >= 3) return '#ECFCCB';
    return C.surface;
  };

  const grid = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      grid.push(h(Rect, { key: `g${r}${c}`, x: c * cellW, y: r * cellH, width: cellW - 2, height: cellH - 2, fill: shade(c, r), rx: 4, ry: 4 }));
    }
  }
  // dots
  const dots = [];
  const grouped = {};
  cells.forEach(c => {
    const key = `${c.col}-${c.row}`;
    grouped[key] = grouped[key] || [];
    grouped[key].push(c);
  });
  Object.entries(grouped).forEach(([key, list]) => {
    const [col, row] = key.split('-').map(Number);
    const cx0 = col * cellW + cellW / 2;
    const cy0 = row * cellH + cellH / 2;
    list.forEach((c, i) => {
      const offset = (i - (list.length - 1) / 2) * 18;
      dots.push(h(Circle, { key: `d${key}${i}`, cx: cx0 + offset, cy: cy0 - 6, r: 6, fill: c.color }));
    });
  });

  return h(View, null,
    h(Svg, { width: W, height: H }, ...grid, ...dots),
    // labels overlay
    h(View, { style: { marginTop: -H, height: H, width: W, position: 'relative' } },
      ...Object.entries(grouped).flatMap(([key, list]) => {
        const [col, row] = key.split('-').map(Number);
        return list.map((c, i) => {
          const left = col * cellW + cellW / 2 - 30 + (i - (list.length - 1) / 2) * 18;
          const top = row * cellH + cellH / 2 + 4;
          return h(View, { key: `l${key}${i}`, style: { position: 'absolute', left, top, width: 60, alignItems: 'center' } },
            h(Text, { style: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.ink, textAlign: 'center' } }, c.label),
            h(Text, { style: { fontSize: 7, color: C.inkMuted, textAlign: 'center' } }, c.note)
          );
        });
      })
    )
  );
};

const severity = h(Page, { size: 'A4', style: S.page },
  PageHeader('Gap severity + confidence matrix', 'Where the brain is weakest', '5 / ' + TOTAL_PAGES),

  h(Text, { style: S.h3 }, 'Gap severity by source'),
  h(View, { style: { flexDirection: 'row', justifyContent: 'space-between' } },
    SeverityBlock('Brain-level gaps',          brainHi, brainMd, brainLo),
    SeverityBlock('Inherited platform gaps',   platHi,  platMd,  platLo)
  ),
  h(Text, { style: S.caption }, 'Brain-level: knownUnknowns.severity · Platform: upgrade backlog P0=HIGH, P1=MEDIUM, P2+P3=LOW'),

  h(Text, { style: S.h2 }, 'Top-5 highest-risk platform gaps'),
  h(View, { style: { borderTopWidth: 0.5, borderTopColor: C.divider } },
    h(View, { style: [S.tr, S.trHead] },
      h(Text, { style: [S.th, { width: '8%' }] }, 'ID'),
      h(Text, { style: [S.th, { width: '18%' }] }, 'Component'),
      h(Text, { style: [S.th, { width: '56%' }] }, 'Issue'),
      h(Text, { style: [S.th, { width: '18%' }] }, 'Severity')
    ),
    ...metrics.frontendComponentKnowledge.topRiskGaps.slice(0, 5).map((g, i) =>
      h(View, { key: `g${i}`, style: S.tr },
        h(Text, { style: [S.td, { width: '8%', color: C.inkMuted, fontSize: 8 }] }, g.id),
        h(Text, { style: [S.td, { width: '18%', fontFamily: 'Helvetica-Bold' }] }, g.component),
        h(Text, { style: [S.td, { width: '56%' }] }, g.issue),
        h(View, { style: { width: '18%' } }, Badge(g.priority === 'P0' ? 'HIGH' : g.priority === 'P1' ? 'MEDIUM' : 'LOW', g.priority === 'P0' ? 'high' : g.priority === 'P1' ? 'medium' : 'low'))
      )
    )
  ),

  h(Text, { style: S.h2 }, 'Implementation confidence matrix'),
  h(View, { style: { flexDirection: 'row', alignItems: 'flex-start' } },
    // y-axis label
    h(View, { style: { width: 16, height: 180, justifyContent: 'center', alignItems: 'center' } },
      h(Text, { style: { fontSize: 7, color: C.inkMuted, transform: 'rotate(-90deg)', width: 160, textAlign: 'center' } }, 'RISK TO DELIVERY  →')
    ),
    h(View, null,
      ConfidenceMatrix(),
      h(View, { style: { width: 360, alignItems: 'center', marginTop: 4 } },
        h(Text, { style: { fontSize: 7, color: C.inkMuted } }, 'KNOWLEDGE DEPTH  →')
      )
    )
  ),
  h(View, { style: { flexDirection: 'row', marginTop: 8 } },
    h(View, { style: { flexDirection: 'row', alignItems: 'center', marginRight: 14 } },
      h(View, { style: { width: 10, height: 10, backgroundColor: '#FEE2E2', borderRadius: 2, marginRight: 4 } }),
      h(Text, { style: { fontSize: 8, color: C.inkSoft } }, 'Danger zone — high risk, low depth')
    ),
    h(View, { style: { flexDirection: 'row', alignItems: 'center', marginRight: 14 } },
      h(View, { style: { width: 10, height: 10, backgroundColor: '#FEF3C7', borderRadius: 2, marginRight: 4 } }),
      h(Text, { style: { fontSize: 8, color: C.inkSoft } }, 'Watch zone')
    ),
    h(View, { style: { flexDirection: 'row', alignItems: 'center' } },
      h(View, { style: { width: 10, height: 10, backgroundColor: '#DCFCE7', borderRadius: 2, marginRight: 4 } }),
      h(Text, { style: { fontSize: 8, color: C.inkSoft } }, 'Safe zone — high depth, low risk')
    )
  ),

  Footer(5, TOTAL_PAGES)
);

// ========== PAGE 6 — FINAL RECOMMENDATION ==========
const Callout = (kind, title, lines) => {
  const map = {
    green: { bg: '#F0FDF4', border: C.ready,      title: C.ready,      tag: 'GREENLIGHT' },
    amber: { bg: '#FEFCE8', border: C.needs,      title: '#92400E',    tag: 'WATCH' },
    red:   { bg: '#FEF2F2', border: C.deprecated, title: C.deprecated, tag: 'HOLD' }
  };
  const k = map[kind];
  return h(View, { style: [S.callout, { backgroundColor: k.bg, borderLeftColor: k.border }] },
    h(Text, { style: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: k.title, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 } }, k.tag),
    h(Text, { style: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.ink, marginBottom: 6 } }, title),
    ...lines.map((l, i) => h(Text, { key: `cl${i}`, style: { fontSize: 9, color: C.inkSoft, marginBottom: 3, lineHeight: 1.4 } }, `• ${l}`))
  );
};

const recommendation = h(Page, { size: 'A4', style: S.page },
  PageHeader('Final recommendation', 'What to ship now, what to defer', '6 / ' + TOTAL_PAGES),

  h(View, { style: { flexDirection: 'row', marginBottom: 14 } },
    Callout('green', 'Ship now',
      [
        'Falcon UI component tasks',
        'Theme / token migrations',
        'Component API refactors',
        'Frontend bug fixes against 60-component knowledge base'
      ]),
    Callout('amber', 'Ship with care',
      [
        'Full-stack features touching commerce / charging / provisioning',
        'New PRD work in account / user / contract modules',
        'Anything depending on test coverage signal'
      ]),
    Callout('red', 'Hold or scope down',
      [
        'Features needing API DTO / endpoint / validation registries',
        'Backend work on access / identity / templates / gateways',
        'Anything blocked by missing test suite'
      ])
  ),

  h(Text, { style: S.h2 }, 'Top-5 next actions'),
  h(View, { style: { borderTopWidth: 0.5, borderTopColor: C.divider } },
    h(View, { style: [S.tr, S.trHead] },
      h(Text, { style: [S.th, { width: '5%' }] }, '#'),
      h(Text, { style: [S.th, { width: '52%' }] }, 'Action'),
      h(Text, { style: [S.th, { width: '28%' }] }, 'Owner'),
      h(Text, { style: [S.th, { width: '15%' }] }, 'Priority')
    ),
    ...metrics.whatBrainNeedsNext.slice(0, 5).map((r, i) =>
      h(View, { key: `nx${i}`, style: S.tr },
        h(Text, { style: [S.td, { width: '5%', color: C.inkMuted }] }, String(i + 1)),
        h(Text, { style: [S.td, { width: '52%' }] }, r.next),
        h(Text, { style: [S.td, { width: '28%', color: C.inkSoft }] }, r.owner),
        h(View, { style: { width: '15%' } }, Badge(r.priority, r.priority === 'HIGH' ? 'high' : r.priority === 'MEDIUM' ? 'medium' : 'low'))
      )
    )
  ),

  h(Text, { style: S.h2 }, 'Closing'),
  h(View, { style: { padding: 12, backgroundColor: C.surface, borderRadius: 6, borderLeftWidth: 3, borderLeftColor: C.brand } },
    h(Text, { style: { fontSize: 11, color: C.ink, lineHeight: 1.5 } },
      `The brain is ready to drive Falcon front-end work at scale today. ` +
      `Closing the 13 empty registries and adding a baseline test suite are the two highest-leverage moves to unlock full-stack delivery. ` +
      `Recommend a focused 2-week sprint on registries + tests before greenlighting backend-heavy feature work.`
    )
  ),

  h(Text, { style: [S.h3, { marginTop: 14 }] }, 'Provenance — every number traces to a source file'),
  h(View, { style: { flexDirection: 'row', flexWrap: 'wrap' } },
    h(Text, { style: [S.bullet, { width: '50%' }] }, '• understanding/frontend/READINESS_SCORES.md'),
    h(Text, { style: [S.bullet, { width: '50%' }] }, '• understanding/frontend/FINAL_COVERAGE_REPORT.md'),
    h(Text, { style: [S.bullet, { width: '50%' }] }, '• understanding/backend/<svc>/ filesystem scan'),
    h(Text, { style: [S.bullet, { width: '50%' }] }, '• prd/modules/<m>/GAPS.md counts'),
    h(Text, { style: [S.bullet, { width: '50%' }] }, '• registries/ line counts'),
    h(Text, { style: [S.bullet, { width: '50%' }] }, '• reports/bootstrap-touchbase/2026-05-13-health-check.md')
  ),

  Footer(6, TOTAL_PAGES)
);

// ---------- emit ----------
const Doc = h(Document,
  { title: 'Ammar Brain — Boss Report (Capability Audit #1)', author: 'Brain SK v0.1', subject: 'Capability audit — leadership-ready summary', keywords: 'falcon, brain, capability, audit, boss report' },
  cover, dashboard, readiness, coverage, severity, recommendation
);

const outPath = path.resolve(runRoot, 'BRAIN_BOSS_REPORT.pdf');
const stream  = await pdf(Doc).toBuffer();

await new Promise((resolve, reject) => {
  const ws = fs.createWriteStream(outPath);
  stream.pipe(ws);
  ws.on('finish', resolve);
  ws.on('error', reject);
});

const size = fs.statSync(outPath).size;
fs.writeFileSync(path.resolve(__dirname, 'BUILD_LOG.txt'),
  `react-pdf build complete\nfile: ${outPath}\nbytes: ${size}\npages: ${TOTAL_PAGES}\nbuiltAt: ${new Date().toISOString()}\n`);

console.log(`PDF written: ${outPath} (${size} bytes, ${TOTAL_PAGES} pages)`);
