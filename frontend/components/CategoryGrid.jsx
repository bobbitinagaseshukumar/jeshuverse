'use client';

import React from 'react';
import NextLink from 'next/link';

export default function CategoryGrid() {
  const categories = [
    {
      name: "Women's Wear",
      slug: "women-wear",
      count: "Sarees, Kurtas & Salwars",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Men's Wear",
      slug: "men-wear",
      count: "Kurtas, Blazers & Jackets",
      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Kids Wear",
      slug: "kids-wear",
      count: "Frocks, Gowns & Shirts",
      image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Jewellery",
      slug: "jewellery",
      count: "Kundan, Choker & Rings",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <div className="py-12 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 px-4">
        <span className="text-amber-600 font-extrabold text-xs sm:text-sm tracking-widest uppercase mb-2 block">
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
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-purple-100 hover:border-purple-200 transition-all duration-300 block"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full zoom-container">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-top"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-gold-light text-xs font-bold uppercase tracking-wider mb-1 block">
                {cat.count}
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
