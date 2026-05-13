/*** Form primitives — accessible label + input/textarea/select ***/
import { ReactNode } from 'react';
import cx from '../../lib/classnames';

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, required, hint, className, children }: FieldProps) {
  return (
    <div className={cx('grid gap-1', className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs uppercase tracking-wide text-slate-400"
      >
        {label}
        {required && <span className="text-falcon-red ml-1">*</span>}
      </label>
      {children}
      {hint && <span className="text-xs text-slate-500">{hint}</span>}
    </div>
  );
}

const baseInput =
  'w-full bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-falcon-blue';

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const { className, ...rest } = props;
  return <input className={cx(baseInput, className)} {...rest} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const { className, ...rest } = props;
  return (
    <textarea
      className={cx(baseInput, 'font-mono leading-snug resize-y', className)}
      {...rest}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <select className={cx(baseInput, className)} {...rest}>
      {children}
    </select>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

export function Button({
  variant = 'ghost',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        'inline-grid grid-flow-col auto-cols-max items-center gap-1.5 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        variant === 'primary' &&
          'bg-falcon-blue text-white border-falcon-blue hover:bg-falcon-blue-600',
        variant === 'ghost' &&
          'bg-transparent text-slate-200 border-brain-bg-border hover:bg-brain-bg-panel',
        variant === 'danger' &&
          'bg-falcon-red/15 text-falcon-red border-falcon-red/40 hover:bg-falcon-red/25',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
