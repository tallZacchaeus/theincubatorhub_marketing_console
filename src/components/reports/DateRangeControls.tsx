import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ReportParams } from '@/types';

const PRESETS: { value: string; label: string; days: number }[] = [
  { value: '7d', label: 'Last 7 days', days: 7 },
  { value: '30d', label: 'Last 30 days', days: 30 },
  { value: '90d', label: 'Last 90 days', days: 90 },
];

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - (days - 1));
  return d.toISOString().slice(0, 10);
}
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const GRANULARITIES: ReportParams['granularity'][] = ['day', 'week', 'month'];

/*
 * Per-report date range + (optional) granularity control. Emits ReportParams via
 * onChange whenever the selection changes (fires once on mount with the default
 * 30-day window).
 */
export default function DateRangeControls({
  onChange,
  showGranularity = false,
}: {
  onChange: (params: ReportParams) => void;
  showGranularity?: boolean;
}) {
  const [preset, setPreset] = useState('30d');
  const [granularity, setGranularity] = useState<ReportParams['granularity']>('day');

  useEffect(() => {
    const days = PRESETS.find((p) => p.value === preset)?.days ?? 30;
    onChange({ from: isoDaysAgo(days), to: today(), granularity: showGranularity ? granularity : undefined });
    // onChange identity is stable from the parent (useCallback); deps are the selections.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset, granularity, showGranularity]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={preset} onValueChange={setPreset}>
        <SelectTrigger className="w-40">
          <CalendarDays className="mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PRESETS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showGranularity ? (
        <div className="inline-flex rounded-lg border border-gray-200 p-0.5" role="group" aria-label="Granularity">
          {GRANULARITIES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGranularity(g)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                granularity === g ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-gray-900',
              )}
            >
              {g}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
