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
    <Tilt3D max={9} scale={1.03} className="h-full rounded-2xl">
      <div className="group relative bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm glow-hover flex flex-col h-full" style={{ transformStyle: 'preserve-3d' }}>
      
      {/* Product Image Wrapper */}
      <NextLink href={`/product/${product._id}`} className="block relative aspect-[4/5] bg-purple-50/50 overflow-hidden">
        {/* Zoom scale hover class */}
        <div className="w-full h-full zoom-container">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700"
            loading="lazy"
          />
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-purple-900 rounded-full shadow-sm hover:shadow transition-all z-10"
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            animate={{ scale: isStarred ? [1, 1.25, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <FiHeart 
              size={18} 
              className={isStarred ? 'fill-red-500 stroke-red-500' : 'stroke-purple-950'} 
            />
          </motion.div>
        </button>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white font-extrabold text-[10px] sm:text-xs tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* Out of Stock Overlay */}
        {product.stockQuantity <= 0 && (
          <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase px-4 py-2 rounded-lg shadow-lg">
              Out Of Stock
            </span>
          </div>
        )}
      </NextLink>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1 block">
          {product.category}
        </span>
        
        <NextLink href={`/product/${product._id}`} className="block flex-1">
          <h3 className="font-display font-bold text-sm sm:text-base text-purple-950 hover:text-primary leading-snug line-clamp-2 transition-colors">
            {product.name}
          </h3>
        </NextLink>

        {/* Pricing Row */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display font-extrabold text-base sm:text-lg text-primary">
            ₹{activePrice.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="text-xs text-purple-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Add to Cart shortcut button for desktop */}
        <div className="mt-4 pt-1 hidden group-hover:block transition-all duration-300">
          <NextLink
            href={`/product/${product._id}`}
            className="w-full text-center block bg-purple-50 hover:bg-primary text-primary hover:text-white border border-purple-200 hover:border-transparent py-2 rounded-xl text-xs font-bold transition-all duration-300"
          >
            View Details
          </NextLink>
        </div>
      </div>
      </div>
    </Tilt3D>
  );
}
