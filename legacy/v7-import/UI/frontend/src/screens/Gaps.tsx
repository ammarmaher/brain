/*** Gaps — consolidated catalog with filters, detail pane, full CRUD ***/
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Archive, Download, Pencil, Plus, Save, Search, X } from 'lucide-react';
import api from '../api/client';
import {
  archiveGap,
  createGap,
  fetchModules,
  updateGap,
} from './shared/mutations';
import { downloadCsv } from './shared/markdown';
import { useWsRefresh } from './shared/useWsRefresh';
import Table, { TableColumn } from '../components/ui/Table';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import Modal from './shared/Modal';
import GapForm from './gaps/GapForm';
import { Button, Select, TextInput } from './shared/Field';
import {
  GapDraft,
  GapRow,
  SEVERITY_ORDER,
  gapCategory,
  gapEvidence,
  gapStatus,
  gapSuggestedFix,
  gapTracesTo,
} from './gaps/types';
import type { Severity } from '../api/types';
import cx from '../lib/classnames';

function severityBadge(s?: string): Severity {
  const v = (s ?? '').toLowerCase();
  if (v === 'critical' || v === 'high' || v === 'medium' || v === 'low' || v === 'info')
    return v as Severity;
  return 'info';
}

const ALL_SEVERITIES = ['critical', 'high', 'medium', 'low', 'info'];
const STATUS_FILTERS = ['active', 'archived', 'all'] as const;

