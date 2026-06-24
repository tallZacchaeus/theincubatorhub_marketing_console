import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import {
  BarChart3,
  Bell,
  MousePointerClick,
  Send,
  Target,
  Users,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DataTable from '@/components/DataTable';
import EmptyState from '@/components/EmptyState';
import MetricCard, { type MetricTone } from '@/components/MetricCard';
import StatusBadge from '@/components/StatusBadge';
import { SelectField, TextField, TextareaField } from '@/components/form/fields';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/lib/toast';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</h2>
      {children}
    </section>
  );
}

const METRICS: { tone: MetricTone; icon: typeof Users; value: string; label: string; helper: string }[] = [
  { tone: 'green', icon: Users, value: '12,480', label: 'Contacts', helper: 'In your audiences' },
  { tone: 'blue', icon: Send, value: '38', label: 'Campaigns sent', helper: 'Last 30 days' },
  { tone: 'teal', icon: Target, value: '9', label: 'Audiences', helper: 'Saved segments' },
  { tone: 'purple', icon: BarChart3, value: '41.2%', label: 'Open rate', helper: '+3.1% vs prior' },
  { tone: 'orange', icon: MousePointerClick, value: '6,902', label: 'Link clicks', helper: 'Tracked links' },
  { tone: 'pink', icon: Bell, value: '128', label: 'Conversions', helper: 'Signups' },
];

const CONTACT_STATUSES = ['subscribed', 'unsubscribed', 'bounced', 'complained'];
const CAMPAIGN_STATUSES = ['draft', 'scheduled', 'sending', 'sent', 'paused', 'failed'];

interface Row {
  name: string;
  audience: string;
  status: string;
  clicks: number;
}

const ROWS: Row[] = [
  { name: 'Spring cohort launch', audience: 'New leads', status: 'sent', clicks: 412 },
  { name: 'Re-engage dormant users', audience: 'Inactive 90d', status: 'scheduled', clicks: 0 },
  { name: 'Referral program kickoff', audience: 'Active students', status: 'draft', clicks: 0 },
  { name: 'Weekly digest', audience: 'All subscribers', status: 'paused', clicks: 1290 },
  { name: 'Welcome series', audience: 'New signups', status: 'sending', clicks: 88 },
];

const COLUMNS: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'name', header: 'Campaign', cell: (c) => <span className="font-medium text-gray-900">{c.getValue<string>()}</span> },
  { accessorKey: 'audience', header: 'Audience' },
  { accessorKey: 'status', header: 'Status', cell: (c) => <StatusBadge status={c.getValue<string>()} /> },
  { accessorKey: 'clicks', header: 'Clicks', cell: (c) => <span className="tabular-nums">{c.getValue<number>().toLocaleString()}</span> },
];

const formSchema = z.object({
  name: z.string().min(1, 'Give your campaign a name.'),
  audience: z.string().min(1, 'Pick an audience.'),
  notes: z.string().max(280, 'Keep it under 280 characters.').optional(),
});

function SampleForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', audience: '', notes: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success('Form is valid', `Campaign “${values.name}” would be saved.`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <TextField name="name" label="Campaign name" placeholder="Spring cohort launch" hint="Internal name — recipients won't see this." />
        <SelectField
          name="audience"
          label="Audience"
          placeholder="Choose who to send to"
          options={[
            { value: 'new-leads', label: 'New leads' },
            { value: 'active', label: 'Active students' },
            { value: 'all', label: 'All subscribers' },
          ]}
        />
        <TextareaField name="notes" label="Notes" placeholder="Optional notes…" hint="Optional, max 280 characters." />
        <Button type="submit">Validate & submit</Button>
      </form>
    </Form>
  );
}

/*
 * Dev-only QA surface (route /dev/components, not in the user nav). Renders every
 * kit primitive on-theme so the design system can be reviewed in one place.
 * Self-contained (its own TooltipProvider + Toaster) so it works without the
 * app shell. Safe to delete later.
 */
export default function ComponentsShowcase() {
  const [loading, setLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const total = 12;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-background">
        <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
            Design-system primitives
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Dev showcase for the Phase D component kit. Not part of the user navigation.
          </p>
        </div>

        <div className="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
          <Section title="MetricCard — tones">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {METRICS.map((m) => (
                <MetricCard
                  key={m.tone}
                  icon={m.icon}
                  tone={m.tone}
                  value={m.value}
                  label={m.label}
                  helperText={m.helper}
                />
              ))}
            </div>
          </Section>

          <Section title="StatusBadge — marketing statuses">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {CONTACT_STATUSES.map((s) => (
                  <StatusBadge key={s} status={s} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {CAMPAIGN_STATUSES.map((s) => (
                  <StatusBadge key={s} status={s} />
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="something_unknown" />
              </div>
            </div>
          </Section>

          <Section title="DataTable — sort, paginate, loading, empty">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setLoading((v) => !v)}>
                {loading ? 'Show data' : 'Toggle loading'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowEmpty((v) => !v)}>
                {showEmpty ? 'Show rows' : 'Toggle empty'}
              </Button>
            </div>
            <DataTable
              columns={COLUMNS}
              data={showEmpty ? [] : ROWS}
              loading={loading}
              empty={
                <EmptyState
                  icon={Send}
                  title="No campaigns yet"
                  description="Create your first campaign to start reaching your audiences."
                  action={<Button>New campaign</Button>}
                  showSteps
                />
              }
              pagination={{
                limit,
                offset,
                total,
                hasMore: offset + limit < total,
                onPageChange: setOffset,
              }}
            />
          </Section>

          <Section title="EmptyState — teaching, with 5-step story">
            <EmptyState
              icon={Target}
              title="Build your first audience"
              description="Audiences are groups of people you send a campaign to, built from filters."
              action={<Button>New audience</Button>}
              showSteps
            />
          </Section>

          <Section title="Form — zod validation + inline errors">
            <SampleForm />
          </Section>

          <Section title="Overlays + feedback">
            <div className="flex flex-wrap items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open dialog</Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Send test email</DialogTitle>
                    <DialogDescription>
                      We'll send a preview of this campaign to your own inbox. Nothing goes to your audience.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={() => toast.success('Test sent', 'Check your inbox.')}>
                      Send test
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Drawer panel — used for filters and detail views.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 text-sm text-gray-600">Sheet body content goes here.</div>
                </SheetContent>
              </Sheet>

              <Button variant="secondary" onClick={() => toast.success('Saved', 'Your changes were saved.')}>
                Success toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.error('Could not save. Please try again.')}
              >
                Error toast
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost">Hover for tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Plain-language help lives here.</TooltipContent>
              </Tooltip>
            </div>
          </Section>
        </div>

        <Toaster position="top-right" richColors />
      </div>
    </TooltipProvider>
  );
}
