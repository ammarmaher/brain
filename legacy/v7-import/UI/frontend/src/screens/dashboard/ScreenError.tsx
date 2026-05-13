/*** ScreenError - reusable error display + retry button used across Wave 3 screens ***/

import { AlertTriangle, RotateCw } from 'lucide-react';
import Card from '../../components/ui/Card';

interface Props {
  title?: string;
  error: unknown;
  onRetry?: () => void;
}

function extractMessage(err: unknown): string {
  if (err == null) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  const o = err as { message?: unknown; response?: { data?: { detail?: unknown } } };
  if (o.response?.data?.detail) return String(o.response.data.detail);
  if (o.message) return String(o.message);
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
}

export default function ScreenError({ title = 'Something went wrong', error, onRetry }: Props) {
  return (
    <Card title={title}>
      <div className="grid grid-cols-[40px_1fr] items-start gap-3">
        <div className="text-falcon-red">
          <AlertTriangle size={32} />
        </div>
        <div className="grid gap-2">
          <p className="text-sm text-slate-300">{extractMessage(error)}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="grid grid-flow-col auto-cols-max items-center gap-2 px-3 py-1.5 bg-falcon-blue/15 hover:bg-falcon-blue/25 text-falcon-blue text-sm rounded border border-falcon-blue/40 w-fit"
            >
              <RotateCw size={14} /> Retry
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
