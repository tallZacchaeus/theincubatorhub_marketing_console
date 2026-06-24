import {
  BarChart3,
  ChevronRight,
  Inbox,
  Link2,
  Mail,
  Send,
  Target,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// The console teaches one mental model everywhere. Rendered compactly under
// teaching empty states so a new user sees the whole flow at a glance.
const STORY: { label: string; icon: LucideIcon }[] = [
  { label: 'Build an audience', icon: Target },
  { label: 'Design an email', icon: Mail },
  { label: 'Add tracked links', icon: Link2 },
  { label: 'Send / schedule', icon: Send },
  { label: 'See results', icon: BarChart3 },
];

function FiveStepStory() {
  return (
    <div className="mt-2 w-full max-w-2xl rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3">
      <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-xs text-gray-600">
        {STORY.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex items-center gap-1">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 font-medium shadow-sm">
                <Icon className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
                {step.label}
              </span>
              {i < STORY.length - 1 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/*
 * Teaching empty state — the default body for pages with no data. Shows an icon,
 * a title, a description, an optional primary CTA, and (optionally) the 5-step
 * story so a non-marketer learns the flow instead of seeing "No data."
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  showSteps = false,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  showSteps?: boolean;
  className?: string;
}) {
  return (
    <Card
      className={cn('flex flex-col items-center justify-center gap-3 px-6 py-14 text-center', className)}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description ? <p className="max-w-md text-sm text-gray-600">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
      {showSteps ? <FiveStepStory /> : null}
    </Card>
  );
}
