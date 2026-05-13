/*** MemoryEditor - drawer-driven feedback note editor with frontmatter helper ***/
import { ChangeEvent, useEffect, useState } from 'react';
import { Loader2, Save, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import Drawer from '../../components/ui/Drawer';
import Spinner from '../../components/ui/Spinner';

interface MemoryFile {
  filename: string;
  name?: string;
  description?: string;
  type?: string;
}

interface MemoryEditorProps {
  filename: string | null;
  onClose: () => void;
}

interface MemoryDetail {
  filename: string;
  frontmatter: Record<string, string>;
  content: string;
}

export default function MemoryEditor({ filename, onClose }: MemoryEditorProps) {
  const qc = useQueryClient();
  const detailQ = useQuery({
    queryKey: ['admin', 'memory', filename],
    queryFn: async () => {
      const r = await api.get<MemoryDetail>(`/api/admin/memory/${encodeURIComponent(filename!)}`);
      return r.data;
    },
    enabled: !!filename,
  });

  const [content, setContent] = useState('');

  useEffect(() => {
    if (detailQ.data) setContent(detailQ.data.content);
  }, [detailQ.data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!filename) throw new Error('no file');
      const r = await api.put(`/api/admin/memory/${encodeURIComponent(filename)}`, { content });
      return r.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'memory'] });
    },
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (!filename) throw new Error('no file');
      const r = await api.delete(`/api/admin/memory/${encodeURIComponent(filename)}`);
      return r.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'memory'] });
      onClose();
    },
  });

  return (
    <Drawer open={!!filename} onClose={onClose} title={filename ?? ''} width="640px">
      {detailQ.isLoading ? (
        <div className="grid place-items-center py-8">
          <Spinner />
        </div>
      ) : detailQ.error ? (
        <div className="text-falcon-red text-sm">{String(detailQ.error)}</div>
      ) : (
        <div className="grid grid-rows-[auto_1fr_auto] gap-3 h-full">
          <div className="text-xs text-slate-400 grid gap-1">
            {detailQ.data &&
              Object.entries(detailQ.data.frontmatter ?? {}).map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[120px_1fr] gap-2 font-mono"
                >
                  <span className="text-slate-500">{k}</span>
                  <span className="truncate">{v}</span>
                </div>
              ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-brain-bg-surface border border-brain-bg-border rounded px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-falcon-blue min-h-[400px]"
          />
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
            <button
              type="button"
              onClick={() => save.mutate()}
              disabled={save.isPending}
              className="grid grid-flow-col items-center gap-2 px-3 py-2 text-sm rounded bg-falcon-blue text-white hover:bg-falcon-blue-600 disabled:opacity-50"
            >
              {save.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save
            </button>
            <span className="text-xs text-slate-500">
              {save.isSuccess ? 'saved' : ''}
              {save.error ? String(save.error) : ''}
            </span>
            <button
              type="button"
              onClick={() => remove.mutate()}
              disabled={remove.isPending}
              className="grid grid-flow-col items-center gap-2 px-3 py-2 text-sm rounded border border-falcon-red/40 text-falcon-red hover:bg-falcon-red/10 disabled:opacity-50"
            >
              {remove.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}

interface MemoryCreateProps {
  open: boolean;
  onClose: () => void;
}

export function MemoryCreate({ open, onClose }: MemoryCreateProps) {
  const qc = useQueryClient();
  const [filename, setFilename] = useState('feedback_new.md');
  const [name, setName] = useState('New Feedback');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('feedback');
  const [body, setBody] = useState('# New feedback\n\n');

  const create = useMutation({
    mutationFn: async () => {
      const r = await api.post('/api/admin/memory', {
        filename,
        frontmatter: {
          name,
          description,
          type,
        },
        content: body,
      });
      return r.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'memory'] });
      onClose();
    },
  });

  function on(setter: (v: string) => void) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setter(e.target.value);
  }

  return (
    <Drawer open={open} onClose={onClose} title="Add memory note" width="560px">
      <div className="grid gap-3">
        <Field label="Filename (must end with .md)">
          <input
            type="text"
            value={filename}
            onChange={on(setFilename)}
            className="bg-brain-bg-surface border border-brain-bg-border rounded px-3 py-2 text-sm font-mono"
          />
        </Field>
        <Field label="Name">
          <input
            type="text"
            value={name}
            onChange={on(setName)}
            className="bg-brain-bg-surface border border-brain-bg-border rounded px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Description">
          <input
            type="text"
            value={description}
            onChange={on(setDescription)}
            className="bg-brain-bg-surface border border-brain-bg-border rounded px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Type">
          <input
            type="text"
            value={type}
            onChange={on(setType)}
            className="bg-brain-bg-surface border border-brain-bg-border rounded px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Body">
          <textarea
            value={body}
            onChange={on(setBody)}
            rows={10}
            className="bg-brain-bg-surface border border-brain-bg-border rounded px-3 py-2 text-sm font-mono resize-none"
          />
        </Field>
        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
          <button
            type="button"
            onClick={() => create.mutate()}
            disabled={create.isPending}
            className="grid grid-flow-col items-center gap-2 px-3 py-2 text-sm rounded bg-falcon-blue text-white hover:bg-falcon-blue-600 disabled:opacity-50"
          >
            {create.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Create
          </button>
          <span className="text-xs text-falcon-red">
            {create.error ? String(create.error) : ''}
          </span>
        </div>
      </div>
    </Drawer>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <label className="text-xs uppercase tracking-wide text-slate-400">{label}</label>
      {children}
    </div>
  );
}

export type { MemoryFile };
