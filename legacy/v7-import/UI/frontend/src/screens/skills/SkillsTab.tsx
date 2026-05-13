/*** SkillsTab - merged view of /api/skills catalog + /api/admin/skills config ***/

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import Table, { type TableColumn } from '../../components/ui/Table';
import Drawer from '../../components/ui/Drawer';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ScreenError from '../dashboard/ScreenError';
import { Sparkles, Loader2 } from 'lucide-react';
import {
  type SkillRow,
  type SkillsCatalogResponse,
  type SkillsBlock,
  type SkillSettingsBlock,
} from './skillsTypes';

async function fetchCatalog(): Promise<SkillsCatalogResponse> {
  const r = await api.get<SkillsCatalogResponse>('/api/skills');
  return r.data;
}

async function fetchAdminSkills(): Promise<SkillsBlock> {
  const r = await api.get<SkillsBlock>('/api/admin/skills');
  return r.data ?? {};
}

async function fetchSkillMd(path: string): Promise<string> {
  /*** Backend exposes raw catalog read but not raw md by path; we render description + triggers only ***/
  return '';
}

function mergeRows(
  catalog: SkillsCatalogResponse | undefined,
  admin: SkillsBlock | undefined
): SkillRow[] {
  const out: SkillRow[] = [];
  const adminMap = admin ?? {};
  const all = [...(catalog?.skills ?? []), ...(catalog?.jobs ?? [])];
  for (const s of all) {
    const cfg = adminMap[s.name] as SkillSettingsBlock | undefined;
    out.push({
      name: s.name,
      category: s.category || 'unknown',
      path: s.path,
      triggers: s.triggers ?? [],
      description: s.description ?? null,
      voice: cfg?.voice,
      voiceFull: cfg?.voice ? `${cfg.voice} - speed ${cfg?.speed ?? 1}` : undefined,
      enabled: cfg ? cfg.disabled !== true : true,
      block: cfg,
    });
  }
  /*** include admin-only entries (not present in catalog) ***/
  for (const [name, cfg] of Object.entries(adminMap)) {
    if (!out.some((r) => r.name === name)) {
      out.push({
        name,
        category: 'config-only',
        path: '',
        triggers: cfg.triggers ?? [],
        description: null,
        voice: cfg.voice,
        voiceFull: cfg.voice ? `${cfg.voice} - speed ${cfg.speed ?? 1}` : undefined,
        enabled: cfg.disabled !== true,
        block: cfg,
      });
    }
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

export default function SkillsTab() {
  const qc = useQueryClient();
  const [openRow, setOpenRow] = useState<SkillRow | null>(null);

  const catalogQ = useQuery({ queryKey: ['skills', 'catalog'], queryFn: fetchCatalog });
  const adminQ = useQuery({
    queryKey: ['skills', 'admin'],
    queryFn: fetchAdminSkills,
    retry: false,
  });

  const rows = useMemo(() => mergeRows(catalogQ.data, adminQ.data), [catalogQ.data, adminQ.data]);

  const toggle = useMutation({
    mutationFn: async (vars: { name: string; enabled: boolean; block?: SkillSettingsBlock }) => {
      const body = {
        ...(vars.block ?? { voice: 'bm_george', speed: 1, volumeMultiplier: 1, phrases: {}, triggers: [], beep: [] }),
        disabled: !vars.enabled,
      };
      const r = await api.put(`/api/admin/skills/${encodeURIComponent(vars.name)}`, body);
      return r.data;
    },
    onMutate: async ({ name, enabled }) => {
      await qc.cancelQueries({ queryKey: ['skills', 'admin'] });
      const prev = qc.getQueryData<SkillsBlock>(['skills', 'admin']);
      qc.setQueryData<SkillsBlock>(['skills', 'admin'], (old) => {
        const next: SkillsBlock = { ...(old ?? {}) };
        const existing = next[name] ?? ({ voice: 'bm_george' } as SkillSettingsBlock);
        next[name] = { ...existing, disabled: !enabled };
        return next;
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['skills', 'admin'], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['skills', 'admin'] }),
  });

  const columns: TableColumn<SkillRow>[] = [
    { key: 'name', header: 'Name', sortable: true, width: '1.2fr' },
    {
      key: 'category',
      header: 'Type',
      width: '120px',
      render: (r) => (
        <span className="text-xs text-slate-300 capitalize">{r.category}</span>
      ),
    },
    {
      key: 'triggers',
      header: 'Triggers',
      width: '1.4fr',
      render: (r) => (
        <span className="text-xs text-slate-400 truncate" title={(r.triggers ?? []).join(', ')}>
          {(r.triggers ?? []).slice(0, 3).join(', ') || '-'}
          {r.triggers && r.triggers.length > 3 ? ` +${r.triggers.length - 3}` : ''}
        </span>
      ),
    },
    {
      key: 'voiceFull',
      header: 'Voice',
      width: '1fr',
      render: (r) => <span className="text-xs text-slate-400">{r.voiceFull ?? '-'}</span>,
    },
    {
      key: 'enabled',
      header: 'Enabled',
      width: '90px',
      render: (r) => (
        <button
          type="button"
          role="switch"
          aria-checked={r.enabled}
          aria-label={`${r.enabled ? 'Disable' : 'Enable'} ${r.name}`}
          onClick={(e) => {
            e.stopPropagation();
            toggle.mutate({ name: r.name, enabled: !r.enabled, block: r.block });
          }}
          disabled={toggle.isPending}
          className={`grid place-items-center w-10 h-5 rounded-full border transition-colors ${
            r.enabled
              ? 'bg-falcon-blue/30 border-falcon-blue/70'
              : 'bg-slate-700/40 border-slate-700'
          }`}
        >
          <span
            className={`block w-3 h-3 rounded-full transition-transform ${
              r.enabled ? 'translate-x-2 bg-falcon-blue' : '-translate-x-2 bg-slate-400'
            }`}
          />
        </button>
      ),
    },
  ];

  if (catalogQ.error) {
    return (
      <ScreenError
        title="Cannot load skills"
        error={catalogQ.error}
        onRetry={() => qc.invalidateQueries({ queryKey: ['skills'] })}
      />
    );
  }

  if (catalogQ.isLoading) {
    return (
      <div className="grid place-items-center p-12">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {rows.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={32} />}
          title="No skills found"
          message="Place Skill.md files under brain-skills/ and they will appear here."
        />
      ) : (
        <Table<SkillRow>
          columns={columns}
          rows={rows}
          rowKey={(r) => r.name}
          onRowClick={(r) => setOpenRow(r)}
        />
      )}

      <Drawer
        open={!!openRow}
        onClose={() => setOpenRow(null)}
        title={openRow ? `Skill: ${openRow.name}` : 'Skill'}
        width="520px"
      >
        {openRow && (
          <div className="grid gap-3 text-sm">
            <Field label="Type" value={openRow.category} />
            <Field label="Path" value={openRow.path || '(config-only)'} mono />
            <Field
              label="Description"
              value={openRow.description ?? 'No description'}
            />
            <div>
              <h4 className="text-xs uppercase text-slate-400 mb-1">Triggers</h4>
              {(openRow.triggers ?? []).length === 0 ? (
                <p className="text-xs text-slate-500">No triggers</p>
              ) : (
                <ul className="grid gap-1">
                  {openRow.triggers.map((t, i) => (
                    <li
                      key={i}
                      className="text-xs font-mono text-slate-200 bg-brain-bg-panel rounded px-2 py-1"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {openRow.block && (
              <div>
                <h4 className="text-xs uppercase text-slate-400 mb-1">Settings block</h4>
                <pre className="text-xs bg-brain-bg-panel rounded p-2 overflow-auto text-slate-200">
                  {JSON.stringify(openRow.block, null, 2)}
                </pre>
              </div>
            )}
            {toggle.isPending && (
              <div className="grid grid-flow-col auto-cols-max items-center gap-2 text-xs text-slate-400">
                <Loader2 size={12} className="animate-spin" /> Saving...
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <h4 className="text-xs uppercase text-slate-400 mb-1">{label}</h4>
      <p className={`text-xs ${mono ? 'font-mono break-all' : ''} text-slate-200`}>
        {value}
      </p>
    </div>
  );
}
