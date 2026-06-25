/*
 * Shared data-viz tokens for the analytics reports. One palette + chrome so every
 * chart reads as the same product (per the ui-ux-pro-max Charts & Data rules:
 * accessible colors, subtle gridlines, never color-alone).
 */

// Fixed categorical series palette (AA on white). Semantic: green = primary/
// positive, orange/red = drop-off/negative, gray = neutral.
export const CHART_COLORS = [
  '#16a34a', // green (brand / primary)
  '#60a5fa', // blue
  '#a78bfa', // purple
  '#2dd4bf', // teal
  '#fb923c', // orange
  '#f472b6', // pink
  '#9ca3af', // gray
];

export const POSITIVE = '#16a34a';
export const NEGATIVE = '#fb923c';
export const NEUTRAL = '#9ca3af';

export const GRID = '#e5e7eb';
export const AXIS_TICK = { fontSize: 12, fill: '#6b7280' } as const;
export const TOOLTIP_STYLE = { borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 } as const;

export function colorAt(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

export function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

export function compact(n: number): string {
  return Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function hours(n: number): string {
  if (n >= 48) return `${(n / 24).toFixed(1)}d`;
  return `${Math.round(n)}h`;
}
