import { BookOpen, HelpCircle, PlayCircle } from 'lucide-react';
import { useGlossary } from '@/components/glossary/GlossaryProvider';
import { useTour } from '@/components/tour/useTour';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/*
 * Top-bar "?" menu: open the searchable glossary or restart the guided
 * walkthrough from anywhere. Lives inside GlossaryProvider so it can open the
 * shared dialog.
 */
export default function TopBarHelp() {
  const { openGlossary } = useGlossary();
  const { start } = useTour();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={openGlossary}>
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Glossary
        </DropdownMenuItem>
        <DropdownMenuItem onClick={start}>
          <PlayCircle className="h-4 w-4" aria-hidden="true" />
          Restart walkthrough
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
