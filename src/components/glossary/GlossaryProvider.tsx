import { createContext, useContext, useState, type ReactNode } from 'react';
import GlossaryDialog from '@/components/glossary/GlossaryDialog';

interface GlossaryContextValue {
  openGlossary: () => void;
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

/*
 * Mounts a single Glossary dialog and exposes openGlossary() so the top-bar "?"
 * and the Help page can both open it from anywhere in the shell.
 */
export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <GlossaryContext.Provider value={{ openGlossary: () => setOpen(true) }}>
      {children}
      <GlossaryDialog open={open} onOpenChange={setOpen} />
    </GlossaryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGlossary(): GlossaryContextValue {
  const ctx = useContext(GlossaryContext);
  if (!ctx) throw new Error('useGlossary must be used within a <GlossaryProvider>.');
  return ctx;
}
