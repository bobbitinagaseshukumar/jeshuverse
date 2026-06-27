'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
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
    <div className="py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 px-4">
        <span className="text-amber-600 font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-2 block animate-pulse">
          Shop By Department
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-purple-950 tracking-tight">
          Curated Fashion Collections
        </h2>
        <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((cat) => (
          <NextLink
            key={cat._id || cat.id}
            href={`/category/${cat.slug}`}
            className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-purple-100 hover:border-purple-200 transition-all duration-300 block hover-3d"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full zoom-container">
              <img
                src={cat.image || '/placeholder-category.png'}
                alt={cat.name}
                className="w-full h-full object-cover object-top"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-gold-light text-xs font-bold uppercase tracking-wider mb-1 block">
                Featured Department
              </span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                {cat.name}
              </h3>
              
              {/* Slide up link text */}
              <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span className="border-b border-white">Explore Shop</span>
                <span>→</span>
              </div>
            </div>
            
            {/* Elegant gold border on card hover */}
            <div className="absolute inset-3 border border-gold/0 group-hover:border-gold/30 rounded-xl transition-all duration-300 pointer-events-none" />
          </NextLink>
        ))}
      </div>
    </div>
  );
}
