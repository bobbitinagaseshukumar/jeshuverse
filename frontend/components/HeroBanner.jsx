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
        console.error('Error fetching hero banner settings:', err);
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
      ctaText: "Book Jewellery",
      ctaLink: "/category/jewellery",
      align: "left",
      ticketBadge: "NOW SHOWING • U/A 24K GOLD"
    },
    {
      title: "Festive Women's Wardrobe",
      subtitle: "ELEGANT SAREES & SALWARS",
      tagline: "Stunning silk sarees, designer lehengas, and daily wear cotton salwar kameez sets.",
      image: slideImages.slide2,
      ctaText: "Explore Release",
      ctaLink: "/category/women-wear",
      align: "right",
      ticketBadge: "POPULAR CHOICE • U SILK BRAND"
    },
    {
      title: "Men's Premium Ethnic Wear",
      subtitle: "ROYAL KURTA SETS & BLAZERS",
      tagline: "Classic linen Nehru jacket kurtas and premium blazers custom-crafted for special occasions.",
      image: slideImages.slide3,
      ctaText: "View Premiere",
      ctaLink: "/category/men-wear",
      align: "left",
      ticketBadge: "PREMIER RELEASE • U LINEN EXCLUSIVE"
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
    <section className="relative w-full h-[60vh] sm:h-[75vh] md:h-[90vh] bg-purple-950/80 overflow-hidden flex items-center justify-center py-4 px-2 md:px-8 border-b border-white/5">
      
      {/* 3D Cinema Projector Lens Spot Light Beam */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-72 opacity-25 blur-3xl pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at top, rgba(234, 179, 8, 0.6) 0%, transparent 75%)' }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-500/10 to-transparent blur-2xl pointer-events-none z-10" />

      {/* Floating particles inside theater beam */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-gold/50"
            style={{
              width: 2 + (i % 3) * 2,
              height: 2 + (i % 3) * 2,
              left: `${15 + (i * 47) % 70}%`,
              top: `${(i * 37) % 100}%`,
            }}
            animate={{ y: [0, -60, 0], opacity: [0, 0.8, 0], scale: [0.7, 1.4, 0.7] }}
            transition={{ duration: 7 + (i % 6), repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* 3D Curved Cinema Screen Frame */}
      <div 
        className="relative w-full h-full max-w-7xl mx-auto overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)] border border-white/10 bg-black"
        style={{
          transform: 'perspective(1400px) rotateX(3.5deg) scale(0.96)',
          borderRadius: '32px',
          transformStyle: 'preserve-3d'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Media */}
            <div className="absolute inset-0 bg-cover bg-center w-full h-full">
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
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="absolute inset-0 bg-cover bg-center w-full h-full" 
                  style={{ backgroundImage: `url(${slides[currentSlide].image})` }} 
                />
              )}
              {/* Cinematic vignetting and gradient side shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent" />
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
              
              {/* Projected Light sweep */}
              <motion.div 
                className="absolute inset-0 opacity-15" 
                style={{ background: 'linear-gradient(110deg, transparent 35%, rgba(234,179,8,0.4) 50%, transparent 65%)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
            </div>

            {/* Content Details (Poster-style info overlay) */}
            <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex items-center">
              <div className={`max-w-xl text-left ${slides[currentSlide].align === 'right' ? 'md:ml-auto' : ''}`}>
                
                {/* Cinema ticket rating stub badge */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/45 text-gold text-[9px] font-black tracking-widest uppercase mb-4 shadow-sm"
                >
                  <span className="animate-pulse">🎟️</span>
                  <span>{slides[currentSlide].ticketBadge}</span>
                </motion.div>

                <motion.span
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="text-purple-300 font-extrabold text-[10px] sm:text-xs tracking-widest uppercase mb-1 block"
                >
                  {slides[currentSlide].subtitle}
                </motion.span>

                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                  className="mt-3 sm:mt-5 text-purple-100/90 text-xs sm:text-base font-semibold leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                >
                  {slides[currentSlide].tagline}
                </motion.p>

                {/* Call to action */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="mt-6 sm:mt-8 flex items-center gap-4"
                >
                  <NextLink
                    href={slides[currentSlide].ctaLink}
                    className="btn-premium btn-ripple inline-flex items-center gap-2.5 px-6 py-3 sm:px-9 sm:py-4 bg-gold hover:bg-gold-light text-primary-dark font-black text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/50 transition-all cursor-interactive"
                  >
                    <span>{slides[currentSlide].ctaText}</span>
                    <FiArrowRight size={16} />
                  </NextLink>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-white/20 text-white border border-white/5 rounded-full backdrop-blur-sm transition-all hidden sm:block z-20 hover:scale-110 active:scale-95"
        >
          <FiChevronLeft size={22} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-white/20 text-white border border-white/5 rounded-full backdrop-blur-sm transition-all hidden sm:block z-20 hover:scale-110 active:scale-95"
        >
          <FiChevronRight size={22} />
        </button>

        {/* Bullet Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-500 ${currentSlide === index ? 'bg-gold w-10 h-2.5 shadow-md shadow-gold/50' : 'bg-white/30 w-2.5 h-2.5 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
