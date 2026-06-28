'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiInfo, FiChevronRight, FiStar } from 'react-icons/fi';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';

// Heavy WebGL 3D scene, client-side only
const Login3DScene = dynamic(() => import('../../components/Login3DScene'), {
  ssr: false,
});


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

  // 3D Card Hover Effect using Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map position values to 3D rotation angles
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

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

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-950">
      
      {/* Heavy WebGL 3D scene: morphing orb, gold ring, crystals, stars */}
      <div className="absolute inset-0 z-0">
        <Login3DScene />
      </div>

      {/* Premium ambient blur blobs (high performance, lightweight) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-[100px] top-[-10%] left-[-10%] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 0.9, 1.1],
          x: [0, -50, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[32rem] h-[32rem] rounded-full bg-gold/5 blur-[120px] bottom-[-15%] right-[-10%] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [0.95, 1.1, 0.95],
          x: [0, 40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[24rem] h-[24rem] rounded-full bg-purple-500/10 blur-[90px] top-[30%] left-[20%] pointer-events-none"
      />

      {/* 3D Perspective Card Wrapper */}
      <div 
        style={{ perspective: 1200 }} 
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouse}
          onMouseLeave={handleMouseLeave}
          className="bg-white/85 backdrop-blur-xl border border-purple-100/40 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col space-y-6"
        >
          {/* Header */}
          <div style={{ transform: "translateZ(50px)" }} className="text-center">
            <div className="inline-flex p-3 bg-purple-50 rounded-2xl mb-4 text-primary shadow-inner">
              <FiStar size={24} className="animate-pulse text-gold fill-gold" />
            </div>
            
            <h2 className="font-display font-extrabold text-2xl tracking-tight text-purple-950">
              Welcome to <span className="text-primary font-black">Jeshu<span className="text-gold">Verse</span></span>
            </h2>
            <p className="text-[10px] text-purple-400 font-bold tracking-widest uppercase mt-1">
              Verify your identity instantly
            </p>
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100/30"
            >
              {errorMsg}
            </motion.div>
          )}

          {/* Form */}
          <div style={{ transform: "translateZ(30px)" }}>
            {step === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">
                    Email Address or Mobile Number
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. mobile or user@email.com"
                      className="input-glow w-full pl-9 pr-3 py-3 bg-purple-50/50 border border-purple-100/80 focus:border-primary focus:outline-none rounded-xl text-sm placeholder-purple-300 text-purple-950 transition-all font-semibold"
                    />
                    <FiMail className="absolute left-3 top-3.5 text-purple-400 group-focus-within:text-primary transition-colors" size={16} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full py-3 bg-primary hover:bg-primary-light text-white font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-sm flex items-center justify-center gap-1"
                >
                  <span>{loading ? 'Sending OTP Code...' : 'Send Login OTP'}</span>
                  <FiChevronRight size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                
                {/* Dev OTP Note */}
                <div className="flex items-center gap-2 p-3.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100/30 text-left leading-relaxed">
                  <FiInfo className="shrink-0 text-emerald-600 animate-bounce" size={18} />
                  <span>Developer Sandbox: Enter OTP code <span className="font-mono text-primary font-black text-sm bg-white px-2 py-0.5 rounded shadow-sm">123456</span> to access.</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 123456"
                      className="input-glow w-full pl-9 pr-3 py-3 bg-purple-50/50 border border-purple-100 focus:outline-none focus:border-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 tracking-widest font-mono text-center font-bold"
                    />
                    <FiLock className="absolute left-3.5 top-3.5 text-purple-400" size={14} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full py-3 bg-primary hover:bg-primary-light text-white font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all text-sm"
                >
                  {loading ? 'Verifying...' : 'Verify & Enter Shop'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                  }}
                  className="w-full text-center text-xs text-primary hover:underline font-bold mt-2"
                >
                  Change Email or Phone
                </button>
              </form>
            )}
          </div>
          
        </motion.div>
      </div>

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
