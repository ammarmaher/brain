/*** MindsetEditor - modal-style form for create/update of a mindset block ***/

import { useEffect, useState } from 'react';
import { Loader2, Save, X } from 'lucide-react';
import { type MindsetBlock } from './skillsTypes';

export interface MindsetSubmit {
  name: string;
  block: MindsetBlock;
  isNew: boolean;
}

interface Props {
  initialName?: string;
  initialBlock?: MindsetBlock;
  isNew: boolean;
  pending: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onSubmit: (data: MindsetSubmit) => void;
}

export default function MindsetEditor({
  initialName = '',
  initialBlock,
  isNew,
  pending,
  errorMessage,
  onCancel,
  onSubmit,
}: Props) {
  const [name, setName] = useState(initialName);
  const [voice, setVoice] = useState(initialBlock?.voice ?? 'bm_george');
  const [speed, setSpeed] = useState<number>(initialBlock?.speed ?? 1);
  const [volume, setVolume] = useState<number>(initialBlock?.volumeMultiplier ?? 1);
  const [running, setRunning] = useState<string>(
    initialBlock?.phrases?.running ?? ''
  );
  const [working, setWorking] = useState<string>(
    initialBlock?.phrases?.working ?? ''
  );
  const [complete, setComplete] = useState<string>(
    initialBlock?.phrases?.complete ?? ''
  );

  useEffect(() => {
    setName(initialName);
    setVoice(initialBlock?.voice ?? 'bm_george');
    setSpeed(initialBlock?.speed ?? 1);
    setVolume(initialBlock?.volumeMultiplier ?? 1);
    setRunning(initialBlock?.phrases?.running ?? '');
    setWorking(initialBlock?.phrases?.working ?? '');
    setComplete(initialBlock?.phrases?.complete ?? '');
  }, [initialName, initialBlock]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !voice.trim()) return;
    const phrases: Record<string, string> = {};
    if (running.trim()) phrases.running = running.trim();
    if (working.trim()) phrases.working = working.trim();
    if (complete.trim()) phrases.complete = complete.trim();
    onSubmit({
      name: name.trim(),
      block: {
        voice: voice.trim(),
        speed: Number(speed) || 1,
        volumeMultiplier: Number(volume) || 1,
        phrases,
      },
      isNew,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? 'Add mindset' : `Edit mindset ${initialName}`}
    >
      <form
        onSubmit={submit}
        className="panel grid gap-3 p-4 w-full max-w-md max-h-[90vh] overflow-auto"
      >
        <header className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-brain-bg-border pb-2">
          <h3 className="text-sm font-semibold text-slate-100">
            {isNew ? 'Add mindset' : `Edit mindset: ${initialName}`}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel"
            className="grid place-items-center w-7 h-7 rounded text-slate-400 hover:text-slate-200"
          >
            <X size={16} />
          </button>
        </header>

        <label className="grid gap-1 text-xs">
          <span className="text-slate-400">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isNew || pending}
            required
            className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-200 disabled:text-slate-500"
          />
        </label>

        <label className="grid gap-1 text-xs">
          <span className="text-slate-400">Voice</span>
          <input
            type="text"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            required
            disabled={pending}
            placeholder="e.g. bm_george, am_michael, af_bella"
            className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-200"
          />
        </label>

        <div className="grid gap-3 grid-cols-2">
          <label className="grid gap-1 text-xs">
            <span className="text-slate-400">Speed</span>
            <input
              type="number"
              min={0.1}
              max={4}
              step={0.05}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={pending}
              className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-200"
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-slate-400">Volume mult.</span>
            <input
              type="number"
              min={0.1}
              max={20}
              step={0.1}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              disabled={pending}
              className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-200"
            />
          </label>
        </div>

        <fieldset className="grid gap-2">
          <legend className="text-xs text-slate-400">Phrases</legend>
          <label className="grid gap-1 text-xs">
            <span className="text-slate-500">Running</span>
            <input
              type="text"
              value={running}
              onChange={(e) => setRunning(e.target.value)}
              disabled={pending}
              className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-200"
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-slate-500">Working</span>
            <input
              type="text"
              value={working}
              onChange={(e) => setWorking(e.target.value)}
              disabled={pending}
              className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-200"
            />
          </label>
          <label className="grid gap-1 text-xs">
            <span className="text-slate-500">Complete</span>
            <input
              type="text"
              value={complete}
              onChange={(e) => setComplete(e.target.value)}
              disabled={pending}
              className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-200"
            />
          </label>
        </fieldset>

        {errorMessage && <p className="text-xs text-falcon-red">{errorMessage}</p>}

        <footer className="grid grid-flow-col auto-cols-max gap-2 justify-end pt-2 border-t border-brain-bg-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="px-3 py-1.5 text-xs rounded border border-brain-bg-border text-slate-300 hover:bg-brain-bg-panel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending || !name.trim() || !voice.trim()}
            className="grid grid-flow-col auto-cols-max items-center gap-2 px-3 py-1.5 text-xs rounded border bg-falcon-blue border-falcon-blue text-white hover:bg-falcon-blue/90 disabled:bg-slate-700/40 disabled:text-slate-500 disabled:border-slate-700"
          >
            {pending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            <span>Save</span>
          </button>
        </footer>
      </form>
    </div>
  );
}
