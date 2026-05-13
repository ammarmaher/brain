/*** Display formatters - duration, percent, dates via dayjs ***/
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatDuration(ms: number | null | undefined): string {
  if (ms == null || isNaN(ms)) return '-';
  if (ms < 1000) return `${ms} ms`;
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sr = s % 60;
  if (m < 60) return `${m}m ${sr}s`;
  const h = Math.floor(m / 60);
  const mr = m % 60;
  return `${h}h ${mr}m`;
}

export function formatPercent(p: number | null | undefined): string {
  if (p == null || isNaN(p)) return '-';
  const clamped = Math.max(0, Math.min(100, p));
  return `${clamped.toFixed(0)}%`;
}

export function formatDate(d: string | Date | null | undefined): string {
  if (!d) return '-';
  return dayjs(d).format('YYYY-MM-DD HH:mm');
}

export function formatRelative(d: string | Date | null | undefined): string {
  if (!d) return '-';
  return dayjs(d).fromNow();
}
