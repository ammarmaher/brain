/*** Reports tab — download cards for master + per-module xlsx/docx ***/
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import api from '../../api/client';
import { fetchModules } from '../shared/mutations';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

interface ReportMeta {
  exists: boolean;
  size?: number;
  modified?: string;
}

async function probeReport(rel: string): Promise<ReportMeta> {
  try {
    const r = await api.head(`/api/reports/${rel}`);
    const len = Number(r.headers['content-length'] ?? '0');
    const mod = r.headers['last-modified'] as string | undefined;
    return { exists: true, size: len || undefined, modified: mod };
  } catch {
    return { exists: false };
  }
}

export default function ReportsTab() {
  const modulesQ = useQuery({ queryKey: ['knowledge-modules'], queryFn: fetchModules });

  return (
    <div className="grid gap-4 min-h-0">
      <section>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Master reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ReportCard
            href="/api/reports/master.xlsx"
            filename="master.xlsx"
            label="Master spreadsheet"
            kind="xlsx"
          />
          <ReportCard
            href="/api/reports/master.docx"
            filename="master.docx"
            label="Master document"
            kind="docx"
          />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Per-module reports</h3>
        {modulesQ.isLoading ? (
          <Spinner size={20} />
        ) : !modulesQ.data || modulesQ.data.length === 0 ? (
          <EmptyState title="No modules" />
        ) : (
          <div className="grid gap-4">
            {modulesQ.data.map((m) => (
              <div key={m.slug} className="grid gap-2">
                <h4 className="text-xs uppercase tracking-wide text-slate-400 font-mono">
                  {m.slug}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ReportCard
                    href={`/api/reports/${m.slug}.xlsx`}
                    filename={`${m.slug}.xlsx`}
                    label={`${m.slug} spreadsheet`}
                    kind="xlsx"
                  />
                  <ReportCard
                    href={`/api/reports/${m.slug}.docx`}
                    filename={`${m.slug}.docx`}
                    label={`${m.slug} document`}
                    kind="docx"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ReportCard({
  href,
  filename,
  label,
  kind,
}: {
  href: string;
  filename: string;
  label: string;
  kind: 'xlsx' | 'docx';
}) {
  const [meta, setMeta] = useState<ReportMeta | null>(null);

  useEffect(() => {
    let cancelled = false;
    probeReport(filename).then((m) => {
      if (cancelled) return;
      setMeta(m);
    });
    return () => {
      cancelled = true;
    };
  }, [filename]);

  const Icon = kind === 'xlsx' ? FileSpreadsheet : FileText;

  return (
    <a
      href={href}
      download={filename}
      className="panel grid grid-cols-[40px_1fr_24px] items-center gap-3 p-3 hover:bg-brain-bg-panel transition-colors"
    >
      <span
        className={
          kind === 'xlsx'
            ? 'text-falcon-green grid place-items-center'
            : 'text-falcon-blue grid place-items-center'
        }
      >
        <Icon size={28} />
      </span>
      <div className="grid">
        <span className="text-sm font-medium truncate">{label}</span>
        <span className="text-xs text-slate-500 font-mono truncate">{filename}</span>
        {meta && (
          <span className="text-xs text-slate-500">
            {meta.exists ? formatSize(meta.size) : 'not generated'}
            {meta.exists && meta.modified ? ` · ${meta.modified}` : ''}
          </span>
        )}
      </div>
      <Download size={16} className="text-slate-400" />
    </a>
  );
}

function formatSize(bytes?: number): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
