/*** Tests — Gherkin scenario catalog with filters, detail pane, full CRUD ***/
import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Archive, Download, Pencil, Plus, Save, Search, X } from 'lucide-react';
import api from '../api/client';
import {
  archiveTest,
  createTest,
  fetchModules,
  updateTest,
} from './shared/mutations';
import { downloadCsv } from './shared/markdown';
import { useWsRefresh } from './shared/useWsRefresh';
import Table, { TableColumn } from '../components/ui/Table';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import Modal from './shared/Modal';
import { Button, Select, TextInput } from './shared/Field';
import TestForm from './tests/TestForm';
import {
  PRIORITY_ORDER,
  TestDraft,
  TestRow,
  getCategory,
  getClaims,
  getGiven,
  getThen,
  getTracesTo,
  getWhen,
  priorityBadge,
} from './tests/types';
import cx from '../lib/classnames';

const PRIORITIES = ['P0', 'P1', 'P2', 'P3'];

export default function Tests() {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();

  const testsQ = useQuery({
    queryKey: ['admin-tests'],
    queryFn: async () => {
      const r = await api.get<TestRow[]>('/api/tests');
      return r.data;
    },
  });

  const modulesQ = useQuery({ queryKey: ['knowledge-modules'], queryFn: fetchModules });
  const moduleSlugs = useMemo(() => modulesQ.data?.map((m) => m.slug) ?? [], [modulesQ.data]);

  useWsRefresh(['test.crud.changed'], [['admin-tests']]);

  const moduleFilter = params.get('module') ?? '';
  const [priFilter, setPriFilter] = useState<Set<string>>(new Set());
  const [catFilter, setCatFilter] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  function setModuleFilter(m: string) {
    const p = new URLSearchParams(params);
    if (m) p.set('module', m);
    else p.delete('module');
    setParams(p, { replace: true });
  }

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    for (const t of testsQ.data ?? []) {
      const c = getCategory(t);
      if (c) set.add(c);
    }
    return Array.from(set).sort();
  }, [testsQ.data]);

  const filtered = useMemo(() => {
    if (!testsQ.data) return [];
    let rows = testsQ.data;
    if (moduleFilter) rows = rows.filter((t) => t.module === moduleFilter);
    if (priFilter.size > 0)
      rows = rows.filter((t) => priFilter.has((t.priority ?? '').toUpperCase()));
    if (catFilter.size > 0) rows = rows.filter((t) => catFilter.has(getCategory(t)));
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((t) =>
        [t.tcId, t.title, getGiven(t), getWhen(t), getThen(t), t.module]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    }
    return [...rows].sort((a, b) => {
      const pa = PRIORITY_ORDER[(a.priority ?? '').toUpperCase()] ?? 99;
      const pb = PRIORITY_ORDER[(b.priority ?? '').toUpperCase()] ?? 99;
      if (pa !== pb) return pa - pb;
      return a.tcId.localeCompare(b.tcId);
    });
  }, [testsQ.data, moduleFilter, priFilter, catFilter, search]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<TestDraft | null>(null);
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<TestDraft>({
    tcId: '',
    module: '',
    title: '',
    category: '',
    priority: 'P2',
    given: '',
    when: '',
    then: '',
    tracesTo: [],
    claims: [],
  });

  const selected = filtered.find((t) => t.tcId === selectedId) ?? null;

  useEffect(() => {
    if (!selected) {
      setDraft(null);
      setEditing(false);
      return;
    }
    setDraft({
      tcId: selected.tcId,
      module: selected.module ?? '',
      title: selected.title ?? '',
      category: getCategory(selected),
      priority: (selected.priority ?? 'P2').toUpperCase(),
      given: getGiven(selected),
      when: getWhen(selected),
      then: getThen(selected),
      tracesTo: getTracesTo(selected),
      claims: getClaims(selected),
    });
  }, [selected?.tcId]);

  const updateMut = useMutation({
    mutationFn: () => {
      if (!draft || !draft.module) throw new Error('module required');
      return updateTest(draft.module, draft.tcId, {
        tcId: draft.tcId,
        title: draft.title,
        category: draft.category,
        priority: draft.priority,
        given: draft.given,
        when: draft.when,
        then: draft.then,
        tracesTo: draft.tracesTo,
        claims: draft.claims,
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['admin-tests'] });
      setEditing(false);
    },
  });

  const archiveMut = useMutation({
    mutationFn: () => {
      if (!selected?.module) throw new Error('module required');
      return archiveTest(selected.module, selected.tcId);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin-tests'] }),
  });

  const createMut = useMutation({
    mutationFn: () => {
      if (!newDraft.module) throw new Error('module required');
      return createTest(newDraft.module, {
        tcId: newDraft.tcId,
        title: newDraft.title,
        category: newDraft.category,
        priority: newDraft.priority,
        given: newDraft.given,
        when: newDraft.when,
        then: newDraft.then,
        tracesTo: newDraft.tracesTo,
        claims: newDraft.claims,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-tests'] });
      setCreating(false);
      setNewDraft({
        tcId: '',
        module: '',
        title: '',
        category: '',
        priority: 'P2',
        given: '',
        when: '',
        then: '',
        tracesTo: [],
        claims: [],
      });
    },
  });

  const columns: TableColumn<TestRow>[] = [
    {
      key: 'tcId',
      header: 'TC ID',
      width: '140px',
      sortable: true,
      render: (r) => <span className="font-mono text-xs">{r.tcId}</span>,
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
      render: (r) => (
        <Badge severity="info">{getCategory(r) || '—'}</Badge>
      ),
      accessor: (r) => getCategory(r),
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '90px',
      sortable: true,
      accessor: (r) => PRIORITY_ORDER[(r.priority ?? '').toUpperCase()] ?? 99,
      render: (r) => (
        <Badge severity={priorityBadge(r.priority)}>{r.priority ?? '—'}</Badge>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      width: '2.5fr',
      render: (r) => <span className="truncate text-sm">{r.title ?? '—'}</span>,
    },
  ];

  function exportCsv() {
    const head = [
      'tcId',
      'module',
      'category',
      'priority',
      'title',
      'given',
      'when',
      'then',
      'tracesTo',
      'claims',
    ];
    const rows: (string | number | undefined)[][] = [head];
    for (const t of filtered) {
      rows.push([
        t.tcId,
        t.module,
        getCategory(t),
        t.priority,
        t.title,
        getGiven(t),
        getWhen(t),
        getThen(t),
        getTracesTo(t).join('|'),
        getClaims(t).join('|'),
      ]);
    }
    downloadCsv(rows, `tests-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  const priToggle = (p: string) =>
    setPriFilter((prev) => {
      const n = new Set(prev);
      if (n.has(p)) n.delete(p);
      else n.add(p);
      return n;
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 h-full min-h-0">
      <section className="grid grid-rows-[auto_auto_1fr] gap-3 min-h-0">
        <header className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
          <h2 className="text-base font-semibold text-slate-100">
            Tests
            <span className="text-xs font-normal text-slate-500 ml-2">
              ({filtered.length} of {testsQ.data?.length ?? 0})
            </span>
          </h2>
          <Button onClick={exportCsv} disabled={filtered.length === 0}>
            <Download size={14} /> Export CSV
          </Button>
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={14} /> Add Scenario
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2 items-end">
          <div className="grid gap-2 grid-cols-[1fr_auto]">
            <div className="grid grid-cols-[16px_1fr] gap-1 items-center bg-brain-bg-panel border border-brain-bg-border rounded px-2">
              <Search size={14} className="text-slate-400" />
              <TextInput
                className="bg-transparent border-0 px-0"
                placeholder="Search title / Gherkin / id"
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
          </div>
          <div className="grid grid-flow-col auto-cols-max gap-1">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => priToggle(p)}
                className={cx(
                  'text-xs px-2 py-1 rounded border',
                  priFilter.has(p)
                    ? 'bg-falcon-blue/20 border-falcon-blue text-falcon-blue'
                    : 'border-brain-bg-border text-slate-300 hover:bg-brain-bg-panel'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="grid grid-flow-col auto-cols-max gap-1 max-w-full overflow-auto">
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
          {testsQ.isLoading ? (
            <div className="grid place-items-center p-8">
              <Spinner />
            </div>
          ) : testsQ.isError ? (
            <EmptyState title="Failed to load tests" message="Could not reach /api/tests" />
          ) : (
            <Table
              columns={columns}
              rows={filtered}
              rowKey={(r) => r.tcId}
              onRowClick={(r) => setSelectedId(r.tcId)}
              empty={<span className="text-slate-400 text-sm">No tests match filters</span>}
            />
          )}
        </div>
      </section>

      {/*** Right detail pane ***/}
      <aside className="panel grid grid-rows-[auto_1fr_auto] overflow-hidden min-h-0">
        {!selected ? (
          <div className="row-span-3">
            <EmptyState title="Pick a scenario" message="Click a row to view Gherkin." />
          </div>
        ) : (
          <>
            <header className="grid grid-cols-[1fr_auto] items-center gap-2 px-4 py-3 border-b border-brain-bg-border">
              <div className="grid">
                <span className="text-xs font-mono text-slate-500">{selected.tcId}</span>
                <h3 className="text-sm font-semibold truncate">
                  {selected.title || selected.tcId}
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
                  <div className="grid grid-flow-col auto-cols-max gap-2">
                    <Badge severity={priorityBadge(selected.priority)}>
                      {selected.priority ?? '—'}
                    </Badge>
                    <Badge severity="info">{getCategory(selected) || '—'}</Badge>
                    <Badge severity="low">{selected.module ?? '—'}</Badge>
                  </div>

                  <GherkinBlock label="Given" text={getGiven(selected)} />
                  <GherkinBlock label="When" text={getWhen(selected)} />
                  <GherkinBlock label="Then" text={getThen(selected)} />

                  <DetailRow label="Traces to" stack>
                    {getTracesTo(selected).length === 0 ? (
                      <span className="text-xs text-slate-500">—</span>
                    ) : (
                      <div className="grid grid-flow-col auto-cols-max gap-1">
                        {getTracesTo(selected).map((t) => (
                          <Badge key={t} severity="low">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </DetailRow>

                  <DetailRow label="Claims" stack>
                    {getClaims(selected).length === 0 ? (
                      <span className="text-xs text-slate-500">—</span>
                    ) : (
                      <div className="grid grid-flow-col auto-cols-max gap-1">
                        {getClaims(selected).map((c) => (
                          <Badge key={c} severity="medium">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </DetailRow>
                </>
              )}
              {editing && draft && (
                <TestForm
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

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Add scenario"
        width="720px"
        footer={
          <>
            <Button onClick={() => setCreating(false)}>Cancel</Button>
            <Button
              variant="primary"
              disabled={
                !newDraft.tcId ||
                !newDraft.module ||
                !newDraft.title ||
                !newDraft.category ||
                createMut.isPending
              }
              onClick={() => createMut.mutate()}
            >
              <Plus size={14} /> Create
            </Button>
          </>
        }
      >
        <TestForm value={newDraft} onChange={setNewDraft} modules={moduleSlugs} />
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

function GherkinBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="grid gap-1">
      <span className="text-xs uppercase tracking-wide text-falcon-blue">{label}</span>
      <pre className="panel p-3 text-xs font-mono whitespace-pre-wrap leading-snug">
        {text || <span className="text-slate-500">—</span>}
      </pre>
    </div>
  );
}
