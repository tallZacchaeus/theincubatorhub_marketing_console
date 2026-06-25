import { useQuery } from '@tanstack/react-query';
import { Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { apiErrorMessage } from '@/api/errors';
import { linkAnalytics } from '@/api/endpoints/links';
import { linkTypeLabel } from '@/content/linkTypes';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import type { TrackedLink } from '@/types';

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

/*
 * Per-link analytics drawer: clicks/conversions totals, a clicks-over-time area
 * chart, top referrers, and a QR code for offline sharing. Opens when linkId is
 * set; fetches GET /links/{id}/analytics.
 */
export default function LinkAnalyticsSheet({
  linkId,
  link,
  onOpenChange,
  onCopy,
}: {
  linkId: number | null;
  link: TrackedLink | null;
  onOpenChange: (open: boolean) => void;
  onCopy: (text: string) => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['link-analytics', linkId],
    queryFn: () => linkAnalytics(linkId as number),
    enabled: linkId !== null,
  });

  const trackedUrl = data?.link.tracked_url ?? link?.tracked_url ?? '';

  return (
    <Sheet open={linkId !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{link?.label ?? data?.link.label ?? 'Tracked link'}</SheetTitle>
          <SheetDescription>
            {linkTypeLabel(link?.link_type ?? data?.link.link_type ?? 'acquisition')} · per-link performance
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-6">
          {/* Tracked URL + copy */}
          {trackedUrl ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div className="text-xs font-medium text-gray-500">Tracked URL</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-gray-700">{trackedUrl}</span>
                <Button variant="outline" size="sm" onClick={() => onCopy(trackedUrl)}>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {apiErrorMessage(error)}
            </div>
          ) : null}

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          ) : data ? (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
                  <div className="text-2xl font-bold text-gray-950">{data.totals.clicks.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Clicks</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
                  <div className="text-2xl font-bold text-gray-950">{data.totals.conversions.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Conversions</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
                  <div className="text-2xl font-bold text-gray-950">{pct(data.totals.conversion_rate)}</div>
                  <div className="text-xs text-gray-500">Conv. rate</div>
                </div>
              </div>

              {/* Clicks over time */}
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Clicks over time</div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.clicks_series} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <RTooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                      <Area type="monotone" dataKey="clicks" stroke="#16a34a" fill="rgba(22,163,74,0.12)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top referrers */}
              {data.top_referers.length > 0 ? (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Top referrers</div>
                  <ul className="space-y-1.5">
                    {data.top_referers.map((r) => (
                      <li key={r.referer} className="flex items-center justify-between text-sm">
                        <span className="truncate text-gray-700">{r.referer}</span>
                        <span className="tabular-nums text-gray-500">{r.clicks.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}

          {/* QR code for offline sharing */}
          {trackedUrl ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">QR code</div>
              <div className="rounded-lg bg-white p-2">
                <QRCodeSVG value={trackedUrl} size={132} marginSize={1} />
              </div>
              <p className="text-center text-xs text-gray-500">Scan to open the tracked link — great for print and events.</p>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
