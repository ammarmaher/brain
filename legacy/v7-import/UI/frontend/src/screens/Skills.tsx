/*** Skills - Skills/Mindsets tabs + Apply Settings button ***/
/*** Wave 3 of 5; reads /api/skills + /api/admin/{skills,mindsets} ***/

import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Settings as SettingsIcon } from 'lucide-react';
import api from '../api/client';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import SkillsTab from './skills/SkillsTab';
import MindsetsTab from './skills/MindsetsTab';
import { useLiveStore } from '../store';

type TabId = 'skills' | 'mindsets';

export default function Skills() {
  const qc = useQueryClient();
  const events = useLiveStore((s) => s.events);
  const [active, setActive] = useState<TabId>('skills');
  const [applyMessage, setApplyMessage] = useState<{ kind: 'ok' | 'err'; message: string } | null>(
    null
  );

  /*** WS: refresh skills/mindsets caches when CRUD events come in ***/
  useEffect(() => {
    const last = events[0];
    if (!last) return;
    if (last.type.startsWith('skill') || last.type === 'skills.crud.changed') {
      qc.invalidateQueries({ queryKey: ['skills'] });
    }
    if (last.type.startsWith('mindset') || last.type === 'mindsets.crud.changed') {
      qc.invalidateQueries({ queryKey: ['mindsets'] });
    }
    if (last.type === 'settings.applied' || last.type === 'settings.changed') {
      qc.invalidateQueries({ queryKey: ['skills'] });
      qc.invalidateQueries({ queryKey: ['mindsets'] });
    }
  }, [events, qc]);

  const apply = useMutation({
    mutationFn: async () => {
      const r = await api.post('/api/admin/settings/apply');
      return r.data as { ok: boolean; rc: number };
    },
    onSuccess: (data) => {
      if (data.ok) {
        setApplyMessage({ kind: 'ok', message: `Settings applied (rc=${data.rc}).` });
      } else {
        setApplyMessage({ kind: 'err', message: `Apply returned non-zero rc=${data.rc}.` });
      }
    },
    onError: (e: Error) =>
      setApplyMessage({ kind: 'err', message: e.message ?? 'apply failed' }),
  });

  return (
    <div className="grid gap-4">
      <Card
        title="Skills & Mindsets"
        subtitle="Toggle, edit voice profiles, and apply settings to disk"
        action={
          <button
            type="button"
            onClick={() => {
              setApplyMessage(null);
              apply.mutate();
            }}
            disabled={apply.isPending}
            className="grid grid-flow-col auto-cols-max items-center gap-2 px-3 py-1.5 text-xs rounded border border-falcon-blue/40 bg-falcon-blue/15 text-falcon-blue hover:bg-falcon-blue/25 disabled:opacity-50"
          >
            {apply.isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <SettingsIcon size={12} />
            )}
            <span>Apply Settings</span>
          </button>
        }
      >
        <Tabs
          items={[
            { value: 'skills', label: 'Skills' },
            { value: 'mindsets', label: 'Mindsets' },
          ]}
          value={active}
          onChange={(v) => setActive(v as TabId)}
        />
        {applyMessage && (
          <p
            role="status"
            className={`mt-3 text-xs ${
              applyMessage.kind === 'ok' ? 'text-falcon-green' : 'text-falcon-red'
            }`}
          >
            {applyMessage.message}
          </p>
        )}
      </Card>

      <div>{active === 'skills' ? <SkillsTab /> : <MindsetsTab />}</div>
    </div>
  );
}
