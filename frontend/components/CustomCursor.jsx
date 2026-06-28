'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [clickParticles, setClickParticles] = useState([]);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { stiffness: 400, damping: 28 };
  const cursorSpringX = useSpring(cursorX, springConfig);
  const cursorSpringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'TEXTAREA' ||
        target.closest('a') || 
        target.closest('button') || 
        target.closest('input') ||
        target.closest('.interactive') ||
        target.closest('[role="button"]');
        
      setHovered(!!isInteractive);
    };

    const handleMouseDown = (e) => {
      setClicked(true);
      
      // Generate click explosion particles
      const id = Math.random().toString();
      const newParticles = Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const velocity = 30 + Math.random() * 40;
        return {
          id: `${id}-${i}`,
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(angle) * velocity,
          dy: Math.sin(angle) * velocity,
        };
      });

      setClickParticles((prev) => [...prev, ...newParticles]);
      
      setTimeout(() => {
        setClickParticles((prev) => prev.filter((p) => !p.id.startsWith(id)));
      }, 800);
    };

    const handleMouseUp = () => {
      setClicked(false);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return (
    <>
      {/* Outer cursor glow ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: '-50%',
          translateY: '-50%',
          scale: hovered ? 1.8 : clicked ? 0.8 : 1,
          backgroundColor: hovered ? 'rgba(234, 179, 8, 0.15)' : 'rgba(234, 179, 8, 0)',
          borderColor: hovered ? '#EAB308' : '#7E22CE',
          boxShadow: hovered ? '0 0 15px rgba(234, 179, 8, 0.6)' : 'none',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* Inner solid dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-gold rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorSpringX,
          y: cursorSpringY,
          translateX: '-50%',
          translateY: '-50%',
          scale: hovered ? 0.5 : 1,
        }}
      />

      {/* Click explosion particles */}
      {clickParticles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed top-0 left-0 w-1.5 h-1.5 bg-gold rounded-full pointer-events-none z-[9999]"
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
          animate={{
            x: p.x + p.dx,
            y: p.y + p.dy,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}
