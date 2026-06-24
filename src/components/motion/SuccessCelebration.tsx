import { useRef } from 'react';
import { Check } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Brief, tasteful success cue played after a campaign is sent or test-sent: an
 * animated checkmark with a light confetti burst, then it settles and calls
 * onDone. Non-blocking (pointer-events-none). Reduced motion → a quick static
 * check that dismisses itself.
 */
const CONFETTI = ['#16a34a', '#22c55e', '#60a5fa', '#f59e0b', '#ec4899'];

export default function SuccessCelebration({ open, onDone }: { open: boolean; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!open || !ref.current) return;
      const circle = ref.current.querySelector('[data-cue-circle]');
      const dots = ref.current.querySelectorAll('[data-cue-dot]');

      if (reduced) {
        gsap.set(circle, { scale: 1, opacity: 1 });
        const t = window.setTimeout(onDone, 700);
        return () => window.clearTimeout(t);
      }

      const tl = gsap.timeline({ onComplete: onDone });
      tl.fromTo(circle, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
      tl.fromTo(
        dots,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        {
          x: () => gsap.utils.random(-90, 90),
          y: () => gsap.utils.random(-90, 90),
          opacity: 0,
          scale: 0.4,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.01,
        },
        '-=0.1',
      );
      tl.to(circle, { opacity: 0, duration: 0.3, delay: 0.4 }, '>-0.1');
    },
    { dependencies: [open, reduced], scope: ref },
  );

  if (!open) return null;

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center">
      <div className="relative">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            data-cue-dot
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: CONFETTI[i % CONFETTI.length] }}
          />
        ))}
        <span
          data-cue-circle
          className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gradient text-white shadow-xl"
        >
          <Check className="h-10 w-10" strokeWidth={3} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
