'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import NextLink from 'next/link';
import { FiHome, FiFolder, FiPlusCircle, FiShoppingBag, FiSettings, FiMenu, FiX, FiLogOut, FiArrowLeft, FiLayers } from 'react-icons/fi';
import axios from 'axios';
import { API_URL } from '../../../utils/api';

export default function AdminDashboardLayout({ children }) {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    if (user && user.role !== 'admin') {
      router.replace('/admin/login');
    }
  }, [user, token, loading, router]);

  // Check for order notifications
  useEffect(() => {
    if (!token) return;
    const checkNotifications = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/settings/public`);
        setHasNewOrders(res.data.hasNewOrders);
      } catch (err) {
        console.error('Error checking notifications:', err);
      }
    };
    checkNotifications();
    const interval = setInterval(checkNotifications, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [token]);

  const handleMenuClick = async (path) => {
    setSidebarOpen(false);
    if (path === '/admin/dashboard/orders') {
      setHasNewOrders(false);
      try {
        await axios.post(`${API_URL}/admin/settings/clear-notifications`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Failed to clear notifications:', err);
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/admin/login');
  };

  // Admin Inactivity Auto-Logout (2 Days = 172,800,000 ms)
  useEffect(() => {
    if (!token || !isAdmin) return;

    const INACTIVITY_LIMIT = 2 * 24 * 60 * 60 * 1000; // 2 days

    const checkInactivity = () => {
      const lastActive = localStorage.getItem('jv_admin_last_active');
      if (lastActive) {
        const timeElapsed = Date.now() - parseInt(lastActive, 10);
        if (timeElapsed > INACTIVITY_LIMIT) {
          alert('Session expired due to 2 days of inactivity. Logging out...');
          handleLogout();
        }
      } else {
        localStorage.setItem('jv_admin_last_active', Date.now().toString());
      }
    };

    const updateActivity = () => {
      localStorage.setItem('jv_admin_last_active', Date.now().toString());
    };

    // Check immediately on mount
    checkInactivity();

    // Check periodically every 5 minutes
    const interval = setInterval(checkInactivity, 5 * 60 * 1000);

    // Listen to user interaction events to update activity timestamp
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((evt) => {
      window.addEventListener(evt, updateActivity, { passive: true });
    });

    return () => {
      clearInterval(interval);
      events.forEach((evt) => {
        window.removeEventListener(evt, updateActivity);
      });
    };
  }, [token, isAdmin]);

  if (loading || !token || !isAdmin) {
    return (
      <div className="min-h-screen bg-purple-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold tracking-widest text-purple-300">Checking Security Clearances...</p>
      </div>
    );
  }

  const menuItems = [
    { label: 'Overview Stats', path: '/admin/dashboard', icon: FiHome },
    { label: 'Products Manager', path: '/admin/dashboard/products', icon: FiFolder },
    { label: 'Upload Product', path: '/admin/dashboard/products/add', icon: FiPlusCircle },
    { label: 'Categories Manager', path: '/admin/dashboard/categories', icon: FiLayers },
    { label: 'Orders Manager', path: '/admin/dashboard/orders', icon: FiShoppingBag },
    { label: 'Store Settings', path: '/admin/dashboard/settings', icon: FiSettings }
  ];

  return (
    <div className="min-h-screen bg-purple-50/20 flex flex-col lg:flex-row">
      
      {/* Mobile Header Bar */}
      <header className="lg:hidden bg-purple-950 text-white flex items-center justify-between px-4 py-4 border-b border-purple-900 shadow-md">
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-lg tracking-tight text-white">
            JeshuVerse <span className="text-gold">Admin</span>
          </span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-white hover:text-gold">
          <FiMenu size={22} />
        </button>
      </header>

      {/* Sidebar Panel - Desktop Drawer / Mobile Overlay */}
      <aside className={`fixed inset-y-0 left-0 bg-purple-950 text-white w-64 p-6 flex flex-col justify-between z-50 border-r border-purple-900 transform transition-transform duration-300 shadow-2xl lg:shadow-none lg:translate-x-0 lg:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-purple-900 pb-5">
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                Jeshu<span className="text-gold">Verse</span>
              </span>
              <span className="text-[9px] text-gold-light font-bold tracking-widest uppercase block mt-0.5">
                Admin Panel
              </span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-purple-400 hover:text-white">
              <FiX size={20} />
            </button>
          </div>

          {/* Links list */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const active = pathname === item.path;
              return (
                <NextLink
                  key={item.label}
                  href={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-gold text-primary-dark shadow-md font-bold'
                      : 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                  }`}
                >
                  <IconComp size={18} className={active ? 'stroke-[2.5px]' : ''} />
                  <span>{item.label}</span>
                  {item.path === '/admin/dashboard/orders' && hasNewOrders && (
                    <span className="relative flex h-2.5 w-2.5 ml-auto">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-lg shadow-red-500/50"></span>
                    </span>
                  )}
                </NextLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-purple-900">
          <NextLink
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-purple-300 hover:bg-purple-900/30 hover:text-white transition-all"
          >
            <FiArrowLeft size={16} />
            <span>Go to Storefront</span>
          </NextLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-200 transition-all"
          >
            <FiLogOut size={16} />
            <span>Logout Panel</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10">
        {children}
      </main>

    </div>
  );
}
