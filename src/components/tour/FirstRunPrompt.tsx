import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { TOUR_SEEN_KEY } from '@/components/tour/tour';
import { useTour } from '@/components/tour/useTour';
import { Button } from '@/components/ui/button';

/*
 * Non-blocking first-run nudge. On a first visit (no localStorage flag) it shows
 * a small dismissible card offering the walkthrough. Taking or skipping the tour
 * sets the flag so it doesn't reappear; it can always be re-run from the top-bar
 * "?" or the Help page.
 */
export default function FirstRunPrompt() {
  const { start } = useTour();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(TOUR_SEEN_KEY)) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(TOUR_SEEN_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
      <button
        type="button"
        className="absolute right-3 top-3 text-gray-400 transition hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Dismiss"
        onClick={dismiss}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">New here?</h3>
      <p className="mt-1 text-sm text-gray-600">
        Take a 2-minute walkthrough of how to create and send your first campaign.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => {
            dismiss();
            start();
          }}
        >
          Take the tour
        </Button>
        <Button size="sm" variant="ghost" onClick={dismiss}>
          Skip
        </Button>
      </div>
    </div>
  );
}
