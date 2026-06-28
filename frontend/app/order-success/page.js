'use client';

import React, { useEffect, Suspense } from 'react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiShoppingBag, FiTruck } from 'react-icons/fi';
import confetti from 'canvas-confetti';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'JSV-ORDER';

  useEffect(() => {
    // Premium celebration effect on order completion success
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
      <div className="glass-dark-premium rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-2xl text-center space-y-6 neon-gold-border">
        <div className="w-20 h-20 bg-emerald-950/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner animate-float-slow" style={{ boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
          <FiCheckCircle size={36} className="stroke-[2.5px]" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-gray-500 font-bold">
            Order ID: <span className="font-mono text-primary font-extrabold">{orderId}</span>
          </p>
        </div>

        <p className="text-xs text-gray-200 leading-relaxed font-semibold">
          Thank you for shopping at JeshuVerse! We have received your order. Our warehouse team is preparing your package. A confirmation message with tracking details has been generated.
        </p>

        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 text-left text-xs font-semibold text-gray-200">
          <FiTruck className="text-gold shrink-0" size={20} />
          <span>Expected delivery within 3 - 5 business days across India.</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          <NextLink
            href="/profile?tab=orders"
            className="py-3 bg-white/5 hover:bg-white/10 text-primary font-bold text-xs rounded-xl transition-all duration-300 block text-center btn-premium"
          >
            Track Order
          </NextLink>
          <NextLink
            href="/"
            className="py-3 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/30 transition-all duration-300 block text-center btn-premium btn-ripple"
          >
            Continue Shopping
          </NextLink>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
