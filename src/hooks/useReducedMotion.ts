import { useEffect, useState } from 'react';

/*
 * Centralised prefers-reduced-motion check. Every animation in the app gates on
 * this so motion can be disabled globally; when reduced, animations are skipped
 * and final state is shown immediately. (A CSS safety net in index.css also
 * forces any remaining CSS animations/transitions to near-instant.)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
