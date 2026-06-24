import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { FileEdit, Loader2, PlayCircle, Plus, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiErrorMessage } from '@/api/errors';
import { listBroadcasts } from '@/api/endpoints/broadcasts';
import { useAuth } from '@/auth/AuthContext';
import DataTable from '@/components/DataTable';
import EmptyState from '@/components/EmptyState';
import MetricCard from '@/components/MetricCard';
import { useTour } from '@/components/tour/useTour';
import StatusBadge from '@/components/StatusBadge';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Broadcast } from '@/types';

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleDateString() : '—';
}

const columns: ColumnDef<Broadcast, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="font-medium text-gray-900">{row.original.name ?? '—'}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'audience',
    header: 'Audience',
    accessorFn: (r) => r.category?.name ?? '—',
  },
  {
    id: 'sent',
    header: 'Sent',
    accessorFn: (r) => formatDate(r.sent_at),
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { start } = useTour();

  const { data, isLoading, error } = useQuery({
    queryKey: ['broadcasts', 'home'],
    queryFn: () => listBroadcasts({ limit: 10 }),
  });

  const campaigns = data?.campaigns ?? [];

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const b of campaigns) c[b.status] = (c[b.status] ?? 0) + 1;
    return c;
  }, [campaigns]);

  const metrics = [
    { tone: 'green' as const, icon: Send, value: campaigns.length, label: 'Recent campaigns', helper: 'Latest 10' },
    { tone: 'blue' as const, icon: FileEdit, value: counts.draft ?? 0, label: 'Drafts', helper: 'Not sent yet' },
    { tone: 'orange' as const, icon: Loader2, value: counts.sending ?? 0, label: 'Sending', helper: 'In progress' },
    { tone: 'purple' as const, icon: Send, value: counts.sent ?? 0, label: 'Sent', helper: 'Delivered' },
  ];

  return (
    <>
      <PageHeader
        title={user?.name ? `Welcome, ${user.name}` : 'Home'}
        subtitle="Your campaigns at a glance and what to do next."
        actions={
          <Button onClick={() => navigate('/campaigns')}>
            <Plus className="h-4 w-4" />
            New campaign
          </Button>
        }
      />

      <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiErrorMessage(error)}
          </div>
        ) : null}

        {/* KPI tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[152px] rounded-2xl" />
              ))
            : metrics.map((m) => (
                <MetricCard
                  key={m.label}
                  icon={m.icon}
                  tone={m.tone}
                  value={m.value}
                  label={m.label}
                  helperText={m.helper}
                />
              ))}
        </div>

        {/* Recent campaigns */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Recent campaigns</h2>
          <DataTable
            columns={columns}
            data={campaigns}
            loading={isLoading}
            empty={
              <EmptyState
                icon={Send}
                title="No campaigns yet"
                description="A campaign is an email you send to an audience. Create your first one to start reaching people."
                action={
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button onClick={() => navigate('/campaigns')}>
                      <Plus className="h-4 w-4" />
                      Create your first campaign
                    </Button>
                    <Button variant="outline" onClick={start}>
                      <PlayCircle className="h-4 w-4" />
                      Take the 2-minute walkthrough
                    </Button>
                  </div>
                }
                showSteps
              />
            }
          />
        </section>
      </div>
    </>
  );
}
