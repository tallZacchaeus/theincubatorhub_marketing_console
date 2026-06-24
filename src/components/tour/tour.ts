import { driver, type Driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const TOUR_SEEN_KEY = 'mc_tour_seen';

interface TourStep {
  route: string;
  element: string;
  title: string;
  description: string;
}

/*
 * The guided "create your first campaign" walkthrough, following the 5-step flow.
 * It only navigates and highlights — it never sends. Campaign-detail steps
 * deep-link to the first existing campaign when one is known; otherwise they fall
 * back to the Campaigns page with narration so the tour always completes.
 */
function buildSteps(firstCampaignId?: number): TourStep[] {
  const detailRoute = firstCampaignId ? `/campaigns/${firstCampaignId}` : '/campaigns';
  const onDetail = Boolean(firstCampaignId);
  return [
    {
      route: '/audiences',
      element: '[data-tour="new-audience"]',
      title: '1. Build an audience',
      description: 'First, choose who to email. Create or pick an audience.',
    },
    {
      route: '/templates',
      element: '[data-tour="new-template"]',
      title: '2. Design an email',
      description: "Write the email once; placeholders fill in each person's details.",
    },
    {
      route: '/campaigns',
      element: '[data-tour="new-campaign"]',
      title: '3. Create a campaign',
      description: 'Combine an audience and a template into a campaign.',
    },
    {
      route: detailRoute,
      element: onDetail ? '[data-tour="add-link"]' : '[data-tour="new-campaign"]',
      title: '4. Add tracked links',
      description: onDetail
        ? 'Add tracked links so you can see what each group clicks.'
        : 'Open a campaign, then add tracked links so you can see what each group clicks.',
    },
    {
      route: detailRoute,
      element: onDetail ? '[data-tour="preview-actions"]' : '[data-tour="new-campaign"]',
      title: '5. Preview & test-send',
      description: 'Always preview and send a test to yourself before going live.',
    },
    {
      route: '/analytics',
      element: '[data-tour="nav-analytics"]',
      title: '6. See results',
      description: 'After sending, this is where you see opens, clicks, and signups.',
    },
  ];
}

let active: Driver | null = null;

/** Start the walkthrough. `navigate` is react-router's navigate; reduced-motion disables animation. */
export function runTour(
  navigate: (path: string) => void,
  opts: { firstCampaignId?: number; reducedMotion?: boolean } = {},
): void {
  if (active) {
    active.destroy();
    active = null;
  }
  const steps = buildSteps(opts.firstCampaignId);

  const markSeen = () => {
    try {
      localStorage.setItem(TOUR_SEEN_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const d: Driver = driver({
    showProgress: true,
    allowClose: true,
    animate: !opts.reducedMotion,
    overlayColor: 'rgba(17, 24, 39, 0.5)',
    nextBtnText: 'Next',
    prevBtnText: 'Back',
    doneBtnText: 'Done',
    steps: steps.map((s) => ({ element: s.element, popover: { title: s.title, description: s.description } })),
    onNextClick: () => {
      const i = d.getActiveIndex() ?? 0;
      const next = steps[i + 1];
      if (!next) {
        d.destroy();
        return;
      }
      navigate(next.route);
      window.setTimeout(() => d.moveNext(), 400);
    },
    onPrevClick: () => {
      const i = d.getActiveIndex() ?? 0;
      const prev = steps[i - 1];
      if (!prev) return;
      navigate(prev.route);
      window.setTimeout(() => d.movePrevious(), 400);
    },
    onDestroyed: () => {
      markSeen();
      active = null;
    },
  });

  active = d;
  navigate(steps[0].route);
  window.setTimeout(() => d.drive(), 400);
}
