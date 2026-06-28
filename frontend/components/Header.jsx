'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiHeart, 
  FiMenu, 
  FiX, 
  FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Magnetic from './Magnetic';

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const wishlistItems = wishlist ? wishlist : [];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: "All Products", path: '/category/all' },
    { name: "New Arrivals", path: '/category/all?sort=latest' },
    { name: "Women's Wear", path: '/category/women-wear' },
    { name: "Men's Wear", path: '/category/men-wear' },
    { name: "Kids Wear", path: '/category/kids-wear' },
    { name: "Jewellery", path: '/category/jewellery' }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark-premium shadow-lg shadow-black/30 border-b border-white/5' : 'bg-black/40 backdrop-blur-sm border-b border-white/5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-4 transition-all duration-500 ${scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'}`}>
          
          {/* Menu button for mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white hover:text-gold p-2 focus:outline-none"
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <NextLink href="/" className="flex flex-col">
              <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                Jeshu<span className="text-gold">Verse</span>
              </span>
              <span className="text-[10px] text-center tracking-widest font-medium uppercase text-gray-400 -mt-1 block">
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
                className="w-full pl-4 pr-10 py-2.5 rounded-full bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-gray-500 text-white transition-all input-glow"
              />
              <button type="submit" className="absolute right-3.5 top-3 text-gray-400 hover:text-white transition-colors">
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Icons navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Desktop Categories Links */}
            <nav className="hidden lg:flex items-center gap-6 mr-4">
              {categories.map((cat) => (
                <Magnetic key={cat.name} strength={0.5}>
                  <NextLink
                    href={cat.path}
                    className="group relative text-sm font-semibold text-gray-400 hover:text-gold transition-colors cursor-interactive"
                  >
                    {cat.name}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-400 to-gold group-hover:w-full transition-all duration-300 rounded-full" />
                  </NextLink>
                </Magnetic>
              ))}
            </nav>

            {/* Wishlist */}
            <NextLink href="/profile?tab=wishlist" className="relative p-2.5 text-gray-400 hover:text-gold hover:bg-white/10 rounded-full transition-all">
              <FiHeart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-black/40 animate-bounce-slow">
                  {wishlistItems.length}
                </span>
              )}
            </NextLink>

            {/* Cart */}
            <NextLink href="/cart" className="relative p-2.5 text-gray-400 hover:text-gold hover:bg-white/10 rounded-full transition-all">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-light text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-black/40">
                  {cartCount}
                </span>
              )}
            </NextLink>

            {/* User Access */}
            {user ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                  <FiUser size={20} />
                  <span className="text-xs font-semibold max-w-[80px] truncate">{user.name || 'Profile'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 glass-dark-premium rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 translate-y-1 group-hover:translate-y-0 border border-white/5">
                  <div className="px-4 py-2.5 border-b border-white/5">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user.name || user.phone}</p>
                  </div>
                  <NextLink href={user.role === 'admin' ? '/admin/dashboard' : '/profile'} className="block px-4 py-2.5 text-sm text-gray-400 hover:bg-white/10 hover:text-gold font-medium">
                    {user.role === 'admin' ? 'Admin Dashboard' : 'My Account'}
                  </NextLink>
                  <NextLink href="/profile?tab=orders" className="block px-4 py-2.5 text-sm text-gray-400 hover:bg-white/10 hover:text-gold font-medium">
                    Order History
                  </NextLink>
                  <button onClick={logout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/20 font-semibold border-t border-white/5">
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Magnetic strength={0.5}>
                <NextLink href="/login" className="btn-premium hidden md:flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary-light transition-all cursor-interactive">
                  <FiUser size={16} />
                  <span>Login</span>
                </NextLink>
              </Magnetic>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0c0813]/95 text-white px-4 py-3 space-y-3 shadow-inner">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-white"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
              <FiSearch size={16} />
            </button>
          </form>
          <div className="grid grid-cols-2 gap-2 pb-2">
            {categories.map((cat) => (
              <NextLink
                key={cat.name}
                href={cat.path}
                onClick={() => setMenuOpen(false)}
                className="block text-center py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-sm font-semibold text-gray-400 transition-colors"
              >
                {cat.name}
              </NextLink>
            ))}
          </div>
          {user ? (
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <NextLink
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white"
              >
                <FiUser size={18} /> My Profile ({user.name || user.phone})
              </NextLink>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-sm font-bold text-red-400 hover:text-red-600 flex items-center gap-1"
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
