import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, type LucideIcon } from 'lucide-react';
import HelpHint from '@/components/HelpHint';
import { cn } from '@/lib/utils';

export type MetricTone = 'green' | 'blue' | 'teal' | 'purple' | 'orange' | 'pink';

// Full, static class strings per tone (Tailwind can't see interpolated names).
// Mirrors the main app's AdminMetricCard tone map.
const TONES: Record<MetricTone, { card: string; chip: string }> = {
  green: { card: 'from-green-50 to-white', chip: 'bg-green-100 text-green-700' },
  blue: { card: 'from-blue-50 to-white', chip: 'bg-blue-100 text-blue-700' },
  teal: { card: 'from-teal-50 to-white', chip: 'bg-teal-100 text-teal-700' },
  purple: { card: 'from-purple-50 to-white', chip: 'bg-purple-100 text-purple-700' },
  orange: { card: 'from-orange-50 to-white', chip: 'bg-orange-100 text-orange-700' },
  pink: { card: 'from-pink-50 to-white', chip: 'bg-pink-100 text-pink-700' },
};

/*
 * Port of theincubator_frontend AdminMetricCard: rounded-2xl gradient-tinted KPI
 * tile with a colored icon chip, big bold value, label, helper text, and a hover
 * lift. Used across the Home dashboard and Analytics in later phases.
 */
export default function MetricCard({
  icon: Icon,
  value,
  label,
  helperText,
  tone = 'green',
  className,
  hintTerm,
  delta,
}: {
  icon: LucideIcon;
  value: ReactNode;
  label: string;
  helperText?: string;
  tone?: MetricTone;
  className?: string;
  /** Optional glossary term id; renders a HelpHint next to the label. */
  hintTerm?: string;
  /** Optional period-over-period change; renders a ▲/▼ chip under the value. */
  delta?: { changePct: number | null } | null;
}) {
  const t = TONES[tone];
  const change = delta?.changePct;
  const up = typeof change === 'number' && change >= 0;
  return (
    <article
      className={cn(
        'rounded-2xl border border-gray-200 bg-gradient-to-br p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md',
        t.card,
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', t.chip)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold tracking-tight text-gray-950">{value}</p>
        {typeof change === 'number' ? (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              up ? 'text-green-700' : 'text-red-600',
            )}
          >
            {up ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />}
            {Math.abs(change)}%
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
        {label}
        {hintTerm ? <HelpHint term={hintTerm} /> : null}
      </h3>
      {helperText ? <p className="mt-1 text-xs text-gray-500">{helperText}</p> : null}
    </article>
  );
}
