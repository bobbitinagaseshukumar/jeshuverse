'use client';

import React, { Suspense } from 'react';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiXCircle, FiAlertCircle } from 'react-icons/fi';

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'JSV-ORDER';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
      <div className="bg-white border border-purple-100 rounded-3xl p-8 sm:p-12 max-w-md w-full shadow-lg text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <FiXCircle size={36} className="stroke-[2.5px]" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-purple-950">
            Payment Transaction Failed!
          </h1>
          <p className="text-sm text-purple-400 font-bold">
            Order Reference: <span className="font-mono text-primary font-extrabold">{orderId}</span>
          </p>
        </div>

        <p className="text-xs text-purple-900 leading-relaxed font-semibold">
          Your transaction couldn't be processed by the bank networks. No funds were deducted from your account. If amount is debited, it will be refunded automatically within 24 hours.
        </p>

        <div className="flex items-center gap-3 p-4 bg-red-50/50 rounded-2xl border border-red-100/30 text-left text-xs font-semibold text-red-900">
          <FiAlertCircle className="shrink-0" size={20} />
          <span>Please double-check your UPI application PIN, network signals, and retry the payment, or select Cash on Delivery.</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-purple-50">
          <NextLink
            href="/cart"
            className="py-3 bg-purple-50 hover:bg-purple-100 text-primary font-bold text-xs rounded-xl transition-colors block text-center"
          >
            Review Cart
          </NextLink>
          <NextLink
            href="/checkout"
            className="py-3 bg-primary hover:bg-primary-light text-white font-bold text-xs rounded-xl shadow transition-colors block text-center"
          >
            Retry Checkout
          </NextLink>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  );
}
