'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

// In Next.js, importing from 'next/link' is correct
import NextLink from 'next/link';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // Hide header on admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: "Women's Wear", path: '/category/women-wear' },
    { name: "Men's Wear", path: '/category/men-wear' },
    { name: "Kids Wear", path: '/category/kids-wear' },
    { name: "Jewellery", path: '/category/jewellery' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Menu button for mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-purple-900 hover:text-amber-500 p-2 focus:outline-none"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <NextLink href="/" className="flex flex-col">
              <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-primary">
                Jeshu<span className="text-gold">Verse</span>
              </span>
              <span className="text-[10px] text-center tracking-widest font-medium uppercase text-purple-700 -mt-1 block">
                Fashion For Everyone
              </span>
            </NextLink>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search premium styles, sarees, jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-full bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-purple-400 text-purple-950 transition-all"
              />
              <button type="submit" className="absolute right-3.5 top-3 text-purple-500 hover:text-primary transition-colors">
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Icons navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Desktop Categories Links */}
            <nav className="hidden lg:flex items-center gap-6 mr-4">
              {categories.map((cat) => (
                <NextLink
                  key={cat.name}
                  href={cat.path}
                  className="text-sm font-semibold text-purple-950 hover:text-amber-500 transition-colors"
                >
                  {cat.name}
                </NextLink>
              ))}
            </nav>

            {/* Wishlist */}
            <NextLink href="/profile?tab=wishlist" className="relative p-2.5 text-purple-900 hover:text-amber-500 hover:bg-purple-50 rounded-full transition-all">
              <FiHeart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white animate-bounce-slow">
                  {wishlistItems.length}
                </span>
              )}
            </NextLink>

            {/* Cart */}
            <NextLink href="/cart" className="relative p-2.5 text-purple-900 hover:text-amber-500 hover:bg-purple-50 rounded-full transition-all">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-light text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </NextLink>

            {/* User Access */}
            {user ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-purple-50 text-purple-900 hover:text-primary transition-all">
                  <FiUser size={20} />
                  <span className="text-xs font-semibold max-w-[80px] truncate">{user.name || 'Profile'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-purple-100 rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="px-4 py-2.5 border-b border-purple-50">
                    <p className="text-xs text-purple-400">Signed in as</p>
                    <p className="text-sm font-bold text-purple-950 truncate">{user.name || user.phone}</p>
                  </div>
                  <NextLink href={user.role === 'admin' ? '/admin/dashboard' : '/profile'} className="block px-4 py-2.5 text-sm text-purple-900 hover:bg-purple-50 hover:text-primary font-medium">
                    {user.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                  </NextLink>
                  <NextLink href="/profile?tab=orders" className="block px-4 py-2.5 text-sm text-purple-900 hover:bg-purple-50 hover:text-primary font-medium">
                    Order History
                  </NextLink>
                  <button onClick={logout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold border-t border-purple-50">
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <NextLink href="/login" className="hidden md:flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary-light transition-all">
                <FiUser size={16} />
                <span>Login</span>
              </NextLink>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-purple-100 bg-white px-4 py-3 space-y-3 shadow-inner">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-purple-50/50 border border-purple-100 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-purple-950"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-purple-500">
              <FiSearch size={16} />
            </button>
          </form>
          <div className="grid grid-cols-2 gap-2 pb-2">
            {categories.map((cat) => (
              <NextLink
                key={cat.name}
                href={cat.path}
                onClick={() => setMenuOpen(false)}
                className="block text-center py-2 bg-purple-50/50 hover:bg-purple-100 rounded-lg text-sm font-semibold text-purple-900 transition-colors"
              >
                {cat.name}
              </NextLink>
            ))}
          </div>
          {user ? (
            <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
              <NextLink
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-bold text-purple-900"
              >
                <FiUser size={18} /> My Profile ({user.name || user.phone})
              </NextLink>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <NextLink
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-center py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-md hover:bg-primary-light"
            >
              Login / Register
            </NextLink>
          )}
        </div>
      )}
    </header>
  );
}
