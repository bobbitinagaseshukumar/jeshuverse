'use client';

import { useEffect, useRef, useState } from 'react';

// Premium glowing cursor with a trailing ring, magnetic hover scaling,
// and click ripple. Desktop / fine-pointer only. Purely visual.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on devices with a precise pointer (desktop)
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let hovering = false;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      // Detect interactive targets for magnetic / grow effect
      const el = e.target;
      const interactive = el.closest('a, button, input, textarea, select, [role="button"], .cursor-interactive');
      hovering = !!interactive;
    };

    const onDown = () => ring && ring.classList.add('cursor-ring--click');
    const onUp = () => ring && ring.classList.remove('cursor-ring--click');

    let rafId;
    const render = () => {
      // Smooth lag for the trailing ring (inertia)
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ring) {
        const scale = hovering ? 1.8 : 1;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
        ring.style.opacity = hovering ? '1' : '0.6';
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
