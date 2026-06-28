'use client';
import React from 'react';

const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  size: 2 + (i % 4),
  left: `${(i * 4.5) % 100}%`,
  delay: `${(i * 0.7) % 8}s`,
  duration: `${12 + (i % 10)}s`,
  color: i % 3 === 0 ? 'rgba(234,179,8,0.4)' : 'rgba(234,179,8,0.2)',
}));

export default function FloatingParticles() {
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 hidden md:block" 
      aria-hidden="true"
      style={{
        transform: 'translateY(calc(var(--scroll-y, 0px) * -0.22))',
        height: '140vh',
        willChange: 'transform'
      }}
    >
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute rounded-full animate-particle-rise"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            bottom: '-10px',
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
