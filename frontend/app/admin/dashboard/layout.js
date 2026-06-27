'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import NextLink from 'next/link';
import { FiHome, FiFolder, FiPlusCircle, FiShoppingBag, FiSettings, FiMenu, FiX, FiLogOut, FiArrowLeft } from 'react-icons/fi';

export default function AdminDashboardLayout({ children }) {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleLogout = () => {
    logout();
    router.replace('/admin/login');
  };

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
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-gold text-primary-dark shadow-md font-bold'
                      : 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                  }`}
                >
                  <IconComp size={18} className={active ? 'stroke-[2.5px]' : ''} />
                  <span>{item.label}</span>
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
      <main className="flex-1 p-6 sm:p-10 max-h-screen overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
