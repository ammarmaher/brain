/*** Centered modal — Tailwind grid; Esc + backdrop close ***/
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import cx from '../../lib/classnames';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  width = '640px',
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cx(
          'panel relative grid grid-rows-[auto_1fr_auto] max-h-[90vh] overflow-hidden shadow-2xl'
        )}
        style={{ width }}
      >
        <header className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 border-b border-brain-bg-border">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </header>
        <div className="p-4 overflow-auto">{children}</div>
        {footer && (
          <footer className="grid grid-flow-col auto-cols-max justify-end gap-2 px-4 py-3 border-t border-brain-bg-border">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
