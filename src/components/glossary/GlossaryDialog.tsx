import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { glossary } from '@/content/glossary';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

/*
 * Searchable glossary. Filters as you type across term + definition so a
 * non-marketer can look up any jargon in one place. Definitions come from the
 * shared glossary source so they match the inline HelpHints exactly.
 */
export default function GlossaryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return glossary;
    return glossary.filter(
      (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg">
        <DialogHeader className="space-y-2 border-b border-gray-100 p-6 pb-4">
          <DialogTitle>Glossary</DialogTitle>
          <DialogDescription>Plain-language definitions of the terms used in this console.</DialogDescription>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <Input
              autoFocus
              className="pl-10"
              placeholder="Search terms…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </DialogHeader>

        <div className="max-h-[55vh] space-y-4 overflow-y-auto p-6">
          {results.length === 0 ? (
            <p className="text-sm text-gray-500">No terms match “{query}”.</p>
          ) : (
            results.map((t) => (
              <div key={t.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <h3 className="text-sm font-semibold text-gray-900">{t.term}</h3>
                <p className="mt-0.5 text-sm text-gray-600">{t.definition}</p>
                {t.why ? <p className="mt-1 text-xs text-gray-500">Why it matters: {t.why}</p> : null}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
