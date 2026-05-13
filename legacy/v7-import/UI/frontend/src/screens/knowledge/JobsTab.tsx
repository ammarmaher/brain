/*** Jobs tab — table + drawer editor + new-job modal ***/
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Play, CheckCircle2, FileText } from 'lucide-react';
import api from '../../api/client';
import {
  createJob,
  deleteJob,
  runJob,
  updateJob,
} from '../shared/mutations';
import Table, { TableColumn } from '../../components/ui/Table';
import Drawer from '../../components/ui/Drawer';
import Modal from '../shared/Modal';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { Field, TextArea, TextInput, Button } from '../shared/Field';
import { useWsRefresh } from '../shared/useWsRefresh';
import cx from '../../lib/classnames';

interface JobRow {
  name: string;
  path: string;
  status: string;
  triggers?: string[];
  description?: string;
}

const DEFAULT_TEMPLATE = `*** Job: <slug> ***
*** <one-line description> ***
*** Triggered by: "<trigger phrase>" ***

# Job: <Title>

## Status

DEFERRED.

## Body

_(write the job spec here)_
`;

function statusSeverity(s: string) {
  const u = s.toUpperCase();
  if (u === 'DONE') return 'low' as const;
  if (u === 'DEFERRED') return 'medium' as const;
  if (u === 'BLOCKED' || u === 'ERROR') return 'high' as const;
  return 'info' as const;
}