export default function Gaps() {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();

  const gapsQ = useQuery({
    queryKey: ['gaps'],
    queryFn: async () => {
      const r = await api.get<GapRow[]>('/api/gaps');
      return r.data;
    },
  });

  const modulesQ = useQuery({
    queryKey: ['knowledge-modules'],
    queryFn: fetchModules,
  });
  const moduleSlugs = useMemo(() => modulesQ.data?.map((m) => m.slug) ?? [], [modulesQ.data]);

  useWsRefresh(['gap.added', 'gap.updated', 'gap.archived'], [['gaps']]);

  /*** Filters (some sourced from query string) ***/
  const moduleFilter = params.get('module') ?? '';
  const [sevFilter, setSevFilter] = useState<Set<string>>(new Set());
  const [catFilter, setCatFilter] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('active');
  const [search, setSearch] = useState('');

  function setModuleFilter(m: string) {
    const p = new URLSearchParams(params);
    if (m) p.set('module', m);
    else p.delete('module');
    setParams(p, { replace: true });
  }

  /*** Selection + edit state ***/
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GapDraft | null>(null);
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<GapDraft>({
    id: '',
    severity: 'medium',
    status: 'open',
    module: '',
    description: '',
    tracesTo: [],
  });

  /*** All categories observed (derived) ***/
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    for (const g of gapsQ.data ?? []) {
      const c = gapCategory(g);
      if (c) set.add(c);
    }
    return Array.from(set).sort();
  }, [gapsQ.data]);

  const filtered = useMemo(() => {
    if (!gapsQ.data) return [];
    let rows = gapsQ.data;
    if (moduleFilter) rows = rows.filter((g) => g.module === moduleFilter);
    if (sevFilter.size > 0)
      rows = rows.filter((g) => sevFilter.has((g.severity ?? '').toLowerCase()));
    if (catFilter.size > 0) rows = rows.filter((g) => catFilter.has(gapCategory(g)));
    if (statusFilter !== 'all') {
      rows = rows.filter((g) => {
        const s = gapStatus(g);
        if (statusFilter === 'archived') return s === 'archived';
        return s !== 'archived';
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((g) =>
        [g.id, g.title, g.description, gapSuggestedFix(g), g.module]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return [...rows].sort((a, b) => {
      const sa = SEVERITY_ORDER[(a.severity ?? 'info').toLowerCase()] ?? 99;
      const sb = SEVERITY_ORDER[(b.severity ?? 'info').toLowerCase()] ?? 99;
      if (sa !== sb) return sa - sb;
      return a.id.localeCompare(b.id);
    });
  }, [gapsQ.data, moduleFilter, sevFilter, catFilter, statusFilter, search]);

  const selected = filtered.find((g) => g.id === selectedId) ?? null;

  /*** Initialise draft when selection changes / edit opens ***/
  useEffect(() => {
    if (!selected) {
      setDraft(null);
      setEditing(false);
      return;
    }
    setDraft({
      id: selected.id,
      module: selected.module,
      severity: selected.severity,
      category: gapCategory(selected),
      title: selected.title,
      description: selected.description,
      evidence: gapEvidence(selected),
      suggestedFix: gapSuggestedFix(selected),
      tracesTo: gapTracesTo(selected),
      status: gapStatus(selected),
    });
  }, [selected?.id]);

  const updateMut = useMutation({
    mutationFn: () => {
      if (!draft || !selected?.module) throw new Error('missing context');
      return updateGap(selected.module, selected.id, draft);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['gaps'] });
      setEditing(false);
    },
  });

  const archiveMut = useMutation({
    mutationFn: () => {
      if (!selected?.module) throw new Error('missing module');
      return archiveGap(selected.module, selected.id);
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['gaps'] });
      const prev = qc.getQueryData<GapRow[]>(['gaps']);
      qc.setQueryData<GapRow[]>(['gaps'], (old) =>
        old?.map((g) =>
          g.id === selected?.id
            ? { ...g, extra: { ...(g.extra ?? {}), status: 'archived' } }
            : g
        ) ?? old
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['gaps'], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['gaps'] }),
  });

  const createMut = useMutation({
    mutationFn: () => {
      if (!newDraft.module) throw new Error('module required');
      return createGap(newDraft.module, newDraft);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gaps'] });
      setCreating(false);
      setNewDraft({
        id: '',
        severity: 'medium',
        status: 'open',
        module: '',
        description: '',
        tracesTo: [],
      });
    },
  });

  const columns: TableColumn<GapRow>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '140px',
      sortable: true,
      render: (r) => <span className="font-mono text-xs">{r.id}</span>,
    },
    {
      key: 'severity',
      header: 'Sev',
      width: '90px',
      sortable: true,
      accessor: (r) => SEVERITY_ORDER[(r.severity ?? 'info').toLowerCase()] ?? 99,
      render: (r) => <Badge severity={severityBadge(r.severity)}>{r.severity ?? '—'}</Badge>,
    },
    {
      key: 'module',
      header: 'Module',
      width: '160px',
      sortable: true,
      render: (r) => <span className="text-xs font-mono text-slate-300">{r.module ?? '—'}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      width: '140px',
      render: (r) => <span className="text-xs text-slate-400">{gapCategory(r) || '—'}</span>,
      accessor: (r) => gapCategory(r),
    },
    {
      key: 'description',
      header: 'Description',
      width: '2fr',
      render: (r) => (
        <span className="truncate text-sm">
          {r.description || r.title || '—'}
        </span>
      ),
    },
    {
      key: 'fix',
      header: 'Suggested fix',
      width: '1.5fr',
      render: (r) => (
        <span className="truncate text-xs text-slate-400">{gapSuggestedFix(r) || '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '90px',
      sortable: true,
      accessor: (r) => gapStatus(r),
      render: (r) => {
        const s = gapStatus(r);
        return (
          <span
            className={cx(
              'text-xs px-1.5 py-0.5 rounded border',
              s === 'archived'
                ? 'border-slate-500/40 text-slate-400'
                : 'border-falcon-green/40 text-falcon-green'
            )}
          >
            {s}
          </span>
        );
      },
    },
  ];

  function exportCsv() {
    const head = [
      'id',
      'severity',
      'module',
      'category',
      'description',
      'suggestedFix',
      'status',
      'tracesTo',
    ];
    const rows: (string | number | undefined)[][] = [head];
    for (const g of filtered) {
      rows.push([
        g.id,
        g.severity,
        g.module,
        gapCategory(g),
        g.description ?? g.title ?? '',
        gapSuggestedFix(g),
        gapStatus(g),
        gapTracesTo(g).join('|'),
      ]);
    }
    downloadCsv(rows, `gaps-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  const sevToggle = (s: string) =>
    setSevFilter((prev) => {
      const n = new Set(prev);
      if (n.has(s)) n.delete(s);
      else n.add(s);
      return n;
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 h-full min-h-0">
      {/*** Left column ***/}
      <section className="grid grid-rows-[auto_auto_1fr] gap-3 min-h-0">
        <header className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
          <h2 className="text-base font-semibold text-slate-100">
            Gaps
            <span className="text-xs font-normal text-slate-500 ml-2">
              ({filtered.length} of {gapsQ.data?.length ?? 0})
            </span>
          </h2>
          <Button onClick={exportCsv} disabled={filtered.length === 0}>
            <Download size={14} /> Export CSV
          </Button>
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={14} /> Add Gap
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
          <div className="grid gap-2 grid-cols-[1fr_auto_auto]">
            <div className="grid grid-cols-[16px_1fr] gap-1 items-center bg-brain-bg-panel border border-brain-bg-border rounded px-2">
              <Search size={14} className="text-slate-400" />
              <TextInput
                className="bg-transparent border-0 px-0"
                placeholder="Search description / fix / id"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-44"
            >
              <option value="">All modules</option>
              {moduleSlugs.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number])}
              className="w-32"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-flow-col auto-cols-max gap-1 items-center">
            {ALL_SEVERITIES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sevToggle(s)}
                className={cx(
                  'text-xs px-2 py-1 rounded border',
                  sevFilter.has(s)
                    ? 'bg-falcon-blue/20 border-falcon-blue text-falcon-blue'
                    : 'border-brain-bg-border text-slate-300 hover:bg-brain-bg-panel'
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="grid grid-flow-col auto-cols-max gap-1 items-center max-w-full overflow-auto">
            {allCategories.slice(0, 8).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() =>
                  setCatFilter((prev) => {
                    const n = new Set(prev);
                    if (n.has(c)) n.delete(c);
                    else n.add(c);
                    return n;
                  })
                }
                className={cx(
                  'text-xs px-2 py-1 rounded border',
                  catFilter.has(c)
                    ? 'bg-falcon-blue/20 border-falcon-blue text-falcon-blue'
                    : 'border-brain-bg-border text-slate-300 hover:bg-brain-bg-panel'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 overflow-hidden">
          {gapsQ.isLoading ? (
            <div className="grid place-items-center p-8">
              <Spinner />
            </div>
          ) : gapsQ.isError ? (
            <EmptyState title="Failed to load gaps" message="Could not reach /api/gaps" />
          ) : (
            <Table
              columns={columns}
              rows={filtered}
              rowKey={(r) => r.id}
              onRowClick={(r) => setSelectedId(r.id)}
              empty={<span className="text-slate-400 text-sm">No gaps match filters</span>}
            />
          )}
        </div>
      </section>

      {/*** Right detail pane ***/}
      <aside className="panel grid grid-rows-[auto_1fr_auto] overflow-hidden min-h-0">
        {!selected ? (
          <div className="row-span-3">
            <EmptyState title="Pick a gap" message="Click a row to view details on the right." />
          </div>
        ) : (
          <>
            <header className="grid grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 border-b border-brain-bg-border">
              <div className="grid">
                <span className="text-xs font-mono text-slate-500">{selected.id}</span>
                <h3 className="text-sm font-semibold truncate">
                  {selected.title || selected.description || selected.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="text-slate-400 hover:text-slate-200"
                aria-label="Close detail"
              >
                <X size={16} />
              </button>
            </header>

            <div className="p-4 overflow-auto grid gap-3">
              {!editing && (
                <>
                  <DetailRow label="Severity">
                    <Badge severity={severityBadge(selected.severity)}>
                      {selected.severity ?? '—'}
                    </Badge>
                  </DetailRow>
                  <DetailRow label="Module">
                    <span className="font-mono text-xs">{selected.module ?? '—'}</span>
                  </DetailRow>
                  <DetailRow label="Category">{gapCategory(selected) || '—'}</DetailRow>
                  <DetailRow label="Status">{gapStatus(selected)}</DetailRow>
                  <DetailRow label="Description" stack>
                    <p className="text-sm whitespace-pre-wrap">
                      {selected.description ?? '—'}
                    </p>
                  </DetailRow>
                  <DetailRow label="Evidence" stack>
                    <p className="text-xs whitespace-pre-wrap text-slate-400">
                      {gapEvidence(selected) || '—'}
                    </p>
                  </DetailRow>
                  <DetailRow label="Suggested fix" stack>
                    <p className="text-sm whitespace-pre-wrap">
                      {gapSuggestedFix(selected) || '—'}
                    </p>
                  </DetailRow>
                  <DetailRow label="Traces to" stack>
                    <div className="grid grid-flow-col auto-cols-max gap-1">
                      {gapTracesTo(selected).length === 0 ? (
                        <span className="text-xs text-slate-500">—</span>
                      ) : (
                        gapTracesTo(selected).map((t) => (
                          <Badge key={t} severity="low">
                            {t}
                          </Badge>
                        ))
                      )}
                    </div>
                  </DetailRow>
                </>
              )}
              {editing && draft && (
                <GapForm
                  value={draft}
                  onChange={setDraft}
                  modules={moduleSlugs}
                  lockId
                  lockModule
                />
              )}
            </div>

            <footer className="grid grid-flow-col auto-cols-max justify-end gap-2 px-4 py-3 border-t border-brain-bg-border">
              {!editing ? (
                <>
                  <Button variant="danger" onClick={() => archiveMut.mutate()}>
                    <Archive size={14} /> Archive
                  </Button>
                  <Button variant="primary" onClick={() => setEditing(true)}>
                    <Pencil size={14} /> Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setEditing(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    disabled={updateMut.isPending}
                    onClick={() => updateMut.mutate()}
                  >
                    <Save size={14} /> Save
                  </Button>
                </>
              )}
            </footer>
          </>
        )}
      </aside>

      {/*** Add modal ***/}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Add gap"
        width="720px"
        footer={
          <>
            <Button onClick={() => setCreating(false)}>Cancel</Button>
            <Button
              variant="primary"
              disabled={!newDraft.id || !newDraft.module || createMut.isPending}
              onClick={() => createMut.mutate()}
            >
              <Plus size={14} /> Create
            </Button>
          </>
        }
      >
        <GapForm value={newDraft} onChange={setNewDraft} modules={moduleSlugs} />
        {createMut.isError && (
          <p className="text-xs text-falcon-red mt-3">
            {(createMut.error as Error).message}
          </p>
        )}
      </Modal>
    </div>
  );
}

function DetailRow({
  label,
  stack,
  children,
}: {
  label: string;
  stack?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={stack ? 'grid gap-1' : 'grid grid-cols-[120px_1fr] items-center gap-2'}>
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      <div>{children}</div>
    </div>
  );
}
