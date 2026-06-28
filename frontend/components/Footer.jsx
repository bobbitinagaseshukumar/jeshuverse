'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiYoutube, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';
import { API_URL } from '../utils/api';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const [settings, setSettings] = useState({
    storeAddress: 'Banumukkala, Nandyal',
    whatsappNumber: '+919999999999',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/settings/public`);
        setSettings(response.data);
      } catch (err) {
        console.warn('Error loading footer settings:', err.message || err);
      }
    };
    fetchSettings();
  }, []);

  // Hide on admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0a0a0a] text-gray-300 border-t border-white/10 pt-12 pb-24 md:pb-12 mt-16 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <NextLink href="/" className="inline-block">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                Jeshu<span className="text-gold">Verse</span>
              </span>
              <span className="text-[10px] tracking-widest font-medium uppercase text-gold-light block -mt-1">
                Fashion For Everyone
              </span>
            </NextLink>
            <p className="text-sm text-gray-500 leading-relaxed">
              Step into premium fashion with JeshuVerse. Explore our curated collections of ethnic women's wear, classic men's wear, cute kids attire, and royal 24K gold plated jewellery.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="p-2 bg-white/10 hover:bg-gold hover:text-primary-dark rounded-full text-white transition-all">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-gold hover:text-primary-dark rounded-full text-white transition-all">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-gold hover:text-primary-dark rounded-full text-white transition-all">
                <FiYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h3 className="text-white font-bold text-base tracking-wider uppercase border-b border-gold/30 pb-2.5 mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <NextLink href="/category/all" className="hover:text-gold transition-colors block">
                  All Products
                </NextLink>
              </li>
              <li>
                <NextLink href="/category/all?sort=latest" className="hover:text-gold transition-colors block">
                  New Arrivals
                </NextLink>
              </li>
              <li>
                <NextLink href="/category/women-wear" className="hover:text-gold transition-colors block">
                  Women's Fashion
                </NextLink>
              </li>
              <li>
                <NextLink href="/category/men-wear" className="hover:text-gold transition-colors block">
                  Men's Fashion
                </NextLink>
              </li>
              <li>
                <NextLink href="/category/kids-wear" className="hover:text-gold transition-colors block">
                  Kids Collection
                </NextLink>
              </li>
              <li>
                <NextLink href="/category/jewellery" className="hover:text-gold transition-colors block">
                  Royal Jewellery
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="text-white font-bold text-base tracking-wider uppercase border-b border-gold/30 pb-2.5 mb-4">
              Customer Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <NextLink href="/profile" className="hover:text-gold transition-colors block">
                  My Profile
                </NextLink>
              </li>
              <li>
                <NextLink href="/profile?tab=orders" className="hover:text-gold transition-colors block">
                  Track Orders
                </NextLink>
              </li>
              <li>
                <NextLink href="/cart" className="hover:text-gold transition-colors block">
                  View Cart
                </NextLink>
              </li>
              <li>
                <NextLink href="/admin/login" className="text-gray-600 hover:text-gold transition-colors block font-semibold">
                  Admin Control Panel
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-white font-bold text-base tracking-wider uppercase border-b border-gold/30 pb-2.5 mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-gold shrink-0 mt-1" size={16} />
                <span className="text-gray-500">
                  {settings.storeAddress || 'Banumukkala, Nandyal'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-gold shrink-0" size={16} />
                <a href={`tel:${(settings.whatsappNumber || '').replace(/\D/g, '')}`} className="text-gray-500 hover:text-gold transition-colors">
                  {settings.whatsappNumber || '+91 99999 99999'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-gold shrink-0" size={16} />
                <a href="mailto:support@jeshuverse.com" className="text-gray-500 hover:text-gold transition-colors">
                  support@jeshuverse.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMessageSquare className="text-gold shrink-0" size={16} />
                <a 
                  href={`https://wa.me/${(() => {
                    let num = (settings.whatsappNumber || '').replace(/\D/g, '');
                    if (num.length === 10) num = '91' + num;
                    return num;
                  })()}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-500 hover:text-gold transition-colors font-semibold flex items-center gap-1"
                >
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 mt-12 pt-6 text-center text-xs text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} JeshuVerse Store. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 border border-white/10 rounded text-[10px] uppercase font-bold text-gray-600">BHIM UPI</span>
            <span className="px-2 py-0.5 border border-white/10 rounded text-[10px] uppercase font-bold text-gray-600">PhonePe</span>
            <span className="px-2 py-0.5 border border-white/10 rounded text-[10px] uppercase font-bold text-gray-600">WhatsApp Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
