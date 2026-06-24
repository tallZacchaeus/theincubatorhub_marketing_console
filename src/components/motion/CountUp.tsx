import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Animates a number from 0 to its value on mount/update. Formatting is applied on
 * every frame so percentages and thousands separators stay correct. Reduced
 * motion → the final value is shown immediately.
 */
export default function CountUp({
  value,
  format = (n) => Math.round(n).toLocaleString(),
  durationMs = 900,
}: {
  value: number;
  format?: (n: number) => string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        el.textContent = format(value);
        return;
      }
      const obj = { n: 0 };
      gsap.to(obj, {
        n: value,
        duration: durationMs / 1000,
        ease: 'power1.out',
        onUpdate: () => {
          el.textContent = format(obj.n);
        },
      });
    },
    { dependencies: [value, reduced] },
  );

  return <span ref={ref}>{format(reduced ? value : 0)}</span>;
}
