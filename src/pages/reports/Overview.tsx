import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Target,
  UserCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { apiErrorMessage } from '@/api/errors';
import { reportOverview } from '@/api/endpoints/reports';
import MetricCard, { type MetricTone } from '@/components/MetricCard';
import CountUp from '@/components/motion/CountUp';
import Reveal from '@/components/motion/Reveal';
import BarList from '@/components/reports/BarList';
import DateRangeControls from '@/components/reports/DateRangeControls';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { ReportParams } from '@/types';

const KPI_META: Record<string, { icon: LucideIcon; tone: MetricTone; hint?: string }> = {
  signups: { icon: Users, tone: 'green' },
  verified: { icon: UserCheck, tone: 'blue' },
  kyc_complete: { icon: CheckCircle2, tone: 'teal' },
  quiz_complete: { icon: Target, tone: 'purple' },
  enrolled: { icon: GraduationCap, tone: 'orange' },
  active_learners: { icon: BarChart3, tone: 'pink' },
};

export default function ReportsOverview() {
  const [params, setParams] = useState<ReportParams | null>(null);
  const onChange = useCallback((p: ReportParams) => setParams(p), []);

  const { data, isLoading, error } = useQuery({
    queryKey: ['report-overview', params],
    queryFn: () => reportOverview(params ?? {}),
    enabled: params !== null,
  });

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="A snapshot of registration, onboarding, and learning across the chosen period."
        actions={<DateRangeControls onChange={onChange} />}
      />
      <Reveal className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiErrorMessage(error)}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {isLoading || !data
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[140px] rounded-2xl" />)
            : data.kpis.map((k) => {
                const meta = KPI_META[k.id] ?? { icon: BarChart3, tone: 'green' as MetricTone };
                return (
                  <MetricCard
                    key={k.id}
                    icon={meta.icon}
                    tone={meta.tone}
                    value={<CountUp value={k.value} />}
                    label={k.label}
                    delta={k.delta ? { changePct: k.delta.change_pct } : null}
                  />
                );
              })}
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Onboarding funnel</h2>
          <Card className="p-6">
            {isLoading || !data ? (
              <Skeleton className="h-40 rounded-xl" />
            ) : (
              <BarList
                rows={data.funnel.map((f) => ({
                  label: f.name,
                  value: f.value,
                  note: `${f.value.toLocaleString()}${
                    data.funnel[0].value > 0 ? ` · ${Math.round((f.value / data.funnel[0].value) * 100)}%` : ''
                  }`,
                }))}
              />
            )}
          </Card>
        </section>
      </Reveal>
    </>
  );
}
