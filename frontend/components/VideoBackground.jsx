'use client';

import { useRef, useState } from 'react';

// Fixed video backdrop that stays in place while content scrolls over it.
// Cycles through the videos placed in /public.
const VIDEOS = ['/bg-1.mp4', '/bg-2.mp4', '/bg-3.mp4'];

export default function VideoBackground() {
  const videoRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Advance to the next clip when one finishes
  const handleEnded = () => {
    setIndex((i) => (i + 1) % VIDEOS.length);
  };

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Fixed video layer — stays in place, content scrolls over it */}
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

      {/* Dark veil — keeps video subtle while text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      {/* Cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
