'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../utils/api';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching dynamic categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Dynamic Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <span className="text-shine font-black text-xs tracking-widest uppercase mb-2 block">
          Elite Departments
        </span>
        <h2 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight drop-shadow-lg">
          Browse Premium Collections
        </h2>
        <div className="luxury-divider" />
      </div>

      {/* Futuristic Glass Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
        {categories.map((cat, i) => (
          <NextLink
            key={cat._id || cat.id}
            href={`/category/${cat.slug}`}
            className="group relative h-80 rounded-3xl overflow-hidden shadow-lg border border-white/10 transition-all duration-500 block hover-3d"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Image container with parallax zoom */}
            <div className="absolute inset-0 w-full h-full zoom-container">
              <img
                src={cat.image || '/placeholder-category.png'}
                alt={cat.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 opacity-80 group-hover:opacity-95"
              />
              {/* Dynamic Aurora Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 transition-opacity duration-300" />
            </div>

            {/* Glowing active outline */}
            <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 rounded-3xl transition-all duration-500 pointer-events-none z-20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-gold/0 to-white/0 group-hover:from-purple-500/10 group-hover:via-gold/5 group-hover:to-white/5 transition-all duration-500 z-10 pointer-events-none" />

            {/* Content Details */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end z-20" style={{ transform: 'translateZ(20px)' }}>
              <span className="text-gold text-[10px] font-black uppercase tracking-widest mb-1">
                Luxury Segment
              </span>
              <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight leading-snug drop-shadow-md">
                {cat.name}
              </h3>
              
              {/* Animated link reveal */}
              <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-gray-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span className="border-b border-gray-400/50 pb-0.5">Explore Catalog</span>
                <span>→</span>
              </div>
            </div>
          </NextLink>
        ))}
      </div>
    </div>
  );
}
