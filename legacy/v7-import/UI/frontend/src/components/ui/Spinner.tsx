/*** Spinner - simple Tailwind animate-spin loader ***/
import { Loader2 } from 'lucide-react';
import cx from '../../lib/classnames';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export default function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      className={cx('animate-spin text-falcon-blue', className)}
    />
  );
}
