'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import { API_URL } from '../utils/api';

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideImages, setSlideImages] = useState({
    slide1: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1600&q=80",
    slide2: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=1600&q=80",
    slide3: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1600&q=80",
  });

  useEffect(() => {
    const fetchPublicSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/settings/public`);
        setSlideImages({
          slide1: res.data.slide1Image || "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1600&q=80",
          slide2: res.data.slide2Image || "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=1600&q=80",
          slide3: res.data.slide3Image || "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1600&q=80",
        });
      } catch (err) {
        console.warn('Error fetching hero banner settings:', err.message || err);
      }
    };
    fetchPublicSettings();
  }, []);

  const slides = [
    {
      title: "Royal Jewellery Collection",
      subtitle: "EXQUISITE HANDCRAFTED DESIGNS",
      tagline: "Unveil royalty with our 24K Gold Plated Kundan, German silver, and temple choker sets.",
      image: slideImages.slide1,
      ctaText: "Shop Jewellery",
      ctaLink: "/category/jewellery",
    },
    {
      title: "Festive Women's Wardrobe",
      subtitle: "ELEGANT SAREES & SALWARS",
      tagline: "Stunning silk sarees, designer lehengas, and daily wear cotton salwar kameez sets.",
      image: slideImages.slide2,
      ctaText: "Explore Sarees",
      ctaLink: "/category/women-wear",
    },
    {
      title: "Men's Premium Ethnic Wear",
      subtitle: "ROYAL KURTA SETS & BLAZERS",
      tagline: "Classic linen Nehru jacket kurtas and premium blazers custom-crafted for special occasions.",
      image: slideImages.slide3,
      ctaText: "Shop Men's Wear",
      ctaLink: "/category/men-wear",
    }
  ];

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[60vh] sm:h-[75vh] md:h-[90vh] bg-black overflow-hidden">
      
      {/* Slide Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Media */}
          <div className="absolute inset-0 w-full h-full">
            {slides[currentSlide].image && (
              slides[currentSlide].image.toLowerCase().endsWith('.mp4') || 
              slides[currentSlide].image.toLowerCase().endsWith('.webm') || 
              slides[currentSlide].image.toLowerCase().endsWith('.mov')
            ) ? (
              <video
                src={slides[currentSlide].image}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            ) : (
              <div 
                className="absolute inset-0 bg-cover bg-center w-full h-full opacity-30" 
                style={{ backgroundImage: `url(${slides[currentSlide].image})` }} 
              />
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            
            {/* Animated gold light beam sweep */}
            <motion.div 
              className="absolute inset-0 opacity-15" 
              style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(234,179,8,0.25) 50%, transparent 60%)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
            />
          </div>

          {/* Centered Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
            
            {/* Gold decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent mb-6"
            />

            {/* Subtitle */}
            <motion.span
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-gold font-medium text-[11px] sm:text-sm tracking-[0.3em] uppercase mb-4 block"
            >
              {slides[currentSlide].subtitle}
            </motion.span>

            {/* Main Title — elegant serif */}
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display font-bold text-3xl sm:text-5xl lg:text-7xl text-white tracking-tight leading-tight max-w-4xl"
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Gold underline decorator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-16 h-[3px] bg-gradient-to-r from-gold-dark via-gold to-gold-dark mt-5 rounded-full"
            />

            {/* Tagline */}
            <motion.p
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-5 text-gray-400 text-xs sm:text-base lg:text-lg font-light leading-relaxed max-w-xl"
            >
              {slides[currentSlide].tagline}
            </motion.p>

            {/* Call to action */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 sm:mt-10"
            >
              <NextLink
                href={slides[currentSlide].ctaLink}
                className="btn-premium btn-ripple inline-flex items-center gap-2.5 px-8 py-3 sm:px-10 sm:py-4 bg-gold hover:bg-gold-light text-black font-bold text-xs sm:text-sm tracking-wider uppercase rounded-none shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/40 transition-all"
              >
                <span>{slides[currentSlide].ctaText}</span>
                <FiArrowRight size={16} />
              </NextLink>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-10 sm:mt-14 flex items-center gap-8 sm:gap-12"
            >
              <div className="text-center">
                <span className="block text-gold font-display font-bold text-xl sm:text-2xl">500+</span>
                <span className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">Products</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <span className="block text-gold font-display font-bold text-xl sm:text-2xl">1000+</span>
                <span className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">Customers</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <span className="block text-gold font-display font-bold text-xl sm:text-2xl">6</span>
                <span className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">Categories</span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-gold/20 text-white hover:text-gold border border-white/10 hover:border-gold/30 rounded-none transition-all hidden sm:block z-20"
      >
        <FiChevronLeft size={22} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/40 hover:bg-gold/20 text-white hover:text-gold border border-white/10 hover:border-gold/30 rounded-none transition-all hidden sm:block z-20"
      >
        <FiChevronRight size={22} />
      </button>

      {/* Bullet Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 ${currentSlide === index ? 'bg-gold w-10 h-1' : 'bg-white/20 w-6 h-1 hover:bg-white/40'}`}
          />
        ))}
      </div>

    </section>
  );
}