export default function JobsTab() {
  const qc = useQueryClient();
  const jobsQ = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const r = await api.get<JobRow[]>('/api/admin/jobs');
      return r.data;
    },
  });

  useWsRefresh(['job.crud.changed', 'job.status.changed'], [['admin-jobs']]);

  const [editing, setEditing] = useState<JobRow | null>(null);
  const [editingBody, setEditingBody] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingStatus, setEditingStatus] = useState('');
  const [creating, setCreating] = useState(false);

  /*** Drawer body fetch (read full md) ***/
  const editFullQ = useQuery({
    queryKey: ['admin-job-full', editing?.name],
    queryFn: async () => {
      const r = await api.get<JobRow>(
        `/api/jobs/${encodeURIComponent(editing!.name)}`
      );
      return r.data;
    },
    enabled: !!editing,
  });

  function openEdit(j: JobRow) {
    setEditing(j);
    setEditingTitle(j.description || j.name);
    setEditingStatus(j.status);
    setEditingBody('');
  }

  const saveMut = useMutation({
    mutationFn: () =>
      updateJob(editing!.name, {
        title: editingTitle || undefined,
        statusLine: editingStatus || undefined,
        body: editingBody || undefined,
      }),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['admin-jobs'] });
      setEditing(null);
    },
  });

  const flipMut = useMutation({
    mutationFn: (slug: string) => updateJob(slug, { statusLine: 'DONE.' }),
    onMutate: async (slug) => {
      await qc.cancelQueries({ queryKey: ['admin-jobs'] });
      const prev = qc.getQueryData<JobRow[]>(['admin-jobs']);
      qc.setQueryData<JobRow[]>(['admin-jobs'], (old) =>
        old?.map((j) => (j.name === slug ? { ...j, status: 'DONE' } : j)) ?? old
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['admin-jobs'], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin-jobs'] }),
  });

  const runMut = useMutation({
    mutationFn: (name: string) => runJob(name, 'DONE'),
  });

  const delMut = useMutation({
    mutationFn: (slug: string) => deleteJob(slug),
    onSettled: () => qc.invalidateQueries({ queryKey: ['admin-jobs'] }),
  });

  const sorted = useMemo(() => {
    if (!jobsQ.data) return [];
    return [...jobsQ.data].sort((a, b) => {
      const order = (s: string) => {
        const u = s.toUpperCase();
        if (u === 'DEFERRED') return 0;
        if (u === 'DONE') return 2;
        return 1;
      };
      const oa = order(a.status);
      const ob = order(b.status);
      if (oa !== ob) return oa - ob;
      return a.name.localeCompare(b.name);
    });
  }, [jobsQ.data]);

  const columns: TableColumn<JobRow>[] = [
    {
      key: 'name',
      header: 'Filename',
      width: '1.4fr',
      sortable: true,
      render: (r) => <span className="font-mono text-xs">{r.name}</span>,
    },
    {
      key: 'description',
      header: 'Title',
      width: '2fr',
      render: (r) => <span className="truncate">{r.description || '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      sortable: true,
      render: (r) => <Badge severity={statusSeverity(r.status)}>{r.status}</Badge>,
    },
    {
      key: 'triggers',
      header: 'Triggers',
      width: '2fr',
      render: (r) => (
        <span className="truncate text-xs text-slate-400">
          {(r.triggers ?? []).slice(0, 2).join(' / ')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '220px',
      render: (r) => (
        <div className="grid grid-flow-col auto-cols-max gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            onClick={() => runMut.mutate(r.name)}
            title="Run now"
          >
            <Play size={12} /> Run
          </Button>
          {r.status.toUpperCase() === 'DEFERRED' && (
            <Button size="sm" onClick={() => flipMut.mutate(r.name)} title="Flip to DONE">
              <CheckCircle2 size={12} /> DONE
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-rows-[auto_1fr] gap-3 min-h-0">
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-200">Job catalog</h3>
        <Button variant="primary" size="sm" onClick={() => setCreating(true)}>
          <Plus size={14} /> New Job
        </Button>
      </div>

      {jobsQ.isLoading ? (
        <div className="grid place-items-center p-8">
          <Spinner />
        </div>
      ) : jobsQ.isError ? (
        <EmptyState title="Failed to load jobs" message="Could not reach /api/admin/jobs" />
      ) : (
        <Table
          columns={columns}
          rows={sorted}
          rowKey={(r) => r.name}
          onRowClick={openEdit}
          empty={<span className="text-slate-400 text-sm">No jobs yet</span>}
        />
      )}

      {/*** Edit drawer ***/}
      <Drawer open={!!editing} onClose={() => setEditing(null)} title={editing?.name} width="640px">
        {editFullQ.isLoading ? (
          <Spinner />
        ) : (
          <div className="grid gap-3">
            <Field label="Title">
              <TextInput
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
              />
            </Field>
            <Field label="Status line">
              <TextInput
                value={editingStatus}
                onChange={(e) => setEditingStatus(e.target.value)}
                placeholder="DEFERRED. / DONE. / BLOCKED."
              />
            </Field>
            <Field label="Body" hint="Replaces everything under '## Body' heading">
              <TextArea
                rows={18}
                value={editingBody}
                onChange={(e) => setEditingBody(e.target.value)}
                placeholder="(leave empty to keep current body)"
              />
            </Field>
            <div className="grid grid-flow-col auto-cols-max justify-end gap-2">
              <Button
                variant="danger"
                onClick={() => editing && delMut.mutate(editing.name)}
                disabled={delMut.isPending}
              >
                Archive
              </Button>
              <Button onClick={() => setEditing(null)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={() => saveMut.mutate()}
                disabled={saveMut.isPending}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <NewJobModal open={creating} onClose={() => setCreating(false)} onCreated={() => qc.invalidateQueries({ queryKey: ['admin-jobs'] })} />
    </div>
  );
}

function NewJobModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [statusLine, setStatusLine] = useState('DEFERRED.');
  const [body, setBody] = useState(DEFAULT_TEMPLATE);

  const createMut = useMutation({
    mutationFn: () => createJob({ slug, title, statusLine, body }),
    onSuccess: () => {
      onCreated();
      onClose();
      setSlug('');
      setTitle('');
      setStatusLine('DEFERRED.');
      setBody(DEFAULT_TEMPLATE);
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create job"
      width="640px"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!slug || !title || createMut.isPending}
            onClick={() => createMut.mutate()}
          >
            <FileText size={14} /> Create
          </Button>
        </>
      }
    >
      <div className="grid gap-3">
        <Field label="Slug" required>
          <TextInput
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-new-job"
          />
        </Field>
        <Field label="Title" required>
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job: human-readable title"
          />
        </Field>
        <Field label="Status line">
          <TextInput
            value={statusLine}
            onChange={(e) => setStatusLine(e.target.value)}
          />
        </Field>
        <Field label="Body">
          <TextArea
            rows={14}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </Field>
        {createMut.isError && (
          <p className={cx('text-xs text-falcon-red')}>
            {(createMut.error as Error).message}
          </p>
        )}
      </div>
    </Modal>
  );
}
