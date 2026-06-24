import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Staggered fade-and-rise reveal of a container's direct children, played on
 * mount (i.e. on route change). Drop-in replacement for a page's body <div>:
 *   <Reveal className="space-y-6 px-4 py-6">…sections…</Reveal>
 * Reduced motion → children render in place with no animation.
 */
export default function Reveal({
  children,
  className,
  stagger = 0.06,
  y = 12,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const targets = Array.from(ref.current.children);
      if (!targets.length) return;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.4,
        stagger,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
