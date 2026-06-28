'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Cinematic scroll-reveal wrapper. Children animate in with depth as they
// enter the viewport. Direction: 'up' | 'down' | 'left' | 'right' | 'zoom'.
const variants = {
  up: { hidden: { opacity: 0, y: 60, rotateX: -8 }, show: { opacity: 1, y: 0, rotateX: 0 } },
  down: { hidden: { opacity: 0, y: -60 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -70 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 70 }, show: { opacity: 1, x: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } },
};

export default function Reveal({ children, className = '', direction = 'up', delay = 0, amount = 0.2 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={variants[direction] || variants.up}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}
