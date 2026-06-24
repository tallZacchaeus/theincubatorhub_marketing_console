import { HelpCircle } from 'lucide-react';
import { glossaryTerm } from '@/content/glossary';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

/*
 * Inline jargon help: an info icon that opens a small popover with the term's
 * plain-language definition, pulled from the shared glossary source so wording
 * stays consistent with the Glossary dialog. Place next to jargon in the UI:
 *   <HelpHint term="audience" />
 */
export default function HelpHint({ term, className }: { term: string; className?: string }) {
  const entry = glossaryTerm(term);
  if (!entry) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 transition hover:text-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            className,
          )}
          aria-label={`What is ${entry.term}?`}
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 rounded-xl text-left" align="start">
        <p className="text-sm font-semibold text-gray-900">{entry.term}</p>
        <p className="mt-1 text-sm text-gray-600">{entry.definition}</p>
        {entry.why ? <p className="mt-2 text-xs text-gray-500">Why it matters: {entry.why}</p> : null}
      </PopoverContent>
    </Popover>
  );
}
