'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Luxury one-time intro loader: animated brand logo, orbiting particles,
// dynamic percentage counter and a smooth curtain exit.
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Show only once per browser session so navigation stays instant
    if (typeof window !== 'undefined' && sessionStorage.getItem('jv_intro_done')) {
      setDone(true);
      return;
    }

    let val = 0;
    const interval = setInterval(() => {
      // Ease toward 100 with a little randomness for a premium feel
      val += Math.max(1, (100 - val) * 0.08);
      if (val >= 100) {
        val = 100;
        clearInterval(interval);
        setTimeout(() => {
          sessionStorage.setItem('jv_intro_done', '1');
          setDone(true);
        }, 500);
      }
      setProgress(Math.floor(val));
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0414] overflow-hidden"
        >
          {/* Aurora glow */}
          <div className="absolute w-[60vw] h-[60vw] rounded-full bg-primary/30 blur-[120px] animate-pulse" />
          <div className="absolute w-[40vw] h-[40vw] rounded-full bg-gold/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

          {/* Orbiting particles */}
          {[...Array(12)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-gold"
              style={{ left: '50%', top: '50%' }}
              animate={{
                x: [0, Math.cos((i / 12) * Math.PI * 2) * 120, 0],
                y: [0, Math.sin((i / 12) * Math.PI * 2) * 120, 0],
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.4, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
            />
          ))}

          {/* Brand logo */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center"
          >
            <motion.h1
              className="font-display font-black text-5xl sm:text-7xl tracking-tight"
              animate={{ textShadow: ['0 0 20px rgba(234,179,8,0.3)', '0 0 40px rgba(234,179,8,0.7)', '0 0 20px rgba(234,179,8,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-white">Jeshu</span>
              <span className="text-gold">Verse</span>
            </motion.h1>
            <p className="mt-3 text-purple-300 text-[10px] sm:text-xs tracking-[0.4em] uppercase font-bold">
              Fashion For Everyone
            </p>

            {/* Progress bar */}
            <div className="mt-8 w-56 sm:w-72 mx-auto h-[3px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-light via-gold to-gold-light"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
            <p className="mt-3 font-mono text-gold text-sm font-bold tabular-nums">{progress}%</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
