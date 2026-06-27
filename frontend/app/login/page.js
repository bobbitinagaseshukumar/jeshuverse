'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { FiPhone, FiLock, FiInfo } from 'react-icons/fi';

function LoginContent() {
  const { user, sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Dev Helper State
  const [devOtp, setDevOtp] = useState('');

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      router.push(redirect ? `/${redirect}` : '/');
    }
  }, [user, redirect, router]);

  // Request OTP Dispatch
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      // Format phone to standard Indian format if not already styled
      let formattedPhone = phone;
      if (!phone.startsWith('91') && !phone.startsWith('+91')) {
        formattedPhone = `91${phone}`;
      } else if (phone.startsWith('+')) {
        formattedPhone = phone.replace('+', '');
      }

      const resData = await sendOtp(formattedPhone);
      setStep(2);
      
      // Save OTP to dev state for immediate user display
      if (resData.otp) {
        setDevOtp(resData.otp);
      }
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
      let formattedPhone = phone;
      if (!phone.startsWith('91') && !phone.startsWith('+91')) {
        formattedPhone = `91${phone}`;
      } else if (phone.startsWith('+')) {
        formattedPhone = phone.replace('+', '');
      }

      await verifyOtp(formattedPhone, otp);
      // AuthContext handles state save. Redirect is triggered by useEffect.
    } catch (err) {
      setErrorMsg(err || 'Incorrect verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
      <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-lg space-y-6">
        
        {/* Title */}
        <div className="text-center">
          <span className="font-display font-extrabold text-2xl tracking-tight text-primary">
            Jeshu<span className="text-gold">Verse</span>
          </span>
          <p className="text-xs text-purple-400 font-bold tracking-widest uppercase mt-1">
            Fashion For Everyone
          </p>
          <h2 className="font-display font-extrabold text-lg sm:text-xl text-purple-950 mt-6">
            {step === 1 ? 'Login or Register' : 'Enter OTP Verification'}
          </h2>
          <p className="text-xs text-purple-400 mt-1">
            {step === 1 
              ? 'Enter your mobile number to proceed' 
              : `Verification code sent to +${phone}`}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100/30">
            {errorMsg}
          </div>
        )}

        {/* Step 1 Form: Mobile input */}
        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Mobile Number</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  maxLength={12}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-9 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950"
                />
                <FiPhone className="absolute left-3.5 top-3.5 text-purple-400" size={14} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-light text-white font-extrabold rounded-2xl shadow-md transition-colors text-sm"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          
          /* Step 2 Form: OTP input */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            
            {/* Dev Mode Notification Badge */}
            {devOtp && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-100/30 text-left">
                <FiInfo className="shrink-0 text-emerald-600" size={16} />
                <span>Developer Mode: Use OTP Code <span className="font-mono text-primary font-extrabold text-sm">{devOtp}</span> to verify.</span>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-purple-950 uppercase tracking-wide block mb-1.5">Enter 6-Digit OTP</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full pl-9 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-sm placeholder-purple-300 text-purple-950 tracking-widest font-mono text-center"
                />
                <FiLock className="absolute left-3.5 top-3.5 text-purple-400" size={14} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-light text-white font-extrabold rounded-2xl shadow-md transition-colors text-sm"
            >
              {loading ? 'Verifying OTP...' : 'Verify & Log In'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setDevOtp('');
              }}
              className="w-full text-center text-xs text-primary hover:underline font-bold mt-2"
            >
              Change phone number
            </button>
          </form>
        )}

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
