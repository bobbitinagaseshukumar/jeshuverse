'use client';

import React from 'react';
import NextLink from 'next/link';
import { useWishlist } from '../context/WishlistContext';
import { FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Tilt3D from './Tilt3D';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice : product.price;
  const originalPrice = product.price;

  // Calculate discount percentage
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - activePrice) / originalPrice) * 100) 
    : 0;

  const isStarred = isInWishlist(product._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Tilt3D max={9} scale={1.03} className="h-full rounded-2xl animate-card-float card-reflection relative">
      <div className="group relative bg-[#181127] rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(234,179,8,0.1)] transition-all duration-500 flex flex-col h-full relative" style={{ transformStyle: 'preserve-3d' }}>
      
        {/* Ticket Stub Side Punch Holes */}
        <div className="absolute left-[-8px] top-[58%] -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-[#0b0813] border-r border-white/15 z-20" />
        <div className="absolute right-[-8px] top-[58%] -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-[#0b0813] border-l border-white/15 z-20" />
        
        {/* Ticket Perforated Tear Line */}
        <div className="absolute left-3 right-3 top-[58%] -translate-y-1/2 border-t border-dashed border-white/15 pointer-events-none z-10" />

        {/* Product Image Wrapper */}
        <NextLink href={`/product/${product._id}`} className="block relative aspect-[4/5] bg-purple-950/20 overflow-hidden">
          {/* Zoom scale hover class */}
          <div className="w-full h-full zoom-container">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 opacity-90 group-hover:opacity-100"
              loading="lazy"
            />
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full border border-white/5 shadow-sm hover:shadow transition-all z-10"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={{ scale: isStarred ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <FiHeart 
                size={16} 
                className={isStarred ? 'fill-red-500 stroke-red-500' : 'stroke-white'} 
              />
            </motion.div>
          </button>

          {/* Discount Badge / Ticket Rating */}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-gold text-primary-dark font-black text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded shadow-sm border border-gold/30">
              {discountPercent}% OFF
            </span>
          )}

          {/* Out of Stock Overlay */}
          {product.stockQuantity <= 0 && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-red-600 text-white font-extrabold text-xs tracking-widest uppercase px-3 py-1.5 rounded shadow-lg">
                SOLD OUT
              </span>
            </div>
          )}
        </NextLink>

        {/* Product Information */}
        <div className="p-4 pt-6 flex flex-col flex-1 z-10">
          <span className="text-[9px] font-black text-gold uppercase tracking-widest mb-1.5 block">
            {product.category || 'Release'}
          </span>
          
          <NextLink href={`/product/${product._id}`} className="block flex-1 mb-2">
            <h3 className="font-display font-extrabold text-sm sm:text-base text-white hover:text-gold leading-snug line-clamp-2 transition-colors">
              {product.name}
            </h3>
          </NextLink>

          {/* Pricing & Booking Row */}
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-base sm:text-lg text-white">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-purple-300/50 line-through font-bold">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            {/* Direct Ticket Link Icon */}
            <span className="text-[9px] font-black text-purple-400 uppercase tracking-wider hidden sm:block bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
              U/A
            </span>
          </div>

          {/* Add to Cart shortcut button for desktop */}
          <div className="mt-4 pt-1 hidden group-hover:block transition-all duration-300">
            <NextLink
              href={`/product/${product._id}`}
              className="w-full text-center block bg-gold hover:bg-gold-light text-primary-dark border-0 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 btn-premium btn-ripple shadow-md shadow-gold/20"
            >
              Get Ticket
            </NextLink>
          </div>
        </div>
      </div>
    </Tilt3D>
  );
}
