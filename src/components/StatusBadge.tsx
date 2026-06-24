import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  PauseCircle,
  Send,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tone = 'green' | 'blue' | 'orange' | 'gray';

// Same tonal palette as the main app's AdminStatusBadge.
const TONE_CLASS: Record<Tone, string> = {
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  gray: 'bg-gray-100 text-gray-600',
};

interface StatusConfig {
  label: string;
  tone: Tone;
  icon: LucideIcon;
}

// Marketing statuses the console actually uses: contact lifecycle + campaign
// lifecycle. Keys are the raw backend values.
const STATUS_MAP: Record<string, StatusConfig> = {
  // Contacts
  subscribed: { label: 'Subscribed', tone: 'green', icon: CheckCircle2 },
  unsubscribed: { label: 'Unsubscribed', tone: 'gray', icon: XCircle },
  bounced: { label: 'Bounced', tone: 'orange', icon: AlertCircle },
  complained: { label: 'Complained', tone: 'orange', icon: AlertTriangle },
  // Campaigns
  draft: { label: 'Draft', tone: 'gray', icon: FileText },
  scheduled: { label: 'Scheduled', tone: 'blue', icon: Clock },
  sending: { label: 'Sending', tone: 'blue', icon: Send },
  sent: { label: 'Sent', tone: 'green', icon: CheckCircle2 },
  paused: { label: 'Paused', tone: 'orange', icon: PauseCircle },
  failed: { label: 'Failed', tone: 'orange', icon: XCircle },
};

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/[_-]/g, ' ');
}

/*
 * Port of AdminStatusBadge: a rounded-full pill with a leading lucide icon,
 * colored by status. Unknown statuses fall back to a neutral gray pill with a
 * humanised label.
 */
export default function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config: StatusConfig = STATUS_MAP[status] ?? {
    label: titleCase(status),
    tone: 'gray',
    icon: AlertCircle,
  };
  const Icon = config.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        TONE_CLASS[config.tone],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}
