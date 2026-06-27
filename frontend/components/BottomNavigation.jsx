'use client';

import React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiHome, FiGrid, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';

export default function BottomNavigation() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();

  // Helper to determine if path is active
  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { label: 'Home', path: '/', icon: FiHome },
    { label: 'Shop', path: '/category/all', icon: FiGrid },
    { 
      label: 'Wishlist', 
      path: '/profile?tab=wishlist', 
      icon: FiHeart, 
      badge: wishlistItems.length 
    },
    { 
      label: 'Cart', 
      path: '/cart', 
      icon: FiShoppingCart, 
      badge: cartCount 
    },
    { label: 'Profile', path: '/profile', icon: FiUser }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 shadow-[0_-4px_12px_rgba(88,28,135,0.08)] py-2 px-2 z-50 flex items-center justify-around">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const active = isActive(item.path);
        
        return (
          <NextLink 
            key={item.label} 
            href={item.path}
            className={`flex flex-col items-center justify-center flex-1 relative py-1 transition-all ${
              active 
                ? 'text-primary scale-110 font-bold' 
                : 'text-purple-400 hover:text-primary'
            }`}
          >
            <div className="relative">
              <IconComponent size={20} className={active ? 'stroke-[2.5px]' : ''} />
              
              {/* Badges */}
              {item.badge !== undefined && item.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] tracking-wide mt-1 uppercase font-medium">
              {item.label}
            </span>
            
            {/* Tiny Indicator Dot */}
            {active && (
              <span className="absolute bottom-0 w-1 h-1 rounded-full bg-amber-500" />
            )}
          </NextLink>
        );
      })}
    </div>
  );
}
