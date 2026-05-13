/*** MindsetsTab - reads /api/admin/mindsets, edit/add through MindsetEditor ***/

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus } from 'lucide-react';
import api from '../../api/client';
import Card from '../../components/ui/Card';
import Table, { type TableColumn } from '../../components/ui/Table';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ScreenError from '../dashboard/ScreenError';
import MindsetEditor, { type MindsetSubmit } from './MindsetEditor';
import { type MindsetBlock, type MindsetsBlock } from './skillsTypes';

interface MindsetRow {
  name: string;
  voice: string;
  speed: number;
  volumeMultiplier: number;
  phrasesPreview: string;
  block: MindsetBlock;
}

async function fetchMindsets(): Promise<MindsetsBlock> {
  const r = await api.get<MindsetsBlock>('/api/admin/mindsets');
  return r.data ?? {};
}

function rowsFrom(block: MindsetsBlock | undefined): MindsetRow[] {
  if (!block) return [];
  return Object.entries(block)
    .map(([name, b]) => {
      const phrases = b.phrases ?? {};
      const preview = ['running', 'working', 'complete']
        .map((k) => (phrases[k] ? `${k}: ${phrases[k]}` : null))
        .filter(Boolean)
        .join(' | ');
      return {
        name,
        voice: b.voice ?? '-',
        speed: Number(b.speed ?? 1),
        volumeMultiplier: Number(b.volumeMultiplier ?? 1),
        phrasesPreview: preview,
        block: b,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default function MindsetsTab() {
  const qc = useQueryClient();
  const mindsetsQ = useQuery({
    queryKey: ['mindsets'],
    queryFn: fetchMindsets,
    retry: false,
  });

  const [editor, setEditor] = useState<{ open: boolean; row?: MindsetRow; isNew: boolean }>({
    open: false,
    isNew: false,
  });

  const update = useMutation({
    mutationFn: async ({ name, block }: MindsetSubmit) => {
      const r = await api.put(`/api/admin/mindsets/${encodeURIComponent(name)}`, block);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mindsets'] });
      setEditor({ open: false, isNew: false });
    },
  });

  const create = useMutation({
    mutationFn: async ({ name, block }: MindsetSubmit) => {
      const r = await api.post('/api/admin/mindsets', { name, ...block });
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['mindsets'] });
      setEditor({ open: false, isNew: false });
    },
  });

  const rows = useMemo(() => rowsFrom(mindsetsQ.data), [mindsetsQ.data]);

  const columns: TableColumn<MindsetRow>[] = [
    { key: 'name', header: 'Name', sortable: true, width: '1fr' },
    { key: 'voice', header: 'Voice', width: '1fr' },
    {
      key: 'speed',
      header: 'Speed',
      width: '80px',
      render: (r) => <span className="font-mono text-xs">{r.speed}</span>,
    },
    {
      key: 'volumeMultiplier',
      header: 'Vol',
      width: '80px',
      render: (r) => <span className="font-mono text-xs">{r.volumeMultiplier}</span>,
    },
    {
      key: 'phrasesPreview',
      header: 'Phrases',
      width: '2fr',
      render: (r) => (
        <span className="text-xs text-slate-400 truncate" title={r.phrasesPreview}>
          {r.phrasesPreview || '-'}
        </span>
      ),
    },
    {
      key: 'edit',
      header: '',
      width: '60px',
      render: (r) => (
        <button
          type="button"
          aria-label={`Edit ${r.name}`}
          onClick={(e) => {
            e.stopPropagation();
            setEditor({ open: true, row: r, isNew: false });
          }}
          className="grid place-items-center w-7 h-7 rounded border border-brain-bg-border text-slate-300 hover:bg-brain-bg-panel"
        >
          <Pencil size={12} />
        </button>
      ),
    },
  ];

  if (mindsetsQ.error) {
    return (
      <ScreenError
        title="Cannot load mindsets"
        error={mindsetsQ.error}
        onRetry={() => qc.invalidateQueries({ queryKey: ['mindsets'] })}
      />
    );
  }

  return (
    <div className="grid gap-3">
      <Card
        title={`Mindsets (${rows.length})`}
        action={
          <button
            type="button"
            onClick={() => setEditor({ open: true, isNew: true })}
            className="grid grid-flow-col auto-cols-max items-center gap-2 px-3 py-1.5 text-xs rounded border border-falcon-blue/40 bg-falcon-blue/15 text-falcon-blue hover:bg-falcon-blue/25"
          >
            <Plus size={12} /> Add Mindset
          </button>
        }
      >
        {mindsetsQ.isLoading ? (
          <div className="grid place-items-center p-8">
            <Spinner />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No mindsets configured"
            message="Add ChatGPT, Claude, Gemini or any custom mindset to control voice profiles."
          />
        ) : (
          <Table<MindsetRow> columns={columns} rows={rows} rowKey={(r) => r.name} />
        )}
      </Card>

      {editor.open && (
        <MindsetEditor
          initialName={editor.isNew ? '' : editor.row?.name ?? ''}
          initialBlock={editor.row?.block}
          isNew={editor.isNew}
          pending={update.isPending || create.isPending}
          errorMessage={
            update.isError
              ? (update.error as Error)?.message
              : create.isError
              ? (create.error as Error)?.message
              : undefined
          }
          onCancel={() => setEditor({ open: false, isNew: false })}
          onSubmit={(data) => {
            if (data.isNew) create.mutate(data);
            else update.mutate(data);
          }}
        />
      )}
    </div>
  );
}
