import { POSITIVE } from '@/content/chart';

export interface BarRow {
  label: string;
  value: number;
  /** Optional right-aligned annotation (e.g. "46% · 88 conv"). */
  note?: string;
}

/*
 * Accessible labeled horizontal bars (no canvas) for distributions and funnels.
 * Color is supplementary — every bar carries its label + value as text.
 */
export default function BarList({
  rows,
  color = POSITIVE,
  emptyText = 'No data for this range.',
}: {
  rows: BarRow[];
  color?: string;
  emptyText?: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-gray-500">{emptyText}</p>;
  }
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-600">{r.label}</span>
            <span className="tabular-nums text-gray-700">{r.note ?? r.value.toLocaleString()}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.round((r.value / max) * 100)}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
