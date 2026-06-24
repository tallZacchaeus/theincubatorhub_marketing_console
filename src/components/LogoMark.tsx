import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

/*
 * Console brand mark. The main app masks a PNG logo; the console is a separate
 * SPA and we don't pull main-app assets across the scope fence, so we use the
 * shared green brand gradient with a send glyph — consistent with the Phase A/B
 * avatars and unmistakably the same product family.
 */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-xl bg-brand-gradient text-white shadow-sm',
        className,
      )}
      role="img"
      aria-label="Incubator Hub"
    >
      <Send className="h-1/2 w-1/2" aria-hidden="true" />
    </span>
  );
}
