'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiInfo, FiArrowRight, FiShield, FiTruck, FiGift } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function LoginContent() {
  const { user, sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter ID, 2: Enter OTP
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [devOtp, setDevOtp] = useState('');

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      router.push(redirect ? `/${redirect}` : '/');
    }
  }, [user, redirect, router]);

  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMsg('Please enter your email or mobile number');
      return;
    }

    const isEmail = cleanId.includes('@');
    if (!isEmail && cleanId.length < 10) {
      setErrorMsg('Please enter a valid mobile number or email');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      let formattedId = cleanId;
      // If purely numeric, format standard mobile
      if (!isEmail) {
        const numeric = cleanId.replace(/\D/g, '');
        if (numeric.length >= 10) {
          formattedId = numeric;
          if (!formattedId.startsWith('91') && !formattedId.startsWith('+91')) {
            formattedId = `91${formattedId}`;
          }
        }
      }

      const resData = await sendOtp(formattedId);
      setStep(2);
      setDevOtp('123456'); // Configured backend dummy OTP
    } catch (err) {
      setErrorMsg(err || 'Failed to dispatch OTP code');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setErrorMsg('Please enter a 6-digit OTP code');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const cleanId = identifier.trim();
      let formattedId = cleanId;
      if (!cleanId.includes('@')) {
        const numeric = cleanId.replace(/\D/g, '');
        formattedId = numeric;
        if (!formattedId.startsWith('91') && !formattedId.startsWith('+91')) {
          formattedId = `91${formattedId}`;
        }
      }

      await verifyOtp(formattedId, otp);
    } catch (err) {
      setErrorMsg(err || 'Incorrect verification code. Please enter 123456.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { icon: FiTruck, text: 'Free delivery on orders above ₹499' },
    { icon: FiShield, text: 'Secure UPI payments & easy returns' },
    { icon: FiGift, text: 'Member-only offers & early access' },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-xl shadow-black/30 border border-white/10 bg-[#111]"
      >
        {/* ---------- Left brand panel ---------- */}
        <div className="relative hidden md:flex flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white">
          {/* soft decorative glows */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <span className="font-display font-black text-3xl tracking-tight">
              Jeshu<span className="text-gold">Verse</span>
            </span>
            <p className="text-[10px] tracking-[0.35em] uppercase text-purple-200 mt-1">
              Fashion For Everyone
            </p>
          </div>

          <div className="relative z-10">
            <h3 className="font-display font-extrabold text-3xl leading-tight">
              Step into a world of <span className="text-gold">premium</span> ethnic fashion.
            </h3>
            <p className="text-purple-200 text-sm mt-3 leading-relaxed max-w-sm">
              Sign in to track orders, save your favourites, and unlock exclusive member pricing.
            </p>

            <div className="mt-8 space-y-3">
              {perks.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm text-gold shrink-0">
                    <p.icon size={16} />
                  </span>
                  <span className="text-sm text-purple-100 font-medium">{p.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-purple-300/80">
            © {new Date().getFullYear()} JeshuVerse. Crafted with care.
          </div>
        </div>

        {/* ---------- Right form panel ---------- */}
        <div className="p-7 sm:p-10 flex flex-col justify-center">
          {/* Mobile logo */}
          <div className="md:hidden mb-6 text-center">
            <span className="font-display font-black text-2xl text-primary tracking-tight">
              Jeshu<span className="text-gold">Verse</span>
            </span>
          </div>

          <div className="mb-6">
            <h2 className="font-display font-extrabold text-2xl text-white">
              {step === 1 ? 'Welcome back' : 'Verify it\u2019s you'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1
                ? 'Sign in with your email or mobile number'
                : `We sent a 6-digit code to ${identifier}`}
            </p>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1.5 rounded-full flex-1 bg-primary transition-all" />
            <span className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step === 2 ? 'bg-primary' : 'bg-white/10'}`} />
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-red-950/30 text-red-400 text-xs font-semibold rounded-xl border border-red-800/30">
                  {errorMsg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                onSubmit={handleRequestOtp}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="you@email.com or 98765 43210"
                      className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 focus:border-primary focus:bg-white/10 focus:ring-2 focus:ring-primary/15 focus:outline-none rounded-xl text-sm text-white placeholder-gray-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary hover:bg-primary-light disabled:opacity-70 text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <FiArrowRight size={16} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                onSubmit={handleVerifyOtp}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                <div className="flex items-start gap-2.5 p-3 bg-emerald-950/30 text-emerald-300 text-xs font-medium rounded-xl border border-emerald-800/30">
                  <FiInfo className="shrink-0 text-emerald-400 mt-0.5" size={16} />
                  <span>
                    Developer sandbox — use code{' '}
                    <span className="font-mono font-bold text-primary bg-white/10 px-1.5 py-0.5 rounded">123456</span>{' '}
                    to sign in.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 focus:border-primary focus:bg-white/10 focus:ring-2 focus:ring-primary/15 focus:outline-none rounded-xl text-base text-white placeholder-gray-500 tracking-[0.4em] font-mono text-center font-bold transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary hover:bg-primary-light disabled:opacity-70 text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Verify & Continue'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                    setErrorMsg('');
                  }}
                  className="w-full text-center text-xs text-gray-400 hover:text-primary font-semibold transition-colors"
                >
                  ← Use a different email or phone
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-[11px] text-gray-400 leading-relaxed">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
