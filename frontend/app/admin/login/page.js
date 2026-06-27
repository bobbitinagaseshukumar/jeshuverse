'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../utils/api';

export default function AdminLoginPage() {
  const { user, loading: authLoading, adminLogin } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!authLoading && user?.role === 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [authLoading, user, router]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setErrorMsg('Please enter both username and password');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await adminLogin(cleanUsername, password);
      router.replace('/admin/dashboard');
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : err?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 p-4 sm:p-6 overflow-y-auto">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="bg-purple-950/80 backdrop-blur-xl border border-purple-800/80 rounded-3xl p-6 sm:p-10 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 text-white relative z-10">
        <div className="text-center">
          <span className="font-display font-extrabold text-3xl tracking-tight text-white">
            Jeshu<span className="text-gold">Verse</span>
          </span>
          <p className="text-[10px] text-gold-light font-bold tracking-widest uppercase mt-1">
            Admin Management Portal
          </p>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-800 to-transparent my-6" />
          <h2 className="font-display font-extrabold text-lg sm:text-xl text-white">
            Administrator Login
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Access secure dashboard parameters
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-bold rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gold uppercase tracking-wide block mb-1.5">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. admin"
                className="w-full pl-9 pr-3 py-2.5 bg-purple-900/40 border border-purple-800/60 focus:outline-none focus:ring-1 focus:ring-gold rounded-xl text-sm placeholder-purple-400 text-white transition-all"
              />
              <FiUser className="absolute left-3.5 top-3.5 text-purple-400" size={14} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gold uppercase tracking-wide block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full pl-9 pr-10 py-2.5 bg-purple-900/40 border border-purple-800/60 focus:outline-none focus:ring-1 focus:ring-gold rounded-xl text-sm placeholder-purple-400 text-white transition-all"
              />
              <FiLock className="absolute left-3.5 top-3.5 text-purple-400" size={14} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-purple-400 hover:text-gold transition-colors"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full py-3 bg-gold hover:bg-gold-light text-primary-dark font-extrabold rounded-2xl shadow-lg transition-all text-sm uppercase tracking-wider disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In To Panel'}
          </button>
        </form>



        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-xs text-purple-300 hover:text-white transition-colors"
          >
            &larr; Back to Storefront
          </button>
        </div>
      </div>
    </div>
  );
}
