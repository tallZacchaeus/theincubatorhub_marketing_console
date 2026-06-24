import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { runTour } from '@/components/tour/tour';
import type { Broadcast, PageMeta } from '@/types';

/*
 * Binds the walkthrough to the router + the React Query cache so campaign-detail
 * steps can deep-link to a real campaign when one exists. Respects
 * prefers-reduced-motion.
 */
export function useTour() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function start() {
    const cached =
      queryClient.getQueryData<{ campaigns: Broadcast[]; meta: PageMeta }>(['broadcasts', 'list']) ??
      queryClient.getQueryData<{ campaigns: Broadcast[]; meta: PageMeta }>(['broadcasts', 'home']);
    const firstCampaignId = cached?.campaigns?.[0]?.id;
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    runTour(navigate, { firstCampaignId, reducedMotion });
  }

  return { start };
}
