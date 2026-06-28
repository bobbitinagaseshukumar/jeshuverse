'use client';

import { useEffect, useRef, useState } from 'react';

// Cinematic fixed video backdrop that drifts + subtly zooms as you scroll,
// giving a parallax / 3D-depth feel. A soft veil keeps page text readable.
// Cycles through the videos placed in /public.
const VIDEOS = ['/bg-1.mp4', '/bg-2.mp4', '/bg-3.mp4'];

export default function VideoBackground() {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Scroll-driven parallax (drift + scale). Uses rAF for smoothness.
  useEffect(() => {
    let rafId;
    let current = 0;
    let target = 0;

    const onScroll = () => {
      target = window.scrollY || window.pageYOffset || 0;
    };

    const render = () => {
      // Ease toward the real scroll position for buttery parallax
      current += (target - current) * 0.08;
      const wrap = wrapRef.current;
      if (wrap) {
        const drift = current * 0.18;          // background moves slower than content
        const scale = 1.15 + Math.min(current / 6000, 0.12);
        wrap.style.transform = `translate3d(0, ${drift.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      }
      rafId = requestAnimationFrame(render);
    };

    onScroll();
    rafId = requestAnimationFrame(render);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Advance to the next clip when one finishes
  const handleEnded = () => {
    setIndex((i) => (i + 1) % VIDEOS.length);
  };

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Parallax video layer (slightly oversized so edges never show) */}
      <div ref={wrapRef} className="absolute inset-0 will-change-transform">
        <video
          ref={videoRef}
          key={VIDEOS[index]}
          className="w-full h-full object-cover"
          src={VIDEOS[index]}
          autoPlay
          muted
          playsInline
          onEnded={handleEnded}
          preload="auto"
        />
      </div>

      {/* Dark "black mirror" veil — keeps video vivid while text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65" />
      {/* subtle brand tint + cinematic vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-transparent to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
