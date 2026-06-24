import { QueryClient } from '@tanstack/react-query';

// Shared server-state cache. Conservative defaults; per-query options are set on
// the call sites added in later phases (Contacts, Audiences, Campaigns, etc.).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});
