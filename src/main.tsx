import { StrictMode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { AuthProvider } from '@/auth/AuthContext';
import { queryClient } from '@/lib/queryClient';
import '@/lib/gsap'; // register GSAP plugins (useGSAP, Flip)
import '@/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('App mount element (#root) was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
