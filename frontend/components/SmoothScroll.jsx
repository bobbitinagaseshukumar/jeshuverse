'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

// Cinematic smooth + inertia + momentum scrolling for the whole site.
// Purely presentational: does not touch routing, data, or any logic.
export default function SmoothScroll() {
  useEffect(() => {
    // Respect users who prefer reduced motion
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    });

    // Expose scroll progress as a CSS variable for parallax layers
    lenis.on('scroll', ({ scroll, limit }) => {
      const progress = limit > 0 ? scroll / limit : 0;
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
      document.documentElement.style.setProperty('--scroll-y', `${scroll.toFixed(1)}px`);
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
