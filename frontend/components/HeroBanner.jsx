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
    slide1: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=80",
    slide2: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80",
    slide3: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1400&q=80",
  });

  useEffect(() => {
    const fetchPublicSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/settings/public`);
        setSlideImages({
          slide1: res.data.slide1Image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=80",
          slide2: res.data.slide2Image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80",
          slide3: res.data.slide3Image || "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1400&q=80",
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
      ctaText: "Shop Jewellery",
      ctaLink: "/category/jewellery",
      align: "left"
    },
    {
      title: "Festive Women's Wardrobe",
      subtitle: "ELEGANT SAREES & SALWARS",
      tagline: "Stunning silk sarees, designer lehengas, and daily wear cotton salwar kameez sets.",
      image: slideImages.slide2,
      ctaText: "Explore Sarees",
      ctaLink: "/category/women-wear",
      align: "right"
    },
    {
      title: "Men's Premium Ethnic Wear",
      subtitle: "ROYAL KURTA SETS & BLAZERS",
      tagline: "Classic linen Nehru jacket kurtas and premium blazers custom-crafted for special occasions.",
      image: slideImages.slide3,
      ctaText: "Shop Men's Wear",
      ctaLink: "/category/men-wear",
      align: "left"
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
    <section className="relative w-full h-[52vh] sm:h-[65vh] md:h-[80vh] bg-purple-950 overflow-hidden">
      
      {/* Floating cinematic particles overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-gold/60"
            style={{
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
            }}
            animate={{ y: [0, -40, 0], opacity: [0, 0.9, 0], scale: [0.6, 1.3, 0.6] }}
            transition={{ duration: 5 + (i % 5), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          />
        ))}
      </div>

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
          {/* Background Image */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slides[currentSlide].image})` }}>
            {/* Elegant dark purple and gold gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/85 to-transparent md:bg-gradient-to-r md:from-primary-dark/90 md:via-primary-dark/65 md:to-transparent" />
          </div>

          {/* Caption Container */}
          <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className={`max-w-xl text-left ${slides[currentSlide].align === 'right' ? 'md:ml-auto' : ''}`}>
              
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-gold font-extrabold text-[10px] sm:text-sm tracking-widest uppercase mb-1.5 sm:mb-3 block"
              >
                {slides[currentSlide].subtitle}
              </motion.span>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-display font-extrabold text-2xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight"
              >
                {slides[currentSlide].title}
              </motion.h1>

              <motion.p
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-2 sm:mt-4 text-purple-200 text-xs sm:text-base lg:text-lg font-medium leading-relaxed"
              >
                {slides[currentSlide].tagline}
              </motion.p>

              {/* Call to action */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-5 sm:mt-8 flex items-center gap-4"
              >
                <NextLink
                  href={slides[currentSlide].ctaLink}
                  className="btn-premium inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gold hover:bg-gold-light text-primary-dark font-extrabold text-xs sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all cursor-interactive"
                >
                  <span>{slides[currentSlide].ctaText}</span>
                  <FiArrowRight size={14} />
                </NextLink>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors hidden sm:block z-20"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors hidden sm:block z-20"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Bullet Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              currentSlide === index ? 'bg-gold w-8' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

    </section>
  );
}
