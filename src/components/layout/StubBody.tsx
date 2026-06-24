import { Hammer } from 'lucide-react';
import { Card } from '@/components/ui/card';

/*
 * Temporary page body for Phase C. Real content arrives in Phase E (and Help in
 * Phase F). Kept deliberately plain so the shell — not the placeholder — is what
 * gets reviewed.
 */
export default function StubBody({ note }: { note?: string }) {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Card className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Hammer className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-gray-700">Coming in the next step</p>
        <p className="max-w-md text-sm text-muted-foreground">
          {note ?? 'This page is part of the new console and will be built out shortly.'}
        </p>
      </Card>
    </div>
  );
}
