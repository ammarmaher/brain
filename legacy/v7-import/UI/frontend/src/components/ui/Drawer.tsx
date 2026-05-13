/*** Drawer - slide-over from right; backdrop click closes ***/
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import cx from '../../lib/classnames';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: string;
  children?: ReactNode;
}

export default function Drawer({
  open,
  onClose,
  title,
  width = '420px',
  children,
}: DrawerProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid grid-cols-[1fr_auto]">
      <div
        onClick={onClose}
        className="bg-black/50 backdrop-blur-sm"
        aria-hidden
      />
      <aside
        className={cx(
          'panel grid grid-rows-[auto_1fr] h-full overflow-hidden'
        )}
        style={{ width }}
      >
        <header className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 border-b border-brain-bg-border">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </header>
        <div className="p-4 overflow-auto">{children}</div>
      </aside>
    </div>
  );
}
